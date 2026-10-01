# 16 — Quality Assurance and Testing

> No test framework — strategy: syntax checks + Node smoke + debug panel + manual list + git tags.

## 16.1 Automated Checks

```powershell
# From the "mobile app" folder:
node --check js/app.js; node --check js/router.js; node --check js/ui.js
# + each js/features/*.js
```

Smoke test (pattern used during the modular refactor): stub minimal `localStorage/window/document/navigator` in Node, import every `render*`, assert string output >50 chars, and assert **29 actions** registered via `router.getAction()`:
`nav:tab/screen/back, day:select, prayer:set, surah:open, quran:trans, bm:toggle, ayah:read, iqra:open/cell/all/reset, doa:mode, dua:cat/copy, mathurat:count, tasbih:tap/reset/target/phrase, cal:nav/day, zakat:calc, qibla:enable, set:lang/theme/debug/reset`.

## 16.2 Debug Panel (`debug.js`)

Enable: Settings toggle or **7 taps** on `#tb-title`. Tabs: Logs (max 500, incl. global errors), State (store JSON), Info (device/prayer/Hijri), Actions (cleaners & tests). All try/catch-wrapped.

## 16.3 Pre-Merge Manual Checklist

- [ ] All 14 screens open (5 tabs + 9 sub-screens) with zero console errors
- [ ] Mark prayer → streak/heatmap change; restart app → persists
- [ ] MY↔EN on every screen; dark theme on every screen
- [ ] Surah search, bookmarks, `lastRead`; Iqra' cell toggles; Mathurat/tasbih counters + haptics
- [ ] Calendar: select day; fasting/period toggles from their own screens
- [ ] Zakat: below/above nisab; compass: support status; settings: confirmed reset
- [ ] 320px, 430px, desktop; real iOS when touching compass/safe-area
