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
    <div className="flex-1 md:ml-0 pb-20 md:pb-0">
      {/* Top Bar (Mobile) */}
      <div className="md:hidden sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <h1 className="text-lg font-bold text-gray-900">Kelola Galeri</h1>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 mt-12 md:mt-0">
        <div className="max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 hidden md:block">Kelola Galeri Foto</h1>
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
