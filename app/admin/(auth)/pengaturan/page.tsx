import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/admin/SettingsForm'

export const metadata = {
  title: 'Pengaturan | Admin RR Fish Jombang',
}

export default async function AdminPengaturanPage() {
  const supabase = await createClient()

  const { data: settings, error } = await supabase
    .from('site_settings')
    .select('*')

  if (error) {
    console.error('Error fetching settings:', error)
  }

  return (
    <div className="flex-1 pb-20 md:pb-0 flex flex-col">
      {/* Content */}
      <div className="flex-grow p-4 md:p-6 pt-20 md:pt-6">
        <div className="max-w-4xl">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Pengaturan Website</h1>
            <p className="text-gray-500 text-sm mt-1">
              Atur informasi usaha, nomor WhatsApp, alamat, dan media sosial yang ditampilkan di website.
            </p>
          </div>

          <SettingsForm initialSettings={settings || []} />
        </div>
      </div>
    </div>
  )
}
