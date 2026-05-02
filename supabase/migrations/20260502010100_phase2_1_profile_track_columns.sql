-- Phase 2.1 — Track columns on profiles.
-- All denomination/track/home/consent/onboarding state lives on profiles.

CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS denomination_id uuid REFERENCES public.denominations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS denomination_locked_until timestamptz,
  ADD COLUMN IF NOT EXISTS denomination_change_count int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS home_location geography(Point, 4326),
  ADD COLUMN IF NOT EXISTS home_location_set_at timestamptz,
  ADD COLUMN IF NOT EXISTS consents jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS onboarded_at timestamptz;

-- consents structure (versioned so we can evolve without migration):
--   { "version": 1,
--     "geolocation_checkin": { "granted": bool, "ts": iso },
--     "geolocation_friends": { "granted": bool, "ts": iso },
--     "community_map":       { "granted": bool, "ts": iso } }

CREATE INDEX IF NOT EXISTS profiles_denomination_idx ON public.profiles (denomination_id);
CREATE INDEX IF NOT EXISTS profiles_home_location_gix ON public.profiles USING GIST (home_location);
