# 14 — Keserasian Rentas Pelayar

> Sasaran: Chrome/Edge/Firefox/Safari moden mudah alih + desktop. Diuji manual (tiada lab automatik — dokumen 16).

## 14.1 Matriks Ciri & Sandaran

| Ciri | Risiko | Sandaran sedia ada |
|------|--------|--------------------|
| Modul ES | Pelayar lama | Mesej `<noscript>`; wajib pelayan HTTP |
| `100dvh` | Safari lama | Degradasi ke `100vh` boleh diterima (shell masih penuh) |
| `color-mix()` (topbar) | Pelayar lama | Latar legap `--bg` sebagai tampilan (tambah peraturan sandaran bila perlu sokong lama) |
| `Intl` kalendar Islam | Format tiada | Sandaran tabular aritmetik dalam `core.js:toHijri` |
| Papan klip | `clipboard.writeText` tiada | `fallbackCopy()` via textarea + `execCommand` |
| Kompas iOS | Kebenaran sensor | `DeviceOrientationEvent.requestPermission()` + status `qibla_nosupport` |
| `matchMedia` | Tiada listener | try/catch dalam `initShell` |
| Getar | Desktop/tiada motor | try/catch senyap dalam `vibrate()` |

## 14.2 Peraturan

1. API baharu (WebAuthn, Notification, SW) mesti dibalut pengesan-ciri + mesej sandaran — jangan andaikan sokongan.
2. Uji Safari iOS sebenar untuk: `safe-area-inset`, kompas, `backdrop-filter`, `100dvh`.
3. Kekalkan sifar amaran konsol di semua pelayar sasaran sebelum gabung.
