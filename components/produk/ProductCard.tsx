import Badge, { getBadgeVariant } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatPriceRange } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const badgeVariant = getBadgeVariant(product.status, product.badge)
  
  // Hitung harga minimum
  const minPrice = Math.min(...product.sizes.map(s => s.price_min))

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden text-left flex flex-col transition-shadow">
      {/* Gambar */}
      <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden">
        {product.image_url && product.image_url.trim() !== '' ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            {/* Fallback image */}
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <Badge variant={badgeVariant} />
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-foreground mb-1">{product.name}</h3>
        <p className="text-brand font-semibold mb-4">
          Mulai dari {formatPriceRange(minPrice, minPrice)} / ekor
        </p>

        {/* Info Ukuran */}
        <div className="mt-auto mb-5 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <span className="block font-medium text-gray-800 mb-1">Tersedia {product.sizes.length} Ukuran:</span>
          <span className="line-clamp-1">{product.sizes.map(s => s.size).join(', ')}</span>
        </div>

        {product.status === 'habis' ? (
          <Button variant="danger" fullWidth disabled>
            Stok Habis
          </Button>
        ) : (
          <Button href={`/produk/${product.slug}`} variant="primary" fullWidth>
            Pesan Sekarang
          </Button>
        )}
      </div>
    </div>
  )
}
