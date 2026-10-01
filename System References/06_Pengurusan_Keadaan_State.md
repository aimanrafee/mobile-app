# 06 — Pengurusan Keadaan (State)

> Store berpusat dalam `js/platform/core.js:125-179`. Semua ciri baca/tulis melalui `store` — tiada state global lain.

## 6.1 Bentuk State (`DEFAULTS`)

```js
{ lang:'my', theme:null, debug:false,          // null = ikut sistem
  prayers:{}, haid:{}, puasa:{},               // 'YYYY-MM-DD': {...} / true
  tasbih:{ count, target, phrase, day, today },
  bookmarks:[], lastRead:null, iqra:{}, mathurat:{}, nisab:23850 }
```

## 6.2 API Store

| API | Kelakuan |
|-----|----------|
| `store.state` | Baca terus (render sahaja) |
| `store.set(key, val, silent)` | Tulis + simpan + beritahu pelanggan |
| `store.update(fn)` | Mutasi berkelompok + simpan + siar `'*'` |
| `store.save()` | `localStorage.setItem('taubat_app_v1', JSON)` dalam try/catch |
| `store.reset()` | Kembali DEFAULTS tetapi kekalkan lang/theme/debug |
| `store.subscribe(fn)` | Cth. cat butang bahasa dalam `router.js` |

`loadState()` bergabung `DEFAULTS` + JSON tersimpan — kunci baharu sentiasa selamat ditambah. Store rosak → amaran log + mula semula (tiada crash).

## 6.3 Pemilikan Slice per Ciri

| Slice | Pemilik | Nota |
|-------|---------|------|
| `prayers` | `home.js` | Ketik semula = padam (togol) |
| `haid/puasa` | `calendar.js:cal:day` (cawangan `view.screen`) | Satu pemilik tindakan |
| `tasbih` | `tasbih.js` | Putar hari automatik (`day/today`) |
| `bookmarks/lastRead` | `quran.js` | Id `surah:ayat` |
| `iqra` | `iqra.js` | Kunci `levelId:index` |
| `mathurat` | `doa.js` | Per-hari, dihadkan `item.count` |
| `nisab` | `zakat.js` | Disimpan senyap (`silent`) |
| `lang/theme/debug` | `settings.js` + `router.js:initShell` | Tema `null` = auto sistem |

## 6.4 Migrasi & Profil Masa Depan (v2)

Bila `profile/auth` tiba: tambah kunci baharu dalam `DEFAULTS` (bukan fail stor baharu), naikkan semakan versi kunci (cth. `taubat_app_v2`), tulis fungsi migrasi sekali-lalu `v1→v2` dalam `core.js`. PIN mesti hash + salt — jangan simpan plain (lihat keputusan Fasa 1: semua lokal, label email "tanpa pengesahan").
