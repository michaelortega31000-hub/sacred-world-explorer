-- ════════════════════════════════════════════════════════════════════════════
-- USER-CONTRIBUTED PLACE PHOTOS
-- Lets visitors fill the visual gap for places that don't yet have a curated
-- photo. Each upload starts as 'pending' and must be approved before it
-- shows up to other users (manual or future-AI-assisted moderation).
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Storage bucket — public-read, authenticated-write.
INSERT INTO storage.buckets (id, name, public)
VALUES ('place-photos', 'place-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Metadata table.
CREATE TABLE IF NOT EXISTS public.place_photos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id    TEXT NOT NULL,                -- 'wd-Q12345' or local id
  place_name  TEXT NOT NULL,                -- denormalized for moderation UI
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,               -- key inside the place-photos bucket
  caption     TEXT,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_place_photos_place ON public.place_photos(place_id);
CREATE INDEX IF NOT EXISTS idx_place_photos_user  ON public.place_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_place_photos_status ON public.place_photos(status);

-- 3. RLS policies.
ALTER TABLE public.place_photos ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved photos.
CREATE POLICY "place_photos_read_approved"
  ON public.place_photos FOR SELECT
  USING (status = 'approved');

-- Authors can read their own pending submissions.
CREATE POLICY "place_photos_read_own"
  ON public.place_photos FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can submit.
CREATE POLICY "place_photos_insert"
  ON public.place_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authors can delete their own (e.g. retract a submission).
CREATE POLICY "place_photos_delete_own"
  ON public.place_photos FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Storage RLS — only the photo owner can write to their folder.
CREATE POLICY "place_photos_storage_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'place-photos');

CREATE POLICY "place_photos_storage_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'place-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "place_photos_storage_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'place-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
