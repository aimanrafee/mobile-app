# 11 — Metodologi CSS

> Satu fail `css/app.css` (~472+ baris), disusun bernombor. Tiada pra-pemproses, tiada rangka kerja.

## 11.1 Susunan Seksyen

```text
1. Token (:root + .dark)          2. Asas (*, body, .ic, .skip, fokus)
3. Rangka (#app-shell/topbar/main) 4. Tabbar terapung
5. Komponen umum (.wrap/.card/.btn/.chip...)  6+ Skrin (mengikut ciri)
```

## 11.2 Konvensyen

- Penamaan: kebab-case, awalan skrin (`p-` solat, `m-` mushaf, `q-` petikan, `tr-` tasbih-ring, `nc-` kad seterusnya).
- Keadaan: pengubah suai `.on/.active/.sel/.today/.done/.mastered/.now` — konsisten merentas skrin.
- Nilai: `var(--*)` + `rem`/`%`; elak `px` untuk tipografi/jarak; elak `style=""` sebaris dalam JS kecuali pembolehubah dikira (cth. `stroke-dashoffset`, lebar bar).
- Fungsi moden yang digunakan: `color-mix()`, `min()`, `env()` — lihat dokumen 14 untuk sandaran.

## 11.3 Peraturan

1. Ciri baru tambah seksyen baharu di hujung mengikut corak sedia ada; jangan selit rawak.
2. Satu sumber kebenaran warna ialah blok token — grep `#[0-9a-fA-F]` mesti hanya kena blok token.
3. Uji `.dark` setiap kali menambah peraturan warna.
