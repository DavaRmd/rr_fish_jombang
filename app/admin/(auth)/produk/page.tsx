import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductTable from '@/components/admin/ProductTable'

export const metadata = {
  title: 'Kelola Produk | Admin RR Fish Jombang',
}

export default async function AdminProdukPage() {
  const supabase = await createClient()
  
  // Fetch all products ordered by created_at descending or sort_order
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="flex-1 md:ml-0 pb-20 md:pb-0">
      {/* Top Bar (Mobile) */}
      <div className="md:hidden sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <h1 className="text-lg font-bold text-gray-900">Kelola Produk</h1>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 mt-12 md:mt-0">
        <div className="max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 hidden md:block">Kelola Produk</h1>
              <p className="text-gray-500 text-sm mt-1">Atur daftar produk bibit ikan beserta harganya</p>
            </div>
            <Link
              href="/admin/produk/tambah"
              className="px-4 py-2 bg-brand text-white text-sm md:text-base font-medium rounded-lg hover:bg-brand-dark transition shadow-sm"
            >
              + Tambah Produk
            </Link>
          </div>

          <ProductTable initialProducts={products || []} />
        </div>
      </div>
    </div>
  )
}
