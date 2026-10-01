# 08 — Animasi dan Interaksi Mikro

> CSS tulen sahaja (`css/app.css`); tiada pustaka animasi. Semua gerak guna `--ease`.

## 8.1 Inventori Gerak

| Animasi | Lokasi | Kelakuan |
|---------|--------|----------|
| Kemasukan skrin | `#screen` + `@keyframes screenIn` | Pudar + naik 10px, `.35s var(--ease)`, setiap render |
| Tab aktif | `.tab(.active)` + `::after` | Warna/latar `.25s`, titik emas |
| Butang | `.tb-btn`, `.tab` `:active` | Skala `.92–.94`, `.15s` |
| Undur solat | `home.js:tickCountdown` + `every(1000)` | `HH:MM:SS` + bar progres; dibersihkan setiap render |
| Cincin tasbih | `tasbih.js` (`stroke-dashoffset`) | Susut berkadar `count/target` |
| Jarum kompas | `#qibla-needle` | `transition:transform .12s linear` (strim sensor) |
| Getar sentuh | `ui.js:vibrate` | Ketik tasbih/Mathurat (10–12ms), lengkap corak `[40,60,40]` |
| Fokus | `:focus-visible` | Garis emas 2px + offset |

## 8.2 Peraturan

1. Animasi hiasan sahaja — jangan sekat input; hormati `prefers-reduced-motion` bila menambah gerak baharu yang ketara.
2. Pemasa skrin mesti melalui `every()` supaya `render()` membersihkannya (`clearTimers`) — tiada `setInterval` mentah dalam ciri.
3. Sensor kompas menstrim transformasi — jangan `render()` dalam pengendali sensor.
