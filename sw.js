// sw.js — Service Worker Taubat.App (cache + offline)
// Versi cache MESTI dinaikkan setiap kali app shell berubah (v1.0.0 → v1.0.1 …)
// Strategi: app shell cache-first · JSON cache-first + kemas kini latar ·
// font QPC cache-first jangka panjang · audio CDN network-first.
const VERSI = 'taubat-v1.0.0';
const CACHE_SHELL = VERSI + '-shell';
const CACHE_DATA = VERSI + '-data';
const CACHE_FONT = VERSI + '-font';

// Fail app shell — WAJIB cache (semua fail disahkan wujud dalam repo).
// Nota: data/quran/* TIDAK dimasukkan — lazy-load, cache kemudian on-demand.
// Nota: data/quran/qpc-tajweed/fonts/* TIDAK dimasukkan — 605 fail, cache on-demand.
const SHELL = [
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/main.js',
  './js/app.js',
  './js/data.js',
  './js/pwa.js',
  './js/platform/core.js',
  './js/platform/router.js',
  './js/platform/ui.js',
  './js/platform/debug.js',
  './js/features/home.js',
  './js/features/quran.js',
  './js/features/quran-pages.js',
  './js/features/iqra.js',
  './js/features/doa.js',
  './js/features/more.js',
  './js/features/tasbih.js',
  './js/features/calendar.js',
  './js/features/zakat.js',
  './js/features/qibla.js',
  './js/features/fast.js',
  './js/features/haid.js',
  './js/features/settings.js',
  './js/features/help.js',
  './js/features/ilmu.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// ── Install: cache app shell ──
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_SHELL)
      .then((c) => c.addAll(SHELL).catch((err) => {
        console.warn('Cache shell gagal (mungkin fail tiada):', err);
      }))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: buang cache lama ──
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !k.startsWith(VERSI))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: strategi berbeza ikut jenis ──
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Skip: audio CDN (network sahaja), chrome-extension, dsb.
  if (url.origin !== self.location.origin) {
    if (url.hostname.includes('audio-cdn.tarteel.ai') ||
      url.hostname.includes('cdn.islamic.network')) {
      // Audio: network-first, cache jika berjaya
      e.respondWith(
        fetch(e.request).then((r) => {
          if (r.ok) {
            const klon = r.clone();
            caches.open(CACHE_DATA).then((c) => c.put(e.request, klon));
          }
          return r;
        }).catch(() => caches.match(e.request))
      );
    }
    return; // Biar pelayar handle URL luar lain
  }

  // Font QPC V4 → cache-first (jarang berubah)
  if (url.pathname.includes('/qpc-tajweed/fonts/')) {
    e.respondWith(
      caches.match(e.request).then((r) => r || fetch(e.request).then((res) => {
        if (res.ok) {
          const klon = res.clone();
          caches.open(CACHE_FONT).then((c) => c.put(e.request, klon));
        }
        return res;
      }))
    );
    return;
  }

  // Data JSON → cache-first, update background
  if (/\.json$/.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        const fetchBaru = fetch(e.request).then((res) => {
          if (res.ok) {
            const klon = res.clone();
            caches.open(CACHE_DATA).then((c) => c.put(e.request, klon));
          }
          return res;
        }).catch(() => cached);
        return cached || fetchBaru;
      })
    );
    return;
  }

  // App shell (HTML/CSS/JS) → cache-first
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).catch(() =>
      // Fallback ke offline.html untuk navigasi
      e.request.mode === 'navigate' ? caches.match('./offline.html') : null
    ))
  );
});
