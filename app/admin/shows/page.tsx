import { createServerClient } from '@/lib/supabase'
import styles from '../crud.module.css'

export const metadata = { title: 'Shows — Televix Admin' }

export default async function AdminShowsPage() {
  const supabase = await createServerClient()
  const { data: shows } = await supabase
    .from('shows')
    .select('*, channel:channels(number, name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Shows</h1>
          <p className={styles.pageSub}>{shows?.length ?? 0} shows indexed</p>
        </div>
        <a href="/admin/shows/new" className={styles.addBtn}>+ Add show</a>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeadShows}>
          <span>Title</span>
          <span>Channel</span>
          <span>Genre</span>
          <span>Poster</span>
          <span></span>
        </div>
        {shows?.map((show: any) => (
          <div key={show.id} className={styles.tableRowShows}>
            <span className={styles.cellPrimary}>{show.title}</span>
            <span className={styles.cellMuted}>
              {show.channel ? `Ch. ${show.channel.number} — ${show.channel.name}` : '—'}
            </span>
            <span className={styles.cellMuted}>{show.genre ?? '—'}</span>
            <span className={show.poster_url ? styles.yes : styles.no}>
              {show.poster_url ? '✓' : '—'}
            </span>
            <span className={styles.actions}>
              <a href={`/admin/shows/${show.id}/edit`} className={styles.editBtn}>Edit</a>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
