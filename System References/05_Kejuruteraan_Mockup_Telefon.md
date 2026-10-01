# 05 — Kejuruteraan Shell Mudah Alih

> Dokumen ini menggantikan topik "mockup telefon": app ini BUKAN mockup — ia aplikasi sebenar dengan shell gred-natif dalam `index.html` + `css/app.css:66-112`.

## 5.1 Struktur Shell

```text
body (wash + gradient desktop)
└── #app-shell (max-width:30rem, min-height:100dvh, flex column)
    ├── #app-topbar (sticky, blur 14px, safe-area-inset-top)
    │   └── .topbar-in: [#btn-back] #tb-title (tengah) [#btn-lang][#btn-theme]
    ├── #app-main (flex:1, padding-bawah = tabbar + safe-area)
    │   └── #screen (suntikan SPA)
    └── #tabbar (fixed, tengah, bawah + safe-area, pil gelap, 5 .tab)
```

## 5.2 Teknik Utama

| Teknik | Pelaksanaan | Sebab |
|--------|-------------|-------|
| Lebar aplikasi | `max-width:30rem; margin:0 auto` | Rupa app telefon di desktop |
| Ketinggian dinamik | `min-height:100dvh` | Betul di bar URL mudah alih |
| Takik (notch) | `env(safe-area-inset-top/bottom)` di topbar, main, tabbar | iPhone bertakik |
| Topbar kaca | `color-mix(...86%) + backdrop-filter:blur(14px)` | Kandungan nampak di bawah |
| Tabbar terapung | `position:fixed; left:50%; translateX(-50%); width:min(calc(100%-1.6rem),28.4rem)` | Kekal semasa skrol |
| Latar desktop | Radial zaitun/emas `@media (min-width:34rem)` | Telefon "terapung" di desktop |
| Overscroll | `overscroll-behavior-y:none` | Tiada lantunan rantai |

## 5.3 Peraturan Shell

1. Skrin tidak boleh andaikan lebar penuh viewport — reka dalam 30rem.
2. Kandungan bawah mesti lepasi tabbar: kekalkan padding `#app-main` sedia ada.
3. Ikon baharu = tambah `<symbol id="i-*">` pada sprite + guna `<svg class="ic"><use href="#i-*"/></svg>`.
