-- Create forum-photos bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'forum-photos', 
  'forum-photos', 
  false,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for forum-photos bucket
CREATE POLICY "Users can upload their own forum photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'forum-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view forum photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'forum-photos');

CREATE POLICY "Users can delete their own forum photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'forum-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add image_urls column to forum_topics
ALTER TABLE public.forum_topics
ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT NULL;

-- Add image_urls column to forum_posts
ALTER TABLE public.forum_posts
ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT NULL;