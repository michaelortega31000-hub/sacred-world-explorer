-- Add exclusive avatar fields to default_avatars table
ALTER TABLE public.default_avatars
ADD COLUMN IF NOT EXISTS is_exclusive boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS level_required integer,
ADD COLUMN IF NOT EXISTS required_badge_types text[],
ADD COLUMN IF NOT EXISTS rarity text NOT NULL DEFAULT 'common',
ADD COLUMN IF NOT EXISTS unlock_description text;

-- Create user_unlocked_default_avatars table to track unlocked exclusive avatars
CREATE TABLE IF NOT EXISTS public.user_unlocked_default_avatars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  avatar_id uuid NOT NULL REFERENCES public.default_avatars(id) ON DELETE CASCADE,
  unlocked_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, avatar_id)
);

-- Enable RLS
ALTER TABLE public.user_unlocked_default_avatars ENABLE ROW LEVEL SECURITY;

-- Users can view their own unlocked avatars
CREATE POLICY "Users can view their own unlocked avatars"
  ON public.user_unlocked_default_avatars
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own unlocked avatars (for auto-unlock)
CREATE POLICY "Users can insert their own unlocked avatars"
  ON public.user_unlocked_default_avatars
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add some exclusive avatars
INSERT INTO public.default_avatars (name, avatar_url, category, display_order, is_exclusive, level_required, rarity, unlock_description) VALUES
  ('Avatar Légendaire Or', 'https://api.dicebear.com/7.x/bottts/svg?seed=legendary-gold&backgroundColor=ffd700', 'legendary', 100, true, 50, 'legendary', 'Atteindre le niveau 50'),
  ('Avatar Légendaire Platine', 'https://api.dicebear.com/7.x/lorelei/svg?seed=legendary-platinum&backgroundColor=e5e4e2', 'legendary', 101, true, 100, 'legendary', 'Atteindre le niveau 100'),
  ('Avatar Épique Diamant', 'https://api.dicebear.com/7.x/shapes/svg?seed=epic-diamond&backgroundColor=b9f2ff', 'epic', 102, true, 30, 'epic', 'Atteindre le niveau 30'),
  ('Avatar Rare Émeraude', 'https://api.dicebear.com/7.x/thumbs/svg?seed=rare-emerald&backgroundColor=50c878', 'rare', 103, true, 20, 'rare', 'Atteindre le niveau 20'),
  ('Avatar Rare Saphir', 'https://api.dicebear.com/7.x/bottts/svg?seed=rare-sapphire&backgroundColor=0f52ba', 'rare', 104, true, 15, 'rare', 'Atteindre le niveau 15');

-- Insert exclusive avatars requiring specific badge types
INSERT INTO public.default_avatars (name, avatar_url, category, display_order, is_exclusive, required_badge_types, rarity, unlock_description) VALUES
  ('Avatar Explorateur', 'https://api.dicebear.com/7.x/adventurer/svg?seed=explorer&backgroundColor=ffa500', 'achievement', 105, true, ARRAY['place_visit'], 'epic', 'Visiter 50 lieux sacrés'),
  ('Avatar Pèlerin', 'https://api.dicebear.com/7.x/adventurer/svg?seed=pilgrim&backgroundColor=8b4513', 'achievement', 106, true, ARRAY['streak'], 'rare', 'Maintenir une série de 30 jours'),
  ('Avatar Maître Quêtes', 'https://api.dicebear.com/7.x/personas/svg?seed=questmaster&backgroundColor=9370db', 'achievement', 107, true, ARRAY['monthly_quest'], 'epic', 'Compléter 10 quêtes mensuelles');