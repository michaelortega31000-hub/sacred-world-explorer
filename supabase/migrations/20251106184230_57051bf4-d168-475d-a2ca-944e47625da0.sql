-- Modify check_leaderboard_positions to send push notifications
CREATE OR REPLACE FUNCTION public.check_leaderboard_positions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_top_users RECORD;
  v_avatar_id uuid;
  v_avatar_name text;
  v_new_achievement boolean;
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
    SELECT id, name INTO v_avatar_id, v_avatar_name
    FROM default_avatars
    WHERE name = CASE v_top_users.rank
      WHEN 1 THEN 'Champion Collectionneur'
      WHEN 2 THEN 'Vice-Champion Collectionneur'
      WHEN 3 THEN 'Médaille de Bronze'
    END;

    -- Check if achievement already exists for today
    v_new_achievement := NOT EXISTS (
      SELECT 1 FROM leaderboard_achievements
      WHERE user_id = v_top_users.user_id
      AND rank = v_top_users.rank
      AND DATE(achieved_at) = CURRENT_DATE
    );

    -- Insert achievement if not already exists for today
    IF v_new_achievement THEN
      INSERT INTO leaderboard_achievements (user_id, rank, achievement_type, avatar_unlocked)
      VALUES (v_top_users.user_id, v_top_users.rank, 'total', v_avatar_id)
      ON CONFLICT DO NOTHING;

      -- Unlock the avatar for the user
      INSERT INTO user_unlocked_default_avatars (user_id, avatar_id)
      VALUES (v_top_users.user_id, v_avatar_id)
      ON CONFLICT DO NOTHING;

      -- Send push notification
      PERFORM net.http_post(
        url := 'https://uekqjlaguhzotiuqskvb.supabase.co/functions/v1/notify-leaderboard-reward',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVla3FqbGFndWh6b3RpdXFza3ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDgxODMsImV4cCI6MjA3NDgyNDE4M30.Y6LSLi7NWu6VZ5lh5RAi-eTII0wY7iDSK4eo0xiNMKo"}'::jsonb,
        body := jsonb_build_object(
          'userId', v_top_users.user_id,
          'rank', v_top_users.rank,
          'avatarName', v_avatar_name
        )
      );
      
      RAISE NOTICE 'Push notification sent for user % rank %', v_top_users.user_id, v_top_users.rank;
    END IF;
  END LOOP;
END;
$function$;
