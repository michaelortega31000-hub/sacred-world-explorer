-- Add DELETE RLS policies for user data ownership and GDPR compliance

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Allow users to delete their own subscription data
CREATE POLICY "Users can delete their own subscription"
ON public.user_subscriptions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);