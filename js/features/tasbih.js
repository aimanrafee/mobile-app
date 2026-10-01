/** features/tasbih.js — Tasbih digital */
import { store, toast } from '../platform/core.js';
import { esc, tr, dateKey, vibrate } from '../platform/ui.js';
import { render } from '../platform/router.js';

export const PHRASES = [
  { id: 'subhanallah', ar: 'سُبْحَانَ اللَّهِ', latin: 'Subhanallah', my: 'Maha Suci Allah', en: 'Glory be to Allah' },
  { id: 'alhamdulillah', ar: 'الْحَمْدُ لِلَّهِ', latin: 'Alhamdulillah', my: 'Segala puji bagi Allah', en: 'All praise is due to Allah' },
  { id: 'allahuakbar', ar: 'اللَّهُ أَكْبَرُ', latin: 'Allahu Akbar', my: 'Allah Maha Besar', en: 'Allah is the Greatest' },
  { id: 'hasbunallah', ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', latin: "Hasbunallah wa ni'mal wakil", my: 'Cukuplah Allah bagi kami, Dia sebaik-baik pelindung', en: 'Allah is sufficient for us, the best Disposer of affairs' },
  { id: 'istighfar', ar: 'أَسْتَغْفِرُ اللَّهَ', latin: 'Astaghfirullah', my: 'Aku memohon ampun kepada Allah', en: "I seek Allah's forgiveness" }
];

export function renderTasbih() {
  const ts = store.state.tasbih;
  const today = dateKey(new Date());
  const todayCount = ts.day === today ? ts.today : 0;
  const ph = PHRASES.find((p) => p.id === ts.phrase) || PHRASES[0];
  const C = 2 * Math.PI * 92;
  const off = C * (1 - Math.min(1, ts.count / ts.target));
  return `
  <div class="tasbih-stage">
    <p class="kicker">${esc(tr('phrase'))}</p>
    <div class="tasbih-phrase" lang="ar" dir="rtl">${esc(ph.ar)}</div>
    <div class="tasbih-latin">${esc(ph.latin)} — ${esc(store.state.lang === 'en' ? ph.en : ph.my)}</div>
    <button type="button" class="tasbih-ring" data-action="tasbih:tap" aria-label="${esc(tr('tap_to_count'))}">
      <svg class="ring" viewBox="0 0 200 200"><circle class="tr-bg" cx="100" cy="100" r="92"/><circle class="tr-fg" cx="100" cy="100" r="92" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></svg>
      <span><span class="tasbih-count" id="tasbih-count">${ts.count}</span><div class="tasbih-target">/ ${ts.target}</div></span>
    </button>
    <div class="tasbih-actions">
      <button type="button" class="btn ghost" data-action="tasbih:reset"><svg class="ic" style="width:1rem;height:1rem"><use href="#i-reset"/></svg>${esc(tr('reset'))}</button>
      ${[33, 99, 100].map((n) => `<button type="button" class="btn ${ts.target === n ? 'gold' : 'ghost'}" data-action="tasbih:target" data-n="${n}">${n}</button>`).join('')}
    </div>
  </div>
  <div class="tasbih-presets">${PHRASES.map((p) =>
    `<button type="button" class="chip${p.id === ts.phrase ? ' on' : ''}" data-action="tasbih:phrase" data-phrase="${p.id}">${esc(p.latin)}</button>`).join('')}</div>
  <p class="muted" style="text-align:center;font-size:.78rem;margin-top:var(--s4)">${esc(tr('total'))}: <b>${todayCount}</b></p>`;
}

export const tasbihActions = {
  'tasbih:tap': () => {
    store.update((s) => {
      const today = dateKey(new Date());
      if (s.tasbih.day !== today) { s.tasbih.day = today; s.tasbih.today = 0; }
      s.tasbih.count += 1; s.tasbih.today += 1;
      if (s.tasbih.count >= s.tasbih.target) {
        s.tasbih.count = 0;
        setTimeout(() => toast('✓ ' + tr('completed')), 50);
        vibrate([40, 60, 40]);
      } else vibrate(10);
    });
    render(true);
  },
  'tasbih:reset': () => { store.update((s) => { s.tasbih.count = 0; }); render(true); },
  'tasbih:target': (el) => { store.update((s) => { s.tasbih.target = Number(el.dataset.n); s.tasbih.count = 0; }); render(true); },
  'tasbih:phrase': (el) => { store.update((s) => { s.tasbih.phrase = el.dataset.phrase; s.tasbih.count = 0; }); render(true); },
};
