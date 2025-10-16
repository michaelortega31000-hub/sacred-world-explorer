-- Add saved_restaurants column to user_progress table
ALTER TABLE public.user_progress 
ADD COLUMN saved_restaurants TEXT[] NOT NULL DEFAULT '{}'::TEXT[];