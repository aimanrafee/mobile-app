# 15 — SEO and Meta Configuration

> A client-rendered SPA — SEO is limited by design (marketing/indexing lives in the Website repo). This covers what must be correct in the app.

## 15.1 Existing Meta (`index.html:4-8`)

| Tag | Value | Reason |
|-----|-------|--------|
| `charset/description` | UTF-8 + Malay description | Sharing + screen readers |
| `viewport` | `width=device-width, initial-scale=1, viewport-fit=cover` | Phones + notch |
| `theme-color` | `#FAF8F3` (JS-updated to `#1D201B` in dark) | URL bar/task switcher |
| `<html lang="ms">` | JS-switched to `en` when language is EN | Correct language announcement |
| `<title>` | `Taubat.App — Tak pernah terlambat untuk pulang` | Bookmarks/tabs |

## 15.2 Rules

1. Never make deep screens crawler-dependent — content materializes via JS after load.
2. Social/open-graph images only once the production domain is finalized (document 18).
3. Any future PWA (`manifest.json`, icons, `service-worker`) gets inventoried here.
