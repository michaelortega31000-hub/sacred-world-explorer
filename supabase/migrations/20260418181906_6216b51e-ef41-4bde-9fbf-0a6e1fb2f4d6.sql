-- 1. Add denomination column to user_progress (nullable, app-side validation)
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS denomination text;

-- 2. Helper function to read a user's denomination
CREATE OR REPLACE FUNCTION public.get_user_denomination(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT denomination
  FROM public.user_progress
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- 3. Additive RLS policy: allow viewing denomination-specific forum topics
CREATE POLICY "Users can view denomination forum topics"
ON public.forum_topics
FOR SELECT
TO authenticated
USING (
  religion IN ('catholique', 'protestant')
  AND religion = public.get_user_denomination(auth.uid())
);