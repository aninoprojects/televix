'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import styles from './login.module.css'

export default function AdminLoginPage() {
  const router  = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleLogin() {
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>televix<span>.</span></div>
        <p className={styles.sub}>Admin access only</p>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.loginBtn}
          onClick={handleLogin}
          disabled={loading || !email || !password}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <a href="/" className={styles.backLink}>← Back to Televix</a>
      </div>
    </div>
  )
}
