-- Create user roles table and fix admin authorization

-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- RLS policy: Only admins can manage roles (we'll bootstrap the first admin manually)
CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create security definer function to check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create convenience function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Drop old insecure admin policies
DROP POLICY IF EXISTS "Admins can verify restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Admins can manage VR content" ON public.vr_content;

-- Create secure admin policies for restaurants
CREATE POLICY "Admins can verify restaurants"
ON public.restaurants FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete restaurants"
ON public.restaurants FOR DELETE
USING (public.is_admin());

-- Create secure admin policies for vr_content
CREATE POLICY "Admins can manage VR content"
ON public.vr_content FOR ALL
USING (public.is_admin());

-- Add database-level length constraints for input validation
ALTER TABLE public.forum_topics
  ADD CONSTRAINT check_title_length CHECK (char_length(title) <= 200),
  ADD CONSTRAINT check_description_length CHECK (char_length(description) <= 2000);

ALTER TABLE public.forum_posts
  ADD CONSTRAINT check_content_length CHECK (char_length(content) <= 5000);

ALTER TABLE public.messages
  ADD CONSTRAINT check_message_length CHECK (char_length(content) <= 2000);

ALTER TABLE public.restaurants
  ADD CONSTRAINT check_name_length CHECK (char_length(name) <= 200),
  ADD CONSTRAINT check_cuisine_length CHECK (char_length(cuisine) <= 100),
  ADD CONSTRAINT check_address_length CHECK (char_length(address) <= 300),
  ADD CONSTRAINT check_city_length CHECK (char_length(city) <= 100),
  ADD CONSTRAINT check_country_length CHECK (char_length(country) <= 100),
  ADD CONSTRAINT check_phone_length CHECK (char_length(phone) <= 20),
  ADD CONSTRAINT check_website_length CHECK (char_length(website) <= 500),
  ADD CONSTRAINT check_description_length CHECK (char_length(description) <= 2000);