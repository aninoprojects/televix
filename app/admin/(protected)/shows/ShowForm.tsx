'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Show, Channel } from '@/types/database'
import styles from '../crud.module.css'

interface Props {
  show?: Show
  channels: Channel[]
}

export default function ShowForm({ show, channels }: Props) {
  const router = useRouter()
  const isEdit = !!show

  const [channelId,   setChannelId]   = useState(show?.channel_id   ?? '')
  const [title,       setTitle]       = useState(show?.title         ?? '')
  const [description, setDescription] = useState(show?.description   ?? '')
  const [posterUrl,   setPosterUrl]   = useState(show?.poster_url    ?? '')
  const [genre,       setGenre]       = useState(show?.genre         ?? '')
  const [externalUrl, setExternalUrl] = useState(show?.external_url  ?? '')
  const [isActive,    setIsActive]    = useState(show?.is_active     ?? true)

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSave() {
    setError(null)
    setLoading(true)
    const supabase = createClient()

    const payload = {
      channel_id:   channelId,
      title:        title.trim(),
      description:  description.trim() || null,
      poster_url:   posterUrl.trim()   || null,
      genre:        genre.trim()       || null,
      external_url: externalUrl.trim() || null,
      is_active:    isActive,
    }

    const { error } = isEdit
      ? await supabase.from('shows').update(payload).eq('id', show.id)
      : await supabase.from('shows').insert(payload)

    setLoading(false)
    if (error) { setError(error.message); return }

    setSuccess(true)
    setTimeout(() => router.push('/admin/shows'), 800)
  }

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>{isEdit ? 'Edit show' : 'Add show'}</h1>
          {isEdit && <p className={styles.pageSub}>{show.title}</p>}
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
          <label className={styles.label}>Title</label>
          <input className={styles.input} value={title}
            onChange={e => setTitle(e.target.value)} placeholder="24 Oras" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief description of the show…" />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Genre</label>
            <input className={styles.input} value={genre}
              onChange={e => setGenre(e.target.value)} placeholder="News, Drama, Variety…" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Active</label>
            <select className={styles.select} value={isActive ? 'true' : 'false'}
              onChange={e => setIsActive(e.target.value === 'true')}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Poster URL
            <span className={styles.labelHint}>— Cloudinary URL</span>
          </label>
          <input className={styles.input} value={posterUrl}
            onChange={e => setPosterUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/..." />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Show page URL <span className={styles.labelHint}>— optional</span></label>
          <input className={styles.input} value={externalUrl}
            onChange={e => setExternalUrl(e.target.value)}
            placeholder="https://gmanetwork.com/..." />
        </div>

        {error   && <p className={styles.errorMsg}>{error}</p>}
        {success && <p className={styles.successMsg}>Saved! Redirecting…</p>}

        <div className={styles.formActions}>
          <button className={styles.saveBtn} onClick={handleSave}
            disabled={loading || !title || !channelId}>
            {loading ? 'Saving…' : 'Save show'}
          </button>
          <a href="/admin/shows" className={styles.cancelLink}>Cancel</a>
        </div>
      </div>
    </div>
  )
}
