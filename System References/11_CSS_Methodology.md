# 11 — CSS Methodology

> One file `css/app.css` (~472+ lines), numbered sections. No preprocessor, no framework.

## 11.1 Section Order

```text
1. Tokens (:root + .dark)            2. Base (*, body, .ic, .skip, focus)
3. Frame (#app-shell/topbar/main)    4. Floating tabbar
5. Shared components (.wrap/.card/.btn/.chip...)  6+ Screens (per feature)
```

## 11.2 Conventions

- Naming: kebab-case, screen prefixes (`p-` prayer, `m-` mushaf, `q-` quote, `tr-` tasbih-ring, `nc-` next-card).
- State: `.on/.active/.sel/.today/.done/.mastered/.now` modifiers — consistent across screens.
- Values: `var(--*)` + `rem`/`%`; avoid `px` for type/spacing; avoid inline `style=""` in JS except computed values (e.g. `stroke-dashoffset`, bar width).
- Modern functions used: `color-mix()`, `min()`, `env()` — see document 14 for fallbacks.

## 11.3 Rules

1. New features append a section at the end following the existing pattern; no random inserts.
2. Single source of color truth is the token block — grep `#[0-9a-fA-F]` must only hit the token block.
3. Test `.dark` whenever adding color rules.
