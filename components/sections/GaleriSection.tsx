import { createClient } from '@/lib/supabase/server'
import Button from '@/components/ui/Button'
import type { GalleryItem } from '@/types'

export default async function GaleriSection() {
  const supabase = await createClient()

  const { data: gallery, error } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order', { ascending: true })
    .limit(6)

  if (error || !gallery) {
    return null // Return null silently on error side
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-center md:text-left">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Galeri Kami</h2>
            <p className="text-gray-600">
              Momen proses pembenihan, pemeliharaan, hingga pengiriman ribuan bibit ikan air tawar ke seluruh pelanggan kami.
            </p>
          </div>
          <div className="shrink-0">
            <Button href="/galeri" variant="outline">
              Lihat Semua Foto
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {(gallery as GalleryItem[]).map((item) => (
            <div key={item.id} className="relative aspect-square group overflow-hidden bg-gray-200 rounded-xl">
              {item.image_url && item.image_url.trim() !== '' ? (
                 <img 
                   src={item.image_url} 
                   alt={item.caption ?? 'Galeri RR Fish Jombang'}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-light/50">Image</div>
              )}
              {item.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="p-4 text-white text-sm font-medium line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
