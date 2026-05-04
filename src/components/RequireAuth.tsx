import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { AppLoader } from '@/components/AppLoader';

interface Props {
  children: JSX.Element;
}

export const RequireAuth = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  // Dev-only: bypass the gate so designers can preview every surface without a session.
  if (import.meta.env.DEV) return children;

  if (session === undefined) return <AppLoader />;
  if (session === null) {
    return <Navigate to="/auth" state={{ from: location.pathname + location.search }} replace />;
  }
  return children;
};

