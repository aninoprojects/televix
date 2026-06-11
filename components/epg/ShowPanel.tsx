'use client'

import { useState } from 'react'
import type { Channel, ScheduleWithShow } from '@/types/database'
import styles from './ShowPanel.module.css'

interface Props {
  channel: Channel
  schedule: ScheduleWithShow | null
}

function formatScheduleLabel(schedule: ScheduleWithShow): string {
  const [h, m] = schedule.air_time.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  const timeStr = `${h12}:${String(m).padStart(2, '0')} ${period}`

  const DAY_NAMES = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const days = schedule.days_of_week.sort()

  // Common shorthand patterns
  const isWeekdays = JSON.stringify(days) === JSON.stringify([1,2,3,4,5])
  const isWeekends = JSON.stringify(days) === JSON.stringify([6,7])
  const isDaily    = days.length === 7

  let dayStr: string
  if (isWeekdays) dayStr = 'Mon–Fri'
  else if (isWeekends) dayStr = 'Sat–Sun'
  else if (isDaily) dayStr = 'Daily'
  else dayStr = days.map(d => DAY_NAMES[d]).join(', ')

  return `${timeStr} · ${dayStr}`
}

export default function ShowPanel({ channel, schedule }: Props) {
  const [liveActive, setLiveActive] = useState(false)

  const hasStream = !!channel.youtube_id
  const show = schedule?.show ?? null

  function playLive() {
    if (!hasStream) return
    setLiveActive(true)
  }

  function stopLive() {
    setLiveActive(false)
  }

  return (
    <div className={styles.panel}>

      {/* Media area: banner or YT embed */}
      <div className={styles.mediaArea}>

        {/* Channel banner — shown when not live */}
        {!liveActive && (
          <div
            className={styles.banner}
            style={{
              backgroundImage: channel.banner_url
                ? `url('${channel.banner_url}')`
                : undefined,
              background: channel.banner_url ? undefined : 'var(--panel)',
            }}
          >
            {/* CRT vignette — signature element */}
            <div className={styles.vignette} />

            {!channel.banner_url && (
              <div className={styles.noBanner}>
                <span className={styles.noBannerNum}>{channel.number}</span>
                <span className={styles.noBannerName}>{channel.name}</span>
              </div>
            )}
          </div>
        )}

        {/* YouTube embed — shown when live */}
        {liveActive && channel.youtube_id && (
          <div className={styles.ytEmbed}>
            <iframe
              src={`https://www.youtube.com/embed/${channel.youtube_id}?autoplay=1&rel=0&modestbranding=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button className={styles.stopLiveBtn} onClick={stopLive}>
              ✕ Stop live
            </button>
          </div>
        )}
      </div>

      {/* Show info bar */}
      <div className={styles.infoBar}>
        <div className={styles.metaRow}>

          {/* Schedule tag */}
          <div className={styles.scheduleTag}>
            <span>⏱</span>
            <span>{schedule ? formatScheduleLabel(schedule) : 'No schedule today'}</span>
          </div>

          {/* Play Live — always present, disabled if no stream */}
          <button
            className={`${styles.playLiveBtn} ${!hasStream ? styles.playLiveDisabled : ''}`}
            onClick={playLive}
            disabled={!hasStream}
            title={!hasStream ? 'No livestream available' : undefined}
          >
            <span className={styles.playIcon}>▶</span> Play Live
          </button>

          {/* External link */}
          {channel.external_url && (
            <a
              className={styles.extLink}
              href={channel.external_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              ↗ {channel.name}
            </a>
          )}
        </div>

        {show ? (
          <>
            <h1 className={styles.showTitle}>{show.title}</h1>
            {show.description && (
              <p className={styles.showDesc}>{show.description}</p>
            )}
          </>
        ) : (
          <h1 className={styles.showTitle}>{channel.name}</h1>
        )}
      </div>

    </div>
  )
}
