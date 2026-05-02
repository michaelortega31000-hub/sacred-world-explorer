-- Phase 2.1 — Denominations master table.
-- Four tracks: catholic, protestant, orthodox, heritage.
-- parent_id reserved for future sub-denominations (Anglican, Baptist, Coptic, etc.)
-- without requiring a schema change.

CREATE TABLE IF NOT EXISTS public.denominations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text NOT NULL UNIQUE,
  parent_id     uuid REFERENCES public.denominations(id) ON DELETE SET NULL,
  label_fr      text NOT NULL,
  label_en      text NOT NULL,
  description_fr text,
  description_en text,
  display_order int NOT NULL DEFAULT 0,
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.denominations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Denominations are public" ON public.denominations;
CREATE POLICY "Denominations are public"
ON public.denominations FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Only admins can write denominations" ON public.denominations;
CREATE POLICY "Only admins can write denominations"
ON public.denominations FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

INSERT INTO public.denominations (code, label_fr, label_en, description_fr, description_en, display_order)
VALUES
  ('catholic',   'Catholique',  'Catholic',   'Tradition catholique : sacrements, saints, liturgie romaine, magistère.', 'Catholic tradition: sacraments, saints, Roman liturgy, Magisterium.', 1),
  ('protestant', 'Protestant',  'Protestant', 'Familles protestantes et évangéliques : sola scriptura, prédication, communautés locales.', 'Protestant and evangelical families: sola scriptura, preaching, local communities.', 2),
  ('orthodox',   'Orthodoxe',   'Orthodox',   'Traditions orthodoxes orientales : Pères de l''Église, divine liturgie, icônes.', 'Eastern Orthodox traditions: Church Fathers, Divine Liturgy, icons.', 3),
  ('heritage',   'Curieux & Patrimoine', 'Curious & Heritage', 'Pour les non-croyants intéressés par l''histoire, l''art et le patrimoine chrétiens.', 'For non-believers interested in Christian history, art, and heritage.', 4)
ON CONFLICT (code) DO NOTHING;
