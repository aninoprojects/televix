import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Televix — Philippine TV Guide',
  description: 'Schedules, livestreams, and show info for Philippine free and cable TV channels.',
  keywords: ['Philippine TV', 'EPG', 'TV schedule', 'GMA', 'ABS-CBN', 'TV5'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
