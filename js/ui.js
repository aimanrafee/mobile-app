/** ui.js — Kongsi bantu (shared helpers) Taubat.App
 *  Satu tempat untuk semua util UI supaya ciri baru tak perlu salin-tampal.
 *  Tiada logik skrin di sini — hanya helpers tulen.
 */
import {
  store, DICT, dateKey, parseKey, addDays, fmt12, dayName, fmtDate,
  toHijri, hijriLabel, toast
} from './core.js';

export { toast };

/* ---------- DOM ---------- */
export const $ = (sel, root) => (root || document).querySelector(sel);
export const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- i18n ---------- */
export function tr(k) {
  const d = DICT[store.state.lang] || DICT.my;
  return d[k] !== undefined ? d[k] : (DICT.my[k] || k);
}
export function locName(o) {
  return store.state.lang === 'en' ? (o.en || o.my) : (o.my || o.en);
}

/* ---------- pemasa skrin (dibersihkan setiap render) ---------- */
let timers = [];
export function clearTimers() { timers.forEach(clearInterval); timers = []; }
export function every(ms, fn) { const id = setInterval(fn, ms); timers.push(id); }

/* ---------- data hari (diguna home + calendar + fast + haid) ---------- */
export function dayRecord(key) { return store.state.prayers[key] || {}; }
export function dayCount(key) { return Object.keys(dayRecord(key)).length; }
export function isExempt(key) { return !!store.state.haid[key]; }

export function greetKey() {
  const h = new Date().getHours();
  if (h < 12) return 'greet_morning';
  if (h < 15) return 'greet_afternoon';
  if (h < 19) return 'greet_evening';
  return 'greet_night';
}

/* ---------- tema ---------- */
export function isDark() { return document.documentElement.classList.contains('dark'); }
export function applyTheme(mode) {
  const dark = mode === 'dark' || (mode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  const btn = $('#btn-theme use');
  if (btn) btn.setAttribute('href', dark ? '#i-sun' : '#i-moon');
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#1D201B' : '#FAF8F3');
}

/* ---------- papan klip & getar ---------- */
export function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => toast(tr('copied')), () => fallbackCopy(text));
  } else fallbackCopy(text);
}
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); toast(tr('copied')); }
  catch (e) { toast(text.slice(0, 40) + '…'); }
  document.body.removeChild(ta);
}
export function vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

/* ---------- grid kalendar kongsi (calendar / fast / haid) ----------
 *  mode: 'cal' | 'fast' | 'haid' — menentukan maksud "aktif".
 *  Bergantung pada view.params.mo (offset bulan) & view.params.sel.
 */
export function monthGridHTML(params, mode) {
  const base = new Date();
  const off = params.mo || 0;
  const d = new Date(base.getFullYear(), base.getMonth() + off, 1);
  const y = d.getFullYear(), m = d.getMonth();
  const first = new Date(y, m, 1).getDay();
  const daysIn = new Date(y, m + 1, 0).getDate();
  const lang = store.state.lang;
  const todayK = dateKey(new Date());
  const dows = lang === 'en' ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : ['A', 'I', 'S', 'R', 'K', 'J', 'S'];

  let cells = dows.map((x) => `<span class="dow">${x}</span>`).join('');
  for (let i = 0; i < first; i++) cells += '<span></span>';
  for (let day = 1; day <= daysIn; day++) {
    const dd = new Date(y, m, day);
    const k = dateKey(dd);
    const h = toHijri(dd);
    let marks = '';
    if (store.state.haid[k]) marks += '<span class="mark period"></span>';
    else if (store.state.puasa[k]) marks += '<span class="mark fast"></span>';
    else if (dayCount(k) >= 5) marks += '<span class="mark pray"></span>';
    const active = mode === 'haid' ? !!store.state.haid[k] : mode === 'fast' ? !!store.state.puasa[k] : params.sel === k;
    cells += `<button type="button" class="cal-day${k === todayK ? ' today' : ''}${active ? ' sel' : ''}" data-action="cal:day" data-day="${k}" aria-label="${k}">
      ${day}<span class="hij">${h.d}</span>${marks}</button>`;
  }
  const mNames = lang === 'en'
    ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    : ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
  const head = `<div class="cal-head">
      <button type="button" class="cal-nav" data-action="cal:nav" data-dir="-1" aria-label="Sebelum"><svg class="ic" style="width:1rem;height:1rem"><use href="#i-back"/></svg></button>
      <h3>${mNames[m]} ${y}</h3>
      <button type="button" class="cal-nav" data-action="cal:nav" data-dir="1" aria-label="Selepas"><svg class="ic" style="width:1rem;height:1rem"><use href="#i-fwd"/></svg></button>
    </div>`;
  return head + `<div class="cal-grid">${cells}</div>`;
}

/* Re-export util tarikh untuk ciri yang perlukannya tanpa import core.js dua kali */
export { dateKey, parseKey, addDays, fmt12, dayName, fmtDate, toHijri, hijriLabel };
