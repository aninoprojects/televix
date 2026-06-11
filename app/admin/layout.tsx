import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import AdminNav from '@/components/admin/AdminNav'
import styles from './admin.module.css'

export const metadata = { title: 'Televix Admin' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  // Check admin role
  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!adminRow) redirect('/admin/login')

  return (
    <div className={styles.adminRoot}>
      <AdminNav userEmail={user.email ?? ''} />
      <main className={styles.adminMain}>{children}</main>
    </div>
  )
}
