-- =====================================================
-- SECURITY FIX: Protect Payment Data in Profiles Table
-- =====================================================
-- This migration addresses the security finding where stripe_customer_id 
-- and other sensitive payment data could be exposed to other users.
--
-- Strategy: Create a secure view that exposes ONLY public profile fields,
-- then restrict direct table access to own profile only.

-- Step 1: Drop the overly permissive policy that allows authenticated users 
-- to query all columns of other users' profiles
DROP POLICY IF EXISTS "Public profiles viewable by authenticated users" ON public.profiles;

-- Step 2: Create a secure view that exposes ONLY public profile information
-- This view explicitly excludes sensitive payment data like stripe_customer_id,
-- subscription_tier, and subscription_end
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_barrier = true)
AS
SELECT 
  id,
  username,
  created_at
FROM public.profiles;

-- Step 3: Grant SELECT access on the view to authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;

-- Step 4: Add security documentation
COMMENT ON VIEW public.public_profiles IS 
'Secure view exposing only public profile fields (id, username, created_at). 
This view protects sensitive payment data (stripe_customer_id, subscription_tier, subscription_end) 
from being exposed to other users. Use this view for social features like friend lists, 
messages, and forum posts.';

COMMENT ON TABLE public.profiles IS 
'User profiles table with RLS enabled. Users have full access to their own profile only. 
For accessing public profile information of other users, use the public_profiles view instead 
to avoid exposing sensitive payment data.';