-- ════════════════════════════════════════════════════════════════════════════
-- USER-CONTRIBUTED PLACE PHOTOS + COMMUNITY-SUBMITTED NEW PLACES
-- ════════════════════════════════════════════════════════════════════════════

-- 1. Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('place-photos', 'place-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Metadata table
CREATE TABLE IF NOT EXISTS public.place_photos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id     TEXT NOT NULL,
  place_name   TEXT NOT NULL,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption      TEXT,
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at  TIMESTAMPTZ,
  reviewed_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Community new-place submission fields
  is_new_place      BOOLEAN NOT NULL DEFAULT false,
  country           TEXT,
  city              TEXT,
  tradition         TEXT,
  latitude          DOUBLE PRECISION,
  longitude         DOUBLE PRECISION,
  reaction_sparkle  INT NOT NULL DEFAULT 0,
  reaction_heart    INT NOT NULL DEFAULT 0,
  reaction_hands    INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_place_photos_place   ON public.place_photos(place_id);
CREATE INDEX IF NOT EXISTS idx_place_photos_user    ON public.place_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_place_photos_status  ON public.place_photos(status);
CREATE INDEX IF NOT EXISTS idx_place_photos_country ON public.place_photos(country);
CREATE INDEX IF NOT EXISTS idx_place_photos_new     ON public.place_photos(is_new_place);
CREATE INDEX IF NOT EXISTS idx_place_photos_status_created
  ON public.place_photos(status, created_at DESC);

-- 3. RLS
ALTER TABLE public.place_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "place_photos_read_approved"
  ON public.place_photos FOR SELECT
  USING (status = 'approved');

CREATE POLICY "place_photos_read_own"
  ON public.place_photos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "place_photos_insert"
  ON public.place_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "place_photos_delete_own"
  ON public.place_photos FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Storage RLS
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

-- 5. Reactions
CREATE TABLE IF NOT EXISTS public.place_photo_reactions (
  photo_id   UUID NOT NULL REFERENCES public.place_photos(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL CHECK (kind IN ('sparkle','heart','hands')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (photo_id, user_id, kind)
);

ALTER TABLE public.place_photo_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "place_photo_reactions_read_all"
  ON public.place_photo_reactions FOR SELECT
  USING (true);

CREATE POLICY "place_photo_reactions_insert_own"
  ON public.place_photo_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "place_photo_reactions_delete_own"
  ON public.place_photo_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Counter sync trigger
CREATE OR REPLACE FUNCTION public.bump_place_photo_reaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  delta INT;
  pid   UUID;
  k     TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    delta := 1; pid := NEW.photo_id; k := NEW.kind;
  ELSIF TG_OP = 'DELETE' THEN
    delta := -1; pid := OLD.photo_id; k := OLD.kind;
  END IF;

  IF k = 'sparkle' THEN
    UPDATE public.place_photos SET reaction_sparkle = GREATEST(0, reaction_sparkle + delta) WHERE id = pid;
  ELSIF k = 'heart' THEN
    UPDATE public.place_photos SET reaction_heart = GREATEST(0, reaction_heart + delta) WHERE id = pid;
  ELSIF k = 'hands' THEN
    UPDATE public.place_photos SET reaction_hands = GREATEST(0, reaction_hands + delta) WHERE id = pid;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_place_photo_reaction_ins ON public.place_photo_reactions;
CREATE TRIGGER trg_place_photo_reaction_ins
AFTER INSERT ON public.place_photo_reactions
FOR EACH ROW EXECUTE FUNCTION public.bump_place_photo_reaction();

DROP TRIGGER IF EXISTS trg_place_photo_reaction_del ON public.place_photo_reactions;
CREATE TRIGGER trg_place_photo_reaction_del
AFTER DELETE ON public.place_photo_reactions
FOR EACH ROW EXECUTE FUNCTION public.bump_place_photo_reaction();