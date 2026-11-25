import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFeed, checkedUrl, verifyInstaller, readLimited, PublicSession, resolveRelease } from '../scripts/feed.mjs';

const url = 'https://internal-api-drive-stream.feishu.cn/space/api/download/file?token=abc&mount_point=docx_file';
const block = text => `<div data-block-type="text" data-record-id="a"><span>${text}</span></div>`;
function exe() { const b = Buffer.alloc(512); b.write('MZ'); b.writeUInt32LE(128, 0x3c); b.write('PE\0\0', 128, 'ascii'); b.writeUInt16LE(0x8664, 132); return b; }

test('reads a rich-text installer anchor and Feishu note with entity decoding', () => {
  const feed = parseFeed(block(`安装器：<a href="${url.replace('&', '&amp;')}">下载安装器</a>`) + block('备注：最新版 1.85'));
  assert.equal(feed.installer, url); assert.equal(feed.note, '最新版 1.85');
});
test('supports split label spans, escaped unicode and slashes', () => {
  const html = block(`<b>安</b>装器： <a href="${url}">下载</a>`).replaceAll('：', '\\uFF1A').replaceAll('/', '\\/');
  assert.equal(parseFeed(html).installer, url);
});
test('Feishu data-href metadata never overrides the actual href attribute', () => {
  assert.equal(parseFeed(block(`安装器：<span data-inline-wrapper="true"><a class="link" href="${url}" data-href="${encodeURIComponent(url)}"><span>下载</span></a></span>`)).installer, url);
});
test('an empty installer field never steals the next C-drive or runtime URL', () => {
  assert.throws(() => parseFeed(block('安装器：') + block(`C盘：${url}`)), { code: 'MISSING_INSTALLER' });
  assert.throws(() => parseFeed(`安装器：\nVC-redist：${url}`), { code: 'MISSING_INSTALLER' });
});
test('refuses conflicting installer links and accepts repeated identical ones', () => {
  assert.throws(() => parseFeed(block(`安装器：${url}`) + block(`安装器：${url}2`)), { code: 'AMBIGUOUS_INSTALLER' });
  assert.equal(parseFeed(block(`安装器：${url}`) + block(`安装器：${url}`)).installer, url);
});
test('download URLs require allowed HTTPS hosts without credentials or a custom port', () => {
  assert.equal(checkedUrl(url, ['*.feishu.cn']).hostname, 'internal-api-drive-stream.feishu.cn');
  for (const value of ['http://my.feishu.cn/a', 'https://evilfeishu.cn/a', 'https://my.feishu.cn.evil.test/a', 'https://127.0.0.1/a', 'https://user:pass@my.feishu.cn/a', 'https://my.feishu.cn:999/a']) {
    assert.throws(() => checkedUrl(value, ['*.feishu.cn']));
  }
});
test('refuses HTML/login responses and malformed or 32-bit executable content', () => {
  assert.equal(verifyInstaller(exe()).length, 64);
  assert.throws(() => verifyInstaller(exe(), 'text/html'), { code: 'NOT_INSTALLER' });
  assert.throws(() => verifyInstaller(Buffer.from('<html>login</html>')), { code: 'NOT_INSTALLER' });
  const bad = exe(); bad.writeUInt16LE(0x14c, 132);
  assert.throws(() => verifyInstaller(bad), { code: 'NOT_INSTALLER' });
});
test('resource reader enforces a size limit for missing or misleading content length', async () => {
  await assert.rejects(readLimited(new Response(Buffer.alloc(100)), 50), { code: 'TOO_LARGE' });
  assert.equal((await readLimited(new Response('hello'), 8)).toString(), 'hello');
});
test('redirects are checked before visiting a different host', async () => {
  let calls = 0;
  const session = new PublicSession(async () => { calls++; return new Response(null, { status: 302, headers: { Location: 'https://untrusted.example/file' } }); });
  await assert.rejects(session.open(url, { hosts: ['*.feishu.cn'] }), { code: 'UNTRUSTED_HOST' });
  assert.equal(calls, 1);
});
test('public anonymous session retains permitted cookies and page referer without browser login', async () => {
  const seen = [];
  const session = new PublicSession(async (request, options) => {
    seen.push({ url: String(request), ...options });
    return seen.length === 1
      ? new Response('page', { headers: { 'Set-Cookie': 'public_access=allowed; Domain=.feishu.cn; Path=/; Secure' } })
      : new Response(exe());
  });
  await session.open('https://my.feishu.cn/wiki/demo', { hosts: ['*.feishu.cn'] });
  await session.open(url, { hosts: ['*.feishu.cn'], referer: 'https://my.feishu.cn/wiki/demo' });
  assert.equal(seen[1].headers.Cookie, 'public_access=allowed');
  assert.equal(seen[1].headers.Referer, 'https://my.feishu.cn/wiki/demo');
});
test('complete public-page to installer flow produces a content-addressed same-site download', async () => {
  let calls = 0;
  const session = new PublicSession(async () => ++calls === 1
    ? new Response(block(`安装器：<a href="${url}">安装器.exe</a>`) + block('备注：最新版 1.85'))
    : new Response(exe(), { headers: { 'Content-Type': 'application/octet-stream' } }));
  const release = await resolveRelease({ feishuPage: 'https://my.feishu.cn/wiki/demo', allowedDownloadHosts: ['*.feishu.cn'], maxInstallerBytes: 1000 }, session);
  assert.equal(release.bytes.length, 512); assert.equal(release.note, '最新版 1.85');
  assert.equal(release.download, `downloads/PidanSetup-${release.sha256.slice(0, 16)}.payload`);
});
test('an empty live-style label fails before requesting any unrelated binary', async () => {
  let calls = 0;
  const session = new PublicSession(async () => { calls++; return new Response(block('安装器：') + block(`NETFramework48：${url}`)); });
  await assert.rejects(resolveRelease({ feishuPage: 'https://my.feishu.cn/wiki/demo', allowedDownloadHosts: ['*.feishu.cn'] }, session), { code: 'MISSING_INSTALLER' });
  assert.equal(calls, 1);
});
