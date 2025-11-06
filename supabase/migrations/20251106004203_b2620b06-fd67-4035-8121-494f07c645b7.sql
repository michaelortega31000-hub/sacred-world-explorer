-- Add columns for quest badges to existing user_badges table
ALTER TABLE public.user_badges 
ADD COLUMN IF NOT EXISTS quest_name TEXT,
ADD COLUMN IF NOT EXISTS quest_description TEXT,
ADD COLUMN IF NOT EXISTS quest_icon TEXT;