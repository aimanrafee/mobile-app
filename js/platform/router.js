/** router.js — Router + registry skrin/tindakan Taubat.App
 *
 *  Cara tambah ciri baru (3 langkah):
 *   1. Cipta `js/features/nama.js` yang export `renderNama(params)` + `namaActions = {...}` (+ pilihan `namaTitle`, `namaOnShow()`).
 *   2. Dalam `js/app.js`: `import` modul itu dan panggil `registerScreen('nama', renderNama, { title: 'Nama' })` + `registerActions(namaActions)` (+ `registerOnShow(...)` jika perlu).
 *   3. Buka skrin via `push('nama')` atau `<button data-action="nav:screen" data-screen="nama">`.
 *
 *  Router tidak import sebarang ciri — ciri import `view` dari sini (satu arah, tiada circular).
 */
import { emitLog, store } from './core.js';
import { $, $$, clearTimers, every, toast, tr } from './ui.js';

export const view = { tab: 'home', screen: null, params: {} };

/* Judul topbar per skrin/tab. Ciri baru boleh daftar judul sendiri via registerScreen(..., {title}). */
const TITLES = {
  home: null, quran: 'Al-Quran', iqra: "Iqra'", doa: 'Zikir', more: 'Lainnya',
  surah: 'Al-Quran', level: "Iqra'", tasbih: 'Tasbih', calendar: 'Kalendar',
  zakat: 'Zakat', qibla: 'Kiblat', fast: 'Puasa', haid: 'Haid', settings: 'Tetapan'
};

/* Registry skrin: id -> fn(params) => html */
const SCREENS = {};
/* Registry tindakan: 'nama:aksi' -> (el, e) => void */
const ACTIONS = {};
/* Hook selepas render: { match: (view) => bool, fn: () => void } */
const ON_SHOW = [];

let titleTapCount = 0, titleTapTimer = null;

export function registerScreen(id, renderFn, opts = {}) {
  SCREENS[id] = renderFn;
  if (opts.title !== undefined) TITLES[id] = opts.title;
}

export function registerActions(map) {
  Object.assign(ACTIONS, map);
}

export function registerOnShow(match, fn) {
  ON_SHOW.push({ match, fn });
}

export function getAction(name) { return ACTIONS[name]; }

/** Statistik registry untuk panel debug / semakan kendiri (tanpa dedah objek dalaman). */
export function getStats() {
  return { screens: Object.keys(SCREENS), actions: Object.keys(ACTIONS) };
}

export function go(tab) { view.tab = tab; view.screen = null; view.params = {}; render(); emitLog('info', 'Navigasi → tab ' + tab); }
export function push(screen, params) { view.screen = screen; view.params = params || {}; render(); }
export function back() { view.screen = null; view.params = {}; render(); }

export function render(keepScroll) {
  clearTimers();
  const y = keepScroll ? window.scrollY : 0;
  const root = $('#screen');
  const fn = view.screen ? SCREENS[view.screen] : SCREENS[view.tab];
  root.innerHTML = (fn || SCREENS.home)(view.params);

  const backBtn = $('#btn-back');
  backBtn.hidden = !view.screen;
  const ttl = $('#tb-title');
  if (!view.screen && view.tab === 'home') ttl.innerHTML = 'Taubat<b>.App</b>';
  else ttl.textContent = TITLES[view.screen || view.tab] || 'Taubat.App';

  $$('#tabbar .tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === view.tab));
  $$('[data-i18n]').forEach((el) => { el.textContent = tr(el.dataset.i18n); });
  document.documentElement.lang = store.state.lang === 'en' ? 'en' : 'ms';

  ON_SHOW.forEach(({ match, fn: hook }) => { try { if (match(view)) hook(view); } catch (e) { emitLog('error', 'onShow gagal: ' + e.message); } });
  if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
}

/* Tindakan navigasi asas — sentiasa tersedia, ciri tidak perlu daftar semula */
registerActions({
  'nav:tab': (el) => go(el.dataset.tab),
  'nav:screen': (el) => push(el.dataset.screen),
  'nav:back': () => back(),
});

/** Pasang pendengar shell sekali (tabbar, back, tema, bahasa, easter-egg debug).
 *  Dipanggil oleh app.js initApp — ciri tidak perlu usik. */
export function initShell({ store, applyTheme, isDark, setDebugEnabled }) {
  const screen = $('#screen');
  screen.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || !screen.contains(el)) return;
    const fn = ACTIONS[el.dataset.action];
    if (fn) { e.preventDefault(); try { fn(el, e); } catch (err) { emitLog('error', 'Tindakan ' + el.dataset.action + ' gagal: ' + err.message); } }
  });

  $('#tabbar').addEventListener('click', (e) => {
    const b = e.target.closest('.tab');
    if (b) ACTIONS['nav:tab'](b);
  });
  $('#btn-back').addEventListener('click', back);

  $('#btn-theme').addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    store.set('theme', next, true);
    applyTheme(next);
  });
  applyTheme(store.state.theme);
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (store.state.theme === null) applyTheme(null);
    });
  } catch (e) {}

  const langBtn = $('#btn-lang');
  const paintLang = () => { langBtn.textContent = store.state.lang.toUpperCase(); };
  langBtn.addEventListener('click', () => {
    store.set('lang', store.state.lang === 'my' ? 'en' : 'my');
    paintLang();
    toast(tr('lang_switched'));
    render();
  });
  paintLang();
  store.subscribe((key) => { if (key === 'lang') paintLang(); });

  $('#tb-title').addEventListener('click', async () => {
    titleTapCount++;
    clearTimeout(titleTapTimer);
    titleTapTimer = setTimeout(() => { titleTapCount = 0; }, 1800);
    if (titleTapCount >= 7) {
      titleTapCount = 0;
      store.set('debug', true, true);
      setDebugEnabled(true);
      toast(tr('debug_on'));
      emitLog('info', 'Debug mode diaktifkan melalui easter egg (7 ketukan)');
    }
  });
}

export { every };
