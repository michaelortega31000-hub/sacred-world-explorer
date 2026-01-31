-- Add coordinates column to restaurants table for proximity filtering
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS coordinates jsonb;

-- Add comment to explain the column
COMMENT ON COLUMN public.restaurants.coordinates IS 'GPS coordinates in format {"lat": number, "lng": number} for proximity filtering';