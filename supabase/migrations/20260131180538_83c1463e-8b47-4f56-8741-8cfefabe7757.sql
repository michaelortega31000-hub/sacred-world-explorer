-- =============================================
-- Table: hotels
-- =============================================
CREATE TABLE public.hotels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  coordinates JSONB NOT NULL DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
  star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
  price_range TEXT CHECK (price_range IN ('budget', 'mid', 'luxury')),
  hotel_type TEXT[] DEFAULT '{}'::text[],
  amenities TEXT[] DEFAULT '{}'::text[],
  phone TEXT,
  website TEXT,
  description TEXT,
  verified BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hotels
CREATE POLICY "Everyone can view verified hotels"
ON public.hotels
FOR SELECT
USING (verified = true);

CREATE POLICY "Authenticated users can create hotels"
ON public.hotels
FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update hotels"
ON public.hotels
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete hotels"
ON public.hotels
FOR DELETE
USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_hotels_updated_at
BEFORE UPDATE ON public.hotels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- Table: transport_stops
-- =============================================
CREATE TABLE public.transport_stops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  coordinates JSONB NOT NULL DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
  transport_type TEXT NOT NULL CHECK (transport_type IN ('metro', 'bus', 'tram', 'train', 'airport', 'ferry')),
  line_name TEXT,
  operator TEXT,
  accessibility BOOLEAN DEFAULT false,
  connections TEXT[] DEFAULT '{}'::text[],
  description TEXT,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transport_stops ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transport_stops
CREATE POLICY "Everyone can view verified transport stops"
ON public.transport_stops
FOR SELECT
USING (verified = true);

CREATE POLICY "Admins can insert transport stops"
ON public.transport_stops
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can update transport stops"
ON public.transport_stops
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can delete transport stops"
ON public.transport_stops
FOR DELETE
USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_transport_stops_updated_at
BEFORE UPDATE ON public.transport_stops
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster city-based queries
CREATE INDEX idx_hotels_city ON public.hotels(city);
CREATE INDEX idx_hotels_country ON public.hotels(country);
CREATE INDEX idx_transport_stops_city ON public.transport_stops(city);
CREATE INDEX idx_transport_stops_country ON public.transport_stops(country);
CREATE INDEX idx_transport_stops_type ON public.transport_stops(transport_type);