-- Drop and recreate the public_profiles view with explicit security invoker
-- This ensures the view respects RLS policies from the underlying table
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles 
WITH (security_invoker = true)
AS 
SELECT id, username, created_at 
FROM public.public_profiles_store;

COMMENT ON VIEW public.public_profiles IS 
'Public view of user profiles. Security is enforced through RLS policies on public_profiles_store table. This view uses SECURITY INVOKER to ensure queries respect the caller''s permissions.';