
-- Drop the overly permissive SELECT policy on profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Replace with a scoped policy: users see their own profile OR public profiles
CREATE POLICY "Users can view own or public profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() = id OR is_public = true);
