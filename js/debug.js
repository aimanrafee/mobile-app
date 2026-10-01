/** debug.js — Debug Mode Taubat.App
 *  Panel pembangun: pinterap console & ralat global, pemeriksa state,
 *  maklumat peranti, dan tindakan ujian. Selamat: semua dibalut try/catch.
 */
import { store, LOGS, emitLog, logListeners, toast, LOCATION, prayerTimes, toHijri, fmt12 } from './core.js';

let enabled = false;
let openTab = 'logs';
let unsubscribe = null;
let onNewLog = null;

const $ = (s, r) => (r || document).querySelector(s);

/* ---------- pinterap console & ralat ---------- */
let patched = false;
function patchConsole() {
  if (patched) return;
  patched = true;
  ['log', 'info', 'warn', 'error'].forEach((m) => {
    const orig = console[m].bind(console);
    console[m] = (...args) => {
      try { emitLog(m === 'log' ? 'info' : m, args.map(stringify).join(' ')); } catch (e) {}
      orig(...args);
    };
  });
  window.addEventListener('error', (e) => {
    emitLog('error', `Uncaught: ${e.message} @ ${(e.filename || '').split('/').pop()}:${e.lineno}`);
  });
  window.addEventListener('unhandledrejection', (e) => {
    emitLog('error', 'Unhandled rejection: ' + stringify(e.reason));
  });
}
function stringify(v) {
  if (v instanceof Error) return v.message;
  if (typeof v === 'object') { try { return JSON.stringify(v); } catch (e) { return String(v); } }
  return String(v);
}

/* ---------- hidup/padam ---------- */
export function setDebugEnabled(on) {
  enabled = !!on;
  const fab = $('#debug-fab');
  if (fab) fab.hidden = !enabled;
  if (enabled) patchConsole(); else closeDebugPanel();
  emitLog('info', 'Debug mode ' + (enabled ? 'ON' : 'OFF'));
}
export function isDebugEnabled() { return enabled; }

/* ---------- panel ---------- */
export function openDebugPanel() {
  const panel = $('#debug-panel');
  if (!panel || !enabled) return;
  panel.hidden = false;
  renderDebugBody();
  if (!onNewLog) {
    onNewLog = () => { if (openTab === 'logs' && !$('#debug-panel').hidden) renderLogs(); };
    logListeners.add(onNewLog);
  }
}
export function closeDebugPanel() {
  const panel = $('#debug-panel');
  if (panel) panel.hidden = true;
  if (onNewLog) { logListeners.delete(onNewLog); onNewLog = null; }
}

function esc(s) { return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

function renderDebugBody() {
  $$('#debug-panel .dp-tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.dtab === openTab)));
  if (openTab === 'logs') renderLogs();
  else if (openTab === 'state') renderState();
  else if (openTab === 'info') renderInfo();
  else renderActions();
}
function $$(s) { return Array.from(document.querySelectorAll(s)); }

function renderLogs() {
  const body = $('#dp-body');
  if (!LOGS.length) { body.innerHTML = '<div class="dp-empty">Tiada log lagi.<br>Tindakan aplikasi akan direkod di sini.</div>'; return; }
  body.innerHTML = LOGS.slice(-120).reverse().map((l) =>
    `<div class="dp-log ${l.level}"><span class="t">${l.t.toLocaleTimeString('ms-MY', { hour12: false })}.${String(l.t.getMilliseconds()).padStart(3, '0')}</span>[${l.level.toUpperCase()}] ${esc(l.msg)}</div>`
  ).join('');
}

function renderState() {
  const body = $('#dp-body');
  let json;
  try { json = JSON.stringify(store.state, null, 2); } catch (e) { json = 'Gagal baca state: ' + e.message; }
  const bytes = (() => { try { return new Blob([localStorage.getItem('taubat_app_v1') || '']).size; } catch (e) { return 0; } })();
  body.innerHTML = `
    <div class="dp-kv"><span>storage key</span><b>taubat_app_v1 <span class="dp-badge">${bytes} B</span></b></div>
    <div class="dp-kv"><span>lang / theme / debug</span><b>${esc(store.state.lang)} / ${esc(String(store.state.theme))} / ${store.state.debug}</b></div>
    <div class="dp-kv"><span>rekod solat</span><b>${Object.keys(store.state.prayers).length} hari</b></div>
    <div class="dp-kv"><span>tanda buku</span><b>${store.state.bookmarks.length}</b></div>
    <div style="height:.7rem"></div>
    <div class="dp-pre">${esc(json)}</div>`;
}

function renderInfo() {
  const body = $('#dp-body');
  const nav = navigator;
  const mem = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB' : 'n/a';
  let pt = '—';
  try {
    const t = prayerTimes(new Date());
    pt = Object.entries(t).map(([k, v]) => `${k} ${fmt12(v)}`).join(' · ');
  } catch (e) { pt = 'ralat: ' + e.message; }
  let hj = '—';
  try { const h = toHijri(new Date()); hj = `${h.d}/${h.m}/${h.y}H`; } catch (e) { hj = 'ralat: ' + e.message; }
  const rows = [
    ['versi', 'Taubat.App 1.0.0'],
    ['user agent', nav.userAgent],
    ['platform', nav.platform || 'n/a'],
    ['viewport', innerWidth + '×' + innerHeight + ' @' + (window.devicePixelRatio || 1) + 'x'],
    ['skrin', screen.width + '×' + screen.height],
    ['bahasa pelayar', nav.language],
    ['online', String(nav.onLine)],
    ['memori JS', mem],
    ['masa', new Date().toString()],
    ['lokasi lalai', `${LOCATION.name} (${LOCATION.lat}, ${LOCATION.lng}, UTC+${LOCATION.tz})`],
    ['hijri hari ini', hj],
    ['waktu solat hari ini', pt],
    ['bil. log', String(LOGS.length)]
  ];
  body.innerHTML = rows.map(([k, v]) => `<div class="dp-kv"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('');
}

function renderActions() {
  const body = $('#dp-body');
  body.innerHTML = `<div class="dp-actions">
    <button type="button" class="dp-btn" data-dbg="test-log"><svg class="ic"><use href="#i-bug"/></svg>Jana log ujian (info/warn/error)</button>
    <button type="button" class="dp-btn" data-dbg="test-error"><svg class="ic"><use href="#i-bug"/></svg>Simulasi ralat (ujian pinterap)</button>
    <button type="button" class="dp-btn" data-dbg="export"><svg class="ic"><use href="#i-download"/></svg>Eksport log (.txt)</button>
    <button type="button" class="dp-btn" data-dbg="copy-state"><svg class="ic"><use href="#i-copy"/></svg>Salin state JSON</button>
    <button type="button" class="dp-btn" data-dbg="clear-logs"><svg class="ic"><use href="#i-trash"/></svg>Kosongkan log</button>
    <button type="button" class="dp-btn danger" data-dbg="wipe"><svg class="ic"><use href="#i-trash"/></svg>Padam semua data aplikasi</button>
  </div>`;
}

function doAction(a) {
  try {
    if (a === 'test-log') {
      console.log('Log ujian: maklumat biasa');
      console.warn('Log ujian: amaran contoh');
      console.error('Log ujian: ralat contoh');
    } else if (a === 'test-error') {
      emitLog('warn', 'Simulasi ralat akan dicetuskan (ditangkap oleh pinterap)…');
      setTimeout(() => { throw new Error('Ralat simulasi daripada debug panel'); }, 10);
    } else if (a === 'export') {
      const txt = LOGS.map((l) => `${l.t.toISOString()} [${l.level}] ${l.msg}`).join('\n');
      const blob = new Blob([txt || '(kosong)'], { type: 'text/plain' });
      const a2 = document.createElement('a');
      a2.href = URL.createObjectURL(blob);
      a2.download = 'taubat-debug-' + Date.now() + '.txt';
      a2.click();
      setTimeout(() => URL.revokeObjectURL(a2.href), 2000);
    } else if (a === 'copy-state') {
      const txt = JSON.stringify(store.state, null, 2);
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => toast('State disalin'));
    } else if (a === 'clear-logs') {
      LOGS.length = 0; renderLogs();
    } else if (a === 'wipe') {
      if (window.confirm('Padam semua data aplikasi?')) {
        store.reset();
        toast('Data dipadam');
        renderState();
      }
    }
  } catch (e) { emitLog('error', 'Tindakan debug gagal: ' + e.message); }
}

/* ---------- init ---------- */
export function initDebug() {
  patchConsole();
  const fab = $('#debug-fab');
  const panel = $('#debug-panel');
  const closeBtn = $('#dp-close');
  if (fab) fab.addEventListener('click', openDebugPanel);
  if (closeBtn) closeBtn.addEventListener('click', closeDebugPanel);
  if (panel) {
    panel.addEventListener('click', (e) => {
      if (e.target === panel) { closeDebugPanel(); return; }
      const tabBtn = e.target.closest('[data-dtab]');
      if (tabBtn) { openTab = tabBtn.dataset.dtab; renderDebugBody(); return; }
      const actBtn = e.target.closest('[data-dbg]');
      if (actBtn) doAction(actBtn.dataset.dbg);
    });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDebugPanel(); });
  setDebugEnabled(!!store.state.debug);
  emitLog('info', 'Debug module sedia');
}
