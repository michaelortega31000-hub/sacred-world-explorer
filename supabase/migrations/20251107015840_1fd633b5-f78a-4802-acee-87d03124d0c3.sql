-- Create security_logs table
CREATE TABLE public.security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  severity text NOT NULL,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  endpoint text,
  status_code integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX idx_security_logs_severity ON security_logs(severity);
CREATE INDEX idx_security_logs_created_at ON security_logs(created_at DESC);

-- RLS Policies
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all security logs
CREATE POLICY "Admins can view all security logs"
  ON security_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- System can insert security logs
CREATE POLICY "System can insert security logs"
  ON security_logs FOR INSERT
  WITH CHECK (true);

-- Function to get security logs aggregated by day
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