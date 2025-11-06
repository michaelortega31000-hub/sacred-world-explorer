-- Clean up existing avatar URLs that have cache busters
-- This migration is idempotent and safe to run multiple times
UPDATE profiles 
SET avatar_url = split_part(avatar_url, '?', 1) 
WHERE avatar_url LIKE '%?t=%';