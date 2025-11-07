-- Fix function search path for security
DROP FUNCTION IF EXISTS get_security_logs_by_day(integer);

CREATE OR REPLACE FUNCTION get_security_logs_by_day(days integer DEFAULT 7)
RETURNS TABLE (
  date text,
  info bigint,
  warning bigint,
  error bigint,
  critical bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    TO_CHAR(DATE(created_at), 'DD/MM') as date,
    COUNT(*) FILTER (WHERE severity = 'info') as info,
    COUNT(*) FILTER (WHERE severity = 'warning') as warning,
    COUNT(*) FILTER (WHERE severity = 'error') as error,
    COUNT(*) FILTER (WHERE severity = 'critical') as critical
  FROM security_logs
  WHERE created_at >= NOW() - (days || ' days')::interval
  GROUP BY DATE(created_at)
  ORDER BY DATE(created_at) ASC;
$$;