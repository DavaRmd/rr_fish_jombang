'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Product, ProductBadge } from '@/types'
import Badge from '@/components/ui/Badge'
import { formatRupiah } from '@/lib/utils'

interface ProductTableProps {
  initialProducts: Product[]
}

export default function ProductTable({ initialProducts }: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setLoadingId(id)
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error

      setProducts(products.map(p => 
        p.id === id ? { ...p, is_active: !currentStatus } : p
      ))
      router.refresh()
    } catch (err) {
      alert('Gagal mengubah status aktif')
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  const handleUpdateBadge = async (id: string, newBadge: ProductBadge) => {
    setLoadingId(id)
    try {
      const { error } = await supabase
        .from('products')
        .update({ badge: newBadge })
        .eq('id', id)

      if (error) throw error

      setProducts(products.map(p => 
        p.id === id ? { ...p, badge: newBadge } : p
      ))
      router.refresh()
    } catch (err) {
      alert('Gagal mengubah badge produk')
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}"? Data yang dihapus tidak dapat dikembalikan.`)) {
      return
    }

    setLoadingId(id)
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProducts(products.filter(p => p.id !== id))
      router.refresh()
    } catch (err) {
      alert('Gagal menghapus produk. Pastikan produk ini tidak terhubung dengan data pesanan.')
      console.error(err)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-semibold">Produk</th>
              <th className="px-4 py-3 font-semibold">Harga Mulai</th>
              <th className="px-4 py-3 font-semibold">Status Stok</th>
              <th className="px-4 py-3 font-semibold">Badge</th>
              <th className="px-4 py-3 font-semibold text-center">Aktif</th>
              <th className="px-4 py-3 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Belum ada data produk.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isLoading = loadingId === product.id
                const minPrice = product.sizes.length > 0 
                  ? Math.min(...product.sizes.map(s => s.price_min))
                  : 0

                return (
                  <tr key={product.id} className={`hover:bg-gray-50 transition ${isLoading ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">/{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatRupiah(minPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={product.status} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        disabled={isLoading}
                        value={product.badge || ''}
                        onChange={(e) => handleUpdateBadge(product.id, (e.target.value || null) as ProductBadge)}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        <option value="">- Kosong -</option>
                        <option value="hampir_habis">Hampir Habis</option>
                        <option value="musim_panen">Musim Panen</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(product.id, product.is_active)}
                        disabled={isLoading}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                          product.is_active ? 'bg-brand' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            product.is_active ? 'translate-x-4.5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/produk/edit/${product.id}`}
                          className="p-1.5 text-gray-500 hover:text-brand hover:bg-brand-light/50 rounded transition"
                          title="Edit"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={isLoading}
                          className="p-1.5 text-gray-500 hover:text-danger-text hover:bg-danger-light/50 rounded transition"
                          title="Hapus"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
