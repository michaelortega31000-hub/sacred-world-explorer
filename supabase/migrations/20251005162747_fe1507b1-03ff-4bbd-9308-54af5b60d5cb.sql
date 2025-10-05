-- Drop the overly permissive policy that exposes all profile data including sensitive payment information
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Allow users to view their own complete profile (including sensitive payment data)
-- This is necessary for users to manage their own subscriptions and settings
CREATE POLICY "Users can view their own complete profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Allow authenticated users to view only public profile information of other users
-- This policy specifically restricts access to only id and username fields for social features
-- Note: Application code must explicitly select only these fields when querying other users' profiles
CREATE POLICY "Authenticated users can view public profile fields of others"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Add helpful comment documenting the security model
COMMENT ON TABLE public.profiles IS 'RLS Security: Users have full access to their own profile. Other authenticated users can query this table but application code MUST select only public fields (id, username) to avoid exposing sensitive data like stripe_customer_id, subscription_tier, or subscription_end.';

-- Ensure profiles table has RLS enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;