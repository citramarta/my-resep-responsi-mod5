
# Resepku

Aplikasi web untuk menyimpan dan mencari resep masakan. Dibuat untuk tugas praktikum PPB Modul 5 (React PWA II).

## Apa saja yang bisa dilakukan

- Lihat daftar resep, lengkap dengan foto, waktu masak, dan kategori
- Tambah, ubah, dan hapus resep
- Upload foto untuk resep sendiri (otomatis dikecilkan sebelum disimpan)
- Cari resep lewat nama atau bahan, filter per kategori, dan urutkan berdasarkan terbaru, nama, atau waktu tercepat
- Tandai resep favorit dan lihat semuanya di halaman Favorit
- Halaman daftar dibagi per halaman (pagination)
- Tombol "Acak menu" di beranda kalau lagi bingung mau masak apa
- Halaman profil dengan foto yang bisa diganti
- Bisa diinstal seperti aplikasi biasa dan tetap bisa dibuka tanpa internet

## Teknologi

React 18, Vite, axios, dan vite-plugin-pwa. Data resep disimpan di localStorage, jadi aplikasi jalan tanpa server. Supabase bisa dipasang kalau mau sinkronisasi (opsional).

## Struktur folder

```text
resepku/
├── public/
│   ├── images/            foto resep contoh
│   ├── pwa-192.png
│   └── pwa-512.png
├── src/
│   ├── components/        Header, Footer, Pagination, RecipeCover
│   ├── data/              kategori dan data profil
│   ├── pages/             Home, Recipes, Favorites, RecipeDetail, Profile
│   ├── services/          penyimpanan data dan sinkronisasi
│   ├── utils/             kompres gambar
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── supabase.sql
└── vite.config.js
```

## Deploy

Repo ini dihubungkan ke Vercel. Setiap kali ada `git push` ke branch `main`, situs otomatis dibangun ulang. Kalau pakai Supabase, isi `VITE_API_BASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` di Environment Variables Vercel.
