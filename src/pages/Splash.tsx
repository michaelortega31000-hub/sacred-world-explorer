import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WifiOff, Crown, Check } from 'lucide-react';
import logo from '@/assets/sacredworld-logo.jpg';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Splash = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Si connecté, vérifier s'il a choisi un mode
        const hasMode = localStorage.getItem('selectedMode');
        if (hasMode) {
          // Si mode choisi, aller à la sélection de religion
          navigate('/selection');
        } else {
          // Sinon aller au choix du mode
          navigate('/mode-selection');
        }
      }
    });
  }, [navigate]);

  const handleOfflineMode = () => {
    navigate('/welcome');
  };

  const handleAuth = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col p-6 relative" style={{ background: 'linear-gradient(135deg, hsl(220 70% 45%) 0%, hsl(0 84% 48%) 100%)' }}>
      {/* Bouton Mode hors-ligne en haut à droite */}
      <div className="absolute top-4 right-4 z-10 animate-fade-in">
        <Button
          onClick={handleOfflineMode}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <WifiOff className="w-4 h-4 mr-2" />
          Mode hors-ligne
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-2xl w-full space-y-12">
        {/* Logo et titre */}
        <div className="animate-fade-in">
          <div className="mb-8 flex justify-center">
            <img 
              src={logo} 
              alt="SacredWorld Logo" 
              className="w-40 h-40 md:w-48 md:h-48"
              style={{
                animation: 'logoEntry 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              }}
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            SacredWorld
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 font-light mb-3">
            Les lieux sacrés du monde entier dans ta poche
          </p>
          
          <p className="text-lg text-white/70">
            Explore. Découvre. Collectionne.
          </p>
        </div>

        {/* Boutons Connexion et S'inscrire */}
        <div className="animate-fade-in space-y-4" style={{ animationDelay: '300ms' }}>
          <Button
            onClick={handleAuth}
            size="lg"
            className="w-full max-w-md text-lg font-semibold py-6"
            style={{
              background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
              color: 'black'
            }}
          >
            S'inscrire
          </Button>
          
          <Button
            onClick={handleAuth}
            size="lg"
            variant="outline"
            className="w-full max-w-md bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-lg font-semibold py-6"
          >
            Connexion
          </Button>
        </div>
        </div>
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
