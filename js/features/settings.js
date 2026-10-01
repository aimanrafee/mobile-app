/** features/settings.js — Tetapan (bahasa, tema, debug, padam data) */
import { store, emitLog, toast } from '../platform/core.js';
import { esc, tr, isDark, applyTheme } from '../platform/ui.js';
import { go, render } from '../platform/router.js';
import { setDebugEnabled } from '../platform/debug.js';

export function renderSettings() {
  const st = store.state;
  return `<div class="home-head"><p class="kicker">${esc(tr('set_title'))}</p></div>
  <div class="card" style="margin:var(--s3) var(--s4) 0">
    <div class="settings-row"><span class="grow"><b>${esc(tr('s_lang'))}</b><div class="cap">MY / EN</div></span>
      <div class="pill-toggle">
        <button type="button" class="${st.lang === 'my' ? 'on' : ''}" data-action="set:lang" data-lang="my">MY</button>
        <button type="button" class="${st.lang === 'en' ? 'on' : ''}" data-action="set:lang" data-lang="en">EN</button>
      </div></div>
    <div class="settings-row"><span class="grow"><b>${esc(tr('s_theme'))}</b><div class="cap">${esc(tr('s_theme_p'))}</div></span>
      <button type="button" class="switch${isDark() ? ' on' : ''}" role="switch" aria-checked="${isDark()}" data-action="set:theme" aria-label="${esc(tr('s_theme'))}"></button></div>
    <div class="settings-row"><span class="grow"><b>${esc(tr('s_debug'))}</b><div class="cap">${esc(tr('s_debug_p'))}</div></span>
      <button type="button" class="switch${st.debug ? ' on' : ''}" role="switch" aria-checked="${st.debug}" data-action="set:debug" aria-label="${esc(tr('s_debug'))}"></button></div>
    <div class="settings-row"><span class="grow"><b>${esc(tr('t_help'))}</b><div class="cap">${esc(tr('t_help_p'))}</div></span>
      <button type="button" class="mini-btn" data-action="nav:screen" data-screen="help" aria-label="${esc(tr('t_help'))}">→</button></div>
    <div class="settings-row"><span class="grow"><b>${esc(tr('s_reset'))}</b><div class="cap">${esc(tr('s_reset_p'))}</div></span>
      <button type="button" class="tb-btn" data-action="set:reset" aria-label="${esc(tr('s_reset'))}" style="color:var(--bad)"><svg class="ic"><use href="#i-trash"/></svg></button></div>
  </div>
  <div class="card" style="margin:var(--s3) var(--s4) 0">
    <div class="settings-row"><span class="grow"><b>${esc(tr('s_about'))}</b>
      <div class="cap">Taubat.App · ${esc(tr('s_version'))} 1.0.0 · ${esc(tr('location_lbl'))}</div></span></div>
  </div>`;
}

export const settingsActions = {
  'set:lang': (el) => {
    store.set('lang', el.dataset.lang);
    emitLog('info', 'Bahasa → ' + el.dataset.lang);
    render();
  },
  'set:theme': () => {
    const next = isDark() ? 'light' : 'dark';
    store.set('theme', next, true);
    applyTheme(next);
    render(true);
  },
  'set:debug': () => {
    const on = !store.state.debug;
    store.set('debug', on, true);
    setDebugEnabled(on);
    render(true);
    if (on) toast(tr('debug_on'));
  },
  'set:reset': () => {
    if (window.confirm(tr('s_reset_confirm'))) {
      store.reset();
      emitLog('warn', 'Semua data dipadam oleh pengguna');
      toast(tr('s_reset_done'));
      go('home');
    }
  },
};
