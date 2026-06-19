# AGENT_CONTEXT.md — Konteks Lengkap untuk AI Agent

> Baca file ini sepenuhnya sebelum mengerjakan task apapun.
> Setelah membaca, konfirmasi pemahamanmu, lalu kerjakan task pertama di `TASKS.md`.

---

## 1. Identitas Project

- **Nama usaha:** RR Fish Jombang
- **Nama project:** Website katalog & pre-order bibit ikan
- **Tujuan:** Meningkatkan penjualan bibit ikan, memperluas jangkauan pembeli, membangun kredibilitas usaha secara online
- **Bahasa seluruh UI:** Full Bahasa Indonesia
- **Placeholder nama sebelumnya:** "Benih Jaya" — sudah diganti dengan "RR Fish Jombang"

---

## 2. Profil Usaha

- Budidaya dan penjualan bibit ikan air tawar skala menengah, Jombang, Jawa Timur
- 10+ kolam pembibitan aktif
- Jenis bibit: **Gurame, Patin, Lele, Nila**
- Ukuran jual: 3–7 cm (tergantung jenis)
- Melayani perorangan hingga partai besar (>1000 ekor)
- Area pengiriman: Pulau Jawa (utama) + Kalimantan
- WhatsApp aktif: **087846799603** (format internasional: 6287846799603)
- Transaksi final (negosiasi, konfirmasi, pembayaran) sepenuhnya di WhatsApp — tidak ada payment gateway

---

## 3. Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14+ dengan App Router |
| Styling | Tailwind CSS — mobile first |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + password) |
| Storage | Supabase Storage |
| Deployment | Vercel |
| Bahasa | TypeScript di seluruh project |

**Breakpoint Tailwind:**
- Default → Mobile (prioritas utama)
- `md:` → Tablet
- `lg:` → Desktop

---

## 4. Struktur Halaman

```
/ (Home)              → Landing page — semua section dalam satu scroll
/produk/[slug]        → Detail produk + form pre-order
/tentang              → Tentang kami
/galeri               → Galeri foto lengkap
/admin/*              → Dashboard admin (protected, login required)
```

### Section di halaman Home (urutan dari atas ke bawah):
1. Navbar — logo kiri, hamburger menu di mobile, menu link di desktop
2. Hero — tagline, 2 tombol CTA (Pesan Sekarang + Lihat Produk), badge area pengiriman, statistik usaha
3. Katalog Produk — card 4 jenis ikan, tampilkan harga + badge stok + tombol pre-order
4. Cara Order — 4 langkah visual
5. Galeri — grid foto preview (maks 4–6 foto), link ke /galeri
6. Testimoni — card per pembeli
7. Footer — nama usaha, tagline, area pengiriman, jam operasional, nomor WA
8. Floating WhatsApp button — sticky di semua halaman publik

### Halaman /produk/[slug]:
- Layout **dua kolom di desktop**: foto + thumbnail gallery (kiri) | info produk + form pre-order inline (kanan)
- Layout **satu kolom di mobile**: foto full-width → info produk → sticky CTA button di bawah → form muncul sebagai bottom sheet modal
- Konten: nama produk, deskripsi, badge stok, harga per ukuran, informasi pengiriman, form pre-order

### Halaman Admin (/admin/*):
- Layout: sidebar navigasi kiri + konten kanan di desktop
- Mobile: sidebar tersembunyi, diganti topbar + hamburger menu
- Halaman: dashboard, produk, galeri, testimoni, inquiry, omset, pengaturan

---

## 5. Form Pre-Order — Detail

Field yang ada (hanya 5, sengaja singkat):
1. Nama lengkap (text input)
2. Asal / kota (text input)
3. Jumlah pesanan (radio): `100-500` | `500-1000` | `>1000`
4. Metode pengiriman (radio): `ambil_sendiri` | `ekspedisi_jawa` | `ekspedisi_kalimantan` | `kurir_lokal`
5. Catatan (text input, opsional)

**Format pesan WhatsApp yang di-generate otomatis:**
```
Halo, saya [Nama] dari [Kota]. Saya tertarik memesan [Nama Produk]
sebanyak [Jumlah] ekor dengan metode pengiriman [Metode].
[Catatan jika ada]. Mohon info harga dan ketersediaan stoknya. 🙏
```

Helper function untuk generate URL WhatsApp sudah ada di `ARCHITECTURE.md` → bagian `lib/whatsapp.ts`.

---

## 6. Database Supabase — Status

**Supabase sudah di-setup sepenuhnya. Jangan buat ulang.**

Yang sudah ada di Supabase:
- ✅ Tabel: `products`, `gallery`, `testimonials`, `inquiries`, `site_settings`
- ✅ Row Level Security (RLS) sudah aktif di semua tabel
- ✅ Storage bucket: `product-images` dan `gallery-images` (keduanya public)
- ✅ Storage policies sudah terpasang
- ✅ Akun admin sudah terdaftar: `rrfishjombang@gmail.com`
- ✅ Seed data produk sudah terisi (Gurame, Patin, Lele, Nila)
- ✅ Seed data `site_settings` sudah terisi

**Environment variables yang dibutuhkan (isi di project, jangan di-hardcode):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://mnndjkebreanobwftjng.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key dari Supabase dashboard]
SUPABASE_SERVICE_ROLE_KEY=[service role key dari Supabase dashboard]
```

Detail schema lengkap ada di `ARCHITECTURE.md`.

---

## 7. Desain & Visual

- **Warna utama:** Hijau — hex utama `#1D9E75`, gelap `#0F6E56`, muda `#EAF3DE`
- **Warna aksen teks hijau:** `#27500A` untuk teks di atas background hijau muda
- **Warna danger/hapus:** `#E24B4A`
- **Warna warning/amber:** `#EF9F27`
- **Pendekatan:** Mobile first, clean, flat — tidak menggunakan gradien atau shadow berat
- **Identitas brand:** Logo RR Fish Jombang sudah ada (diberikan klien dalam format JPG)
- **Tipografi:** Gunakan font yang bersih dan mudah dibaca — hindari font generik seperti Arial

### Badge status produk:
| Badge | Background | Warna teks |
|---|---|---|
| Tersedia | `#EAF3DE` | `#27500A` |
| Hampir Habis | `#FAEEDA` | `#633806` |
| Musim Panen | `#EAF3DE` | `#27500A` |
| Habis | `#FCEBEB` | `#791F1F` |
| Indent | `#E6F1FB` | `#0C447C` |

---

## 8. Keputusan Desain yang Sudah Dikonfirmasi

Keputusan berikut sudah disepakati dan tidak perlu didiskusikan ulang:

- Tipe website: **Hybrid** — Home adalah long scroll page, beberapa halaman dipisah
- Form pre-order: **bottom sheet modal di mobile, inline di desktop**
- Tidak ada payment gateway — transaksi di WhatsApp
- Tidak ada live chat selain WhatsApp
- Tidak ada multi-user admin / role management
- Tidak ada blog / artikel
- Harga ditampilkan langsung di website (bukan "hubungi kami")
- Harga bersifat fluktuatif — admin bisa update kapan saja
- Detail alamat pengiriman dibahas di WhatsApp, bukan di form
- Video galeri belum ada — skip dulu, siapkan slot untuk nanti
- Admin dashboard: single admin, tidak ada halaman registrasi

---

## 9. Struktur Folder Project

```
/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Home
│   ├── tentang/page.tsx
│   ├── galeri/page.tsx
│   ├── produk/[slug]/page.tsx
│   └── admin/
│       ├── layout.tsx              # Auth guard + sidebar layout
│       ├── page.tsx                # Redirect ke /admin/dashboard
│       ├── dashboard/page.tsx
│       ├── produk/page.tsx
│       ├── galeri/page.tsx
│       ├── testimoni/page.tsx
│       ├── inquiry/page.tsx
│       ├── omset/page.tsx
│       └── pengaturan/page.tsx
├── components/
│   ├── ui/                         # Button, Badge, Modal, dll
│   ├── layout/                     # Navbar, Footer, WAFloatButton
│   ├── sections/                   # Section-section di Home
│   ├── produk/                     # ProductCard, OrderForm
│   └── admin/                      # Sidebar, OmsetChart, InquiryTable
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Supabase browser client
│   │   └── server.ts               # Supabase server client
│   ├── whatsapp.ts                 # Helper generate pesan WA
│   └── utils.ts                    # Format harga, tanggal, dll
├── types/
│   └── index.ts                    # TypeScript types semua entitas
└── public/images/                  # Logo, placeholder images
```

Detail lengkap ada di `ARCHITECTURE.md`.

---

## 10. Konvensi Kode

- Gunakan **TypeScript** di seluruh project
- Gunakan **Server Components** sebisa mungkin — Client Components hanya jika butuh interaktivitas
- Fetch data di server component menggunakan Supabase server client
- Format harga: `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`
- Slug produk: **kebab-case** (contoh: `bibit-gurame`)
- Admin routes di-protect dengan auth guard di `app/admin/layout.tsx`
- Semua string UI dalam **Bahasa Indonesia**

---

## 11. File Referensi yang Tersedia

| File | Isi |
|---|---|
| `AGENT_CONTEXT.md` | File ini — ringkasan konteks untuk agent |
| `TASKS.md` | Daftar task terurut yang harus dikerjakan |
| `PROJECT.md` | Konteks bisnis lengkap |
| `ARCHITECTURE.md` | Schema database, TypeScript types, struktur folder detail |
| `DISCUSSION_NOTES.md` | Semua keputusan desain & teknis yang sudah disepakati |
| `SUPABASE_SETUP.md` | Dokumentasi setup Supabase (sudah selesai, untuk referensi) |
