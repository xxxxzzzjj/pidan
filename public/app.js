const root = document.documentElement;
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const themeToggle = document.querySelector('.theme-toggle');
const buttons = [...document.querySelectorAll('[data-download]')];
const feedback = document.querySelector('.download-feedback');
const releaseNote = document.querySelector('[data-release-note]');
const downloadLink = document.createElement('a');
downloadLink.download = '皮蛋插件安装器.exe';
downloadLink.hidden = true;
document.body.append(downloadLink);
let downloading = false;

function updateThemeLabel() {
  const dark = root.dataset.theme === 'dark';
  const label = dark ? '切换为浅色外观' : '切换为深色外观';
  themeToggle.setAttribute('aria-label', label);
  themeToggle.title = label;
  document.querySelector('meta[name="theme-color"]').content = dark ? '#0b1012' : '#f6f8f5';
}
themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('pidan-theme', root.dataset.theme); } catch { /* Optional preference. */ }
  updateThemeLabel();
});
updateThemeLabel();
document.querySelector('[data-year]').textContent = new Date().getFullYear();

function downloadPath(release) {
  if (release.status !== 'ready' || !release.download) return null;
  // Never navigate to arbitrary URLs from remotely refreshed metadata.
  if (!/^downloads\/PidanSetup-[a-f0-9]{16}\.payload$/.test(release.download)) throw new Error('invalid-release');
  return new URL(release.download, new URL('./', location.href)).href;
}
async function getRelease() {
  const response = await fetch(new URL(`./release.json?t=${Date.now()}`, location.href), {
    cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error('release-unavailable');
  const release = await response.json();
  downloadPath(release);
  if (typeof release.note === 'string' && release.note.trim()) {
    releaseNote.textContent = release.note.slice(0, 240);
    releaseNote.title = release.note.slice(0, 1000);
  }
  if (release.status === 'ready' && Number.isFinite(release.bytes) && release.bytes > 0) {
    const size = release.bytes < 1048576 ? `${Math.round(release.bytes / 1024)} KB` : `${(release.bytes / 1048576).toFixed(1)} MB`;
    document.querySelector('.file-size').textContent = `· ${size}`;
  }
  return release;
}
function setBusy(busy) {
  downloading = busy;
  buttons.forEach(button => {
    button.disabled = busy;
    button.setAttribute('aria-busy', String(busy));
    button.querySelector('[data-button-label]').textContent = busy ? '正在准备下载' : '下载 Windows 版';
  });
}
async function download() {
  if (downloading) return;
  setBusy(true);
  feedback.textContent = '正在获取最新安装器…';
  feedback.dataset.state = 'loading';
  try {
    const release = await getRelease(); // Refresh on every click, even on a page left open for days.
    const href = downloadPath(release);
    if (!href) {
      feedback.dataset.state = 'error';
      feedback.textContent = '安装器正在准备中，请稍后再来。';
      return;
    }
    const response = await fetch(href, { cache: 'no-cache', credentials: 'omit', signal: AbortSignal.timeout(120000) });
    if (!response.ok || /text\/|json|html/i.test(response.headers.get('content-type') || '')) throw new Error('file-unavailable');
    const blob = await response.blob();
    if (blob.size < 256 || blob.size > 150 * 1024 * 1024 || (release.bytes && blob.size !== release.bytes)) throw new Error('incomplete-file');
    const bytes = await blob.arrayBuffer();
    if (new Uint8Array(bytes, 0, 2).toString() !== '77,90') throw new Error('invalid-file');
    if (release.sha256 && crypto.subtle) {
      const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(value => value.toString(16).padStart(2, '0')).join('');
      if (hash !== release.sha256) throw new Error('incomplete-file');
    }
    const objectUrl = URL.createObjectURL(blob);
    downloadLink.href = objectUrl;
    downloadLink.click();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    feedback.dataset.state = 'success';
    feedback.textContent = '下载请求已发送，请在浏览器下载列表中查看。';
  } catch {
    feedback.dataset.state = 'error';
    feedback.textContent = '暂时无法获取安装器，请检查网络后重试。';
  } finally {
    setBusy(false);
  }
}
buttons.forEach(button => button.addEventListener('click', download));
getRelease().catch(() => {}); // The initial hero stays quiet when a network request fails.

// A small, self-contained flow field. No WebGL, image downloads or third-party scripts.
const canvas = document.querySelector('#particles');
const context = canvas.getContext('2d');
if (context) {
  let width = 1, height = 1, points = [], raf = 0, last = 0, time = 0;
  const pointer = { x: -2000, y: -2000 };
  const scene = document.querySelector('.logo-scene');
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = width < 600 ? 42 : Math.min(115, Math.round(width / 12));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      size: Math.random() * 1.15 + .35, speed: Math.random() * .13 + .035,
      phase: Math.random() * Math.PI * 2
    }));
    paint(0);
  }
  function paint(delta) {
    time += delta;
    context.clearRect(0, 0, width, height);
    const light = root.dataset.theme === 'light';
    const rgb = light ? '14,125,91' : '121,235,200';
    points.forEach(point => {
      if (!motion.matches) {
        point.y -= point.speed * delta * .06;
        point.x += Math.sin(time * .00012 + point.phase) * delta * .0015;
        if (point.y < -4) { point.y = height + 4; point.x = Math.random() * width; }
      }
      const opacity = (.14 + .27 * (1 + Math.sin(time * .0008 + point.phase)) / 2) * (1 - .5 * point.y / height);
      context.fillStyle = `rgba(${rgb},${opacity})`;
      context.beginPath(); context.arc(point.x, point.y, point.size, 0, Math.PI * 2); context.fill();
      const distance = Math.hypot(pointer.x - point.x, pointer.y - point.y);
      if (distance < 110 && !motion.matches) {
        context.strokeStyle = `rgba(${rgb},${(1 - distance / 110) * .15})`;
        context.lineWidth = .5;
        context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(pointer.x, pointer.y); context.stroke();
      }
    });
  }
  function frame(now) {
    if (!last || now - last > 32) { paint(Math.min(50, last ? now - last : 0)); last = now; }
    raf = requestAnimationFrame(frame);
  }
  function activity() {
    cancelAnimationFrame(raf);
    last = 0;
    if (!document.hidden && !motion.matches) raf = requestAnimationFrame(frame);
    else paint(0);
  }
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', activity);
  motion.addEventListener('change', activity);
  document.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top;
    if (motion.matches || event.pointerType === 'touch') return;
    const target = scene.getBoundingClientRect();
    scene.style.setProperty('--lx', `${Math.max(-5, Math.min(5, (event.clientX - target.left - target.width / 2) / 70))}px`);
    scene.style.setProperty('--ly', `${Math.max(-4, Math.min(4, (event.clientY - target.top - target.height / 2) / 70))}px`);
  }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer.x = pointer.y = -2000; scene.style.setProperty('--lx', '0px'); scene.style.setProperty('--ly', '0px'); });
  themeToggle.addEventListener('click', () => { if (motion.matches) paint(0); });
  resize(); activity();
}
