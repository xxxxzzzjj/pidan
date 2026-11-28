// Visual and interaction checks. Requests are fulfilled in the browser; no server is started.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { createHash } = require('node:crypto');

(async () => {
  const root = path.resolve(__dirname, '..');
  const publicDir = path.join(root, 'public');
  const output = path.join(root, '.artifacts', 'showcase');
  await fs.mkdir(output, { recursive: true });
  const { tools, categories } = await import(pathToFileURL(path.join(publicDir, 'tools.js')).href);
  const base = 'https://pidan.test/pidan-demo/';
  const errors = [], missing = [], results = [];
  const fixture = Buffer.alloc(512); fixture.write('MZ');
  const digest = createHash('sha256').update(fixture).digest('hex');
  let releaseMode = 'unpublished';
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true, reducedMotion: 'reduce' });
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.hostname !== 'pidan.test') { missing.push(url.href); await route.abort(); return; }
      const pathname = decodeURIComponent(url.pathname.replace(/^\/pidan-demo\//, ''));
      if (pathname === 'release.json') {
        const release = releaseMode === 'unpublished' ? { status: 'unpublished' } : {
          status: 'ready', download: 'downloads/PidanSetup-0123456789abcdef.payload', bytes: fixture.length,
          note: releaseMode === 'long' ? '发布备注较长时也应完整换行，不遮挡下方的按钮与链接。'.repeat(20) : '测试发布',
          sha256: releaseMode === 'bad' ? '0'.repeat(64) : digest
        };
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(release) }); return;
      }
      if (pathname === 'downloads/PidanSetup-0123456789abcdef.payload') {
        await route.fulfill({ contentType: 'application/octet-stream', body: fixture }); return;
      }
      try {
        const file = path.resolve(publicDir, pathname || 'index.html');
        if (!file.startsWith(publicDir + path.sep)) throw new Error('outside public');
        const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
        await route.fulfill({ contentType: types[path.extname(file)] || 'application/octet-stream', body: await fs.readFile(file) });
      } catch { missing.push(pathname); await route.fulfill({ status: 404, body: 'Not found' }); }
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.tool-card').last().waitFor();
    assert.equal(await page.locator('.tool-card').count(), tools.length);
    assert.equal(tools.length, 62);
    assert.equal(categories.length, 8);
    assert.equal(new Set(tools.map(tool => tool.id)).size, tools.length);
    assert.equal(await page.locator('[data-category]').count(), 9);
    for (const tool of tools) await fs.access(path.join(publicDir, tool.icon));
    results.push('62 个工具默认完整展示；8 类筛选；工具 ID 唯一；所有图标文件存在。');

    for (const category of categories) {
      await page.locator(`[data-category="${category.id}"]`).click();
      assert.equal(await page.locator('.tool-card').count(), tools.filter(tool => tool.category === category.id).length);
    }
    await page.locator('[data-category="all"]').click();
    await page.getByRole('searchbox', { name: '搜索功能' }).fill('二维码');
    assert.equal(await page.locator('.tool-card').count(), 1);
    assert.equal(await page.locator('.tool-card h4').textContent(), '二维');
    await page.getByRole('searchbox').fill('不存在的功能<&>');
    assert.equal(await page.locator('.empty-results').isVisible(), true);
    await page.locator('[data-reset-search]').click();
    assert.equal(await page.locator('.tool-card').count(), tools.length);
    results.push('分类计数、跨名称和用途的关键词搜索、空结果与重置通过。');

    for (const id of ['align', 'size', 'select-same', 'keyhole']) {
      await page.locator(`[data-preview-tool="${id}"]`).click();
      for (const mode of ['light', 'dark']) {
        await page.locator(`[data-mode="${mode}"]`).click();
        for (const color of ['mint', 'blue', 'purple', 'apricot']) {
          await page.locator(`[data-color="${color}"]`).click();
          await page.locator('[data-studio-panel]').evaluate(image => image.decode());
          assert.ok(await page.locator('[data-studio-panel]').evaluate(image => image.naturalWidth > 0));
          assert.equal(await page.locator('.studio').getAttribute('data-preview-mode'), mode);
        }
      }
    }
    results.push('4 个工具 × 2 种模式 × 4 种强调色，32 个界面预览全部成功加载。');

    // Every advertised interface opens; both preview modes load without publishing program code.
    for (const tool of tools) {
      await page.locator(`[data-tool="${tool.id}"]`).click();
      assert.equal(await page.getByRole('dialog').isVisible(), true);
      assert.equal(await page.locator('#detail-title').textContent(), tool.name);
      assert.equal(await page.locator('[data-detail-benefits] li').count(), tool.benefits.length);
      if (tool.panel) {
        for (const mode of ['light', 'dark']) {
          await page.locator(`[data-detail-mode="${mode}"]`).click();
          await page.locator('[data-detail-image]').evaluate(image => image.decode());
        }
      } else assert.equal(await page.locator('.detail-fallback').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('dialog').isVisible(), false);
    }
    results.push('62 项详情逐一打开；58 项工具双模式界面可载入，4 项辅助入口说明可读；Esc 可关闭。');

    await page.locator('[data-preview-tool="align"]').click();
    await page.locator('[data-mode="light"]').click();
    await page.locator('[data-color="mint"]').click();
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(output, 'desktop-dark.png'), fullPage: true });
    await page.locator('.appearance').screenshot({ path: path.join(output, 'interface-dark.png') });
    await page.getByRole('button', { name: '切换为浅色外观' }).click();
    await page.screenshot({ path: path.join(output, 'desktop-light.png'), fullPage: true });
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
      for (const width of [320, 375, 390, 600, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${theme}/${width}`);
        const clipped = await page.locator('.tool-card,.category-filters button,.style-controls button,.site-header a').evaluateAll(elements => elements.filter(element => {
          if (!element.getClientRects().length) return false;
          const rect = element.getBoundingClientRect();
          return rect.left < -1 || rect.right > innerWidth + 1 || element.scrollWidth > element.clientWidth + 1;
        }).map(element => ({ text: element.textContent, width: element.clientWidth, scroll: element.scrollWidth, left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right })));
        assert.deepEqual(clipped, [], `clipped controls ${theme}/${width}`);
        await page.locator('[data-tool="align"]').click();
        const modal = page.getByRole('dialog');
        assert.ok(await modal.evaluate(element => element.scrollWidth <= element.clientWidth + 1));
        await modal.evaluate(element => { element.scrollTop = element.scrollHeight; });
        const bounds = await page.locator('.dialog-close').boundingBox();
        assert.ok(bounds.y >= 0 && bounds.y + bounds.height <= (width < 600 ? 844 : 1000), `close remains visible ${width}`);
        await page.keyboard.press('Escape');
        if (width === 390) {
          await page.evaluate(() => scrollTo(0, 0));
          await page.screenshot({ path: path.join(output, `mobile-${theme}.png`), fullPage: true });
        }
      }
    }
    results.push('深浅两种网站主题 × 7 种宽度（320–1440px）无横向溢出或控件裁切；详情滚到底仍能关闭。');

    await page.setViewportSize({ width: 390, height: 844 });
    releaseMode = 'long';
    await page.reload({ waitUntil: 'networkidle' });
    const note = await page.locator('[data-release-note]').boundingBox();
    const feedback = await page.getByRole('status').boundingBox();
    const explore = await page.locator('.explore').boundingBox();
    assert.ok(note.y + note.height <= feedback.y + 1);
    assert.ok(feedback.y + feedback.height <= explore.y + 1);
    const waiting = page.waitForEvent('download');
    await page.locator('[data-download]').click();
    const download = await waiting;
    assert.equal(download.suggestedFilename(), '皮蛋插件安装器.exe');
    assert.equal(context.pages().length, 1);
    const downloadFile = await download.path();
    assert.deepEqual(await fs.readFile(downloadFile), fixture);
    releaseMode = 'bad';
    await page.locator('[data-download]').click();
    await page.getByRole('status').filter({ hasText: '暂时无法获取安装器' }).waitFor();
    assert.equal(await page.locator('[data-download]').isEnabled(), true);
    results.push('原下载流程回归：长备注不遮挡；合成文件以中文名保存；坏哈希拒绝；不跳转或弹新页。');

    assert.equal(await page.locator('.orbital-track').evaluate(element => getComputedStyle(element).animationName), 'none');
    assert.deepEqual(errors, []);
    assert.deepEqual(missing, []);
    results.push('减少动画模式生效；浏览器脚本异常 0；缺失资源 0；无外网依赖。');
    const localPage = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const localErrors = [];
    localPage.on('pageerror', error => localErrors.push(error.message));
    await localPage.goto(pathToFileURL(path.join(root, '网站预览.html')).href, { waitUntil: 'networkidle' });
    assert.equal(await localPage.locator('.tool-card').count(), tools.length);
    await localPage.locator('[data-color="purple"]').click();
    await localPage.locator('[data-studio-panel]').evaluate(image => image.decode());
    await localPage.locator('[data-tool="size"]').click();
    await localPage.locator('[data-detail-image]').evaluate(image => image.decode());
    await localPage.keyboard.press('Escape');
    assert.equal(await localPage.locator('.showcase-heading h2 br').first().evaluate(element => getComputedStyle(element).display), 'block');
    await localPage.locator('[data-download]').click();
    await localPage.getByRole('status').filter({ hasText: '本地外观预览' }).waitFor();
    assert.deepEqual(localErrors, []);
    await localPage.close();
    results.push('双击 HTML 本地预览通过：无需服务，目录、图片、配色、详情可用；下载明确提示为本地预览。');
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify({ passed: true, results }, null, 2));
    console.log(results.map(result => `PASS ${result}`).join('\n'));
    await context.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
