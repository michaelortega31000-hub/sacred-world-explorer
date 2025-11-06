-- Add filter_traditions column to user_event_reminders table
ALTER TABLE public.user_event_reminders 
ADD COLUMN filter_traditions text[] DEFAULT NULL;

COMMENT ON COLUMN public.user_event_reminders.filter_traditions IS 'Array of tradition filters: christianity, islam, judaism, hinduism, buddhism, other. NULL means use user selected religion only. Empty array means all traditions.';