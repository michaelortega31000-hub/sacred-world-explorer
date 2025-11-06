-- Create storage bucket for AR captures
INSERT INTO storage.buckets (id, name, public)
VALUES ('ar-captures', 'ar-captures', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for ar-captures bucket
CREATE POLICY "Users can upload their own AR captures"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ar-captures' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own AR captures"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'ar-captures' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Public AR captures are viewable by everyone"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'ar-captures');