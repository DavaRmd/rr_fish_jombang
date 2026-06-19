import { createClient } from '@/lib/supabase/server'

async function getDashboardMetrics() {
  const supabase = await createClient()

  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: inquiryCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Successful transactions this month
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { data: monthlyInquiries } = await supabase
    .from('inquiries')
    .select('final_amount')
    .eq('status', 'berhasil')
    .gte('updated_at', firstOfMonth)

  let totalOmset = 0
  let transaksiBerhasil = 0
  if (monthlyInquiries) {
    transaksiBerhasil = monthlyInquiries.length
    totalOmset = monthlyInquiries.reduce((sum, inq) => sum + (inq.final_amount || 0), 0)
  }

  // Recent successful inquiries
  const { data: recentInquiries } = await supabase
    .from('inquiries')
    .select('*')
    .eq('status', 'berhasil')
    .order('updated_at', { ascending: false })
    .limit(5)

  return {
    productCount: productCount || 0,
    inquiryCount: inquiryCount || 0,
    transaksiBerhasil,
    totalOmset,
    recentInquiries: recentInquiries || [],
  }
}

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="hidden md:block bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600">Ringkasan data usaha RR Fish Jombang</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto md:p-6 p-4 pt-20 md:pt-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Produk Aktif</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.productCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Inquiry Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.inquiryCount}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Transaksi Berhasil</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.transaksiBerhasil}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Omset Bulan Ini</p>
              <p className="text-xl font-bold text-gray-900 mt-2 truncate">{formatCurrency(metrics.totalOmset)}</p>
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Inquiry Terbaru (Berhasil)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Nama</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Produk</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Jumlah</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">Nominal</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {metrics.recentInquiries.length > 0 ? (
                  metrics.recentInquiries.map((inquiry: any) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-900 font-medium">{inquiry.customer_name}</td>
                      <td className="px-6 py-3 text-gray-600">{inquiry.product_name}</td>
                      <td className="px-6 py-3 text-gray-600">{inquiry.quantity_range}</td>
                      <td className="px-6 py-3 text-right text-gray-900 font-medium">
                        {formatCurrency(inquiry.final_amount || 0)}
                      </td>
                      <td className="px-6 py-3 text-gray-600 text-xs">
                        {new Date(inquiry.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                      Belum ada inquiry yang berhasil
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
