# Resepku — Aplikasi Katalog Resep PWA

Aplikasi katalog resep berbasis React + Vite. Memiliki tiga halaman navigasi, CRUD resep, penyimpanan lokal agar tetap dapat digunakan offline, dan dukungan instalasi PWA.

## Struktur folder

```text
resepku/
├── public/
│   ├── pwa-192.png
│   └── pwa-512.png
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   └── Header.jsx
│   ├── data/
│   │   ├── categories.js
│   │   └── profile.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   └── Recipes.jsx
│   ├── services/
│   │   └── recipes.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── supabase.sql
└── vite.config.js
```

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Jika ingin sinkronisasi cloud dengan Supabase, salin `.env.example` menjadi `.env`, lalu isi URL project dan publishable key Supabase. Tanpa konfigurasi Supabase, aplikasi tetap berfungsi menggunakan localStorage dan data contoh.

## Menguji PWA dan mode offline

```bash
npm run build
npm run preview
```

Buka URL preview melalui Chrome, tunggu service worker selesai terpasang, lalu gunakan ikon Install di address bar. Untuk menguji offline, buka DevTools → Application → Service Workers dan pastikan service worker aktif. Setelah halaman pernah dibuka saat online, aktifkan Offline melalui DevTools → Network dan refresh. Aplikasi shell tetap dapat dibuka dan operasi tambah, lihat, ubah, hapus, serta favorit tetap tersimpan di perangkat.

Catatan: sinkronisasi ke Supabase membutuhkan koneksi internet dan konfigurasi `.env`. Jika tidak dikonfigurasi, data tetap disimpan secara lokal pada browser/perangkat yang sama.

## Kesesuaian persyaratan tugas

- **Minimal 3 halaman:** Beranda, Resep, dan Profil dapat dinavigasi melalui header.
- **Halaman profil:** menampilkan nama, NIM, dan kelompok pada `src/data/profile.js`.
- **CRUD fungsional:** halaman Resep mendukung tambah, baca/detail, ubah, hapus, pencarian, filter kategori, pengurutan, dan favorit.
- **PWA:** manifest, ikon, service worker, precache aset build, cache font, dan fallback navigasi untuk penggunaan offline.
- **Responsive:** layout menyesuaikan desktop, tablet, dan ponsel; header dan footer membentang penuh, sedangkan konten menggunakan lebar maksimum agar tetap nyaman dibaca.
