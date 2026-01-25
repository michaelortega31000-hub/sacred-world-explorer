-- Fix overly permissive INSERT policies on system-only tables
-- These tables should only be written to by edge functions using service role key

-- 1. Drop permissive INSERT policy on notification_history
DROP POLICY IF EXISTS "System can insert notification history" ON public.notification_history;

-- 2. Drop permissive INSERT policy on leaderboard_achievements  
DROP POLICY IF EXISTS "System can insert achievements" ON public.leaderboard_achievements;

-- 3. Drop permissive INSERT policy on security_logs
DROP POLICY IF EXISTS "System can insert security logs" ON public.security_logs;

-- Note: Edge functions using SUPABASE_SERVICE_ROLE_KEY bypass RLS entirely,
-- so these tables will still be writable by backend services but NOT by regular users.