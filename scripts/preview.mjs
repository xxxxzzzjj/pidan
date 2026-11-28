import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFile(resolve(root, 'public', name), 'utf8');
const [html, styles, showcaseStyles, theme, app, catalog, showcase] = await Promise.all([
  read('index.html'), read('styles.css'), read('showcase.css'), read('theme.js'),
  read('app.js'), read('tools.js'), read('showcase.js')
]);

// A double-clickable local review artifact. The deployed website remains unchanged.
const localApp = app
  .replace('async function getRelease() {', "async function getRelease() { if (location.protocol === 'file:') return { status: 'unpublished' };")
  .replace('async function download() {', "async function download() { if (location.protocol === 'file:') { feedback.textContent = '这是本地外观预览，正式下载请使用发布后的网站。'; return; }");
// Chromium blocks file: URLs as CSS masks. Embed the small icons in the local artifact.
let localCatalog = catalog;
for (const match of catalog.matchAll(/"icon": "(\.\/assets\/icons\/[^\"]+)"/g)) {
  const extension = match[1].endsWith('.svg') ? 'svg+xml' : 'png';
  const bytes = await readFile(resolve(root, 'public', match[1]));
  localCatalog = localCatalog.replace(JSON.stringify(match[1]), JSON.stringify(`data:image/${extension};base64,${bytes.toString('base64')}`));
}
const previewScript = localCatalog.replaceAll('export const ', 'const ') + '\n' + showcase.replace("import { categories, tools } from './tools.js';", '');
const result = html
  .replace('<head>', '<head>\n  <base href="./public/">')
  .replace('<link rel="stylesheet" href="./styles.css">', `<style>${styles}</style>`)
  .replace('<link rel="stylesheet" href="./showcase.css">', `<style>${showcaseStyles}</style>`)
  .replace('<script src="./theme.js"></script>', `<script>${theme}</script>`)
  .replace('<script type="module" src="./app.js"></script>', `<script type="module">${localApp}</script>`)
  .replace('<script type="module" src="./showcase.js"></script>', `<script type="module">${previewScript}</script>`)
  .replace('class="wordmark" href="./"', 'class="wordmark" href="#download"');
await writeFile(resolve(root, '网站预览.html'), result);
console.log('本地预览已生成：网站预览.html（无需启动服务，图片从 public/assets 读取）');
