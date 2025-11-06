-- Table pour stocker les préférences de rappel des utilisateurs
CREATE TABLE IF NOT EXISTS public.event_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reminder_times INTEGER[] NOT NULL DEFAULT ARRAY[1440, 60], -- Minutes avant l'événement (1440 = 1 jour, 60 = 1 heure)
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Index pour rechercher efficacement les rappels à envoyer
CREATE INDEX idx_event_reminders_user_id ON public.event_reminders(user_id);
CREATE INDEX idx_event_reminders_event_date ON public.event_reminders(event_date);
CREATE INDEX idx_event_reminders_enabled ON public.event_reminders(is_enabled) WHERE is_enabled = true;

-- Enable Row Level Security
ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;

-- Policies pour event_reminders
CREATE POLICY "Users can view their own reminders"
ON public.event_reminders
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders"
ON public.event_reminders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
ON public.event_reminders
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
ON public.event_reminders
FOR DELETE
USING (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_event_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger pour updated_at
CREATE TRIGGER update_event_reminders_updated_at
BEFORE UPDATE ON public.event_reminders
FOR EACH ROW
EXECUTE FUNCTION public.update_event_reminders_updated_at();