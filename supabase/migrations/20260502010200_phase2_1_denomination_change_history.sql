-- Phase 2.1 — Audit log for denomination changes.
-- Insert via SECURITY DEFINER function only; users can SELECT their own rows.

CREATE TABLE IF NOT EXISTS public.denomination_change_history (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_denomination_id uuid REFERENCES public.denominations(id) ON DELETE SET NULL,
  to_denomination_id   uuid NOT NULL REFERENCES public.denominations(id) ON DELETE RESTRICT,
  reason_category text,
  reason_text     text,
  reset_progress  boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.denomination_change_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own change history" ON public.denomination_change_history;
CREATE POLICY "Users can view their own change history"
ON public.denomination_change_history FOR SELECT
USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policy: writes happen via SECURITY DEFINER fn only.
CREATE INDEX IF NOT EXISTS dch_user_idx ON public.denomination_change_history (user_id, created_at DESC);
