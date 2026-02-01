-- Make avatars bucket public so profile pictures are accessible
UPDATE storage.buckets 
SET public = true 
WHERE id = 'avatars';