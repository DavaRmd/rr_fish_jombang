import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createBuildClient } from '@/lib/supabase/static'
import { Product } from '@/types'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WAFloatButton from '@/components/layout/WAFloatButton'
import Badge from '@/components/ui/Badge'
import OrderForm from '@/components/produk/OrderForm'
import ProductMobileModal from '@/components/produk/ProductMobileModal'
import ProductGallery from '@/components/produk/ProductGallery'

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data
}

async function getSiteSettings() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')

  const settings: Record<string, string> = {}
  data?.forEach(item => {
    settings[item.key] = item.value
  })
  return settings
}

export async function generateStaticParams() {
  const supabase = createBuildClient()
  const { data } = await supabase
    .from('products')
    .select('slug')
    .eq('is_active', true)

  if (!data) return []
  return data.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = createBuildClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) {
    return {
      title: 'Produk tidak ditemukan',
    }
  }

  return {
    title: `${product.name} | RR Fish Jombang`,
    description: product.description || `Pesan ${product.name} berkualitas dari RR Fish Jombang. Melayani pengiriman ke seluruh Jawa & Kalimantan.`,
    openGraph: {
      title: `${product.name} | RR Fish Jombang`,
      description: product.description || `Pesan ${product.name} berkualitas dari RR Fish Jombang.`,
      images: product.image_url && product.image_url.trim() !== '' ? [{ url: product.image_url, width: 1200, height: 630 }] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  const settings = await getSiteSettings()

  if (!product) {
    notFound()
  }

  const waNumber = settings['whatsapp_number'] || '6287846799603'
  const businessName = settings['business_name'] || 'RR Fish Jombang'

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {/* Breadcrumb */}
        <nav className="hidden md:block bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-brand">Beranda</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
            <Link href="/?section=produk" className="hover:text-brand">Produk</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </nav>

        {/* Mobile Breadcrumb */}
        <div className="md:hidden px-4 py-2 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Link href="/" className="hover:text-brand">Beranda</Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>

        {/* Desktop Layout - 2 Column */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6 py-8">
          {/* Left: Images */}
          <div>
            <ProductGallery 
              imageUrl={product.image_url} 
              productName={product.name} 
              badge={product.badge} 
              showThumbnail={true}
            />
          </div>

          {/* Right: Info + Form */}
          <div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {product.description || `Bibit ${product.name} berkualitas dari kolam budidaya RR Fish Jombang. Sehat, aktif, dan dipanen fresh sesuai pesanan.`}
            </p>

            {/* Badges */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <Badge variant={product.status} size="sm" />
              {product.badge && <Badge variant={product.badge as 'hampir_habis' | 'musim_panen'} size="sm" />}
              <Badge variant="indent" label="Jawa & Kalimantan" size="sm" />
            </div>

            {/* Price Block */}
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Harga per ukuran</h3>
              <div className="space-y-2">
                {product.sizes.map((size, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">Ukuran {size.size}</span>
                    <span className="font-medium text-brand-dark">Rp {size.price_min.toLocaleString('id-ID')}/ekor</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Text */}
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Minimum order 100 ekor. Packing sistem oksigen, aman pengiriman jauh. Pengiriman ke seluruh Jawa & Kalimantan.
            </p>

            {/* Form Card */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-bold mb-4 text-gray-900">Form pre-order</h3>
              <OrderForm productName={product.name} waNumber={waNumber} layout="inline" />
            </div>
          </div>
        </div>

        {/* Mobile Layout - 1 Column */}
        <div className="md:hidden flex flex-col">
          {/* Image */}
          <ProductGallery 
            imageUrl={product.image_url} 
            productName={product.name} 
            badge={product.badge} 
            showThumbnail={false}
          />

          {/* Info Section */}
          <div className="px-4 pt-4 pb-20">
            <h1 className="text-xl font-bold mb-2 text-gray-900">{product.name}</h1>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              {product.description || `Bibit ${product.name} berkualitas dari kolam budidaya RR Fish Jombang.`}
            </p>

            {/* Badges */}
            <div className="flex gap-2 mb-3 flex-wrap">
              <Badge variant={product.status} size="sm" />
              {product.badge && <Badge variant={product.badge as 'hampir_habis' | 'musim_panen'} size="sm" />}
              <Badge variant="indent" label="Jawa & Kalimantan" size="sm" />
            </div>

            {/* Price Block */}
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Harga per ukuran</h3>
              <div className="space-y-2">
                {product.sizes.map((size, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gray-600">Ukuran {size.size}</span>
                    <span className="font-medium text-brand-dark">Rp {size.price_min.toLocaleString('id-ID')}/ekor</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Informasi produk</h3>
              <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                Bibit {product.name} RR Fish Jombang dibudidayakan secara intensif dengan pakan berkualitas dan air bersih.
              </p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Minimum order: 100 ekor</li>
                <li>Pengiriman: Jawa & Kalimantan</li>
                <li>Packing: sistem oksigen</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-3 mb-4">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Cara memesan</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Klik tombol di bawah, isi form singkat, lalu pesan otomatis akan terisi di WhatsApp.
              </p>
            </div>
          </div>

          {/* Sticky CTA */}
          <ProductMobileModal product={product} waNumber={waNumber} businessName={businessName} />
        </div>
      </main>
      <Footer />
      <WAFloatButton />
    </>
  )
}
