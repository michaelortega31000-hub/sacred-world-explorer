-- Add explicit write-protection policies to public_profiles_store
-- This table is maintained automatically via triggers on the profiles table
-- Direct writes should not be allowed

-- Explicitly deny INSERT operations
CREATE POLICY "public_profiles_store is read-only - no inserts allowed"
ON public.public_profiles_store
FOR INSERT
WITH CHECK (false);

-- Explicitly deny UPDATE operations  
CREATE POLICY "public_profiles_store is read-only - no updates allowed"
ON public.public_profiles_store
FOR UPDATE
USING (false);

-- Explicitly deny DELETE operations
CREATE POLICY "public_profiles_store is read-only - no deletes allowed"
ON public.public_profiles_store
FOR DELETE
USING (false);