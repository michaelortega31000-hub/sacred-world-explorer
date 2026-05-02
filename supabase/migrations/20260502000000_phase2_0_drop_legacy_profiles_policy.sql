-- Phase 2.0 — Bleed-stoppers
-- Defensively drop the legacy "Profiles are viewable by everyone" SELECT policy
-- on public.profiles. It was already removed by migrations 20251005162747,
-- 20251005162826 and 20260216210015, but we re-assert here so the desired
-- state is explicit and auditable. Idempotent.

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Sanity: ensure RLS remains enabled. (Already enabled; idempotent.)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
