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
      {/* Option Hors-ligne en haut */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 animate-fade-in">
        <Button
          onClick={handleOfflineMode}
          variant="outline"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <WifiOff className="w-4 h-4 mr-2" />
          Mode hors-ligne
        </Button>
      </div>

      <div className="text-center max-w-4xl w-full space-y-10">
        {/* Logo et titre */}
        <div className="animate-fade-in">
          <div className="mb-6 flex justify-center">
            <img 
              src={logo} 
              alt="SacredWorld Logo" 
              className="w-32 h-32 md:w-40 md:h-40"
              style={{
                animation: 'logoEntry 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              }}
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
            SacredWorld
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 font-light mb-2">
            Les lieux sacrés du monde entier dans ta poche
          </p>
          
          <p className="text-base text-white/70">
            Explore. Découvre. Collectionne.
          </p>
        </div>

        {/* Titre de sélection */}
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h2 className="text-2xl font-semibold text-white mb-6">
            Choisis ton mode d'exploration
          </h2>
        </div>

        {/* Cartes de sélection des modes */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '500ms' }}>
          {/* Mode Basique - Cliquable */}
          <Card 
            className="border-2 border-primary hover:border-primary/80 bg-white cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={handleAuth}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Mode Basique</CardTitle>
              <Badge className="bg-green-100 text-green-700 mt-2 w-fit mx-auto">
                Gratuit
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-left">
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
              <div className="flex items-start gap-2 text-sm">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>Communauté et messagerie</span>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  style={{
                    background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                    color: 'black'
                  }}
                >
                  Commencer gratuitement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mode Premium - Non cliquable (bientôt disponible) */}
          <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 relative overflow-hidden opacity-90">
            <div className="absolute top-0 right-0 bg-yellow-500 text-white px-4 py-1 text-sm font-semibold transform rotate-12 translate-x-8 translate-y-2">
              Bientôt
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                <Crown className="w-10 h-10 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl">Mode Premium</CardTitle>
              <Badge className="bg-yellow-500 text-white mt-2 w-fit mx-auto">
                Prochainement
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-left">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Crown className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
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
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Crown className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <span>Sans publicités</span>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full bg-gray-300 text-gray-500 cursor-not-allowed" 
                  size="lg"
                  disabled
                >
                  Bientôt disponible
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Note en bas */}
        <div className="text-center text-white/60 text-sm animate-fade-in" style={{ animationDelay: '700ms' }}>
          <p>En choisissant le mode Basique, tu pourras créer un compte ou te connecter</p>
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
