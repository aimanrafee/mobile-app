// scripts/sedia-segmen-audio.mjs — Muat turun 114 fail JSON segmen audio (sekali jalan)
// Qari: Mishari Rashid Al-Afasy (Murattal), recitation_id=7.
// Sumber SEBENAR (disahkan 2026-10-02): api.quran.com v4 (Quran Foundation, API awam stabil)
//   GET https://api.quran.com/api/v4/verses/by_chapter/{N}?words=false&audio=7&per_page=300
//   → verses[].{verse_key, audio:{url, segments:[[idx0,pos,fromMs,toMs],...]}}
// Sebab: halaman editor QUL (qul.tarteel.ai/surah_audio_files/7) dipacu JS + perlu
// akses penyumbang; tiada URL eksport JSON awam yang jelas. Data segmen adalah sama.
// Atribusi: QUL Tarteel (CC-BY-4.0) + Quran Foundation API. Kegunaan peribadi.
// Audio MP3 TIDAK dimuat di sini (distrim dari CDN di Fasa 4b).
//
// Jalankan dari folder "mobile app": node scripts/sedia-segmen-audio.mjs [--force] [--dry-run] [--only=N]

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';

const RECITATION_ID = 7;
const QARI = 'Mishari Rashid Al-Afasy';
const JENIS = 'murattal';
const API = process.env.QUL_URL || 'https://api.quran.com';
const DIR = 'data/quran/qpc-tajweed/audio-segments';
const DELAY_MS = 300;
const RETRY_MAX = 3;

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const DRY_RUN = args.has('--dry-run');
let ONLY = null;
for (const a of args) {
  const m = String(a).match(/^--only=(\d{1,3})$/);
  if (m) ONLY = Math.min(114, Math.max(1, Number(m[1])));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pad = (n) => String(n).padStart(3, '0');

async function fetchJSON(url, attempt = 1) {
  let res;
  try {
    res = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch (e) {
    if (attempt >= RETRY_MAX) throw new Error(`rangkaian gagal selepas ${RETRY_MAX}x: ${e.message}`);
    await sleep(1000 * attempt);
    return fetchJSON(url, attempt + 1);
  }
  if (res.status === 429) {
    if (attempt >= RETRY_MAX) throw new Error('rate limit (429) selepas retry');
    await sleep(5000);
    return fetchJSON(url, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function muatSurah(no) {
  const fail = `${DIR}/surah-${pad(no)}.json`;
  if (!FORCE && existsSync(fail)) return { skip: true, fail };
  // per_page=300 muat 1 surah penuh (Baqarah 286) dalam 1 permintaan; ikut pagination jika perlu
  let verses = [];
  let page = 1;
  for (;;) {
    const url = `${API}/api/v4/verses/by_chapter/${no}?words=false&audio=${RECITATION_ID}&per_page=300&page=${page}&fields=text_uthmani`;
    const j = await fetchJSON(url);
    verses.push(...(j.verses || []));
    const pg = j.pagination || {};
    if (!pg.next_page) break;
    page = pg.next_page;
    await sleep(DELAY_MS);
  }
  if (!verses.length) throw new Error(`surah ${no}: tiada ayat`);
  const segments = {};
  let dilangkau = 0;
  for (const v of verses) {
    const segs = (v.audio && v.audio.segments) || [];
    const norm = [];
    for (const s of segs) {
      const [p, a, b] = [s[1], s[2], s[3]];
      if (!Number.isInteger(p) || p < 1 || !(a < b)) {
        dilangkau++;
        console.log(`  amaran ${v.verse_key}: segmen rosak [${p},${a},${b}] dilangkau`);
        continue; // hingar data sumber (cth. 2:164) — langkau, jangan reka
      }
      norm.push([p, a, b]);
    }
    if (!norm.length) throw new Error(`surah ${no} ${v.verse_key}: tiada segmen sah`);
    const first = norm[0], last = norm[norm.length - 1];
    segments[v.verse_key] = {
      timestamp_from: first ? first[1] : 0,
      timestamp_to: last ? last[2] : 0,
      duration_ms: last ? last[2] - (first ? first[1] : 0) : 0,
      segments: norm
    };
  }
  const rekod = { recitation_id: RECITATION_ID, surah: no, nama_qari: QARI, jenis: JENIS, segmen_dilangkau: dilangkau, segments };
  const teks = JSON.stringify(rekod);
  if (!DRY_RUN) writeFileSync(fail, teks);
  return { skip: false, fail, kb: Math.round(teks.length / 1024) };
}

async function utama() {
  mkdirSync(DIR, { recursive: true });
  let jumlahAyat = 0, jumlahSegmen = 0, saizKB = 0, dimuat = 0, dilangkau = 0;
  const senarai = ONLY ? [ONLY] : Array.from({ length: 114 }, (_, i) => i + 1);
  for (const no of senarai) {
    const r = await muatSurah(no);
    if (r.skip) { dilangkau++; }
    else {
      dimuat++;
      saizKB += r.kb || 0;
      console.log(`[${no}/114] ${r.fail} ... OK${r.kb ? ` (${r.kb} KB)` : ''}`);
    }
    if (no < 114) await sleep(DELAY_MS);
  }
  // Manifest (baca semula semua fail — termasuk yang dilangkau — supaya konsisten)
  const { readdirSync } = await import('node:fs');
  let jumlahDilangkau = 0;
  for (let no = 1; no <= 114; no++) {
    const j = JSON.parse(readFileSync(`${DIR}/surah-${pad(no)}.json`, 'utf8'));
    const keys = Object.keys(j.segments);
    jumlahAyat += keys.length;
    jumlahDilangkau += j.segmen_dilangkau || 0;
    for (const k of keys) jumlahSegmen += j.segments[k].segments.length;
    if (!j._kb) { try { saizKB += Math.round(readFileSync(`${DIR}/surah-${pad(no)}.json`, 'utf8').length / 1024); } catch (e) {} }
  }
  // Kira saiz tepat dari disk
  saizKB = 0;
  for (const f of readdirSync(DIR)) {
    if (f.endsWith('.json') && f !== 'manifest-segments.json') {
      saizKB += Math.round(readFileSync(`${DIR}/${f}`, 'utf8').length / 1024);
    }
  }
  const manifest = {
    recitation_id: RECITATION_ID,
    qari: QARI,
    jenis: JENIS,
    jumlah_surah: 114,
    jumlah_ayat: jumlahAyat,
    jumlah_segmen: jumlahSegmen,
    segmen_dilangkau_hingar: jumlahDilangkau,
    saiz_total_kb: saizKB,
    dijana_pada: new Date().toISOString(),
    sumber: `${API}/api/v4/verses/by_chapter/{N}?words=false&audio=${RECITATION_ID}&per_page=300`,
    sumber_editor: 'https://qul.tarteel.ai/surah_audio_files/7',
    audio_cdn: 'https://everyayah.com/data/Alafasy_128kbps/{SSS}{AAA}.mp3 (Fasa 4b: strim, bukan muat turun)'
  };
  if (!DRY_RUN) writeFileSync(`${DIR}/manifest-segments.json`, JSON.stringify(manifest, null, 2));
  console.log(`\nSELESAI: dimuat=${dimuat} dilangkau=${dilangkau} ayat=${jumlahAyat} segmen=${jumlahSegmen} saiz=${saizKB} KB`);
  if (!ONLY && jumlahAyat !== 6236) {
    console.error(`AMARAN: jumlah ayat ${jumlahAyat} ≠ 6236`);
    process.exitCode = 1;
  }
}

utama().catch((e) => { console.error('GAGAL:', e.message); process.exit(1); });
