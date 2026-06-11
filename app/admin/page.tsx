import { createServerClient } from '@/lib/supabase'
import styles from './dashboard.module.css'

export default async function AdminDashboard() {
  const supabase = await createServerClient()

  const [
    { count: channelCount },
    { count: showCount },
    { count: scheduleCount },
  ] = await Promise.all([
    supabase.from('channels').select('*', { count: 'exact', head: true }),
    supabase.from('shows').select('*', { count: 'exact', head: true }),
    supabase.from('schedules').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Channels',  value: channelCount ?? 0, href: '/admin/channels',  desc: 'Active TV channels' },
    { label: 'Shows',     value: showCount    ?? 0, href: '/admin/shows',     desc: 'Indexed shows' },
    { label: 'Schedules', value: scheduleCount?? 0, href: '/admin/schedules', desc: 'Timeslot entries' },
  ]

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      <p className={styles.pageSub}>Overview of Televix content.</p>

      <div className={styles.statsGrid}>
        {stats.map(s => (
          <a key={s.label} href={s.href} className={styles.statCard}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statDesc}>{s.desc}</span>
          </a>
        ))}
      </div>

      <div className={styles.quickLinks}>
        <h2 className={styles.sectionTitle}>Quick actions</h2>
        <div className={styles.actionGrid}>
          <a href="/admin/channels/new"  className={styles.actionBtn}>+ Add channel</a>
          <a href="/admin/shows/new"     className={styles.actionBtn}>+ Add show</a>
          <a href="/admin/schedules/new" className={styles.actionBtn}>+ Add schedule</a>
          <a href="/" target="_blank"    className={styles.actionBtnGhost}>↗ View site</a>
        </div>
      </div>
    </div>
  )
}
