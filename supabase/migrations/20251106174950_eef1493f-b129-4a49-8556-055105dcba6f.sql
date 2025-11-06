-- Create user custom avatars table
CREATE TABLE public.user_custom_avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_url TEXT NOT NULL,
  name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, avatar_url)
);

-- Enable RLS
ALTER TABLE public.user_custom_avatars ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own avatars"
  ON public.user_custom_avatars
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own avatars"
  ON public.user_custom_avatars
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own avatars"
  ON public.user_custom_avatars
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own avatars"
  ON public.user_custom_avatars
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_custom_avatars_user ON public.user_custom_avatars(user_id);
CREATE INDEX idx_user_custom_avatars_active ON public.user_custom_avatars(user_id, is_active) WHERE is_active = true;

-- Create function to set avatar as active (deactivate others)
CREATE OR REPLACE FUNCTION public.set_active_avatar(p_avatar_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the user_id of the avatar
  SELECT user_id INTO v_user_id
  FROM public.user_custom_avatars
  WHERE id = p_avatar_id;
  
  -- Check if user owns this avatar
  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  
  -- Deactivate all user's avatars
  UPDATE public.user_custom_avatars
  SET is_active = false
  WHERE user_id = v_user_id;
  
  -- Activate the selected avatar
  UPDATE public.user_custom_avatars
  SET is_active = true
  WHERE id = p_avatar_id;
  
  -- Update profile avatar_url
  UPDATE public.profiles
  SET avatar_url = (
    SELECT avatar_url 
    FROM public.user_custom_avatars 
    WHERE id = p_avatar_id
  )
  WHERE id = v_user_id;
END;
$$;