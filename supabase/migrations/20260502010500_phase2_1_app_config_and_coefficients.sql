-- Phase 2.1 — Tunables (app_config) + period-snapshotted XP coefficients.

CREATE TABLE IF NOT EXISTS public.app_config (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  description text,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read app_config" ON public.app_config;
CREATE POLICY "Anyone can read app_config"
ON public.app_config FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Only admins can write app_config" ON public.app_config;
CREATE POLICY "Only admins can write app_config"
ON public.app_config FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

INSERT INTO public.app_config (key, value, description) VALUES
  ('checkin.multiplier_cap', '5.0'::jsonb, 'Maximum distance multiplier for check-ins'),
  ('checkin.photo_threshold_multiplier', '3.0'::jsonb, 'Photo proof required when multiplier >= this value'),
  ('checkin.photo_threshold_rare_visits', '100'::jsonb, 'Photo proof required when location has < this many total check-ins (and verified)'),
  ('checkin.cooldown_hours', '24'::jsonb, 'Per-user same-location cooldown'),
  ('checkin.max_per_hour', '30'::jsonb, 'Per-user check-ins per hour'),
  ('checkin.max_velocity_kmh', '900'::jsonb, 'Velocity above which a new check-in is rejected as physically impossible'),
  ('forum.max_xp_per_day', '50'::jsonb, 'Daily XP cap from forum activity (anti-farm)'),
  ('xp.cross_track_weekly_cap_pct', '30'::jsonb, 'Cap on % of weekly XP that can come from other-track content'),
  ('denomination.cooldown_days_per_change', '[30, 90, 365]'::jsonb, 'Days required before change #1, #2, #3+. After 3 changes admin support is required.'),
  ('denomination.max_self_changes', '3'::jsonb, 'Maximum changes a user can make without admin support')
ON CONFLICT (key) DO NOTHING;

-- ----------------------------------------------------------------------------
-- coefficient_snapshots
-- A coefficient set is "drafted" by admins (writes here, draft = true) and
-- "published" at period start by a cron job that flips the active draft.
-- Published rows are immutable for the duration of their period.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coefficient_snapshots (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_type  text NOT NULL CHECK (period_type IN ('weekly','monthly','all_time')),
  period_start timestamptz NOT NULL,
  coefficients jsonb NOT NULL,
  is_draft     boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  created_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE (period_type, period_start, is_draft)
);

CREATE INDEX IF NOT EXISTS coef_period_idx ON public.coefficient_snapshots (period_type, period_start DESC);

ALTER TABLE public.coefficient_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read coefficient_snapshots" ON public.coefficient_snapshots;
CREATE POLICY "Anyone can read coefficient_snapshots"
ON public.coefficient_snapshots FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Only admins can write coefficient_snapshots" ON public.coefficient_snapshots;
CREATE POLICY "Only admins can write coefficient_snapshots"
ON public.coefficient_snapshots FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Seed a flat-1.0 all_time snapshot so anything that reads coefficients today
-- gets a sane default before admins tune it.
INSERT INTO public.coefficient_snapshots (period_type, period_start, coefficients, is_draft)
VALUES (
  'all_time',
  '1970-01-01T00:00:00Z'::timestamptz,
  jsonb_build_object(
    'common', 1.0,
    'catholic', 1.0,
    'protestant', 1.0,
    'orthodox', 1.0,
    'heritage', 1.0
  ),
  false
)
ON CONFLICT (period_type, period_start, is_draft) DO NOTHING;
