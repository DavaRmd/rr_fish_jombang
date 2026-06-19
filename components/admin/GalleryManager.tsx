'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { GalleryItem } from '@/types'

interface GalleryManagerProps {
  initialImages: GalleryItem[]
}

export default function GalleryManager({ initialImages }: GalleryManagerProps) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<GalleryItem[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  // Upload form state
  const [caption, setCaption] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          const MAX_SIZE = 1200
          let width = img.width
          let height = img.height
          
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width
              width = MAX_SIZE
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height
              height = MAX_SIZE
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          ctx?.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob((blob) => {
            if (blob) {
              const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp"
              const newFile = new File([blob], newName, { type: 'image/webp' })
              resolve(newFile)
            } else {
              reject(new Error('Canvas to Blob failed'))
            }
          }, 'image/webp', 0.8)
        }
        img.onerror = (error) => reject(error)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('')
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Ukuran file maksimal 5MB.')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      try {
        const compressed = await compressImage(file)
        setSelectedFile(compressed)
        setPreviewUrl(URL.createObjectURL(compressed))
      } catch (err) {
        console.error('Compress error:', err)
        setErrorMsg('Gagal memproses gambar.')
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setErrorMsg('Pilih foto terlebih dahulu.')
      return
    }

    setIsUploading(true)
    setErrorMsg('')

    try {
      // 1. Upload to storage
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, selectedFile)

      if (uploadError) throw new Error('Gagal upload ke storage: ' + uploadError.message)

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName)

      // 3. Save to database
      const { data: newRow, error: dbError } = await supabase
        .from('gallery')
        .insert([{
          image_url: publicUrl,
          caption: caption.trim() || null,
        }])
        .select()
        .single()

      if (dbError) throw new Error('Gagal simpan ke database: ' + dbError.message)

      // Success
      setImages([newRow, ...images])
      
      // Reset form
      setSelectedFile(null)
      setPreviewUrl('')
      setCaption('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (item: GalleryItem) => {
    if (!window.confirm('Yakin ingin menghapus foto ini?')) return

    setDeletingId(item.id)
    try {
      // 1. Delete from storage (extract filename from URL)
      // publicUrl format: https://[project].supabase.co/storage/v1/object/public/gallery-images/[filename]
      const urlParts = item.image_url.split('/')
      const fileName = urlParts[urlParts.length - 1]

      if (fileName) {
        await supabase.storage
          .from('gallery-images')
          .remove([fileName])
      }

      // 2. Delete from database
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', item.id)

      if (error) throw new Error(error.message)

      setImages(images.filter(img => img.id !== item.id))
      router.refresh()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Gagal menghapus foto.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm max-w-xl">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Foto Baru</h2>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto *</label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-300 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="gallery-upload"
                />
                <label
                  htmlFor="gallery-upload"
                  className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
                >
                  Pilih Foto
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Format: JPG, PNG. Maksimal 5MB. Foto akan otomatis dioptimasi ke WebP.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption (Keterangan) - Opsional</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Contoh: Proses panen bibit gurame"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className={`w-full py-2.5 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand-dark transition shadow-sm ${(!selectedFile || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? 'Sedang Mengunggah...' : 'Upload Foto'}
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Foto Tersimpan ({images.length})</h2>
        
        {images.length === 0 ? (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            Belum ada foto galeri. Silakan upload foto pertama Anda.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((item) => (
              <div key={item.id} className="group relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 aspect-square">
                <img
                  src={item.image_url}
                  alt={item.caption || 'Gallery photo'}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                      className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition disabled:opacity-50"
                      title="Hapus foto"
                    >
                      {deletingId === item.id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {item.caption && (
                    <p className="text-white text-xs line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
