-- Create location_history table for tracking user positions
CREATE TABLE public.location_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  accuracy NUMERIC,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.location_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own location history"
ON public.location_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own location history"
ON public.location_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own location history"
ON public.location_history
FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_location_history_user_id ON public.location_history(user_id);
CREATE INDEX idx_location_history_recorded_at ON public.location_history(recorded_at DESC);

-- Auto-cleanup: delete records older than 7 days
CREATE OR REPLACE FUNCTION public.cleanup_old_location_history()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.location_history
  WHERE recorded_at < now() - interval '7 days';
END;
$$;