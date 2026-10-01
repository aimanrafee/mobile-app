# 07 — Pengantarabangsaan (i18n)

> Kamus dalam `js/platform/core.js:17-122` (`DICT.my/en`); bantuan dalam `js/platform/ui.js` (`tr/locName`).

## 7.1 Mekanisme

1. Kunci UI: `tr(kunci)` — guna bahasa semasa, sandar ke `DICT.my`, akhir sekali kunci itu sendiri.
2. Nama kandungan: `locName({my, en})` — untuk surah, doa, tahap Iqra'.
3. Elemen statik: `data-i18n="tab_home"` dilukis semula setiap `render()` (`router.js`) — termasuk tabbar.
4. Tukar bahasa: butang `#btn-lang` (MY↔EN) + `settings.js:set:lang`; `document.documentElement.lang` dikemas kini.
5. Teks Arab: sentiasa `lang="ar" dir="rtl"` + fon `--font-quran` (ayat, bismillah, frasa tasbih).

## 7.2 Peraturan

- Rentetan baharu mesti wujud dalam **kedua-dua** `DICT.my` dan `DICT.en` (jangan pecahkan satu bahasa).
- Jangan suntik terjemahan via `innerHTML` — `tr()` mengembalikan teks; `esc()` bila digabung ke templat.
- Data kandungan (`data.js`) guna bentuk `{my, en}` + `locName()` — jangan kunci DICT untuk nama surah/doa.
