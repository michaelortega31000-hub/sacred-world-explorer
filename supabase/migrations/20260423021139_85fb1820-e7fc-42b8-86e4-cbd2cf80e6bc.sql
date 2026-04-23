-- Restrict user_subscriptions writes to service role only
-- Authenticated users could previously self-assign any subscription tier without payment verification
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscription" ON public.user_subscriptions;

-- SELECT remains owner-only (existing policy "Users can view their own subscription" is kept)
-- INSERT/UPDATE/DELETE now only possible via service role (edge functions validating Stripe payments)

-- Defensive: ensure no INSERT policy exists on security_logs for non-admin roles
-- (Removing any leftover permissive insert policy if it exists)
DROP POLICY IF EXISTS "System can insert security logs" ON public.security_logs;
DROP POLICY IF EXISTS "Anyone can insert security logs" ON public.security_logs;
DROP POLICY IF EXISTS "Authenticated can insert security logs" ON public.security_logs;