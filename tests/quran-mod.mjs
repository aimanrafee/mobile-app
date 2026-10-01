// tests/quran-mod.mjs — Smoke test toggle BACA/TERJEMAHAN
// Jalankan dari folder "mobile app": node tests/quran-mod.mjs
// API sebenar: renderSurah({surah}), quranActions['quran:mod'/'quran:trans'].

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

const { readFileSync } = await import('node:fs');
globalThis.fetch = async (url) => {
  const f = 'data/' + String(url).split('data/')[1].split('?')[0];
  try {
    return { ok: true, json: async () => JSON.parse(readFileSync(f, 'utf8')) };
  } catch (e) { return { ok: false, status: 404, json: async () => null }; }
};

const R = [];
const ok = (n, c, x) => R.push((c ? 'OK    ' : 'GAGAL ') + n + (x ? ' :: ' + x : ''));
let keluar = 1;

try {
  const core = await import('../js/platform/core.js');
  const quran = await import('../js/features/quran.js');
  const router = await import('../js/platform/router.js');
  await import('../js/app.js');
  ok('import core+quran+router+app', !!(core && quran && router));

  ok('DICT mod_baca/terjemahan MY+EN',
    !!core.DICT.my.mod_baca && !!core.DICT.my.mod_terjemahan &&
    !!core.DICT.en.mod_baca && !!core.DICT.en.mod_terjemahan);
  ok('DEFAULTS quranMod=terjemahan', core.store.state.quranMod === 'terjemahan',
    'dapat=' + core.store.state.quranMod);
  ok('quran:trans KEKAL', typeof quran.quranActions['quran:trans'] === 'function');
  ok('quran:mod wujud', typeof quran.quranActions['quran:mod'] === 'function');
  ok('quran:mod berdaftar di router', typeof router.getAction('quran:mod') === 'function');

  // Surah 1 terbenam: toggle mod + pil MY/EN
  const hT = quran.renderSurah({ surah: 1 });
  ok('terjemahan: .my dirender', hT.includes('class="my"'));
  ok('terjemahan: pil MY/EN nampak', hT.includes('quran:trans') && !hT.includes('quran-lang" hidden'));
  ok('terjemahan: .on di TERJEMAHAN', /data-mod="terjemahan"[^>]*aria-pressed="true"/.test(hT));

  core.store.update((s) => { s.quranMod = 'baca'; });
  const hB = quran.renderSurah({ surah: 1 });
  ok('baca: .my disorok', !hB.includes('class="my"'));
  ok('baca: Arab masih ada', hB.includes('lang="ar"'));
  ok('baca: pil MY/EN hidden', hB.includes('quran-lang" hidden'));
  ok('baca: .on di BACA', /data-mod="baca"[^>]*aria-pressed="true"/.test(hB));

  core.store.update((s) => { s.quranMod = 'terjemahan'; });
  const hK = quran.renderSurah({ surah: 1 });
  ok('kembali: pil nampak semula', !hK.includes('quran-lang" hidden') && hK.includes('class="my"'));

  // Surah lazy (50): skeleton, tiada pil
  const hL = quran.renderSurah({ surah: 50 });
  ok('lazy: skeleton + tiada pil MY/EN', hL.includes('skel') && !hL.includes('quran:trans'));

  // CSS + sprite
  const css = readFileSync('css/app.css', 'utf8');
  ok('CSS .quran-mod + token SIAP', css.includes('.quran-mod') && css.includes('--chip-bg'));
  ok('CSS TIADA --surface-2', !css.includes('--surface-2'));
  const html = readFileSync('index.html', 'utf8');
  ok('guna semula i-book + i-globe', html.includes('id="i-book"') && html.includes('id="i-globe"'));

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
