# 09 — Piawaian Kebolehcapaian (A11Y)

## 9.1 Ciri Sedia Ada

| Ciri | Pelaksanaan |
|------|-------------|
| Langkau kandungan | `.skip` → `#app-main` (muncul bila fokus) |
| Label kawalan | `aria-label` pada butang ikon, sel hari/kalendar, status solat |
| Keadaan togol | `aria-pressed` (sel Iqra'), `role=switch + aria-checked` (tetapan) |
| Kawasan live | `#screen[aria-live=polite]`, `#toast[role=status]` |
| Navigasi | `nav#tabbar[aria-label]`, tajuk topbar dikemas kini setiap skrin |
| Fokus | `:focus-visible` global; `[hidden]{display:none!important}` |
| Teks Arab | `lang="ar" dir="rtl"` (diumum betul oleh pembaca skrin) |
| Tanpa JS | `<noscript>` mesej + gaya sandaran |

## 9.2 Peraturan

1. Butang ikon baharu mesti ada `aria-label` dwibahasa (via `tr()`).
2. Togol keadaan mesti dedahkan keadaan (`aria-pressed`/`aria-checked`) — bukan warna sahaja.
3. Sprite SVG hiasan kekal `aria-hidden="true"`; kandungan Arab kekal berlabel bahasa.
4. Kontras: uji pasangan token baharu (teks di atas permukaan) dalam kedua-dua tema sebelum gabung.
