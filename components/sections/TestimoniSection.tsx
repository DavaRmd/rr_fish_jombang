import { createClient } from '@/lib/supabase/server'
import type { Testimonial } from '@/types'

export default async function TestimoniSection() {
  const supabase = await createClient()

  // Ambil hanya testimoni yang aktif, maksimal 4 untuk di home page
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  if (error || !testimonials || testimonials.length === 0) {
    return null // Jangan render jika tidak ada testimoni
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Apa Kata Mereka?</h2>
          <p className="text-gray-600">
            Dukungan dan kepercayaan pelanggan adalah alasan kami terus memberikan bibit ikan kualitas unggul.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(testimonials as Testimonial[]).map(t => {
            // Mencegah error huruf kapital inisial jika string kosong
            const initial = t.name ? t.name.charAt(0).toUpperCase() : 'U'
            
            return (
              <div key={t.id} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl flex flex-col gap-4 hover:shadow-md transition-shadow">
                {/* Bintang */}
                <div className="flex gap-1 text-[#FBBF24]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={i < (t.rating || 5) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>

                {/* Kutipan */}
                <p className="text-gray-700 italic flex-grow">
                  &quot;{t.content}&quot;
                </p>

                {/* Profil User */}
                <div className="flex items-center gap-3 mt-2 border-t border-gray-200 pt-4">
                  <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold">
                    {initial}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">{t.name}</span>
                    <span className="text-xs text-gray-500">
                      {[t.role, t.location].filter(Boolean).join(' • ')}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
