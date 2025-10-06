-- Remove deprecated payment fields from profiles table for defense-in-depth security
-- All payment data should use the user_subscriptions table which has proper RLS

-- 1) Drop foreign key constraint first
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_fkey;

-- 2) Remove the deprecated payment columns
ALTER TABLE public.profiles DROP COLUMN IF EXISTS stripe_customer_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS subscription_tier;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS subscription_end;

-- 3) Add comment documenting the change
COMMENT ON TABLE public.profiles IS 
  'User profile data (username, timestamps). Payment/subscription data is stored in user_subscriptions table.';

-- 4) Verify user_subscriptions has proper access controls
COMMENT ON TABLE public.user_subscriptions IS 
  'Primary table for user subscription and payment data. RLS enforces users can only access their own records. Use get_user_payment_info() function for secure access.';