# DISCUSSION_NOTES.md — Catatan Diskusi & Keputusan Project

> File ini merangkum seluruh diskusi perencanaan project website peternakan bibit ikan.
> Untuk konteks bisnis lengkap → baca `PROJECT.md`
> Untuk detail teknis → baca `ARCHITECTURE.md`

---

## 1. Latar Belakang

Pemilik usaha memiliki peternakan bibit ikan skala menengah yang beroperasi di kebun belakang rumah. Usaha ini membudidayakan bibit ikan dan menjualnya kembali setelah mencapai ukuran tertentu. Pemilik ingin dibuatkan website untuk **meningkatkan penjualan** dan memperluas jangkauan pembeli.

**Profil usaha:**
- 10+ kolam pembibitan aktif (akan terus bertambah)
- Jenis bibit: Patin, Lele, Gurame, Nila
- Ukuran jual: 3–7 cm (tergantung jenis dan kebutuhan)
- Melayani perorangan hingga partai besar
- Area pengiriman: Pulau Jawa (utama) + Kalimantan

---

## 2. Keputusan Konsep Website

### Tipe Website
Diputuskan: **Hybrid** — bukan pure single page, bukan pure multi page.
- Halaman utama (Home) adalah landing page dengan semua section dalam satu scroll
- Beberapa halaman dipisah karena alasan konten dan SEO

### Struktur Halaman Final
```
/ (Home)              → Landing page utama
/produk/[slug]        → Detail produk + form pre-order
/tentang              → Tentang kami
/galeri               → Galeri foto lengkap
/admin/*              → Dashboard admin (protected)
```

### Alasan Pemisahan Halaman
- `/produk/[slug]` dipisah → form pre-order butuh ruang, bagus untuk SEO lokal
- `/tentang` dan `/galeri` dipisah → halaman utama tidak terlalu berat, konten bisa berkembang
- `/admin` dipisah → butuh autentikasi dan layout berbeda

---

## 3. Tech Stack yang Dipilih

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR/SSG untuk SEO, deployment mudah di Vercel |
| Styling | Tailwind CSS | Mobile first, utility-first, cepat |
| Database + Auth | Supabase | Free tier cukup, mudah setup, built-in auth |
| Storage | Supabase Storage | Upload foto produk & galeri |
| Deployment | Vercel | Gratis, auto-deploy dari GitHub |

### Opsi yang Dipertimbangkan tapi Ditolak
- **Laravel + Filament** → terlalu berat untuk skala project ini, butuh VPS berbayar
- **Astro** → dipertimbangkan, tapi Next.js lebih familiar dan lebih fleksibel untuk fitur dinamis

---

## 4. Keputusan Desain

### Pendekatan
- **Mobile first** — prioritas utama adalah tampilan HP/tablet
- Tetap responsif dan nyaman di desktop/PC
- Breakpoint: Default (mobile) → `md:` tablet → `lg:` desktop

### Identitas Visual
- Usaha sudah punya nama brand dan logo → langsung dipakai
- Warna dominan: hijau (nuansa alam/peternakan)
- Bahasa: **Full Bahasa Indonesia**

### Konten yang Sudah Tersedia dari Klien
| Konten | Status |
|---|---|
| Logo | ✅ Ada |
| Foto kolam & aktivitas | ✅ Ada |
| Data produk (jenis, ukuran, harga) | ✅ Ada |
| Video aktivitas budidaya | ❌ Belum ada — skip dulu |

---

## 5. Alur User — Final

Ini alur lengkap yang sudah disepakati:

```
1. Buka website
2. Lihat Hero section (kesan pertama, tagline, CTA)
3. Scroll ke Katalog Produk
   → lihat jenis ikan, ukuran, harga, status stok
4. Cek kredibilitas usaha
   → halaman Tentang Kami, Galeri foto nyata, Testimoni pembeli
5. Lihat section Cara Order
   → pahami langkah pemesanan sebelum bertindak
6. Klik produk yang diminati
   → masuk ke /produk/[slug]
7. Isi Form Pre-Order:
   - Nama lengkap
   - Asal / kota
   - Jumlah pesanan (pilihan radio):
       ○ 100 – 500 ekor
       ○ 500 – 1.000 ekor
       ○ > 1.000 ekor
   - Metode pengiriman (pilihan radio):
       ○ Ambil sendiri
       ○ Ekspedisi / cargo (Jawa)
       ○ Ekspedisi / cargo (Kalimantan)
       ○ Kurir / kendaraan lokal
   - Catatan opsional
8. Klik "Lanjut via WhatsApp"
9. Redirect ke WhatsApp dengan pesan otomatis:
   "Halo, saya [Nama] dari [Kota]. Saya tertarik memesan
   [Bibit X] sebanyak [Jumlah] ekor dengan metode pengiriman
   [Metode]. [Catatan jika ada].
   Mohon info harga dan ketersediaan stoknya. 🙏"
10. Negosiasi & konfirmasi langsung di WhatsApp
11. Selesai ✅
```

**Catatan penting:**
- Form hanya 4–5 field, sengaja dibuat singkat agar tidak membebani user
- Detail alamat lengkap dibahas di WhatsApp, bukan di form
- Tidak ada payment gateway — transaksi final sepenuhnya di WhatsApp

---

## 6. Alur Admin — Final

```
1. Login ke /admin (email + password via Supabase Auth)
2. Masuk dashboard → lihat ringkasan data
3. Kelola Produk → tambah / edit / hapus produk
   - Nama, slug, foto, deskripsi
   - Ukuran & harga per ukuran (bisa diupdate kapan saja)
   - Status stok: Tersedia / Habis / Indent
   - Badge: Hampir Habis / Sedang Musim Panen (toggle)
4. Kelola Galeri → upload / hapus foto
5. Kelola Testimoni → tambah / hapus
6. Kelola Inquiry:
   - Lihat daftar calon pembeli yang submit form pre-order
   - Update status: Pending → Berhasil / Gagal
   - Input nominal transaksi jika berhasil (manual)
7. Lihat Rekap Omset → laporan bulanan berdasarkan inquiry berhasil
8. Update Pengaturan → nomor WA, alamat, tagline, jam operasional
```

---

## 7. Fitur yang Disepakati

### Halaman Publik
- [x] Katalog produk dengan status stok real-time
- [x] Badge "Hampir Habis" / "Sedang Musim Panen" per produk (toggle admin)
- [x] Harga ditampilkan langsung di website (bukan "hubungi kami")
- [x] Harga bisa diubah admin kapan saja (fluktuatif)
- [x] Form pre-order dengan auto-generate pesan WhatsApp
- [x] Tombol WhatsApp mengambang (floating button) di semua halaman
- [x] Galeri foto kolam & aktivitas
- [x] Testimoni pelanggan
- [x] SEO-friendly (terutama halaman detail produk)
- [x] Section "Cara Order" yang jelas

### Dashboard Admin
- [x] Login aman via Supabase Auth
- [x] CRUD produk lengkap
- [x] Update harga per ukuran produk
- [x] Toggle badge stok & promo
- [x] Upload & kelola foto galeri (Supabase Storage)
- [x] CRUD testimoni
- [x] Daftar inquiry masuk + update status + input nominal
- [x] Rekap & laporan omset bulanan
- [x] Edit pengaturan global (WA, alamat, tagline, dll)

### Fitur yang Tidak Ada (Sengaja Dikecualikan)
- [ ] Payment gateway / transaksi online
- [ ] Live chat selain WhatsApp
- [ ] Multi-user admin / role management
- [ ] Blog / artikel
- [ ] Video galeri (belum ada konten, ditambahkan nanti)

---

## 8. Informasi Tambahan

### Harga
- Ditampilkan langsung di website per ukuran bibit
- Sifatnya **fluktuatif** → admin harus bisa update sendiri dengan mudah
- Disimpan dalam format JSONB di database (`sizes` field di tabel `products`)

### Area Pengiriman
- **Pulau Jawa** — pasar utama
- **Kalimantan** — ada beberapa klien, tersedia tapi bukan prioritas utama

### Deadline
- Tidak ada deadline pasti, fleksibel
- Namun diutamakan selesai secepat mungkin

---

## 9. Output yang Sudah Dihasilkan dari Diskusi Ini

| File | Isi |
|---|---|
| `PROJECT.md` | Konteks bisnis, fitur, alur user & admin, catatan penting |
| `ARCHITECTURE.md` | Struktur folder, schema database, TypeScript types, konvensi kode |
| `DISCUSSION_NOTES.md` | File ini — ringkasan seluruh diskusi & keputusan |

### Mockup
- Mockup halaman publik (mobile view) sudah dibuat — mencakup semua section dari navbar hingga footer
- Mockup form pre-order (bottom sheet modal) sudah dibuat dan interaktif
- Mockup admin dashboard sudah dibuat — responsif mobile & desktop

---

## 10. Hal yang Masih Terbuka / Perlu Ditindaklanjuti

- [ ] Nama asli usaha dan logo perlu diberikan klien untuk mengganti placeholder "Benih Jaya"
- [ ] Nomor WhatsApp aktif untuk diintegrasikan ke tombol & form
- [ ] Foto kolam dan produk perlu disiapkan dalam format digital yang siap upload
- [ ] Video galeri — belum ada, ditambahkan ke website setelah tersedia
- [ ] Mockup halaman `/produk/[slug]` belum dibuat
- [ ] Mockup halaman `/tentang` dan `/galeri` belum dibuat

---

## 11. Catatan Sesi Mockup

> Ditambahkan setelah sesi diskusi mockup bersama.

### Mockup Halaman Publik (Home `/`)

Struktur section yang sudah divisualisasikan dan disepakati (urutan dari atas ke bawah):

1. **Navbar** — logo kiri, hamburger menu kanan (mobile)
2. **Hero** — badge area pengiriman, judul, sub-judul, 2 tombol CTA (Pesan Sekarang + Lihat Produk), statistik usaha (kolam aktif, jenis bibit, area pengiriman)
3. **Katalog Produk** — card per produk berisi: foto, nama, ukuran, harga, badge stok, tombol pre-order
4. **Cara Order** — 4 langkah visual (ikon + judul + deskripsi singkat)
5. **Galeri** — grid 2 kolom foto
6. **Testimoni** — card per testimoni berisi: avatar inisial, nama, kota, bintang, kutipan
7. **Footer** — logo, tagline, area pengiriman, jam operasional, nomor WA
8. **Floating WhatsApp button** — sticky di pojok kanan bawah, muncul di semua halaman

**Form pre-order** muncul sebagai bottom sheet modal (bukan halaman baru) dengan 5 field:
nama, kota, jumlah (radio), metode pengiriman (radio), catatan opsional.
Tombol akhir "Lanjut via WhatsApp" meng-generate pesan otomatis sesuai format yang disepakati.

### Mockup Admin Dashboard (`/admin`)

Layout: **sidebar kiri + konten kanan** di desktop. Di mobile, sidebar tersembunyi dan digantikan topbar dengan hamburger menu.

Halaman admin yang sudah divisualisasikan dalam satu scroll panjang:

| Bagian | Konten |
|---|---|
| Sidebar navigasi | Menu: Dashboard, Kelola Produk, Galeri, Testimoni, Inquiry (+ indikator pending), Rekap Omset, Pengaturan |
| Metric cards | Omset bulan ini, Inquiry masuk, Transaksi berhasil, Produk aktif |
| Grafik omset | Bar chart 6 bulan terakhir |
| Status stok | Bar visual per jenis ikan |
| Kelola produk | Tabel dengan toggle badge on/off yang bisa diklik langsung |
| Daftar inquiry | Tabel dengan dropdown status (Pending / Berhasil / Gagal) — interaktif, field input nominal muncul otomatis saat status diubah ke Berhasil |
| Rekap omset | 3 metric card + tabel breakdown per produk dengan persentase kontribusi |
| Pengaturan global | Form: nama usaha, nomor WA, tagline, jam operasional, alamat |

**Keputusan desain admin yang dikonfirmasi dari mockup:**
- Warna aksen tetap hijau (`#1D9E75`) konsisten dengan halaman publik
- Toggle badge produk bisa diklik langsung dari tabel tanpa perlu masuk halaman edit
- Status inquiry diubah via dropdown inline di tabel, bukan halaman terpisah
- Input nominal transaksi hanya muncul jika status diubah ke "Berhasil" — tidak ditampilkan untuk Pending/Gagal
