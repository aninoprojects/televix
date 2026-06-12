import { createServerClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ShowForm from '../../ShowForm'
import type { Show, Channel } from '@/types/database'

export const metadata = { title: 'Edit Show — Televix Admin' }

export default async function EditShowPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()

  const [{ data: show }, { data: channels }] = await Promise.all([
    supabase.from('shows').select('*').eq('id', params.id).single(),
    supabase.from('channels').select('*').eq('is_active', true).order('sort_order'),
  ])

  if (!show) notFound()

  return <ShowForm show={show as Show} channels={(channels ?? []) as Channel[]} />
}
