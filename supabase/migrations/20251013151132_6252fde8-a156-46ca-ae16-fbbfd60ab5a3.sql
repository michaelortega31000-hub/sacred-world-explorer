-- Create storage bucket for memory photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('memory-photos', 'memory-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for memory photos bucket
CREATE POLICY "Users can view memory photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'memory-photos');

CREATE POLICY "Authenticated users can upload their own memory photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'memory-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own memory photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'memory-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own memory photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'memory-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);