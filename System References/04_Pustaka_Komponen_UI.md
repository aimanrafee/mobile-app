# 04 — Pustaka Komponen UI

> Komponen dalam `css/app.css` + penanda yang dijana `js/features/*.js`. Nilai dinamik sentiasa melalui `esc()` (dokumen 12).

## 4.1 Rangka (`index.html`)

| Komponen | Kelas/ID | Catatan |
|----------|----------|---------|
| Shell | `#app-shell` | `max-width:30rem`, tengah, bayang rangka |
| Topbar | `#app-topbar`, `.tb-btn`, `#btn-back`, `#tb-title`, `#btn-lang`, `#btn-theme` | Lekit + blur; back disorok di tab utama |
| Tabbar | `#tabbar`, `.tab(.active)` | Terapung pil gelap; titik emas penanda aktif |
| Pentas skrin | `#screen` | Animasi `screenIn` setiap render |
| Toast | `#toast` | `role=status`, `hidden` lalai |
| Debug | `#debug-fab`, `#debug-panel` | Hanya bila `store.state.debug` |

## 4.2 Komponen Umum

| Komponen | Kelas | Diguna |
|----------|-------|--------|
| Kicker/judul | `.kicker`, `.h-display`, `.wrap`, `.muted`, `.card` | Semua skrin |
| Butang | `.btn (.gold/.ghost/.block)`, `.mini-btn(.on)`, `.tb-btn`, `.chip(.on)`, `.pill-toggle(.on)`, `.switch(.on)`, `.count-btn(.done)` | Tindakan & togol |
| Borang | `.form-card`, `.field label+input`, `.result-box` | Zakat |
| Baris solat | `.p-row(.now)`, `.p-ico`, `.p-name/.p-time`, `.st-btn(.on-ontime/.on-late/.on-qada)`, `.exempt-tag` | Home |
| Kad statistik | `.streak-row .stat-chip` | Home, puasa, haid |
| Heatmap | `.heatmap i(.l1-4/.l2)` + legenda | Home |
| Petikan | `.quote-card .q-ar/.q-tx/.q-ref` | Home |
| Quran | `.search-box`, `.surah-row`, `.mushaf-head`, `.bismillah`, `.ayah .ar/.my/.en + .num`, `.ayah-tools`, `.read-banner` | Quran |
| Iqra' | `.level-grid .level-card .done-ring/.lv`, `.iqra-grid .iqra-cell(.red/.mastered)` | Iqra' |
| Zikir | `.dua-card .ar/.my`, `.dua-foot`, `.dua-cats` | Doa |
| Alat | `.tool-grid .tool-card .t-ico` | More |
| Tasbih | `.tasbih-ring .ring .tr-bg/.tr-fg`, `.tasbih-count/-target`, `.tasbih-presets` | Tasbih |
| Kalendar | `.cal-head/.cal-nav`, `.cal-grid .dow/.cal-day(.today/.sel) .hij/.mark(.period/.fast/.pray)`, `.event-list .event-row` | Calendar/fast/haid |
| Kompas | `.compass-stage .compass .dial .tick/.lab .needle .kaaba`, `.compass-read` | Qibla |
| Tetapan | `.settings-row`, `.pill-toggle` | Settings |

## 4.3 Peraturan Komponen

1. Ciri baru **guna semula** komponen di atas dahulu; kelas baharu hanya bila tiada padanan (dan mesti guna token dokumen 03).
2. Teks pengguna/API sentiasa `esc()` — jangan bina HTML dengan interpolasi mentah.
3. Setiap `data-action` mesti ada pemilik dalam `*Actions` (disemak smoke test dokumen 16).
