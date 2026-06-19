'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Testimonial } from '@/types'

interface TestimonialManagerProps {
  initialTestimonials: Testimonial[]
}

export default function TestimonialManager({ initialTestimonials }: TestimonialManagerProps) {
  const router = useRouter()
  const supabase = createClient()

  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Form state
  const [formName, setFormName] = useState('')
  const [formLocation, setFormLocation] = useState('')
  const [formRole, setFormRole] = useState('')
  const [formRating, setFormRating] = useState(5)
  const [formContent, setFormContent] = useState('')

  const resetForm = () => {
    setFormName('')
    setFormLocation('')
    setFormRole('')
    setFormRating(5)
    setFormContent('')
    setShowForm(false)
    setErrorMsg('')
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setLoadingId(id)
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error

      setTestimonials(testimonials.map(t =>
        t.id === id ? { ...t, is_active: !currentStatus } : t
      ))
      router.refresh()
    } catch (err) {
      alert('Gagal mengubah status aktif')
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus testimoni dari "${name}"?`)) return

    setLoadingId(id)
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTestimonials(testimonials.filter(t => t.id !== id))
      router.refresh()
    } catch (err) {
      alert('Gagal menghapus testimoni.')
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!formName.trim()) return setErrorMsg('Nama pelanggan wajib diisi.')
    if (!formContent.trim()) return setErrorMsg('Isi testimoni wajib diisi.')

    setIsSaving(true)
    try {
      const { data: newRow, error } = await supabase
        .from('testimonials')
        .insert([{
          name: formName.trim(),
          location: formLocation.trim() || null,
          role: formRole.trim() || null,
          content: formContent.trim(),
          rating: formRating,
          is_active: true,
        }])
        .select()
        .single()

      if (error) throw error

      setTestimonials([newRow, ...testimonials])
      resetForm()
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Gagal menambah testimoni.')
    } finally {
      setIsSaving(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ))
  }

  return (
    <div className="space-y-6">
      {/* Add Button / Form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-dark transition shadow-sm"
        >
          + Tambah Testimoni
        </button>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm max-w-xl">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Testimoni Baru</h2>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="Contoh: Serang, Banten"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peran</label>
                <input
                  type="text"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="Contoh: Peternak"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
              <select
                value={formRating}
                onChange={(e) => setFormRating(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value={5}>★★★★★ (5)</option>
                <option value={4}>★★★★☆ (4)</option>
                <option value={3}>★★★☆☆ (3)</option>
                <option value={2}>★★☆☆☆ (2)</option>
                <option value={1}>★☆☆☆☆ (1)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Isi Testimoni *</label>
              <textarea
                required
                rows={3}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="Tuliskan pengalaman pelanggan..."
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className={`px-5 py-2.5 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand-dark transition shadow-sm ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Testimoni'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">Lokasi</th>
                <th className="px-4 py-3 font-semibold">Rating</th>
                <th className="px-4 py-3 font-semibold">Testimoni</th>
                <th className="px-4 py-3 font-semibold text-center">Aktif</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Belum ada testimoni.
                  </td>
                </tr>
              ) : (
                testimonials.map((t) => {
                  const isLoading = loadingId === t.id
                  return (
                    <tr key={t.id} className={`hover:bg-gray-50 transition ${isLoading ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{t.name}</div>
                        {t.role && <div className="text-xs text-gray-500">{t.role}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{t.location || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm">{renderStars(t.rating)}</span>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-gray-600 line-clamp-2">{t.content}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleActive(t.id, t.is_active)}
                          disabled={isLoading}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                            t.is_active ? 'bg-brand' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              t.is_active ? 'translate-x-4.5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(t.id, t.name)}
                          disabled={isLoading}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="Hapus"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
