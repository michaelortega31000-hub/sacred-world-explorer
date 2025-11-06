-- Add saved_pois column to user_progress table
ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS saved_pois JSONB DEFAULT '[]'::jsonb;