-- Defense-in-depth fix: Update payment info function to use user_subscriptions table
-- and add comment to profiles table fields to indicate they're deprecated

-- 1) Update the get_user_payment_info function to read from user_subscriptions instead of profiles
CREATE OR REPLACE FUNCTION public.get_user_payment_info(_user_id uuid)
RETURNS TABLE(
  stripe_customer_id text,
  subscription_tier text,
  subscription_end timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    stripe_customer_id,
    subscription_tier,
    CASE 
      WHEN status = 'active' THEN NULL::timestamp with time zone
      ELSE NULL::timestamp with time zone
    END as subscription_end
  FROM public.user_subscriptions
  WHERE user_id = _user_id
  AND status = 'active'
  LIMIT 1;
$$;

-- 2) Add comments to document the architecture
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 
  'DEPRECATED: Use user_subscriptions table for payment data. Kept for backward compatibility.';

COMMENT ON COLUMN public.profiles.subscription_tier IS 
  'DEPRECATED: Use user_subscriptions table for payment data. Kept for backward compatibility.';

COMMENT ON COLUMN public.profiles.subscription_end IS 
  'DEPRECATED: Use user_subscriptions table for payment data. Kept for backward compatibility.';

COMMENT ON TABLE public.user_subscriptions IS 
  'Primary table for user subscription and payment data. Protected by RLS: users can only access their own subscription records.';