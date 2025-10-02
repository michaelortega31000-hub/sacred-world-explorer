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
    // Vérifier la connexion réseau
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/selection');
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  const handleOfflineMode = () => {
    navigate('/welcome');
  };

  const handleAuth = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative" style={{ background: 'linear-gradient(135deg, hsl(220 70% 45%) 0%, hsl(0 84% 48%) 100%)' }}>
      {/* Bannière hors-ligne */}
      {isOffline && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg animate-fade-in">
          <WifiOff className="w-4 h-4" />
          <span>Hors-ligne — carte simplifiée</span>
        </div>
      )}

      <div className="text-center max-w-4xl w-full space-y-8">
        {/* Logo et titre */}
        <div className="animate-fade-in">
          <div className="mb-6 flex justify-center">
            <img 
              src={logo} 
              alt="SacredWorld Logo" 
              className="w-24 h-24 md:w-32 md:h-32"
              style={{
                animation: 'logoEntry 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              }}
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            SacredWorld
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 font-light mb-2">
            Les lieux sacrés du monde entier dans ta poche
          </p>
          
          <p className="text-sm text-white/70">
            Explore. Découvre. Collectionne.
          </p>
        </div>

        {/* Bouton Mode Hors-ligne */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Button
            onClick={handleOfflineMode}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <WifiOff className="w-4 h-4 mr-2" />
            Continuer hors-ligne
          </Button>
        </div>

        {/* Section Authentification */}
        <div className="animate-fade-in space-y-4" style={{ animationDelay: '400ms' }}>
          <div className="text-white/80 text-sm font-medium">
            Pour profiter de toutes les fonctionnalités
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleAuth}
              size="lg"
              className="text-base font-semibold"
              style={{
                background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                color: 'black'
              }}
            >
              Créer un compte
            </Button>
            
            <Button
              onClick={handleAuth}
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-base font-semibold"
            >
              Se connecter
            </Button>
          </div>
        </div>

        {/* Cartes des modes */}
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '600ms' }}>
          {/* Mode Basique */}
          <Card className="border-2 border-primary/50 bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Mode Basique</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Gratuit
                </Badge>
              </CardTitle>
              <CardDescription>
                Toutes les fonctionnalités essentielles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>Accès à tous les lieux sacrés</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>Système de points et badges</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>Quiz quotidiens et quêtes</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>Planificateur de voyages</span>
              </div>
            </CardContent>
          </Card>

          {/* Mode Premium */}
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Mode Premium</span>
                <Badge className="bg-yellow-500 text-white">
                  Bientôt
                </Badge>
              </CardTitle>
              <CardDescription className="text-yellow-800">
                Fonctionnalités exclusives à venir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <span>Tout du mode Basique</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Crown className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <span>Contenu exclusif premium</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Crown className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <span>Guides audio immersifs</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Crown className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <span>Statistiques avancées</span>
              </div>
            </CardContent>
          </Card>
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
