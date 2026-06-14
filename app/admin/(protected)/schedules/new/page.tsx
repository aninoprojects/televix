import { createServerClient } from '@/lib/supabase'
import ScheduleForm from '../ScheduleForm'
import type { Channel, Show } from '@/types/database'

export const metadata = { title: 'Add Schedule — Televix Admin' }

export default async function NewSchedulePage() {
  const supabase = await createServerClient()
  const [{ data: shows }, { data: channels }] = await Promise.all([
    supabase.from('shows').select('*, channel:channels(number, name)').eq('is_active', true).order('title'),
    supabase.from('channels').select('*').eq('is_active', true).order('sort_order'),
  ])

  return (
    <ScheduleForm
      shows={(shows ?? []) as any}
      channels={(channels ?? []) as Channel[]}
    />
  )
}
