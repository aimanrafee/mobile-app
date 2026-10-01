// js/pwa.js — Register Service Worker + handle install prompt
export function initPWA() {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Worker tidak disokong');
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then((reg) => {
        console.log('[PWA] Service Worker didaftarkan:', reg.scope);

        // Auto-update: muat semula bila ada versi baharu
        reg.addEventListener('updatefound', () => {
          const baru = reg.installing;
          if (!baru) return;
          baru.addEventListener('statechange', () => {
            if (baru.state === 'installed' && navigator.serviceWorker.controller) {
              // Versi baharu sedia
              console.log('[PWA] Versi baharu sedia — sila refresh');
              // (Opsional: tunjuk toast "Versi baharu — refresh?")
            }
          });
        });
      })
      .catch((err) => console.error('[PWA] Daftar gagal:', err));
  });

  // Tangkap install prompt (Chrome/Edge)
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Sedia untuk install');
    // (Opsional: tunjuk butang "Install App")
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Berjaya install');
    deferredPrompt = null;
  });
}
