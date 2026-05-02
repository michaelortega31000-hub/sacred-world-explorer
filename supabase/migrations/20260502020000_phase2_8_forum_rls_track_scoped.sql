-- Phase 2.8 — Forum & community refactor.
-- Replaces the old religion-scoped policies with track-scoped policies that
-- understand public forums vs per-track community forums.

-- 1) Per-track moderator junction (Q17). Sub-track-friendly.
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

-- Helper: does the user own the moderator role for a given track?
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

-- 2) Forum topics: replace blanket public read with public OR community-with-track-match.
DROP POLICY IF EXISTS "Anyone can view forum topics" ON public.forum_topics;
DROP POLICY IF EXISTS "Users can view denomination forum topics" ON public.forum_topics;

CREATE POLICY "Public topics are world-readable"
ON public.forum_topics FOR SELECT
USING (
  is_community = false
  OR public.get_user_denomination(auth.uid()) = track_scope
  OR public.is_track_moderator(auth.uid(), track_scope)
);

-- Authors can still see/edit their own topics regardless of scope.
DROP POLICY IF EXISTS "Authors can read own topics" ON public.forum_topics;
CREATE POLICY "Authors can read own topics"
ON public.forum_topics FOR SELECT
USING (auth.uid() = author_id);

-- 3) Forum posts mirror the topic visibility rule via topic join.
DROP POLICY IF EXISTS "Anyone can view forum posts" ON public.forum_posts;

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

-- 4) Inserts in community forums require track membership.
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
