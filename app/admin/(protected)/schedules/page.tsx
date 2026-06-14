import { createServerClient } from '@/lib/supabase'
import styles from '../../crud.module.css'

export const metadata = { title: 'Schedules — Televix Admin' }

const DAY_LABELS: Record<number, string> = {
  1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 6:'Sat', 7:'Sun'
}

function formatDays(days: number[]): string {
  const sorted = [...days].sort()
  if (JSON.stringify(sorted) === JSON.stringify([1,2,3,4,5])) return 'Mon–Fri'
  if (JSON.stringify(sorted) === JSON.stringify([6,7]))       return 'Sat–Sun'
  if (sorted.length === 7)                                    return 'Daily'
  return sorted.map(d => DAY_LABELS[d]).join(', ')
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${String(m).padStart(2,'0')} ${period}`
}

export default async function AdminSchedulesPage() {
  const supabase = await createServerClient()
  const { data: schedules } = await supabase
    .from('schedules')
    .select('*, show:shows(title), channel:channels(number, name)')
    .order('channel_id')
    .order('air_time')

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Schedules</h1>
          <p className={styles.pageSub}>{schedules?.length ?? 0} timeslots</p>
        </div>
        <a href="/admin/schedules/new" className={styles.addBtn}>+ Add schedule</a>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeadSchedules}>
          <span>Show</span>
          <span>Channel</span>
          <span>Time</span>
          <span>Days</span>
          <span></span>
        </div>
        {schedules?.map((s: any) => (
          <div key={s.id} className={styles.tableRowSchedules}>
            <span className={styles.cellPrimary}>{s.show?.title ?? '—'}</span>
            <span className={styles.cellMuted}>
              {s.channel ? `Ch. ${s.channel.number} — ${s.channel.name}` : '—'}
            </span>
            <span className={styles.cellMuted}>{formatTime(s.air_time)}</span>
            <span className={styles.cellMuted}>{formatDays(s.days_of_week)}</span>
            <span className={styles.actions}>
              <a href={`/admin/schedules/${s.id}/edit`} className={styles.editBtn}>Edit</a>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
