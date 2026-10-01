/** features/quran.js — 114 surah lazy-load + paparan surah + bookmark
 *
 *  Strategi data (Batch B):
 *  - Metadata 114 surah: fetch sekali `data/quran/surah.json`, cache memori.
 *  - Ayat per surah: fetch atas permintaan `data/quran/surah-NNN.json`, cache memori.
 *  - Sandaran: 10 surah terbenam dalam data.js (SURAHS) diguna segera + luar talian,
 *    termasuk togol terjemahan MY/EN (korpus penuh terjemahan Melayu sahaja).
 */
import { store, emitLog, toast } from '../platform/core.js';
import { SURAHS, BISMILLAH } from '../data.js';
import { $, esc, tr, locName } from '../platform/ui.js';
import { view, push, render } from '../platform/router.js';
import { renderPagesShell, pagesActions, pagesOnShow } from './quran-pages.js';

/* ---------- metadata & cache ---------- */
let META = null, metaInflight = null;
const surahCache = new Map();
const surahInflight = new Map();
let surahError = '';

export function ensureMeta() {
  if (META) return Promise.resolve(META);
  if (!metaInflight) {
    metaInflight = fetch('data/quran/surah.json')
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((j) => { META = j.surah; return META; })
      .catch((e) => { metaInflight = null; emitLog('error', 'Meta Quran gagal: ' + e.message); return null; });
  }
  return metaInflight;
}

const pad = (n) => String(n).padStart(3, '0');

/** Ambil data surah penuh (cache/bundled). Pulang null bila perlu fetch — onShow akan isi. */
export function ensureSurah(n) {
  n = Number(n);
  if (surahCache.has(n)) return Promise.resolve(surahCache.get(n));
  if (SURAHS.some((s) => s.n === n)) return Promise.resolve(null); // bundled: render sync
  if (!surahInflight.has(n)) {
    surahInflight.set(n, fetch(`data/quran/surah-${pad(n)}.json`)
      .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then((j) => {
        surahCache.set(n, j); surahInflight.delete(n); surahError = '';
        render(true); return j;
      })
      .catch((e) => {
        surahInflight.delete(n); surahError = e.message;
        emitLog('error', `Surah ${n} gagal dimuat: ${e.message}`);
        render(true); return null;
      }));
  }
  return surahInflight.get(n);
}

function metaList() { return META || SURAHS; }
function findMeta(n) {
  const list = metaList();
  return list.find((s) => s.n === Number(n)) || null;
}
function surahCount(s) { return s.count || (s.ayat ? s.ayat.length : 0); }

/* ---------- senarai ---------- */
export function renderQuran() {
  const last = store.state.lastRead;
  const lastSurah = last ? findMeta(last.surah) : null;
  const initial = META ? surahListHTML('') : `<div id="surah-skel">${'<div class="skel"></div>'.repeat(6)}</div>`;
  return `
  <div class="search-box"><svg class="ic" style="width:1rem;height:1rem;color:var(--muted)"><use href="#i-book"/></svg>
    <input type="search" id="quran-search" placeholder="${esc(tr('search_surah'))}" aria-label="${esc(tr('search_surah'))}"></div>
  <div id="surah-list">${initial}</div>
  ${lastSurah ? `<div class="read-banner">
      <svg class="ic"><use href="#i-bookmark"/></svg>
      <span class="grow">${esc(tr('continue_read'))}: ${esc(locName(lastSurah.name))} · ${store.state.lang === 'en' ? 'verse' : 'ayat'} ${last.ayat}</span>
      <button type="button" class="mini-btn on" data-action="surah:open" data-surah="${lastSurah.n}">→</button>
    </div>` : ''}`;
}

export function surahListHTML(q) {
  const query = q.trim().toLowerCase();
  const list = metaList().filter((s) =>
    !query || s.name.my.toLowerCase().includes(query) || s.name.en.toLowerCase().includes(query) ||
    String(s.n) === query || s.ar.includes(q.trim()));
  if (!list.length) return `<p class="muted" style="text-align:center;padding:2rem">—</p>`;
  return list.map((s) => {
    const bms = store.state.bookmarks.filter((b) => b.startsWith(s.n + ':')).length;
    return `<button type="button" class="surah-row" data-action="surah:open" data-surah="${s.n}">
      <span class="surah-num"><span>${s.n}</span></span>
      <span class="grow"><b>${esc(locName(s.name))}</b><br><span class="cap muted" style="font-size:.74rem">${esc(locName(s.tr))} · ${surahCount(s)} ${store.state.lang === 'en' ? 'verses' : 'ayat'}${bms ? ' · ★ ' + bms : ''}</span></span>
      <span class="surah-ar" lang="ar">${esc(s.ar)}</span>
    </button>`;
  }).join('');
}

/* ---------- toggle mod + placeholder Pages (Fasa 2; render penuh Fasa 3) ---------- */
export function modToggleHTML() {
  const mod = store.state.quranMod || 'terjemahan';
  const btn = (m, icon, key) => {
    const on = mod === m;
    return `<button type="button" class="${on ? 'on' : ''}" data-action="quran:mod" data-mod="${m}" aria-pressed="${on}" aria-label="${esc(tr(key))}"><svg class="ic" aria-hidden="true"><use href="#${icon}"/></svg></button>`;
  };
  return `<div class="quran-mod" role="group" aria-label="${esc(tr('mod_baca'))} / ${esc(tr('mod_terjemahan'))} / ${esc(tr('mod_pages'))}">${btn('baca', 'i-book', 'mod_baca')}${btn('terjemahan', 'i-globe', 'mod_terjemahan')}${btn('pages', 'i-mod-pages', 'mod_pages')}</div>`;
}

export function renderPagesPlaceholder(n) {
  const m = findMeta(Number(n));
  const nama = m ? locName(m.name) : 'Surah ' + n;
  return `<div class="quran-top">${modToggleHTML()}</div>
  <div class="mushaf-head"><div class="tr">${esc(nama)}</div></div>
  <div class="card form-card" style="text-align:center">
    <p class="muted">${esc(tr('mod_pages_soon'))}</p>
  </div>`;
}

/* ---------- paparan surah ---------- */
export function renderSurah(params) {
  const n = Number(params.surah);
  const b = SURAHS.find((x) => x.n === n);
  const c = surahCache.get(n);
  const s = c || (b ? {
    n: b.n, ar: b.ar, name: b.name, tr: b.tr,
    ayat: b.ayat.map((a) => ({ ar: a.ar, my: a.my, en: a.en })), bundled: true
  } : null);
  if (!s) {
    return `<div class="home-head"><p class="kicker">${esc(tr('quran_title'))}</p></div>
    <div>${'<div class="skel"></div>'.repeat(4)}</div>
    ${surahError ? `<div class="card form-card load-err">
      <p class="muted">${esc(tr('load_fail'))} (${esc(surahError)})</p>
      <button type="button" class="btn gold" data-action="surah:retry">${esc(tr('retry'))}</button>
    </div>` : `<p class="muted" style="text-align:center">${esc(tr('loading'))}</p>`}`;
  }
  const lang = store.state.lang;
  const mod = store.state.quranMod || 'terjemahan';
  const modBaca = mod === 'baca';
  const modPages = mod === 'pages';
  if (modPages) return renderPagesShell(store.state.quranHalaman || 1);
  const showEn = s.bundled && params.trans === 'en';
  const ayat = s.ayat.map((a, i) => {
    const id = s.n + ':' + (i + 1);
    const bm = store.state.bookmarks.includes(id);
    return `<div class="ayah" id="ayah-${i + 1}">
      <div class="ar" lang="ar">${esc(a.ar)}<span class="num">${i + 1}</span></div>
      ${!modBaca ? `<div class="my">${esc(a.my)}</div>` : ''}
      ${!modBaca && showEn && a.en ? `<div class="en" lang="en">${esc(a.en)}</div>` : ''}
      <div class="ayah-tools">
        <button type="button" class="mini-btn${bm ? ' on' : ''}" data-action="bm:toggle" data-id="${id}">
          <svg class="ic"><use href="#i-bookmark"/></svg>${esc(tr(bm ? 'bookmarked' : 'bookmark'))}</button>
        <button type="button" class="mini-btn" data-action="ayah:read" data-surah="${s.n}" data-ayat="${i + 1}">
          <svg class="ic"><use href="#i-check"/></svg>${esc(tr('continue_read'))}</button>
      </div>
    </div>`;
  }).join('');
  return `
  <div class="quran-top">
    ${modToggleHTML()}
  ${s.bundled ? `<div class="quran-lang"${modBaca ? ' hidden aria-hidden="true"' : ''}>
    <div class="pill-toggle" role="group" aria-label="Terjemahan">
      <button type="button" class="${showEn ? '' : 'on'}" data-action="quran:trans" data-trans="my">MY</button>
      <button type="button" class="${showEn ? 'on' : ''}" data-action="quran:trans" data-trans="en">EN</button>
    </div>
  </div>` : ''}
  </div>
  <div class="mushaf-head">
    <div class="ar" lang="ar">${esc(s.ar)}</div>
    <div class="tr">${esc(locName(s.name))} · ${esc(locName(s.tr))} · ${s.ayat.length} ${lang === 'en' ? 'verses' : 'ayat'}</div>
  </div>
  ${s.n !== 1 && s.n !== 9 ? `<div class="bismillah" lang="ar" dir="rtl">${esc(BISMILLAH)}</div>` : ''}
  ${ayat}`;
}

export const quranActions = {
  ...pagesActions,
  'surah:open': (el) => { surahError = ''; push('surah', { surah: el.dataset.surah }); },
  'surah:retry': () => { surahError = ''; render(true); },
  'quran:mod': (el) => {
    const mod = el.dataset.mod;
    if (!['baca', 'terjemahan', 'pages'].includes(mod)) return;
    if (store.state.quranMod === mod) return;
    store.update((s) => {
      s.quranMod = mod;
      if (mod === 'pages' && !s.quranHalaman) s.quranHalaman = 1;
    });
    render(true);
  },
  'quran:trans': (el) => { view.params.trans = el.dataset.trans; render(true); },
  'bm:toggle': (el) => {
    const id = el.dataset.id;
    store.update((s) => {
      const i = s.bookmarks.indexOf(id);
      if (i >= 0) s.bookmarks.splice(i, 1); else s.bookmarks.push(id);
    });
    emitLog('info', 'Tanda buku ' + id);
    render(true);
  },
  'ayah:read': (el) => {
    store.set('lastRead', { surah: Number(el.dataset.surah), ayat: Number(el.dataset.ayat) }, true);
    toast(tr('saved') + ' ✓');
  },
};

/** Carian live + isi senarai bila metadata tiba */
export function quranOnShow(v) {
  if (v.tab === 'quran' && !v.screen) {
    const inp = $('#quran-search');
    if (inp) inp.addEventListener('input', () => {
      const list = $('#surah-list');
      if (list) list.innerHTML = surahListHTML(inp.value);
    });
    ensureMeta().then(() => {
      const list = $('#surah-list');
      const cur = $('#quran-search');
      if (list && $('#screen') && view.tab === 'quran' && !view.screen) {
        list.innerHTML = surahListHTML(cur ? cur.value : '');
      }
    });
  }
}

/** Fetch ayat surah bila skrin surah dipapar */
export function quranSurahOnShow(v) {
  if (v.screen === 'surah' && v.params && v.params.surah) {
    ensureSurah(v.params.surah);
  }
}
