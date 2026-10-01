/** app.js — Wiring modular Taubat.App (router + pendaftaran ciri)
 *
 *  Fail ini SENGAJA nipis: hanya daftar skrin/tindakan dan hidupkan shell.
 *  Logik setiap skrin tinggal dalam `js/features/*.js`, helpers dalam `js/ui.js`,
 *  navigasi dalam `js/router.js`.
 *
 *  Tambah ciri baru: cipta fail dalam features/ → import di bawah → registerScreen + registerActions.
 */
import { store, emitLog } from './platform/core.js';
import {
  view, go, push, back, render,
  registerScreen, registerActions, registerOnShow, initShell
} from './platform/router.js';
import { isDark, applyTheme } from './platform/ui.js';
import { setDebugEnabled } from './platform/debug.js';

import { renderHome, homeActions, homeOnShow } from './features/home.js';
import { renderQuran, renderSurah, quranActions, quranOnShow, quranSurahOnShow } from './features/quran.js';
import { renderIqra, renderLevel, iqraActions } from './features/iqra.js';
import { renderDoa, doaActions } from './features/doa.js';
import { renderMore } from './features/more.js';
import { renderTasbih, tasbihActions } from './features/tasbih.js';
import { renderCalendar, calendarActions } from './features/calendar.js';
import { renderZakat, zakatActions } from './features/zakat.js';
import { renderQibla, qiblaActions } from './features/qibla.js';
import { renderFast, fastActions } from './features/fast.js';
import { renderHaid, haidActions } from './features/haid.js';
import { renderSettings, settingsActions } from './features/settings.js';
import { renderHelp, helpActions } from './features/help.js';
import { renderIlmu, ilmuActions, ilmuOnShow } from './features/ilmu.js';

/* ---------- daftar skrin (id + judul topbar) ---------- */
registerScreen('home', renderHome, { title: null });
registerScreen('quran', renderQuran, { title: 'Al-Quran' });
registerScreen('surah', renderSurah, { title: 'Al-Quran' });
registerScreen('iqra', renderIqra, { title: "Iqra'" });
registerScreen('level', renderLevel, { title: "Iqra'" });
registerScreen('doa', renderDoa, { title: 'Zikir' });
registerScreen('more', renderMore, { title: 'Lainnya' });
registerScreen('tasbih', renderTasbih, { title: 'Tasbih' });
registerScreen('calendar', renderCalendar, { title: 'Kalendar' });
registerScreen('zakat', renderZakat, { title: 'Zakat' });
registerScreen('qibla', renderQibla, { title: 'Kiblat' });
registerScreen('fast', renderFast, { title: 'Puasa' });
registerScreen('haid', renderHaid, { title: 'Haid' });
registerScreen('settings', renderSettings, { title: 'Tetapan' });
registerScreen('help', renderHelp, { title: 'Panduan' });
registerScreen('ilmu', renderIlmu, { title: 'Ilmu' });

/* ---------- daftar tindakan setiap ciri ---------- */
registerActions(homeActions);
registerActions(quranActions);
registerActions(iqraActions);
registerActions(doaActions);
registerActions(tasbihActions);
registerActions(calendarActions);
registerActions(zakatActions);
registerActions(qiblaActions);
registerActions(fastActions);
registerActions(haidActions);
registerActions(settingsActions);
registerActions(helpActions);
registerActions(ilmuActions);

/* ---------- hook selepas render (timer, carian live) ---------- */
registerOnShow((v) => v.tab === 'home' && !v.screen, homeOnShow);
registerOnShow((v) => v.tab === 'quran' && !v.screen, quranOnShow);
registerOnShow((v) => v.screen === 'surah', quranSurahOnShow);
registerOnShow((v) => v.screen === 'ilmu', ilmuOnShow);

/* ---------- inisialisasi (kekal API lama: initApp) ---------- */
export function initApp() {
  initShell({ store, applyTheme, isDark, setDebugEnabled });
  emitLog('info', 'Taubat.App dimulakan · ' + navigator.userAgent.slice(0, 80));
  render();
}

/* Re-export untuk keserasian (main.js / kod lama yang import dari app.js) */
export { view, go, push, back, render };
