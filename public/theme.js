// Load before painting; a denied localStorage permission must not break the site.
try {
  const saved = localStorage.getItem('pidan-theme');
  if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
} catch { /* The default appearance remains usable in private sessions. */ }
