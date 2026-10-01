/** features/more.js — Senarai alat (Lainnya) */
import { esc, tr } from '../ui.js';

const TOOLS = [
  { id: 'tasbih', icon: 'i-beads', h: 't_tasbih', p: 't_tasbih_p' },
  { id: 'calendar', icon: 'i-cal', h: 't_cal', p: 't_cal_p' },
  { id: 'zakat', icon: 'i-scale', h: 't_zakat', p: 't_zakat_p' },
  { id: 'qibla', icon: 'i-compass', h: 't_qibla', p: 't_qibla_p' },
  { id: 'fast', icon: 'i-moon', h: 't_fast', p: 't_fast_p' },
  { id: 'haid', icon: 'i-drop', h: 't_haid', p: 't_haid_p' },
  { id: 'settings', icon: 'i-gear', h: 't_settings', p: 't_settings_p' },
];

export function renderMore() {
  return `<div class="home-head"><p class="kicker">${esc(tr('tools_title'))}</p></div>
  <div class="tool-grid">${TOOLS.map((x) => `
    <button type="button" class="card tool-card" data-action="nav:screen" data-screen="${x.id}">
      <span class="t-ico"><svg class="ic"><use href="#${x.icon}"/></svg></span>
      <h3>${esc(tr(x.h))}</h3><p>${esc(tr(x.p))}</p>
    </button>`).join('')}</div>
  <p class="muted" style="text-align:center;font-size:.72rem;padding:var(--s5) var(--s4)">Taubat.App · Tak pernah terlambat untuk pulang</p>`;
}

/** Daftar alat — ciri baru boleh import & tambah baris sendiri tanpa sentuh fail ini,
 *  atau daftar skrin sendiri dan pautkan dari sini via nav:screen. */
export function getTools() { return TOOLS; }
