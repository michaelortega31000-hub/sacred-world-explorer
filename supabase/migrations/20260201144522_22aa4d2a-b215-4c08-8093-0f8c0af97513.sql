-- Drop existing policy
DROP POLICY IF EXISTS "Users can view topics based on visibility" ON forum_topics;

-- Create updated policy with support for 'global' visibility
CREATE POLICY "Users can view topics based on visibility" 
ON forum_topics FOR SELECT
USING (
  CASE
    -- Topics privés : auteur ou ami uniquement
    WHEN visibility = 'private' THEN 
      (auth.uid() = author_id) OR is_friend_of(auth.uid(), author_id)
    -- Topics globaux : tout le monde peut voir
    WHEN visibility = 'global' THEN true
    -- Topics publics (communauté) : même religion ou auteur
    WHEN visibility = 'public' THEN 
      (auth.uid() = author_id) OR 
      (religion IS NOT NULL AND religion = get_user_religion(auth.uid()))
    ELSE false
  END
);