import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WAFloatButton from '@/components/layout/WAFloatButton'

import HeroSection from '@/components/sections/HeroSection'
import KatalogSection from '@/components/sections/KatalogSection'
import CaraOrderSection from '@/components/sections/CaraOrderSection'
import GaleriSection from '@/components/sections/GaleriSection'
import TestimoniSection from '@/components/sections/TestimoniSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col">
        <HeroSection />
        <KatalogSection />
        <CaraOrderSection />
        <GaleriSection />
        <TestimoniSection />
      </main>
      <Footer />
      <WAFloatButton />
    </>
  )
}
