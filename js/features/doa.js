/** features/doa.js — Al-Mathurat + koleksi doa */
import { store } from '../platform/core.js';
import { MATHURAT, DUA_CATS, DUAS } from '../data.js';
import { esc, tr, locName, dateKey, copyText, vibrate } from '../platform/ui.js';
import { view, render } from '../platform/router.js';

function mathuratToday() {
  const k = dateKey(new Date());
  return store.state.mathurat[k] || {};
}

export function renderDoa() {
  const mode = view.params.doaMode || (new Date().getHours() < 15 ? 'morning' : 'evening');
  const cat = view.params.duaCat || 'harian';
  const lang = store.state.lang;
  const today = mathuratToday();

  const cards = MATHURAT.map((m) => {
    const done = today[m.id] || 0;
    const left = Math.max(0, m.count - done);
    const finished = left === 0;
    return `<div class="card dua-card">
      <div style="display:flex;justify-content:space-between;gap:1rem;align-items:baseline">
        <b>${esc(locName(m.title))}</b><span class="cap muted">${esc(locName(m.sub))}</span>
      </div>
      <div class="ar" lang="ar" style="margin-top:.6rem">${esc(m.ar)}</div>
      <div class="my">${esc(lang === 'en' ? m.en : m.my)}</div>
      <div class="dua-foot">
        <span class="cap muted">${finished ? '✓ ' + esc(tr('completed')) : m.count + '×'}</span>
        <button type="button" class="count-btn${finished ? ' done' : ''}" data-action="mathurat:count" data-id="${m.id}" ${finished ? 'disabled' : ''}
          aria-label="${esc(tr('tap_to_count'))}">${finished ? '✓' : done + ' / ' + m.count}</button>
      </div>
    </div>`;
  }).join('');

  const chips = DUA_CATS.map((c) =>
    `<button type="button" class="chip${c.id === cat ? ' on' : ''}" data-action="dua:cat" data-cat="${c.id}">${esc(locName(c))}</button>`).join('');

  const duas = DUAS.filter((d) => d.cat === cat).map((d) => `<div class="card dua-card">
      <b>${esc(locName(d.title))}</b>
      <div class="ar" lang="ar" style="margin-top:.6rem">${esc(d.ar)}</div>
      <div class="my">${esc(lang === 'en' ? d.en : d.my)}</div>
      <div class="dua-foot"><span></span>
        <button type="button" class="mini-btn" data-action="dua:copy" data-ar="${esc(d.ar)}" data-tx="${esc(lang === 'en' ? d.en : d.my)}">
          <svg class="ic"><use href="#i-copy"/></svg>${esc(tr('copy'))}</button>
      </div>
    </div>`).join('');

  return `
  <div class="quran-top">
    <div class="pill-toggle" role="group" aria-label="Waktu zikir">
      <button type="button" class="${mode === 'morning' ? 'on' : ''}" data-action="doa:mode" data-mode="morning">${esc(tr('morning'))}</button>
      <button type="button" class="${mode === 'evening' ? 'on' : ''}" data-action="doa:mode" data-mode="evening">${esc(tr('evening'))}</button>
    </div>
  </div>
  ${cards}
  <div class="sec-title"><h2>${esc(tr('dua_collection'))}</h2></div>
  <div class="dua-cats">${chips}</div>
  ${duas}`;
}

export const doaActions = {
  'doa:mode': (el) => { view.params.doaMode = el.dataset.mode; render(true); },
  'dua:cat': (el) => { view.params.duaCat = el.dataset.cat; render(true); },
  'dua:copy': (el) => {
    const text = el.dataset.ar + '\n' + el.dataset.tx;
    copyText(text);
  },
  'mathurat:count': (el) => {
    const k = dateKey(new Date());
    const id = el.dataset.id;
    const item = MATHURAT.find((m) => m.id === id);
    store.update((s) => {
      const day = Object.assign({}, s.mathurat[k]);
      day[id] = Math.min(item.count, (day[id] || 0) + 1);
      s.mathurat[k] = day;
    });
    vibrate(12);
    render(true);
  },
};
