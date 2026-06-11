-- ============================================================
--  TELEVIX — Supabase PostgreSQL Schema
--  Run this in: Supabase Dashboard > SQL Editor
--  Or save as: supabase/migrations/0001_initial_schema.sql
-- ============================================================


-- ── EXTENSIONS ───────────────────────────────────────────────
-- (uuid-ossp is enabled by default in Supabase, but just in case)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ── ENUM: network type ────────────────────────────────────────
-- Used for channel picker filter tabs
CREATE TYPE network_type AS ENUM ('free', 'cable', 'other');


-- ── TABLE: channels ───────────────────────────────────────────
CREATE TABLE channels (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  number          SMALLINT    NOT NULL UNIQUE,          -- e.g. 7
  name            TEXT        NOT NULL,                 -- e.g. "GMA Network"
  network         TEXT,                                 -- e.g. "GMA Network Inc."
  type            network_type NOT NULL DEFAULT 'free',
  banner_url      TEXT,                                 -- Cloudinary URL (horizontal banner)
  youtube_id      TEXT,                                 -- YT livestream video/stream ID
  external_url    TEXT,                                 -- official website
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order      SMALLINT    NOT NULL DEFAULT 0,       -- for display ordering
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for ordering channels in the picker
CREATE INDEX idx_channels_type_sort ON channels(type, sort_order);


-- ── TABLE: shows ──────────────────────────────────────────────
CREATE TABLE shows (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id      UUID        NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  title           TEXT        NOT NULL,
  description     TEXT,
  poster_url      TEXT,                                 -- Cloudinary URL (show poster/thumbnail)
  genre           TEXT,                                 -- e.g. "News", "Drama", "Variety"
  external_url    TEXT,                                 -- show-specific page (optional)
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index: look up all shows for a channel quickly
CREATE INDEX idx_shows_channel ON shows(channel_id);


-- ── TABLE: schedules ──────────────────────────────────────────
-- One row = one timeslot on a recurring weekly schedule.
-- days_of_week uses ISO weekday numbers: 1=Mon … 7=Sun
-- e.g. Mon–Fri → '{1,2,3,4,5}', weekends → '{6,7}', daily → '{1,2,3,4,5,6,7}'
CREATE TABLE schedules (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id         UUID        NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  channel_id      UUID        NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  air_time        TIME        NOT NULL,                 -- e.g. 18:30:00
  end_time        TIME,                                 -- nullable — PH TV is flexible
  days_of_week    SMALLINT[]  NOT NULL,                 -- e.g. '{1,2,3,4,5}'
  notes           TEXT,                                 -- e.g. "Special episode Saturdays"
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes: look up today's schedule for a channel fast
CREATE INDEX idx_schedules_channel    ON schedules(channel_id);
CREATE INDEX idx_schedules_show       ON schedules(show_id);
CREATE INDEX idx_schedules_air_time   ON schedules(air_time);


-- ── TABLE: admin_users ────────────────────────────────────────
-- Links Supabase Auth UIDs to admin role.
-- Only rows here get write access via RLS.
CREATE TABLE admin_users (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ── UPDATED_AT TRIGGER ────────────────────────────────────────
-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_channels_updated_at
  BEFORE UPDATE ON channels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_shows_updated_at
  BEFORE UPDATE ON shows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── ROW LEVEL SECURITY ────────────────────────────────────────

-- Enable RLS on all public tables
ALTER TABLE channels    ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows       ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules   ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ── channels: public read, admin write ──
CREATE POLICY "channels: public read"
  ON channels FOR SELECT
  USING (TRUE);

CREATE POLICY "channels: admin insert"
  ON channels FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "channels: admin update"
  ON channels FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "channels: admin delete"
  ON channels FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ── shows: public read, admin write ──
CREATE POLICY "shows: public read"
  ON shows FOR SELECT
  USING (TRUE);

CREATE POLICY "shows: admin insert"
  ON shows FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "shows: admin update"
  ON shows FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "shows: admin delete"
  ON shows FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ── schedules: public read, admin write ──
CREATE POLICY "schedules: public read"
  ON schedules FOR SELECT
  USING (TRUE);

CREATE POLICY "schedules: admin insert"
  ON schedules FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "schedules: admin update"
  ON schedules FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "schedules: admin delete"
  ON schedules FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- ── admin_users: only readable/writable by yourself or service role ──
CREATE POLICY "admin_users: self read"
  ON admin_users FOR SELECT
  USING (id = auth.uid());


-- ── SEED: initial channels ────────────────────────────────────
-- Run this after the schema to populate the channel list.
-- banner_url and youtube_id are left NULL — fill via admin panel.

INSERT INTO channels (number, name, network, type, sort_order) VALUES
  (2,  'A2Z / Kapamilya',   'ABS-CBN',              'free',  1),
  (5,  'TV5',               'MediaQuest Holdings',  'free',  2),
  (7,  'GMA Network',       'GMA Network Inc.',     'free',  3),
  (9,  'IBC 13',            'Intercontinental',     'free',  4),
  (11, 'PTV',               'People''s Television', 'free',  5),
  (23, 'ALLTV',             'AMBS / ABS-CBN',       'free',  6),
  (30, 'Net 25',            'Eagle Broadcasting',   'free',  7),
  (43, 'Light TV',          'CBN Asia',             'free',  8),
  (53, 'CNN Philippines',   'Nine Media',           'cable', 1),
  (56, 'One News',          'TV5 / MediaQuest',     'cable', 2),
  (60, 'GTV',               'GMA Network Inc.',     'cable', 3),
  (63, 'Kapamilya Channel', 'ABS-CBN',              'cable', 4),
  (21, 'INCTV',             'Iglesia ni Cristo',    'other', 1),
  (37, 'TV Maria',          'Radio Veritas',        'other', 2),
  (55, 'Aliw Channel',      'Aliw Broadcasting',    'other', 3);


-- ============================================================
--  USEFUL QUERIES (for reference — don't run as migration)
-- ============================================================

-- Get today's full schedule for a channel (e.g. GMA, number 7):
--
-- SELECT
--   s.air_time,
--   s.end_time,
--   s.days_of_week,
--   sh.title,
--   sh.description,
--   sh.poster_url,
--   sh.genre
-- FROM schedules s
-- JOIN shows sh ON sh.id = s.show_id
-- JOIN channels c ON c.id = s.channel_id
-- WHERE c.number = 7
--   AND EXTRACT(ISODOW FROM NOW()) = ANY(s.days_of_week)
--   AND s.is_active = TRUE
-- ORDER BY s.air_time;
