import { categories, tools } from './tools.js';

const findTool = id => tools.find(tool => tool.id === id);
const categoryName = id => categories.find(category => category.id === id)?.name || '';
const make = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

// One concise catalog: every tool is visible by default; filters only help navigation.
const grid = document.querySelector('.tool-grid');
const filters = document.querySelector('.category-filters');
const search = document.querySelector('#tool-search');
const clearSearch = document.querySelector('.search-clear');
let selectedCategory = 'all';
document.querySelector('[data-tool-total]').textContent = tools.length;

for (const category of [{ id: 'all', name: '全部' }, ...categories]) {
  const button = make('button', '', category.name);
  button.type = 'button';
  button.dataset.category = category.id;
  button.setAttribute('aria-pressed', String(category.id === selectedCategory));
  button.append(make('span', '', category.id === 'all' ? tools.length : tools.filter(tool => tool.category === category.id).length));
  button.addEventListener('click', () => {
    selectedCategory = category.id;
    renderTools();
  });
  filters.append(button);
}

function renderTools() {
  const query = search.value.trim().toLocaleLowerCase();
  const filtered = tools.filter(tool => {
    const text = [tool.name, tool.summary, ...tool.benefits, categoryName(tool.category)].join(' ').toLocaleLowerCase();
    return (selectedCategory === 'all' || tool.category === selectedCategory) && (!query || text.includes(query));
  });
  const fragment = document.createDocumentFragment();
  for (const tool of filtered) {
    const button = make('button', 'tool-card');
    button.type = 'button';
    button.dataset.tool = tool.id;
    button.setAttribute('aria-label', `${tool.name}，查看界面与详情`);
    const heading = make('div', 'tool-card-heading');
    const icon = make('span', 'tool-glyph');
    icon.setAttribute('aria-hidden', 'true');
    icon.style.setProperty('--icon', `url("${tool.icon}")`);
    const arrow = make('span', 'tool-card-arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    heading.append(icon, make('h4', '', tool.name), arrow);
    button.append(heading, make('p', '', tool.summary));
    button.addEventListener('click', () => openTool(tool.id));
    fragment.append(button);
  }
  grid.replaceChildren(fragment);
  document.querySelector('[data-category-title]').textContent = selectedCategory === 'all' ? '全部工具' : categoryName(selectedCategory);
  document.querySelector('.result-count').textContent = query ? `找到 ${filtered.length} 项功能` : `${filtered.length} 项功能`;
  document.querySelector('.empty-results').hidden = filtered.length > 0;
  clearSearch.hidden = !search.value;
  for (const button of filters.children) button.setAttribute('aria-pressed', String(button.dataset.category === selectedCategory));
}
search.addEventListener('input', renderTools);
clearSearch.addEventListener('click', () => { search.value = ''; renderTools(); search.focus(); });
document.querySelector('[data-reset-search]').addEventListener('click', () => {
  search.value = '';
  selectedCategory = 'all';
  renderTools();
  search.focus();
});
renderTools();

// Actual offline interface renders, including each of the displayed accent/mode combinations.
const studio = document.querySelector('.studio');
const previewImage = document.querySelector('[data-studio-panel]');
const colors = {
  mint: { name: '薄荷青', hex: '#2fc7b5', suffix: '' },
  blue: { name: '雾霭蓝', hex: '#668fe9', suffix: '-668FE9' },
  purple: { name: '丁香紫', hex: '#ab7ce1', suffix: '-AB7CE1' },
  apricot: { name: '暖杏橘', hex: '#df9474', suffix: '-DF9474' }
};
const previewCopy = {
  align: { label: '01 / ALIGN & DISTRIBUTE', title: '对齐、等距、成组排布。都放在顺手的位置。', description: '从六向对齐到行列分布，常用操作集中在一张紧凑面板里。间距、行列数和复制方式，按你的习惯设置。' },
  size: { label: '02 / SIZE & DIMENSION', title: '规格一目了然，标注也有章法。', description: '读取、统一或调整对象宽高，再按方向添加尺寸、间距与参数备注。让制作规格更容易核对。' },
  'select-same': { label: '03 / FIND & SELECT', title: '同样的对象，不必一个个找。', description: '把尺寸、线色、字体等匹配条件放在一起。按选区、本页或所有页查找，再替换、移动与复制。' },
  keyhole: { label: '04 / MAKE & CONNECT', title: '一个孔位，也能细细安排。', description: '内外孔径、四向偏移与八个方位直观设置；焊接、群组、耳朵与圆角，按制作需要组合。' }
};
let previewTool = 'align', previewMode = 'light', previewColor = 'mint';

function panelPath(tool, mode = 'light', color = 'mint') {
  return `./assets/panels/${tool}-${mode}${colors[color].suffix}.webp`;
}
function renderPreview() {
  const tool = findTool(previewTool), color = colors[previewColor], copy = previewCopy[previewTool];
  studio.dataset.previewMode = previewMode;
  studio.style.setProperty('--preview-accent', color.hex);
  previewImage.src = panelPath(previewTool, previewMode, previewColor);
  previewImage.alt = `${tool.name}工具${color.name}·${previewMode === 'light' ? '白色' : '深色'}模式界面预览`;
  document.querySelector('[data-look-label]').textContent = `${color.name} · ${previewMode === 'light' ? '白色' : '深色'}`;
  document.querySelector('[data-preview-index]').textContent = copy.label;
  document.querySelector('[data-preview-title]').textContent = copy.title;
  document.querySelector('[data-preview-description]').textContent = copy.description;
  const detail = document.querySelector('[data-preview-detail]');
  detail.replaceChildren(document.createTextNode(`了解${tool.name}工具 `), make('span', '', '↗'));
  for (const button of document.querySelectorAll('[data-preview-tool]')) button.setAttribute('aria-pressed', String(button.dataset.previewTool === previewTool));
  for (const button of document.querySelectorAll('[data-mode]')) button.setAttribute('aria-pressed', String(button.dataset.mode === previewMode));
  for (const button of document.querySelectorAll('[data-color]')) button.setAttribute('aria-pressed', String(button.dataset.color === previewColor));
  document.querySelector('.preview-live').textContent = previewImage.alt;
}
document.querySelectorAll('[data-preview-tool]').forEach(button => button.addEventListener('click', () => { previewTool = button.dataset.previewTool; renderPreview(); }));
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => { previewMode = button.dataset.mode; renderPreview(); }));
document.querySelectorAll('[data-color]').forEach(button => button.addEventListener('click', () => { previewColor = button.dataset.color; renderPreview(); }));
document.querySelector('[data-preview-detail]').addEventListener('click', () => openTool(previewTool));

// Details stay out of the main page. Native dialog supplies focus containment and Escape handling.
const dialog = document.querySelector('.feature-dialog');
const detailImage = document.querySelector('[data-detail-image]');
const imageFigure = detailImage.closest('figure');
const fullImage = document.querySelector('[data-full-image]');
const fallback = document.querySelector('.detail-fallback');
let detailTool = null, detailMode = 'light';

function renderDetailImage() {
  if (!detailTool) return;
  const hasPanel = Boolean(detailTool.panel);
  document.querySelector('.detail-mode').hidden = !hasPanel;
  imageFigure.hidden = !hasPanel;
  fullImage.hidden = !hasPanel;
  fallback.hidden = hasPanel;
  if (hasPanel) {
    detailImage.src = panelPath(detailTool.panel, detailMode);
    detailImage.alt = `${detailTool.name}工具${detailMode === 'light' ? '白色' : '深色'}模式界面布局`;
    detailImage.style.setProperty('--panel-width', `${detailTool.width <= 310 ? Math.min(290, detailTool.width * 1.12) : detailTool.width}px`);
    fullImage.href = detailImage.src;
    imageFigure.querySelector('figcaption').textContent = detailTool.width > 420 ? '界面布局预览 · 可打开大图查看' : '界面布局预览';
  } else {
    detailImage.removeAttribute('src');
    document.querySelector('[data-fallback-text]').textContent = detailTool.note;
  }
  document.querySelectorAll('[data-detail-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.detailMode === detailMode)));
}

function openTool(id) {
  const tool = findTool(id);
  if (!tool) return;
  detailTool = tool;
  detailMode = previewMode;
  document.querySelector('#detail-title').textContent = tool.name;
  document.querySelector('[data-detail-category]').textContent = `${categoryName(tool.category)} / TOOL DETAIL`;
  document.querySelector('[data-detail-summary]').textContent = tool.summary;
  const benefits = document.querySelector('[data-detail-benefits]');
  benefits.replaceChildren(...tool.benefits.map(text => make('li', '', text)));
  const controls = document.querySelector('[data-detail-controls]');
  controls.replaceChildren(...(tool.controls || []).map(text => make('span', '', text)));
  document.querySelector('.detail-controls').hidden = !tool.controls?.length;
  const note = document.querySelector('[data-detail-note]');
  note.textContent = tool.note || '';
  note.hidden = !tool.note;
  renderDetailImage();
  if (!dialog.open) { dialog.showModal(); document.body.classList.add('modal-open'); }
  dialog.scrollTop = 0;
  document.querySelector('.dialog-close').focus({ preventScroll: true });
}
document.querySelectorAll('[data-detail-mode]').forEach(button => button.addEventListener('click', () => { detailMode = button.dataset.detailMode; renderDetailImage(); }));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
let backdropDown = false;
dialog.addEventListener('pointerdown', event => { backdropDown = event.target === dialog; });
dialog.addEventListener('click', event => { if (backdropDown && event.target === dialog) dialog.close(); backdropDown = false; });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); detailTool = null; });
