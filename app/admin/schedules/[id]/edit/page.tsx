import { createServerClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ScheduleForm from '../../ScheduleForm'
import type { Schedule, Channel } from '@/types/database'

export const metadata = { title: 'Edit Schedule — Televix Admin' }

export default async function EditSchedulePage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()
  const [{ data: schedule }, { data: shows }, { data: channels }] = await Promise.all([
    supabase.from('schedules').select('*').eq('id', params.id).single(),
    supabase.from('shows').select('*, channel:channels(number, name)').eq('is_active', true).order('title'),
    supabase.from('channels').select('*').eq('is_active', true).order('sort_order'),
  ])

  if (!schedule) notFound()

  return (
    <ScheduleForm
      schedule={schedule as Schedule}
      shows={(shows ?? []) as any}
      channels={(channels ?? []) as Channel[]}
    />
  )
}
