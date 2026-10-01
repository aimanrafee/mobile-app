# 14 — Cross-Browser Compatibility

> Targets: modern mobile + desktop Chrome/Edge/Firefox/Safari. Tested manually (no automated lab — document 16).

## 14.1 Feature & Fallback Matrix

| Feature | Risk | Existing fallback |
|---------|------|-------------------|
| ES modules | Old browsers | `<noscript>` message; HTTP server required |
| `100dvh` | Old Safari | Graceful `100vh` degradation (shell still full) |
| `color-mix()` (topbar) | Old browsers | Opaque `--bg` acceptable fallback (add rule if old support needed) |
| `Intl` Islamic calendar | Missing format | Arithmetic tabular fallback in `core.js:toHijri` |
| Clipboard | No `clipboard.writeText` | `fallbackCopy()` via textarea + `execCommand` |
| iOS compass | Sensor permission | `DeviceOrientationEvent.requestPermission()` + `qibla_nosupport` status |
| `matchMedia` | No listener | try/catch in `initShell` |
| Vibration | Desktop/no motor | Silent try/catch in `vibrate()` |

## 14.2 Rules

1. New APIs (WebAuthn, Notification, SW) must be feature-detected + messaged fallbacks — never assume support.
2. Test real iOS Safari for: `safe-area-inset`, compass, `backdrop-filter`, `100dvh`.
3. Keep zero console warnings on all target browsers before merging.
