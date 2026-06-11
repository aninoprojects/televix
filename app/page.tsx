import { getChannels, getChannelByNumber, getTodaySchedule } from '@/lib/supabase'
import EPGViewer from '@/components/epg/EPGViewer'

export const revalidate = 300 // revalidate every 5 minutes

export default async function HomePage() {
  // Fetch all channels and default to GMA (ch. 7) on load
  const [channels, defaultChannel] = await Promise.all([
    getChannels(),
    getChannelByNumber(7),
  ])

  const initialSchedules = await getTodaySchedule(defaultChannel.id)

  return (
    <EPGViewer
      channels={channels}
      initialChannel={defaultChannel}
      initialSchedules={initialSchedules}
    />
  )
}
