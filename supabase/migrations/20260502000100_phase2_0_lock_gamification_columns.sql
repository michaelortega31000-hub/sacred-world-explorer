-- Phase 2.0 — Bleed-stoppers
-- Lock down user_progress gamification columns from client-side mutation.
--
-- The existing RLS policy lets users UPDATE their own row freely, including
-- total_points / badges / streak / visited_places. That's how a tampered
-- localStorage payload reaches the leaderboard.
--
-- We layer a BEFORE UPDATE trigger that rejects changes to those columns
-- unless the actor is service_role. Edge functions (claim-quest, verify-visit,
-- etc.) use the service_role key and therefore bypass the trigger; legitimate
-- end-user clients cannot.

CREATE OR REPLACE FUNCTION public.guard_user_progress_gamification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- service_role is allowed to mutate anything.
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- For end-user updates, reject any change to trusted gamification columns.
  IF NEW.total_points IS DISTINCT FROM OLD.total_points THEN
    RAISE EXCEPTION 'user_progress.total_points is server-controlled' USING ERRCODE = '42501';
  END IF;
  IF NEW.badges IS DISTINCT FROM OLD.badges THEN
    RAISE EXCEPTION 'user_progress.badges is server-controlled' USING ERRCODE = '42501';
  END IF;
  IF NEW.current_streak IS DISTINCT FROM OLD.current_streak THEN
    RAISE EXCEPTION 'user_progress.current_streak is server-controlled' USING ERRCODE = '42501';
  END IF;
  IF NEW.longest_streak IS DISTINCT FROM OLD.longest_streak THEN
    RAISE EXCEPTION 'user_progress.longest_streak is server-controlled' USING ERRCODE = '42501';
  END IF;
  IF NEW.last_quest_date IS DISTINCT FROM OLD.last_quest_date THEN
    RAISE EXCEPTION 'user_progress.last_quest_date is server-controlled' USING ERRCODE = '42501';
  END IF;
  IF NEW.visited_places IS DISTINCT FROM OLD.visited_places THEN
    RAISE EXCEPTION 'user_progress.visited_places is server-controlled' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_user_progress_gamification_trg ON public.user_progress;
CREATE TRIGGER guard_user_progress_gamification_trg
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.guard_user_progress_gamification();

-- Also harden INSERT: a brand-new row from a non-service_role caller must
-- start clean (no points, no badges, no streak history).
CREATE OR REPLACE FUNCTION public.guard_user_progress_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  NEW.total_points := 0;
  NEW.badges := '{}';
  NEW.current_streak := 0;
  NEW.longest_streak := 0;
  NEW.last_quest_date := NULL;
  NEW.visited_places := '{}';

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_user_progress_insert_trg ON public.user_progress;
CREATE TRIGGER guard_user_progress_insert_trg
BEFORE INSERT ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.guard_user_progress_insert();
