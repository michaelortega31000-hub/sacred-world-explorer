-- Phase 2.0 — Bleed-stoppers
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.guard_user_progress_gamification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;
  IF NEW.total_points IS DISTINCT FROM OLD.total_points THEN
    RAISE EXCEPTION 'user_progress.total_points is server-controlled' USING ERRCODE = '42501';
  END IF;
  IF NEW.badges IS DISTINCT FROM OLD.badges THEN
    RAISE EXCEPTION 'user_progress.badges is server-controlled' USING ERRCODE = '42501';
  END IF;
  IF NEW.current_streak IS DISTINCT FROM OLD.current_streak THEN
    RAISE EXCEPTION 'user_progress.current_streak is server-controlled' USING ERRCODE = '42501';
  END IF;
  IF NEW.longest_streak IS DISTINCT FROM OLD.longest_streak THEN
    RAISE EXCEPTION 'user_progress.longest_streak is server-controlled' USING ERRCODE = '42501';
  END IF;
  IF NEW.last_quest_date IS DISTINCT FROM OLD.last_quest_date THEN
    RAISE EXCEPTION 'user_progress.last_quest_date is server-controlled' USING ERRCODE = '42501';
  END IF;
  IF NEW.visited_places IS DISTINCT FROM OLD.visited_places THEN
    RAISE EXCEPTION 'user_progress.visited_places is server-controlled' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_user_progress_gamification_trg ON public.user_progress;
CREATE TRIGGER guard_user_progress_gamification_trg
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.guard_user_progress_gamification();

CREATE OR REPLACE FUNCTION public.guard_user_progress_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;
  NEW.total_points := 0;
  NEW.badges := '{}';
  NEW.current_streak := 0;
  NEW.longest_streak := 0;
  NEW.last_quest_date := NULL;
  NEW.visited_places := '{}';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_user_progress_insert_trg ON public.user_progress;
CREATE TRIGGER guard_user_progress_insert_trg
BEFORE INSERT ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.guard_user_progress_insert();

-- Phase 2.1 — Denominations master table
CREATE TABLE IF NOT EXISTS public.denominations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text NOT NULL UNIQUE,
  parent_id     uuid REFERENCES public.denominations(id) ON DELETE SET NULL,
  label_fr      text NOT NULL,
  label_en      text NOT NULL,
  description_fr text,
  description_en text,
  display_order int NOT NULL DEFAULT 0,
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.denominations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Denominations are public" ON public.denominations;
CREATE POLICY "Denominations are public"
ON public.denominations FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Only admins can write denominations" ON public.denominations;
CREATE POLICY "Only admins can write denominations"
ON public.denominations FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

INSERT INTO public.denominations (code, label_fr, label_en, description_fr, description_en, display_order)
VALUES
  ('catholic',   'Catholique',  'Catholic',   'Tradition catholique : sacrements, saints, liturgie romaine, magistère.', 'Catholic tradition: sacraments, saints, Roman liturgy, Magisterium.', 1),
  ('protestant', 'Protestant',  'Protestant', 'Familles protestantes et évangéliques : sola scriptura, prédication, communautés locales.', 'Protestant and evangelical families: sola scriptura, preaching, local communities.', 2),
  ('orthodox',   'Orthodoxe',   'Orthodox',   'Traditions orthodoxes orientales : Pères de l''Église, divine liturgie, icônes.', 'Eastern Orthodox traditions: Church Fathers, Divine Liturgy, icons.', 3),
  ('heritage',   'Curieux & Patrimoine', 'Curious & Heritage', 'Pour les non-croyants intéressés par l''histoire, l''art et le patrimoine chrétiens.', 'For non-believers interested in Christian history, art, and heritage.', 4)
ON CONFLICT (code) DO NOTHING;

-- Phase 2.1 — Track columns on profiles
CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS denomination_id uuid REFERENCES public.denominations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS denomination_locked_until timestamptz,
  ADD COLUMN IF NOT EXISTS denomination_change_count int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS home_location geography(Point, 4326),
  ADD COLUMN IF NOT EXISTS home_location_set_at timestamptz,
  ADD COLUMN IF NOT EXISTS consents jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS onboarded_at timestamptz;

CREATE INDEX IF NOT EXISTS profiles_denomination_idx ON public.profiles (denomination_id);
CREATE INDEX IF NOT EXISTS profiles_home_location_gix ON public.profiles USING GIST (home_location);

-- Phase 2.1 — denomination_change_history
CREATE TABLE IF NOT EXISTS public.denomination_change_history (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_denomination_id uuid REFERENCES public.denominations(id) ON DELETE SET NULL,
  to_denomination_id   uuid NOT NULL REFERENCES public.denominations(id) ON DELETE RESTRICT,
  reason_category text,
  reason_text     text,
  reset_progress  boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.denomination_change_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own change history" ON public.denomination_change_history;
CREATE POLICY "Users can view their own change history"
ON public.denomination_change_history FOR SELECT
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS dch_user_idx ON public.denomination_change_history (user_id, created_at DESC);

-- Phase 2.1 — locations + check_ins
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
CREATE INDEX IF NOT EXISTS check_ins_user_loc_recent_idx
  ON public.check_ins (user_id, location_id, created_at DESC);

ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner can read full check-in" ON public.check_ins;
CREATE POLICY "Owner can read full check-in"
ON public.check_ins FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "No direct check_ins insert from clients" ON public.check_ins;

CREATE OR REPLACE VIEW public.check_ins_public AS
SELECT
  user_id,
  location_id,
  normalized_xp,
  created_at
FROM public.check_ins
WHERE validation_status = 'verified';

GRANT SELECT ON public.check_ins_public TO anon, authenticated;

-- Phase 2.1 — Tag content tables
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY['places','default_avatars','level_rewards','user_badges'])
  LOOP
    EXECUTE format(
      'ALTER TABLE public.%I
         ADD COLUMN IF NOT EXISTS track_scope text NOT NULL DEFAULT ''common''
           CHECK (track_scope IN (''common'',''catholic'',''protestant'',''orthodox'',''heritage'')),
         ADD COLUMN IF NOT EXISTS cross_visible boolean NOT NULL DEFAULT true', t);
    EXECUTE format(
      'CREATE INDEX IF NOT EXISTS %I ON public.%I (track_scope)',
      t || '_track_scope_idx', t);
  END LOOP;
END
$$;

ALTER TABLE public.forum_topics
  ADD COLUMN IF NOT EXISTS track_scope text NOT NULL DEFAULT 'common'
    CHECK (track_scope IN ('common','catholic','protestant','orthodox','heritage')),
  ADD COLUMN IF NOT EXISTS cross_visible boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_community boolean NOT NULL DEFAULT false;

UPDATE public.forum_topics
SET track_scope = CASE
  WHEN religion = 'catholique' THEN 'catholic'
  WHEN religion = 'protestant' THEN 'protestant'
  ELSE 'common'
END,
is_community = (religion IN ('catholique','protestant'))
WHERE track_scope = 'common' AND religion IS NOT NULL;

CREATE INDEX IF NOT EXISTS forum_topics_track_scope_idx ON public.forum_topics (track_scope);
CREATE INDEX IF NOT EXISTS forum_topics_is_community_idx ON public.forum_topics (is_community);

DROP POLICY IF EXISTS "Users can view denomination forum topics" ON public.forum_topics;

-- Phase 2.1 — app_config + coefficient_snapshots
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

-- Phase 2.1 — change_denomination()
CREATE OR REPLACE FUNCTION public.change_denomination(
  p_to_code        text,
  p_reason_category text,
  p_reason_text    text,
  p_reset_progress boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id           uuid := auth.uid();
  v_to_id             uuid;
  v_from_id           uuid;
  v_locked_until      timestamptz;
  v_change_count      int;
  v_cooldown_days     int;
  v_max_changes       int;
  v_cooldown_array    jsonb;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '42501';
  END IF;

  SELECT id INTO v_to_id FROM public.denominations WHERE code = p_to_code AND active = true;
  IF v_to_id IS NULL THEN
    RAISE EXCEPTION 'Unknown denomination: %', p_to_code USING ERRCODE = '22023';
  END IF;

  SELECT denomination_id, denomination_locked_until, denomination_change_count
    INTO v_from_id, v_locked_until, v_change_count
  FROM public.profiles WHERE id = v_user_id;

  IF v_from_id = v_to_id THEN
    RAISE EXCEPTION 'Already in this denomination' USING ERRCODE = '22023';
  END IF;

  IF v_locked_until IS NOT NULL AND v_locked_until > now() THEN
    RAISE EXCEPTION 'Cooldown active until %', v_locked_until USING ERRCODE = '42501';
  END IF;

  SELECT (value)::int INTO v_max_changes FROM public.app_config WHERE key = 'denomination.max_self_changes';
  v_max_changes := COALESCE(v_max_changes, 3);

  IF v_change_count >= v_max_changes THEN
    RAISE EXCEPTION 'Max self-service changes reached (%); contact support', v_max_changes USING ERRCODE = '42501';
  END IF;

  SELECT value INTO v_cooldown_array FROM public.app_config WHERE key = 'denomination.cooldown_days_per_change';
  v_cooldown_array := COALESCE(v_cooldown_array, '[30, 90, 365]'::jsonb);

  v_cooldown_days := COALESCE(
    (v_cooldown_array -> LEAST(v_change_count, jsonb_array_length(v_cooldown_array) - 1))::text::int,
    365
  );

  UPDATE public.profiles SET
    denomination_id = v_to_id,
    denomination_change_count = COALESCE(v_change_count, 0) + 1,
    denomination_locked_until = now() + make_interval(days => v_cooldown_days)
  WHERE id = v_user_id;

  INSERT INTO public.denomination_change_history
    (user_id, from_denomination_id, to_denomination_id, reason_category, reason_text, reset_progress)
  VALUES
    (v_user_id, v_from_id, v_to_id, p_reason_category, p_reason_text, p_reset_progress);

  IF p_reset_progress THEN
    UPDATE public.user_progress SET
      total_points = 0,
      badges = '{}',
      current_streak = 0,
      longest_streak = 0,
      last_quest_date = NULL,
      visited_places = '{}'
    WHERE user_id = v_user_id;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'denomination_id', v_to_id,
    'locked_until', now() + make_interval(days => v_cooldown_days),
    'change_count', COALESCE(v_change_count, 0) + 1
  );
END;
$$;

REVOKE ALL ON FUNCTION public.change_denomination(text, text, text, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.change_denomination(text, text, text, boolean) TO authenticated;

-- Phase 2.2 — Backfill
UPDATE public.profiles p
SET denomination_id = d.id
FROM public.user_progress up
JOIN public.denominations d ON d.code = CASE up.denomination
  WHEN 'catholique' THEN 'catholic'
  WHEN 'protestant' THEN 'protestant'
  WHEN 'curieux'    THEN 'heritage'
  ELSE NULL
END
WHERE p.id = up.user_id
  AND p.denomination_id IS NULL
  AND up.denomination IS NOT NULL;

UPDATE public.profiles
SET denomination_locked_until = now() + interval '365 days',
    onboarded_at = COALESCE(onboarded_at, created_at)
WHERE denomination_id IS NOT NULL AND denomination_locked_until IS NULL;

-- Phase 2.4 — erase_my_location_history
CREATE OR REPLACE FUNCTION public.erase_my_location_history()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id   uuid := auth.uid();
  v_loc_count int;
  v_chk_count int;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.location_history WHERE user_id = v_user_id;
  GET DIAGNOSTICS v_loc_count = ROW_COUNT;

  DELETE FROM public.check_ins WHERE user_id = v_user_id;
  GET DIAGNOSTICS v_chk_count = ROW_COUNT;

  UPDATE public.profiles SET
    home_location = NULL,
    home_location_set_at = NULL
  WHERE id = v_user_id;

  INSERT INTO public.security_logs (user_id, event_type, severity, action, endpoint, status_code, details)
  VALUES (
    v_user_id,
    'erase_location_history',
    'low',
    'allowed',
    'rpc:erase_my_location_history',
    200,
    jsonb_build_object('location_history_rows', v_loc_count, 'check_ins_rows', v_chk_count)
  );

  RETURN jsonb_build_object('ok', true, 'location_history_rows', v_loc_count, 'check_ins_rows', v_chk_count);
END;
$$;

REVOKE ALL ON FUNCTION public.erase_my_location_history() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.erase_my_location_history() TO authenticated;

-- Phase 2.8 — Forum & community refactor
CREATE TABLE IF NOT EXISTS public.user_track_moderators (
  user_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track    text NOT NULL CHECK (track IN ('catholic','protestant','orthodox','heritage')),
  granted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, track)
);

ALTER TABLE public.user_track_moderators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read moderator assignments" ON public.user_track_moderators;
CREATE POLICY "Anyone can read moderator assignments"
ON public.user_track_moderators FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can write moderator assignments" ON public.user_track_moderators;
CREATE POLICY "Only admins can write moderator assignments"
ON public.user_track_moderators FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.is_track_moderator(_user_id uuid, _track text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_track_moderators
    WHERE user_id = _user_id AND track = _track
  ) OR public.is_admin();
$$;

DROP POLICY IF EXISTS "Anyone can view forum topics" ON public.forum_topics;
DROP POLICY IF EXISTS "Users can view denomination forum topics" ON public.forum_topics;
DROP POLICY IF EXISTS "Public topics are world-readable" ON public.forum_topics;

CREATE POLICY "Public topics are world-readable"
ON public.forum_topics FOR SELECT
USING (
  is_community = false
  OR public.get_user_denomination(auth.uid()) = track_scope
  OR public.is_track_moderator(auth.uid(), track_scope)
);

DROP POLICY IF EXISTS "Authors can read own topics" ON public.forum_topics;
CREATE POLICY "Authors can read own topics"
ON public.forum_topics FOR SELECT
USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Anyone can view forum posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Posts visible if user can see the topic" ON public.forum_posts;

CREATE POLICY "Posts visible if user can see the topic"
ON public.forum_posts FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.forum_topics t
  WHERE t.id = forum_posts.topic_id
    AND (
      t.is_community = false
      OR public.get_user_denomination(auth.uid()) = t.track_scope
      OR public.is_track_moderator(auth.uid(), t.track_scope)
      OR auth.uid() = forum_posts.author_id
    )
));

DROP POLICY IF EXISTS "Track members can post in community topics" ON public.forum_posts;
CREATE POLICY "Track members can post in community topics"
ON public.forum_posts FOR INSERT
WITH CHECK (
  auth.uid() = author_id
  AND EXISTS (
    SELECT 1 FROM public.forum_topics t
    WHERE t.id = forum_posts.topic_id
      AND (
        t.is_community = false
        OR public.get_user_denomination(auth.uid()) = t.track_scope
        OR public.is_track_moderator(auth.uid(), t.track_scope)
      )
  )
);