// scripts/bina-ikon-pwa.mjs — Jana PNG/ICO PWA dari icons/src/*.svg (deterministik)
// Memerlukan pakej `sharp` (npm i sharp). Jika tiada, pasang sementara:
//   npm install sharp --prefix "$env:TEMP/opencode/iconbuild"
// dan tetapkan SHARP_DIR ke folder tersebut.
// Jalankan dari folder "mobile app": node scripts/bina-ikon-pwa.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const SHARP_DIR = process.env.SHARP_DIR || 'C:/Users/rafee/AppData/Local/Temp/opencode/iconbuild';
const req = createRequire(SHARP_DIR + '/package.json');
const sharp = req('sharp');

const SRC = 'icons/src';
const OUT = 'icons';
mkdirSync(OUT, { recursive: true });

const tugas = [
  [SRC + '/icon.svg', OUT + '/icon-192.png', 192],
  [SRC + '/icon.svg', OUT + '/icon-512.png', 512],
  [SRC + '/icon-maskable.svg', OUT + '/icon-maskable-512.png', 512],
  [SRC + '/icon-square.svg', OUT + '/apple-touch-icon.png', 180],
  [SRC + '/icon-square.svg', OUT + '/_favicon-32.png', 32],
];
for (const [masuk, keluar, saiz] of tugas) {
  await sharp(masuk, { density: 512 }).resize(saiz, saiz).png().toFile(keluar);
  console.log(`${keluar} (${saiz}x${saiz})`);
}

// Balut PNG 32px menjadi favicon.ico (bekas ICO + muatan PNG — sah untuk pelayar moden)
const png = readFileSync(OUT + '/_favicon-32.png');
const kepala = Buffer.alloc(6 + 16);
kepala.writeUInt16LE(0, 0); // reserved
kepala.writeUInt16LE(1, 2); // jenis ICO
kepala.writeUInt16LE(1, 4); // 1 imej
kepala[6] = 32; kepala[7] = 32; // lebar, tinggi
kepala[8] = 0; kepala[9] = 0; // palet, reserved
kepala.writeUInt16LE(1, 10); kepala.writeUInt16LE(32, 12); // satah, bit
kepala.writeUInt32LE(png.length, 14); // saiz data
kepala.writeUInt32LE(6 + 16, 18); // offset data
writeFileSync(OUT + '/favicon.ico', Buffer.concat([kepala, png]));
console.log(OUT + '/favicon.ico (32x32, bekas ICO + PNG)');
