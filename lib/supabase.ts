// lib/supabase.ts
// Two clients:
//   createClient()       — browser/client components (uses anon key)
//   createServerClient() — server components & route handlers (uses cookies)

import { createBrowserClient, createServerClient as createSSRClient } from '@supabase/ssr'
import type { Channel, Show, Schedule, ScheduleWithShow } from '@/types/database'

// ── Browser client (use in Client Components) ─────────────────
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ── Server client (use in Server Components & API routes) ─────
export async function createServerClient() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
		getAll() { return cookieStore.getAll() },
		setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
			try {
				cookiesToSet.forEach(({ name, value, options }) =>
					cookieStore.set(name, value, options)
			)
          } catch {
            // called from Server Component — safe to ignore
          }
        },
      },
    }
  )
}

// ── DATA HELPERS ──────────────────────────────────────────────

// All active channels ordered for the picker
export async function getChannels() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('is_active', true)
    .order('type')
    .order('sort_order')
  if (error) throw error
  return data as Channel[]
}

// Single channel by number (e.g. 7 for GMA)
export async function getChannelByNumber(number: number) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('number', number)
    .eq('is_active', true)
    .single()
  if (error) throw error
  return data as Channel
}

// Today's schedule for a channel
// Filters by current ISO day of week (1=Mon … 7=Sun)
export async function getTodaySchedule(channelId: string): Promise<ScheduleWithShow[]> {
  const supabase = await createServerClient()
  const today = new Date().getDay()
  // JS getDay(): 0=Sun,1=Mon…6=Sat → convert to ISO: Sun→7, rest as-is
  const isoDay = today === 0 ? 7 : today

  const { data, error } = await supabase
    .from('schedules')
    .select(`
      *,
      show:shows (
        id, title, description, poster_url, genre, external_url
      )
    `)
    .eq('channel_id', channelId)
    .eq('is_active', true)
    .contains('days_of_week', [isoDay])
    .order('air_time')

  if (error) throw error
  return data as ScheduleWithShow[]
}
