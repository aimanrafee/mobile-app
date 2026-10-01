// scripts/sedia-audio-url.mjs — Jana data/quran/audio-url.json dari
// Source/surah-recitation-mishari-al-afasy.db → jadual surah_list(surah_number, audio_url, duration)
// Jalankan dari folder "mobile app": node scripts/sedia-audio-url.mjs
// Deterministik: baca via sqlite3 CLI (-json), tiada LLM, tiada rangkaian.
//
// NOTA SUMBER (didokumenkan, bukan andaian):
// - .db mengandungi 228 baris surah_list = 2 salinan seiras setiap surah (114×2):
//     …/mishari_al_afasy/murattal/mp3/NNN.mp3  dan  …/alafasy/murattal/mp3/NNN.mp3
//   Skrip pilih varian `mishari_al_afasy/` (nama penuh qari, eksplisit) dan abaikan duplikat.
// - Segmen ayat dalam .db (jadual segments, 12472 baris = 6236×2, salinan seiras) BERBEZA
//   penjajaran ms dengan data/quran/qpc-tajweed/audio-segments/surah-NNN.json sedia ada
//   (sedia ada: api.quran.com v4, cth 1:1 bermula 60ms; .db: eksport editor Tarteel, bermula 0ms).
//   KEPUTUSAN: kekalkan audio-segments sedia ada (sudah berintegrasi + diuji, 6236 ayat,
//   format [idx,pos,fromMs,toMs] sepadan pemain app). .db hanya diambil URL audio per surah.
// - CDN: https://audio-cdn.tarteel.ai/quran/surah/mishari_al_afasy/murattal/mp3/NNN.mp3
//
// Format keluar: { "1": { "url": "https://...", "duration": 46 }, ... } (duration dalam saat)
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DB = 'Source/surah-recitation-mishari-al-afasy.db';
const OUT = 'data/quran/audio-url.json';

const raw = execSync(
  `sqlite3 -json "${DB}" "SELECT surah_number, audio_url, duration FROM surah_list ORDER BY surah_number"`,
  { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }
);
const rows = JSON.parse(raw);
console.log('surah_list: ' + rows.length + ' baris (termasuk duplikat)');

const keluar = {};
for (const r of rows) {
  const n = String(Number(r.surah_number));
  const url = String(r.audio_url || '');
  if (!n || !url) continue;
  // Utamakan varian mishari_al_afasy/; jangan tulis ganti dengan varian alafasy/
  if (keluar[n] && !url.includes('/mishari_al_afasy/')) continue;
  if (keluar[n] && keluar[n].url.includes('/mishari_al_afasy/') && !url.includes('/mishari_al_afasy/')) continue;
  keluar[n] = { url, duration: Number(r.duration) || 0 };
}

const hilang = [];
for (let i = 1; i <= 114; i++) if (!keluar[String(i)]) hilang.push(i);
if (hilang.length) {
  console.error('GAGAL: surah tiada URL: ' + hilang.join(','));
  process.exit(1);
}
console.log('Contoh: 1 → ' + keluar['1'].url + ' (' + keluar['1'].duration + 's)');

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(keluar, null, 1));
console.log(`SELESAI: ${OUT} (${Object.keys(keluar).length} surah)`);
