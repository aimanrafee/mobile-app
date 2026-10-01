# 07 — Internationalization (i18n)

> Dictionary in `js/platform/core.js:17-122` (`DICT.my/en`); helpers in `js/platform/ui.js` (`tr/locName`).

## 7.1 Mechanism

1. UI keys: `tr(key)` — current language, falls back to `DICT.my`, then the key itself.
2. Content names: `locName({my, en})` — for surahs, duas, Iqra' levels.
3. Static elements: `data-i18n="tab_home"` repainted on every `render()` (`router.js`) — including the tabbar.
4. Switching: `#btn-lang` button (MY↔EN) + `settings.js:set:lang`; `document.documentElement.lang` updated.
5. Arabic text: always `lang="ar" dir="rtl"` + `--font-quran` (verses, bismillah, tasbih phrases).

## 7.2 Rules

- New strings must exist in **both** `DICT.my` and `DICT.en` (never break one language).
- Never inject translations via `innerHTML` — `tr()` returns text; `esc()` when composing templates.
- Content data (`data.js`) uses `{my, en}` shape + `locName()` — no DICT keys for surah/dua names.
