# 01 — Project Overview

> **Parent document** Taubat.App Mobile App System References · Last reviewed: 2026-10-01

## 1.1 Executive Summary

**Taubat.App (mobile app)** is a fully functional mobile web app — a spiritual journey companion: 5-daily-prayer tracker, Al-Quran (translation + bookmarks), 6-level Iqra', Al-Mathurat & 100+ duas, digital tasbih, Hijri calendar, zakat calculator, qibla compass, fasting & period trackers, and bilingual/theme settings.

Engineering principles: **modular vanilla SPA, zero dependencies**. One `index.html` + one `css/app.css` + ES6 modules (`core`, `ui`, `router`, `features/*`), no framework, no backend, no build step. All user data stays in on-device `localStorage` (`taubat_app_v1`).

## 1.2 Project Objectives

| # | Objective | Indicator |
|---|-----------|-----------|
| 1 | Track daily prayers honestly (ontime/late/qada) | `home.js:renderHome` — 5 status rows + 28-day heatmap |
| 2 | Read & resume Al-Quran | `quran.js` — `lastRead`, `bookmarks`, MY/EN toggle |
| 3 | Staged learning to read | `iqra.js` — 6 levels, tappable cells |
| 4 | Guided daily dhikr | `doa.js` — Mathurat counters + dua categories |
| 5 | Everyday Islamic tools | `tasbih/calendar/zakat/qibla/fast/haid.js` |
| 6 | Bilingual MY/EN + dark theme without reload | `core.js:DICT` + `ui.js:tr/locName/applyTheme` |
| 7 | Easy to extend with new features | `router.js:registerScreen/registerActions` + `features/_template.js` |

## 1.3 Target Users

- Muslims returning to consistency (new starters or long-absent prayers).
- Malay/English bilingual users; primary devices: phones (360–430 px).
- Offline-first — all data local, no account required (Phase 1).

## 1.4 Technology Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Markup | Semantic HTML5 | Single `index.html`: topbar + `#screen` + tabbar |
| Styling | Pure CSS3, one file | `css/app.css` — tokens + components + screens |
| Logic | Pure ES6 modules | `main/app/core/ui/router/debug/data + features/*` |
| Storage | `localStorage` JSON | Key `taubat_app_v1`; see document 06 |
| Fonts | Google Fonts (`Inter`, `Playfair Display`, `Scheherazade New`) via `<link>` | Not `@import` |
| Dev server | `python -m http.server` | Required (ES modules + CORS) |
| Build step | **None** | No bundler/transpiler |
| Hosting | Static (GitHub Pages targeted) | See document 18 |

## 1.5 Architecture Constraints

1. **No backend** — no API, OTP, or cloud database (Phase 1 local-only).
2. **Zero runtime dependencies** — no `node_modules` in production.
3. **ES modules = HTTP server required** — `file://` breaks `import`.
4. **PIN/biometric security = device-level deterrence, not server security** — see document 06.
