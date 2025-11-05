-- Create user event reminders table
CREATE TABLE public.user_event_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id VARCHAR(50) NOT NULL,
  reminder_type VARCHAR(20) NOT NULL, -- '1_week', '1_day', 'same_day'
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for performance
CREATE INDEX idx_user_event_reminders_user ON public.user_event_reminders(user_id);
CREATE INDEX idx_user_event_reminders_event ON public.user_event_reminders(event_id);

-- Enable RLS
ALTER TABLE public.user_event_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own reminders"
  ON public.user_event_reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
  ON public.user_event_reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
  ON public.user_event_reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
  ON public.user_event_reminders FOR DELETE
  USING (auth.uid() = user_id);

-- Create user custom events table
CREATE TABLE public.user_custom_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  tradition VARCHAR(50),
  color VARCHAR(7) DEFAULT '#8B5CF6',
  is_recurring BOOLEAN DEFAULT false,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for performance
CREATE INDEX idx_user_custom_events_user ON public.user_custom_events(user_id);
CREATE INDEX idx_user_custom_events_date ON public.user_custom_events(event_date);

-- Enable RLS
ALTER TABLE public.user_custom_events ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own custom events"
  ON public.user_custom_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom events"
  ON public.user_custom_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom events"
  ON public.user_custom_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom events"
  ON public.user_custom_events FOR DELETE
  USING (auth.uid() = user_id);