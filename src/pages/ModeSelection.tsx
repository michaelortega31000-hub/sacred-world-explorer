import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/sacredworld-logo-new.png';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-background">
      {/* Overlay gradient turquoise subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />

      {/* Bouton déconnexion en haut à droite */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-foreground hover:bg-primary/10"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      <div className="text-center max-w-5xl w-full space-y-10 relative z-10">
        {/* Logo et titre */}
        <div className="animate-fade-in">
          <div className="mb-6 flex justify-center">
            <img 
              src={logo} 
              alt="SacredWorld Logo" 
              className="w-24 h-24 md:w-32 md:h-32 gold-halo breathing-glow"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight font-cinzel">
            Bienvenue sur SacredWorld !
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Choisis ton mode d'exploration
          </p>
        </div>

        {/* Cartes de sélection des modes */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '300ms' }}>
          {/* Mode Basique - Cliquable */}
          <Card 
            className="border-2 border-primary hover:border-primary/80 bg-card/90 backdrop-blur-sm cursor-pointer hover:shadow-turquoise transition-all duration-300 hover:scale-105 turquoise-reflection"
            onClick={handleBasicMode}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-3xl font-cinzel">Mode Basique</CardTitle>
              <Badge className="bg-primary/20 text-primary mt-3 w-fit mx-auto text-base px-4 py-1">
                Gratuit
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <span className="text-base text-foreground">Accès à tous les lieux sacrés du monde</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <span className="text-base text-foreground">Système de points et badges</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <span className="text-base text-foreground">Quiz quotidiens et quêtes hebdomadaires</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <span className="text-base text-foreground">Planificateur de voyages</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <span className="text-base text-foreground">Communauté et messagerie</span>
              </div>
              
              <div className="pt-6">
                <Button 
                  className="w-full text-lg py-6 bg-primary text-primary-foreground shadow-turquoise hover:scale-105 transition-transform" 
                  size="lg"
                >
                  Commencer gratuitement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mode Premium - Non cliquable (bientôt disponible) */}
          <Card className="border-2 border-secondary bg-card/60 backdrop-blur-sm relative overflow-hidden opacity-90">
            <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground px-6 py-2 text-base font-semibold transform rotate-12 translate-x-10 translate-y-4">
              Bientôt
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                <Crown className="w-12 h-12 text-secondary" />
              </div>
              <CardTitle className="text-3xl font-cinzel">Mode Premium</CardTitle>
              <Badge className="bg-secondary/20 text-secondary mt-3 w-fit mx-auto text-base px-4 py-1">
                Prochainement
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Crown className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                <span className="text-base text-muted-foreground">Tout du mode Basique</span>
              </div>
              <div className="flex items-start gap-3">
                <Crown className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                <span className="text-base text-muted-foreground">Contenu exclusif premium</span>
              </div>
              <div className="flex items-start gap-3">
                <Crown className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                <span className="text-base text-muted-foreground">Guides audio immersifs</span>
              </div>
              <div className="flex items-start gap-3">
                <Crown className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                <span className="text-base text-muted-foreground">Statistiques avancées</span>
              </div>
              <div className="flex items-start gap-3">
                <Crown className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                <span className="text-base text-muted-foreground">Sans publicités</span>
              </div>
              
              <div className="pt-6">
                <Button 
                  className="w-full bg-muted text-muted-foreground cursor-not-allowed text-lg py-6" 
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
        <div className="text-center text-muted-foreground text-sm animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: '500ms' }}>
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
