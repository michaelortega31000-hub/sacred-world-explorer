-- Add RLS policies to public views to require authentication
-- This ensures only authenticated users can access public profile/stats data

-- 1. Enable RLS on public_profiles view (if it's a table/materialized view)
-- Note: For regular views, we need to check the underlying tables
-- But we can add policies to control access

-- First, let's add a policy to public_profiles_store (the underlying table)
-- to ensure only authenticated users can read it
DROP POLICY IF EXISTS "Authenticated users can read public profiles" ON public.public_profiles_store;
CREATE POLICY "Only authenticated users can read public profiles"
ON public.public_profiles_store
FOR SELECT
TO authenticated
USING (true);

-- For the views, we need to recreate them with security_invoker to enforce RLS
-- 2. Recreate public_profiles view with security_invoker
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles
WITH (security_invoker = on)
AS
SELECT 
  p.id,
  p.username,
  p.created_at
FROM public.profiles p
WHERE p.is_public = true;

-- 3. Recreate public_user_stats view with security_invoker
DROP VIEW IF EXISTS public.public_user_stats;
CREATE VIEW public.public_user_stats
WITH (security_invoker = on)
AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  p.created_at,
  COALESCE(up.total_points, 0) as total_points,
  COALESCE(up.current_streak, 0) as current_streak,
  COALESCE(up.longest_streak, 0) as longest_streak,
  COALESCE(up.selected_religion, NULL) as selected_religion,
  COALESCE(array_length(up.visited_places, 1), 0) as visited_places_count,
  COALESCE(array_length(up.badges, 1), 0) as badges_count
FROM public.profiles p
LEFT JOIN public.user_progress up ON p.id = up.user_id
WHERE p.is_public = true;

-- 4. Recreate avatar_collector_stats view with security_invoker
DROP VIEW IF EXISTS public.avatar_collector_stats;
CREATE VIEW public.avatar_collector_stats
WITH (security_invoker = on)
AS
SELECT 
  p.id as user_id,
  p.username,
  p.avatar_url,
  COUNT(uuda.id) as total_unlocked,
  COUNT(CASE WHEN da.rarity = 'legendary' THEN 1 END) as legendary_count,
  COUNT(CASE WHEN da.rarity = 'epic' THEN 1 END) as epic_count,
  COUNT(CASE WHEN da.rarity = 'rare' THEN 1 END) as rare_count,
  COUNT(CASE WHEN da.rarity = 'common' THEN 1 END) as common_count,
  MAX(uuda.unlocked_at) as last_unlock_at
FROM public.profiles p
LEFT JOIN public.user_unlocked_default_avatars uuda ON p.id = uuda.user_id
LEFT JOIN public.default_avatars da ON uuda.avatar_id = da.id
WHERE p.is_public = true
GROUP BY p.id, p.username, p.avatar_url;

-- 5. Grant SELECT on views to authenticated role only
REVOKE ALL ON public.public_profiles FROM anon;
REVOKE ALL ON public.public_user_stats FROM anon;
REVOKE ALL ON public.avatar_collector_stats FROM anon;

GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_user_stats TO authenticated;
GRANT SELECT ON public.avatar_collector_stats TO authenticated;