# 13 — SVG and Asset Management

> The only graphic asset is the inline SVG sprite in `index.html:20-55`. No raster images, no icon fonts.

## 13.1 Symbol Inventory (`#i-*`)

`home, book, iqra, doa, grid, moon, sun, sunrise, cloudsun, sunset, check, back, fwd, bookmark, gear, bug, close, plus, minus, reset, compass, cal, drop, beads, scale, download, trash, copy, heart, star, globe, dot` — 24×24 stroke style (`fill:none; stroke:currentColor; stroke-width:2; linecap/linejoin:round` via `svg.ic`).

## 13.2 Rules

1. Usage: `<svg class="ic"><use href="#i-name"/></svg>` — sizes follow context font-size/classes (except per-case `style` like the compass).
2. New icons: add a matching stroke-style `<symbol viewBox="0 0 24 24">`; never import an icon library.
3. Google Fonts load via `<link>` (not `@import`); `Scheherazade New` is required for `.ar`.
4. Future assets (recitation audio, verse wallpapers) must lazy-load via `await import()`/`<audio>` on demand — never fatten initial load.
