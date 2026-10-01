# 13 — Pengurusan SVG dan Aset

> Satu-satunya aset grafik ialah sprite SVG sebaris dalam `index.html:20-55`. Tiada imej raster, tiada fon ikon.

## 13.1 Inventori Simbol (`#i-*`)

`home, book, iqra, doa, grid, moon, sun, sunrise, cloudsun, sunset, check, back, fwd, bookmark, gear, bug, close, plus, minus, reset, compass, cal, drop, beads, scale, download, trash, copy, heart, star, globe, dot` — gaya stroke 24×24 (`fill:none; stroke:currentColor; stroke-width:2; linecap/linejoin:round` via `svg.ic`).

## 13.2 Peraturan

1. Guna: `<svg class="ic"><use href="#i-nama"/></svg>` — saiz ikut `font-size`/kelas konteks (kecuali `style` per-kes seperti kompas).
2. Ikon baharu: tambah `<symbol viewBox="0 0 24 24">` gaya stroke serasi; jangan import pustaka ikon.
3. Fon Google dimuat via `<link>` (bukan `@import`); `Scheherazade New` wajib untuk `.ar`.
4. Aset masa depan (audio bacaan, wallpaper ayat) mesti lazy-load via `await import()`/`<audio>` atas permintaan — jangan gemukkan muat awal.
