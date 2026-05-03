import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

interface Props {
  children: JSX.Element;
}

// Use this AFTER <RequireAuth>. Waits for the profile to load before deciding
// whether to redirect to the onboarding flow.
export const RequireOnboarding = ({ children }: Props) => {
  const { session, track, profileLoaded } = useApp();
  const location = useLocation();

  // Dev-only: bypass the gate so designers can preview every surface without a session.
  if (import.meta.env.DEV) return children;

  if (!session) return null;

  // Wait for profile fetch before making routing decisions.
  if (!profileLoaded) return null;

  const onboardingComplete = !!track;
  if (!onboardingComplete && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding/denomination" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
};
