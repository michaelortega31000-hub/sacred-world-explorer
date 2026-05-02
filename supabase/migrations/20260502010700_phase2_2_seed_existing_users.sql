-- Phase 2.2 — Backfill existing users' denomination_id from the legacy
-- user_progress.denomination text column. Users with NULL denomination stay
-- NULL and the client's <RequireOnboarding> guard sends them through the new
-- 4-step onboarding flow on next login.

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

-- For users who had a denomination, give them the maximum cooldown so the
-- existing track is sticky after migration. They can still petition support.
UPDATE public.profiles
SET denomination_locked_until = now() + interval '365 days',
    onboarded_at = COALESCE(onboarded_at, created_at)
WHERE denomination_id IS NOT NULL AND denomination_locked_until IS NULL;
