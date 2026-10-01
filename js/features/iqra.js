/** features/iqra.js — Tahap Iqra' + sel huruf */
import { store, toast } from '../platform/core.js';
import { IQRA_LEVELS } from '../data.js';
import { esc, tr, locName } from '../platform/ui.js';
import { push, render } from '../platform/router.js';

function levelProgress(lv) {
  const done = lv.cells.filter((c, i) => store.state.iqra[lv.id + ':' + i]).length;
  return { done, total: lv.cells.length, pct: Math.round((done / lv.cells.length) * 100) };
}

export function renderIqra() {
  const cards = IQRA_LEVELS.map((lv) => {
    const p = levelProgress(lv);
    return `<button type="button" class="card level-card" data-action="iqra:open" data-level="${lv.id}">
      <span class="done-ring${p.pct === 100 ? ' on' : ''}">${p.pct === 100 ? '<svg class="ic"><use href="#i-check"/></svg>' : ''}</span>
      <span class="lv">${p.pct}<small style="font-size:.9rem">%</small></span>
      <h3>${esc(locName(lv.title))}</h3><p>${esc(locName(lv.desc))}</p>
    </button>`;
  }).join('');
  return `<div class="home-head"><p class="kicker">${esc(tr('iqra_title'))}</p>
    <h2 class="h-display" style="margin:.3rem 0 0;font-size:1.4rem">${esc(tr('iqra_sub'))}</h2></div>
    <div class="level-grid">${cards}</div>`;
}

export function renderLevel(params) {
  const lv = IQRA_LEVELS.find((x) => x.id === params.level);
  if (!lv) return '';
  const p = levelProgress(lv);
  const cells = lv.cells.map((c, i) => {
    const key = lv.id + ':' + i;
    const done = !!store.state.iqra[key];
    return `<button type="button" class="iqra-cell${c.red ? ' red' : ''}${done ? ' mastered' : ''}" data-action="iqra:cell" data-key="${key}" aria-pressed="${done}" aria-label="${esc(c.latin || c.ar)}">
      ${esc(c.ar)}${c.latin ? `<small>${esc(c.latin)}</small>` : ''}</button>`;
  }).join('');
  return `<div class="home-head"><p class="kicker">${esc(locName(lv.title))}</p>
    <p class="muted" style="font-size:.85rem;margin:.4rem 0 0">${esc(tr('tap_mastered'))} · ${p.done}/${p.total}</p></div>
    <div class="iqra-grid">${cells}</div>
    <div class="tasbih-actions" style="margin:var(--s4)">
      <button type="button" class="btn ghost" data-action="iqra:reset" data-level="${lv.id}">${esc(tr('reset_level'))}</button>
      <button type="button" class="btn gold" data-action="iqra:all" data-level="${lv.id}">${esc(tr('mark_all_done'))}</button>
    </div>`;
}

export const iqraActions = {
  'iqra:open': (el) => push('level', { level: el.dataset.level }),
  'iqra:cell': (el) => {
    const key = el.dataset.key;
    store.update((s) => { if (s.iqra[key]) delete s.iqra[key]; else s.iqra[key] = true; });
    render(true);
  },
  'iqra:all': (el) => {
    const lv = IQRA_LEVELS.find((x) => x.id === el.dataset.level);
    if (!lv) return;
    store.update((s) => { lv.cells.forEach((c, i) => { s.iqra[lv.id + ':' + i] = true; }); });
    toast(tr('level_done'));
    render(true);
  },
  'iqra:reset': (el) => {
    const lv = IQRA_LEVELS.find((x) => x.id === el.dataset.level);
    if (!lv) return;
    store.update((s) => { lv.cells.forEach((c, i) => { delete s.iqra[lv.id + ':' + i]; }); });
    render(true);
  },
};
