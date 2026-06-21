import { createClient } from '@/lib/supabase/server'
import GalleryManager from '@/components/admin/GalleryManager'

export const metadata = {
  title: 'Kelola Galeri | Admin RR Fish Jombang',
}

export default async function AdminGaleriPage() {
  const supabase = await createClient()

  // Fetch gallery images, ordered by newest first
  const { data: images, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching gallery:', error)
  }

  return (
    <div className="flex-1 pb-20 md:pb-0 flex flex-col">
      {/* Content */}
      <div className="flex-grow p-4 md:p-6 pt-20 md:pt-6">
        <div className="max-w-6xl">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Kelola Galeri Foto</h1>
            <p className="text-gray-500 text-sm mt-1">
              Tambahkan foto aktivitas panen, stok kolam, atau pengiriman ikan. Foto-foto di sini akan langsung tampil pada halaman Galeri pengunjung.
            </p>
          </div>

          <GalleryManager initialImages={images || []} />
        </div>
      </div>
    </div>
  )
}
