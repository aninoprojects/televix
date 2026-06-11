// types/database.ts
// These mirror the Supabase schema exactly.
// Keep in sync with supabase/migrations/0001_initial_schema.sql

export type NetworkType = 'free' | 'cable' | 'other'

export interface Channel {
  id: string
  number: number
  name: string
  network: string | null
  type: NetworkType
  banner_url: string | null       // Cloudinary horizontal banner
  youtube_id: string | null       // YT livestream ID
  external_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Show {
  id: string
  channel_id: string
  title: string
  description: string | null
  poster_url: string | null       // Cloudinary show poster
  genre: string | null
  external_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Schedule {
  id: string
  show_id: string
  channel_id: string
  air_time: string                // "HH:MM:SS"
  end_time: string | null
  days_of_week: number[]          // ISO: 1=Mon … 7=Sun
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  created_at: string
}

// ── JOIN TYPES (for queries that join tables) ─────────────────

// What the EPG timeline renders per row
export interface ScheduleWithShow extends Schedule {
  show: Show
}

// What the left panel renders
export interface ChannelWithSchedules extends Channel {
  schedules: ScheduleWithShow[]
}
