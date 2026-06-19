'use client'

import { useState } from 'react'
import Image from 'next/image'
import Badge from '@/components/ui/Badge'
import type { ProductBadge } from '@/types'

interface ProductGalleryProps {
  imageUrl: string | null
  productName: string
  badge?: ProductBadge | null
  showThumbnail?: boolean
}

export default function ProductGallery({ imageUrl, productName, badge, showThumbnail = true }: ProductGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!imageUrl) {
    return (
      <div className="relative w-full bg-brand-light rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-sm font-medium">Belum ada foto</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Main Image */}
      <div 
        className="relative w-full bg-brand-light overflow-hidden cursor-pointer group rounded-none md:rounded-lg mb-0 md:mb-4" 
        style={{ aspectRatio: '4/3' }}
        onClick={() => setIsOpen(true)}
      >
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant={badge as any} size="sm" />
          </div>
        )}
        
        {/* Zoom Hint Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shadow-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* 1 Thumbnail (Desktop Only usually) */}
      {showThumbnail && (
        <div className="flex justify-center gap-2">
          <div 
            className="w-16 h-16 border-2 border-brand rounded-lg overflow-hidden cursor-pointer hover:border-brand-dark transition relative group"
            onClick={() => setIsOpen(true)}
            title="Klik untuk memperbesar"
          >
            <img
              src={imageUrl}
              alt={`${productName} thumbnail`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="opacity-0 group-hover:opacity-100 drop-shadow-md">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-0 md:p-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full h-full max-w-5xl flex flex-col justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-white/20 text-white p-3 rounded-full transition z-10 backdrop-blur-sm"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Lightbox Image */}
            <div className="relative w-full h-full flex items-center justify-center" onClick={() => setIsOpen(false)}>
              <img
                src={imageUrl}
                alt={productName}
                className="max-w-full max-h-full object-contain cursor-zoom-out"
              />
            </div>
            
            <p className="absolute bottom-6 text-white/50 text-sm hidden md:block bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
              Ketuk dua kali atau cubit untuk Zoom
            </p>
          </div>
        </div>
      )}
    </>
  )
}
