-- =====================================================
-- SECURITY FIX: Prevent Payment Data Exposure to Client
-- =====================================================
-- This migration addresses the critical security finding where stripe_customer_id
-- could be exposed to the client side, even though restricted to the user's own profile.
--
-- Strategy: Create a secure view for user profile access that EXCLUDES all payment data.
-- Payment data (stripe_customer_id, subscription info) should ONLY be accessed server-side
-- in edge functions.

-- Step 1: Create a secure view for accessing user's own profile without payment data
CREATE OR REPLACE VIEW public.user_profile
WITH (security_barrier = true)
AS
SELECT
  id,
  username,
  created_at,
  updated_at
  -- Explicitly EXCLUDE: stripe_customer_id, subscription_tier, subscription_end
FROM public.profiles
WHERE id = auth.uid();

-- Step 2: Grant SELECT access on the view to authenticated users
GRANT SELECT ON public.user_profile TO authenticated;

-- Step 3: Create a security definer function for edge functions to safely access payment data
-- This function can ONLY be called from edge functions (server-side), never from client
CREATE OR REPLACE FUNCTION public.get_user_payment_info(_user_id uuid)
RETURNS TABLE (
  stripe_customer_id text,
  subscription_tier text,
  subscription_end timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    stripe_customer_id,
    subscription_tier,
    subscription_end
  FROM public.profiles
  WHERE id = _user_id;
$$;

-- Step 4: Revoke execute permission from authenticated users (only service role can call this)
REVOKE EXECUTE ON FUNCTION public.get_user_payment_info FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_payment_info FROM authenticated;

-- Step 5: Add security documentation
COMMENT ON VIEW public.user_profile IS
'Secure view for accessing the current user''s profile WITHOUT payment data.
Use this view in client-side code instead of querying the profiles table directly.
Payment data (stripe_customer_id, subscription_tier, subscription_end) is excluded
for security and should only be accessed server-side via edge functions.';

COMMENT ON FUNCTION public.get_user_payment_info IS
'SECURITY DEFINER function to access payment data server-side only.
This function can only be called from edge functions using the service role key.
Never expose this function to client-side code.';

COMMENT ON TABLE public.profiles IS
'User profiles table with RLS enabled. Contains sensitive payment data.
⚠️ SECURITY WARNING: Do not query stripe_customer_id, subscription_tier, or subscription_end
from client-side code. Use the user_profile view for safe client access.
Payment data should only be accessed server-side via get_user_payment_info() function
in edge functions.';

-- Step 6: Add helpful policy comments
COMMENT ON POLICY "Users can view their own profile" ON public.profiles IS
'Allows users to SELECT their own profile data. However, client-side code should use
the user_profile view instead to avoid exposing payment data (stripe_customer_id).';

COMMENT ON POLICY "Users can update their own profile" ON public.profiles IS
'Allows users to UPDATE their own profile. Note: stripe_customer_id should never be
updated from client-side code. Subscription updates must be handled server-side.';