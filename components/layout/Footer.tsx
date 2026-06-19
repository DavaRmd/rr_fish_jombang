import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

async function getSettings() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')

  const settings: Record<string, string> = {}
  data?.forEach((row) => {
    settings[row.key] = row.value
  })
  return settings
}

export default async function Footer() {
  const settings = await getSettings()

  const businessName = settings['business_name'] ?? 'RR Fish Jombang'
  const tagline = settings['tagline'] ?? 'Bibit Ikan Segar, Berkualitas & Terpercaya'
  const address = settings['address'] ?? 'Jombang, Jawa Timur'
  const operatingHours = settings['operating_hours'] ?? 'Senin–Sabtu, 08.00–17.00 WIB'
  const waNumber = settings['whatsapp_number'] ?? '6287846799603'
  const waDisplay = waNumber.startsWith('62')
    ? '0' + waNumber.slice(2)
    : waNumber

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom 1 — Info usaha */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                <span className="text-white font-bold text-xs">RR</span>
              </div>
              <span className="text-lg font-bold text-white">{businessName}</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">{tagline}</p>
            <p className="text-sm text-gray-400">{address}</p>
          </div>

          {/* Kolom 2 — Navigasi */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-brand transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/#katalog" className="text-sm text-gray-400 hover:text-brand transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-sm text-gray-400 hover:text-brand transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="text-sm text-gray-400 hover:text-brand transition-colors">
                  Galeri
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3 — Kontak */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Hubungi Kami
            </h3>
            <div className="space-y-3">
              {/* WhatsApp */}
              <div className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-[#25D366] shrink-0 mt-0.5"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <div>
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-[#25D366] transition-colors"
                  >
                    {waDisplay}
                  </a>
                </div>
              </div>

              {/* Jam operasional */}
              <div className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500 shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-sm text-gray-400">{operatingHours}</span>
              </div>

              {/* Area pengiriman */}
              <div className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500 shrink-0 mt-0.5"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm text-gray-400">Pengiriman: Jawa &amp; Kalimantan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-800">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {businessName}. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}
