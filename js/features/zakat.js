/** features/zakat.js — Kalkulator zakat harta */
import { store, emitLog } from '../platform/core.js';
import { $, esc, tr } from '../platform/ui.js';

export function renderZakat() {
  return `<div class="home-head"><p class="kicker">${esc(tr('zakat_title'))}</p></div>
  <div class="card form-card">
    <div class="field"><label for="z-cash">${esc(tr('z_cash'))}</label><input type="number" min="0" inputmode="decimal" id="z-cash" placeholder="0"></div>
    <div class="field"><label for="z-gold">${esc(tr('z_gold'))}</label><input type="number" min="0" inputmode="decimal" id="z-gold" placeholder="0"></div>
    <div class="field"><label for="z-invest">${esc(tr('z_invest'))}</label><input type="number" min="0" inputmode="decimal" id="z-invest" placeholder="0"></div>
    <div class="field"><label for="z-debt">${esc(tr('z_debt'))}</label><input type="number" min="0" inputmode="decimal" id="z-debt" placeholder="0"></div>
    <div class="field"><label for="z-nisab">${esc(tr('z_nisab'))}</label><input type="number" min="0" inputmode="decimal" id="z-nisab" value="${store.state.nisab}"></div>
    <button type="button" class="btn block" data-action="zakat:calc">${esc(tr('z_calc'))}</button>
    <div id="zakat-result"></div>
  </div>`;
}

export const zakatActions = {
  'zakat:calc': () => {
    const num = (id) => Math.max(0, parseFloat(($(id) || {}).value) || 0);
    const total = num('#z-cash') + num('#z-gold') + num('#z-invest') - num('#z-debt');
    const nisab = num('#z-nisab') || 1;
    store.set('nisab', nisab, true);
    const box = $('#zakat-result');
    if (!box) return;
    const fmtRM = (n) => 'RM ' + n.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (total >= nisab) {
      box.innerHTML = `<div class="result-box"><span class="cap muted">${esc(tr('z_total'))}: ${fmtRM(total)}</span><b>${fmtRM(total * 0.025)}</b><span class="cap muted">${esc(tr('z_due'))}</span></div>`;
      emitLog('info', `Zakat: total ${total}, wajib ${total * 0.025}`);
    } else {
      box.innerHTML = `<div class="result-box"><span class="cap muted">${esc(tr('z_total'))}: ${fmtRM(Math.max(0, total))}</span><div style="margin-top:.4rem;font-size:.9rem">${esc(tr('z_none'))}</div></div>`;
    }
  },
};
