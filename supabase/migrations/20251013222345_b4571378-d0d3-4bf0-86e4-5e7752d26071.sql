-- Fix Storage Exposure: Make memory-photos and avatars buckets private
UPDATE storage.buckets 
SET public = false 
WHERE id IN ('memory-photos', 'avatars');

-- Drop existing storage policies for memory-photos and avatars
DROP POLICY IF EXISTS "Users can view memory photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload memory photos to their folder" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload their own memory photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own memory photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own memory photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view all avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Add new secure storage RLS policies for memory-photos bucket
CREATE POLICY "Users can view their own memory photos or public ones"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'memory-photos' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.memories 
      WHERE media_urls @> ARRAY['memory-photos/' || storage.objects.name] 
      AND is_public = true
    )
  )
);

CREATE POLICY "Users can upload to their own memory photos folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'memory-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own memory photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'memory-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own memory photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'memory-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add new secure storage RLS policies for avatars bucket
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Fix Client-Side Progress: Create user_progress table with RLS
CREATE TABLE IF NOT EXISTS public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_religion text,
  language text NOT NULL DEFAULT 'fr',
  total_points integer NOT NULL DEFAULT 0,
  visited_places text[] NOT NULL DEFAULT '{}',
  badges text[] NOT NULL DEFAULT '{}',
  trip_places text[] NOT NULL DEFAULT '{}',
  geolocation_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_progress
CREATE POLICY "Users can view their own progress"
ON public.user_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.user_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.user_progress FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
ON public.user_progress FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();