-- Add moderation columns to user_custom_avatars
ALTER TABLE public.user_custom_avatars
ADD COLUMN moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN moderation_reason TEXT,
ADD COLUMN moderated_at TIMESTAMP WITH TIME ZONE;

-- Create index for moderation queries
CREATE INDEX idx_user_custom_avatars_moderation ON public.user_custom_avatars(moderation_status, moderated_at);

-- Update existing rows to approved status
UPDATE public.user_custom_avatars 
SET moderation_status = 'approved', 
    moderated_at = now() 
WHERE moderation_status = 'pending';