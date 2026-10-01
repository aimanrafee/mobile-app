/** features/home.js — Skrin Utama (tracker solat + streak + heatmap + quote) */
import { store, emitLog, prayerTimes, PRAYERS, nextPrayer, toast } from '../core.js';
import { QUOTES } from '../data.js';
import {
  $, esc, tr, every, dateKey, parseKey, addDays, fmt12, dayName, fmtDate,
  hijriLabel, dayRecord, dayCount, isExempt, greetKey
} from '../ui.js';
import { view, render } from '../router.js';

export function renderHome() {
  const today = new Date();
  const selKey = view.params.day || dateKey(today);
  const selDate = parseKey(selKey);
  const lang = store.state.lang;
  const times = prayerTimes(selDate);
  const rec = dayRecord(selKey);
  const exempt = isExempt(selKey);

  let strip = '';
  for (let i = -3; i <= 3; i++) {
    const d = addDays(today, i);
    const k = dateKey(d);
    const dots = Math.min(5, dayCount(k));
    strip += `<button type="button" class="day-cell${k === selKey ? ' sel' : ''}${k === dateKey(today) ? ' today' : ''}" data-action="day:select" data-day="${k}" aria-label="${esc(fmtDate(d, lang))}">
      <b>${d.getDate()}</b><span>${esc(dayName(d, lang))}</span>
      <span class="dots" aria-hidden="true">${'<i></i>'.repeat(dots)}</span></button>`;
  }

  const np = nextPrayer(new Date());
  const npInfo = PRAYERS.find((p) => p.id === np.id);
  const pName = lang === 'en' ? npInfo.en : npInfo.my;

  let rows = '';
  const nowMin = today.getHours() * 60 + today.getMinutes();
  const isToday = selKey === dateKey(today);
  PRAYERS.forEach((p) => {
    const st = rec[p.id];
    const isNow = isToday && !exempt && times[p.id] <= nowMin && (nextPrayer(new Date()).id === p.id);
    const name = lang === 'en' ? p.en : p.my;
    let right;
    if (exempt) right = `<span class="exempt-tag">${esc(tr('exempt'))}</span>`;
    else right = `<span class="p-status" role="group" aria-label="${esc(name)}">
        <button type="button" class="st-btn${st === 'ontime' ? ' on-ontime' : ''}" data-action="prayer:set" data-prayer="${p.id}" data-status="ontime">${esc(tr('ontime'))}</button>
        <button type="button" class="st-btn${st === 'late' ? ' on-late' : ''}" data-action="prayer:set" data-prayer="${p.id}" data-status="late">${esc(tr('late'))}</button>
        <button type="button" class="st-btn${st === 'qada' ? ' on-qada' : ''}" data-action="prayer:set" data-prayer="${p.id}" data-status="qada">${esc(tr('qada'))}</button>
      </span>`;
    rows += `<div class="p-row${isNow ? ' now' : ''}">
      <span class="p-ico"><svg class="ic"><use href="#${p.icon}"/></svg></span>
      <span><span class="p-name">${esc(name)}</span><br><span class="p-time">${fmt12(times[p.id])}</span></span>
      ${right}</div>`;
  });

  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const k = dateKey(addDays(today, -i));
    if (dayCount(k) > 0 || isExempt(k)) streak++;
    else if (i === 0) continue; else break;
  }
  let weekDone = 0;
  for (let i = 0; i < 7; i++) weekDone += dayCount(dateKey(addDays(today, -i)));

  let heat = '';
  for (let i = 27; i >= 0; i--) {
    const k = dateKey(addDays(today, -i));
    const c = isExempt(k) ? 5 : dayCount(k);
    const lvl = c === 5 ? 'l2' : (c === 0 ? '' : 'l' + Math.min(4, c));
    heat += `<i class="${lvl}" title="${k}"></i>`;
  }

  const q = QUOTES[Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 864e5) % QUOTES.length];

  return `
  <div class="home-head">
    <p class="kicker">${esc(tr(greetKey()))}</p>
    <div class="date-row" style="margin-top:var(--s2)">
      <div>
        <span class="day-big">${esc(dayName(selDate, lang, true))}</span>
        <div class="date-sub">${esc(fmtDate(selDate, lang))} · <span class="date-hijri">${esc(hijriLabel(selDate, lang))}H</span></div>
      </div>
    </div>
    <div class="weekstrip" role="group" aria-label="Minggu">${strip}</div>
  </div>

  <div class="next-card" id="next-card">
    <div class="nc-kick">${esc(tr('next_prayer'))}</div>
    <div class="nc-name">${esc(pName)} · ${fmt12(np.at)}</div>
    <div class="nc-count" id="nc-count">--:--:--</div>
    <div class="nc-meta">${esc(tr('location_lbl'))}</div>
    <div class="nc-progress"><i id="nc-bar" style="width:0%"></i></div>
  </div>

  <div class="card prayer-list" aria-label="Senarai solat">${rows}</div>

  <div class="streak-row">
    <div class="card stat-chip"><b>${streak}</b><span>${esc(tr('streak'))}</span></div>
    <div class="card stat-chip"><b>${weekDone}</b><span>${esc(tr('week_done'))}</span></div>
  </div>

  <div class="sec-title"><h2>${esc(tr('consistency'))}</h2></div>
  <div class="card heatmap-card">
    <div class="heatmap" aria-hidden="true">${heat}</div>
    <div class="heat-legend">${esc(tr('less'))} <i style="background:var(--heat-0)"></i><i style="background:var(--heat-2)"></i><i style="background:var(--heat-4)"></i> ${esc(tr('more_lbl'))}</div>
  </div>

  <div class="sec-title"><h2>${esc(tr('daily_quote'))}</h2></div>
  <div class="card quote-card">
    <div class="q-ar" lang="ar" dir="rtl">${esc(q.ar)}</div>
    <div class="q-tx">“${esc(lang === 'en' ? q.en : q.my)}”</div>
    <div class="q-ref">${esc(q.ref)}</div>
  </div>`;
}

export function tickCountdown() {
  const el = $('#nc-count'); if (!el) return;
  const now = new Date();
  const np = nextPrayer(now);
  let ms = np.inMin * 60000;
  if (ms < 0) ms = 0;
  const h = Math.floor(ms / 36e5), m = Math.floor(ms % 36e5 / 6e4), s = Math.floor(ms % 6e4 / 1e3);
  el.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  const bar = $('#nc-bar');
  if (bar) {
    const times = prayerTimes(np.day);
    const idx = PRAYERS.findIndex((p) => p.id === np.id);
    const prev = idx === 0 && np.day.getDate() !== now.getDate() ? now.getHours() * 60 + now.getMinutes()
      : (idx > 0 ? times[PRAYERS[idx - 1].id] : 0);
    const span = np.id === 'subuh' && np.day.getDate() !== now.getDate() ? 1 : Math.max(1, np.at - prev);
    bar.style.width = Math.max(2, Math.min(100, 100 - (np.inMin / span) * 100)) + '%';
  }
}

function setPrayerStatus(prayer, status) {
  const key = view.params.day || dateKey(new Date());
  store.update((s) => {
    const rec = Object.assign({}, s.prayers[key]);
    if (rec[prayer] === status) delete rec[prayer]; else rec[prayer] = status;
    s.prayers[key] = rec;
  });
  emitLog('info', `Solat ${prayer} @ ${key} → ${status}`);
  toast(tr('prayer_marked') + ' ✓');
  render(true);
}

export const homeActions = {
  'day:select': (el) => { view.params.day = el.dataset.day; render(true); },
  'prayer:set': (el) => setPrayerStatus(el.dataset.prayer, el.dataset.status),
};

/** Hidupkan undur detik semasa skrin home dipapar */
export function homeOnShow(v) {
  if (v.tab === 'home' && !v.screen) {
    tickCountdown();
    every(1000, tickCountdown);
  }
}
