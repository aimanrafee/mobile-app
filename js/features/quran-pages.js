// js/features/quran-pages.js — Render mushaf QPC V4 (604 halaman)
import { esc, tr } from '../platform/ui.js';
import { store } from '../platform/core.js';
import { modToggleHTML } from './quran.js';

const JUMLAH_HALAMAN = 604;
const BASE = 'data/quran/qpc-tajweed';
const _cache = new Map();
const _font = new Set();

// ── Muat font halaman (p1.woff2 … p604.woff2) ──
async function muatFont(nama) {
  if (_font.has(nama)) return;
  try {
    const f = new FontFace(nama, `url(${BASE}/fonts/${nama}.woff2)`, { display: 'swap' });
    await f.load();
    document.fonts.add(f);
    _font.add(nama);
  } catch (e) { console.warn('font gagal:', nama, e.message); }
}

// ── Muat halaman JSON ──
async function muatHalaman(n) {
  if (_cache.has(n)) return _cache.get(n);
  const nama = String(n).padStart(3, '0');
  const r = await fetch(`${BASE}/pages/${nama}.json`);
  if (!r.ok) throw new Error('Halaman ' + n + ' gagal (' + r.status + ')');
  const j = await r.json();
  _cache.set(n, j);
  return j;
}

// ── Render shell (sync, papar loading) ──
export function renderPagesShell(n) {
  const no = clamp(n ?? (store.state.quranHalaman || 1));
  return `
    <div class="quran-top">
      ${modToggleHTML()}
    </div>
    <div class="qcf-head">
      <button class="qcf-nav" data-action="quran:page" data-delta="-1"
              ${no <= 1 ? 'disabled' : ''} aria-label="Sebelum">‹</button>
      <div class="qcf-info">
        <strong>Halaman ${no}</strong>
        <small>${no} / ${JUMLAH_HALAMAN}</small>
      </div>
      <button class="qcf-nav" data-action="quran:page" data-delta="1"
              ${no >= JUMLAH_HALAMAN ? 'disabled' : ''} aria-label="Seterusnya">›</button>
    </div>
    <div class="qcf-mushaf" id="qcf-mushaf" dir="rtl">
      <p class="qcf-loading">Memuatkan halaman ${no}…</p>
    </div>
    <div class="qcf-foot">
      <button class="qcf-jump" data-action="quran:page-jump">Ke halaman…</button>
    </div>
  `;
}

// ── Muat + render isi halaman (async, gantikan loading) ──
export async function muatHalamanMushaf(n) {
  const no = clamp(n);
  const el = document.getElementById('qcf-mushaf');
  if (!el) return;

  try {
    const data = await muatHalaman(no);
    await muatFont(data.font);

    const html = data.lines.map(L => {
      const cls = ['qcf-line'];
      if (L.type === 'surah_name') cls.push('qcf-surah');
      else if (L.type === 'bismillah') cls.push('qcf-bismillah');
      if (L.centered) cls.push('qcf-center');

      const words = (L.words || []).map(w =>
        `<span class="qcf-w" data-k="${esc(w.k)}">${esc(w.g)}</span>`
      ).join('');

      return `<div class="${cls.join(' ')}">${words}</div>`;
    }).join('');

    el.style.fontFamily = `'${data.font}', 'Amiri Quran', serif`;
    el.innerHTML = html;
  } catch (e) {
    el.innerHTML = `<p class="qcf-err">Gagal memuatkan halaman ${no}.<br><small>${esc(e.message)}</small></p>`;
  }
}

// ── Aksi ──
export const pagesActions = {
  'quran:page': async (el) => {
    const d = Number(el.dataset.delta);
    const no = clamp((store.state.quranHalaman || 1) + d);
    store.update(s => { s.quranHalaman = no; });
    await refreshShell();
    await muatHalamanMushaf(no);
  },
  'quran:page-jump': async () => {
    const inp = window.prompt('Halaman (1–' + JUMLAH_HALAMAN + '):', store.state.quranHalaman || 1);
    if (!inp) return;
    const no = clamp(Number(inp));
    if (!Number.isFinite(no)) return;
    store.update(s => { s.quranHalaman = no; });
    await refreshShell();
    await muatHalamanMushaf(no);
  }
};

// ── Bila skrin Pages muncul (dipanggil dari onShow) ──
export async function pagesOnShow() {
  const no = store.state.quranHalaman || 1;
  await muatHalamanMushaf(no);
}

function clamp(n) {
  const x = Number(n) || 1;
  return Math.max(1, Math.min(JUMLAH_HALAMAN, x));
}

async function refreshShell() {
  const screen = document.getElementById('screen');
  if (!screen) return;
  const no = store.state.quranHalaman || 1;
  screen.innerHTML = renderPagesShell(no);
  screen.scrollTop = 0;
}