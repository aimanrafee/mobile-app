# 17 — Version Control and Git Flow

> Repo: `taubat-mobile-app` (folder `mobile app/`). Separate from the Website repo — histories never mix.

## 17.1 Branches & Tags

| Ref | Meaning |
|-----|---------|
| `main` | Stable — always hostable |
| `dev` | Feature-work integration |
| `feature/<name>` | E.g. `feature/auth-profile` — one feature per branch |
| `baseline-modular` | Safety tag: modular wiring + 12 features (commit `5acb26e`) |

## 17.2 Workflow

1. `git checkout dev && git pull` → `git checkout -b feature/<name>`.
2. Change → `node --check` + document-16 list → small commits with clear messages (`feat:`, `fix:`, `chore:`, `docs:`).
3. Before committing inspect: `git status`, `git diff --stat`, `git log --oneline -10`; stage intended files only; **never commit secrets** (user PINs/emails never enter the repo).
4. Merge `feature → dev` (test) → `main` (host).

## 17.3 Rollback

```powershell
git log --oneline -10                 # find a safe point
git diff <commit> --stat              # inspect the difference
git restore -s <commit> -- js/app.js  # roll back one file
git reset --hard baseline-modular     # full rollback (branch safely first if unsure)
```
