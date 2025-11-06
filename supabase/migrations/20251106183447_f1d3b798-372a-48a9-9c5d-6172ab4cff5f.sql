-- Add special top 3 leaderboard avatars
INSERT INTO public.default_avatars (name, avatar_url, category, display_order, is_exclusive, rarity, unlock_description) VALUES
  ('Champion Collectionneur', 'https://api.dicebear.com/7.x/personas/svg?seed=champion-1st&backgroundColor=ffd700&accessories=glasses,mustache', 'legendary', 200, true, 'legendary', '1ère place du classement collectionneurs'),
  ('Vice-Champion Collectionneur', 'https://api.dicebear.com/7.x/personas/svg?seed=champion-2nd&backgroundColor=c0c0c0&accessories=glasses', 'legendary', 201, true, 'legendary', '2ème place du classement collectionneurs'),
  ('Médaille de Bronze', 'https://api.dicebear.com/7.x/personas/svg?seed=champion-3rd&backgroundColor=cd7f32&accessories=sunglasses', 'epic', 202, true, 'epic', '3ème place du classement collectionneurs');

-- Create table to track leaderboard achievements
CREATE TABLE IF NOT EXISTS public.leaderboard_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  rank integer NOT NULL CHECK (rank >= 1 AND rank <= 3),
  achievement_type text NOT NULL CHECK (achievement_type IN ('total', 'legendary', 'epic', 'rare')),
  achieved_at timestamp with time zone NOT NULL DEFAULT now(),
  avatar_unlocked uuid REFERENCES public.default_avatars(id),
  UNIQUE(user_id, rank, achievement_type, achieved_at)
);

-- Enable RLS
ALTER TABLE public.leaderboard_achievements ENABLE ROW LEVEL SECURITY;

-- Users can view their own achievements
CREATE POLICY "Users can view their own achievements"
  ON public.leaderboard_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert achievements
CREATE POLICY "System can insert achievements"
  ON public.leaderboard_achievements
  FOR INSERT
  WITH CHECK (true);

-- Create function to check and award leaderboard positions
CREATE OR REPLACE FUNCTION public.check_leaderboard_positions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_top_users RECORD;
  v_avatar_id uuid;
BEGIN
  -- Get top 3 users by total unlocked avatars
  FOR v_top_users IN
    SELECT 
      user_id,
      ROW_NUMBER() OVER (ORDER BY total_unlocked DESC) as rank
    FROM avatar_collector_stats
    WHERE total_unlocked > 0
    ORDER BY total_unlocked DESC
    LIMIT 3
  LOOP
    -- Determine which avatar to unlock based on rank
    SELECT id INTO v_avatar_id
    FROM default_avatars
    WHERE name = CASE v_top_users.rank
      WHEN 1 THEN 'Champion Collectionneur'
      WHEN 2 THEN 'Vice-Champion Collectionneur'
      WHEN 3 THEN 'Médaille de Bronze'
    END;

    -- Insert achievement if not already exists for today
    INSERT INTO leaderboard_achievements (user_id, rank, achievement_type, avatar_unlocked)
    VALUES (v_top_users.user_id, v_top_users.rank, 'total', v_avatar_id)
    ON CONFLICT DO NOTHING;

    -- Unlock the avatar for the user
    INSERT INTO user_unlocked_default_avatars (user_id, avatar_id)
    VALUES (v_top_users.user_id, v_avatar_id)
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_achievements_user_id ON public.leaderboard_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_achievements_achieved_at ON public.leaderboard_achievements(achieved_at DESC);