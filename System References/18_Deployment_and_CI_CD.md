# 18 — Deployment and CI/CD

> Target: static hosting (GitHub Pages). No server, no secrets, no build step.

## 18.1 Hosting Model

| Environment | Source | URL (example) |
|-------------|--------|---------------|
| Marketing | `taubat-website` repo → `/` | `user.github.io/taubat/` |
| App | this repo → `/app/` subpath (or its own Pages repo) | `user.github.io/taubat/app/` |

Naming rule: the `mobile app` folder's space becomes `%20` in URLs — **rename to `mobile-app/` or `app/`** before pushing to GitHub.

## 18.2 Production Prerequisites

1. HTTPS required (Pages provides it) — needed for future WebAuthn/biometrics and Notifications.
2. Test on the real URL: relative paths `css/app.css`, `js/main.js`, sprite `<use href="#i-...">` must pass under a subpath.
3. Browsers load ES modules — no `file://`; no build.
4. Data stays in per-origin `localStorage` — changing domains = fresh store (plan migration/export when it happens).

## 18.3 Future Tracks (Out of Static-Hosting Scope)

- Installable PWA: add `manifest.json + service-worker + icons` (inventory in document 15).
- App stores: wrap web/native via Capacitor/TWA/PWABuilder — the Website's Store buttons (currently `href="#"`) point at real listings.
- Cloud accounts/OTP (Phase 2): frontend stays static; only auth/database calls (Supabase/Firebase) are added — no server to maintain.
