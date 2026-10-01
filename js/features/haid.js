/** features/haid.js — Penjejak haid (kongsi grid kalendar + tindakan cal:* dari calendar.js) */
import { store, emitLog } from '../core.js';
import { esc, tr, monthGridHTML, dateKey, parseKey, addDays } from '../ui.js';

export function renderHaid(params) {
  const active = !!store.state.haid[dateKey(new Date())];
  const keys = Object.keys(store.state.haid).sort();
  const starts = [];
  keys.forEach((k) => { if (!store.state.haid[dateKey(addDays(parseKey(k), -1))]) starts.push(k); });
  let cyc = '—';
  if (starts.length >= 2) {
    const gaps = [];
    for (let i = 1; i < starts.length; i++) gaps.push((parseKey(starts[i]) - parseKey(starts[i - 1])) / 864e5);
    cyc = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
  }
  return `<div class="home-head"><p class="kicker">${esc(tr('haid_title'))}</p>
      <p class="muted" style="font-size:.85rem;margin:.4rem 0 0">${esc(tr('haid_hint'))}</p></div>
    <div class="streak-row">
      <div class="card stat-chip"><b style="font-size:1.05rem;color:${active ? 'var(--period-ink)' : 'inherit'}">${active ? '●' : '○'} ${active ? esc(tr('haid_active')) : '—'}</b><span>${esc(tr('today_lbl'))}</span></div>
      <div class="card stat-chip"><b>${cyc}</b><span>${esc(tr('haid_cycle'))}${cyc !== '—' ? ' (' + esc(tr('days')) + ')' : ''}</span></div>
    </div>
    ${monthGridHTML(params, 'haid')}`;
}

/* Nota: ketik hari dikendali oleh calendarActions['cal:day'] (cawangan view.screen === 'haid'). */
export const haidActions = {};
