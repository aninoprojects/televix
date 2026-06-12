import { createServerClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ChannelForm from '../../ChannelForm'
import type { Channel } from '@/types/database'

export const metadata = { title: 'Edit Channel — Televix Admin' }

export default async function EditChannelPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) notFound()

  return <ChannelForm channel={data as Channel} />
}
