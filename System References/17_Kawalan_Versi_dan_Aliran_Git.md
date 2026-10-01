# 17 — Kawalan Versi dan Aliran Git

> Repo: `taubat-mobile-app` (folder `mobile app/`). Repo berasingan dari Website — sejarah tidak bercampur.

## 17.1 Cawangan & Tag

| Rujukan | Maksud |
|---------|--------|
| `main` | Stabil — sentiasa boleh hos |
| `dev` | Integrasi kerja ciri |
| `feature/<nama>` | Cth. `feature/auth-profile` — satu ciri satu cawangan |
| `baseline-modular` | Tag titik selamat: wiring modular + 12 ciri (commit `5acb26e`) |

## 17.2 Aliran Kerja

1. `git checkout dev && git pull` → `git checkout -b feature/<nama>`.
2. Ubah → `node --check` + senarai dokumen 16 → commit kecil mesej jelas (`feat:`, `fix:`, `chore:`, `docs:`).
3. Sebelum commit semak: `git status`, `git diff --stat`, `git log --oneline -10`; stage fail berniat sahaja; **jangan commit rahsia** (PIN/email pengguna tidak pernah masuk repo).
4. Merge `feature → dev` (uji) → `main` (hos).

## 17.3 Rollback

```powershell
git log --oneline -10                 # cari titik selamat
git diff <commit> --stat              # semak beza
git restore -s <commit> -- js/app.js  # undur satu fail
git reset --hard baseline-modular     # undur penuh (buat branch selamat dahulu jika ragu)
```
