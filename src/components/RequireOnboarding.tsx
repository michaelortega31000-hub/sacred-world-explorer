import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

interface Props {
  children: JSX.Element;
}

// Use this AFTER <RequireAuth>. If the authenticated user hasn't picked a
// track yet (denomination_id IS NULL on profiles), redirect to the onboarding
// flow regardless of original destination.
export const RequireOnboarding = ({ children }: Props) => {
  const { session, userProgress } = useApp();
  const track = (useApp() as any).track;
  const location = useLocation();

  // Dev-only: bypass the gate so designers can preview every surface without a session.
  if (import.meta.env.DEV) return children;

  // Wait for the profile fetch to settle before deciding.
  if (!session) return null;

  const onboardingComplete = !!track && !!(userProgress as any).onboardedAt;
  if (!onboardingComplete && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding/denomination" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
};
