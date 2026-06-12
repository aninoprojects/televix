'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Channel, NetworkType } from '@/types/database'
import styles from '../../crud.module.css'

interface Props {
  channel?: Channel  // undefined = new channel
}

export default function ChannelForm({ channel }: Props) {
  const router  = useRouter()
  const isEdit  = !!channel

  const [number,      setNumber]      = useState(channel?.number.toString()      ?? '')
  const [name,        setName]        = useState(channel?.name                   ?? '')
  const [network,     setNetwork]     = useState(channel?.network                ?? '')
  const [type,        setType]        = useState<NetworkType>(channel?.type      ?? 'free')
  const [youtubeId,   setYoutubeId]   = useState(channel?.youtube_id             ?? '')
  const [bannerUrl,   setBannerUrl]   = useState(channel?.banner_url             ?? '')
  const [externalUrl, setExternalUrl] = useState(channel?.external_url           ?? '')
  const [sortOrder,   setSortOrder]   = useState(channel?.sort_order.toString()  ?? '0')
  const [isActive,    setIsActive]    = useState(channel?.is_active              ?? true)

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSave() {
    setError(null)
    setLoading(true)
    const supabase = createClient()

    const payload = {
      number:       parseInt(number),
      name:         name.trim(),
      network:      network.trim() || null,
      type,
      youtube_id:   youtubeId.trim()   || null,
      banner_url:   bannerUrl.trim()   || null,
      external_url: externalUrl.trim() || null,
      sort_order:   parseInt(sortOrder) || 0,
      is_active:    isActive,
    }

    const { error } = isEdit
      ? await supabase.from('channels').update(payload).eq('id', channel.id)
      : await supabase.from('channels').insert(payload)

    setLoading(false)
    if (error) { setError(error.message); return }

    setSuccess(true)
    setTimeout(() => router.push('/admin/channels'), 800)
  }

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>{isEdit ? 'Edit channel' : 'Add channel'}</h1>
          {isEdit && <p className={styles.pageSub}>Ch. {channel.number} — {channel.name}</p>}
        </div>
      </div>

      <div className={styles.formCard}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Channel number</label>
            <input className={styles.input} type="number" value={number}
              onChange={e => setNumber(e.target.value)} placeholder="7" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Type</label>
            <select className={styles.select} value={type}
              onChange={e => setType(e.target.value as NetworkType)}>
              <option value="free">Free TV</option>
              <option value="cable">Cable / Digital</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Channel name</label>
          <input className={styles.input} value={name}
            onChange={e => setName(e.target.value)} placeholder="GMA Network" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Network / operator</label>
          <input className={styles.input} value={network}
            onChange={e => setNetwork(e.target.value)} placeholder="GMA Network Inc." />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            YouTube stream ID
            <span className={styles.labelHint}>— the part after youtube.com/watch?v=</span>
          </label>
          <input className={styles.input} value={youtubeId}
            onChange={e => setYoutubeId(e.target.value)} placeholder="5EmP4_7Epa4" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Banner URL
            <span className={styles.labelHint}>— Cloudinary URL for the horizontal banner</span>
          </label>
          <input className={styles.input} value={bannerUrl}
            onChange={e => setBannerUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/..." />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Official website URL</label>
          <input className={styles.input} value={externalUrl}
            onChange={e => setExternalUrl(e.target.value)} placeholder="https://gmanetwork.com" />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Sort order</label>
            <input className={styles.input} type="number" value={sortOrder}
              onChange={e => setSortOrder(e.target.value)} placeholder="0" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Active</label>
            <select className={styles.select} value={isActive ? 'true' : 'false'}
              onChange={e => setIsActive(e.target.value === 'true')}>
              <option value="true">Yes — show in picker</option>
              <option value="false">No — hidden</option>
            </select>
          </div>
        </div>

        {error   && <p className={styles.errorMsg}>{error}</p>}
        {success && <p className={styles.successMsg}>Saved! Redirecting…</p>}

        <div className={styles.formActions}>
          <button className={styles.saveBtn} onClick={handleSave}
            disabled={loading || !name || !number}>
            {loading ? 'Saving…' : 'Save channel'}
          </button>
          <a href="/admin/channels" className={styles.cancelLink}>Cancel</a>
        </div>
      </div>
    </div>
  )
}
