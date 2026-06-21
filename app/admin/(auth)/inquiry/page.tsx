import { createClient } from '@/lib/supabase/server'
import InquiryManager from '@/components/admin/InquiryManager'

export const metadata = {
  title: 'Kelola Inquiry | Admin RR Fish Jombang',
}

export default async function AdminInquiryPage() {
  const supabase = await createClient()

  const { data: inquiries, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching inquiries:', error)
  }

  return (
    <div className="flex-1 pb-20 md:pb-0 flex flex-col">
      {/* Content */}
      <div className="flex-grow p-4 md:p-6 pt-20 md:pt-6">
        <div className="max-w-6xl">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Kelola Inquiry</h1>
            <p className="text-gray-500 text-sm mt-1">
              Lihat dan kelola inquiry dari calon pembeli. Ubah status dan input nominal transaksi saat berhasil.
            </p>
          </div>

          <InquiryManager initialInquiries={inquiries || []} />
        </div>
      </div>
    </div>
  )
}
