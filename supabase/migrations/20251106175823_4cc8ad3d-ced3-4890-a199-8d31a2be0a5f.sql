-- Add is_public column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;

-- Create index for username lookups (for public profile sharing)
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username) WHERE username IS NOT NULL;

-- Update RLS policies to allow public viewing of public profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (is_public = true);

-- Create a view for public user stats
CREATE OR REPLACE VIEW public.public_user_stats AS
SELECT 
  p.id,
  p.username,
  p.avatar_url,
  p.created_at,
  up.total_points,
  up.current_streak,
  up.longest_streak,
  up.selected_religion,
  CARDINALITY(up.visited_places) as visited_places_count,
  CARDINALITY(up.badges) as badges_count
FROM public.profiles p
LEFT JOIN public.user_progress up ON p.id = up.user_id
WHERE p.is_public = true;

-- Enable RLS on the view
ALTER VIEW public.public_user_stats SET (security_invoker = on);

-- Grant access to authenticated and anon users
GRANT SELECT ON public.public_user_stats TO authenticated, anon;