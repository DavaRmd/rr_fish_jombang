'use client'

import Image from 'next/image'
import { GalleryItem } from '@/types'
import { useState } from 'react'

interface GalleryGridProps {
  images: GalleryItem[]
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer group"
            style={{ aspectRatio: '1' }}
            onClick={() => setSelectedImage(image)}
          >
            {image.image_url && (
              <Image
                src={image.image_url}
                alt={image.caption || 'Gallery image'}
                fill
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end">
              {image.caption && (
                <div className="w-full bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs font-medium line-clamp-2">{image.caption}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-lg transition"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Image */}
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              {selectedImage.image_url && (
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.caption || 'Gallery image'}
                  fill
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Caption */}
            {selectedImage.caption && (
              <p className="text-white text-center mt-4 text-sm md:text-base">{selectedImage.caption}</p>
            )}

            {/* Navigation */}
            <div className="mt-4 flex items-center justify-center gap-4 text-white">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-6 py-2 bg-white/20 hover:bg-white/40 rounded-lg transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
