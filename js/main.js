/** main.js — orkestrasi Taubat.App (entry point) */
import { initApp } from './app.js';
import { initDebug } from './debug.js';
import { emitLog } from './core.js';

function boot() {
  try {
    initDebug();
    initApp();
  } catch (e) {
    emitLog('error', 'Boot gagal: ' + (e && e.message));
    // paparan minimum jika modul gagal
    const s = document.getElementById('screen');
    if (s) s.textContent = 'Maaf, aplikasi gagal dimulakan. Cuba segar semula halaman.';
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
