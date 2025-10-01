import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import logo from '@/assets/sacredworld-logo.jpg';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const Splash = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier la connexion réseau
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/selection');
        return;
      }
    });

    // Timer principal: 1.4s avant de passer à la suite
    const mainTimer = setTimeout(() => {
      setIsLoading(false);
      navigate('/welcome');
    }, 1400);

    // Timer skeleton: si ça charge plus de 1.6s, afficher le skeleton
    const skeletonTimer = setTimeout(() => {
      setShowSkeleton(true);
    }, 1600);

    return () => {
      clearTimeout(mainTimer);
      clearTimeout(skeletonTimer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative" style={{ background: 'linear-gradient(135deg, hsl(220 70% 45%) 0%, hsl(0 84% 48%) 100%)' }}>
      {/* Bannière hors-ligne */}
      {isOffline && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg animate-fade-in">
          <WifiOff className="w-4 h-4" />
          <span>Hors-ligne — carte simplifiée</span>
        </div>
      )}

      <div className="text-center max-w-2xl w-full">
        {/* Logo avec animation scale + fade-in */}
        <div className="mb-8 flex justify-center animate-fade-in">
          <img 
            src={logo} 
            alt="SacredWorld Logo" 
            className="w-32 h-32 md:w-40 md:h-40"
            style={{
              animation: 'logoEntry 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            }}
          />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight animate-fade-in">
          SacredWorld
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 font-light animate-fade-in">
          Explore. Découvre. Collectionne.
        </p>

        {/* Skeleton si le chargement prend trop de temps */}
        {showSkeleton && (
          <div className="mt-12 space-y-4 animate-fade-in">
            <Skeleton className="h-12 w-full max-w-md mx-auto bg-white/20" />
            <Skeleton className="h-12 w-full max-w-md mx-auto bg-white/20" />
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              <Skeleton className="h-32 bg-white/20" />
              <Skeleton className="h-32 bg-white/20" />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes logoEntry {
          0% {
            opacity: 0;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Splash;
