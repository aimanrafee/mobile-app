# 02 — Seni Bina dan Struktur

## 2.1 Peta Direktori

```text
mobile app/ (repo: taubat-mobile-app)
├── index.html                    # Satu-satunya HTML: shell topbar + #screen + tabbar
├── css/
│   └── app.css                   # Token + asas + shell + komponen + skrin (1 fail)
├── js/
│   ├── main.js                   # Titik masuk: boot initDebug + initApp
│   ├── app.js                    # WIRING nipis: daftar skrin/tindakan, export initApp
│   ├── data.js                   # Kandungan statik: surah, Mathurat, doa, Iqra', acara
│   ├── platform/                 # LAPISAN PLATFORM (bukan ciri pengguna)
│   │   ├── core.js               # Store, DICT, waktu solat, Hijri, kiblat, toast
│   │   ├── ui.js                 # Helpers kongsi: $, esc, tr, kalendar, tema, getar
│   │   ├── router.js             # view/go/push/back/render + registry + initShell
│   │   └── debug.js              # Panel pembangun + systemChecks + selftest
│   └── features/                 # SATU fail = SATU ciri
│       ├── home.js               # Tracker solat + streak + heatmap + undur
│       ├── quran.js              # Senarai surah + surah + bookmark
│       ├── iqra.js               # Tahap + sel huruf
│       ├── doa.js                # Mathurat + koleksi doa
│       ├── more.js               # Grid alat (Lainnya)
│       ├── tasbih.js             # Tasbih digital
│       ├── calendar.js           # Kalendar + tindakan cal:* kongsi
│       ├── zakat.js              # Kalkulator zakat
│       ├── qibla.js              # Kompas kiblat
│       ├── fast.js               # Penjejak puasa (guna cal:* calendar.js)
│       ├── haid.js               # Penjejak haid (guna cal:* calendar.js)
│       ├── settings.js           # Bahasa, tema, debug, padam data
│       └── _template.js          # TEMPLATE ciri baru (salin fail ini)
└── System References/
    └── 01_…18_*.md              # Dokumen ini
```

## 2.2 Fungsi Setiap Fail Teras

### `index.html` — Shell Sahaja, Tiada Kandungan Skrin
- Susunan: `<head>` (meta viewport/theme-color, fon `<link>`, `app.css`, `main.js` modul) → pautan langkau → sprite SVG `#i-*` → `#app-shell` (topbar `#btn-back/#tb-title/#btn-lang/#btn-theme`, `main#app-main > #screen`, `nav#tabbar` 5 tab) → panel debug → `#toast` → `<noscript>`.
- Semua skrin disuntik ke `#screen` oleh `router.js:render`. Jangan tambah `<html>` baru untuk ciri — daftar skrin (dokumen 12).

### `js/app.js` — Wiring (Sengaja Nipis, ~70 Baris)
- Import render/actions setiap ciri → `registerScreen(id, fn, {title})` → `registerActions(...)` → `registerOnShow(...)` untuk home & quran.
- `initApp()` = `initShell(...)` + log + `render()`. Re-export `view/go/push/back/render` untuk keserasian (`main.js` import dari sini).

### `js/platform/router.js` — Navigasi + Registry
- `view = {tab, screen, params}`; `go(tab)` (set semula), `push(screen, params)`, `back()`, `render(keepScroll)` (bersih timer → suntik HTML → judul/back/tab aktif → `data-i18n` → onShow hooks → tatal).
- Registry: `SCREENS`, `ACTIONS` (asas `nav:tab/nav:screen/nav:back` sentiasa tersedia), `ON_SHOW`.
- `initShell()` pasang pendengar sekali: klik `[data-action]` (delegasi), tabbar, back, tema, bahasa, easter-egg 7 ketukan tajuk → debug.

### `js/platform/ui.js` — Helpers Kongsi
- DOM/i18n: `$`, `$$`, `esc`, `tr`, `locName`; pemasa: `clearTimers/every`; hari: `dayRecord/dayCount/isExempt/greetKey`; tema: `isDark/applyTheme`; `copyText/vibrate`; `monthGridHTML(params, mode)` kongsi calendar/fast/haid.

### `js/platform/core.js` — Teras Tanpa UI
- `store` (`taubat_app_v1`), `DICT` (my/en), `prayerTimes` (MWL: Subuh 18°, Isyak 17°), `toHijri` (Intl + sandaran tabular), `qiblaBearing`, `nextPrayer`, `toast`, `emitLog`.

### `js/data.js` — Kandungan Statik Sahaja
- `SURAHS` (Juz 'Amma terpilih), `BISMILLAH`, `MATHURAT`, `DUA_CATS/DUAS`, `IQRA_LEVELS`, `ISLAMIC_EVENTS`, `HIJRI_MONTHS`, `QUOTES`. Tiada logik.

### `js/platform/debug.js` — Panel Pembangun
- Pintasan konsol + ralat global → `LOGS` (maks 500); tab Logs/State/Info/Actions; `setDebugEnabled/isDebugEnabled/openDebugPanel/initDebug`.

## 2.3 Aliran Data dan Kebergantungan

```text
index.html ──<link>──▶ css/app.css (token → komponen → skrin)
      │
      └──<script type=module>──▶ main.js ──▶ app.js ──┬──▶ router.js ──▶ ui.js ──▶ core.js ──▶ data.js
                                                      └──▶ features/*.js ──▶ router.js + ui.js + core.js (+ data.js)
                                         debug.js ──▶ core.js sahaja
```

Peraturan keras (elak kitaran):
1. `router.js` **dilarang** import sebarang ciri — ciri import `view/render` dari router (satu arah).
2. `core.js`/`data.js` dilarang import `ui/router/features`.
3. `fast.js`/`haid.js` dilarang daftar `cal:*` sendiri — guna `calendarActions` (satu pemilik).
4. `app.js` satu-satunya fail yang menyentuh semua ciri (wiring).
