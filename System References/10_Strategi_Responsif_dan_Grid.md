# 10 — Strategi Responsif dan Grid

## 10.1 Model Responsif

| Julat | Kelakuan (`css/app.css`) |
|-------|--------------------------|
| 320–480px (utama) | Shell penuh, tabbar `width:min(calc(100%-1.6rem),28.4rem)` |
| ≥34rem (`min-width:34rem`) | Latar wash + gradient radial; shell kekal 30rem tengah |
| Ketinggian | `100dvh` + `safe-area-inset` (bukan `100vh` tetap) |

Tiada titik putus tablet khusus — reka 30rem berskala semula jadi ke atas.

## 10.2 Grid per Skrin

| Grid | Kelas | Lajur |
|------|-------|-------|
| Jalur minggu | `.weekstrip .day-cell` | 7 sel ±3 hari |
| Tahap Iqra' | `.level-grid` | Kad responsif |
| Huruf Iqra' | `.iqra-grid` | Sel ketik padat |
| Alat | `.tool-grid` | Kad alat 7 item |
| Kalendar | `.cal-grid` | 7 lajur + pengepala DOW setempat |
| Heatmap | `.heatmap` | 28 sel konsistensi |
| Tasbih | `.tasbih-presets` | Cip frasa |

## 10.3 Peraturan

1. Grid baharu mesti cecair (tiada lebar piksel tetap untuk lajur kandungan).
2. Sentuhan: sasaran ketik ≥2.4rem (ikut `.tb-btn`); sel kalendar kekal boleh ketik ibu jari.
3. Uji 320px (iPhone SE) dan 430px + mod desktop sebelum gabung.
