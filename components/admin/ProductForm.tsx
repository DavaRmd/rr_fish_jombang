'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Product, ProductSize, StockStatus, ProductBadge } from '@/types'

interface ProductFormProps {
  initialData?: Product
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const isEdit = !!initialData
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Form states
  const [name, setName] = useState(initialData?.name || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [status, setStatus] = useState<StockStatus>(initialData?.status || 'tersedia')
  const [badge, setBadge] = useState<ProductBadge>(initialData?.badge || null)
  const [sizes, setSizes] = useState<ProductSize[]>(
    initialData?.sizes?.length ? initialData.sizes : [{ size: '', price_min: 0, price_max: 0 }]
  )
  
  // Image states
  const [currentImageUrl, setCurrentImageUrl] = useState(initialData?.image_url || '')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const handleNameChange = (val: string) => {
    setName(val)
    if (!isEdit) {
      // auto generate slug
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

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
          
          // Batasi ukuran maksimal 1200px agar tidak terlalu besar
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
              // Ubah ekstensi menjadi .webp
              const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp"
              const newFile = new File([blob], newName, { type: 'image/webp' })
              resolve(newFile)
            } else {
              reject(new Error('Canvas to Blob failed'))
            }
          }, 'image/webp', 0.8) // kualitas 80%
        }
        img.onerror = (error) => reject(error)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal ukuran adalah 5MB.')
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      
      try {
        const compressedFile = await compressImage(file)
        setSelectedFile(compressedFile)
        setPreviewUrl(URL.createObjectURL(compressedFile))
      } catch (err) {
        console.error('Gagal memproses gambar:', err)
        alert('Gagal memproses gambar, silakan coba gambar lain.')
      }
    }
  }

  const handleAddSize = () => {
    setSizes([...sizes, { size: '', price_min: 0, price_max: 0 }])
  }

  const handleRemoveSize = (index: number) => {
    const newSizes = [...sizes]
    newSizes.splice(index, 1)
    setSizes(newSizes)
  }

  const handleSizeChange = (index: number, field: keyof ProductSize, value: string | number) => {
    const newSizes = [...sizes]
    newSizes[index] = { ...newSizes[index], [field]: value }
    setSizes(newSizes)
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return currentImageUrl

    const fileExt = selectedFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, selectedFile)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error('Gagal mengupload gambar produk.')
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    // Validations
    if (!name.trim()) return setErrorMsg('Nama produk wajib diisi.')
    if (!slug.trim()) return setErrorMsg('Slug wajib diisi.')
    if (sizes.length === 0) return setErrorMsg('Minimal satu ukuran & harga wajib diisi.')
    for (let i=0; i<sizes.length; i++) {
      if (!sizes[i].size.trim()) return setErrorMsg(`Ukuran pada baris ke-${i+1} wajib diisi.`)
      if (sizes[i].price_min <= 0) return setErrorMsg(`Harga minimum pada baris ke-${i+1} harus lebih dari 0.`)
    }

    setIsLoading(true)
    try {
      let finalImageUrl = currentImageUrl

      if (selectedFile) {
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) finalImageUrl = uploadedUrl
      }

      const productData = {
        name,
        slug,
        description,
        image_url: finalImageUrl,
        sizes,
        status,
        badge,
        is_active: initialData ? initialData.is_active : true,
      }

      if (isEdit && initialData) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialData.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData])
        if (error) {
          if (error.code === '23505') throw new Error('Slug sudah digunakan, gunakan nama lain.')
          throw error
        }
      }

      router.push('/admin/produk')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan data.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kiri: Info Dasar */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Informasi Dasar</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="Contoh: Bibit Ikan Nila"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug URL *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="contoh: bibit-ikan-nila"
                />
                <p className="text-xs text-gray-500 mt-1">Digunakan untuk URL (contoh: /produk/bibit-ikan-nila)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="Penjelasan singkat mengenai keunggulan bibit ini..."
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4 mt-8">Foto Produk</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-300 flex-shrink-0 overflow-hidden relative">
                  {(previewUrl || currentImageUrl) ? (
                    <img 
                      src={previewUrl || currentImageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Pilih Foto Baru
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Maksimal 5MB. Gambar akan otomatis dikompres ke format WEBP untuk menghemat ruang penyimpanan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kanan: Harga, Stok & Status */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Ukuran & Harga *</h3>
            <div className="space-y-3">
              {sizes.map((item, index) => (
                <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      required
                      value={item.size}
                      onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                      placeholder="Ukuran (mis. 3-5 cm)"
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-2 top-1.5 text-gray-500 text-sm">Rp</span>
                        <input
                          type="number"
                          required
                          min="0"
                          value={item.price_min || ''}
                          onChange={(e) => handleSizeChange(index, 'price_min', parseInt(e.target.value) || 0)}
                          placeholder="Harga Min"
                          className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand"
                        />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-2 top-1.5 text-gray-500 text-sm">Rp</span>
                        <input
                          type="number"
                          required
                          min="0"
                          value={item.price_max || ''}
                          onChange={(e) => handleSizeChange(index, 'price_max', parseInt(e.target.value) || 0)}
                          placeholder="Harga Max"
                          className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand"
                        />
                      </div>
                    </div>
                  </div>
                  {sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(index)}
                      className="mt-1 p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition"
                      title="Hapus baris"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSize}
                className="w-full py-2 border-2 border-dashed border-brand/40 text-brand font-medium rounded-lg hover:bg-brand-light transition text-sm flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Tambah Ukuran
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4 mt-8">Status & Label</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Stok *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StockStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="tersedia">Tersedia</option>
                  <option value="habis">Habis</option>
                  <option value="indent">Indent / Pre-order</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge Spesial</label>
                <select
                  value={badge || ''}
                  onChange={(e) => setBadge((e.target.value || null) as ProductBadge)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="">-- Tidak ada --</option>
                  <option value="hampir_habis">Hampir Habis</option>
                  <option value="musim_panen">Musim Panen</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
        <Link
          href="/admin/produk"
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-5 py-2.5 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand-dark transition shadow-sm ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isLoading ? 'Menyimpan...' : 'Simpan Produk'}
        </button>
      </div>
    </form>
  )
}
