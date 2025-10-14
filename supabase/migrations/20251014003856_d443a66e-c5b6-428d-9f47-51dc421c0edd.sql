-- Make memory-photos bucket private to respect user privacy settings
UPDATE storage.buckets 
SET public = false 
WHERE id = 'memory-photos';

-- Remove public SELECT policy
DROP POLICY IF EXISTS "Public Access to view memory photos" ON storage.objects;

-- Allow users to view their own photos
CREATE POLICY "Users can view their own memory photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'memory-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view public memory photos from others
CREATE POLICY "Public memory photos are viewable"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'memory-photos'
  AND EXISTS (
    SELECT 1 FROM public.memories
    WHERE media_urls @> ARRAY[name]
    AND is_public = true
  )
);