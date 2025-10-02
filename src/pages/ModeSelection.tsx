import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/sacredworld-logo.jpg';

const ModeSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState<'basic' | 'premium' | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  const handleBasicMode = () => {
    setSelectedMode('basic');
    // Stocker le choix du mode dans le localStorage
    localStorage.setItem('selectedMode', 'basic');
    // Rediriger vers la sélection de religion
    navigate('/selection');
  };

  const handlePremiumMode = () => {
    toast({
      title: "Bientôt disponible",
      description: "Le mode Premium sera disponible prochainement !",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative" style={{ background: 'linear-gradient(135deg, hsl(220 70% 45%) 0%, hsl(0 84% 48%) 100%)' }}>
      {/* Bouton déconnexion en haut à droite */}
      <div className="absolute top-6 right-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-white hover:bg-white/10"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      <div className="text-center max-w-5xl w-full space-y-10">
        {/* Logo et titre */}
        <div className="animate-fade-in">
          <div className="mb-6 flex justify-center">
            <img 
              src={logo} 
              alt="SacredWorld Logo" 
              className="w-24 h-24 md:w-32 md:h-32"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Bienvenue sur SacredWorld !
          </h1>
          
          <p className="text-xl text-white/90">
            Choisis ton mode d'exploration
          </p>
        </div>

        {/* Cartes de sélection des modes */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '300ms' }}>
          {/* Mode Basique - Cliquable */}
          <Card 
            className="border-2 border-primary hover:border-primary/80 bg-white cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={handleBasicMode}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-12 h-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl">Mode Basique</CardTitle>
              <Badge className="bg-green-100 text-green-700 mt-3 w-fit mx-auto text-base px-4 py-1">
                Gratuit
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                <span className="text-base">Accès à tous les lieux sacrés du monde</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                <span className="text-base">Système de points et badges</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                <span className="text-base">Quiz quotidiens et quêtes hebdomadaires</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                <span className="text-base">Planificateur de voyages</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                <span className="text-base">Communauté et messagerie</span>
              </div>
              
              <div className="pt-6">
                <Button 
                  className="w-full text-lg py-6" 
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
            <div className="absolute top-0 right-0 bg-yellow-500 text-white px-6 py-2 text-base font-semibold transform rotate-12 translate-x-10 translate-y-4">
              Bientôt
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                <Crown className="w-12 h-12 text-yellow-600" />
              </div>
              <CardTitle className="text-3xl">Mode Premium</CardTitle>
              <Badge className="bg-yellow-500 text-white mt-3 w-fit mx-auto text-base px-4 py-1">
                Prochainement
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Crown className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                <span className="text-base text-muted-foreground">Tout du mode Basique</span>
              </div>
              <div className="flex items-start gap-3">
                <Crown className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                <span className="text-base text-muted-foreground">Contenu exclusif premium</span>
              </div>
              <div className="flex items-start gap-3">
                <Crown className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                <span className="text-base text-muted-foreground">Guides audio immersifs</span>
              </div>
              <div className="flex items-start gap-3">
                <Crown className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                <span className="text-base text-muted-foreground">Statistiques avancées</span>
              </div>
              <div className="flex items-start gap-3">
                <Crown className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                <span className="text-base text-muted-foreground">Sans publicités</span>
              </div>
              
              <div className="pt-6">
                <Button 
                  className="w-full bg-gray-300 text-gray-500 cursor-not-allowed text-lg py-6" 
                  size="lg"
                  disabled
                  onClick={handlePremiumMode}
                >
                  Bientôt disponible
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Note informative */}
        <div className="text-center text-white/70 text-sm animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: '500ms' }}>
          <p>
            Le mode Basique est gratuit et te donne accès à toutes les fonctionnalités essentielles.
            Le mode Premium avec des contenus exclusifs sera disponible bientôt !
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;
