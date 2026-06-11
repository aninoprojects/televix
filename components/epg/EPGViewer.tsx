'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import ChannelPicker from './ChannelPicker'
import ShowPanel from './ShowPanel'
import Timeline from './Timeline'
import type { Channel, ScheduleWithShow } from '@/types/database'
import styles from './EPGViewer.module.css'

interface Props {
  channels: Channel[]
  initialChannel: Channel
  initialSchedules: ScheduleWithShow[]
}

export default function EPGViewer({ channels, initialChannel, initialSchedules }: Props) {
  const supabase = createClient()

  const [currentChannel, setCurrentChannel] = useState<Channel>(initialChannel)
  const [schedules, setSchedules]           = useState<ScheduleWithShow[]>(initialSchedules)
  const [activeSchedule, setActiveSchedule] = useState<ScheduleWithShow | null>(
    initialSchedules.find(s => {
      // auto-select currently airing show on load
      const now = new Date()
      const [h, m] = s.air_time.split(':').map(Number)
      const airMin = h * 60 + m
      const nowMin = now.getHours() * 60 + now.getMinutes()
      return nowMin >= airMin && nowMin < airMin + 90
    }) ?? initialSchedules[0] ?? null
  )
  const [loading, setLoading] = useState(false)

  async function handleChannelChange(channel: Channel) {
    setCurrentChannel(channel)
    setLoading(true)

    const today = new Date().getDay()
    const isoDay = today === 0 ? 7 : today

    const { data, error } = await supabase
      .from('schedules')
      .select(`*, show:shows(id, title, description, poster_url, genre, external_url)`)
      .eq('channel_id', channel.id)
      .eq('is_active', true)
      .contains('days_of_week', [isoDay])
      .order('air_time')

    setLoading(false)

    if (error) { console.error(error); return }

    const newSchedules = (data as ScheduleWithShow[]) ?? []
    setSchedules(newSchedules)
    setActiveSchedule(newSchedules[0] ?? null)
  }

  const today = new Date().toLocaleDateString('en-PH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className={styles.root}>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.siteName}>
          televix<span className={styles.dot}>.</span>
        </div>

        <ChannelPicker
          channels={channels}
          currentChannel={currentChannel}
          onSelect={handleChannelChange}
        />

        <div className={styles.headerRight}>
          <a href="/about" className={styles.aboutLink}>About</a>
        </div>
      </header>

      {/* Subheader */}
      <div className={styles.subheader}>
        <span className={styles.dateLabel}>{today}</span>
        <div className={styles.liveBadge}>
          <span className={styles.liveDot} />
          Live
        </div>
        <span className={styles.scheduleLabel}>Schedule</span>
      </div>

      {/* Main content */}
      <main className={styles.main}>
        <ShowPanel
          channel={currentChannel}
          schedule={activeSchedule}
        />

        {loading ? (
          <div className={styles.timelineLoading}>
            <span>Loading schedule…</span>
          </div>
        ) : (
          <Timeline
            channel={currentChannel}
            schedules={schedules}
            activeId={activeSchedule?.id ?? null}
            onSelect={setActiveSchedule}
          />
        )}
      </main>

    </div>
  )
}
