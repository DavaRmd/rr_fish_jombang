# PROJECT.md — Konteks Utama Project

> File ini adalah sumber kebenaran utama project. Baca file ini sebelum mengerjakan task apapun.
> Untuk detail teknis dan schema database, lihat `ARCHITECTURE.md`.

---

## 1. Gambaran Umum

**Nama project:** Website Peternakan Bibit Ikan  
**Tujuan:** Meningkatkan penjualan bibit ikan dengan menyediakan katalog produk online, membangun kredibilitas usaha, dan memudahkan calon pembeli untuk melakukan pemesanan via WhatsApp.  
**Bahasa:** Full Bahasa Indonesia  
**Target selesai:** Fleksibel, namun diutamakan cepat

---

## 2. Profil Usaha

- Usaha budidaya dan penjualan **bibit ikan** skala menengah
- Beroperasi di area kebun belakang rumah dengan **10+ kolam pembibitan** (akan terus bertambah)
- Jenis bibit yang dijual: **Patin, Lele, Gurame, Nila**
- Ukuran bibit saat dijual: **3–7 cm** (tergantung jenis ikan dan kebutuhan pembeli)
- Melayani pembelian **perorangan maupun partai besar**
- Area pengiriman: **Pulau Jawa (utama)** dan **Kalimantan**
- Transaksi akhir (negosiasi harga, konfirmasi, pembayaran) dilakukan **langsung via WhatsApp**

---

## 3. Target Pengguna Website

| Segmen | Keterangan |
|---|---|
| Peternak kecil lokal | Beli satuan atau jumlah kecil untuk kolam sendiri |
| Supplier / partai besar | Beli dalam jumlah besar (>1000 ekor), butuh negosiasi |
| Umum / perorangan | Hobi budidaya ikan di rumah |

**Device prioritas:** Mobile first (HP/tablet), tetap responsif di desktop/PC.

---

## 4. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS |
| Backend / Database | Supabase (PostgreSQL + Storage + Auth) |
| Deployment | Vercel (frontend) + Supabase cloud (database) |
| Styling | Tailwind CSS — mobile first approach |

**Breakpoint Tailwind:**
- Default (< 768px) → Mobile (prioritas utama)
- `md:` (768px–1024px) → Tablet
- `lg:` (> 1024px) → Desktop / PC

---

## 5. Struktur Halaman

### Halaman Publik (User)

```
/ (Home — Landing Page)
├── Navbar (logo, menu, tombol WA)
├── Hero section (tagline, CTA, badge area pengiriman)
├── Statistik (jumlah kolam, jenis bibit, pelanggan)
├── Katalog produk — preview 4 jenis ikan
├── Keunggulan kami
├── Cara order (3 langkah)
├── Galeri foto — preview
├── Testimoni pelanggan
└── Footer (kontak, link, copyright)

/produk/[slug] (Detail Produk)
├── Info lengkap produk (nama, foto, ukuran, harga, deskripsi, status stok)
└── Form pre-order → redirect WhatsApp

/tentang (Tentang Kami)
└── Cerita usaha, pengalaman, jumlah kolam, visi misi, foto

/galeri (Galeri Lengkap)
└── Semua foto kolam dan aktivitas budidaya
```

### Halaman Admin (Protected — login required)

```
/admin                  → Redirect ke /admin/dashboard
/admin/dashboard        → Ringkasan: total produk, inquiry masuk, omset bulan ini
/admin/produk           → CRUD produk ikan
/admin/galeri           → Upload & hapus foto galeri
/admin/testimoni        → CRUD testimoni
/admin/inquiry          → Daftar inquiry, update status, input nominal transaksi
/admin/omset            → Rekap & laporan omset bulanan
/admin/pengaturan       → Edit konten global (nomor WA, alamat, tagline, jam operasional)
```

---

## 6. Alur User — Melakukan Order

```
1. Buka website → lihat Hero section
2. Scroll ke katalog → lihat produk, harga, status stok
3. Cek kredibilitas → halaman Tentang, Galeri, Testimoni
4. Lihat Cara Order → pahami alur pemesanan
5. Klik produk yang diminati → masuk halaman /produk/[slug]
6. Isi form pre-order:
   - Nama lengkap
   - Asal kota
   - Jumlah pesanan (pilihan: 100–500 / 500–1000 / >1000 ekor)
   - Metode pengiriman (Ambil sendiri / Ekspedisi Jawa / Ekspedisi Kalimantan / Kurir lokal)
   - Catatan opsional
7. Klik "Lanjut via WhatsApp"
8. Redirect ke WhatsApp dengan pesan template otomatis:
   "Halo, saya [Nama] dari [Kota]. Saya tertarik memesan [Bibit X]
   sebanyak [Jumlah] ekor dengan metode pengiriman [Metode].
   [Catatan jika ada]. Mohon info harga dan ketersediaan stoknya."
9. Negosiasi & konfirmasi langsung di WhatsApp
```

---

## 7. Alur Admin — Mengelola Website

```
1. Login ke /admin (email + password via Supabase Auth)
2. Masuk dashboard → lihat ringkasan data
3. Kelola produk → tambah/edit/hapus produk & update harga kapan saja
4. Kelola galeri → upload/hapus foto
5. Kelola testimoni → tambah/hapus testimoni
6. Kelola inquiry:
   - Lihat daftar calon pembeli yang submit form
   - Update status: Pending / Berhasil / Gagal
   - Input nominal transaksi jika berhasil
7. Lihat rekap omset → laporan bulanan berdasarkan inquiry berhasil
8. Update pengaturan → nomor WA, alamat, tagline, jam operasional
```

---

## 8. Fitur Utama

### Halaman Publik
- Katalog produk dengan status stok real-time (Tersedia / Habis / Indent)
- Badge "Hampir Habis" atau "Sedang Musim Panen" — bisa di-toggle admin
- Harga ditampilkan langsung (bisa diubah admin kapan saja)
- Form pre-order dengan auto-generate pesan WhatsApp
- Tombol WhatsApp mengambang (floating) di semua halaman publik
- Galeri foto kolam & aktivitas budidaya
- Testimoni pelanggan
- SEO-friendly (terutama halaman produk, untuk pencarian lokal)

### Dashboard Admin
- CRUD produk (nama, slug, foto, ukuran tersedia, harga per ukuran, deskripsi, status stok)
- Toggle badge stok & promo per produk
- Upload & kelola foto galeri (via Supabase Storage)
- CRUD testimoni
- Daftar inquiry masuk + update status + input nominal
- Rekap omset bulanan (grafik + tabel)
- Edit pengaturan global site

---

## 9. Konten yang Tersedia dari Klien

| Konten | Status |
|---|---|
| Logo usaha | ✅ Sudah ada |
| Foto kolam & aktivitas | ✅ Sudah ada |
| Data produk (jenis, ukuran, harga) | ✅ Sudah ada |
| Video aktivitas budidaya | ❌ Belum ada (skip dulu, tambahkan nanti) |

---

## 10. Catatan Penting

- **Transaksi tidak terjadi di website** — website hanya sebagai media katalog & pre-order. Semua transaksi final dilakukan di WhatsApp.
- **Harga bersifat fluktuatif** — admin harus bisa update harga dengan mudah tanpa bantuan developer.
- **Tidak ada payment gateway** — tidak diperlukan untuk project ini.
- **Admin dashboard dibuat minimalis** — cukup fungsional, tidak perlu sekompleks CMS besar.
- **Video galeri** belum tersedia, section galeri cukup foto dulu. Siapkan slot untuk video di kemudian hari.
