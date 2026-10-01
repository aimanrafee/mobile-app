/** features/quran.js — Senarai surah + paparan surah + bookmark */
import { store, emitLog, toast } from '../core.js';
import { SURAHS, BISMILLAH } from '../data.js';
import { $, esc, tr, locName } from '../ui.js';
import { view, push, render } from '../router.js';

export function renderQuran() {
  const last = store.state.lastRead;
  const lastSurah = last ? SURAHS.find((s) => s.n === last.surah) : null;
  return `
  <div class="search-box"><svg class="ic" style="width:1rem;height:1rem;color:var(--muted)"><use href="#i-book"/></svg>
    <input type="search" id="quran-search" placeholder="${esc(tr('search_surah'))}" aria-label="${esc(tr('search_surah'))}"></div>
  <div id="surah-list">${surahListHTML('')}</div>
  ${lastSurah ? `<div class="read-banner">
      <svg class="ic"><use href="#i-bookmark"/></svg>
      <span class="grow">${esc(tr('continue_read'))}: ${esc(locName(lastSurah.name))} · ${store.state.lang === 'en' ? 'verse' : 'ayat'} ${last.ayat}</span>
      <button type="button" class="mini-btn on" data-action="surah:open" data-surah="${lastSurah.n}">→</button>
    </div>` : ''}`;
}

export function surahListHTML(q) {
  const query = q.trim().toLowerCase();
  const list = SURAHS.filter((s) => !query || s.name.my.toLowerCase().includes(query) || String(s.n) === query || s.ar.includes(q.trim()));
  if (!list.length) return `<p class="muted" style="text-align:center;padding:2rem">—</p>`;
  return list.map((s) => {
    const bms = store.state.bookmarks.filter((b) => b.startsWith(s.n + ':')).length;
    return `<button type="button" class="surah-row" data-action="surah:open" data-surah="${s.n}">
      <span class="surah-num"><span>${s.n}</span></span>
      <span class="grow"><b>${esc(locName(s.name))}</b><br><span class="cap muted" style="font-size:.74rem">${esc(locName(s.tr))} · ${s.ayat.length} ${store.state.lang === 'en' ? 'verses' : 'ayat'}${bms ? ' · ★ ' + bms : ''}</span></span>
      <span class="surah-ar" lang="ar">${esc(s.ar)}</span>
    </button>`;
  }).join('');
}

export function renderSurah(params) {
  const s = SURAHS.find((x) => x.n === Number(params.surah));
  if (!s) return `<p class="muted" style="padding:2rem">Surah tidak dijumpai.</p>`;
  const lang = store.state.lang;
  const showEn = params.trans === 'en';
  const ayat = s.ayat.map((a, i) => {
    const id = s.n + ':' + (i + 1);
    const bm = store.state.bookmarks.includes(id);
    return `<div class="ayah" id="ayah-${i + 1}">
      <div class="ar" lang="ar">${esc(a.ar)}<span class="num">${i + 1}</span></div>
      <div class="my">${esc(a.my)}</div>
      ${showEn ? `<div class="en" lang="en">${esc(a.en)}</div>` : ''}
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
    <div class="pill-toggle" role="group" aria-label="Terjemahan">
      <button type="button" class="${showEn ? '' : 'on'}" data-action="quran:trans" data-trans="my">MY</button>
      <button type="button" class="${showEn ? 'on' : ''}" data-action="quran:trans" data-trans="en">EN</button>
    </div>
  </div>
  <div class="mushaf-head">
    <div class="ar" lang="ar">${esc(s.ar)}</div>
    <div class="tr">${esc(locName(s.name))} · ${esc(locName(s.tr))} · ${s.ayat.length} ${lang === 'en' ? 'verses' : 'ayat'}</div>
  </div>
  ${s.n !== 1 ? `<div class="bismillah" lang="ar" dir="rtl">${esc(BISMILLAH)}</div>` : ''}
  ${ayat}`;
}

export const quranActions = {
  'surah:open': (el) => push('surah', { surah: el.dataset.surah }),
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

/** Carian live semasa senarai surah dipapar */
export function quranOnShow(v) {
  if (v.tab === 'quran' && !v.screen) {
    const inp = $('#quran-search');
    if (inp) inp.addEventListener('input', () => {
      const list = $('#surah-list');
      if (list) list.innerHTML = surahListHTML(inp.value);
    });
  }
}
