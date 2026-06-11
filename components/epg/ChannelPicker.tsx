'use client'

import { useState } from 'react'
import type { Channel, NetworkType } from '@/types/database'
import styles from './ChannelPicker.module.css'

interface Props {
  channels: Channel[]
  currentChannel: Channel
  onSelect: (channel: Channel) => void
}

const FILTER_LABELS: Record<NetworkType, string> = {
  free:  'Free TV',
  cable: 'Cable / Digital',
  other: 'Others',
}

export default function ChannelPicker({ channels, currentChannel, onSelect }: Props) {
  const [open, setOpen]           = useState(false)
  const [filter, setFilter]       = useState<NetworkType>('free')
  const [pending, setPending]     = useState<Channel>(currentChannel)

  const filtered = channels.filter(c => c.type === filter)

  function confirm() {
    onSelect(pending)
    setOpen(false)
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) setOpen(false)
  }

  return (
    <>
      {/* Trigger button in header */}
      <button className={styles.triggerBtn} onClick={() => { setPending(currentChannel); setOpen(true) }}>
        <span className={styles.numBadge}>{currentChannel.number}</span>
        <span className={styles.name}>{currentChannel.name}</span>
        <span className={styles.arrow}>▼</span>
      </button>

      {/* Modal */}
      {open && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={styles.modal}>

            <div className={styles.modalTop}>
              <div className={styles.titleRow}>
                <span className={styles.modalTitle}>Pick a Channel</span>
                <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
              </div>
              <div className={styles.filterTabs}>
                {(Object.keys(FILTER_LABELS) as NetworkType[]).map(key => (
                  <button
                    key={key}
                    className={`${styles.filterTab} ${filter === key ? styles.activeTab : ''}`}
                    onClick={() => setFilter(key)}
                  >
                    {FILTER_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.grid}>
                {filtered.length === 0 && (
                  <p className={styles.empty}>No channels in this category yet.</p>
                )}
                {filtered.map(ch => (
                  <button
                    key={ch.id}
                    className={`${styles.chCard} ${pending.id === ch.id ? styles.selected : ''}`}
                    onClick={() => setPending(ch)}
                  >
                    <span className={`${styles.chNum} ${pending.id === ch.id ? styles.chNumSelected : ''}`}>
                      {ch.number}
                    </span>
                    <span className={styles.chInfo}>
                      <span className={styles.chName}>{ch.name}</span>
                      <span className={styles.chNetwork}>{ch.network}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setOpen(false)}>Cancel</button>
              <button className={styles.confirmBtn} onClick={confirm}>Watch this channel</button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
