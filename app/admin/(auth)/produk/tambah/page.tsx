import Link from 'next/link'
import ProductForm from '@/components/admin/ProductForm'

export const metadata = {
  title: 'Tambah Produk | Admin RR Fish Jombang',
}

export default function TambahProdukPage() {
  return (
    <div className="flex-1 pb-20 md:pb-0 flex flex-col">
      {/* Content */}
      <div className="flex-grow p-4 md:p-6 pt-20 md:pt-6">
        <div className="max-w-4xl">
          <div className="mb-6">
            <Link href="/admin/produk" className="text-sm text-brand font-medium hover:underline flex items-center gap-1 w-fit mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Kembali
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
            <p className="text-gray-500 text-sm mt-1">Isi formulir di bawah ini untuk menambahkan produk bibit ikan.</p>
          </div>

          <ProductForm />
        </div>
      </div>
    </div>
  )
}
