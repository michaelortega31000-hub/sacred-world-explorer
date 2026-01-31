-- Add visibility and religion columns to forum_topics
ALTER TABLE public.forum_topics 
ADD COLUMN visibility text NOT NULL DEFAULT 'public',
ADD COLUMN religion text;

-- Create index for faster filtering
CREATE INDEX idx_forum_topics_visibility ON public.forum_topics(visibility);
CREATE INDEX idx_forum_topics_religion ON public.forum_topics(religion);

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Anyone can view forum topics" ON public.forum_topics;

-- Create security definer function to check if user is friend
CREATE OR REPLACE FUNCTION public.is_friend_of(_user_id uuid, _author_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.friendships
    WHERE status = 'accepted'
      AND (
        (user_id = _user_id AND friend_id = _author_id)
        OR (user_id = _author_id AND friend_id = _user_id)
      )
  )
$$;

-- Create security definer function to get user's selected religion
CREATE OR REPLACE FUNCTION public.get_user_religion(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT selected_religion
  FROM public.user_progress
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- New policy: Users can view topics based on visibility rules
-- Private topics: only author and their friends can see
-- Public topics: only users with same religion can see
CREATE POLICY "Users can view topics based on visibility"
ON public.forum_topics
FOR SELECT
USING (
  CASE 
    WHEN visibility = 'private' THEN 
      -- Author or friend of author
      auth.uid() = author_id 
      OR public.is_friend_of(auth.uid(), author_id)
    WHEN visibility = 'public' THEN 
      -- Same religion as topic, or author
      auth.uid() = author_id
      OR (
        religion IS NOT NULL 
        AND religion = public.get_user_religion(auth.uid())
      )
    ELSE 
      false
  END
);