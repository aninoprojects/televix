import styles from './about.module.css'

export const metadata = {
  title: 'About — Televix',
  description: 'About Televix, the Philippine TV electronic program guide.',
}

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <a href="/" className={styles.back}>← Back to Televix</a>

        <div className={styles.logo}>televix<span>.</span></div>

        <p className={styles.tagline}>
          Philippine TV schedules, all in one place.
        </p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>What is this?</h2>
          <p className={styles.body}>
            Televix is an open electronic program guide (EPG) for Philippine television —
            free TV, cable, and digital channels. It tracks daily schedules so you always
            know what's on and when, without digging through Facebook posts or network websites.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Coverage</h2>
          <div className={styles.channelGrid}>
            {[
              { num: '2',  name: 'A2Z / Kapamilya' },
              { num: '5',  name: 'TV5' },
              { num: '7',  name: 'GMA Network' },
              { num: '9',  name: 'IBC 13' },
              { num: '11', name: 'PTV' },
              { num: '23', name: 'ALLTV' },
              { num: '30', name: 'Net 25' },
              { num: '43', name: 'Light TV' },
            ].map(ch => (
              <div key={ch.num} className={styles.channelTag}>
                <span className={styles.chNum}>{ch.num}</span>
                <span className={styles.chName}>{ch.name}</span>
              </div>
            ))}
          </div>
          <p className={styles.bodySmall}>Cable and digital channels also covered. More being added.</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Data sources</h2>
          <p className={styles.body}>
            Schedule data is sourced from Philippine TV community wikis and official network
            websites, then maintained manually through the Televix admin panel.
            Accuracy depends on how promptly changes are updated — if you spot something
            wrong, feel free to reach out.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tech stack</h2>
          <div className={styles.stackRow}>
            {['Next.js', 'Supabase', 'Vercel', 'Cloudinary'].map(s => (
              <span key={s} className={styles.stackTag}>{s}</span>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        <p className={styles.footer}>
          Televix is an independent project. Not affiliated with any Philippine TV network.
        </p>

      </div>
    </div>
  )
}
