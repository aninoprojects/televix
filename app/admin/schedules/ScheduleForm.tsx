'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Schedule, Show, Channel } from '@/types/database'
import styles from '../../crud.module.css'

interface Props {
  schedule?: Schedule
  shows: (Show & { channel: Pick<Channel, 'number' | 'name'> | null })[]
  channels: Channel[]
}

const ALL_DAYS = [
  { num: 1, label: 'Mon' },
  { num: 2, label: 'Tue' },
  { num: 3, label: 'Wed' },
  { num: 4, label: 'Thu' },
  { num: 5, label: 'Fri' },
  { num: 6, label: 'Sat' },
  { num: 7, label: 'Sun' },
]

export default function ScheduleForm({ schedule, shows, channels }: Props) {
  const router = useRouter()
  const isEdit = !!schedule

  const [showId,    setShowId]    = useState(schedule?.show_id    ?? '')
  const [channelId, setChannelId] = useState(schedule?.channel_id ?? '')
  const [airTime,   setAirTime]   = useState(schedule?.air_time?.slice(0, 5) ?? '')
  const [endTime,   setEndTime]   = useState(schedule?.end_time?.slice(0, 5) ?? '')
  const [days,      setDays]      = useState<number[]>(schedule?.days_of_week ?? [1,2,3,4,5])
  const [notes,     setNotes]     = useState(schedule?.notes      ?? '')
  const [isActive,  setIsActive]  = useState(schedule?.is_active  ?? true)

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function toggleDay(day: number) {
    setDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    )
  }

  function setPreset(preset: 'weekdays' | 'weekends' | 'daily') {
    if (preset === 'weekdays') setDays([1,2,3,4,5])
    if (preset === 'weekends') setDays([6,7])
    if (preset === 'daily')    setDays([1,2,3,4,5,6,7])
  }

  async function handleSave() {
    setError(null)
    setLoading(true)
    const supabase = createClient()

    const payload = {
      show_id:     showId,
      channel_id:  channelId,
      air_time:    airTime,
      end_time:    endTime || null,
      days_of_week: days,
      notes:       notes.trim() || null,
      is_active:   isActive,
    }

    const { error } = isEdit
      ? await supabase.from('schedules').update(payload).eq('id', schedule.id)
      : await supabase.from('schedules').insert(payload)

    setLoading(false)
    if (error) { setError(error.message); return }

    setSuccess(true)
    setTimeout(() => router.push('/admin/schedules'), 800)
  }

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>{isEdit ? 'Edit schedule' : 'Add schedule'}</h1>
        </div>
      </div>

      <div className={styles.formCard}>
        <div className={styles.field}>
          <label className={styles.label}>Channel</label>
          <select className={styles.select} value={channelId}
            onChange={e => setChannelId(e.target.value)}>
            <option value="">— Select a channel —</option>
            {channels.map(ch => (
              <option key={ch.id} value={ch.id}>
                Ch. {ch.number} — {ch.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Show</label>
          <select className={styles.select} value={showId}
            onChange={e => setShowId(e.target.value)}>
            <option value="">— Select a show —</option>
            {shows
              .filter(s => !channelId || s.channel_id === channelId)
              .map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
          </select>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Air time</label>
            <input className={styles.input} type="time" value={airTime}
              onChange={e => setAirTime(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>End time <span className={styles.labelHint}>— optional</span></label>
            <input className={styles.input} type="time" value={endTime}
              onChange={e => setEndTime(e.target.value)} />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Days of week</label>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {(['weekdays', 'weekends', 'daily'] as const).map(p => (
              <button key={p} onClick={() => setPreset(p)}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--rule)',
                  color: 'var(--soft)', borderRadius: '4px', padding: '3px 9px',
                  fontFamily: 'var(--font-head)', fontSize: '11px', cursor: 'pointer'
                }}>
                {p === 'weekdays' ? 'Mon–Fri' : p === 'weekends' ? 'Sat–Sun' : 'Daily'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {ALL_DAYS.map(d => (
              <button key={d.num} onClick={() => toggleDay(d.num)}
                style={{
                  background: days.includes(d.num) ? 'var(--accent)' : 'var(--surface)',
                  border: `1px solid ${days.includes(d.num) ? 'var(--accent)' : 'var(--rule)'}`,
                  color: days.includes(d.num) ? 'white' : 'var(--muted)',
                  borderRadius: '4px', padding: '4px 8px',
                  fontFamily: 'var(--font-head)', fontSize: '11px',
                  fontWeight: '600', cursor: 'pointer',
                  transition: 'all 0.1s',
                }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Notes <span className={styles.labelHint}>— e.g. "Special on Saturdays"</span></label>
          <input className={styles.input} value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Optional note about this timeslot" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Active</label>
          <select className={styles.select} value={isActive ? 'true' : 'false'}
            onChange={e => setIsActive(e.target.value === 'true')}>
            <option value="true">Yes — show in EPG</option>
            <option value="false">No — hidden</option>
          </select>
        </div>

        {error   && <p className={styles.errorMsg}>{error}</p>}
        {success && <p className={styles.successMsg}>Saved! Redirecting…</p>}

        <div className={styles.formActions}>
          <button className={styles.saveBtn} onClick={handleSave}
            disabled={loading || !showId || !channelId || !airTime || days.length === 0}>
            {loading ? 'Saving…' : 'Save schedule'}
          </button>
          <a href="/admin/schedules" className={styles.cancelLink}>Cancel</a>
        </div>
      </div>
    </div>
  )
}
