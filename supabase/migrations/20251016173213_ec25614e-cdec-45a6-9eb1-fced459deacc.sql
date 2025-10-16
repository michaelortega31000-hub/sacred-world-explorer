-- Security Fix: Make visit_history immutable
-- Remove UPDATE and DELETE policies to prevent score manipulation

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Users can update their own visit history" ON public.visit_history;
DROP POLICY IF EXISTS "Users can delete their own visit history" ON public.visit_history;

-- Keep only SELECT and INSERT policies
-- SELECT policy already exists: "Users can view their own visit history"
-- INSERT policy already exists: "Users can insert their own visit history"

-- Add comment explaining the security decision
COMMENT ON TABLE public.visit_history IS 'Visit records are immutable after creation to prevent point manipulation and badge fraud. Users can only SELECT their own records and INSERT new visits.';
