'use client'

import type { Channel, ScheduleWithShow } from '@/types/database'
import styles from './Timeline.module.css'

interface Props {
  channel: Channel
  schedules: ScheduleWithShow[]
  activeId: string | null
  onSelect: (schedule: ScheduleWithShow) => void
}

function formatTime(timeStr: string): string {
  // timeStr is "HH:MM:SS" from Postgres TIME
  const [h, m] = timeStr.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

function isCurrentlyAiring(schedule: ScheduleWithShow): boolean {
  const now = new Date()
  const [h, m] = schedule.air_time.split(':').map(Number)
  const airMinutes = h * 60 + m
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  if (schedule.end_time) {
    const [eh, em] = schedule.end_time.split(':').map(Number)
    const endMinutes = eh * 60 + em
    return nowMinutes >= airMinutes && nowMinutes < endMinutes
  }

  // No end_time: consider "now" if within 60 min of air_time
  return nowMinutes >= airMinutes && nowMinutes < airMinutes + 60
}

export default function Timeline({ channel, schedules, activeId, onSelect }: Props) {
  const today = new Date().toLocaleDateString('en-PH', {
    weekday: 'short', month: 'short', day: 'numeric'
  })

  return (
    <div className={styles.timeline}>
      <div className={styles.head}>
        <span className={styles.numBadge}>{channel.number}</span>
        <span className={styles.chName}>{channel.name}</span>
        <span className={styles.date}>{today}</span>
      </div>

      <div className={styles.items}>
        {schedules.length === 0 && (
          <div className={styles.empty}>
            No schedule available for today.<br />
            Check back later or{' '}
            <a href="/admin/schedules">add one in admin</a>.
          </div>
        )}

        {schedules.map(s => {
          const airing = isCurrentlyAiring(s)
          const active = s.id === activeId
          return (
            <div
              key={s.id}
              className={`${styles.item} ${active ? styles.activeItem : ''}`}
              onClick={() => onSelect(s)}
            >
              <div className={styles.timeCol}>{formatTime(s.air_time)}</div>
              <div className={styles.showCol}>
                <div className={styles.title}>
                  {s.show.title}
                  {airing && <span className={styles.nowTag}>Now</span>}
                </div>
                <div className={styles.sub}>
                  {s.show.genre && <span className={styles.genre}>{s.show.genre}</span>}
                  {s.notes && <span className={styles.notes}>{s.notes}</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
