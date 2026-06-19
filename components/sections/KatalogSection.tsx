import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/produk/ProductCard'
import type { Product } from '@/types'

export default async function KatalogSection() {
  const supabase = await createClient()
  
  // Fetch active products
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error || !products) {
    return (
      <section id="katalog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-danger">
          Gagal memuat katalog produk.
        </div>
      </section>
    )
  }

  return (
    <section id="katalog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Katalog Bibit Ikan</h2>
          <p className="text-gray-600">
            Bibit unggul hasil pembenihan terbaik, siap menunjang keberhasilan panen Anda.
            Harga tertera adalah harga per ekor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {(products as Product[]).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
