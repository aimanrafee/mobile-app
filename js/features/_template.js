/** features/_template.js — TEMPLATE ciri baru (salin fail ini sebagai contoh)
 *
 *  1. Salin fail ini → `js/features/namaCiri.js`, namakan semula fungsi.
 *  2. Daftar dalam `js/app.js`:
 *       import { renderNamaCiri, namaCiriActions } from './features/namaCiri.js';
 *       registerScreen('namaCiri', renderNamaCiri, { title: 'Judul Topbar' });
 *       registerActions(namaCiriActions);
 *  3. (Pilihan) daftar onShow jika perlu pasang listener selepas render:
 *       registerOnShow((v) => v.screen === 'namaCiri', () => {...});
 *  4. Buka skrin: push('namaCiri') atau <button data-action="nav:screen" data-screen="namaCiri">
 */
import { store } from '../core.js';
import { esc, tr } from '../ui.js';
import { render } from '../router.js';

export function renderNamaCiri(params) {
  return `<div class="home-head"><p class="kicker">${esc(tr('tools_title'))}</p></div>
  <div class="card form-card"><p class="muted">Gantikan dengan UI ciri anda.</p></div>`;
}

export const namaCiriActions = {
  // 'namaCiri:aksi': (el) => { store.update(() => {}); render(true); },
};
