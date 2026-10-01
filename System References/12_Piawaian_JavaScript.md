# 12 — Piawaian JavaScript

> Modul ES tulen, tiada binaan. Setiap fail bermula dengan pengepala `/** nama — tujuan */`.

## 12.1 Corak Wajib

| Corak | Contoh |
|-------|--------|
| Render tulen | `export function renderX(params)` → pulang string HTML (tiada kesan sampingan) |
| Tindakan berdaftar | `export const xActions = { 'x:aksi': (el) => {...} }` + `registerActions` di `app.js` |
| Hook paparan | `registerOnShow((v) => ..., fn)` untuk listener selepas suntikan (carian Quran, timer home) |
| Delegasi peristiwa | Satu pendengar `#screen` → `closest('[data-action]')` (jangan pasang onclick per butang) |
| Escape | `esc()` untuk SEMUA nilai dinamik dalam templat |
| Ralat | try/catch + `emitLog('error', ...)`; stor dalam try/catch (tiada crash) |
| Import | Laluan relatif `./` / `../`; ikut arah kebergantungan dokumen 02 |

## 12.2 Menambah Ciri (Ringkas)

1. Salin `features/_template.js` → `features/nama.js`; tulis `renderNama + namaActions`.
2. `app.js`: import → `registerScreen('nama', renderNama, {title})` → `registerActions(namaActions)`.
3. Buka: `push('nama')` atau `data-action="nav:screen" data-screen="nama"`.
4. Semak: `node --check` + smoke test (dokumen 16) — setiap `data-action` mesti ada pemilik.

## 12.3 Larangan

- Tiada `eval`, tiada `innerHTML` dengan input mentah, tiada `setInterval` mentah (guna `every()`).
- Tiada import bulatan (router↔ciri); tiada state global di luar `store`.
- Fail >250 baris = isyarat pecah (kecuali `data.js` kandungan statik).
