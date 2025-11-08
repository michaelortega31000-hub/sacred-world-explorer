-- Add activity_type column to location_history
ALTER TABLE public.location_history
ADD COLUMN activity_type TEXT DEFAULT 'walking' CHECK (activity_type IN ('walking', 'cycling', 'transport', 'unknown'));

-- Add speed column to store calculated speed in km/h
ALTER TABLE public.location_history
ADD COLUMN speed NUMERIC;

-- Create index on activity_type for faster filtering
CREATE INDEX idx_location_history_activity_type ON public.location_history(activity_type);