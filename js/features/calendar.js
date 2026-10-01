/** features/calendar.js — Kalendar Hijri + tarikh penting */
import { store } from '../core.js';
import { ISLAMIC_EVENTS } from '../data.js';
import {
  esc, tr, monthGridHTML, dateKey, parseKey, addDays, fmtDate, dayCount,
  toHijri, hijriLabel
} from '../ui.js';
import { view, render } from '../router.js';

export function renderCalendar(params) {
  const lang = store.state.lang;
  const evs = [];
  const today = new Date();
  for (let i = 0; i < 400 && evs.length < 5; i++) {
    const d = addDays(today, i);
    const h = toHijri(d);
    const ev = ISLAMIC_EVENTS.find((e) => e.m === h.m && e.d === h.d);
    if (ev) evs.push({ ev, date: d, away: i });
  }
  let selInfo = '';
  if (params.sel) {
    const d = parseKey(params.sel);
    const c = dayCount(params.sel);
    selInfo = `<div class="card form-card"><b>${esc(fmtDate(d, lang))}</b><div class="cap muted" style="margin-top:.2rem">
      ${esc(hijriLabel(d, lang))}H · ${c}/5 ${lang === 'en' ? 'prayers' : 'solat'}
      ${store.state.haid[params.sel] ? ' · ' + esc(tr('exempt')) : ''}${store.state.puasa[params.sel] ? ' · ' + esc(tr('fast_title')) : ''}</div></div>`;
  }
  return `<div class="home-head"><p class="kicker">${esc(tr('t_cal'))}</p>
      <h2 class="h-display" style="margin:.3rem 0 0;font-size:1.4rem">${esc(hijriLabel(today, lang))}H</h2></div>
    ${monthGridHTML(params, 'cal')}
    ${selInfo}
    <div class="sec-title"><h2>${esc(tr('upcoming'))}</h2></div>
    <div class="card event-list" style="padding:0 var(--s4)">${evs.map((x) => `
      <div class="event-row"><span class="event-dot"></span><span class="grow"><b>${esc(lang === 'en' ? x.ev.en : x.ev.my)}</b>
      <div class="cap">${esc(fmtDate(x.date, lang))} · ${x.away === 0 ? esc(tr('today_lbl')) : x.away + ' ' + esc(tr('days_away'))}</div></span></div>`).join('')}</div>`;
}

export const calendarActions = {
  'cal:nav': (el) => { view.params.mo = (view.params.mo || 0) + Number(el.dataset.dir); render(true); },
  'cal:day': (el) => {
    const k = el.dataset.day;
    if (view.screen === 'fast') {
      store.update((s) => { if (s.puasa[k]) delete s.puasa[k]; else s.puasa[k] = true; });
    } else if (view.screen === 'haid') {
      store.update((s) => { if (s.haid[k]) delete s.haid[k]; else s.haid[k] = true; });
    } else {
      view.params.sel = k;
    }
    render(true);
  },
};
