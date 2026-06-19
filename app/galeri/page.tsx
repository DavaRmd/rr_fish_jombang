import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WAFloatButton from '@/components/layout/WAFloatButton'
import GalleryGrid from '@/components/galeri/GalleryGrid'

async function getGalleryImages() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return []
  return data || []
}

export const metadata: Metadata = {
  title: 'Galeri | RR Fish Jombang',
  description: 'Galeri foto lengkap kolam budidaya dan aktivitas RR Fish Jombang. Lihat proses budidaya bibit ikan kami.',
}

export default async function GaleriPage() {
  const images = await getGalleryImages()

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-light to-blue-50 px-4 md:px-6 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Galeri Kolam & Aktivitas</h1>
            <p className="text-gray-600 text-sm md:text-base">
              Lihat langsung proses budidaya bibit ikan di 10+ kolam pembibitan RR Fish Jombang. Foto-foto nyata dari kebun budidaya kami.
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="px-4 md:px-6 py-8 md:py-12 max-w-6xl mx-auto">
          {images && images.length > 0 ? (
            <GalleryGrid images={images} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Galeri sedang dalam pengembangan. Mohon tunggu foto-foto terbaru kami.</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-brand-light px-4 md:px-6 py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Tertarik Memesan?</h2>
            <p className="text-gray-700 mb-6">
              Lihat katalog produk lengkap kami dan lakukan pre-order sekarang juga melalui WhatsApp.
            </p>
            <Link
              href="/#katalog"
              className="inline-block px-8 py-3 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark transition"
            >
              Lihat Katalog Produk
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WAFloatButton />
    </>
  )
}
