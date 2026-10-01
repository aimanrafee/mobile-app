// tests/quran-pages.mjs — Ujian Fasa 3: mushaf 604 halaman + font + manifest + data baharu
// Jalankan dari folder "mobile app": node tests/quran-pages.mjs
// Skop: pages/NNN.json (604), font p1..p604 + quran-common.woff2, manifest-qpc.json,
// font-map.json, audio-url.json (114), surah-info-en.json (114), toggle dalam shell,
// reset halaman lalai, tiada regresi mod Baca/Terjemahan. Tiada rangkaian.

globalThis.localStorage = {
  _m: {},
  getItem(k) { return this._m[k] ?? null; },
  setItem(k, v) { this._m[k] = String(v); },
  removeItem(k) { delete this._m[k]; },
  get length() { return Object.keys(this._m).length; },
  key(i) { return Object.keys(this._m)[i]; }
};
globalThis.window = {
  matchMedia: () => ({ matches: false, addEventListener() {} }),
  addEventListener() {},
  confirm: () => true
};
globalThis.document = {
  documentElement: {
    classList: { contains: () => false, toggle() {}, add() {}, remove() {} },
    lang: 'ms', dataset: {}
  },
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  createElement: () => ({ click() {}, style: {}, classList: { add() {}, remove() {} } }),
  body: { appendChild() {} }
};

const { existsSync, readFileSync, readdirSync } = await import('node:fs');

const R = [];
const ok = (n, c, x) => R.push((c ? 'OK    ' : 'GAGAL ') + n + (x ? ' :: ' + x : ''));
let keluar = 1;
const pad = (n) => String(n).padStart(3, '0');

try {
  /* ── 1. pages/NNN.json: 604 fail, setiap satu ada page/font/lines ── */
  let hilang = 0, rosak = 0;
  for (let i = 1; i <= 604; i++) {
    const f = `data/quran/qpc-tajweed/pages/${pad(i)}.json`;
    if (!existsSync(f)) { hilang++; continue; }
    try {
      const j = JSON.parse(readFileSync(f, 'utf8'));
      if (j.page !== i || typeof j.font !== 'string' || !Array.isArray(j.lines) || !j.lines.length) rosak++;
    } catch (e) { rosak++; }
  }
  ok('604 fail pages/NNN.json wujud', hilang === 0, hilang ? `hilang=${hilang}` : '604/604');
  ok('setiap fail ada page, font, lines', rosak === 0, rosak ? `rosak=${rosak}` : undefined);

  /* ── 2. font: p1..p604 + quran-common.woff2 ── */
  let fontHilang = 0;
  for (let i = 1; i <= 604; i++) {
    if (!existsSync(`data/quran/qpc-tajweed/fonts/p${i}.woff2`)) fontHilang++;
  }
  const adaCommon = existsSync('data/quran/qpc-tajweed/fonts/quran-common.woff2');
  ok('font p1..p604 lengkap', fontHilang === 0, fontHilang ? `hilang=${fontHilang}` : '604/604');
  ok('font quran-common.woff2 wujud', adaCommon);

  /* ── 3. manifest + font-map ── */
  let man = null;
  try { man = JSON.parse(readFileSync('data/quran/qpc-tajweed/manifest-qpc.json', 'utf8')); } catch (e) {}
  ok('manifest-qpc.json wujud + 604 halaman', !!man && man.jumlah_halaman === 604, man ? `halaman=${man.jumlah_halaman}` : 'tiada');
  let fmap = null;
  try { fmap = JSON.parse(readFileSync('data/quran/qpc-tajweed/font-map.json', 'utf8')); } catch (e) {}
  ok('font-map.json 604 entri', !!fmap && Object.keys(fmap).length === 604, fmap ? `entri=${Object.keys(fmap).length}` : 'tiada');

  /* ── 4. audio-url.json: 114 surah, URL + duration ── */
  let aurl = null;
  try { aurl = JSON.parse(readFileSync('data/quran/audio-url.json', 'utf8')); } catch (e) {}
  const aKeys = aurl ? Object.keys(aurl) : [];
  const aLengkap = aKeys.length === 114 && aKeys.every((k) => aurl[k].url && aurl[k].url.startsWith('https://'));
  ok('audio-url.json lengkap 114 surah', aLengkap, `dapat=${aKeys.length}`);
  ok('audio-url guna CDN tarteel', !!aurl && String(aurl['1']?.url || '').includes('audio-cdn.tarteel.ai'),
    aurl ? String(aurl['1']?.url || '').slice(0, 60) : 'tiada');

  /* ── 5. surah-info-en.json: 114 surah ── */
  let info = null;
  try { info = JSON.parse(readFileSync('data/quran/surah-info-en.json', 'utf8')); } catch (e) {}
  const iKeys = info ? Object.keys(info) : [];
  const iLengkap = iKeys.length === 114 && iKeys.every((k) => info[k].name && info[k].text);
  ok('surah-info-en.json 114 surah', iLengkap, `dapat=${iKeys.length}`);

  /* ── 6. Fungsian: toggle dalam shell + reset halaman + tiada regresi ── */
  const core = await import('../js/platform/core.js');
  const quran = await import('../js/features/quran.js');
  await import('../js/app.js');

  core.store.update((s) => { s.quranMod = 'pages'; s.quranHalaman = 5; });
  const hP = quran.renderSurah({ surah: 1 }); // surah 1 = korpus terbenam (render sync)
  ok('shell Pages ada toggle 3 segmen', (hP.match(/data-action="quran:mod"/g) || []).length === 3);
  ok('shell Pages tunjuk halaman tersimpan (bukan no. surah)', hP.includes('Halaman 5') && !hP.includes('class="ayah"'));

  // Reset sekali bila quranHalaman belum wujud; kekal bila sudah wujud (cth 100).
  // Aksi memanggil render(true) yang perlu DOM pelayar — abaikan ralat render di sini
  // (store.update sudah berlaku sebelum render; keadaan stor tetap boleh disahkan).
  const selamatMod = (mod) => {
    try { quran.quranActions['quran:mod']({ dataset: { mod } }); } catch (e) { /* tiada DOM dalam ujian */ }
  };
  core.store.update((s) => { s.quranMod = 'terjemahan'; delete s.quranHalaman; });
  selamatMod('pages');
  ok('buka Pages pertama kali → halaman 1', core.store.state.quranHalaman === 1);
  core.store.update((s) => { s.quranMod = 'terjemahan'; s.quranHalaman = 100; });
  selamatMod('pages');
  ok('masuk semula Pages → kekal halaman 100', core.store.state.quranHalaman === 100);

  // Tiada regresi Baca/Terjemahan
  core.store.update((s) => { s.quranMod = 'baca'; });
  const hB = quran.renderSurah({ surah: 1 });
  core.store.update((s) => { s.quranMod = 'terjemahan'; });
  const hT = quran.renderSurah({ surah: 1 });
  ok('regresi: Baca sorok .my, Terjemahan papar .my',
    !hB.includes('class="my"') && hT.includes('class="my"'));

  keluar = R.some((x) => x.startsWith('GAGAL')) ? 1 : 0;
} catch (e) {
  R.push('\nRALAT KRITIKAL: ' + e.message);
  keluar = 1;
}

console.log('\n' + R.join('\n'));
console.log('\nLulus: ' + R.filter((x) => x.startsWith('OK')).length +
  ' | Gagal: ' + R.filter((x) => x.startsWith('GAGAL')).length +
  ' | Status: ' + (keluar === 0 ? 'LULUS' : 'GAGAL') + '\n');
process.exit(keluar);
