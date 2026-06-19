'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Inquiry, InquiryStatus } from '@/types'
import { formatRupiah, formatDateTime } from '@/lib/utils'

interface InquiryManagerProps {
  initialInquiries: Inquiry[]
}

const SHIPPING_LABELS: Record<string, string> = {
  ambil_sendiri: 'Ambil Sendiri',
  ekspedisi_jawa: 'Ekspedisi Jawa',
  ekspedisi_kalimantan: 'Ekspedisi Kalimantan',
  kurir_lokal: 'Kurir Lokal',
}

const STATUS_OPTIONS: { value: InquiryStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800' },
  { value: 'berhasil', label: 'Berhasil', color: 'bg-green-100 text-green-800' },
  { value: 'gagal', label: 'Gagal', color: 'bg-red-100 text-red-800' },
]

type FilterTab = 'all' | InquiryStatus

export default function InquiryManager({ initialInquiries }: InquiryManagerProps) {
  const router = useRouter()
  const supabase = createClient()

  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)
  const [filter, setFilter] = useState<FilterTab>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [editingAmountId, setEditingAmountId] = useState<string | null>(null)
  const [amountInput, setAmountInput] = useState('')

  const filteredInquiries = filter === 'all'
    ? inquiries
    : inquiries.filter(inq => inq.status === filter)

  const counts = {
    all: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    berhasil: inquiries.filter(i => i.status === 'berhasil').length,
    gagal: inquiries.filter(i => i.status === 'gagal').length,
  }

  const handleStatusChange = async (id: string, newStatus: InquiryStatus, currentAmount: number | null) => {
    setUpdatingId(id)
    try {
      const updateData: { status: InquiryStatus; final_amount?: number | null; updated_at: string } = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      }

      // If changing away from berhasil, clear final_amount
      if (newStatus !== 'berhasil') {
        updateData.final_amount = null
      }

      const { error } = await supabase
        .from('inquiries')
        .update(updateData)
        .eq('id', id)

      if (error) throw error

      setInquiries(inquiries.map(inq =>
        inq.id === id
          ? { ...inq, status: newStatus, final_amount: newStatus !== 'berhasil' ? null : inq.final_amount, updated_at: updateData.updated_at }
          : inq
      ))

      // Show amount input if status changed to berhasil
      if (newStatus === 'berhasil' && !currentAmount) {
        setEditingAmountId(id)
        setAmountInput('')
      } else {
        setEditingAmountId(null)
      }

      router.refresh()
    } catch (err) {
      alert('Gagal mengubah status inquiry.')
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSaveAmount = async (id: string) => {
    const amount = parseInt(amountInput) || 0
    if (amount <= 0) {
      alert('Nominal harus lebih dari 0.')
      return
    }

    setUpdatingId(id)
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({
          final_amount: amount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      setInquiries(inquiries.map(inq =>
        inq.id === id ? { ...inq, final_amount: amount } : inq
      ))
      setEditingAmountId(null)
      setAmountInput('')
      router.refresh()
    } catch (err) {
      alert('Gagal menyimpan nominal transaksi.')
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusStyle = (status: InquiryStatus) => {
    const opt = STATUS_OPTIONS.find(o => o.value === status)
    return opt?.color || 'bg-gray-100 text-gray-800'
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Pending' },
    { key: 'berhasil', label: 'Berhasil' },
    { key: 'gagal', label: 'Gagal' },
  ]

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              filter === tab.key
                ? 'bg-brand text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
              filter === tab.key ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Pelanggan</th>
                <th className="px-4 py-3 font-semibold">Produk</th>
                <th className="px-4 py-3 font-semibold">Jumlah</th>
                <th className="px-4 py-3 font-semibold">Pengiriman</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Tidak ada inquiry{filter !== 'all' ? ` dengan status "${filter}"` : ''}.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const isUpdating = updatingId === inq.id
                  const isEditingAmount = editingAmountId === inq.id

                  return (
                    <tr key={inq.id} className={`hover:bg-gray-50 transition ${isUpdating ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {formatDateTime(inq.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{inq.customer_name}</div>
                        <div className="text-xs text-gray-500">{inq.customer_city}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{inq.product_name}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{inq.quantity_range} ekor</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {SHIPPING_LABELS[inq.shipping_method] || inq.shipping_method}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <select
                            disabled={isUpdating}
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus, inq.final_amount)}
                            className={`text-xs font-medium px-2 py-1 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer ${getStatusStyle(inq.status)}`}
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          {inq.notes && (
                            <span className="text-xs text-gray-400 italic" title={inq.notes}>
                              Catatan tersedia
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {inq.status === 'berhasil' ? (
                          isEditingAmount ? (
                            <div className="flex items-center gap-1 justify-end">
                              <span className="text-xs text-gray-500">Rp</span>
                              <input
                                type="number"
                                min="0"
                                value={amountInput}
                                onChange={(e) => setAmountInput(e.target.value)}
                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand text-right"
                                placeholder="Nominal"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveAmount(inq.id)}
                                disabled={isUpdating}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="Simpan"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setEditingAmountId(null)}
                                className="p-1 text-gray-400 hover:bg-gray-50 rounded"
                                title="Batal"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingAmountId(inq.id)
                                setAmountInput(inq.final_amount?.toString() || '')
                              }}
                              className="text-sm font-medium text-gray-900 hover:text-brand transition"
                              title="Klik untuk edit nominal"
                            >
                              {inq.final_amount ? formatRupiah(inq.final_amount) : (
                                <span className="text-xs text-gray-400 italic">+ Input nominal</span>
                              )}
                            </button>
                          )
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
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
