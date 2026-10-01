// tests/quran-mod-3-segmen.mjs — Smoke test segmen ketiga Pages + placeholder
// Jalankan dari folder "mobile app": node tests/quran-mod-3-segmen.mjs

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

  ok('DICT mod_pages MY+EN', !!core.DICT.my.mod_pages && !!core.DICT.en.mod_pages);
  ok('DICT mod_pages_soon MY+EN', !!core.DICT.my.mod_pages_soon && !!core.DICT.en.mod_pages_soon);
  ok('quran:mod terima pages', typeof quran.quranActions['quran:mod'] === 'function');

  // Toggle papar 3 butang
  const hT = quran.renderSurah({ surah: 1 });
  const btns = (hT.match(/data-action="quran:mod"/g) || []).length;
  ok('toggle 3 segmen', btns === 3, 'dapat=' + btns);
  ok('simbol i-mod-pages dirujuk', hT.includes('#i-mod-pages'));

  // Mod pages → placeholder, toggle masih ada
  core.store.update((s) => { s.quranMod = 'pages'; });
  const hP = quran.renderSurah({ surah: 1 });
  ok('placeholder mesej + toggle kekal', hP.includes('akan datang') && hP.includes('quran:mod'));
  ok('placeholder tiada senarai ayat', !hP.includes('class="ayah"'));
  ok('placeholder .on di Pages', /data-mod="pages"[^>]*aria-pressed="true"/.test(hP));

  // Kembali ke terjemahan — tiada regresi
  core.store.update((s) => { s.quranMod = 'terjemahan'; });
  const hK = quran.renderSurah({ surah: 1 });
  ok('kembali: ayat + .my muncul', hK.includes('class="ayah"') && hK.includes('class="my"'));

  // Sprite index.html
  const html = readFileSync('index.html', 'utf8');
  ok('simbol i-mod-pages tanpa inline fill/stroke',
    html.includes('id="i-mod-pages"') && !/<symbol id="i-mod-pages"[^>]*fill=/.test(html));

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
