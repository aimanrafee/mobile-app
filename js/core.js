/** core.js — Teras Taubat.App
 *  Store (localStorage), i18n MY/EN, waktu solat (kaedah MWL), Hijri, utiliti.
 *  Tiada sebarang dependensi luaran.
 */

/* =============== LOG BUS (dibaca oleh debug mode) =============== */
export const LOGS = [];
export const logListeners = new Set();
export function emitLog(level, msg) {
  const entry = { t: new Date(), level, msg: String(msg) };
  LOGS.push(entry);
  if (LOGS.length > 500) LOGS.splice(0, LOGS.length - 500);
  logListeners.forEach((fn) => { try { fn(entry); } catch (e) { /* elak gelung */ } });
}

/* =============== I18N =============== */
export const DICT = {
  my: {
    tab_home:'Utama', tab_iqra:"Iqra'", tab_doa:'Zikir', tab_more:'Lainnya',
    greet_morning:'Assalamualaikum, selamat pagi', greet_afternoon:'Assalamualaikum, selamat tengah hari',
    greet_evening:'Assalamualaikum, selamat petang', greet_night:'Assalamualaikum, selamat malam',
    next_prayer:'Solat seterusnya', at:'pada', now:'sekarang', done_all:'Semua solat hari ini selesai. Alhamdulillah.',
    ontime:'Tepat', late:'Lewat', qada:'Qada', exempt:'Dikecualikan (haid)',
    streak:'Hari berturut', week_done:'Solat minggu ini', consistency:'Konsistensi 4 minggu',
    less:'Kurang', more_lbl:'Banyak',
    daily_quote:'Renungan hari ini',
    quran_title:'Al-Quran', search_surah:'Cari surah…', continue_read:'Sambung bacaan',
    bookmark:'Tanda', bookmarked:'Ditanda', remove:'Buang', copy:'Salin', copied:'Disalin!',
    translation_my:'Terjemahan', translation_en:'English',
    iqra_title:'Belajar Membaca', iqra_sub:'Enam tahap, dari huruf pertama hingga surah pertama.',
    tap_mastered:'Ketik huruf untuk tandai telah dikuasai', level_done:'Tahap selesai! Hebat.',
    mark_all_done:'Tandai tahap selesai', reset_level:'Set semula tahap',
    doa_title:'Al-Mathurat & Doa', morning:'Pagi', evening:'Petang', dua_collection:'Koleksi Doa',
    tap_to_count:'Ketik untuk kira', completed:'Selesai',
    tools_title:'Alat & Tetapan',
    t_tasbih:'Tasbih', t_tasbih_p:'Kiraan zikir digital',
    t_cal:'Kalendar', t_cal_p:'Hijri & tarikh penting',
    t_zakat:'Kalkulator Zakat', t_zakat_p:'Kira zakat harta',
    t_qibla:'Kompas Kiblat', t_qibla_p:'Arah Kaabah',
    t_fast:'Penjejak Puasa', t_fast_p:'Ramadhan & sunat',
    t_haid:'Penjejak Haid', t_haid_p:'Solat dilaraskan automatik',
    t_settings:'Tetapan', t_settings_p:'Bahasa, tema, debug',
    tasbih_title:'Tasbih', target:'Sasaran', reset:'Set semula', total:'Jumlah hari ini',
    phrase:'Zikir', custom:'Suai',
    cal_greg:'Masihi', cal_hijri:'Hijri', upcoming:'Tarikh penting akan datang', days_away:'hari lagi', today_lbl:'Hari ini',
    zakat_title:'Kalkulator Zakat Harta',
    z_cash:'Wang tunai & simpanan (RM)', z_gold:'Nilai emas & perak (RM)', z_invest:'Pelaburan & saham (RM)',
    z_debt:'Tolak: hutang jangka pendek (RM)', z_nisab:'Nisab (RM)',
    z_calc:'Kira Zakat', z_due:'Zakat wajib (2.5%)', z_none:'Belum mencapai nisab — tiada zakat wajib.',
    z_total:'Jumlah harta berzakat',
    qibla_title:'Kompas Kiblat', qibla_bearing:'Sudut kiblat dari utara',
    qibla_hint:'Pusingkan telefon sehingga anak panah menunjuk ke atas.',
    qibla_enable:'Aktifkan kompas', qibla_nosupport:'Penderia kompas tidak disokong peranti ini — gunakan sudut di atas.',
    qibla_loc:'Lokasi digunakan',
    fast_title:'Penjejak Puasa', fast_hint:'Ketik tarikh untuk tanda puasa.', fast_month:'Bulan ini', fast_total:'Jumlah dicatat',
    haid_title:'Penjejak Haid', haid_hint:'Ketik tarikh untuk tanda hari haid. Solat akan ditandai dikecualikan secara automatik.',
    haid_active:'Sedang haid', haid_cycle:'Purata kitaran', days:'hari',
    set_title:'Tetapan', s_lang:'Bahasa', s_theme:'Tema gelap', s_theme_p:'Paparan malam yang menenangkan',
    s_debug:'Debug mode', s_debug_p:'Panel pembangun: log, state & alat ujian',
    s_reset:'Padam semua data', s_reset_p:'Kosongkan rekod solat, zikir & tetapan',
    s_reset_confirm:'Padam semua data aplikasi? Tindakan ini tidak boleh diundur.',
    s_reset_done:'Data dipadam. Mula semula dengan Bismillah.',
    s_about:'Perihal', s_version:'Versi',
    debug_on:'Debug mode aktif — ketik ikon pepijat terapung.',
    location_lbl:'Kuala Lumpur, Malaysia (lalai)',
    lang_switched:'Bahasa ditukar',
    prayer_marked:'Solat ditandai',
    quote_save:'Simpan', saved:'Disimpan'
  },
  en: {
    tab_home:'Home', tab_iqra:"Iqra'", tab_doa:'Dhikr', tab_more:'More',
    greet_morning:'Assalamualaikum, good morning', greet_afternoon:'Assalamualaikum, good afternoon',
    greet_evening:'Assalamualaikum, good evening', greet_night:'Assalamualaikum, good night',
    next_prayer:'Next prayer', at:'at', now:'now', done_all:'All prayers done today. Alhamdulillah.',
    ontime:'On time', late:'Late', qada:'Qada', exempt:'Exempt (period)',
    streak:'Day streak', week_done:'Prayers this week', consistency:'4-week consistency',
    less:'Less', more_lbl:'More',
    daily_quote:'Today\'s reflection',
    quran_title:'Al-Quran', search_surah:'Search surah…', continue_read:'Continue reading',
    bookmark:'Bookmark', bookmarked:'Bookmarked', remove:'Remove', copy:'Copy', copied:'Copied!',
    translation_my:'Terjemahan', translation_en:'English',
    iqra_title:'Learn to Read', iqra_sub:'Six levels, from the first letter to the first surah.',
    tap_mastered:'Tap a letter to mark it mastered', level_done:'Level complete! Well done.',
    mark_all_done:'Mark level complete', reset_level:'Reset level',
    doa_title:'Al-Mathurat & Duas', morning:'Morning', evening:'Evening', dua_collection:'Dua Collection',
    tap_to_count:'Tap to count', completed:'Completed',
    tools_title:'Tools & Settings',
    t_tasbih:'Tasbih', t_tasbih_p:'Digital dhikr counter',
    t_cal:'Calendar', t_cal_p:'Hijri & important dates',
    t_zakat:'Zakat Calculator', t_zakat_p:'Calculate zakat on wealth',
    t_qibla:'Qibla Compass', t_qibla_p:'Direction of the Kaaba',
    t_fast:'Fasting Tracker', t_fast_p:'Ramadan & voluntary',
    t_haid:'Period Tracker', t_haid_p:'Prayers adjust automatically',
    t_settings:'Settings', t_settings_p:'Language, theme, debug',
    tasbih_title:'Tasbih', target:'Target', reset:'Reset', total:'Total today',
    phrase:'Dhikr', custom:'Custom',
    cal_greg:'Gregorian', cal_hijri:'Hijri', upcoming:'Upcoming important dates', days_away:'days away', today_lbl:'Today',
    zakat_title:'Zakat on Wealth Calculator',
    z_cash:'Cash & savings (RM)', z_gold:'Gold & silver value (RM)', z_invest:'Investments & shares (RM)',
    z_debt:'Less: short-term debts (RM)', z_nisab:'Nisab (RM)',
    z_calc:'Calculate', z_due:'Zakat due (2.5%)', z_none:'Below nisab — no zakat due.',
    z_total:'Total zakatable wealth',
    qibla_title:'Qibla Compass', qibla_bearing:'Qibla angle from north',
    qibla_hint:'Rotate your phone until the arrow points up.',
    qibla_enable:'Enable compass', qibla_nosupport:'Compass sensor not supported — use the angle above.',
    qibla_loc:'Location used',
    fast_title:'Fasting Tracker', fast_hint:'Tap a date to mark a fast.', fast_month:'This month', fast_total:'Total recorded',
    haid_title:'Period Tracker', haid_hint:'Tap a date to mark a period day. Prayers are auto-marked as exempt.',
    haid_active:'Period active', haid_cycle:'Average cycle', days:'days',
    set_title:'Settings', s_lang:'Language', s_theme:'Dark theme', s_theme_p:'A calming night display',
    s_debug:'Debug mode', s_debug_p:'Developer panel: logs, state & test tools',
    s_reset:'Erase all data', s_reset_p:'Clear prayer records, dhikr & settings',
    s_reset_confirm:'Erase all app data? This cannot be undone.',
    s_reset_done:'Data erased. Begin again with Bismillah.',
    s_about:'About', s_version:'Version',
    debug_on:'Debug mode on — tap the floating bug icon.',
    location_lbl:'Kuala Lumpur, Malaysia (default)',
    lang_switched:'Language switched',
    prayer_marked:'Prayer marked',
    quote_save:'Save', saved:'Saved'
  }
};

/* =============== STORE =============== */
const STORE_KEY = 'taubat_app_v1';
const listeners = new Set();

const DEFAULTS = () => ({
  lang: 'my',
  theme: null,            // null = ikut sistem
  debug: false,
  prayers: {},            // 'YYYY-MM-DD': {subuh:'ontime'|'late'|'qada', ...}
  haid: {},               // 'YYYY-MM-DD': true
  puasa: {},              // 'YYYY-MM-DD': true
  tasbih: { count: 0, target: 33, phrase: 'subhanallah', day: '', today: 0 },
  bookmarks: [],          // ['1:1', ...]
  lastRead: null,         // {surah, ayat}
  iqra: {},               // {cellKey: true}
  mathurat: {},           // 'YYYY-MM-DD': {itemId: count}
  nisab: 23850
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return DEFAULTS();
    const parsed = JSON.parse(raw);
    return Object.assign(DEFAULTS(), parsed);
  } catch (e) {
    emitLog('warn', 'Store rosak, dimulakan semula: ' + e.message);
    return DEFAULTS();
  }
}

export const store = {
  state: loadState(),
  get(key) { return this.state[key]; },
  set(key, val, silent) {
    this.state[key] = val;
    this.save();
    if (!silent) { listeners.forEach((fn) => fn(key, val)); }
  },
  update(fn) {
    fn(this.state);
    this.save();
    listeners.forEach((f) => f('*', this.state));
  },
  save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(this.state)); }
    catch (e) { emitLog('error', 'Gagal simpan state: ' + e.message); }
  },
  reset() {
    const keep = { lang: this.state.lang, theme: this.state.theme, debug: this.state.debug };
    this.state = Object.assign(DEFAULTS(), keep);
    this.save();
    listeners.forEach((f) => f('*', this.state));
  },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
};

/* =============== UTIL TARIKH =============== */
export function dateKey(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
export function parseKey(k) {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
export function fmt12(minFloat) {
  if (!isFinite(minFloat)) return '--:--';
  let h = Math.floor(minFloat / 60), m = Math.round(minFloat % 60);
  if (m === 60) { m = 0; h += 1; }
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (h === 0) h = 12;
  return h + ':' + String(m).padStart(2, '0') + ' ' + ap;
}
const DAY_MY = ['Ahd','Isn','Sel','Rab','Kha','Jum','Sab'];
const DAY_EN = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const DAY_MY_LONG = ['Ahad','Isnin','Selasa','Rabu','Khamis','Jumaat','Sabtu'];
const MON_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MON_MY = ['Jan','Feb','Mac','Apr','Mei','Jun','Jul','Ogos','Sep','Okt','Nov','Dis'];
export function dayName(d, lang, long) {
  if (lang === 'en') return DAY_EN[d.getDay()];
  return (long ? DAY_MY_LONG : DAY_MY)[d.getDay()];
}
export function fmtDate(d, lang) {
  const mons = lang === 'en' ? MON_EN : MON_MY;
  return mons[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

/* =============== HIJRI =============== */
import { HIJRI_MONTHS } from './data.js';
let hijriFmt = null;
try {
  hijriFmt = new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric', month: 'numeric', year: 'numeric' });
  hijriFmt.format(new Date()); // uji
} catch (e) { hijriFmt = null; emitLog('warn', 'Intl islamic calendar tidak disokong, guna jadual tabular'); }

export function toHijri(date) {
  if (hijriFmt) {
    try {
      const p = {};
      hijriFmt.formatToParts(date).forEach((x) => { p[x.type] = x.value; });
      const d = parseInt(p.day, 10), m = parseInt(p.month, 10), y = parseInt(p.year, 10);
      if (d >= 1 && d <= 30 && m >= 1 && m <= 12 && y > 0) return { d, m, y };
    } catch (e) { /* jatuh ke tabular */ }
  }
  // Sandaran: kalendar Islam tabular (arithmetik)
  const jd = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const l = Math.floor(jd - 1948440 + 10632);
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const m = Math.floor((24 * l3) / 709);
  const d = l3 - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;
  return { d, m, y };
}
function gregorianToJD(y, m, d) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}
export function hijriLabel(date, lang) {
  const h = toHijri(date);
  const names = HIJRI_MONTHS[lang] || HIJRI_MONTHS.my;
  return h.d + ' ' + (names[h.m - 1] || '') + ' ' + h.y;
}

/* =============== WAKTU SOLAT (kaedah MWL) ===============
   Port padat algoritma PrayTimes: Fajr 18°, Isyak 17°, Asar faktor 1. */
const D2R = Math.PI / 180;
function fixAngle(a) { a = a % 360; return a < 0 ? a + 360 : a; }
function fixHour(h) { h = h % 24; return h < 0 ? h + 24 : h; }
function sunPos(jd) {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(g * D2R) + 0.020 * Math.sin(2 * g * D2R));
  const e = 23.439 - 0.00000036 * D;
  const RA = Math.atan2(Math.cos(e * D2R) * Math.sin(L * D2R), Math.cos(L * D2R)) / D2R / 15;
  return { decl: Math.asin(Math.sin(e * D2R) * Math.sin(L * D2R)) / D2R, eqt: q / 15 - fixHour(RA) };
}
export const LOCATION = { lat: 3.1390, lng: 101.6869, tz: 8, name: 'Kuala Lumpur' };

/** Pulangkan { subuh, terbit, zohor, asar, maghrib, isyak } dalam minit dari tengah malam. */
export function prayerTimes(date, loc = LOCATION) {
  const { lat, lng, tz } = loc;
  const jd = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate()) - lng / (15 * 24);
  const midDay = (t) => fixHour(12 - sunPos(jd + t).eqt);
  const angleTime = (angle, t, morning) => {
    const decl = sunPos(jd + t).decl;
    const noon = midDay(t);
    const cosv = (-Math.sin(angle * D2R) - Math.sin(decl * D2R) * Math.sin(lat * D2R)) /
                 (Math.cos(decl * D2R) * Math.cos(lat * D2R));
    if (cosv < -1 || cosv > 1) return NaN;
    const dt = Math.acos(cosv) / D2R / 15;
    return noon + (morning ? -dt : dt);
  };
  const asrTime = (t) => {
    const decl = sunPos(jd + t).decl;
    const angle = -(1 / D2R) * Math.atan(1 / (1 + Math.tan(Math.abs(lat - decl) * D2R)));
    return angleTime(angle, t, false);
  };
  const adj = tz - lng / 15;
  const h = (v) => fixHour(v + adj) * 60;
  return {
    subuh: h(angleTime(18, 0, true)),
    terbit: h(angleTime(0.833, 0, true)),
    zohor: h(midDay(0) + 2 / 60),       // sedikit lebihan ihtiyat
    asar: h(asrTime(1 / 24)),
    maghrib: h(angleTime(0.833, 1, false)),
    isyak: h(angleTime(17, 1, false))
  };
}
export const PRAYERS = [
  { id: 'subuh', icon: 'i-sunrise', my: 'Subuh', en: 'Fajr' },
  { id: 'zohor', icon: 'i-sun', my: 'Zohor', en: 'Dhuhr' },
  { id: 'asar', icon: 'i-cloudsun', my: 'Asar', en: 'Asr' },
  { id: 'maghrib', icon: 'i-sunset', my: 'Maghrib', en: 'Maghrib' },
  { id: 'isyak', icon: 'i-moon', my: 'Isyak', en: 'Isha' }
];

/** Solat seterusnya & undur (minit). */
export function nextPrayer(now = new Date()) {
  const times = prayerTimes(now);
  const cur = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  for (const p of PRAYERS) {
    if (times[p.id] > cur) {
      return { id: p.id, at: times[p.id], inMin: times[p.id] - cur, day: now };
    }
  }
  const tmr = addDays(now, 1);
  const t2 = prayerTimes(tmr);
  return { id: 'subuh', at: t2.subuh, inMin: (24 * 60 - cur) + t2.subuh, day: tmr };
}

/* =============== QIBLAT =============== */
const KAABA = { lat: 21.4225, lng: 39.8262 };
export function qiblaBearing(lat, lng) {
  const dLng = (KAABA.lng - lng) * D2R;
  const la = lat * D2R, lk = KAABA.lat * D2R;
  const y = Math.sin(dLng);
  const x = Math.cos(la) * Math.tan(lk) - Math.sin(la) * Math.cos(dLng);
  return fixAngle(Math.atan2(y, x) / D2R);
}

/* =============== TOAST =============== */
let toastTimer = null;
export function toast(msg, ms = 2200) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, ms);
}
