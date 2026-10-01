# 18 — Pengaturan dan CI/CD

> Sasaran: hos statik (GitHub Pages). Tiada pelayan, tiada rahsia, tiada langkah binaan.

## 18.1 Model Hos

| Persekitaran | Sumber | URL (contoh) |
|--------------|--------|--------------|
| Pemasaran | repo `taubat-website` → `/` | `user.github.io/taubat/` |
| Aplikasi | repo ini → sublaluan `/app/` (atau repo Pages sendiri) | `user.github.io/taubat/app/` |

Peraturan nama: folder `mobile app` ber-space menjadi `%20` dalam URL — **tukar kepada `mobile-app/` atau `app/`** sebelum menolak ke GitHub.

## 18.2 Prasyarat Produksi

1. HTTPS wajib (Pages menyediakannya) — diperlukan WebAuthn/biometrik dan Notifikasi kelak.
2. Uji di URL sebenar: laluan relatif `css/app.css`, `js/main.js`, sprite `<use href="#i-...">` mesti lolos di sublaluan.
3. Pelayar memuat modul ES — tiada `file://`; tiada binaan.
4. Data kekal `localStorage` per-asal (origin) — pertukaran domain = stor baharu (rancang migrasi/eksport bila tiba).

## 18.3 Laluan Masa Depan (Bukan Skop Hos Statik)

- PWA boleh-pasang: tambah `manifest.json + service-worker + ikon` (daftarkan dalam dokumen 15).
- Gedung aplikasi: bungkus URL/natif via Capacitor/TWA/PWABuilder — butang Store dalam Website (`href="#"` kini) dihalakan ke penyenaraian sebenar.
- Akaun awan/OTP (Fasa 2): frontend kekal statik; hanya panggilan auth/pangkalan (Supabase/Firebase) ditambah — tiada pelayan untuk diselenggara.
