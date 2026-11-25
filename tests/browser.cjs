// Optional visual/integration QA: requires Playwright and an available Chrome browser.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { createHash } = require('node:crypto');

(async () => {
  const artifacts = path.resolve('.artifacts');
  await fs.mkdir(artifacts, { recursive: true });
  const fixture = process.env.PIDAN_INSTALLER_FIXTURE ? await fs.readFile(process.env.PIDAN_INSTALLER_FIXTURE) : Buffer.alloc(512);
  if (!process.env.PIDAN_INSTALLER_FIXTURE) { fixture.write('MZ'); fixture.writeUInt32LE(128, 0x3c); fixture.write('PE\0\0', 128, 'ascii'); fixture.writeUInt16LE(0x8664, 132); }
  const fixtureHash = createHash('sha256').update(fixture).digest('hex');
  let releaseMode = 'unpublished';
  const server = http.createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname.replace(/^\/pidan-demo/, '');
    if (pathname === '/release.json') {
      if (releaseMode === 'error') { response.writeHead(503).end('unavailable'); return; }
      response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      response.end(JSON.stringify(['ready', 'bad-hash', 'long-note'].includes(releaseMode)
        ? { status: 'ready', note: releaseMode === 'long-note' ? '这是一条用于验证换行和遮挡问题的飞书发布备注。'.repeat(15) : '测试发布备注', bytes: fixture.length, sha256: releaseMode === 'bad-hash' ? '0'.repeat(64) : fixtureHash, download: 'downloads/PidanSetup-0123456789abcdef.payload' }
        : { status: 'unpublished', download: null }));
      return;
    }
    if (pathname === '/downloads/PidanSetup-0123456789abcdef.payload') {
      response.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Length': fixture.length }); response.end(fixture); return;
    }
    try {
      const file = path.resolve('public', `.${pathname === '/' ? '/index.html' : pathname}`);
      if (!file.startsWith(path.resolve('public') + path.sep)) { response.writeHead(403).end(); return; }
      const body = await fs.readFile(file);
      const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png' };
      response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); response.end(body);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(4188, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:4188/pidan-demo/';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const results = [];
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1300);
    await page.screenshot({ path: path.join(artifacts, 'desktop-dark.png'), fullPage: true });
    await page.screenshot({ path: path.join(artifacts, 'hero-dark.png') });
    assert.equal(await page.locator('h1').textContent(), '让创作，更顺手。');
    await page.getByRole('status').evaluate(element => { element.dataset.state = 'error'; });
    const darkError = await page.getByRole('status').evaluate(element => getComputedStyle(element).color);
    await page.getByRole('button', { name: '下载 Windows 版' }).click();
    await page.getByRole('status').filter({ hasText: '安装器正在准备中' }).waitFor();
    assert.equal(page.url(), base);
    assert.equal(context.pages().length, 1);
    results.push('未发布安装包时，明确提示并保持当前网页，无飞书跳转。');
    await page.getByRole('button', { name: '切换为浅色外观' }).click();
    const lightError = await page.getByRole('status').evaluate(element => getComputedStyle(element).color);
    assert.notEqual(lightError, darkError);
    await page.getByRole('status').evaluate(element => { delete element.dataset.state; });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifacts, 'desktop-light.png'), fullPage: true });
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    results.push('深浅外观切换、错误提示语义色联动及刷新后的设置保留通过。');
    await page.locator('summary').first().click();
    assert.equal(await page.locator('details').first().getAttribute('open'), '');
    await page.locator('summary').first().click();
    results.push('安装指南展开和关闭通过。');
    for (const width of [320, 375, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
      await page.waitForTimeout(100);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `horizontal overflow at ${width}`);
      const bounds = await page.locator('[data-download]').boundingBox();
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width, `button bounds at ${width}`);
      if (width === 390) await page.screenshot({ path: path.join(artifacts, 'mobile-light.png'), fullPage: true });
    }
    results.push('320/375/390/768/1024/1440 像素布局均无横向溢出，下载按钮可见。');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: '切换为深色外观' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifacts, 'mobile-dark.png'), fullPage: true });
    // Exercise the native browser download with synthetic bytes by default; no executable URL navigation.
    releaseMode = 'ready';
    let downloadCount = 0;
    page.on('download', () => downloadCount++);
    const promised = page.waitForEvent('download');
    await page.getByRole('button', { name: '下载 Windows 版' }).click();
    const download = await promised;
    assert.equal(download.suggestedFilename(), '皮蛋插件安装器.exe');
    await download.saveAs(path.join(artifacts, 'download-fixture.exe'));
    assert.deepEqual(await fs.readFile(path.join(artifacts, 'download-fixture.exe')), fixture);
    assert.equal(context.pages().length, 1);
    assert.equal(new URL(page.url()).hostname, '127.0.0.1');
    results.push('浏览器实际下载链路通过：文件字节正确、中文文件名正确、无新页面／飞书跳转（使用隔离测试文件）。');
    releaseMode = 'bad-hash';
    await page.getByRole('button', { name: '下载 Windows 版' }).click();
    await page.getByRole('status').filter({ hasText: '暂时无法获取安装器' }).waitFor();
    assert.equal(downloadCount, 1);
    results.push('文件 SHA-256 不一致时拒绝保存，下载按钮恢复可用。');
    releaseMode = 'long-note';
    await page.reload({ waitUntil: 'networkidle' });
    const noteBounds = await page.locator('[data-release-note]').boundingBox();
    const feedbackBounds = await page.getByRole('status').boundingBox();
    const exploreBounds = await page.locator('.explore').boundingBox();
    const buttonBounds = await page.locator('[data-download]').boundingBox();
    assert.ok(noteBounds.y + noteBounds.height <= feedbackBounds.y);
    assert.ok(feedbackBounds.y + feedbackBounds.height <= exploreBounds.y);
    assert.ok(Math.abs(buttonBounds.x + buttonBounds.width / 2 - 195) < 1);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    results.push('长飞书备注自动换行并撑开内容，按钮居中、状态文字与下方内容无重叠。');
    releaseMode = 'error';
    await page.getByRole('button', { name: '下载 Windows 版' }).click();
    await page.getByRole('status').filter({ hasText: '暂时无法获取安装器' }).waitFor();
    assert.equal(await page.locator('[data-download]').isEnabled(), true);
    results.push('网络失败提示及重试按钮恢复通过。');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const animation = await page.locator('.orbital-track').evaluate(element => getComputedStyle(element).animationName);
    assert.equal(animation, 'none');
    results.push('减少动态效果模式停用旋转动画。');
    assert.deepEqual(errors, []);
    results.push('浏览器 JavaScript 运行错误为 0。');
    await fs.writeFile(path.join(artifacts, 'browser-results.json'), JSON.stringify({ passed: true, results }, null, 2));
    console.log(results.map(result => `PASS ${result}`).join('\n'));
    await context.close();
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
