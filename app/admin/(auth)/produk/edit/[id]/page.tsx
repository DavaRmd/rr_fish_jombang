import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'

export const metadata = {
  title: 'Edit Produk | Admin RR Fish Jombang',
}

interface EditProdukPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProdukPage(props: EditProdukPageProps) {
  const params = await props.params;
  const id = params.id;
  const supabase = await createClient()
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="flex-1 md:ml-0 pb-20 md:pb-0">
      {/* Top Bar (Mobile) */}
      <div className="md:hidden sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10 flex items-center gap-3">
        <Link href="/admin/produk" className="text-gray-500 hover:text-gray-900">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Edit Produk</h1>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 mt-12 md:mt-0">
        <div className="max-w-4xl">
          <div className="mb-6 hidden md:block">
            <Link href="/admin/produk" className="text-sm text-brand font-medium hover:underline flex items-center gap-1 w-fit mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Kembali
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Edit Produk: {product.name}</h1>
            <p className="text-gray-500 text-sm mt-1">Ubah data produk di bawah ini lalu simpan.</p>
          </div>

          <ProductForm initialData={product} />
        </div>
      </div>
    </div>
  )
}
