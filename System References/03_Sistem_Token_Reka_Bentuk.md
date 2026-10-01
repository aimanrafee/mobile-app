# 03 — Sistem Token Reka Bentuk

> Semua token tinggal dalam `css/app.css:8-48` (`:root` + `.dark`). Satu-satunya fail yang boleh simpan nilai mentah.

## 3.1 Palet

| Token | Nilai terang | Gelap | Guna |
|-------|--------------|-------|------|
| `--bg / --surface / --wash` | `#FAF8F3 / #FFFFFF / #F1EEE2` | `#1D201B / #262A24 / #1D201B` | Latar app / kad / latar luar shell |
| `--text / --muted` | `#2A2F2C / #6B726C` | `#ECE8DD / #A7ACA3` | Teks utama / sekunder |
| `--accent` (zaitun) | `#5A6B3E` | `#8ba062` | Aksi utama, pautan, tajuk `.App` |
| `--gold` | `#B69D74` | `#c9b088` | Kicker, penanda aktif tab, aksen mushaf |
| `--border / --hairline` | `rgb(0 0 0/.07)` | `rgb(255 255 255/.09-.10)` | Sempadan kad |
| `--ok / --warn / --bad / --info` | `#4e7c43 / #b0823a / #a35347 / #5b6f8a` | sama | Status solat & maklum balas |
| `--tabbar / --tabbar-ink / --tabbar-active` | `#1c1c1c / #9a9a9a / #ffffff` | `#101010 / #8a8a8a` | Bar bawah terapung |
| `--period*` | `#c97ba2 / #f3dfe9 / #5c2440` | lembut `#4a2a3b` | Penjejak haid |
| `--mushaf-*` | bar `#2f5a43`, bg `#fdfaf1`, garis `#ece4cd` | gelap disesuaikan | Kepala surah |
| `--heat-0…4` | `#eee9db → #4e6238` | `#2b2f26 → #a4bd7c` | Heatmap konsistensi |

## 3.2 Tipografi

| Token | Nilai |
|-------|-------|
| `--font-body` | `Inter, system-ui, -apple-system, sans-serif` |
| `--font-display` | `Playfair Display, Georgia, serif` (tajuk, `.h-display`) |
| `--font-quran` | `Scheherazade New, Traditional Arabic, serif` (ayat, `.ar`) |

## 3.3 Bentuk, Jarak, Bayang, Gerak

- Jejari: `--r-sm .55rem / --r-md .8rem / --r-lg 1.1rem / --r-xl 1.5rem / --r-full 999px`.
- Jarak: `--s1 .4rem → --s6 2.6rem`.
- Bayang: `--shadow-md / --shadow-lg`; lengkung gerak: `--ease: cubic-bezier(.16,1,.3,1)`.
- Ketinggian rangka: `--topbar-h 3.4rem`, `--tabbar-h 4.6rem` (padding bawah `#app-main` bergantung padanya).

## 3.4 Peraturan

1. Komponen/skrin **wajib** guna `var(--*)` — tiada heks mentah di luar blok token.
2. Setiap warna baharu mesti ada pasangan `.dark` (uji togol tema di semua 14 skrin).
3. Saiz baharu guna skala `--s*`/`--r*` sedia ada dahulu sebelum cipta token.
