'use client'

import { useState } from 'react'
import { Product } from '@/types'
import OrderForm from './OrderForm'

interface ProductMobileModalProps {
  product: Product
  waNumber: string
  businessName: string
}

export default function ProductMobileModal({ product, waNumber, businessName }: ProductMobileModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-2 md:hidden">
        <button className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition font-medium">
          Bagikan
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="flex-1 px-4 py-2.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition font-medium flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Pre-order
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom-full duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <h2 className="text-lg font-bold mb-1 text-gray-900">Form pre-order</h2>
            <p className="text-xs text-gray-600 mb-4">{product.name} — {businessName}</p>
            <OrderForm
              productName={product.name}
              waNumber={waNumber}
              layout="modal"
              className="max-h-[50vh] overflow-y-auto"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </>
  )
}
