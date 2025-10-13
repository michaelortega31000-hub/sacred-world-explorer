-- Add columns to save planned route information
ALTER TABLE public.user_progress 
ADD COLUMN planned_route_start_city TEXT NOT NULL DEFAULT '',
ADD COLUMN show_planned_route BOOLEAN NOT NULL DEFAULT false;