'use client'

import { useState, useMemo } from 'react'
import type { Inquiry } from '@/types'
import { formatRupiah } from '@/lib/utils'

interface OmsetReportProps {
  initialInquiries: Inquiry[]
}

interface MonthOption {
  value: string  // "YYYY-MM"
  label: string  // "Maret 2026"
}

export default function OmsetReport({ initialInquiries }: OmsetReportProps) {
  // Build month options from data
  const monthOptions: MonthOption[] = useMemo(() => {
    const set = new Set<string>()
    initialInquiries.forEach(inq => {
      const d = new Date(inq.updated_at)
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    })
    // Also add current month as default
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    set.add(currentMonth)

    const months = Array.from(set).sort().reverse()
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

    return months.map(m => {
      const [year, month] = m.split('-')
      return {
        value: m,
        label: `${monthNames[parseInt(month) - 1]} ${year}`,
      }
    })
  }, [initialInquiries])

  const [selectedMonth, setSelectedMonth] = useState<string>(
    monthOptions.length > 0 ? monthOptions[0].value : ''
  )

  // Filter inquiries by selected month
  const filtered = useMemo(() => {
    if (!selectedMonth) return initialInquiries
    return initialInquiries.filter(inq => {
      const d = new Date(inq.updated_at)
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return m === selectedMonth
    })
  }, [initialInquiries, selectedMonth])

  // Calculate metrics
  const totalTransaksi = filtered.length
  const totalOmset = filtered.reduce((sum, inq) => sum + (inq.final_amount || 0), 0)
  const rataRata = totalTransaksi > 0 ? totalOmset / totalTransaksi : 0

  // Calculate breakdown per product
  const productBreakdown = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {}
    filtered.forEach(inq => {
      const name = inq.product_name
      if (!map[name]) map[name] = { count: 0, total: 0 }
      map[name].count += 1
      map[name].total += (inq.final_amount || 0)
    })

    return Object.entries(map)
      .map(([name, data]) => ({
        name,
        count: data.count,
        total: data.total,
        percentage: totalOmset > 0 ? (data.total / totalOmset) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total)
  }, [filtered, totalOmset])

  return (
    <div className="space-y-6">
      {/* Month Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Periode:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-white"
        >
          {monthOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Total Transaksi</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalTransaksi}</p>
          <p className="text-xs text-gray-500 mt-1">transaksi berhasil</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Total Omset</p>
          <p className="text-xl font-bold text-gray-900 mt-2">{formatRupiah(totalOmset)}</p>
          <p className="text-xs text-gray-500 mt-1">periode terpilih</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Rata-rata per Transaksi</p>
          <p className="text-xl font-bold text-gray-900 mt-2">{formatRupiah(Math.round(rataRata))}</p>
          <p className="text-xs text-gray-500 mt-1">per transaksi berhasil</p>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Breakdown per Produk</h2>
          <p className="text-xs text-gray-500 mt-0.5">Kontribusi masing-masing produk terhadap total omset</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">Produk</th>
                <th className="px-6 py-3 font-semibold text-center">Jumlah Transaksi</th>
                <th className="px-6 py-3 font-semibold text-right">Total Omset</th>
                <th className="px-6 py-3 font-semibold text-right">Kontribusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Belum ada transaksi berhasil pada periode ini.
                  </td>
                </tr>
              ) : (
                productBreakdown.map((item) => (
                  <tr key={item.name} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3">
                      <span className="font-semibold text-gray-900">{item.name}</span>
                    </td>
                    <td className="px-6 py-3 text-center">{item.count} transaksi</td>
                    <td className="px-6 py-3 text-right font-medium text-gray-900">
                      {formatRupiah(item.total)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand rounded-full"
                            style={{ width: `${Math.max(item.percentage, 2)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-12 text-right">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
