# 05 — Phone Shell Engineering

> This replaces the "phone mockup" topic: this app is NOT a mockup — it is a real app with a native-grade shell in `index.html` + `css/app.css:66-112`.

## 5.1 Shell Structure

```text
body (wash + desktop gradients)
└── #app-shell (max-width:30rem, min-height:100dvh, flex column)
    ├── #app-topbar (sticky, 14px blur, safe-area-inset-top)
    │   └── .topbar-in: [#btn-back] #tb-title (center) [#btn-lang][#btn-theme]
    ├── #app-main (flex:1, bottom padding = tabbar + safe-area)
    │   └── #screen (SPA injection point)
    └── #tabbar (fixed, centered, bottom + safe-area, dark pill, 5 .tab)
```

## 5.2 Key Techniques

| Technique | Implementation | Reason |
|-----------|----------------|--------|
| App width | `max-width:30rem; margin:0 auto` | Phone-like on desktop |
| Dynamic height | `min-height:100dvh` | Correct with mobile URL bars |
| Notch | `env(safe-area-inset-top/bottom)` on topbar, main, tabbar | Notched iPhones |
| Glass topbar | `color-mix(...86%) + backdrop-filter:blur(14px)` | Content visible beneath |
| Floating tabbar | `position:fixed; left:50%; translateX(-50%); width:min(calc(100%-1.6rem),28.4rem)` | Persists while scrolling |
| Desktop backdrop | Olive/gold radials `@media (min-width:34rem)` | "Floating" phone on desktop |
| Overscroll | `overscroll-behavior-y:none` | No chained bounce |

## 5.3 Shell Rules

1. Screens must never assume full viewport width — design inside 30rem.
2. Bottom content must clear the tabbar: keep the existing `#app-main` padding.
3. New icon = add an `<symbol id="i-*">` to the sprite + use `<svg class="ic"><use href="#i-*"/></svg>`.
