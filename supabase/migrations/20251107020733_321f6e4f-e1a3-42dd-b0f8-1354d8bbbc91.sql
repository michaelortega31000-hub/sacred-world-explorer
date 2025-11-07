-- Create user_bans table
CREATE TABLE public.user_bans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  banned_at timestamptz NOT NULL DEFAULT now(),
  banned_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ban_reason text NOT NULL,
  strike_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  unbanned_at timestamptz,
  unbanned_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  unban_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, is_active)
);

-- Index for performance
CREATE INDEX idx_user_bans_user_id ON user_bans(user_id);
CREATE INDEX idx_user_bans_active ON user_bans(is_active) WHERE is_active = true;

-- RLS
ALTER TABLE user_bans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all bans"
  ON user_bans FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can manage bans"
  ON user_bans FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Function to check if user is banned
CREATE OR REPLACE FUNCTION public.is_user_banned(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_bans
    WHERE user_id = p_user_id
      AND is_active = true
  )
$$;

-- Function to auto-ban user after 3 strikes
CREATE OR REPLACE FUNCTION public.check_and_ban_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_strike_count integer;
BEGIN
  -- Count suspicious activities in last 24 hours
  SELECT COUNT(*) INTO v_strike_count
  FROM security_logs
  WHERE user_id = p_user_id
    AND event_type IN ('suspicious_activity', 'rate_limit_exceeded', 'unauthorized_access')
    AND severity IN ('warning', 'error', 'critical')
    AND created_at >= NOW() - INTERVAL '24 hours';

  -- Auto-ban if 3 or more strikes
  IF v_strike_count >= 3 THEN
    INSERT INTO user_bans (user_id, ban_reason, strike_count, is_active)
    VALUES (
      p_user_id,
      'Automatic ban: ' || v_strike_count || ' suspicious activities detected in 24h',
      v_strike_count,
      true
    )
    ON CONFLICT (user_id, is_active) WHERE is_active = true
    DO UPDATE SET
      strike_count = v_strike_count,
      banned_at = NOW();
  END IF;
END;
$$;