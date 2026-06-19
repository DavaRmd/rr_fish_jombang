'use client'

import { useState } from 'react'
import { ShippingMethod } from '@/types'
import { generateWAMessage } from '@/lib/whatsapp'
import Button from '@/components/ui/Button'

interface OrderFormProps {
  productName: string
  waNumber: string
  className?: string
  layout?: 'inline' | 'modal'
}

const SHIPPING_OPTIONS: { value: ShippingMethod; label: string }[] = [
  { value: 'ambil_sendiri', label: 'Ambil sendiri' },
  { value: 'ekspedisi_jawa', label: 'Ekspedisi / cargo (Jawa)' },
  { value: 'ekspedisi_kalimantan', label: 'Ekspedisi / cargo (Kalimantan)' },
  { value: 'kurir_lokal', label: 'Kurir / kendaraan lokal' },
]

const QUANTITY_OPTIONS = [
  { value: '100-500', label: '100 – 500 ekor' },
  { value: '500-1000', label: '500 – 1.000 ekor' },
  { value: '>1000', label: 'lebih dari 1.000 ekor' },
]

export default function OrderForm({ productName, waNumber, className = '', layout = 'inline' }: OrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerCity: '',
    quantityRange: '',
    shippingMethod: '',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customerName || !formData.customerCity || !formData.quantityRange || !formData.shippingMethod) {
      alert('Mohon lengkapi semua field yang wajib')
      return
    }

    // Map quantity value ke display text
    const quantityLabel = QUANTITY_OPTIONS.find(q => q.value === formData.quantityRange)?.label || formData.quantityRange
    const shippingLabel = SHIPPING_OPTIONS.find(s => s.value === formData.shippingMethod as ShippingMethod)?.label || formData.shippingMethod

    const waUrl = generateWAMessage(
      {
        customerName: formData.customerName,
        customerCity: formData.customerCity,
        productName,
        quantityRange: quantityLabel,
        shippingMethod: formData.shippingMethod as ShippingMethod,
        notes: formData.notes || undefined,
      },
      waNumber
    )

    window.open(waUrl, '_blank')
  }

  const containerClass = layout === 'modal' ? 'space-y-4' : 'space-y-3'

  return (
    <form onSubmit={handleSubmit} className={`${containerClass} ${className}`}>
      {/* Nama Lengkap */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="customerName" className="text-xs font-medium text-gray-600 uppercase tracking-wider">
          Nama lengkap
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          placeholder="Nama kamu"
          value={formData.customerName}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
          required
        />
      </div>

      {/* Asal / Kota */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="customerCity" className="text-xs font-medium text-gray-600 uppercase tracking-wider">
          Asal / kota
        </label>
        <input
          type="text"
          id="customerCity"
          name="customerCity"
          placeholder="Contoh: Surabaya"
          value={formData.customerCity}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
          required
        />
      </div>

      {/* Jumlah Pesanan */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Jumlah pesanan</label>
        <div className={layout === 'modal' ? 'space-y-2' : 'grid grid-cols-2 gap-2'}>
          {QUANTITY_OPTIONS.map(option => (
            <label
              key={option.value}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="quantityRange"
                value={option.value}
                checked={formData.quantityRange === option.value}
                onChange={handleChange}
                className="w-4 h-4 accent-brand"
                required
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Metode Pengiriman */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Metode pengiriman</label>
        <div className={layout === 'modal' ? 'space-y-2' : 'grid grid-cols-2 gap-2'}>
          {SHIPPING_OPTIONS.map(option => (
            <label
              key={option.value}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="shippingMethod"
                value={option.value}
                checked={formData.shippingMethod === option.value}
                onChange={handleChange}
                className="w-4 h-4 accent-brand"
                required
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Catatan */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-xs font-medium text-gray-600 uppercase tracking-wider">
          Catatan (opsional)
        </label>
        <textarea
          id="notes"
          name="notes"
          placeholder="Ukuran spesifik, waktu kirim, dll."
          value={formData.notes}
          onChange={(e) => {
            const { name, value } = e.currentTarget
            setFormData(prev => ({ ...prev, [name]: value }))
          }}
          rows={layout === 'modal' ? 2 : 1}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand resize-none"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" variant="whatsapp" fullWidth className="mt-2">
        Lanjut via WhatsApp
      </Button>
    </form>
  )
}
