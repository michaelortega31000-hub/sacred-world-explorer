-- Create places table to store sacred place information
CREATE TABLE IF NOT EXISTS public.places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  points_value INTEGER NOT NULL DEFAULT 50,
  coordinates JSONB NOT NULL,
  image_url TEXT,
  religion TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on places table
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read places (public data for app functionality)
CREATE POLICY "Places are viewable by everyone"
ON public.places
FOR SELECT
USING (true);

-- Only admins can modify places
CREATE POLICY "Admins can manage places"
ON public.places
FOR ALL
USING (public.is_admin());

-- Add index on place id for fast lookups
CREATE INDEX idx_places_id ON public.places(id);

-- Add index on country for filtering
CREATE INDEX idx_places_country ON public.places(country);

-- Add trigger for updated_at
CREATE TRIGGER update_places_updated_at
  BEFORE UPDATE ON public.places
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.places IS 'Sacred places around the world with point values';
COMMENT ON COLUMN public.places.points_value IS 'Points awarded when user visits this place';
COMMENT ON COLUMN public.places.coordinates IS 'Longitude and latitude as [lon, lat]';