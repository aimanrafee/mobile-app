# 15 — Konfigurasi SEO dan Meta

> Aplikasi SPA yang dirender klien — SEO terhad mengikut reka bentuk (pemasaran/indeks diurus repo Website). Dokumen ini meliputi apa yang mesti betul dalam app.

## 15.1 Meta Sedia Ada (`index.html:4-8`)

| Tag | Nilai | Sebab |
|-----|-------|-------|
| `charset/description` | UTF-8 + penerangan Melayu | Perkongsian + pembaca skrin |
| `viewport` | `width=device-width, initial-scale=1, viewport-fit=cover` | Telefon + takik |
| `theme-color` | `#FAF8F3` (dikemas kini JS ke `#1D201B` mod gelap) | Bar URL/penukar tugas |
| `<html lang="ms">` | Ditukar JS ke `en` bila bahasa EN | Pengumuman bahasa betul |
| `<title>` | `Taubat.App — Tak pernah terlambat untuk pulang` | Penanda buku/tab |

## 15.2 Peraturan

1. Jangan jadikan skrin dalam bergantung pada perangkak — kandungan dizahirkan JS selepas muat.
2. Imej sosial/open-graph hanya ditambah bila domain produksi dimuktamadkan (dokumen 18).
3. Sebarang PWA kelak (`manifest.json`, ikon, `service-worker`) didaftar di sini sebagai inventori.
