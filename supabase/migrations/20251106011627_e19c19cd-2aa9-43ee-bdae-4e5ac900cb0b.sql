-- Create activity_likes table
CREATE TABLE public.activity_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('memory', 'badge', 'visit')),
  activity_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, activity_type, activity_id)
);

-- Create activity_comments table
CREATE TABLE public.activity_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('memory', 'badge', 'visit')),
  activity_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_comments ENABLE ROW LEVEL SECURITY;

-- Policies for activity_likes
CREATE POLICY "Authenticated users can view all likes"
ON public.activity_likes
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create likes"
ON public.activity_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
ON public.activity_likes
FOR DELETE
USING (auth.uid() = user_id);

-- Policies for activity_comments
CREATE POLICY "Authenticated users can view all comments"
ON public.activity_comments
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON public.activity_comments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.activity_comments
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.activity_comments
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at on comments
CREATE TRIGGER update_activity_comments_updated_at
BEFORE UPDATE ON public.activity_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_activity_likes_user_id ON public.activity_likes(user_id);
CREATE INDEX idx_activity_likes_activity ON public.activity_likes(activity_type, activity_id);
CREATE INDEX idx_activity_comments_activity ON public.activity_comments(activity_type, activity_id);
CREATE INDEX idx_activity_comments_user_id ON public.activity_comments(user_id);