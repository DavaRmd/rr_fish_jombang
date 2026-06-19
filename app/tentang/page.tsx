import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WAFloatButton from '@/components/layout/WAFloatButton'

export const metadata: Metadata = {
  title: 'Tentang Kami | RR Fish Jombang',
  description: 'Pelajari lebih lanjut tentang RR Fish Jombang. Usaha budidaya bibit ikan terpercaya dengan 10+ kolam pembibitan aktif di Jombang, Jawa Timur.',
}

export default function TentangPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-light to-blue-50 px-4 md:px-6 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Tentang RR Fish Jombang</h1>
            <p className="text-gray-700 text-base md:text-lg">
              Mitra terpercaya budidaya bibit ikan berkualitas tinggi untuk seluruh Jawa dan Kalimantan.
            </p>
          </div>
        </section>

        {/* Konten Utama */}
        <section className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Profil Singkat */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Profil Usaha</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              RR Fish Jombang adalah usaha budidaya dan penjualan bibit ikan air tawar yang berlokasi di Jombang, Jawa Timur. 
              Dengan pengalaman bertahun-tahun di bidang budidaya ikan, kami berkomitmen untuk menyediakan bibit ikan berkualitas tinggi 
              dengan harga yang kompetitif.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Kami memiliki 10+ kolam pembibitan aktif yang dirawat dengan penuh kehati-hatian untuk menghasilkan bibit ikan yang sehat, 
              kuat, dan siap untuk ditebar di kolam atau tambak Anda.
            </p>
          </div>

          {/* Visi & Misi */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-brand-light rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Visi</h3>
              <p className="text-gray-700 leading-relaxed">
                Menjadi supplier bibit ikan terpercaya dan terpilih di Pulau Jawa dan Kalimantan, yang dikenal karena kualitas produk 
                dan pelayanan terbaik.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Misi</h3>
              <ul className="text-gray-700 space-y-2 list-disc list-inside">
                <li>Menyediakan bibit ikan berkualitas dengan harga bersaing</li>
                <li>Melayani pembelian dari skala kecil hingga partai besar</li>
                <li>Memberikan konsultasi gratis tentang pemeliharaan bibit</li>
                <li>Menjalin hubungan jangka panjang dengan pelanggan</li>
              </ul>
            </div>
          </div>

          {/* Jenis Produk */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Jenis Bibit Ikan</h2>
            <p className="text-gray-700 mb-6">
              RR Fish Jombang menyediakan 4 jenis bibit ikan air tawar berkualitas:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-l-4 border-brand pl-4">
                <h4 className="font-bold text-gray-900 mb-1">Bibit Patin</h4>
                <p className="text-sm text-gray-600">Ikan patin yang cepat tumbuh dan cocok untuk budidaya komersial.</p>
              </div>
              <div className="border-l-4 border-brand pl-4">
                <h4 className="font-bold text-gray-900 mb-1">Bibit Lele</h4>
                <p className="text-sm text-gray-600">Lele berkualitas dengan pertumbuhan cepat dan tahan penyakit.</p>
              </div>
              <div className="border-l-4 border-brand pl-4">
                <h4 className="font-bold text-gray-900 mb-1">Bibit Gurame</h4>
                <p className="text-sm text-gray-600">Gurame premium untuk budidaya di kolam atau tambak skala besar.</p>
              </div>
              <div className="border-l-4 border-brand pl-4">
                <h4 className="font-bold text-gray-900 mb-1">Bibit Nila</h4>
                <p className="text-sm text-gray-600">Nila unggul dengan karakter tahan dan adaptif terhadap lingkungan.</p>
              </div>
            </div>
          </div>

          {/* Keunggulan */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Keunggulan Kami</h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-brand font-bold">✓</span>
                <span className="text-gray-700">Bibit ikan dipilih dari indukan berkualitas dengan genetika terjaga</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand font-bold">✓</span>
                <span className="text-gray-700">Dibudidayakan dengan pakan berkualitas premium dan air bersih</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand font-bold">✓</span>
                <span className="text-gray-700">Pengiriman aman dengan sistem oksigen untuk jarak jauh</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand font-bold">✓</span>
                <span className="text-gray-700">Harga kompetitif untuk pembelian jumlah kecil hingga partai besar</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand font-bold">✓</span>
                <span className="text-gray-700">Pelayanan responsif dan komunikasi yang baik dengan pelanggan</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand font-bold">✓</span>
                <span className="text-gray-700">Konsultasi gratis untuk keberhasilan budidaya Anda</span>
              </li>
            </ul>
          </div>

          {/* Area Pengiriman */}
          <div className="bg-brand-light rounded-lg p-6 mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Area Pengiriman</h3>
            <p className="text-gray-700 mb-4">
              RR Fish Jombang melayani pengiriman ke berbagai daerah:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Pulau Jawa (Utama)</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Jakarta & sekitarnya</li>
                  <li>Surabaya & sekitarnya</li>
                  <li>Bandung & sekitarnya</li>
                  <li>Semarang & sekitarnya</li>
                  <li>Yogyakarta & sekitarnya</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Kalimantan</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Banjarmasin</li>
                  <li>Pontianak</li>
                  <li>Samarinda</li>
                  <li>Dan kota lainnya</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hubungi Kami */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hubungi Kami</h3>
            <p className="text-gray-700 mb-4">
              Ada pertanyaan tentang produk atau ingin melakukan pemesanan? Hubungi kami sekarang!
            </p>
            <a
              href="https://wa.me/6287846799603?text=Halo%2C%20saya%20ingin%20menanyakan%20tentang%20bibit%20ikan%20dari%20RR%20Fish%20Jombang"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition"
            >
              Chat WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <WAFloatButton />
    </>
  )
}
