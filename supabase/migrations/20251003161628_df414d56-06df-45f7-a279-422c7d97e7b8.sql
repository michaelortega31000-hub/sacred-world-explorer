-- Table pour les tiers premium
CREATE TABLE public.subscription_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  price_monthly DECIMAL(10,2),
  stripe_price_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insérer les tiers par défaut
INSERT INTO public.subscription_tiers (name, description, features, price_monthly) VALUES
('free', 'Accès gratuit de base', '["basic_access", "photo_gallery"]', 0.00),
('premium', 'Accès premium standard', '["basic_access", "photo_gallery", "audio_immersive", "360_photos"]', 9.99),
('premium_vr', 'Accès premium avec VR/AR', '["basic_access", "photo_gallery", "audio_immersive", "360_photos", "vr_experience", "ar_mode"]', 19.99);

-- Ajouter les colonnes subscription à la table profiles existante
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' REFERENCES public.subscription_tiers(name),
ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Table pour le contenu VR des lieux
CREATE TABLE public.vr_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('photo_360', 'video_360', 'model_3d', 'panorama')),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  position JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour recherche rapide par lieu
CREATE INDEX idx_vr_content_place_id ON public.vr_content(place_id);
CREATE INDEX idx_vr_content_type ON public.vr_content(content_type);
CREATE INDEX idx_vr_content_active ON public.vr_content(is_active);

-- Enable RLS
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vr_content ENABLE ROW LEVEL SECURITY;

-- Policies pour subscription_tiers (lecture publique)
CREATE POLICY "Tiers are viewable by everyone"
ON public.subscription_tiers
FOR SELECT
USING (true);

-- Policies pour vr_content (lecture publique du contenu actif)
CREATE POLICY "Active VR content is viewable by everyone"
ON public.vr_content
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage VR content"
ON public.vr_content
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Triggers pour updated_at sur vr_content
CREATE TRIGGER update_vr_content_updated_at
BEFORE UPDATE ON public.vr_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Créer les buckets de stockage pour le contenu VR
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('vr-content', 'vr-content', true),
  ('vr-thumbnails', 'vr-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Policies pour le stockage VR
CREATE POLICY "VR content is publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'vr-content');

CREATE POLICY "Authenticated users can upload VR content"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'vr-content' AND auth.uid() IS NOT NULL);

CREATE POLICY "VR thumbnails are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'vr-thumbnails');

CREATE POLICY "Authenticated users can upload VR thumbnails"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'vr-thumbnails' AND auth.uid() IS NOT NULL);