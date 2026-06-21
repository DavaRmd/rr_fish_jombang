import AdminSidebar from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminSidebar />
      <div className="md:pl-64 flex flex-col flex-1 min-h-screen">
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  )
}
