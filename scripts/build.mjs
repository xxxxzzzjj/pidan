import { cp, mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveRelease } from './feed.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const sync = process.argv.includes('--sync');
const config = JSON.parse(await readFile(resolve(root, 'site.config.json'), 'utf8'));
let release;
if (sync) {
  try {
    // Resolve and verify first: a transient error must never replace a working deployment.
    release = await resolveRelease(config);
  } catch (error) {
    console.error(`[${error.code ?? 'SYNC_FAILED'}] ${error.message}`);
    if (!process.argv.includes('--allow-unpublished')) process.exit(1);
    console.warn('本次明确允许发布无下载文件的预览站。');
  }
}
await mkdir(dist, { recursive: true });
await cp(resolve(root, 'public'), dist, { recursive: true });
if (release) {
  const destination = resolve(dist, release.download);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(`${destination}.part`, release.bytes);
  await rename(`${destination}.part`, destination);
  const metadata = { status: 'ready', note: release.note, bytes: release.bytes.length, sha256: release.sha256,
    download: release.download, syncedAt: new Date().toISOString() };
  await writeFile(resolve(dist, 'release.json'), `${JSON.stringify(metadata, null, 2)}\n`);
  console.log(`安装器同步成功：${release.bytes.length} bytes；SHA-256 ${release.sha256}`);
  // Do not put signed Feishu URLs, cookies or public-page HTML in build artifacts or logs.
}
console.log(`网站已生成：${dist}${release ? '（含已校验的在线安装器）' : '（预览模式，未绑定下载）'}`);
