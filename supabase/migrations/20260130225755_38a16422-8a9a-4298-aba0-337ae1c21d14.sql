-- Add source tracking and verification columns to places table
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS source_urls TEXT[];
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS verified_by UUID;
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'manual';
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';

-- Add index for verification status filtering
CREATE INDEX IF NOT EXISTS idx_places_verification_status ON public.places(verification_status);

-- Add RLS policy for admin verification
CREATE POLICY "Admins can update verification fields"
ON public.places
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);