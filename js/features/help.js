/** features/help.js — Panduan Pengguna (user section: cara guna + FAQ + info aplikasi) */
import { store } from '../platform/core.js';
import { esc, tr } from '../platform/ui.js';

const SECTIONS = [
  { icon: 'i-home', t: { my: 'Jejak solat harian', en: 'Track daily prayers' }, d: { my: 'Di skrin Utama, ketik Tepat / Lewat / Qada untuk setiap waktu. Ketik semula untuk padam. Nombor, streak dan heatmap dikemas kini automatik.', en: 'On Home, tap On time / Late / Qada for each prayer. Tap again to clear. Streak and heatmap update automatically.' } },
  { icon: 'i-book', t: { my: 'Baca Al-Quran', en: 'Read the Quran' }, d: { my: 'Cari surah, buka dan baca terjemahan (togol MY/EN). Tanda ayat dengan ikon penanda; sambung bacaan terakhir dari sepanduk di atas senarai.', en: 'Search surahs, open and read the translation (MY/EN toggle). Bookmark verses; resume from the banner above the list.' } },
  { icon: 'i-iqra', t: { my: "Belajar Iqra'", en: "Learn Iqra'" }, d: { my: 'Pilih tahap 1–6, ketik huruf yang dikuasai. Peratus menunjukkan kemajuan; tanda semua selesai atau set semula bila-bila masa.', en: 'Pick level 1–6, tap mastered letters. The percentage shows progress; mark all done or reset anytime.' } },
  { icon: 'i-doa', t: { my: 'Zikir & doa', en: 'Dhikr & duas' }, d: { my: 'Ketik butang kiraan untuk setiap zikir Mathurat pagi/petang. Tapis 100+ doa mengikut kategori dan salin teksnya.', en: 'Tap the counter for each morning/evening Mathurat dhikr. Filter 100+ duas by category and copy the text.' } },
  { icon: 'i-beads', t: { my: 'Tasbih', en: 'Tasbih' }, d: { my: 'Ketik cincin besar untuk mengira. Pilih zikir dan sasaran 33/99/100. Jumlah hari ini dikira automatik.', en: 'Tap the big ring to count. Choose a dhikr and a 33/99/100 target. Today’s total is automatic.' } },
  { icon: 'i-cal', t: { my: 'Kalendar', en: 'Calendar' }, d: { my: 'Lihat tarikh Hijri dan 5 tarikh penting akan datang. Ketik mana-mana hari untuk lihat rekod solatnya.', en: 'See the Hijri date and 5 upcoming Islamic dates. Tap any day to view its prayer record.' } },
  { icon: 'i-scale', t: { my: 'Kalkulator zakat', en: 'Zakat calculator' }, d: { my: 'Isi wang, emas, pelaburan dan hutang. Jika cukup nisab, zakat 2.5% dikira serta-merta.', en: 'Fill in cash, gold, investments and debts. If nisab is met, 2.5% zakat is calculated instantly.' } },
  { icon: 'i-compass', t: { my: 'Kompas kiblat', en: 'Qibla compass' }, d: { my: 'Tekan Aktifkan kompas dan benarkan akses sensor (iPhone). Pusing telefon sehingga anak panah ke atas.', en: 'Press Enable compass and allow sensor access (iPhone). Rotate the phone until the arrow points up.' } },
  { icon: 'i-moon', t: { my: 'Puasa & haid', en: 'Fasting & period' }, d: { my: 'Ketik tarikh untuk tanda puasa atau hari haid. Semasa haid, solat ditandai dikecualikan secara automatik.', en: 'Tap dates to mark fasts or period days. During menstruation, prayers are auto-marked exempt.' } },
  { icon: 'i-gear', t: { my: 'Tetapan & data', en: 'Settings & data' }, d: { my: 'Tukar bahasa (MY/EN) dan tema gelap. Semua data tersimpan dalam telefon ini sahaja — Padam semua data tidak boleh diundur.', en: 'Switch language (MY/EN) and dark theme. All data stays on this phone only — Erase all data cannot be undone.' } }
];

const FAQS = [
  { q: { my: 'Perlu akaun atau internet?', en: 'Do I need an account or internet?' }, a: { my: 'Tidak. Semua rekod tersimpan dalam telefon anda (luar talian). Internet hanya untuk muat turun awal dan fon.', en: 'No. All records stay on your phone (offline). Internet is only for the first load and fonts.' } },
  { q: { my: 'Data hilang bila tukar telefon?', en: 'Lost data when switching phones?' }, a: { my: 'Ya buat masa ini — tiada sync awan (Fasa 1). Kekalkan telefon yang sama atau tunggu ciri sandaran.', en: 'Yes for now — no cloud sync (Phase 1). Keep the same phone or wait for the backup feature.' } },
  { q: { my: 'Waktu solat tepat untuk kawasan saya?', en: 'Are prayer times exact for my area?' }, a: { my: 'Dikira untuk Kuala Lumpur (MWL). Kaedah kawasan lain akan ditambah kemudian.', en: 'Calculated for Kuala Lumpur (MWL). Other regions will be added later.' } }
];

function storageBytes() {
  try { return new Blob([localStorage.getItem('taubat_app_v1') || '']).size; }
  catch (e) { return 0; }
}

export function renderHelp() {
  const lang = store.state.lang;
  const pick = (o) => esc(lang === 'en' ? o.en : o.my);
  const cards = SECTIONS.map((s) => `<div class="card dua-card">
      <b><svg class="ic" style="vertical-align:-.2rem;margin-right:.4rem"><use href="#${s.icon}"/></svg>${pick(s.t)}</b>
      <div class="my">${pick(s.d)}</div>
    </div>`).join('');
  const faqs = FAQS.map((f) => `<div class="card dua-card">
      <b>${pick(f.q)}</b><div class="my">${pick(f.a)}</div>
    </div>`).join('');
  return `<div class="home-head"><p class="kicker">${esc(tr('help_title'))}</p>
      <h2 class="h-display" style="margin:.3rem 0 0;font-size:1.4rem">${esc(tr('help_sub'))}</h2></div>
    ${cards}
    <div class="sec-title"><h2>${esc(tr('faq_title'))}</h2></div>
    ${faqs}
    <div class="sec-title"><h2>${esc(tr('s_about'))}</h2></div>
    <div class="card" style="margin:0 var(--s4)">
      <div class="settings-row"><span class="grow"><b>Taubat.App · ${esc(tr('s_version'))} 1.0.0</b>
        <div class="cap">${esc(tr('location_lbl'))} · ${storageBytes()} B ${lang === 'en' ? 'stored on this device' : 'tersimpan dalam peranti ini'}</div></span></div>
    </div>`;
}

export const helpActions = {};
