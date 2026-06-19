# SUPABASE_SETUP.md — Panduan Setup Supabase
# Project: RR Fish Jombang

> Ikuti langkah-langkah berikut secara berurutan.
> Setelah selesai, salin nilai environment variables ke file `.env.local` di project Next.js.

---

## 1. Buat Project Baru di Supabase

1. Buka https://supabase.com dan login
2. Klik **"New project"**
3. Isi form:
   - **Name**: `rr-fish-jombang`
   - **Database Password**: buat password yang kuat, **simpan baik-baik** — tidak bisa dilihat lagi nanti
   - **Region**: pilih `Southeast Asia (Singapore)` — paling dekat dengan Indonesia
4. Klik **"Create new project"** — tunggu sekitar 1–2 menit hingga project siap

---

## 2. Ambil Environment Variables

Setelah project siap:

1. Di sidebar kiri, klik **"Project Settings"** (ikon gear)
2. Klik **"API"**
3. Salin tiga nilai berikut ke file `.env.local` di project Next.js:

```env
# .env.local — JANGAN commit file ini ke GitHub

NEXT_PUBLIC_SUPABASE_URL=        # dari field "Project URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # dari field "anon / public"
SUPABASE_SERVICE_ROLE_KEY=       # dari field "service_role" (klik "Reveal")
```

> **Penting:** `SERVICE_ROLE_KEY` punya akses penuh ke database, jangan pernah expose ke frontend.

---

## 3. Buat Tabel Database

1. Di sidebar kiri, klik **"SQL Editor"**
2. Klik **"New query"**
3. Paste SQL berikut, lalu klik **"Run"**

```sql
-- =========================================
-- TABEL: products
-- =========================================
create table products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  sizes       jsonb not null default '[]',
  status      text not null default 'tersedia'
                check (status in ('tersedia', 'habis', 'indent')),
  badge       text
                check (badge in ('hampir_habis', 'musim_panen') or badge is null),
  is_active   boolean not null default true,
  sort_order  integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- =========================================
-- TABEL: gallery
-- =========================================
create table gallery (
  id          uuid primary key default gen_random_uuid(),
  image_url   text not null,
  caption     text,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- =========================================
-- TABEL: testimonials
-- =========================================
create table testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  location    text,
  role        text,
  content     text not null,
  rating      integer default 5 check (rating between 1 and 5),
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

-- =========================================
-- TABEL: inquiries
-- =========================================
create table inquiries (
  id                uuid primary key default gen_random_uuid(),
  customer_name     text not null,
  customer_city     text not null,
  product_id        uuid references products(id) on delete set null,
  product_name      text not null,
  quantity_range    text not null
                      check (quantity_range in ('100-500', '500-1000', '>1000')),
  shipping_method   text not null
                      check (shipping_method in (
                        'ambil_sendiri',
                        'ekspedisi_jawa',
                        'ekspedisi_kalimantan',
                        'kurir_lokal'
                      )),
  notes             text,
  status            text not null default 'pending'
                      check (status in ('pending', 'berhasil', 'gagal')),
  final_amount      bigint,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- =========================================
-- TABEL: site_settings
-- =========================================
create table site_settings (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz default now()
);

-- Seed data awal site_settings
insert into site_settings (key, value) values
  ('whatsapp_number', '6287846799603'),
  ('business_name',   'RR Fish Jombang'),
  ('tagline',         'Pusat Pembudidayaan Benih Ikan Air Tawar'),
  ('address',         'Jombang, Jawa Timur'),
  ('operating_hours', 'Senin–Sabtu, 08.00–17.00 WIB'),
  ('maps_url',        ''),
  ('instagram_url',   ''),
  ('facebook_url',    '');

-- =========================================
-- FUNGSI: auto-update kolom updated_at
-- =========================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

create trigger inquiries_updated_at
  before update on inquiries
  for each row execute function update_updated_at();
```

---

## 4. Setup Row Level Security (RLS)

Masih di SQL Editor, buat query baru, paste dan run SQL berikut:

```sql
-- =========================================
-- RLS: products
-- Public bisa READ, hanya admin yang bisa tulis
-- =========================================
alter table products enable row level security;

create policy "Public dapat membaca produk aktif"
  on products for select
  using (is_active = true);

create policy "Admin akses penuh ke produk"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =========================================
-- RLS: gallery
-- =========================================
alter table gallery enable row level security;

create policy "Public dapat membaca galeri"
  on gallery for select using (true);

create policy "Admin akses penuh ke galeri"
  on gallery for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =========================================
-- RLS: testimonials
-- =========================================
alter table testimonials enable row level security;

create policy "Public dapat membaca testimoni aktif"
  on testimonials for select
  using (is_active = true);

create policy "Admin akses penuh ke testimoni"
  on testimonials for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =========================================
-- RLS: inquiries
-- Public hanya bisa INSERT (submit form)
-- Admin bisa baca dan update semua
-- =========================================
alter table inquiries enable row level security;

create policy "Public dapat submit inquiry"
  on inquiries for insert
  with check (true);

create policy "Admin dapat membaca semua inquiry"
  on inquiries for select
  using (auth.role() = 'authenticated');

create policy "Admin dapat update inquiry"
  on inquiries for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =========================================
-- RLS: site_settings
-- =========================================
alter table site_settings enable row level security;

create policy "Public dapat membaca pengaturan"
  on site_settings for select using (true);

create policy "Admin akses penuh ke pengaturan"
  on site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

---

## 5. Buat Storage Buckets

1. Di sidebar kiri, klik **"Storage"**
2. Klik **"New bucket"**, buat dua bucket berikut:

### Bucket 1: `product-images`
- **Name**: `product-images`
- **Public bucket**: ✅ centang (foto produk harus bisa diakses publik)
- Klik **"Save"**

### Bucket 2: `gallery-images`
- **Name**: `gallery-images`
- **Public bucket**: ✅ centang
- Klik **"Save"**

Setelah bucket dibuat, tambahkan policy upload untuk admin. Klik bucket → **"Policies"** → **"New policy"** → pilih **"Custom policy"**, lalu gunakan SQL berikut (jalankan di SQL Editor):

```sql
-- Upload hanya boleh dilakukan admin (authenticated)
create policy "Admin dapat upload foto produk"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Admin dapat hapus foto produk"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

create policy "Admin dapat upload foto galeri"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery-images');

create policy "Admin dapat hapus foto galeri"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery-images');
```

---

## 6. Buat Akun Admin

1. Di sidebar kiri, klik **"Authentication"**
2. Klik **"Users"** → **"Add user"** → **"Create new user"**
3. Isi:
   - **Email**: email yang akan dipakai login admin (contoh: `admin@rrfishjombang.com`)
   - **Password**: buat password yang kuat
   - **Auto Confirm User**: ✅ centang
4. Klik **"Create user"**

> Ini adalah satu-satunya akun admin. Tidak ada halaman registrasi di website — sesuai keputusan desain (single admin, no multi-user).

---

## 7. Seed Data Produk (Opsional tapi Disarankan)

Untuk mengisi data produk awal agar bisa langsung terlihat di website, jalankan SQL berikut di SQL Editor:

```sql
insert into products (name, slug, description, sizes, status, badge, sort_order) values
(
  'Bibit Gurame',
  'bibit-gurame',
  'Bibit Gurame unggul siap tebar dari kolam budidaya RR Fish Jombang. Sehat, aktif, dan dipanen fresh sesuai pesanan.',
  '[
    {"size": "3 cm", "price_min": 800, "price_max": 900},
    {"size": "5 cm", "price_min": 1100, "price_max": 1200},
    {"size": "7 cm", "price_min": 1500, "price_max": 1600}
  ]',
  'tersedia',
  'musim_panen',
  1
),
(
  'Bibit Patin',
  'bibit-patin',
  'Bibit Patin berkualitas tinggi, cocok untuk budidaya skala kecil hingga besar.',
  '[
    {"size": "3-5 cm", "price_min": 300, "price_max": 350},
    {"size": "5-7 cm", "price_min": 400, "price_max": 450}
  ]',
  'tersedia',
  null,
  2
),
(
  'Bibit Lele',
  'bibit-lele',
  'Bibit Lele sangkuriang pilihan, pertumbuhan cepat dan tahan penyakit.',
  '[
    {"size": "3-5 cm", "price_min": 150, "price_max": 180}
  ]',
  'tersedia',
  'hampir_habis',
  3
),
(
  'Bibit Nila',
  'bibit-nila',
  'Bibit Nila merah dan hitam, cocok untuk kolam tanah maupun terpal.',
  '[
    {"size": "3-5 cm", "price_min": 200, "price_max": 220}
  ]',
  'habis',
  null,
  4
);
```

---

## 8. Verifikasi Setup

Setelah semua langkah selesai, pastikan hal berikut:

- [ ] Keempat tabel muncul di **Table Editor** (products, gallery, testimonials, inquiries, site_settings)
- [ ] Data seed `site_settings` sudah terisi (cek di Table Editor → site_settings)
- [ ] Data seed produk sudah terisi jika dijalankan (cek di Table Editor → products)
- [ ] Dua storage bucket sudah ada (`product-images`, `gallery-images`)
- [ ] Satu user admin sudah terdaftar di Authentication → Users
- [ ] Tiga nilai environment variables sudah disalin ke `.env.local`

---

## 9. Ringkasan Environment Variables

```env
# .env.local

NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

Lokasi ketiga nilai ini: **Project Settings → API** di dashboard Supabase.

---

> File ini dibuat sebagai panduan setup satu kali.
> Setelah setup selesai, file ini bisa dijadikan referensi oleh AI agent
> saat mengerjakan integrasi Supabase di kode Next.js.
