-- Make ar-captures bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'ar-captures';

-- Add RLS policies for ar-captures bucket
-- Only owner can view their own AR captures
CREATE POLICY "Users can view own AR captures"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'ar-captures' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Only owner can upload their own AR captures
CREATE POLICY "Users can upload own AR captures"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ar-captures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Only owner can delete their own AR captures
CREATE POLICY "Users can delete own AR captures"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'ar-captures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);