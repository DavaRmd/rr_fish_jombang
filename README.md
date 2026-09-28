<div align="center">

# 🐟 RR Fish Jombang

**Website Katalog & Pre-Order Bibit Ikan**

Website modern untuk usaha peternakan bibit ikan yang memudahkan calon pembeli melihat katalog produk, informasi harga, ketersediaan stok, dan melakukan pre-order langsung via WhatsApp.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## 📋 Tentang Project

**RR Fish Jombang** adalah website bisnis untuk usaha budidaya dan penjualan bibit ikan yang berlokasi di Jombang. Website ini berfungsi sebagai katalog produk digital sekaligus portal pre-order yang terintegrasi langsung dengan WhatsApp.

### Profil Usaha
- 🏊 **10+ kolam** pembibitan aktif
- 🐟 **4 jenis bibit**: Patin, Lele, Gurame, Nila
- 📦 Ukuran jual: **3–7 cm** per ekor
- 🚚 Area pengiriman: **Pulau Jawa & Kalimantan**
- 💬 Transaksi final dilakukan via **WhatsApp**

---

## ✨ Fitur

### Halaman Publik (Pengunjung)
- **Katalog Produk** — Tampilan kartu per jenis bibit ikan dengan status stok *real-time* (Tersedia / Habis / Indent) dan badge dinamis (*Musim Panen / Hampir Habis*)
- **Detail Produk** — Halaman per produk dengan galeri foto, variasi ukuran & harga, dan form pre-order
- **Form Pre-Order via WhatsApp** — Form interaktif yang otomatis menghasilkan pesan WhatsApp terformat ke nomor admin
- **Galeri Foto** — Dokumentasi kolam, proses pembibitan, dan pengiriman ikan
- **Testimoni Pelanggan** — Ulasan pembeli dengan rating bintang
- **Halaman Tentang** — Profil, visi misi, dan keunggulan usaha
- **Tombol WA Mengambang** — Akses kontak cepat di semua halaman
- **SEO-Optimized** — Sitemap dinamis, meta tag per produk, `og:image`, dan `robots.txt`
- **Responsif** — Mobile-first (375px) hingga desktop (1280px+)

### Dashboard Admin (Protected)
- 🔐 **Login Aman** — Autentikasi via Supabase Auth dengan fitur reset password
- 📊 **Dashboard Bisnis** — Metrik omset bulan ini, inquiry masuk, transaksi berhasil, dan produk aktif
- 🐠 **Kelola Produk** — CRUD lengkap dengan upload foto, variasi ukuran & harga dinamis, toggle stok/badge/aktif
- 🖼️ **Kelola Galeri** — Upload & hapus foto kolam dengan kompresi otomatis ke WebP
- ⭐ **Kelola Testimoni** — Tambah, hapus, dan toggle tampil ulasan pelanggan
- 📬 **Kelola Inquiry** — Pantau pesanan masuk, filter status, dan input nominal transaksi
- 💰 **Rekap Omset** — Laporan keuangan bulanan dengan breakdown per jenis ikan
- ⚙️ **Pengaturan** — Edit nomor WA, jam operasional, alamat, dan media sosial secara dinamis

---

## 🛠️ Tech Stack

| Layer | Teknologi | Versi |
|---|---|---|
| **Framework** | Next.js (App Router + RSC) | 16.2.2 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | v4 |
| **Database** | Supabase (PostgreSQL) | 2.102.1 |
| **Auth** | Supabase Auth + SSR | 0.10.0 |
| **Storage** | Supabase Storage | — |
| **Runtime** | React & React DOM | 19.2.4 |
| **Deployment** | Vercel | — |

### Arsitektur Utama
- **React Server Components (RSC)** — Halaman publik di-render di server untuk performa & SEO optimal
- **Static Site Generation (SSG)** — Halaman produk di-generate secara statis via `generateStaticParams`
- **Next.js Proxy Middleware** (`proxy.ts`) — Session refresh & proteksi route admin di edge level
- **Route Groups** (`(auth)`) — Pemisahan auth guard halaman admin dari halaman login
- **Client-Side Image Compression** — Canvas API auto-compress ke WebP (max 1200px, 80% quality) sebelum upload

---

## 📁 Struktur Project

```
rr_fish_jombang/
├── app/
│   ├── page.tsx                        # Home / Landing page
│   ├── galeri/page.tsx                 # Galeri foto lengkap
│   ├── tentang/page.tsx                # Halaman Tentang Kami
│   ├── produk/[slug]/page.tsx          # Detail produk (SSG)
│   ├── sitemap.ts                      # Sitemap dinamis
│   ├── robots.ts                       # SEO robots.txt
│   └── admin/
│       ├── login/page.tsx              # Halaman login
│       ├── layout.tsx                  # Admin shell layout
│       └── (auth)/                     # Route group (auth protected)
│           ├── layout.tsx              # Auth guard
│           ├── dashboard/page.tsx
│           ├── produk/page.tsx
│           ├── produk/tambah/page.tsx
│           ├── produk/edit/[id]/page.tsx
│           ├── galeri/page.tsx
│           ├── testimoni/page.tsx
│           ├── inquiry/page.tsx
│           ├── omset/page.tsx
│           └── pengaturan/page.tsx
├── components/
│   ├── ui/                             # Badge, Button, Modal
│   ├── layout/                         # Navbar, Footer, WAFloatButton
│   ├── sections/                       # Section komponen halaman Home
│   ├── produk/                         # ProductCard, OrderForm, ProductGallery
│   ├── galeri/                         # GalleryGrid
│   └── admin/                          # Semua komponen admin
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Browser client
│   │   └── server.ts                   # Server component client
│   ├── utils.ts                        # formatRupiah, formatDate, dst.
│   └── whatsapp.ts                     # Generator pesan WhatsApp
├── types/
│   └── index.ts                        # TypeScript types (Product, Inquiry, dll.)
├── proxy.ts                            # Next.js 16 middleware
└── public/
    └── og-image.png                    # OG image untuk SEO
```

---

## 🚀 Cara Menjalankan Secara Lokal

### Prasyarat
- Node.js 18.x ke atas
- Akun [Supabase](https://supabase.com) (free tier cukup)

### 1. Clone Repository
```bash
git clone https://github.com/DavaRmd/rr_fish_jombang.git
cd rr_fish_jombang
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env.local` di root project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
> Lihat panduan lengkap setup database di [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

### 4. Jalankan Dev Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser.

| URL | Keterangan |
|---|---|
| `http://localhost:3000` | Halaman publik (landing page) |
| `http://localhost:3000/admin` | Dashboard admin (butuh login) |

---

## 🗄️ Setup Database Supabase

Project ini membutuhkan 5 tabel di Supabase:

| Tabel | Fungsi |
|---|---|
| `products` | Katalog bibit ikan & variasi ukuran/harga |
| `gallery` | Metadata foto galeri peternakan |
| `testimonials` | Ulasan dan rating pelanggan |
| `inquiries` | Riwayat pre-order dari form website |
| `site_settings` | Konfigurasi global (nomor WA, jam buka, dll.) |

Serta 2 Storage bucket:
- `product-images` — Foto katalog per produk
- `gallery-images` — Foto galeri kolam & aktivitas

> Untuk SQL schema lengkap dan langkah setup, baca [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).

---

## 🔐 Akses Admin

1. Daftarkan email admin di **Supabase Dashboard → Authentication → Users**
2. Buka `/admin` — sistem akan redirect ke `/admin/login`
3. Login dengan email & password yang sudah didaftarkan
4. Setelah login, Anda akan diarahkan ke Dashboard

> Panduan penggunaan admin panel secara lengkap tersedia di [`ADMIN_MANUAL.md`](./ADMIN_MANUAL.md).

---

## 📦 Scripts

```bash
npm run dev      # Jalankan dev server
npm run build    # Build production
npm run start    # Jalankan production server
npm run lint     # Cek kualitas kode dengan ESLint
```

---

## 📖 Dokumentasi Tambahan

| File | Isi |
|---|---|
| [`PROJECT.md`](./PROJECT.md) | Gambaran umum, fitur, dan alur pengguna |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Schema database & keputusan arsitektur teknis |
| [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) | Panduan setup database Supabase dari awal |
| [`ADMIN_MANUAL.md`](./ADMIN_MANUAL.md) | Buku panduan penggunaan dashboard admin |
| [`DEVELOPMENT_REPORT.md`](./DEVELOPMENT_REPORT.md) | Laporan implementasi per fase & keputusan teknis |

---

## 🌐 Deployment ke Vercel

1. Push repository ke GitHub
2. Import project di [vercel.com/new](https://vercel.com/new)
3. Tambahkan 3 Environment Variables di Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy — Vercel akan otomatis build dan publish

---

## 📄 Lisensi

Project ini dibuat khusus untuk kebutuhan bisnis **RR Fish Jombang**. Tidak untuk didistribusikan secara umum.

---

<div align="center">

Dibuat dengan ❤️ menggunakan [Next.js](https://nextjs.org/) & [Supabase](https://supabase.com/)

</div>
