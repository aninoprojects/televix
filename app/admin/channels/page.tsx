import { createServerClient } from '@/lib/supabase'
import type { Channel } from '@/types/database'
import styles from '../../crud.module.css'

export const metadata = { title: 'Channels — Televix Admin' }

export default async function AdminChannelsPage() {
  const supabase = await createServerClient()
  const { data: channels } = await supabase
    .from('channels')
    .select('*')
    .order('type')
    .order('sort_order')

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Channels</h1>
          <p className={styles.pageSub}>{channels?.length ?? 0} channels configured</p>
        </div>
        <a href="/admin/channels/new" className={styles.addBtn}>+ Add channel</a>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHead}>
          <span>Ch.</span>
          <span>Name</span>
          <span>Network</span>
          <span>Type</span>
          <span>Stream</span>
          <span>Banner</span>
          <span></span>
        </div>

        {(channels as Channel[])?.map(ch => (
          <div key={ch.id} className={styles.tableRow}>
            <span className={styles.numBadge}>{ch.number}</span>
            <span className={styles.cellPrimary}>{ch.name}</span>
            <span className={styles.cellMuted}>{ch.network ?? '—'}</span>
            <span className={styles.typeBadge} data-type={ch.type}>{ch.type}</span>
            <span className={ch.youtube_id ? styles.yes : styles.no}>
              {ch.youtube_id ? '✓' : '—'}
            </span>
            <span className={ch.banner_url ? styles.yes : styles.no}>
              {ch.banner_url ? '✓' : '—'}
            </span>
            <span className={styles.actions}>
              <a href={`/admin/channels/${ch.id}/edit`} className={styles.editBtn}>Edit</a>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
