import { createHash } from 'node:crypto';

export class FeedError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
function decode(value) {
  return value.replace(/\\u([0-9a-f]{4})/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/\\\//g, '/').replace(/\\"/g, '"')
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/[\u200b-\u200d\ufeff]/g, '');
}
function blockText(block) {
  return decode(block.replace(/<a\b[^>]*?\shref\s*=\s*["']([^"']+)["'][^>]*>/gi, (_, href) => ` ${decode(href)} `)
    .replace(/<br\s*\/?\s*>/gi, '\n').replace(/<[^>]*>/g, ''));
}
export function parseFeed(html) {
  const decoded = decode(html);
  const starts = [...decoded.matchAll(/<div\b[^>]*\bdata-block-type=["'][^"']+["'][^>]*>/gi)];
  const blocks = starts.map((match, i) => blockText(decoded.slice(match.index, starts[i + 1]?.index ?? decoded.length)));
  // SSR rich-text blocks give a firm boundary: an empty label must not take the next paragraph's URL.
  const candidates = [];
  for (const block of blocks) {
    const match = block.match(/安装器\s*[:：]\s*(https:\/\/[^\s"'<>\\]+)/i);
    if (match) candidates.push(match[1]);
  }
  if (!blocks.length) {
    // Plain exports / older payloads: accept a URL adjacent to the label within one line only.
    const match = decoded.match(/安装器[\t ]*[:：][\t ]*(https:\/\/[^\s"'<>\\]+)/i);
    if (match) candidates.push(match[1]);
  }
  const unique = [...new Set(candidates)];
  if (!unique.length) throw new FeedError('MISSING_INSTALLER', '飞书页面“安装器：”后未找到同段下载链接；请填入允许公开下载的安装器链接。');
  if (unique.length !== 1) throw new FeedError('AMBIGUOUS_INSTALLER', '飞书页面有多个不同的“安装器：”链接，请只保留一个。');
  const noteBlock = blocks.find(block => /备注\s*[:：]/.test(block));
  const note = noteBlock ? noteBlock.replace(/^[\s\S]*?备注\s*[:：]/, '').trim().slice(0, 1000)
    : (decoded.match(/备注\s*[:：]\s*([^"<>\r\n]{1,1000})/)?.[1] ?? '').replace(/\\n/g, '\n').trim();
  return { installer: unique[0], note };
}
export function hostAllowed(hostname, patterns) {
  return patterns.some(pattern => pattern.startsWith('*.')
    ? hostname === pattern.slice(2) || hostname.endsWith(pattern.slice(1))
    : hostname === pattern);
}
export function checkedUrl(value, hosts) {
  let url;
  try { url = new URL(value); } catch { throw new FeedError('BAD_URL', '下载链接不是有效网址。'); }
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443') || !hostAllowed(url.hostname, hosts)) {
    throw new FeedError('UNTRUSTED_HOST', '链接使用了未允许的下载域名或协议，请在确认来源后更新站点配置。');
  }
  return url;
}
export class PublicSession {
  constructor(fetcher = fetch) { this.fetcher = fetcher; this.cookies = []; }
  async open(value, { hosts, referer, method = 'GET', body, contentType } = {}) {
    let url = checkedUrl(value, hosts);
    for (let redirects = 0; redirects < 8; redirects++) {
      const headers = { 'User-Agent': 'Mozilla/5.0 PidanDownloadSite/1.0', Accept: '*/*', 'Cache-Control': 'no-cache' };
      const cookies = this.cookies.filter(cookie => (url.hostname === cookie.domain || url.hostname.endsWith(`.${cookie.domain}`)) && url.pathname.startsWith(cookie.path));
      if (cookies.length) headers.Cookie = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
      if (referer) headers.Referer = referer;
      if (contentType) headers['Content-Type'] = contentType;
      const response = await this.fetcher(url, { method, body, headers, redirect: 'manual', signal: AbortSignal.timeout(45000) });
      for (const header of response.headers.getSetCookie?.() ?? []) {
        const [pair, ...attributes] = header.split(';');
        const eq = pair.indexOf('='); if (eq < 1) continue;
        const domainValue = attributes.find(v => /^\s*domain=/i.test(v))?.split('=')[1]?.trim().replace(/^\./, '');
        if (domainValue && !(url.hostname === domainValue || url.hostname.endsWith(`.${domainValue}`))) continue;
        const cookie = { name: pair.slice(0, eq).trim(), value: pair.slice(eq + 1), domain: domainValue || url.hostname,
          path: attributes.find(v => /^\s*path=/i.test(v))?.replace(/^\s*path=/i, '').trim() || '/' };
        this.cookies = this.cookies.filter(old => !(old.name === cookie.name && old.domain === cookie.domain && old.path === cookie.path));
        this.cookies.push(cookie);
      }
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        await response.body?.cancel();
        if (!location) throw new FeedError('BAD_REDIRECT', '下载服务返回了无效重定向。');
        url = checkedUrl(new URL(location, url).href, hosts);
        continue;
      }
      if (!response.ok) { await response.body?.cancel(); throw new FeedError('UPSTREAM_STATUS', `资源服务返回 HTTP ${response.status}；请检查文件公开权限。`); }
      return response;
    }
    throw new FeedError('REDIRECT_LIMIT', '下载服务重定向次数过多。');
  }
}
export async function readLimited(response, maximum) {
  if (Number(response.headers.get('content-length')) > maximum) { await response.body?.cancel(); throw new FeedError('TOO_LARGE', '资源大小超过站点允许上限。'); }
  const chunks = []; let size = 0;
  try {
    for await (const chunk of response.body) {
      size += chunk.length;
      if (size > maximum) throw new FeedError('TOO_LARGE', '资源大小超过站点允许上限。');
      chunks.push(chunk);
    }
  } finally { /* Fetch abort timeout bounds the whole body read. */ }
  return Buffer.concat(chunks);
}
export function verifyInstaller(bytes, contentType = '') {
  if (/text\/|json|xml|html/i.test(contentType)) throw new FeedError('NOT_INSTALLER', '链接返回了网页／权限提示，未发布。请设置为允许公开下载。');
  if (bytes.length < 256 || bytes.toString('ascii', 0, 2) !== 'MZ') throw new FeedError('NOT_INSTALLER', '下载内容不是有效 Windows 安装器。');
  const offset = bytes.readUInt32LE(0x3c);
  if (offset < 64 || offset + 6 > bytes.length || bytes.toString('ascii', offset, offset + 4) !== 'PE\0\0' || bytes.readUInt16LE(offset + 4) !== 0x8664) {
    throw new FeedError('NOT_INSTALLER', '下载内容不是有效的 64 位 Windows PE 文件。');
  }
  return createHash('sha256').update(bytes).digest('hex');
}
export async function resolveRelease(config, session = new PublicSession()) {
  let page = config.feishuPage;
  if (config.followSettingsPage && config.settingsEndpoint) {
    try {
      const endpoint = new URL(config.settingsEndpoint);
      const response = await session.open(endpoint.href, { hosts: [endpoint.hostname], method: 'POST', body: JSON.stringify({ action: 'update.get' }), contentType: 'application/json' });
      const settings = JSON.parse((await readLimited(response, 256 * 1024)).toString('utf8'));
      if (settings.ok && settings.update?.pageUrl) page = checkedUrl(settings.update.pageUrl, ['*.feishu.cn']).href;
    } catch { /* Matches the installer: the public default page remains the fallback. */ }
  }
  checkedUrl(page, ['*.feishu.cn']);
  // Feishu's public SSR can be cached even with no-cache headers; vary the page request.
  const freshPage = new URL(page);
  freshPage.searchParams.set('pidan_sync', Date.now().toString());
  const response = await session.open(freshPage.href, { hosts: ['*.feishu.cn'] });
  const html = (await readLimited(response, 12 * 1024 * 1024)).toString('utf8');
  const feed = parseFeed(html);
  checkedUrl(feed.installer, config.allowedDownloadHosts);
  const installer = await session.open(feed.installer, { hosts: config.allowedDownloadHosts, referer: page });
  const contentType = installer.headers.get('content-type') ?? '';
  if (/text\/|json|xml|html/i.test(contentType)) { await installer.body?.cancel(); throw new FeedError('NOT_INSTALLER', '安装器链接返回网页或权限提示，请开启公开下载。'); }
  const bytes = await readLimited(installer, config.maxInstallerBytes ?? 150 * 1024 * 1024);
  const sha256 = verifyInstaller(bytes, contentType);
  // Transport as opaque data; the webpage saves a verified Blob using the .exe name.
  // This avoids handing an .exe URL to browser download-manager integrations.
  return { bytes, sha256, note: feed.note, download: `downloads/PidanSetup-${sha256.slice(0, 16)}.payload` };
}
