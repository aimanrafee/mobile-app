/** scripts/pecah-quran.mjs — Jana data/quran/ runtime dari Source/Al-Quran (sekali jalan)
 *
 *  Baca : Source/Al-Quran/data/{surah,korpus,terjemahan_melayu}.json (gitignored, bahan luar)
 *  Tulis: data/quran/surah.json (metadata 114) + data/quran/surah-001..114.json
 *         format surah: { n, ar, name:{my,en}, tr:{my,en}, count, ayat:[{ar,my}] }
 *
 *  Assert: 114 surah, 6236 ayat, setiap surah cukup bilangan_ayat.
 *  Jalan: node scripts/pecah-quran.mjs   (dari folder "mobile app")
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC = 'Source/Al-Quran/data/';
const OUT = 'data/quran/';
const J = (f) => JSON.parse(readFileSync(SRC + f, 'utf8'));

const meta = J('surah.json');
const korpus = J('korpus.json');
const terj = J('terjemahan_melayu.json');

if (meta.surah.length !== 114) throw new Error('Jangka 114 surah, dapat ' + meta.surah.length);

const arByKey = new Map(korpus.ayat.map((a) => [a.kunci, a.teks_arab]));
const myByKey = new Map(terj.ayat.map((a) => [a.kunci, a.teks_melayu]));
if (arByKey.size !== 6236 || myByKey.size !== 6236) {
  throw new Error(`Jangka 6236 ayat (ar:${arByKey.size}, my:${myByKey.size})`);
}

mkdirSync(OUT, { recursive: true });

const index = meta.surah.map((s) => {
  const ayat = [];
  for (let i = 1; i <= s.bilangan_ayat; i++) {
    const k = `${s.no}:${i}`;
    const ar = arByKey.get(k), my = myByKey.get(k);
    if (!ar || !my) throw new Error(`Ayat hilang: ${k}`);
    ayat.push({ ar, my });
  }
  const rec = {
    n: s.no, ar: s.nama_arab,
    name: { my: s.nama_ringkas, en: s.nama_ringkas },
    tr: { my: s.nama_melayu, en: s.nama_melayu },
    makki: s.tempat_turun === 'makkah',
    count: s.bilangan_ayat, ayat
  };
  writeFileSync(`${OUT}surah-${String(s.no).padStart(3, '0')}.json`, JSON.stringify(rec));
  return { n: rec.n, ar: rec.ar, name: rec.name, tr: rec.tr, makki: rec.makki, count: rec.count };
});

writeFileSync(OUT + 'surah.json', JSON.stringify({ versi: '1.0', jumlah: 114, surah: index }));

const total = index.reduce((a, s) => a + s.count, 0);
if (total !== 6236) throw new Error('Jumlah ayat ' + total + ' ≠ 6236');
console.log(`OK: 114 surah, ${total} ayat → ${OUT} (surah.json + 114 fail)`);
