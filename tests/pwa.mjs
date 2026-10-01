// tests/pwa.mjs — Ujian PWA: manifest, ikon, service worker, offline, wiring
// Jalankan dari folder "mobile app": node tests/pwa.mjs
import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const R = [];
const ok = (n, c, x) => R.push((c ? 'OK    ' : 'GAGAL ') + n + (x ? ' :: ' + x : ''));
let keluar = 1;

const pngSaiz = (f) => {
  const b = readFileSync(f);
  if (b.length < 24 || b[0] !== 0x89 || b[1] !== 0x50) return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), kb: Math.round(b.length / 1024) };
};
const check = (f) => {
  try { execSync(`node --check "${f}"`, { stdio: 'pipe' }); return true; }
  catch (e) { return false; }
};

try {
  /* ── 1. manifest.webmanifest sah + medan wajib ── */
  let man = null;
  try { man = JSON.parse(readFileSync('manifest.webmanifest', 'utf8')); } catch (e) {}
  ok('manifest.webmanifest wujud + JSON sah', !!man);
  const wajib = ['name', 'short_name', 'start_url', 'display', 'icons'];
  ok('manifest ada medan wajib', !!man && wajib.every((k) => man[k] !== undefined),
    man ? 'name=' + man.name : 'tiada');
  ok('manifest display=standalone', !!man && man.display === 'standalone');
  ok('manifest ikon 192+512+maskable', !!man && Array.isArray(man.icons) &&
    man.icons.some((i) => i.sizes === '192x192') &&
    man.icons.some((i) => i.sizes === '512x512' && !i.purpose) &&
    man.icons.some((i) => i.purpose === 'maskable'));

  /* ── 2. warna manifest padan token sebenar app.css ── */
  const css = readFileSync('css/app.css', 'utf8');
  const krim = (css.match(/--cream-200:(#[0-9A-Fa-f]{6})/) || [])[1];
  const zaitun = (css.match(/--olive-500:(#[0-9A-Fa-f]{6})/) || [])[1];
  ok('manifest background_color = --cream-200', !!man && !!krim &&
    man.background_color.toLowerCase() === krim.toLowerCase(),
    `manifest=${man && man.background_color} token=${krim}`);
  ok('manifest theme_color = --olive-500', !!man && !!zaitun &&
    man.theme_color.toLowerCase() === zaitun.toLowerCase(),
    `manifest=${man && man.theme_color} token=${zaitun}`);

  /* ── 3. ikon wujud + dimensi betul ── */
  const i192 = existsSync('icons/icon-192.png') ? pngSaiz('icons/icon-192.png') : null;
  const i512 = existsSync('icons/icon-512.png') ? pngSaiz('icons/icon-512.png') : null;
  const iMas = existsSync('icons/icon-maskable-512.png') ? pngSaiz('icons/icon-maskable-512.png') : null;
  const iApp = existsSync('icons/apple-touch-icon.png') ? pngSaiz('icons/apple-touch-icon.png') : null;
  ok('ikon 192x192', !!i192 && i192.w === 192 && i192.h === 192);
  ok('ikon 512x512', !!i512 && i512.w === 512 && i512.h === 512);
  ok('ikon maskable 512x512', !!iMas && iMas.w === 512 && iMas.h === 512);
  ok('apple-touch-icon 180x180', !!iApp && iApp.w === 180 && iApp.h === 180);
  let icoOk = false;
  try {
    const b = readFileSync('icons/favicon.ico');
    icoOk = b.length > 22 && b[0] === 0 && b[1] === 0 && b[2] === 1 &&
      b.readUInt32BE(22) === 0x89504e47; // muatan PNG
  } catch (e) {}
  ok('favicon.ico sah (bekas ICO + PNG)', icoOk);

  /* ── 4. sw.js: wujud + sintaks + versi + semua SHELL wujud ── */
  const swAda = existsSync('sw.js');
  ok('sw.js wujud', swAda);
  ok('sw.js node --check lulus', swAda && check('sw.js'));
  let sw = '';
  try { sw = readFileSync('sw.js', 'utf8'); } catch (e) {}
  ok('sw.js ada VERSI cache', /taubat-v\d+\.\d+\.\d+/.test(sw));
  const shell = [...sw.matchAll(/'\.\/([^']+)'/g)].map((m) => m[1])
    .filter((p) => !['', 'index.html'].includes(p) && /\.(js|css|png|webmanifest|html)$/.test(p));
  const tiada = [...new Set(shell)].filter((p) => !existsSync(p));
  ok('semua fail SHELL wujud (tiada auth/cari/tanda palsu)', shell.length > 0 && tiada.length === 0,
    tiada.length ? 'tiada: ' + tiada.join(', ') : shell.length + ' fail disemak');
  ok('sw.js TIDAK cache 605 font dalam SHELL', !shell.some((p) => p.includes('qpc-tajweed/fonts/')));
  ok('sw.js ada strategi audio network-first', sw.includes('audio-cdn.tarteel.ai'));
  ok('sw.js ada fallback offline.html', sw.includes('offline.html'));

  /* ── 5. offline.html ── */
  let off = '';
  try { off = readFileSync('offline.html', 'utf8'); } catch (e) {}
  ok('offline.html wujud + butang cuba semula', off.includes('location.reload()'));

  /* ── 6. wiring index.html + main.js + pwa.js ── */
  const html = readFileSync('index.html', 'utf8');
  ok('index.html ada <link rel="manifest">', html.includes('rel="manifest"'));
  ok('index.html ada theme-color + apple-touch-icon', html.includes('name="theme-color"') && html.includes('apple-touch-icon'));
  const main = readFileSync('js/main.js', 'utf8');
  ok('main.js import + panggil initPWA', main.includes('initPWA') && main.includes("from './pwa.js'"));
  ok('js/pwa.js node --check lulus', existsSync('js/pwa.js') && check('js/pwa.js'));

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
