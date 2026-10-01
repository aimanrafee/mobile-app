# 09 — Accessibility (A11Y) Standards

## 9.1 Existing Features

| Feature | Implementation |
|---------|----------------|
| Skip link | `.skip` → `#app-main` (appears on focus) |
| Control labels | `aria-label` on icon buttons, day/calendar cells, prayer status |
| Toggle state | `aria-pressed` (Iqra' cells), `role=switch + aria-checked` (settings) |
| Live regions | `#screen[aria-live=polite]`, `#toast[role=status]` |
| Navigation | `nav#tabbar[aria-label]`, topbar title updated per screen |
| Focus | Global `:focus-visible`; `[hidden]{display:none!important}` |
| Arabic text | `lang="ar" dir="rtl"` (announced correctly by screen readers) |
| No-JS | `<noscript>` message + fallback styles |

## 9.2 Rules

1. New icon buttons need bilingual `aria-label` (via `tr()`).
2. Toggles must expose state (`aria-pressed`/`aria-checked`) — never color alone.
3. Decorative SVG sprite stays `aria-hidden="true"`; Arabic content stays language-labelled.
4. Contrast: test new token pairs (text on surface) in both themes before merging.
