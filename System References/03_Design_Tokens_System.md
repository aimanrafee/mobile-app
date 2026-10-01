# 03 — Design Tokens System

> All tokens live in `css/app.css:8-48` (`:root` + `.dark`). The only file allowed to hold raw values.

## 3.1 Palette

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--bg / --surface / --wash` | `#FAF8F3 / #FFFFFF / #F1EEE2` | `#1D201B / #262A24 / #1D201B` | App bg / cards / outside-shell bg |
| `--text / --muted` | `#2A2F2C / #6B726C` | `#ECE8DD / #A7ACA3` | Primary / secondary text |
| `--accent` (olive) | `#5A6B3E` | `#8ba062` | Primary actions, links, `.App` title |
| `--gold` | `#B69D74` | `#c9b088` | Kickers, active-tab dot, mushaf accents |
| `--border / --hairline` | `rgb(0 0 0/.07)` | `rgb(255 255 255/.09-.10)` | Card borders |
| `--ok / --warn / --bad / --info` | `#4e7c43 / #b0823a / #a35347 / #5b6f8a` | same | Prayer status & feedback |
| `--tabbar / --tabbar-ink / --tabbar-active` | `#1c1c1c / #9a9a9a / #ffffff` | `#101010 / #8a8a8a` | Floating bottom bar |
| `--period*` | `#c97ba2 / #f3dfe9 / #5c2440` | soft `#4a2a3b` | Period tracker |
| `--mushaf-*` | bar `#2f5a43`, bg `#fdfaf1`, line `#ece4cd` | dark-adjusted | Surah headers |
| `--heat-0…4` | `#eee9db → #4e6238` | `#2b2f26 → #a4bd7c` | Consistency heatmap |

## 3.2 Typography

| Token | Value |
|-------|-------|
| `--font-body` | `Inter, system-ui, -apple-system, sans-serif` |
| `--font-display` | `Playfair Display, Georgia, serif` (headings, `.h-display`) |
| `--font-quran` | `Scheherazade New, Traditional Arabic, serif` (verses, `.ar`) |

## 3.3 Shape, Spacing, Shadow, Motion

- Radii: `--r-sm .55rem / --r-md .8rem / --r-lg 1.1rem / --r-xl 1.5rem / --r-full 999px`.
- Spacing: `--s1 .4rem → --s6 2.6rem`.
- Shadows: `--shadow-md / --shadow-lg`; easing: `--ease: cubic-bezier(.16,1,.3,1)`.
- Frame heights: `--topbar-h 3.4rem`, `--tabbar-h 4.6rem` (`#app-main` bottom padding depends on it).

## 3.4 Rules

1. Components/screens **must** use `var(--*)` — no raw hex outside the token block.
2. Every new color needs a `.dark` pair (test the theme toggle on all 14 screens).
3. Prefer the existing `--s*`/`--r*` scale before creating a token.
