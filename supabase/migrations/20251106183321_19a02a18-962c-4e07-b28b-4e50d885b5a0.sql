-- Drop and recreate the view without SECURITY DEFINER
DROP VIEW IF EXISTS public.avatar_collector_stats;

CREATE VIEW public.avatar_collector_stats AS
SELECT 
  p.id as user_id,
  p.username,
  p.avatar_url,
  COUNT(DISTINCT uuda.avatar_id) as total_unlocked,
  COUNT(DISTINCT CASE WHEN da.rarity = 'legendary' THEN uuda.avatar_id END) as legendary_count,
  COUNT(DISTINCT CASE WHEN da.rarity = 'epic' THEN uuda.avatar_id END) as epic_count,
  COUNT(DISTINCT CASE WHEN da.rarity = 'rare' THEN uuda.avatar_id END) as rare_count,
  COUNT(DISTINCT CASE WHEN da.rarity = 'common' THEN uuda.avatar_id END) as common_count,
  MAX(uuda.unlocked_at) as last_unlock_at
FROM public.profiles p
LEFT JOIN public.user_unlocked_default_avatars uuda ON p.id = uuda.user_id
LEFT JOIN public.default_avatars da ON uuda.avatar_id = da.id
WHERE p.is_public = true AND p.username IS NOT NULL
GROUP BY p.id, p.username, p.avatar_url;

-- Grant access to authenticated users
GRANT SELECT ON public.avatar_collector_stats TO authenticated;