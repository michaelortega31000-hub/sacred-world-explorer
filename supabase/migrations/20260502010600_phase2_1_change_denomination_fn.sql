-- Phase 2.1 — change_denomination() SECURITY DEFINER function.
-- Cooldown enforcement, audit log, optional progress reset.
-- Captcha + email-confirm flow lives in the edge function (Phase 2.11).
--
-- Cooldown model (Q6 escalating): cooldown_days_per_change[change_count] days,
-- and after denomination.max_self_changes changes admin support is required.

CREATE OR REPLACE FUNCTION public.change_denomination(
  p_to_code        text,
  p_reason_category text,
  p_reason_text    text,
  p_reset_progress boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id           uuid := auth.uid();
  v_to_id             uuid;
  v_from_id           uuid;
  v_locked_until      timestamptz;
  v_change_count      int;
  v_cooldown_days     int;
  v_max_changes       int;
  v_cooldown_array    jsonb;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '42501';
  END IF;

  SELECT id INTO v_to_id FROM public.denominations WHERE code = p_to_code AND active = true;
  IF v_to_id IS NULL THEN
    RAISE EXCEPTION 'Unknown denomination: %', p_to_code USING ERRCODE = '22023';
  END IF;

  SELECT denomination_id, denomination_locked_until, denomination_change_count
    INTO v_from_id, v_locked_until, v_change_count
  FROM public.profiles WHERE id = v_user_id;

  IF v_from_id = v_to_id THEN
    RAISE EXCEPTION 'Already in this denomination' USING ERRCODE = '22023';
  END IF;

  IF v_locked_until IS NOT NULL AND v_locked_until > now() THEN
    RAISE EXCEPTION 'Cooldown active until %', v_locked_until USING ERRCODE = '42501';
  END IF;

  -- Read cooldown config.
  SELECT (value)::int INTO v_max_changes FROM public.app_config WHERE key = 'denomination.max_self_changes';
  v_max_changes := COALESCE(v_max_changes, 3);

  IF v_change_count >= v_max_changes THEN
    RAISE EXCEPTION 'Max self-service changes reached (%); contact support', v_max_changes USING ERRCODE = '42501';
  END IF;

  SELECT value INTO v_cooldown_array FROM public.app_config WHERE key = 'denomination.cooldown_days_per_change';
  v_cooldown_array := COALESCE(v_cooldown_array, '[30, 90, 365]'::jsonb);

  -- next change uses cooldown[change_count] (0-indexed): change #1 -> [0], #2 -> [1], ...
  v_cooldown_days := COALESCE(
    (v_cooldown_array -> LEAST(v_change_count, jsonb_array_length(v_cooldown_array) - 1))::text::int,
    365
  );

  -- Apply the change.
  UPDATE public.profiles SET
    denomination_id = v_to_id,
    denomination_change_count = COALESCE(v_change_count, 0) + 1,
    denomination_locked_until = now() + make_interval(days => v_cooldown_days)
  WHERE id = v_user_id;

  INSERT INTO public.denomination_change_history
    (user_id, from_denomination_id, to_denomination_id, reason_category, reason_text, reset_progress)
  VALUES
    (v_user_id, v_from_id, v_to_id, p_reason_category, p_reason_text, p_reset_progress);

  IF p_reset_progress THEN
    -- Service-definer + service-role implied: bypasses the user_progress trigger.
    UPDATE public.user_progress SET
      total_points = 0,
      badges = '{}',
      current_streak = 0,
      longest_streak = 0,
      last_quest_date = NULL,
      visited_places = '{}'
    WHERE user_id = v_user_id;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'denomination_id', v_to_id,
    'locked_until', now() + make_interval(days => v_cooldown_days),
    'change_count', COALESCE(v_change_count, 0) + 1
  );
END;
$$;

REVOKE ALL ON FUNCTION public.change_denomination(text, text, text, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.change_denomination(text, text, text, boolean) TO authenticated;
