# 皮蛋设计 CorelDRAW 插件下载站

静态网站 + GitHub Pages Actions。用户点击下载后，页面先取得同源发布清单和已缓存的安装器，再校验文件并交给浏览器原生下载。不会打开飞书，不会调用 IDM，也不需要服务器。

## 上传到 GitHub Pages

1. 在 GitHub 新建仓库，建议仓库名 `pidan-download-site`。
2. 解压本项目 ZIP，把**项目内全部文件和隐藏的 `.github` 文件夹**上传到仓库根目录。不要只上传 ZIP 文件。
3. 使用默认分支 `main`。进入仓库 `Settings → Pages`，在 `Build and deployment` 的 `Source` 选择 `GitHub Actions`。
4. 上传提交后，打开 `Actions`，等待 `Sync Feishu and deploy download site` 成功。首次运行时，若仓库设置为公开且飞书安装器可匿名下载，自动同步并发布。
5. 成功后在 `Settings → Pages` 打开网站。通常地址是 `https://<GitHub用户名>.github.io/pidan-download-site/`。

仓库名称及用户名由你在 GitHub 上确定。仓库改名后也请更新 workflow 的 `push.branches`，如需换发布分支，调整 `.github/workflows/pages.yml`。

## 飞书更新方式

网站不把带签名参数的飞书文件链接写进浏览器或仓库。GitHub Actions 每 15 分钟匿名读取公开更新页中“安装器：”后的链接，下载后检查 PE64 格式、文件大小并计算 SHA-256，再把验证过的安装器和网站作为同一次 Pages 部署发布。网页每次点击都会重新读取同源 `release.json`，下载同源 `.payload`，检查字节数、MZ 文件头及 SHA-256，最后让浏览器保存为 `皮蛋插件安装器.exe`。

以后更新时，只要把新安装器链接放在飞书公开更新页的“安装器：”后面即可。等下一次定时任务成功后，网站自动取得新版本。要立即更新，在 GitHub `Actions` 选中 workflow，点击 `Run workflow`；不要直接把安装器链接或签名 URL 放到网站代码里。

飞书必须允许未登录访问，至少允许 GitHub Actions 匿名读取更新页面及下载文件。页面和文件来源受 `site.config.json` 的 HTTPS 主机名单限制。若解析、网络、权限或 PE64 校验失败，workflow 会失败且不部署新的 Pages artifact，线上仍保留上一次成功版本。修复飞书权限后可在 GitHub `Actions` 里重跑。

定时检查约每 15 分钟一次，不是实时下载飞书。GitHub Actions 的 schedule 可能延迟或丢弃，高负载时更明显；公开仓库连续 60 天没有仓库活动时，GitHub 会自动停用定时 workflow。需要及时生效时在 Actions 手动运行。首发同步和真实云端部署还须在你的 GitHub 仓库完成和验证。

## 本地预览和构建

需要 Node.js 22 或更新版本；项目没有第三方 npm 依赖。

- 预览页面：`npm run dev`
- 生成无下载绑定的页面预览：`npm run build`
- 立即从飞书同步并生成部署目录：`npm run sync`
- 运行 feed 校验测试：`npm test`

网站资源在 `public/`，在线安装器与发布清单在构建时生成到 `dist/`。`.gitignore` 排除了 `dist/`，因为它会包含安装器。部署 workflow 会从飞书重新校验并构建，不应把本地 `dist` 提交进源仓库。

## 目录

- `public/index.html`、`styles.css`、`app.js`：页面、样式和浏览器下载逻辑。
- `public/assets/`：品牌 Logo 与站点图标。
- `scripts/feed.mjs`：匿名读取飞书、定位安装器链接、PE64 和大小校验。
- `scripts/build.mjs`：原子生成 Pages 内容和发布清单。
- `scripts/serve.mjs`：本地静态预览服务器。
- `tests/feed.test.mjs`：飞书解析、URL 限制及文件验证测试。
- `tests/browser.cjs`：可选 Playwright 浏览器测试，需要本机 Playwright 与 Chrome。
- `.github/workflows/pages.yml`：飞书定时同步及 GitHub Pages 部署。

