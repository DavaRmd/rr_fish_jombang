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
