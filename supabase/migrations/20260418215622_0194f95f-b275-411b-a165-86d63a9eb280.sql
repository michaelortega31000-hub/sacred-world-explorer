-- 1. Add country_of_origin column (ISO-2 code, nullable)
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS country_of_origin text;

-- 2. Aggregated leaderboard function (no PII, safe for everyone)
CREATE OR REPLACE FUNCTION public.get_country_leaderboard()
RETURNS TABLE(country_code text, total_points bigint, user_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    country_of_origin AS country_code,
    COALESCE(SUM(total_points), 0)::bigint AS total_points,
    COUNT(*)::bigint AS user_count
  FROM public.user_progress
  WHERE country_of_origin IS NOT NULL
  GROUP BY country_of_origin
  ORDER BY total_points DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_country_leaderboard() TO authenticated, anon;