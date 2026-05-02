-- Phase 2.4 — User-initiated erasure of location data.
-- Wipes coordinates and check-in records, keeps aggregate XP (per Q15).

CREATE OR REPLACE FUNCTION public.erase_my_location_history()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id   uuid := auth.uid();
  v_loc_count int;
  v_chk_count int;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '42501';
  END IF;

  -- Wipe location_history (raw GPS pings).
  DELETE FROM public.location_history WHERE user_id = v_user_id;
  GET DIAGNOSTICS v_loc_count = ROW_COUNT;

  -- Wipe check_ins (location_id traces). Aggregate XP stays in user_progress.
  DELETE FROM public.check_ins WHERE user_id = v_user_id;
  GET DIAGNOSTICS v_chk_count = ROW_COUNT;

  -- Clear home_location too — user can re-set it later.
  UPDATE public.profiles SET
    home_location = NULL,
    home_location_set_at = NULL
  WHERE id = v_user_id;

  -- Audit.
  INSERT INTO public.security_logs (user_id, event_type, severity, action, endpoint, status_code, details)
  VALUES (
    v_user_id,
    'erase_location_history',
    'low',
    'allowed',
    'rpc:erase_my_location_history',
    200,
    jsonb_build_object('location_history_rows', v_loc_count, 'check_ins_rows', v_chk_count)
  );

  RETURN jsonb_build_object('ok', true, 'location_history_rows', v_loc_count, 'check_ins_rows', v_chk_count);
END;
$$;

REVOKE ALL ON FUNCTION public.erase_my_location_history() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.erase_my_location_history() TO authenticated;
