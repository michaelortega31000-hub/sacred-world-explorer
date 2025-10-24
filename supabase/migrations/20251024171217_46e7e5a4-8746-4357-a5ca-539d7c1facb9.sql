-- Fix infinite recursion in user_roles RLS policy
-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Create corrected policy using the is_admin() security definer function
-- This prevents recursion because is_admin() uses SECURITY DEFINER
CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL
USING (public.is_admin());