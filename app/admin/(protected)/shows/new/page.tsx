import { createServerClient } from '@/lib/supabase'
import ShowForm from '../ShowForm'
import type { Channel } from '@/types/database'

export const metadata = { title: 'Add Show — Televix Admin' }

export default async function NewShowPage() {
  const supabase = await createServerClient()
  const { data: channels } = await supabase
    .from('channels').select('*').eq('is_active', true).order('sort_order')

  return <ShowForm channels={(channels ?? []) as Channel[]} />
}
