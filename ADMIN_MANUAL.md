# BUKU PANDUAN PENGGUNAAN HALAMAN ADMIN (MANUAL BOOK)
## Proyek: RR Fish Jombang

Buku panduan ini disusun sebagai acuan langkah demi langkah bagi administrator website **RR Fish Jombang** untuk mengelola data produk, galeri foto, testimoni, pesanan masuk (inquiry), laporan omset, serta pengaturan website secara dinamis.

---

## DAFTAR ISI
1. [CARA MENGAKSES DAN LOGIN](#1-cara-mengakses-dan-login)
2. [FITUR 1: DASHBOARD (RINGKASAN USAHA)](#2-fitur-1-dashboard-ringkasan-usaha)
3. [FITUR 2: KELOLA PRODUK (KATALOG BIBIT IKAN)](#3-fitur-2-kelola-produk-katalog-bibit-ikan)
4. [FITUR 3: KELOLA GALERI FOTO](#4-fitur-3-kelola-galeri-foto)
5. [FITUR 4: KELOLA TESTIMONI PELANGGAN](#5-fitur-4-kelola-testimoni-pelanggan)
6. [FITUR 5: KELOLA INQUIRY (PESANAN MASUK)](#6-fitur-5-kelola-inquiry-pesanan-masuk)
7. [FITUR 6: REKAP OMSET BULANAN](#7-fitur-6-rekap-omset-bulanan)
8. [FITUR 7: PENGATURAN WEBSITE](#8-fitur-7-pengaturan-website)
9. [KEAMANAN & LOG OUT](#9-keamanan--log-out)

---

## 1. CARA MENGAKSES DAN LOGIN

Halaman Admin diamankan secara ketat menggunakan otentikasi Supabase. Pengunjung biasa tidak dapat mengakses area ini.

* **URL Akses:** Buka browser dan ketik alamat berikut:
  * **Lokal:** `http://localhost:3000/admin` (atau port dev server Anda)
  * **Online (Production):** `https://[domain-anda].vercel.app/admin`
* **Langkah Login:**
  1. Jika Anda belum login, sistem akan otomatis mengarahkan Anda ke halaman `/admin/login`.
  2. Masukkan **Alamat Email** dan **Password** Admin yang telah didaftarkan pada database.
  3. Klik tombol **"Masuk sebagai Admin"**.
  4. Setelah sukses, Anda akan langsung diarahkan ke halaman **Dashboard**.

---

## 2. FITUR 1: DASHBOARD (RINGKASAN USAHA)

Halaman Dashboard memberikan gambaran cepat (kilasan data) mengenai kondisi bisnis saat ini.

* **Fungsi Utama:** Memantau aktivitas bisnis secara instan tanpa perlu membuka menu satu per satu.
* **Metrik yang Ditampilkan:**
  1. **Produk Aktif:** Jumlah jenis bibit ikan yang saat ini ditayangkan di katalog website.
  2. **Inquiry Pending:** Jumlah pesanan masuk dari pembeli yang statusnya masih perlu diproses/dikonfirmasi.
  3. **Transaksi Berhasil:** Jumlah pesanan yang sukses diselesaikan pada bulan berjalan.
  4. **Omset Bulan Ini:** Total nominal uang rupiah yang dihasilkan dari transaksi sukses pada bulan berjalan.
* **Tabel Inquiry Terbaru:** Menampilkan maksimal 5 pesanan sukses paling baru, lengkap dengan nama pembeli, jenis ikan, jumlah, nominal transaksi, dan tanggal transaksi.
* **Cara Penggunaan:** Cukup buka halaman Dashboard untuk membaca statistik. Jika ada metrik yang perlu ditindaklanjuti (misal: "Inquiry Pending" > 0), Anda dapat mengklik menu **Inquiry** di sidebar untuk memprosesnya.

---

## 3. FITUR 2: KELOLA PRODUK (KATALOG BIBIT IKAN)

Menu ini digunakan untuk mengatur ikan apa saja yang Anda jual, harga, ukuran, stok, dan fotonya.

### A. Melihat Daftar Produk
* Buka menu **Kelola Produk** dari sidebar.
* Anda akan melihat tabel berisi seluruh produk yang terdaftar beserta foto kecil (thumbnail), nama, slug URL, rentang harga, status stok, status tayang, dan urutan tampil.

### B. Menambahkan Produk Baru
1. Klik tombol **"+ Tambah Produk"** di pojok kanan atas tabel.
2. Isi formulir informasi produk:
   * **Nama Produk:** Nama bibit ikan (contoh: `Bibit Gurame`). Slug URL akan terisi otomatis.
   * **Deskripsi:** Detail penjelasan mengenai bibit ikan (misal: pakan, ketahanan air, dll.).
   * **Status Stok:** Pilih antara `Tersedia`, `Stok Habis` (tombol beli di web akan terkunci), atau `Indent` (Pre-order).
   * **Badge Spesial (Opsional):** Pilih `Musim Panen` (warna hijau) atau `Hampir Habis` (warna merah) untuk menarik perhatian pembeli. Pilih `Tidak Ada` jika tidak ingin menampilkan badge.
   * **Foto Produk:** Klik area unggah foto untuk memilih gambar produk dari HP/Laptop Anda. 
     *(Sistem otomatis mengompresi gambar Anda menjadi format modern `.webp` dengan ukuran maksimal 1200px agar website tetap dimuat dengan sangat cepat)*.
   * **Daftar Ukuran & Harga:** Minimal harus ada 1 ukuran.
     * Masukkan **Nama Ukuran** (contoh: `3-5 cm` atau `Ukuran Jempol`).
     * Masukkan **Harga Minimal** dan **Harga Maksimal** (dalam Rupiah per ekor). Jika harganya pas/satu nilai, isi kedua kolom dengan angka yang sama.
     * Klik **"+ Tambah Ukuran"** jika Anda menjual bibit tersebut dalam beberapa ukuran berbeda.
     * Klik **"Hapus"** (ikon merah) di sebelah ukuran untuk membuang ukuran yang tidak tersedia lagi.
3. Klik **"Simpan Produk"**. Produk baru akan langsung tayang secara instan di Beranda website pengunjung.

### C. Mengubah (Edit) Produk
1. Pada tabel produk, klik tombol **"Edit"** (tombol abu-abu) di baris produk yang ingin diubah.
2. Perbarui data pada formulir (nama, deskripsi, harga, status, atau ganti fotonya).
3. Klik **"Simpan Perubahan"**.

### D. Menonaktifkan / Menghapus Produk
* **Sembunyikan Sementara (Nonaktifkan):** Pada tabel produk, Anda bisa mengklik tombol toggle **"Aktif"** menjadi **"Draft"** (warna abu-abu). Produk akan disimpan di admin tetapi disembunyikan dari pengunjung.
* **Hapus Permanen:** Klik tombol **"Hapus"** (ikon merah) di ujung kanan baris produk. Konfirmasi penghapusan. *Perhatian: Menghapus produk akan memutus relasi riwayat pesanan (inquiry) yang berkaitan dengan produk ini.*

---

## 4. FITUR 3: KELOLA GALERI FOTO

Menu ini digunakan untuk mendokumentasikan kegiatan peternakan, proses pembibitan, pengiriman ikan, atau kondisi kolam.

* **Fungsi Utama:** Membangun kepercayaan pelanggan (*social proof*) secara visual.
* **Cara Mengunggah Foto Baru:**
  1. Masuk ke menu **Galeri**.
  2. Di panel **"Tambah Foto Baru"**, isi **Keterangan / Caption** (contoh: `Pengiriman 5.000 bibit patin ke Surabaya`).
  3. Pilih file foto dengan mengklik area unggah.
  4. Klik tombol **"Upload Foto"**. Foto akan dikompresi otomatis dan ditambahkan ke galeri.
* **Cara Menghapus Foto:**
  1. Cari foto yang ingin dihapus pada grid **"Foto Tersimpan"**.
  2. Arahkan kursor (*hover*) ke foto tersebut (atau ketuk pada HP) untuk memunculkan tombol hapus.
  3. Klik tombol sampah merah **"Hapus"**. Konfirmasi penghapusan. Foto akan terhapus dari server secara permanen.

---

## 5. FITUR 4: KELOLA TESTIMONI PELANGGAN

Menu untuk menampilkan ulasan positif, kepuasan, atau feedback dari para pembeli bibit ikan Anda.

* **Cara Menambah Testimoni:**
  1. Masuk ke menu **Testimoni**.
  2. Klik tombol **"+ Tambah Testimoni"** (atau isi form tambah).
  3. Isi data pembeli:
     * **Nama Pelanggan:** Nama pembeli (contoh: `Pak Joko`).
     * **Lokasi (Opsional):** Kota asal pembeli (contoh: `Mojokerto`).
     * **Peran/Pekerjaan (Opsional):** Pekerjaan/Kategori pembeli (contoh: `Petani Kolam Terpal`).
     * **Rating Bintang:** Pilih tingkat kepuasan (1 sampai 5 bintang).
     * **Isi Testimoni:** Kalimat ulasan atau kutipan pesan WhatsApp dari pembeli.
     * **Status:** Centang `Aktif` agar langsung tampil di halaman depan website.
  4. Klik **"Simpan Testimoni"**.

---

## 6. FITUR 5: KELOLA INQUIRY (PESANAN MASUK)

Halaman ini berfungsi sebagai database pesanan masuk. Setiap kali pengunjung website mengklik tombol *"Pesan Sekarang"* dan diarahkan ke WhatsApp Anda, data pesanan tersebut sebenarnya sudah tersimpan otomatis di database ini dengan status **Pending**.

* **Alur Pengelolaan Pesanan:**
  1. Saat pembeli menghubungi Anda lewat WhatsApp, Anda dapat bernegosiasi mengenai total harga, biaya pengiriman, dan tanggal kirim.
  2. Setelah sepakat, buka menu **Inquiry** di admin panel.
  3. Cari nama pembeli yang bersangkutan pada tabel. Pesanan baru akan memiliki badge kuning **Pending**.
  4. Klik tombol **"Detail / Update"** (ikon pensil/detail) pada baris pesanan tersebut.
  5. Di dalam modal detail pesanan:
     * Tinjau pesanan (nama, kota, jenis ikan, jumlah pesanan, catatan tambahan).
     * Ubah **Status Inquiry** menjadi:
       * **Berhasil:** Jika transaksi sepakat, uang muka/DP telah dibayar, atau pesanan telah dikirim dan lunas.
       * **Gagal:** Jika pembeli membatalkan pesanan atau terjadi ketidaksepakatan.
     * Jika status diubah menjadi **Berhasil**, Anda **Wajib memasukkan nominal transaksi final** pada kolom **Total Nominal Transaksi (Rupiah)** (misal: `1250000`). Data nominal ini akan otomatis masuk ke perhitungan laporan omset keuangan Anda.
  6. Klik **"Simpan Perubahan"**.

---

## 7. FITUR 6: REKAP OMSET BULANAN

Halaman pelaporan keuangan sederhana yang menghitung performa penjualan Anda secara otomatis berdasarkan data pesanan yang berstatus **Berhasil**.

* **Fungsi Utama:** Mengevaluasi penjualan dan melihat tren jenis ikan yang paling laris setiap bulannya.
* **Metrik Keuangan:**
  * **Total Omset Bulanan:** Total rupiah terkumpul dari transaksi berhasil pada bulan terpilih.
  * **Jumlah Transaksi:** Total pesanan sukses.
  * **Rata-rata per Transaksi:** Nilai rata-rata uang per transaksi yang masuk.
* **Breakdown Penjualan per Produk:** Menampilkan grafik/tabel yang merinci total ekor ikan terjual dan nominal rupiah yang dihasilkan untuk masing-masing jenis ikan (Patin, Lele, Gurame, Nila).
* **Cara Penggunaan:**
  * Gunakan dropdown **Filter Bulan & Tahun** di bagian atas halaman untuk melihat rekapitulasi keuangan pada bulan-bulan sebelumnya. Laporan akan ter-update secara otomatis begitu bulan dipilih.

---

## 8. FITUR 7: PENGATURAN WEBSITE

Menu ini mengontrol informasi statis yang tersebar di halaman depan website pengunjung (terutama di bagian footer dan tombol WhatsApp melayang).

* **Daftar Field Pengaturan:**
  1. **Nama Usaha:** Nama bisnis Anda (contoh: `RR Fish Jombang`).
  2. **Nomor WhatsApp:** Nomor WhatsApp aktif penerima pesanan.
     * > **PENTING:** Nomor WhatsApp **WAJIB** ditulis menggunakan format internasional diawali kode negara tanpa spasi, tanda plus (+), atau angka 0. (Contoh yang benar: `6287846799603`). Penulisan yang salah (misal: `0878...` atau `+62878...`) akan menyebabkan tombol pesanan WhatsApp di web error/rusak.
  3. **Tagline:** Kalimat promosi utama di banner beranda (contoh: `Pusat Pembudidayaan Benih Ikan Air Tawar`).
  4. **Alamat Usaha:** Alamat fisik peternakan kolam Anda.
  5. **Jam Operasional:** Jam kerja Anda (contoh: `Senin–Sabtu, 08.00–17.00 WIB`).
  6. **Link Google Maps (Opsional):** Tautan koordinat lokasi kolam Anda agar pembeli bisa datang langsung.
  7. **Link Instagram / Facebook (Opsional):** URL profil sosial media usaha Anda.
* **Cara Mengubah:**
  1. Masuk ke menu **Pengaturan**.
  2. Ubah nilai pada kolom input yang ingin disesuaikan.
  3. Klik tombol **"Simpan Pengaturan"** di bagian bawah. Seluruh footer dan tombol WhatsApp di website pengunjung akan langsung berubah saat itu juga.

---

## 9. KEAMANAN & LOG OUT

Demi menjaga keamanan database bisnis Anda dari akses orang asing:
* **Autentikasi Otomatis:** Sistem akan otomatis me-log out Anda jika browser ditutup dalam waktu yang lama.
* **Cara Log Out Manual:**
  * Buka sidebar admin.
  * Di bagian paling bawah sidebar, klik tombol merah **"Logout"** (ikon pintu keluar).
  * Sistem akan membersihkan sesi login Anda dan mengarahkan Anda kembali ke halaman Login. Lakukan ini terutama jika Anda mengakses Halaman Admin menggunakan HP atau komputer milik orang lain.
