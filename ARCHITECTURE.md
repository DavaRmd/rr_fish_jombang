# ARCHITECTURE.md — Struktur Teknis & Database

> File ini berisi detail teknis project. Baca juga `PROJECT.md` untuk konteks bisnis dan fitur lengkap.

---

## 1. Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR + SSG untuk performa & SEO |
| Styling | Tailwind CSS | Mobile first, utility-first |
| Database | Supabase (PostgreSQL) | Data produk, inquiry, testimoni, dll |
| Auth | Supabase Auth | Login admin via email + password |
| File Storage | Supabase Storage | Upload foto galeri & produk |
| Deployment | Vercel | Auto-deploy dari GitHub |

---

## 2. Struktur Folder

```
/
├── app/
│   ├── layout.tsx                  # Root layout (font, metadata global)
│   ├── page.tsx                    # Home / Landing page
│   ├── tentang/
│   │   └── page.tsx                # Halaman Tentang Kami
│   ├── galeri/
│   │   └── page.tsx                # Halaman Galeri lengkap
│   ├── produk/
│   │   └── [slug]/
│   │       └── page.tsx            # Halaman detail produk + form pre-order
│   └── admin/
│       ├── layout.tsx              # Layout admin (sidebar, auth guard)
│       ├── page.tsx                # Redirect ke /admin/dashboard
│       ├── dashboard/
│       │   └── page.tsx
│       ├── produk/
│       │   └── page.tsx
│       ├── galeri/
│       │   └── page.tsx
│       ├── testimoni/
│       │   └── page.tsx
│       ├── inquiry/
│       │   └── page.tsx
│       ├── omset/
│       │   └── page.tsx
│       └── pengaturan/
│           └── page.tsx
│
├── components/
│   ├── ui/                         # Komponen reusable kecil
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── WAFloatButton.tsx       # Tombol WhatsApp mengambang
│   ├── sections/                   # Section-section di landing page
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── KatalogSection.tsx
│   │   ├── KeunggulanSection.tsx
│   │   ├── CaraOrderSection.tsx
│   │   ├── GaleriSection.tsx
│   │   └── TestimoniSection.tsx
│   ├── produk/
│   │   ├── ProductCard.tsx         # Kartu produk di katalog
│   │   └── OrderForm.tsx           # Form pre-order + WA redirect
│   └── admin/
│       ├── Sidebar.tsx
│       ├── OmsetChart.tsx
│       └── InquiryTable.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Supabase client (browser)
│   │   └── server.ts               # Supabase client (server component)
│   ├── whatsapp.ts                 # Helper generate pesan WA otomatis
│   └── utils.ts                    # Helper umum (format harga, tanggal, dll)
│
├── types/
│   └── index.ts                    # TypeScript types & interfaces
│
├── public/
│   └── images/                     # Asset statis (logo, placeholder)
│
├── .env.local                      # Environment variables (jangan di-commit)
├── PROJECT.md                      # Konteks bisnis & fitur (baca ini dulu)
└── ARCHITECTURE.md                 # File ini
```

---

## 3. Schema Database (Supabase / PostgreSQL)

### Tabel: `products`
```sql
create table products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,               -- "Bibit Patin"
  slug        text not null unique,        -- "bibit-patin"
  description text,
  image_url   text,
  sizes       jsonb not null,
  -- contoh sizes:
  -- [
  --   { "size": "3-5 cm", "price_min": 200, "price_max": 300 },
  --   { "size": "5-7 cm", "price_min": 300, "price_max": 400 }
  -- ]
  status      text not null default 'tersedia',
  -- nilai: 'tersedia' | 'habis' | 'indent'
  badge       text,
  -- nilai: null | 'hampir_habis' | 'musim_panen'
  is_active   boolean not null default true,
  sort_order  integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
```

### Tabel: `gallery`
```sql
create table gallery (
  id          uuid primary key default gen_random_uuid(),
  image_url   text not null,
  caption     text,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);
```

### Tabel: `testimonials`
```sql
create table testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,             -- nama pembeli
  location    text,                      -- "Serang, Banten"
  role        text,                      -- "Peternak" / "Supplier"
  content     text not null,
  rating      integer default 5,        -- 1–5
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);
```

### Tabel: `inquiries`
```sql
create table inquiries (
  id                uuid primary key default gen_random_uuid(),
  customer_name     text not null,
  customer_city     text not null,
  product_id        uuid references products(id),
  product_name      text not null,       -- snapshot nama produk saat inquiry
  quantity_range    text not null,
  -- nilai: '100-500' | '500-1000' | '>1000'
  shipping_method   text not null,
  -- nilai: 'ambil_sendiri' | 'ekspedisi_jawa' | 'ekspedisi_kalimantan' | 'kurir_lokal'
  notes             text,
  status            text not null default 'pending',
  -- nilai: 'pending' | 'berhasil' | 'gagal'
  final_amount      bigint,              -- nominal transaksi (diisi manual admin, dalam rupiah)
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
```

### Tabel: `site_settings`
```sql
create table site_settings (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz default now()
);

-- Data awal (seed):
insert into site_settings (key, value) values
  ('whatsapp_number', '628xxxxxxxxxx'),
  ('business_name',   'Nama Usaha'),
  ('tagline',         'Bibit Ikan Segar, Berkualitas & Terpercaya'),
  ('address',         'Alamat lengkap usaha'),
  ('operating_hours', 'Senin–Sabtu, 08.00–17.00 WIB'),
  ('maps_url',        ''),
  ('instagram_url',   ''),
  ('facebook_url',    '');
```

---

## 4. Environment Variables

```env
# .env.local

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx

# Tidak di-expose ke client
SUPABASE_SERVICE_ROLE_KEY=xxxx
```

---

## 5. Supabase Storage Buckets

| Bucket | Akses | Keterangan |
|---|---|---|
| `product-images` | Public | Foto produk ikan |
| `gallery-images` | Public | Foto galeri kolam & aktivitas |

---

## 6. Row Level Security (RLS)

```sql
-- products, gallery, testimonials, site_settings: public bisa READ
-- inquiries: public bisa INSERT (submit form), tidak bisa READ/UPDATE/DELETE
-- Semua operasi write selain insert inquiry: hanya admin (authenticated)

-- Contoh untuk products:
alter table products enable row level security;

create policy "Public read products"
  on products for select using (true);

create policy "Admin full access products"
  on products for all using (auth.role() = 'authenticated');
```

---

## 7. Helper: Generate Pesan WhatsApp

```typescript
// lib/whatsapp.ts

interface OrderData {
  customerName: string
  customerCity: string
  productName: string
  quantityRange: string
  shippingMethod: string
  notes?: string
}

const SHIPPING_LABELS: Record<string, string> = {
  ambil_sendiri:        'Ambil sendiri',
  ekspedisi_jawa:       'Ekspedisi / cargo (Jawa)',
  ekspedisi_kalimantan: 'Ekspedisi / cargo (Kalimantan)',
  kurir_lokal:          'Kurir / kendaraan lokal',
}

export function generateWAMessage(data: OrderData, waNumber: string): string {
  const shipping = SHIPPING_LABELS[data.shippingMethod] ?? data.shippingMethod
  const notes    = data.notes ? `\nCatatan: ${data.notes}` : ''

  const message = 
    `Halo, saya ${data.customerName} dari ${data.customerCity}. ` +
    `Saya tertarik memesan ${data.productName} sebanyak ${data.quantityRange} ekor ` +
    `dengan metode pengiriman ${shipping}.${notes} ` +
    `Mohon info harga dan ketersediaan stoknya. 🙏`

  const encoded = encodeURIComponent(message)
  return `https://wa.me/${waNumber}?text=${encoded}`
}
```

---

## 8. TypeScript Types

```typescript
// types/index.ts

export type StockStatus = 'tersedia' | 'habis' | 'indent'
export type ProductBadge = 'hampir_habis' | 'musim_panen' | null
export type InquiryStatus = 'pending' | 'berhasil' | 'gagal'
export type ShippingMethod =
  | 'ambil_sendiri'
  | 'ekspedisi_jawa'
  | 'ekspedisi_kalimantan'
  | 'kurir_lokal'

export interface ProductSize {
  size:      string   // "3-5 cm"
  price_min: number   // dalam rupiah per ekor
  price_max: number
}

export interface Product {
  id:          string
  name:        string
  slug:        string
  description: string | null
  image_url:   string | null
  sizes:       ProductSize[]
  status:      StockStatus
  badge:       ProductBadge
  is_active:   boolean
  sort_order:  number
  created_at:  string
  updated_at:  string
}

export interface GalleryItem {
  id:         string
  image_url:  string
  caption:    string | null
  sort_order: number
  created_at: string
}

export interface Testimonial {
  id:         string
  name:       string
  location:   string | null
  role:       string | null
  content:    string
  rating:     number
  is_active:  boolean
  created_at: string
}

export interface Inquiry {
  id:              string
  customer_name:   string
  customer_city:   string
  product_id:      string
  product_name:    string
  quantity_range:  string
  shipping_method: ShippingMethod
  notes:           string | null
  status:          InquiryStatus
  final_amount:    number | null
  created_at:      string
  updated_at:      string
}

export interface SiteSetting {
  key:        string
  value:      string
  updated_at: string
}
```

---

## 9. Konvensi Kode

- Gunakan **TypeScript** di seluruh project
- Gunakan **Server Components** sebisa mungkin, Client Components hanya jika butuh interaktivitas (form, state, event handler)
- Fetch data di **server component** menggunakan Supabase server client
- Semua string UI dalam **Bahasa Indonesia**
- Format harga menggunakan `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`
- Slug produk menggunakan format **kebab-case** (contoh: `bibit-patin`)
- Komponen admin di-protect dengan auth guard di `app/admin/layout.tsx`
