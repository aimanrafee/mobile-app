# 10 — Responsive and Grid Strategy

## 10.1 Responsive Model

| Range | Behavior (`css/app.css`) |
|-------|--------------------------|
| 320–480px (primary) | Full shell, tabbar `width:min(calc(100%-1.6rem),28.4rem)` |
| ≥34rem (`min-width:34rem`) | Wash + radial-gradient backdrop; shell stays centered 30rem |
| Height | `100dvh` + `safe-area-inset` (never fixed `100vh`) |

No dedicated tablet breakpoint — the 30rem design scales up naturally.

## 10.2 Per-Screen Grids

| Grid | Classes | Columns |
|------|---------|---------|
| Week strip | `.weekstrip .day-cell` | 7 cells ±3 days |
| Iqra' levels | `.level-grid` | Responsive cards |
| Iqra' letters | `.iqra-grid` | Dense tappable cells |
| Tools | `.tool-grid` | 7 tool cards |
| Calendar | `.cal-grid` | 7 columns + localized DOW header |
| Heatmap | `.heatmap` | 28 consistency cells |
| Tasbih | `.tasbih-presets` | Phrase chips |

## 10.3 Rules

1. New grids must be fluid (no fixed pixel widths for content columns).
2. Touch: tap targets ≥2.4rem (follow `.tb-btn`); calendar cells stay thumb-tappable.
3. Test 320px (iPhone SE) and 430px + desktop mode before merging.
