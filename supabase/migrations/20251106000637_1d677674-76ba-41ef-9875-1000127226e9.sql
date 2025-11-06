-- Add streak tracking columns to user_progress table
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS last_quest_date TEXT DEFAULT '' NOT NULL,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0 NOT NULL;

-- Create index for faster queries on last_quest_date
CREATE INDEX IF NOT EXISTS idx_user_progress_last_quest_date ON public.user_progress(last_quest_date);