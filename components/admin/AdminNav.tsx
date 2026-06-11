'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import styles from './AdminNav.module.css'

const NAV_ITEMS = [
  { href: '/admin',           label: 'Dashboard',  icon: '▦' },
  { href: '/admin/channels',  label: 'Channels',   icon: '📡' },
  { href: '/admin/shows',     label: 'Shows',      icon: '🎬' },
  { href: '/admin/schedules', label: 'Schedules',  icon: '🗓' },
]

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">televix<span>.</span></Link>
        <span className={styles.adminTag}>admin</span>
      </div>

      <ul className={styles.navList}>
        {NAV_ITEMS.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <span className={styles.email}>{userEmail}</span>
        <button className={styles.signOutBtn} onClick={handleSignOut}>Sign out</button>
      </div>
    </nav>
  )
}
