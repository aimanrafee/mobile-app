# 16 — Jaminan Kualiti dan Pengujian

> Tiada rangka ujian — strategi: semakan sintaks + smoke Node + panel debug + senarai manual + tag git.

## 16.1 Semakan Automatik

```powershell
# Dari folder "mobile app":
node --check js/app.js; node --check js/router.js; node --check js/ui.js
# + setiap js/features/*.js
```

Smoke test (pola yang digunakan semasa refactor modular): stub `localStorage/window/document/navigator` minimum dalam Node, import setiap `render*`, sahkan output string >50 aksara, dan sahkan **29 tindakan** berdaftar via `router.getAction()`:
`nav:tab/screen/back, day:select, prayer:set, surah:open, quran:trans, bm:toggle, ayah:read, iqra:open/cell/all/reset, doa:mode, dua:cat/copy, mathurat:count, tasbih:tap/reset/target/phrase, cal:nav/day, zakat:calc, qibla:enable, set:lang/theme/debug/reset`.

## 16.2 Panel Debug (`debug.js`)

Aktif: togol Tetapan atau **7 ketukan** `#tb-title`. Tab: Logs (maks 500, termasuk ralat global), State (JSON stor), Info (peranti/waktu solat/Hijri), Actions (pembersih & ujian). Semua dibalut try/catch.

## 16.3 Senarai Manual Pra-Gabung

- [ ] 14 skrin dibuka (5 tab + 9 sub-skrin) tanpa ralat konsol
- [ ] Tanda solat → streak/heatmap berubah; mula semula aplikasi → kekal
- [ ] MY↔EN di semua skrin; tema gelap di semua skrin
- [ ] Carian surah, bookmark, `lastRead`; sel Iqra' togol; kiraan Mathurat/tasbih + getar
- [ ] Kalendar: pilih hari; puasa/haid togol dari skrin masing-masing
- [ ] Zakat: bawah/atas nisab; kompas: status sokongan; tetapan: reset dengan pengesahan
- [ ] 320px, 430px, desktop; iOS sebenar bila sentuh kompas/safe-area
