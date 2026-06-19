# TASKS.md — Daftar Task Project RR Fish Jombang

> Kerjakan task **satu per satu secara berurutan**.
> Tandai task dengan [x] setelah selesai.
> Jangan lanjut ke task berikutnya sebelum task saat ini selesai dan dikonfirmasi.

---

## FASE 0 — Setup Project

- [x] **T01** — Inisialisasi project Next.js 14 dengan App Router dan TypeScript
  ```bash
  npx create-next-app@latest rr-fish-jombang \
    --typescript --tailwind --eslint --app --src-dir=false
  ```
- [x] **T02** — Install dependencies yang dibutuhkan
  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  ```
- [x] **T03** — Buat file `.env.local` dan isi environment variables Supabase:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://mnndjkebreanobwftjng.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubmRqa2VicmVhbm9id2Z0am5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTQ4NjUsImV4cCI6MjA5MTA3MDg2NX0.ruxbHB5SlsJvTHh7DyBiHalaDjMm00tKmaC_uG4ww_Q
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubmRqa2VicmVhbm9id2Z0am5nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ5NDg2NSwiZXhwIjoyMDkxMDcwODY1fQ.WrxhDgLtqbs2yGGOmKOipZNlmCsV0fR8NAqv5HzMQ7c
  ```
- [x] **T04** — Buat Supabase client sesuai struktur di `ARCHITECTURE.md`:
  - `lib/supabase/client.ts` — browser client
  - `lib/supabase/server.ts` — server component client
- [x] **T05** — Buat file `types/index.ts` — salin semua TypeScript types dari `ARCHITECTURE.md`
- [x] **T06** — Buat file `lib/whatsapp.ts` — salin helper dari `ARCHITECTURE.md`
- [x] **T07** — Buat file `lib/utils.ts` — berisi helper format harga IDR dan format tanggal
- [x] **T08** — Konfigurasi warna brand di `globals.css` (@theme Tailwind v4):
  ```js
  colors: {
    brand: {
      DEFAULT: '#1D9E75',
      dark: '#0F6E56',
      light: '#EAF3DE',
      text: '#27500A',
    }
  }
  ```
- [x] **T09** — Setup global layout di `app/layout.tsx` (font, metadata, viewport)

---

## FASE 1 — Komponen UI Dasar

- [x] **T10** — Buat `components/ui/Badge.tsx` — badge status stok dengan semua varian warna
- [x] **T11** — Buat `components/ui/Button.tsx` — varian primary, outline, dan WhatsApp
- [x] **T12** — Buat `components/ui/Modal.tsx` — bottom sheet modal untuk mobile
- [x] **T13** — Buat `components/layout/Navbar.tsx` — logo, menu desktop, hamburger mobile
- [x] **T14** — Buat `components/layout/Footer.tsx` — info kontak, jam operasional, copyright
- [x] **T15** — Buat `components/layout/WAFloatButton.tsx` — tombol WhatsApp mengambang, nomor WA diambil dari `site_settings`

---

## FASE 2 — Halaman Home (/)

- [x] **T16** — Buat `components/sections/HeroSection.tsx`
  - Tagline utama, sub-tagline
  - Badge area pengiriman (Jawa & Kalimantan)
  - 2 tombol CTA: "Pesan Sekarang" (scroll ke katalog) + "Lihat Produk"
  - Statistik usaha: jumlah kolam, jenis bibit, area pengiriman
- [x] **T17** — Buat `components/sections/KatalogSection.tsx`
  - Fetch data produk dari Supabase (server component)
  - Tampilkan card per produk: foto, nama, ukuran, harga mulai dari, badge stok, tombol pre-order
  - Tombol pre-order → link ke `/produk/[slug]`
- [x] **T18** — Buat `components/produk/ProductCard.tsx` — digunakan di KatalogSection
- [x] **T19** — Buat `components/sections/CaraOrderSection.tsx` — 4 langkah visual
- [x] **T20** — Buat `components/sections/GaleriSection.tsx`
  - Tampilkan maks 6 foto dari Supabase Storage (bucket `gallery-images`)
  - Tombol "Lihat Semua" → link ke `/galeri`
- [x] **T21** — Buat `components/sections/TestimoniSection.tsx`
  - Fetch testimoni aktif dari Supabase
  - Card per testimoni: avatar inisial, nama, kota, bintang, kutipan
- [x] **T22** — Rakit semua section di `app/page.tsx` dengan urutan yang benar

---

## FASE 3 — Halaman Detail Produk (/produk/[slug])

- [x] **T23** — Buat `app/produk/[slug]/page.tsx`
  - Fetch data produk berdasarkan slug dari Supabase
  - Generate static params untuk semua slug produk aktif (`generateStaticParams`)
  - Generate metadata SEO per produk (`generateMetadata`)
- [x] **T24** — Layout desktop: dua kolom (foto + gallery thumbnail kiri | info + form kanan)
- [x] **T25** — Layout mobile: satu kolom + sticky CTA button bawah + bottom sheet modal form
- [x] **T26** — Buat `components/produk/OrderForm.tsx`
  - 5 field sesuai spesifikasi di `AGENT_CONTEXT.md`
  - Validasi: nama, kota, jumlah, dan metode pengiriman wajib diisi
  - Generate URL WhatsApp menggunakan `lib/whatsapp.ts`
  - Redirect ke WhatsApp saat submit

---

## FASE 4 — Halaman Publik Lainnya

- [x] **T27** — Buat `app/galeri/page.tsx`
  - Fetch semua foto dari Supabase Storage
  - Layout grid responsif (2 kolom mobile, 3–4 kolom desktop)
- [x] **T28** — Buat `app/tentang/page.tsx`
  - Cerita usaha, pengalaman, jumlah kolam, area pengiriman
  - Konten statis (tidak perlu dari database)

---

## FASE 5 — Admin: Auth & Layout

- [x] **T29** — Buat halaman login `app/admin/login/page.tsx`
  - Form: email + password
  - Login menggunakan Supabase Auth
  - Redirect ke `/admin/dashboard` setelah berhasil
  - Tampilkan pesan error jika gagal login
- [x] **T30** — Buat `app/admin/layout.tsx`
  - Cek session Supabase — jika tidak terautentikasi, redirect ke `/admin/login`
  - Render sidebar + konten
- [x] **T31** — Buat `components/admin/Sidebar.tsx`
  - Menu: Dashboard, Kelola Produk, Galeri, Testimoni, Inquiry (+ indikator jumlah pending), Rekap Omset, Pengaturan
  - Tombol logout
  - Responsif: tersembunyi di mobile, muncul di desktop

---

## FASE 6 — Admin: Halaman-Halaman

- [x] **T32** — `app/admin/dashboard/page.tsx`
  - 4 metric card: omset bulan ini, inquiry masuk, transaksi berhasil, produk aktif
  - Grafik omset 6 bulan terakhir (bar chart sederhana)
  - Tabel stok produk (nama + status)
- [x] **T33** — `app/admin/produk/page.tsx`
  - Tabel semua produk
  - Tombol tambah, edit, hapus
  - Toggle badge (Hampir Habis / Musim Panen) langsung dari tabel
  - Toggle is_active langsung dari tabel
- [x] **T34** — Form tambah/edit produk (bisa modal atau halaman terpisah)
  - Field: nama, slug (auto-generate dari nama), deskripsi, foto (upload ke Supabase Storage), sizes (dynamic — bisa tambah/hapus baris ukuran+harga), status stok, badge
- [x] **T35** — `app/admin/galeri/page.tsx`
  - Grid foto yang sudah diupload
  - Tombol upload foto baru (ke bucket `gallery-images`)
  - Tombol hapus per foto
- [x] **T36** — `app/admin/testimoni/page.tsx`
  - Tabel testimoni
  - Form tambah testimoni: nama, lokasi, rating, isi testimoni
  - Tombol hapus + toggle aktif/nonaktif
- [x] **T37** — `app/admin/inquiry/page.tsx`
  - Tabel semua inquiry dengan filter status (Pending / Berhasil / Gagal)
  - Dropdown ubah status inline di tabel
  - Input nominal transaksi muncul saat status diubah ke "Berhasil"
  - Badge jumlah pending di sidebar
- [x] **T38** — `app/admin/omset/page.tsx`
  - 3 metric card: total transaksi, total omset, rata-rata per transaksi
  - Filter bulan
  - Tabel breakdown omset per produk dengan persentase kontribusi
- [x] **T39** — `app/admin/pengaturan/page.tsx`
  - Form edit: nama usaha, nomor WA, tagline, jam operasional, alamat
  - Data diambil dan disimpan ke tabel `site_settings`
  - Tombol simpan dengan feedback berhasil/gagal

---

## FASE 7 — Finalisasi

- [x] **T40** — Pastikan semua halaman publik responsif di mobile (375px) dan desktop (1280px)
- [x] **T41** — Tambahkan metadata SEO di setiap halaman (`title`, `description`, `og:image`)
- [x] **T42** — Uji alur end-to-end: klik produk → isi form → klik "Lanjut via WhatsApp" → pesan WhatsApp terbuka dengan format yang benar
- [x] **T43** — Uji alur admin: login → ubah harga produk → cek harga terupdate di halaman publik
- [x] **T44** — Pastikan halaman admin tidak bisa diakses tanpa login
- [x] **T45** — Review dan bersihkan console errors, unused imports, dan kode yang tidak dipakai

---

## Catatan untuk Agent

- Selalu rujuk `ARCHITECTURE.md` untuk schema database dan TypeScript types
- Selalu rujuk `AGENT_CONTEXT.md` untuk keputusan desain yang sudah final
- Jangan mengubah keputusan yang sudah ada di `AGENT_CONTEXT.md` tanpa konfirmasi
- Jika ada ambiguitas, tanyakan sebelum mengerjakan
- Update file ini (tandai [x]) setiap kali satu task selesai
