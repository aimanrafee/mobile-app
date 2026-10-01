/** features/qibla.js — Kompas kiblat */
import { emitLog, LOCATION, qiblaBearing, store } from '../core.js';
import { $, esc, tr } from '../ui.js';

let compassOn = false;

function compassHandler(e) {
  let heading = null;
  if (typeof e.webkitCompassHeading === 'number') heading = e.webkitCompassHeading;
  else if (typeof e.alpha === 'number') heading = 360 - e.alpha;
  if (heading === null) return;
  const dial = $('#qibla-dial'), needle = $('#qibla-needle'), deg = $('#qibla-deg');
  if (!dial) return;
  dial.style.transform = 'rotate(' + (-heading) + 'deg)';
  const b = qiblaBearing(LOCATION.lat, LOCATION.lng);
  if (needle) needle.style.transform = 'rotate(' + b + 'deg)';
  if (deg) deg.textContent = b.toFixed(1) + '°';
}

export function enableCompass() {
  const status = $('#qibla-status');
  if (compassOn) return;
  const start = () => {
    window.addEventListener('deviceorientationabsolute', compassHandler, true);
    window.addEventListener('deviceorientation', compassHandler, true);
    compassOn = true;
    emitLog('info', 'Kompas diaktifkan');
    if (status) status.textContent = '● live';
  };
  try {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then((r) => {
        if (r === 'granted') start(); else if (status) status.textContent = tr('qibla_nosupport');
      }).catch(() => { if (status) status.textContent = tr('qibla_nosupport'); });
    } else if ('ondeviceorientation' in window || 'ondeviceorientationabsolute' in window) {
      start();
    } else if (status) status.textContent = tr('qibla_nosupport');
  } catch (e) {
    emitLog('error', 'Kompas gagal: ' + e.message);
    if (status) status.textContent = tr('qibla_nosupport');
  }
}

export function renderQibla() {
  const b = qiblaBearing(LOCATION.lat, LOCATION.lng);
  let ticks = '';
  for (let a = 0; a < 360; a += 15) ticks += `<span class="tick${a % 90 === 0 ? ' card' : ''}" style="transform:rotate(${a}deg)"></span>`;
  const labs = [['U', 0], ['T', 90], ['S', 180], ['B', 270]];
  if (store.state.lang === 'en') labs[0][0] = 'N', labs[1][0] = 'E', labs[2][0] = 'S', labs[3][0] = 'W';
  ticks += labs.map(([c, a]) => `<span class="lab" style="transform:rotate(${a}deg)">${c}</span>`).join('');
  return `<div class="home-head"><p class="kicker">${esc(tr('qibla_title'))}</p></div>
  <div class="compass-stage">
    <div class="compass">
      <div class="dial" id="qibla-dial">${ticks}</div>
      <div class="needle"><div id="qibla-needle" style="transform:rotate(${b.toFixed(1)}deg);display:grid;place-items:center;height:100%;transition:transform .12s linear">
        <div class="kaaba" style="transform:translateY(-4.4rem)"><i></i></div></div></div>
    </div>
    <div class="compass-read">
      <b id="qibla-deg">${b.toFixed(1)}°</b>
      <div class="muted" style="font-size:.78rem">${esc(tr('qibla_bearing'))} · ${esc(tr('qibla_loc'))}: ${esc(LOCATION.name)}</div>
      <div class="muted" style="font-size:.78rem;margin-top:.3rem">${esc(tr('qibla_hint'))}</div>
      <button type="button" class="btn gold" style="margin-top:var(--s3)" data-action="qibla:enable">${esc(tr('qibla_enable'))}</button>
      <div class="muted" id="qibla-status" style="font-size:.72rem;margin-top:var(--s2)"></div>
    </div>
  </div>`;
}

export const qiblaActions = {
  'qibla:enable': () => enableCompass(),
};
