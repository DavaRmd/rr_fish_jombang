import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // getUser() verifies the JWT with the Auth server (not just local decode)
  // The middleware already refreshed the session, so this should succeed
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return <>{children}</>
}
