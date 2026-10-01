/** features/fast.js — Penjejak puasa (kongsi grid kalendar + tindakan cal:* dari calendar.js) */
import { store } from '../platform/core.js';
import { esc, tr, monthGridHTML, dateKey, parseKey } from '../platform/ui.js';

export function renderFast(params) {
  const now = new Date();
  let monthCount = 0;
  Object.keys(store.state.puasa).forEach((key) => { const d = parseKey(key); if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) monthCount++; });
  const total = Object.keys(store.state.puasa).length;
  return `<div class="home-head"><p class="kicker">${esc(tr('fast_title'))}</p>
      <p class="muted" style="font-size:.85rem;margin:.4rem 0 0">${esc(tr('fast_hint'))}</p></div>
    ${monthGridHTML(params, 'fast')}
    <div class="streak-row">
      <div class="card stat-chip"><b>${monthCount}</b><span>${esc(tr('fast_month'))}</span></div>
      <div class="card stat-chip"><b>${total}</b><span>${esc(tr('fast_total'))}</span></div>
    </div>`;
}

/* Nota: ketik hari dikendali oleh calendarActions['cal:day'] (cawangan view.screen === 'fast'). */
export const fastActions = {};
