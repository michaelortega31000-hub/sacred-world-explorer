-- Phase 2.1 — Tag existing content tables with track_scope and cross_visible.
-- 'common' is the safe default so existing content remains visible to everyone
-- until an editor explicitly scopes it.

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

-- forum_topics already has a 'religion' column (catholique/protestant) from
-- Phase 1's denomination-forum policy. Add the new columns and copy data.
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

-- Drop the legacy denomination-scoped policy added in 20260418181906.
-- We'll replace it with track-aware RLS in Phase 2.8.
DROP POLICY IF EXISTS "Users can view denomination forum topics" ON public.forum_topics;
