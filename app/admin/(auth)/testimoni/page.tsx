import { createClient } from '@/lib/supabase/server'
import TestimonialManager from '@/components/admin/TestimonialManager'

export const metadata = {
  title: 'Kelola Testimoni | Admin RR Fish Jombang',
}

export default async function AdminTestimoniPage() {
  const supabase = await createClient()

  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching testimonials:', error)
  }

  return (
    <div className="flex-1 pb-20 md:pb-0 flex flex-col">
      {/* Content */}
      <div className="flex-grow p-4 md:p-6 pt-20 md:pt-6">
        <div className="max-w-6xl">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Kelola Testimoni</h1>
            <p className="text-gray-500 text-sm mt-1">
              Tambahkan dan kelola testimoni pelanggan untuk membangun kepercayaan calon pembeli.
            </p>
          </div>

          <TestimonialManager initialTestimonials={testimonials || []} />
        </div>
      </div>
    </div>
  )
}
