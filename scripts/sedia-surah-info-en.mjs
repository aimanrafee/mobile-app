// scripts/sedia-surah-info-en.mjs — Jana data/quran/surah-info-en.json dari Source/surah-info-en.db
// Jadual: surah_infos(surah_number, surah_name, text, short_text) — 114 baris (Maududi, EN)
// Format keluar: { "1": { "name": "...", "short": "...", "text": "..." }, ... }
// Jalankan dari folder "mobile app": node scripts/sedia-surah-info-en.mjs
// Deterministik: baca via sqlite3 CLI (-json), tiada LLM, tiada rangkaian.
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DB = 'Source/surah-info-en.db';
const OUT = 'data/quran/surah-info-en.json';

const raw = execSync(
  `sqlite3 -json "${DB}" "SELECT surah_number, surah_name, text, short_text FROM surah_infos ORDER BY surah_number"`,
  { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }
);
const rows = JSON.parse(raw);
console.log('surah_infos: ' + rows.length + ' baris');

if (rows.length !== 114) {
  console.error(`AMARAN: jangka 114 surah, dapat ${rows.length}`);
  process.exitCode = 1;
}

const keluar = {};
for (const r of rows) {
  const n = String(Number(r.surah_number));
  keluar[n] = { name: r.surah_name ?? '', short: r.short_text ?? '', text: r.text ?? '' };
}
// Pastikan kunci 1..114 lengkap
const hilang = [];
for (let i = 1; i <= 114; i++) if (!keluar[String(i)]) hilang.push(i);
if (hilang.length) {
  console.error('AMARAN: surah hilang: ' + hilang.join(','));
  process.exitCode = 1;
}

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(keluar));
const kb = Math.round(Buffer.byteLength(JSON.stringify(keluar)) / 1024);
console.log(`SELESAI: ${OUT} (${Object.keys(keluar).length} surah, ~${kb} KB)`);
