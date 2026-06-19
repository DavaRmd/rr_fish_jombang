'use client'

import { ReactNode, useEffect, useCallback } from 'react'

interface ModalProps {
  /** Apakah modal terbuka */
  isOpen: boolean
  /** Callback untuk menutup modal */
  onClose: () => void
  /** Judul modal (opsional) */
  title?: string
  /** Konten modal */
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Tutup dengan tombol Escape
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  // Lock body scroll saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Modal'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — bottom sheet di mobile, centered di desktop */}
      <div
        className="
          relative z-10 w-full bg-white
          rounded-t-2xl md:rounded-2xl
          max-h-[85vh] overflow-y-auto
          md:max-w-lg md:mx-4
          animate-slide-up md:animate-fade-in
        "
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl md:rounded-t-2xl border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          {/* Drag handle di mobile */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 md:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          <h2 className="text-lg font-semibold text-foreground mt-2 md:mt-0">
            {title ?? ''}
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 cursor-pointer"
            aria-label="Tutup"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
