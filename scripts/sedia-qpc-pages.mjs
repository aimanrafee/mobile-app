// scripts/sedia-qpc-pages.mjs
// Gabung .db (layout) + qpc-v4.json (script) + fonts → pages/NNN.json
// Jalankan: node scripts/sedia-qpc-pages.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const SRC   = 'Source';
const OUT   = 'data/quran/qpc-tajweed';
const PAGES = path.join(OUT, 'pages');

// 1. Baca .db guna sqlite3 CLI → JSON
console.log('Baca layout .db...');
const dbJson = execSync(
  `sqlite3 -json "${SRC}/qpc-v4-tajweed-15-lines.db" "SELECT * FROM pages ORDER BY page_number, line_number"`,
  { encoding: 'utf8', maxBuffer: 100 * 1024 * 1024 }
);
const rows = JSON.parse(dbJson);
console.log('  → ' + rows.length + ' baris');

// 2. Baca script qpc-v4.json
console.log('Baca script...');
const script = JSON.parse(
  fs.readFileSync(path.join(SRC, 'qpc-v4.json'), 'utf8')
);
const kunci = Object.keys(script);
console.log('  → ' + kunci.length + ' perkataan');

// 3. Bina index: id → { glyph, location }
const byId = {};
for (const k of kunci) {
  const w = script[k];
  byId[w.id] = { g: w.text, k: w.location };
}

// 4. Baca font folder
const fontDir = path.join(OUT, 'fonts');
const fontFiles = fs.readdirSync(fontDir).filter(f => f.endsWith('.woff2'));
console.log('  → ' + fontFiles.length + ' fail font');

// 5. Kumpul per halaman
const halaman = new Map();
for (const r of rows) {
  const p = r.page_number;
  if (!halaman.has(p)) halaman.set(p, []);
  halaman.get(p).push(r);
}

// 6. Tulis pages/NNN.json
fs.mkdirSync(PAGES, { recursive: true });
let jumlahKata = 0;

for (const [no, baris] of halaman) {
  const lines = baris.map(r => {
    const words = [];
    for (let id = r.first_word_id; id <= r.last_word_id; id++) {
      const w = byId[id];
      if (w) { words.push(w); jumlahKata++; }
    }
    return {
      line: r.line_number,
      type: r.line_type,
      centered: !!r.is_centered,
      surah: r.surah_number,
      words
    };
  });

  const keluar = {
    page: no,
    font: 'p' + no,        // p1, p2, ... p604
    lines
  };
  const nama = 'surah-' + String(no).padStart(3, '0') + '.json';
  fs.writeFileSync(
    path.join(PAGES, String(no).padStart(3, '0') + '.json'),
    JSON.stringify(keluar)
  );
}

// 7. font-map.json
const fontMap = {};
for (let p = 1; p <= 604; p++) fontMap[p] = 'p' + p;
fs.writeFileSync(
  path.join(OUT, 'font-map.json'),
  JSON.stringify(fontMap)
);

// 8. manifest
const manifest = {
  jumlah_halaman: halaman.size,
  jumlah_baris: rows.length,
  jumlah_kata: jumlahKata,
  jumlah_font: fontFiles.length,
  dijana_pada: new Date().toISOString(),
  sumber: 'QUL QPC V4 Tajweed (recitation_id=7, 15-lines)'
};
fs.writeFileSync(
  path.join(OUT, 'manifest-qpc.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('\nSELESAI:');
console.log('  Halaman : ' + halaman.size);
console.log('  Baris   : ' + rows.length);
console.log('  Kata    : ' + jumlahKata);
console.log('  Font    : ' + fontFiles.length);