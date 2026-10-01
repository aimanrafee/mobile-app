# 12 — JavaScript Standards

> Pure ES modules, no build. Every file starts with a `/** name — purpose */` header.

## 12.1 Required Patterns

| Pattern | Example |
|---------|---------|
| Pure render | `export function renderX(params)` → returns HTML string (no side effects) |
| Registered actions | `export const xActions = { 'x:verb': (el) => {...} }` + `registerActions` in `app.js` |
| Show hooks | `registerOnShow((v) => ..., fn)` for post-injection listeners (Quran search, home timer) |
| Event delegation | Single `#screen` listener → `closest('[data-action]')` (no per-button onclick) |
| Escaping | `esc()` for ALL dynamic values in templates |
| Errors | try/catch + `emitLog('error', ...)`; store guarded (never crashes) |
| Imports | Relative `./` / `../` paths; follow document-02 dependency direction |

## 12.2 Adding a Feature (Summary)

1. Copy `features/_template.js` → `features/name.js`; write `renderName + nameActions`.
2. `app.js`: import → `registerScreen('name', renderName, {title})` → `registerActions(nameActions)`.
3. Open: `push('name')` or `data-action="nav:screen" data-screen="name"`.
4. Verify: `node --check` + smoke test (document 16) — every `data-action` must have an owner.

## 12.3 Prohibitions

- No `eval`, no `innerHTML` with raw input, no raw `setInterval` (use `every()`).
- No circular imports (router↔feature); no global state outside `store`.
- Files >250 lines = split signal (except static-content `data.js`).
