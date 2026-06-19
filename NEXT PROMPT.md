# PROMPT_SESI_BERIKUTNYA.md
# Prompt siap pakai untuk sesi agent Antigravity — Fase 2

---

## CARA PAKAI

1. Buka project RR Fish Jombang di Antigravity
2. Pastikan semua file dokumentasi masih ada di project:
   - `AGENT_CONTEXT.md`
   - `TASKS.md`
   - `ARCHITECTURE.md`
   - `DEVELOPMENT_REPORT.md`
3. Copy seluruh teks di bagian "PROMPT" di bawah ini
4. Paste sebagai pesan pertama ke agent di sesi baru

---

## PROMPT

---

Kamu melanjutkan pengerjaan project **RR Fish Jombang** yang sudah berjalan 60%.

Sebelum mulai, baca file-file berikut secara berurutan:
1. `AGENT_CONTEXT.md` — konteks lengkap project, keputusan desain, dan konvensi kode
2. `DEVELOPMENT_REPORT.md` — laporan apa yang sudah selesai dan apa yang belum
3. `TASKS.md` — daftar task, fokus pada T33–T39 yang belum diimplementasi

Setelah membaca, konfirmasi pemahamanmu dengan menjawab tiga pertanyaan ini secara singkat:
- Apa yang sudah selesai?
- Apa yang akan dikerjakan di sesi ini?
- Ada file atau informasi tambahan yang kamu butuhkan sebelum mulai?

---

### Konteks singkat untuk sesi ini

Project sudah selesai di bagian:
- Seluruh halaman publik (Home, Produk, Galeri, Tentang)
- Admin auth, layout sidebar, dan dashboard metrics
- Build berhasil tanpa error (19 routes, Next.js 16)

Yang belum selesai dan menjadi fokus sesi ini:
- T33–T39: halaman admin CRUD — saat ini semua masih stub kosong (~10 baris placeholder)
- T40–T45: finalisasi dan testing (kerjakan setelah T33–T39 selesai)

---

### Instruksi pengerjaan

Kerjakan task **satu per satu** sesuai urutan berikut (dari termudah ke terkompleks):

**T39 — Pengaturan global** (`app/admin/pengaturan/page.tsx`)
- Fetch semua data dari tabel `site_settings` di Supabase
- Tampilkan form edit dengan field: nama usaha, nomor WhatsApp, tagline, jam operasional, alamat
- Simpan perubahan ke Supabase saat klik tombol "Simpan"
- Tampilkan notifikasi berhasil/gagal setelah simpan
- Ini Client Component karena ada form interaktif

**T36 — Kelola testimoni** (`app/admin/testimoni/page.tsx`)
- Fetch semua testimoni dari tabel `testimonials`
- Tampilkan tabel dengan kolom: nama, lokasi, rating, isi (truncated), status aktif, aksi
- Tombol tambah testimoni → form modal dengan field: nama, lokasi, role, rating (1–5), isi testimoni
- Tombol hapus per baris dengan konfirmasi
- Toggle aktif/nonaktif per testimoni (update kolom `is_active`)

**T37 — Kelola inquiry** (`app/admin/inquiry/page.tsx`)
- Fetch semua inquiry dari tabel `inquiries`, urutkan terbaru di atas
- Filter tab: Semua / Pending / Berhasil / Gagal
- Tabel dengan kolom: nama, kota, produk, jumlah, metode kirim, tanggal, status, aksi
- Dropdown ubah status inline di tabel (Pending → Berhasil / Gagal)
- Jika status diubah ke "Berhasil": muncul input field untuk nominal transaksi (`final_amount`)
- Update `status` dan `final_amount` ke Supabase saat perubahan

**T38 — Rekap omset** (`app/admin/omset/page.tsx`)
- Fetch inquiry dengan status `berhasil` dari Supabase
- Filter bulan (default: bulan ini)
- Tampilkan 3 metric card: total transaksi berhasil, total omset (sum `final_amount`), rata-rata per transaksi
- Tabel breakdown per produk: nama produk, jumlah transaksi, total omset, persentase kontribusi
- Semua angka diformat sebagai Rupiah menggunakan `formatIDR` dari `lib/utils.ts`

**T35 — Kelola galeri** (`app/admin/galeri/page.tsx`)
- Fetch semua foto dari tabel `gallery` di Supabase
- Tampilkan grid foto (2 kolom mobile, 3–4 kolom desktop)
- Tombol upload foto baru:
  - Input file (accept: image/*)
  - Upload ke Supabase Storage bucket `gallery-images`
  - Simpan URL hasil upload + caption (opsional) ke tabel `gallery`
- Tombol hapus per foto:
  - Hapus dari Supabase Storage
  - Hapus baris dari tabel `gallery`

**T33 — Kelola produk** (`app/admin/produk/page.tsx`)
- Fetch semua produk dari tabel `products`
- Tabel dengan kolom: foto (thumbnail kecil), nama, harga mulai dari, status stok, badge, aktif, aksi
- Toggle `is_active` langsung dari tabel (tanpa perlu masuk halaman edit)
- Toggle badge (Hampir Habis / Musim Panen / kosong) langsung dari tabel
- Tombol edit → buka form edit (lihat T34)
- Tombol hapus dengan konfirmasi

**T34 — Form tambah/edit produk** (modal atau halaman terpisah, pilih yang lebih praktis)
- Field:
  - Nama produk (text)
  - Slug (auto-generate dari nama, bisa di-edit manual)
  - Deskripsi (textarea)
  - Foto produk (upload ke bucket `product-images`, tampilkan preview)
  - Ukuran & harga — dynamic list (bisa tambah/hapus baris):
    - Setiap baris: ukuran (contoh: "3-5 cm") + harga_min + harga_max
    - Disimpan sebagai JSONB ke kolom `sizes`
  - Status stok (select: tersedia / habis / indent)
  - Badge (select: kosong / hampir_habis / musim_panen)
- Validasi: nama, minimal 1 ukuran+harga wajib diisi
- Simpan ke tabel `products` di Supabase

---

### Setelah T33–T39 selesai, lanjutkan finalisasi:

**T42** — Uji alur end-to-end WhatsApp:
- Buka halaman produk → isi form → klik "Lanjut via WhatsApp"
- Pastikan format pesan yang terbuka di WhatsApp sudah sesuai:
  ```
  Halo, saya [Nama] dari [Kota]. Saya tertarik memesan [Nama Produk]
  sebanyak [Jumlah] ekor dengan metode pengiriman [Metode].
  [Catatan jika ada]. Mohon info harga dan ketersediaan stoknya. 🙏
  ```

**T43** — Uji alur admin update:
- Login ke /admin → edit harga produk → simpan → buka halaman produk publik
- Pastikan harga yang baru langsung terefleksi

**T40** — Cek responsif di dua viewport:
- 375px (iPhone SE) — semua halaman publik dan admin
- 1280px (desktop standar) — semua halaman publik dan admin

**T45** — Bersihkan kode:
- Hapus `console.log` yang tidak diperlukan
- Hapus unused imports
- Pastikan tidak ada komentar placeholder yang tertinggal

---

### Konvensi yang harus diikuti

- Gunakan **TypeScript** — tidak boleh ada `any`
- Semua types sudah ada di `types/index.ts` — gunakan yang sudah ada, jangan buat duplikat
- Format harga selalu menggunakan `formatIDR` dari `lib/utils.ts`
- Supabase client: gunakan `createClient` dari `lib/supabase/client.ts` untuk Client Components, dari `lib/supabase/server.ts` untuk Server Components
- Semua teks UI dalam **Bahasa Indonesia**
- Warna aksen utama: `#1D9E75` (brand green)
- Update `TASKS.md` — tandai [x] setiap task yang selesai

---

### Yang TIDAK boleh diubah

- Schema database Supabase — sudah final, jangan modifikasi tabel
- Struktur folder yang sudah ada
- Komponen yang sudah selesai (T10–T32) — jangan refactor kecuali ada bug
- Keputusan desain yang ada di `AGENT_CONTEXT.md`

---

Mulai dari **T39 (Pengaturan)** sekarang. Tunjukkan kode lengkapnya, bukan placeholder.

---
