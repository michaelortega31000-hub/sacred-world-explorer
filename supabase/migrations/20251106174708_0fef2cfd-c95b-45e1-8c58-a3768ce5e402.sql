-- Create rewards table
CREATE TABLE public.level_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_required INTEGER NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('avatar', 'theme', 'badge', 'title')),
  reward_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(level_required, reward_type, reward_id)
);

-- Create user unlocked rewards table
CREATE TABLE public.user_unlocked_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.level_rewards(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_equipped BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, reward_id)
);

-- Enable RLS
ALTER TABLE public.level_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_unlocked_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for level_rewards
CREATE POLICY "Active rewards are viewable by everyone"
  ON public.level_rewards
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage rewards"
  ON public.level_rewards
  FOR ALL
  USING (public.is_admin());

-- RLS Policies for user_unlocked_rewards
CREATE POLICY "Users can view their own unlocked rewards"
  ON public.user_unlocked_rewards
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own unlocked rewards"
  ON public.user_unlocked_rewards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own unlocked rewards"
  ON public.user_unlocked_rewards
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_level_rewards_level ON public.level_rewards(level_required);
CREATE INDEX idx_level_rewards_type ON public.level_rewards(reward_type);
CREATE INDEX idx_user_unlocked_rewards_user ON public.user_unlocked_rewards(user_id);
CREATE INDEX idx_user_unlocked_rewards_equipped ON public.user_unlocked_rewards(user_id, is_equipped) WHERE is_equipped = true;

-- Insert default rewards
INSERT INTO public.level_rewards (level_required, reward_type, reward_id, name, description, icon, rarity, metadata) VALUES
-- Level 1 rewards
(1, 'badge', 'novice_explorer', 'Explorateur Novice', 'Ton premier badge d''explorateur spirituel', '🎖️', 'common', '{"color": "#8B5CF6"}'::jsonb),
(1, 'title', 'beginner', 'Débutant', 'Titre de débutant', '🌱', 'common', '{"prefix": true}'::jsonb),

-- Level 2 rewards
(2, 'avatar', 'sacred_compass', 'Boussole Sacrée', 'Avatar de boussole spirituelle', '🧭', 'common', '{"image": "compass"}'::jsonb),
(2, 'theme', 'sunrise', 'Thème Aurore', 'Couleurs de l''aube spirituelle', '🌅', 'rare', '{"colors": {"primary": "280 70% 60%", "accent": "45 93% 47%"}}'::jsonb),

-- Level 3 rewards
(3, 'badge', 'pilgrim', 'Pèlerin', 'Badge de pèlerin accompli', '🎯', 'rare', '{"color": "#34E0A1"}'::jsonb),
(3, 'avatar', 'lotus_flower', 'Fleur de Lotus', 'Avatar de lotus sacré', '🪷', 'rare', '{"image": "lotus"}'::jsonb),

-- Level 5 rewards
(5, 'badge', 'devoted_traveler', 'Voyageur Dévoué', 'Pour 5 niveaux d''exploration', '⭐', 'epic', '{"color": "#A855F7"}'::jsonb),
(5, 'theme', 'celestial', 'Thème Céleste', 'Couleurs des cieux sacrés', '✨', 'epic', '{"colors": {"primary": "240 80% 65%", "accent": "280 75% 65%"}}'::jsonb),
(5, 'title', 'seeker', 'Chercheur', 'Titre de chercheur de vérité', '🔍', 'epic', '{"prefix": false}'::jsonb),

-- Level 10 rewards
(10, 'badge', 'master_explorer', 'Maître Explorateur', 'Badge de maître explorateur', '👑', 'legendary', '{"color": "#F4C542"}'::jsonb),
(10, 'avatar', 'golden_temple', 'Temple Doré', 'Avatar de temple légendaire', '🏛️', 'legendary', '{"image": "temple"}'::jsonb),
(10, 'theme', 'divine', 'Thème Divin', 'Thème légendaire aux couleurs divines', '🌟', 'legendary', '{"colors": {"primary": "45 96% 53%", "accent": "320 75% 65%"}}'::jsonb),
(10, 'title', 'enlightened', 'Illuminé', 'Titre d''illuminé spirituel', '💫', 'legendary', '{"prefix": true}'::jsonb);

-- Create function to check and unlock rewards on level up
CREATE OR REPLACE FUNCTION public.unlock_level_rewards(p_user_id UUID, p_new_level INTEGER)
RETURNS SETOF public.level_rewards
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert unlocked rewards for this level that user doesn't have yet
  INSERT INTO public.user_unlocked_rewards (user_id, reward_id)
  SELECT p_user_id, lr.id
  FROM public.level_rewards lr
  WHERE lr.level_required = p_new_level
    AND lr.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM public.user_unlocked_rewards uur
      WHERE uur.user_id = p_user_id AND uur.reward_id = lr.id
    );
  
  -- Return all newly unlocked rewards
  RETURN QUERY
  SELECT lr.*
  FROM public.level_rewards lr
  WHERE lr.level_required = p_new_level
    AND lr.is_active = true;
END;
$$;