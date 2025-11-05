-- Create storage bucket for visit photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('visit-photos', 'visit-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Create visit_photos table
CREATE TABLE IF NOT EXISTS public.visit_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  place_id TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  ai_confidence DECIMAL(5,2),
  ai_analysis TEXT,
  identified_elements TEXT[],
  validated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  geolocation JSONB,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visit_photos_user ON public.visit_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_visit_photos_place ON public.visit_photos(place_id);
CREATE INDEX IF NOT EXISTS idx_visit_photos_validated_at ON public.visit_photos(validated_at DESC);

-- Enable RLS
ALTER TABLE public.visit_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own photos"
  ON public.visit_photos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own photos"
  ON public.visit_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public photos are viewable by all"
  ON public.visit_photos FOR SELECT
  USING (is_public = true);

-- Storage policies for visit-photos bucket
CREATE POLICY "Users can upload their own visit photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'visit-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own visit photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'visit-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own visit photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'visit-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );