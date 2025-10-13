-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT[] NOT NULL DEFAULT '{}',
  cuisine TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT,
  rating NUMERIC(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  website TEXT,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  verified BOOLEAN DEFAULT false,
  google_place_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view verified restaurants"
ON public.restaurants
FOR SELECT
USING (verified = true);

CREATE POLICY "Authenticated users can create restaurants"
ON public.restaurants
FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own restaurants"
ON public.restaurants
FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Admins can verify restaurants"
ON public.restaurants
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Create trigger for updated_at
CREATE TRIGGER update_restaurants_updated_at
BEFORE UPDATE ON public.restaurants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_restaurants_country_city ON public.restaurants(country, city);
CREATE INDEX idx_restaurants_type ON public.restaurants USING GIN(type);