ALTER TABLE public.place_photos
  ADD COLUMN IF NOT EXISTS moderation_reason TEXT;

CREATE POLICY "place_photos_admin_read_all"
ON public.place_photos FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "place_photos_admin_update"
ON public.place_photos FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE INDEX IF NOT EXISTS idx_place_photos_status_new
  ON public.place_photos(status) WHERE is_new_place = true;