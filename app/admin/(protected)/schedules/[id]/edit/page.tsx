import { createServerClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ScheduleForm from '../../ScheduleForm'
import type { Schedule, Channel } from '@/types/database'

export const metadata = { title: 'Edit Schedule — Televix Admin' }

export default async function EditSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient()
  const { id } = await params  // add this line
  const [{ data: schedule }, { data: shows }, { data: channels }] = await Promise.all([
    supabase.from('schedules').select('*').eq('id', id).single(),  // params.id → id
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
