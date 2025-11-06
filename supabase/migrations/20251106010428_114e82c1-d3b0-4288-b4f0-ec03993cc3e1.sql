-- Add is_hidden column to forum_posts
ALTER TABLE public.forum_posts 
ADD COLUMN is_hidden boolean NOT NULL DEFAULT false,
ADD COLUMN hidden_reason text,
ADD COLUMN hidden_at timestamp with time zone,
ADD COLUMN hidden_by uuid REFERENCES auth.users(id);

-- Create forum_post_reports table for user reports
CREATE TABLE public.forum_post_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamp with time zone,
  UNIQUE(post_id, reporter_id)
);

-- Enable RLS on forum_post_reports
ALTER TABLE public.forum_post_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view their own reports
CREATE POLICY "Users can view their own reports"
ON public.forum_post_reports
FOR SELECT
USING (auth.uid() = reporter_id);

-- Policy: Authenticated users can create reports
CREATE POLICY "Authenticated users can create reports"
ON public.forum_post_reports
FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

-- Policy: Moderators and admins can view all reports
CREATE POLICY "Moderators can view all reports"
ON public.forum_post_reports
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'moderator')
);

-- Policy: Moderators and admins can update reports
CREATE POLICY "Moderators can update reports"
ON public.forum_post_reports
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'moderator')
);

-- Update forum_posts policies to hide hidden posts
DROP POLICY IF EXISTS "Anyone can view forum posts" ON public.forum_posts;

CREATE POLICY "Anyone can view non-hidden forum posts"
ON public.forum_posts
FOR SELECT
USING (
  is_hidden = false OR 
  auth.uid() = author_id OR
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'moderator')
);

-- Policy: Moderators can update posts to hide them
CREATE POLICY "Moderators can hide posts"
ON public.forum_posts
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'moderator')
);

-- Create index for better performance
CREATE INDEX idx_forum_post_reports_status ON public.forum_post_reports(status);
CREATE INDEX idx_forum_post_reports_post_id ON public.forum_post_reports(post_id);
CREATE INDEX idx_forum_posts_is_hidden ON public.forum_posts(is_hidden);