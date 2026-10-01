# 02 — Architecture and Structure

## 2.1 Directory Map

```text
mobile app/ (repo: taubat-mobile-app)
├── index.html                    # The only HTML: topbar shell + #screen + tabbar
├── css/
│   └── app.css                   # Tokens + base + shell + components + screens (1 file)
├── js/
│   ├── main.js                   # Entry: boot initDebug + initApp
│   ├── app.js                    # THIN wiring: register screens/actions, export initApp
│   ├── router.js                 # view/go/push/back/render + registry + initShell
│   ├── ui.js                     # Shared helpers: $, esc, tr, calendar, theme, vibrate
│   ├── core.js                   # Store, DICT, prayer times, Hijri, qibla, toast
│   ├── data.js                   # Static content: surahs, Mathurat, duas, Iqra', events
│   ├── debug.js                  # Developer panel (logs/state/info/actions)
│   └── features/                 # ONE file = ONE feature
│       ├── home.js               # Prayer tracker + streak + heatmap + countdown
│       ├── quran.js              # Surah list + surah + bookmarks
│       ├── iqra.js               # Levels + letter cells
│       ├── doa.js                # Mathurat + dua collection
│       ├── more.js               # Tools grid (More)
│       ├── tasbih.js             # Digital tasbih
│       ├── calendar.js           # Calendar + shared cal:* actions
│       ├── zakat.js              # Zakat calculator
│       ├── qibla.js              # Qibla compass
│       ├── fast.js               # Fasting tracker (uses calendar.js cal:*)
│       ├── haid.js               # Period tracker (uses calendar.js cal:*)
│       ├── settings.js           # Language, theme, debug, erase data
│       └── _template.js          # NEW-feature TEMPLATE (copy this file)
└── System References/
    └── 01_…18_*.md              # These documents
```

## 2.2 Core File Roles

### `index.html` — Shell Only, No Screen Content
- Order: `<head>` (viewport/theme-color meta, font `<link>`, `app.css`, `main.js` module) → skip link → `#i-*` SVG sprite → `#app-shell` (topbar `#btn-back/#tb-title/#btn-lang/#btn-theme`, `main#app-main > #screen`, `nav#tabbar` 5 tabs) → debug panel → `#toast` → `<noscript>`.
- All screens inject into `#screen` via `router.js:render`. Never add a new `.html` for a feature — register a screen (document 12).

### `js/app.js` — Wiring (Deliberately Thin, ~70 Lines)
- Imports each feature's render/actions → `registerScreen(id, fn, {title})` → `registerActions(...)` → `registerOnShow(...)` for home & quran.
- `initApp()` = `initShell(...)` + log + `render()`. Re-exports `view/go/push/back/render` for compatibility (`main.js` imports from here).

### `js/router.js` — Navigation + Registry
- `view = {tab, screen, params}`; `go(tab)` (reset), `push(screen, params)`, `back()`, `render(keepScroll)` (clear timers → inject HTML → title/back/active tab → `data-i18n` → onShow hooks → scroll).
- Registries: `SCREENS`, `ACTIONS` (base `nav:tab/nav:screen/nav:back` always available), `ON_SHOW`.
- `initShell()` wires once: `[data-action]` click delegation, tabbar, back, theme, language, 7-tap title easter egg → debug.

### `js/ui.js` — Shared Helpers
- DOM/i18n: `$`, `$$`, `esc`, `tr`, `locName`; timers: `clearTimers/every`; day: `dayRecord/dayCount/isExempt/greetKey`; theme: `isDark/applyTheme`; `copyText/vibrate`; `monthGridHTML(params, mode)` shared by calendar/fast/haid.

### `js/core.js` — UI-Free Core
- `store` (`taubat_app_v1`), `DICT` (my/en), `prayerTimes` (MWL: Fajr 18°, Isha 17°), `toHijri` (Intl + tabular fallback), `qiblaBearing`, `nextPrayer`, `toast`, `emitLog`.

### `js/data.js` — Static Content Only
- `SURAHS` (selected Juz 'Amma), `BISMILLAH`, `MATHURAT`, `DUA_CATS/DUAS`, `IQRA_LEVELS`, `ISLAMIC_EVENTS`, `HIJRI_MONTHS`, `QUOTES`. No logic.

### `js/debug.js` — Developer Panel
- Console + global error hooks → `LOGS` (max 500); Logs/State/Info/Actions tabs; `setDebugEnabled/isDebugEnabled/openDebugPanel/initDebug`.

## 2.3 Data Flow and Dependencies

```text
index.html ──<link>──▶ css/app.css (tokens → components → screens)
      │
      └──<script type=module>──▶ main.js ──▶ app.js ──┬──▶ router.js ──▶ ui.js ──▶ core.js ──▶ data.js
                                                      └──▶ features/*.js ──▶ router.js + ui.js + core.js (+ data.js)
                                         debug.js ──▶ core.js only
```

Hard rules (no cycles):
1. `router.js` must **never** import any feature — features import `view/render` from the router (one direction).
2. `core.js`/`data.js` must never import `ui/router/features`.
3. `fast.js`/`haid.js` must never register `cal:*` themselves — use `calendarActions` (single owner).
4. `app.js` is the only file touching all features (wiring).
