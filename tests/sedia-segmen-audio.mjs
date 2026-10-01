// tests/sedia-segmen-audio.mjs — Validasi data segmen audio (114 surah)
// Jalankan dari folder "mobile app": node tests/sedia-segmen-audio.mjs
import { readdirSync, readFileSync, existsSync } from 'node:fs';

const DIR = 'data/quran/qpc-tajweed/audio-segments';
const pad = (n) => String(n).padStart(3, '0');
const R = [];
const ok = (n, c, x) => R.push((c ? 'OK    ' : 'GAGAL ') + n + (x ? ' :: ' + x : ''));
let keluar = 1;

try {
  ok('folder audio-segments wujud', existsSync(DIR));
  const fail = existsSync(DIR) ? readdirSync(DIR).filter((f) => /^surah-\d{3}\.json$/.test(f)) : [];
  ok('114 fail surah-NNN.json', fail.length === 114, 'dapat=' + fail.length);

  let jumlahAyat = 0, jumlahSegmen = 0, rosak = [];
  for (let no = 1; no <= 114; no++) {
    const p = `${DIR}/surah-${pad(no)}.json`;
    let j;
    try { j = JSON.parse(readFileSync(p, 'utf8')); }
    catch (e) { ok(`surah-${pad(no)} valid JSON`, false, e.message); continue; }
    if (j.recitation_id !== 7) { ok(`surah-${pad(no)} recitation_id=7`, false); continue; }
    if (!j.segments || typeof j.segments !== 'object') { ok(`surah-${pad(no)} ada segments`, false); continue; }
    for (const [k, v] of Object.entries(j.segments)) {
      jumlahAyat++;
      if (!Array.isArray(v.segments)) { rosak.push(k + ':bukan-array'); continue; }
      for (const s of v.segments) {
        if (!Array.isArray(s) || s.length !== 3) { rosak.push(k + ':bentuk'); break; }
        const [pos, dari, ke] = s;
        if (!Number.isInteger(pos) || pos < 1 || !(dari < ke)) { rosak.push(`${k}:[${pos},${dari},${ke}]`); break; }
        jumlahSegmen++;
      }
    }
  }
  ok('jumlah ayat = 6236', jumlahAyat === 6236, 'dapat=' + jumlahAyat);
  ok('tiada segmen rosak', rosak.length === 0, rosak.slice(0, 5).join('; '));

  const mp = `${DIR}/manifest-segments.json`;
  ok('manifest wujud', existsSync(mp));
  if (existsSync(mp)) {
    const m = JSON.parse(readFileSync(mp, 'utf8'));
    ok('manifest konsisten', m.jumlah_surah === 114 && m.jumlah_ayat === jumlahAyat
      && m.jumlah_segmen === jumlahSegmen && m.recitation_id === 7,
      `ayat=${m.jumlah_ayat} segmen=${m.jumlah_segmen}`);
    ok('saiz total < 10 MB', (m.saiz_total_kb || 0) < 10240, (m.saiz_total_kb || 0) + ' KB');
  }
  ok('ATTRIBUTION.md wujud', existsSync(`${DIR}/ATTRIBUTION.md`));

  keluar = R.some((x) => x.startsWith('GAGAL')) ? 1 : 0;
} catch (e) {
  R.push('RALAT KRITIKAL: ' + e.message);
  keluar = 1;
}

console.log('\n' + R.join('\n'));
console.log('\nLulus: ' + R.filter((x) => x.startsWith('OK')).length +
  ' | Gagal: ' + R.filter((x) => x.startsWith('GAGAL')).length +
  ' | Status: ' + (keluar === 0 ? 'LULUS' : 'GAGAL') + '\n');
process.exit(keluar);
