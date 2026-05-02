-- Phase 2.1 — locations + check_ins.
-- Per Q9/Q14: check_ins stores (user_id, location_id, distance_km, multiplier, xp...) — never raw user GPS.
-- Per Q12: catalog is admin-curated; user submissions deferred.
-- Per Q10: photo_url required when high-value (enforced by claim-checkin edge fn, threshold in app_config).

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS public.locations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  type          text NOT NULL,
  geom          geography(Point, 4326) NOT NULL,
  denomination_scope text NOT NULL DEFAULT 'common'
    CHECK (denomination_scope IN ('common','catholic','protestant','orthodox','heritage')),
  cross_visible boolean NOT NULL DEFAULT true,
  verified      boolean NOT NULL DEFAULT false,
  check_in_count_total bigint NOT NULL DEFAULT 0,
  base_xp       int NOT NULL DEFAULT 25,
  metadata      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS locations_geom_gix ON public.locations USING GIST (geom);
CREATE INDEX IF NOT EXISTS locations_scope_idx ON public.locations (denomination_scope);
CREATE INDEX IF NOT EXISTS locations_verified_idx ON public.locations (verified);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Locations are public" ON public.locations;
CREATE POLICY "Locations are public"
ON public.locations FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Only admins write locations" ON public.locations;
CREATE POLICY "Only admins write locations"
ON public.locations FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- check_ins
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.check_ins (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id           uuid NOT NULL REFERENCES public.locations(id) ON DELETE RESTRICT,
  distance_km           numeric(10,3) NOT NULL,
  multiplier            numeric(4,2) NOT NULL CHECK (multiplier >= 1.0 AND multiplier <= 5.0),
  base_xp               int NOT NULL,
  raw_xp                int NOT NULL,
  normalized_xp         int NOT NULL,
  photo_url             text,
  validation_status     text NOT NULL DEFAULT 'verified'
    CHECK (validation_status IN ('verified','pending_photo','rejected')),
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS check_ins_user_idx     ON public.check_ins (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS check_ins_location_idx ON public.check_ins (location_id);
-- 24h same-location cooldown is enforced in code; index supports the lookup.
CREATE INDEX IF NOT EXISTS check_ins_user_loc_recent_idx
  ON public.check_ins (user_id, location_id, created_at DESC);

ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner can read full check-in" ON public.check_ins;
CREATE POLICY "Owner can read full check-in"
ON public.check_ins FOR SELECT
USING (auth.uid() = user_id);

-- Public anonymized SELECT exposes only non-PII columns via a view (defined below).
-- Direct INSERT from clients is denied: claim-checkin edge fn writes via service_role.
DROP POLICY IF EXISTS "No direct check_ins insert from clients" ON public.check_ins;
-- (intentionally no INSERT policy — service_role bypasses RLS.)

-- Aggregated leaderboard surface — no GPS, no photo, no distance.
CREATE OR REPLACE VIEW public.check_ins_public AS
SELECT
  user_id,
  location_id,
  normalized_xp,
  created_at
FROM public.check_ins
WHERE validation_status = 'verified';

GRANT SELECT ON public.check_ins_public TO anon, authenticated;
