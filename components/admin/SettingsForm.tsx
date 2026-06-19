'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { SiteSetting } from '@/types'

interface SettingsFormProps {
  initialSettings: SiteSetting[]
}

interface SettingField {
  key: string
  label: string
  placeholder: string
  type: 'text' | 'textarea'
  description?: string
}

const SETTING_FIELDS: SettingField[] = [
  {
    key: 'business_name',
    label: 'Nama Usaha',
    placeholder: 'RR Fish Jombang',
    type: 'text',
  },
  {
    key: 'whatsapp_number',
    label: 'Nomor WhatsApp',
    placeholder: '628xxxxxxxxxx',
    type: 'text',
    description: 'Format: kode negara + nomor (contoh: 6281234567890)',
  },
  {
    key: 'tagline',
    label: 'Tagline',
    placeholder: 'Bibit Ikan Segar, Berkualitas & Terpercaya',
    type: 'text',
  },
  {
    key: 'address',
    label: 'Alamat Usaha',
    placeholder: 'Alamat lengkap usaha',
    type: 'textarea',
  },
  {
    key: 'operating_hours',
    label: 'Jam Operasional',
    placeholder: 'Senin–Sabtu, 08.00–17.00 WIB',
    type: 'text',
  },
  {
    key: 'maps_url',
    label: 'Link Google Maps',
    placeholder: 'https://maps.google.com/...',
    type: 'text',
    description: 'Opsional — link lokasi usaha di Google Maps',
  },
  {
    key: 'instagram_url',
    label: 'Link Instagram',
    placeholder: 'https://instagram.com/...',
    type: 'text',
    description: 'Opsional',
  },
  {
    key: 'facebook_url',
    label: 'Link Facebook',
    placeholder: 'https://facebook.com/...',
    type: 'text',
    description: 'Opsional',
  },
]

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [values, setValues] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const field of SETTING_FIELDS) {
      const found = initialSettings.find(s => s.key === field.key)
      map[field.key] = found?.value || ''
    }
    return map
  })

  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }))
    // Clear messages on change
    if (successMsg) setSuccessMsg('')
    if (errorMsg) setErrorMsg('')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const now = new Date().toISOString()
      const upserts = SETTING_FIELDS.map(field => ({
        key: field.key,
        value: values[field.key] || '',
        updated_at: now,
      }))

      const { error } = await supabase
        .from('site_settings')
        .upsert(upserts, { onConflict: 'key' })

      if (error) throw error

      setSuccessMsg('Pengaturan berhasil disimpan!')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Gagal menyimpan pengaturan.')
    } finally {
      setIsSaving(false)
    }
  }

  const lastUpdated = initialSettings.length > 0
    ? new Date(
        Math.max(...initialSettings.map(s => new Date(s.updated_at).getTime()))
      ).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <form onSubmit={handleSave} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm max-w-2xl">
      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm font-medium">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
          {errorMsg}
        </div>
      )}

      {lastUpdated && (
        <p className="text-xs text-gray-500 mb-6">
          Terakhir diperbarui: {lastUpdated}
        </p>
      )}

      <div className="space-y-6">
        {/* Business Info Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Informasi Usaha</h3>
          <div className="space-y-4">
            {SETTING_FIELDS.filter(f => ['business_name', 'tagline', 'whatsapp_number', 'address', 'operating_hours'].includes(f.key)).map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={values[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                ) : (
                  <input
                    type="text"
                    value={values[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                )}
                {field.description && (
                  <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social / Links Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Media Sosial & Lokasi</h3>
          <div className="space-y-4">
            {SETTING_FIELDS.filter(f => ['maps_url', 'instagram_url', 'facebook_url'].includes(f.key)).map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type="text"
                  value={values[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
                {field.description && (
                  <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className={`px-5 py-2.5 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand-dark transition shadow-sm ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </div>
    </form>
  )
}
