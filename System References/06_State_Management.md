# 06 — State Management

> Centralized store in `js/core.js:125-179`. All features read/write via `store` — no other global state.

## 6.1 State Shape (`DEFAULTS`)

```js
{ lang:'my', theme:null, debug:false,          // null = follow system
  prayers:{}, haid:{}, puasa:{},               // 'YYYY-MM-DD': {...} / true
  tasbih:{ count, target, phrase, day, today },
  bookmarks:[], lastRead:null, iqra:{}, mathurat:{}, nisab:23850 }
```

## 6.2 Store API

| API | Behavior |
|-----|----------|
| `store.state` | Direct read (rendering only) |
| `store.set(key, val, silent)` | Write + persist + notify subscribers |
| `store.update(fn)` | Batched mutation + persist + broadcast `'*'` |
| `store.save()` | `localStorage.setItem('taubat_app_v1', JSON)` in try/catch |
| `store.reset()` | Back to DEFAULTS but keeps lang/theme/debug |
| `store.subscribe(fn)` | E.g. language-button repaint in `router.js` |

`loadState()` merges DEFAULTS + saved JSON — new keys are always safe to add. Corrupt store → log warning + fresh start (no crash).

## 6.3 Per-Feature Slice Ownership

| Slice | Owner | Notes |
|-------|-------|-------|
| `prayers` | `home.js` | Re-tap = delete (toggle) |
| `haid/puasa` | `calendar.js:cal:day` (branches on `view.screen`) | Single action owner |
| `tasbih` | `tasbih.js` | Automatic day rollover (`day/today`) |
| `bookmarks/lastRead` | `quran.js` | Ids `surah:ayat` |
| `iqra` | `iqra.js` | Keys `levelId:index` |
| `mathurat` | `doa.js` | Per-day, capped at `item.count` |
| `nisab` | `zakat.js` | Stored silently (`silent`) |
| `lang/theme/debug` | `settings.js` + `router.js:initShell` | `null` theme = system auto |

## 6.4 Future Migration & Profile (v2)

When `profile/auth` arrives: add new keys in `DEFAULTS` (not a new store file), bump the key version (e.g. `taubat_app_v2`), write a one-pass `v1→v2` migration in `core.js`. PINs must be salted hashes — never plain (per the Phase-1 decision: all local, email labelled "unverified").
