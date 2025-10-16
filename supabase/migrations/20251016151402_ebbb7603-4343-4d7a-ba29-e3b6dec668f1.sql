-- Create VisitHistory table
CREATE TABLE IF NOT EXISTS public.visit_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_id TEXT NOT NULL,
  visit_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  points_earned INTEGER NOT NULL DEFAULT 0,
  badge_id TEXT,
  audio_played BOOLEAN NOT NULL DEFAULT false,
  gps_location JSONB,
  offline_synced BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visit_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own visit history"
  ON public.visit_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own visit history"
  ON public.visit_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visit history"
  ON public.visit_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own visit history"
  ON public.visit_history FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_visit_history_user_id ON public.visit_history(user_id);
CREATE INDEX idx_visit_history_place_id ON public.visit_history(place_id);
CREATE INDEX idx_visit_history_timestamp ON public.visit_history(visit_timestamp DESC);