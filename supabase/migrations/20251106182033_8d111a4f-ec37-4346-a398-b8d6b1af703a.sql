-- Create default_avatars table for predefined avatars
CREATE TABLE IF NOT EXISTS public.default_avatars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar_url text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.default_avatars ENABLE ROW LEVEL SECURITY;

-- Everyone can view active default avatars
CREATE POLICY "Active default avatars are viewable by everyone"
  ON public.default_avatars
  FOR SELECT
  USING (is_active = true);

-- Only admins can manage default avatars
CREATE POLICY "Admins can manage default avatars"
  ON public.default_avatars
  FOR ALL
  USING (is_admin());

-- Insert some default avatars
INSERT INTO public.default_avatars (name, avatar_url, category, display_order) VALUES
  ('Avatar Spirituel 1', 'https://api.dicebear.com/7.x/bottts/svg?seed=spiritual1&backgroundColor=b6e3f4', 'spiritual', 1),
  ('Avatar Spirituel 2', 'https://api.dicebear.com/7.x/bottts/svg?seed=spiritual2&backgroundColor=c0aede', 'spiritual', 2),
  ('Avatar Spirituel 3', 'https://api.dicebear.com/7.x/bottts/svg?seed=spiritual3&backgroundColor=d1d4f9', 'spiritual', 3),
  ('Avatar Nature 1', 'https://api.dicebear.com/7.x/thumbs/svg?seed=nature1&backgroundColor=92f5a8', 'nature', 4),
  ('Avatar Nature 2', 'https://api.dicebear.com/7.x/thumbs/svg?seed=nature2&backgroundColor=a8f592', 'nature', 5),
  ('Avatar Moderne 1', 'https://api.dicebear.com/7.x/lorelei/svg?seed=modern1&backgroundColor=ffdfbf', 'modern', 6),
  ('Avatar Moderne 2', 'https://api.dicebear.com/7.x/lorelei/svg?seed=modern2&backgroundColor=ffc6ff', 'modern', 7),
  ('Avatar Abstrait 1', 'https://api.dicebear.com/7.x/shapes/svg?seed=abstract1&backgroundColor=b6e3f4', 'abstract', 8),
  ('Avatar Abstrait 2', 'https://api.dicebear.com/7.x/shapes/svg?seed=abstract2&backgroundColor=ffd5dc', 'abstract', 9);