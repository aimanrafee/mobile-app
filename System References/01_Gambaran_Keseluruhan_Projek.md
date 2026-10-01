# 01 — Gambaran Keseluruhan Projek

> **Dokumen induk** Rujukan Sistem Mobile App Taubat.App · Terakhir disemak: 2026-10-01

## 1.1 Ringkasan Eksekutif

**Taubat.App (mobile app)** ialah aplikasi web mudah alih berfungsi penuh — pendamping perjalanan rohani: penjejak solat 5 waktu, Al-Quran (terjemahan + tanda buku), 6 tahap Iqra', Al-Mathurat & 100+ doa, tasbih digital, kalendar Hijri, kalkulator zakat, kompas kiblat, penjejak puasa & haid, dan tetapan dwibahasa/tema.

Prinsip kejuruteraan: **SPA vanilla modular, sifar kebergantungan**. Satu `index.html` + satu `css/app.css` + modul ES6 (`core`, `ui`, `router`, `features/*`), tanpa framework, tanpa backend, tanpa langkah binaan. Semua data pengguna kekal dalam `localStorage` peranti (`taubat_app_v1`).

## 1.2 Objektif Projek

| # | Objektif | Penunjuk |
|---|----------|----------|
| 1 | Jejak solat harian dengan jujur (tepat/lewat/qada) | `home.js:renderHome` — 5 baris status + heatmap 28 hari |
| 2 | Baca & sambung Al-Quran | `quran.js` — `lastRead`, `bookmarks`, togol MY/EN |
| 3 | Belajar membaca berperingkat | `iqra.js` — 6 tahap, sel boleh ketik |
| 4 | Zikir harian terpandu | `doa.js` — kiraan Mathurat + kategori doa |
| 5 | Alat Islam harian | `tasbih/calendar/zakat/qibla/fast/haid.js` |
| 6 | Dwibahasa MY/EN + tema gelap tanpa muat semula | `core.js:DICT` + `ui.js:tr/locName/applyTheme` |
| 7 | Mudah ditambah ciri baru | `router.js:registerScreen/registerActions` + `features/_template.js` |

## 1.3 Sasaran Pengguna

- Muslim yang ingin kembali istiqamah (baru bermula atau lama meninggalkan solat).
- Pengguna dwibahasa Melayu/Inggeris; keutamaan peranti: telefon (360–430 px).
- Mod luar talian diutamakan — semua data setempat, tiada akaun diperlukan (Fasa 1).

## 1.4 Tindanan Teknologi

| Lapisan | Teknologi | Catatan |
|---------|-----------|---------|
| Penanda | HTML5 semantik | Satu `index.html`: topbar + `#screen` + tabbar |
| Penggayaan | CSS3 tulen, satu fail | `css/app.css` — token + komponen + skrin |
| Logik | Modul ES6 tulen | `main/app/core/ui/router/debug/data + features/*` |
| Simpanan | `localStorage` JSON | Kunci `taubat_app_v1`; lihat dokumen 06 |
| Fon | Google Fonts (`Inter`, `Playfair Display`, `Scheherazade New`) via `<link>` | Bukan `@import` |
| Pelayan pembangunan | `python -m http.server` | Wajib (modul ES + CORS) |
| Langkah binaan | **Tiada** | Tanpa pengikat/pentranspil |
| Pengehosan | Statik (GitHub Pages disasarkan) | Lihat dokumen 18 |

## 1.5 Batasan Seni Bina

1. **Tanpa hujung belakang** — tiada API, OTP, atau pangkalan data awan (Fasa 1 lokal sahaja).
2. **Sifar kebergantungan masa jalan** — tiada `node_modules` di produksi.
3. **Modul ES = wajib pelayan HTTP** — `file://` merosakkan `import`.
4. **Keselamatan PIN/biometrik = perlindungan peranti, bukan keselamatan pelayan** — lihat dokumen 06.
