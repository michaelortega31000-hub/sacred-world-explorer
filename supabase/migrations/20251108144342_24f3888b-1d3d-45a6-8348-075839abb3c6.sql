-- Create user storage quotas table
CREATE TABLE IF NOT EXISTS public.user_storage_quotas (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  used_bytes BIGINT DEFAULT 0 NOT NULL CHECK (used_bytes >= 0),
  quota_bytes BIGINT DEFAULT 104857600 NOT NULL CHECK (quota_bytes > 0), -- 100MB default
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_storage_quotas ENABLE ROW LEVEL SECURITY;

-- Users can view their own quota
CREATE POLICY "Users can view own storage quota"
ON public.user_storage_quotas
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only system (via service role) can modify quotas
-- No INSERT, UPDATE, DELETE policies for regular users

-- Create updated_at trigger
CREATE TRIGGER update_user_storage_quotas_updated_at
BEFORE UPDATE ON public.user_storage_quotas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_storage_quotas_user_id 
ON public.user_storage_quotas(user_id);

-- Create a function to initialize quota for a user
CREATE OR REPLACE FUNCTION public.initialize_user_storage_quota(p_user_id UUID)
RETURNS public.user_storage_quotas
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_quota public.user_storage_quotas;
BEGIN
  INSERT INTO public.user_storage_quotas (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING * INTO v_quota;
  
  IF v_quota IS NULL THEN
    SELECT * INTO v_quota
    FROM public.user_storage_quotas
    WHERE user_id = p_user_id;
  END IF;
  
  RETURN v_quota;
END;
$$;

-- Create a function to get user's storage usage percentage
CREATE OR REPLACE FUNCTION public.get_storage_usage_percentage(p_user_id UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN quota_bytes > 0 THEN ROUND((used_bytes::NUMERIC / quota_bytes::NUMERIC) * 100, 2)
      ELSE 0
    END
  FROM public.user_storage_quotas
  WHERE user_id = p_user_id;
$$;