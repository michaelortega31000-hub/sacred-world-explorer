-- Drop the user update policy on rate_limits to prevent manipulation
DROP POLICY IF EXISTS "Users can update their own rate limits" ON rate_limits;

-- Create a strict policy that prevents users from modifying rate limits directly
-- Only the system (via edge functions with service role) can manage rate limits
CREATE POLICY "Users can only read own rate limits"
ON rate_limits
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- No INSERT, UPDATE, or DELETE policies for regular users
-- Edge functions will use service role to bypass RLS