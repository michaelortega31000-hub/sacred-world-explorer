-- Add rate limiting infrastructure
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  count INT NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, action, window_start)
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can only view their own rate limits
CREATE POLICY "Users can view their own rate limits"
ON public.rate_limits
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own rate limits
CREATE POLICY "Users can insert their own rate limits"
ON public.rate_limits
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own rate limits
CREATE POLICY "Users can update their own rate limits"
ON public.rate_limits
FOR UPDATE
USING (auth.uid() = user_id);

-- Add index for efficient queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action 
ON public.rate_limits(user_id, action, window_start);

-- Secure VR content buckets
UPDATE storage.buckets 
SET public = false 
WHERE id IN ('vr-content', 'vr-thumbnails');

-- Add RLS policy for authenticated VR content access
CREATE POLICY "Authenticated users can view VR content"
ON storage.objects 
FOR SELECT
USING (
  bucket_id IN ('vr-content', 'vr-thumbnails')
  AND auth.uid() IS NOT NULL
);

-- Add policy for admin uploads
CREATE POLICY "Admins can upload VR content"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id IN ('vr-content', 'vr-thumbnails')
  AND public.is_admin()
);

-- Add policy for admin updates
CREATE POLICY "Admins can update VR content"
ON storage.objects
FOR UPDATE
USING (
  bucket_id IN ('vr-content', 'vr-thumbnails')
  AND public.is_admin()
);

-- Add policy for admin deletes
CREATE POLICY "Admins can delete VR content"
ON storage.objects
FOR DELETE
USING (
  bucket_id IN ('vr-content', 'vr-thumbnails')
  AND public.is_admin()
);