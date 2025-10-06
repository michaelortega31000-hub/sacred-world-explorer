-- Fix: Replace definer-style public_profiles view with invoker view backed by an RLS-protected table
-- and set security_invoker on user_profile to ensure RLS is enforced for the querying user.

-- 1) Create a backing table for public profile data (public-only fields)
CREATE TABLE IF NOT EXISTS public.public_profiles_store (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  username text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS and restrict writes; allow reads to authenticated users only
ALTER TABLE public.public_profiles_store ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists, then create new one
DROP POLICY IF EXISTS "Authenticated users can read public profiles" ON public.public_profiles_store;

CREATE POLICY "Authenticated users can read public profiles"
  ON public.public_profiles_store FOR SELECT
  TO authenticated
  USING (true);

-- 2) Synchronization function and triggers to keep the store in sync with profiles
CREATE OR REPLACE FUNCTION public.sync_public_profiles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF tg_op = 'INSERT' THEN
    INSERT INTO public.public_profiles_store (id, username, created_at)
    VALUES (new.id, new.username, new.created_at)
    ON CONFLICT (id) DO UPDATE SET
      username = EXCLUDED.username,
      created_at = EXCLUDED.created_at;
    RETURN new;
  ELSIF tg_op = 'UPDATE' THEN
    UPDATE public.public_profiles_store
       SET username = new.username,
           created_at = new.created_at
     WHERE id = new.id;
    RETURN new;
  ELSIF tg_op = 'DELETE' THEN
    DELETE FROM public.public_profiles_store WHERE id = old.id;
    RETURN old;
  END IF;
END;
$$;

-- Create triggers on profiles to keep the store in sync
DROP TRIGGER IF EXISTS profiles_sync_public_profiles_insert ON public.profiles;
CREATE TRIGGER profiles_sync_public_profiles_insert
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_public_profiles();

DROP TRIGGER IF EXISTS profiles_sync_public_profiles_update ON public.profiles;
CREATE TRIGGER profiles_sync_public_profiles_update
  AFTER UPDATE OF username, created_at ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_public_profiles();

DROP TRIGGER IF EXISTS profiles_sync_public_profiles_delete ON public.profiles;
CREATE TRIGGER profiles_sync_public_profiles_delete
  AFTER DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_public_profiles();

-- 3) Backfill existing data
INSERT INTO public.public_profiles_store (id, username, created_at)
SELECT id, username, created_at
FROM public.profiles
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  created_at = EXCLUDED.created_at;

-- 4) Recreate the public view to use invoker semantics and read from the RLS-protected table
DROP VIEW IF EXISTS public.public_profiles CASCADE;

CREATE VIEW public.public_profiles
WITH (security_invoker = true, security_barrier = true)
AS
SELECT id, username, created_at
FROM public.public_profiles_store;

COMMENT ON VIEW public.public_profiles IS 'Public-only profile fields backed by an RLS-protected table. SELECT allowed to authenticated users only.';

-- 5) Ensure the user_profile view also uses invoker semantics so it never bypasses table RLS
ALTER VIEW public.user_profile SET (security_invoker = true, security_barrier = true);