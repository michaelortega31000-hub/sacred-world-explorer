-- Add unique constraint to rate_limits table for proper ON CONFLICT handling
ALTER TABLE rate_limits 
ADD CONSTRAINT rate_limits_user_action_unique 
UNIQUE (user_id, action);