import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-light/30 pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Teks Content */}
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-light text-brand-text text-sm font-medium w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Pengiriman Pulau Jawa &amp; Kalimantan
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Bibit Ikan Segar, Berkualitas &amp; <span className="text-brand">Terpercaya</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-lg">
              Solusi terbaik untuk kebutuhan budidaya Anda. Kami menyediakan bibit unggul Gurame, Patin, Lele, dan Nila langsung dari kolam pembibitan.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Button href="#katalog" size="lg" variant="primary">
                Pesan Sekarang
              </Button>
              <Button href="/tentang" size="lg" variant="outline">
                Lihat Profil Kami
              </Button>
            </div>

            {/* Statistik */}
            <div className="grid grid-cols-3 gap-4 pt-8 mt-4 border-t border-gray-200">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-brand">10+</span>
                <span className="text-sm text-gray-500">Kolam Aktif</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-brand">4</span>
                <span className="text-sm text-gray-500">Jenis Ikan</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-brand">Jawa+</span>
                <span className="text-sm text-gray-500">Area Kirim</span>
              </div>
            </div>
          </div>

          {/* Image / Hero Visual */}
          <div className="relative animate-slide-up h-80 md:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-xl aspect-[4/3] md:aspect-auto">
             <div className="absolute inset-0 bg-brand/10 z-10" />
             {/* Note: In production we will use Next/Image, using an img tag as placeholder for now since we don't have concrete hero images yet. */}
             <img 
               src="https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?q=80&w=2000&auto=format&fit=crop" 
               alt="Kolam Pembibitan RR Fish Jombang" 
               className="object-cover w-full h-full"
             />
          </div>
        </div>
      </div>
      
      {/* Decorative background circle */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] rounded-full bg-brand-light/40 blur-3xl -z-10" />
    </section>
  )
}
