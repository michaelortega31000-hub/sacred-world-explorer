-- Add temporary ban fields to user_bans table
ALTER TABLE public.user_bans 
ADD COLUMN ban_duration_hours integer,
ADD COLUMN expires_at timestamptz;

-- Update is_user_banned function to check expiration
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
      AND (expires_at IS NULL OR expires_at > NOW())
  )
$$;

-- Update auto-ban function to support temporary bans
CREATE OR REPLACE FUNCTION public.check_and_ban_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_strike_count integer;
  v_ban_duration_hours integer;
  v_expires_at timestamptz;
BEGIN
  -- Count suspicious activities in last 24 hours
  SELECT COUNT(*) INTO v_strike_count
  FROM security_logs
  WHERE user_id = p_user_id
    AND event_type IN ('suspicious_activity', 'rate_limit_exceeded', 'unauthorized_access')
    AND severity IN ('warning', 'error', 'critical')
    AND created_at >= NOW() - INTERVAL '24 hours';

  -- Determine ban duration based on strike count
  IF v_strike_count >= 5 THEN
    -- 5+ strikes: permanent ban
    v_ban_duration_hours := NULL;
    v_expires_at := NULL;
  ELSIF v_strike_count >= 4 THEN
    -- 4 strikes: 7 days ban
    v_ban_duration_hours := 168;
    v_expires_at := NOW() + INTERVAL '168 hours';
  ELSIF v_strike_count >= 3 THEN
    -- 3 strikes: 24 hours ban
    v_ban_duration_hours := 24;
    v_expires_at := NOW() + INTERVAL '24 hours';
  ELSE
    -- Less than 3 strikes: no ban
    RETURN;
  END IF;

  -- Auto-ban with appropriate duration
  INSERT INTO user_bans (user_id, ban_reason, strike_count, is_active, ban_duration_hours, expires_at)
  VALUES (
    p_user_id,
    CASE 
      WHEN v_ban_duration_hours IS NULL THEN 'Permanent ban: ' || v_strike_count || ' suspicious activities (5+)'
      ELSE 'Temporary ban (' || v_ban_duration_hours || 'h): ' || v_strike_count || ' suspicious activities'
    END,
    v_strike_count,
    true,
    v_ban_duration_hours,
    v_expires_at
  )
  ON CONFLICT (user_id, is_active) WHERE is_active = true
  DO UPDATE SET
    strike_count = v_strike_count,
    banned_at = NOW(),
    ban_duration_hours = v_ban_duration_hours,
    expires_at = v_expires_at,
    ban_reason = CASE 
      WHEN v_ban_duration_hours IS NULL THEN 'Permanent ban: ' || v_strike_count || ' suspicious activities (5+)'
      ELSE 'Temporary ban (' || v_ban_duration_hours || 'h): ' || v_strike_count || ' suspicious activities'
    END;
END;
$$;

-- Function to auto-unban expired temporary bans
CREATE OR REPLACE FUNCTION public.process_expired_bans()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated_count integer;
BEGIN
  -- Deactivate expired bans
  UPDATE user_bans
  SET 
    is_active = false,
    unbanned_at = NOW(),
    unban_reason = 'Automatic unban: temporary ban expired'
  WHERE is_active = true
    AND expires_at IS NOT NULL
    AND expires_at <= NOW()
    AND unbanned_at IS NULL;
  
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  
  RETURN v_updated_count;
END;
$$;