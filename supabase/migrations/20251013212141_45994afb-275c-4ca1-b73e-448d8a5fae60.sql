-- Add file type validation to storage policies (size validation must be done in application code)

-- Drop existing unrestricted policies
DROP POLICY IF EXISTS "Authenticated users can upload VR content" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload VR thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload memory photos to their folder" ON storage.objects;

-- VR Content bucket: Restrict to video files only
CREATE POLICY "Authenticated users can upload VR content"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vr-content' 
  AND auth.uid() IS NOT NULL
  AND (storage.extension(name) IN ('mp4', 'webm', 'ogg'))
);

-- VR Thumbnails bucket: Restrict to images only
CREATE POLICY "Authenticated users can upload VR thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vr-thumbnails' 
  AND auth.uid() IS NOT NULL
  AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'webp'))
);

-- Avatars bucket: Restrict to images, user folder only
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'webp'))
);

-- Memory Photos bucket: Restrict to images, user folder only
CREATE POLICY "Anyone can upload memory photos to their folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'memory-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'webp'))
);