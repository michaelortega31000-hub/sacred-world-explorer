import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Sparkles, LogIn, UserPlus } from 'lucide-react';
import logo from '@/assets/sacredworld-logo.jpg';
import { supabase } from '@/integrations/supabase/client';

const Splash = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/selection');
        return;
      }
    });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, hsl(220 70% 45%) 0%, hsl(0 84% 48%) 100%)' }}>
      <div className="text-center animate-fade-in max-w-6xl w-full">
        <div className="mb-8 flex justify-center">
          <img 
            src={logo} 
            alt="SacredWorld Logo" 
            className="w-32 h-32 md:w-40 md:h-40 animate-float"
          />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          SacredWorld
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 font-light">
          {isLoading ? t('splash.loading') : 'Découvrez les trésors sacrés du monde'}
        </p>

        {!isLoading && (
          <>
            {/* Boutons de connexion/inscription */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button
                onClick={() => navigate('/auth')}
                size="lg"
                className="gap-2"
                style={{
                  background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
                  color: 'black'
                }}
              >
                <LogIn className="w-5 h-5" />
                Se connecter
              </Button>
              <Button
                onClick={() => navigate('/auth')}
                size="lg"
                variant="outline"
                className="gap-2 bg-white/10 border-white text-white hover:bg-white/20"
              >
                <UserPlus className="w-5 h-5" />
                Créer un compte
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            {/* Plan Basic */}
            <Card className="relative overflow-hidden border-2 border-white/20 bg-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Mode Basic</CardTitle>
                <CardDescription className="text-white/80 text-lg">Gratuit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-white/90">
                  <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Accès à tous les lieux sacrés</span>
                </div>
                <div className="flex items-start gap-2 text-white/90">
                  <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Descriptions et photos</span>
                </div>
                <div className="flex items-start gap-2 text-white/90">
                  <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Système de points</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="w-full bg-white text-blue-600 hover:bg-white/90"
                  size="lg"
                >
                  Commencer gratuitement
                </Button>
              </CardFooter>
            </Card>

            {/* Plan Premium */}
            <Card className="relative overflow-hidden border-2 shadow-2xl" style={{ 
              borderColor: 'hsl(45 100% 51%)',
              background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)'
            }}>
              <div className="absolute top-4 right-4">
                <Crown className="w-8 h-8 text-yellow-900" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-yellow-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Mode Premium
                </CardTitle>
                <CardDescription className="text-yellow-800 text-lg font-semibold">4,99€ / mois</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-yellow-900">
                  <Check className="w-5 h-5 mt-0.5 flex-shrink-0 font-bold" />
                  <span className="font-semibold">Tout du mode Basic</span>
                </div>
                <div className="flex items-start gap-2 text-yellow-900">
                  <Check className="w-5 h-5 mt-0.5 flex-shrink-0 font-bold" />
                  <span className="font-semibold">Mode audio immersif 🎧</span>
                </div>
                <div className="flex items-start gap-2 text-yellow-900">
                  <Check className="w-5 h-5 mt-0.5 flex-shrink-0 font-bold" />
                  <span className="font-semibold">Histoires détaillées racontées</span>
                </div>
                <div className="flex items-start gap-2 text-yellow-900">
                  <Check className="w-5 h-5 mt-0.5 flex-shrink-0 font-bold" />
                  <span className="font-semibold">Expérience sans publicité</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="w-full bg-yellow-900 text-yellow-50 hover:bg-yellow-800"
                  size="lg"
                >
                  Essayer Premium
                </Button>
              </CardFooter>
            </Card>
          </div>
          </>
        )}

        {isLoading && (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Splash;
