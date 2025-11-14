import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import splashHero from '@/assets/splash-hero.webp';
import splashHeroMobile from '@/assets/splash-hero-mobile.webp';
import splashHeroTablet from '@/assets/splash-hero-tablet.webp';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { WifiOff, BookOpen, Globe, Camera, Trophy, Calendar, CheckCircle, MapPin, Compass, Award, Target, TrendingUp, Heart, Users, Route, Settings, Check, LucideIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

interface TutorialStep {
  category: 'discovery' | 'gamification' | 'social' | 'calendar' | 'personalization';
  icon: LucideIcon;
  title: string;
  description: string;
  categoryColor: string;
  categoryLabel: string;
}

const tutorialSteps: TutorialStep[] = [
  // Catégorie 1: Découverte & Exploration (Turquoise)
  {
    category: 'discovery',
    icon: Globe,
    title: "Bienvenue dans SacredWorld",
    description: "Partez à la découverte des lieux sacrés et monuments culturels les plus emblématiques du monde entier. Une aventure spirituelle et culturelle vous attend !",
    categoryColor: "hsl(var(--primary))",
    categoryLabel: "Découverte & Exploration"
  },
  {
    category: 'discovery',
    icon: Globe,
    title: "Explorez le Globe 3D Interactif",
    description: "Faites tourner le globe 3D pour découvrir des milliers de lieux. Cliquez sur un pays pour voir tous ses monuments sacrés et planifier votre itinéraire.",
    categoryColor: "hsl(var(--primary))",
    categoryLabel: "Découverte & Exploration"
  },
  {
    category: 'discovery',
    icon: Camera,
    title: "Expérience en Réalité Augmentée",
    description: "Pointez votre caméra vers des monuments pour obtenir des informations en temps réel avec des superpositions immersives et des symboles religieux animés.",
    categoryColor: "hsl(var(--primary))",
    categoryLabel: "Découverte & Exploration"
  },
  {
    category: 'discovery',
    icon: Compass,
    title: "Découvrez les Lieux Près de Chez Vous",
    description: "Activez la géolocalisation pour découvrir tous les lieux sacrés dans un rayon de 10 km. Obtenez des directions et des informations de distance.",
    categoryColor: "hsl(var(--primary))",
    categoryLabel: "Découverte & Exploration"
  },
  {
    category: 'discovery',
    icon: MapPin,
    title: "Parcourez Tous les Lieux",
    description: "Filtrez par religion, pays ou type de monument. Recherchez des lieux spécifiques et ajoutez vos favoris à votre itinéraire.",
    categoryColor: "hsl(var(--primary))",
    categoryLabel: "Découverte & Exploration"
  },
  
  // Catégorie 2: Gamification & Progression (Doré)
  {
    category: 'gamification',
    icon: CheckCircle,
    title: "Visitez et Vérifiez Vos Visites",
    description: "Visitez des lieux en personne, prenez une photo et vérifiez votre visite par GPS + IA. Gagnez des points pour chaque visite physique validée !",
    categoryColor: "hsl(45 93% 47%)",
    categoryLabel: "Gamification & Progression"
  },
  {
    category: 'gamification',
    icon: Trophy,
    title: "Collectez des Points et Montez de Niveau",
    description: "Système XP : 100 points = 1 niveau. Visites physiques valent 10 points, visites virtuelles 1 point. Débloquez des récompenses à chaque niveau !",
    categoryColor: "hsl(45 93% 47%)",
    categoryLabel: "Gamification & Progression"
  },
  {
    category: 'gamification',
    icon: Award,
    title: "Débloquez des Badges Exclusifs",
    description: "Gagnez des badges pour 10, 25, 50, 100, 250 visites et plus. Badges spéciaux pour lieux iconiques. Admirez-les en 3D dans votre profil !",
    categoryColor: "hsl(45 93% 47%)",
    categoryLabel: "Gamification & Progression"
  },
  {
    category: 'gamification',
    icon: Target,
    title: "Relevez des Défis Quotidiens",
    description: "Quêtes hebdomadaires, défis quotidiens et challenges thématiques. Terminez-les pour gagner des badges rares et des bonus de points !",
    categoryColor: "hsl(45 93% 47%)",
    categoryLabel: "Gamification & Progression"
  },
  {
    category: 'gamification',
    icon: TrendingUp,
    title: "Grimpez dans les Classements",
    description: "Classements mondiaux, par pays et par religion. Comparez-vous aux autres explorateurs et gagnez des récompenses de classement chaque semaine !",
    categoryColor: "hsl(45 93% 47%)",
    categoryLabel: "Gamification & Progression"
  },
  
  // Catégorie 3: Social & Communauté (Violet)
  {
    category: 'social',
    icon: Heart,
    title: "Créez Vos Souvenirs de Voyage",
    description: "Uploadez vos photos de visites, écrivez vos réflexions personnelles et recommandez des restaurants et hébergements près des monuments.",
    categoryColor: "hsl(270 60% 60%)",
    categoryLabel: "Social & Communauté"
  },
  {
    category: 'social',
    icon: Users,
    title: "Rejoignez la Communauté",
    description: "Partagez vos vœux, photos et citations inspirantes. Participez aux discussions du forum, ajoutez des amis et échangez par messages privés.",
    categoryColor: "hsl(270 60% 60%)",
    categoryLabel: "Social & Communauté"
  },
  {
    category: 'social',
    icon: Route,
    title: "Planifiez Vos Voyages",
    description: "Créez des itinéraires personnalisés avec optimisation de route. Ajoutez jusqu'à 10 lieux, sauvegardez vos voyages et partagez-les avec la communauté.",
    categoryColor: "hsl(270 60% 60%)",
    categoryLabel: "Social & Communauté"
  },
  
  // Catégorie 4: Calendrier & Événements (Bleu)
  {
    category: 'calendar',
    icon: Calendar,
    title: "Calendrier Multi-Religieux",
    description: "Consultez les événements religieux de toutes les traditions. Notifications push, rappels personnalisables et vues année/mois/semaine/jour.",
    categoryColor: "hsl(217 91% 60%)",
    categoryLabel: "Calendrier & Événements"
  },
  
  // Catégorie 5: Personnalisation (Vert)
  {
    category: 'personalization',
    icon: Settings,
    title: "Personnalisez Votre Expérience",
    description: "Choisissez votre avatar, configurez votre profil public/privé, sélectionnez votre langue parmi 8 disponibles et gérez vos notifications.",
    categoryColor: "hsl(142 71% 45%)",
    categoryLabel: "Personnalisation"
  },
];

const Splash = () => {
  const navigate = useNavigate();
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  // Charger la progression du tutoriel depuis localStorage
  const [tutorialProgress, setTutorialProgress] = useState(() => {
    const saved = localStorage.getItem('tutorialProgress');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/welcome');
      }
    });
  }, [navigate]);

  const handleStartExploration = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/auth');
  };

  const handleLanguageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLanguages(true);
  };

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    setShowLanguages(false);
  };

  const handleOfflineMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Stocker le mode hors ligne et aller directement à l’accueil
    localStorage.setItem('selectedMode', 'offline');
    navigate('/welcome');
  };

  const handleTutorialOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTutorial(true);
    setTutorialStep(0);
  };

  const handleTutorialNext = () => {
    const nextStep = tutorialStep + 1;
    if (nextStep < tutorialSteps.length) {
      setTutorialStep(nextStep);
      // Sauvegarder la progression
      const newProgress = Math.max(tutorialProgress, nextStep + 1);
      setTutorialProgress(newProgress);
      localStorage.setItem('tutorialProgress', newProgress.toString());
    } else {
      // Tutoriel terminé
      setShowTutorial(false);
      setTutorialStep(0);
      localStorage.setItem('tutorialCompleted', 'true');
      localStorage.setItem('tutorialProgress', tutorialSteps.length.toString());
    }
  };

  const handleTutorialPrev = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1);
    }
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(0);
  };

  const currentStep = tutorialSteps[tutorialStep];
  const StepIcon = currentStep?.icon;
  const currentLang = languages.find(l => l.code === selectedLanguage) || languages[0];

  return (
    <div 
      className="w-screen h-screen flex items-center justify-center overflow-hidden relative"
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #0E1B3F 30%, #1a3a52 60%, #0E1B3F 100%)'
      }}
    >
      {/* Background image */}
      <img 
        src={splashHero}
        srcSet={`${splashHeroMobile} 640w, ${splashHeroTablet} 1024w, ${splashHero} 1920w`}
        sizes="100vw"
        alt="SacredWorld" 
        className="w-full h-full object-contain"
        loading="eager"
        fetchPriority="high"
      />
      
      {/* Boutons Mode hors ligne et Tutoriel - En bas avec espacement mobile optimisé */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-10 px-4 sm:px-6">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3 sm:gap-4">
          {/* Bouton Mode hors ligne */}
          <Button
            onClick={handleOfflineMode}
            variant="outline"
            size="lg"
            className="flex-1 gap-2 border-primary/30 bg-sacred-blue/90 backdrop-blur-md hover:bg-primary/20 text-foreground shadow-lg h-12 sm:h-14 text-sm sm:text-base"
          >
            <WifiOff className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Hors ligne</span>
          </Button>
          
          {/* Bouton Tutoriel */}
          <Button
            onClick={handleTutorialOpen}
            variant="outline"
            size="lg"
            className="flex-1 gap-2 border-primary/30 bg-sacred-blue/90 backdrop-blur-md hover:bg-primary/20 text-foreground shadow-lg h-12 sm:h-14 text-sm sm:text-base"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Tutoriel</span>
          </Button>
        </div>
      </div>
      
      {/* Clickable zones overlay - transparent areas positioned on the image */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {/* Empty space for logo and text - centered */}
        <div className="flex-1 flex items-center justify-center w-full max-w-2xl">
          {/* This space contains the logo and text from the image */}
        </div>
        
        {/* Button zone 1 - "Commencer l'exploration" */}
        <div className="w-full max-w-md mb-3">
          <button
            onClick={handleStartExploration}
            className="w-full h-16 cursor-pointer opacity-0 hover:opacity-5 transition-opacity bg-primary rounded-full"
            aria-label="Commencer l'exploration"
          />
        </div>
        
        {/* Button zone 2 - "Français" (Language selector) - plus de zone tutoriel ici */}
        <div className="mb-8">
          <button
            onClick={handleLanguageClick}
            className="w-48 h-10 cursor-pointer opacity-0 hover:opacity-5 transition-opacity bg-primary rounded-lg"
            aria-label="Choisir la langue"
          />
        </div>
      </div>

      {/* Language selection dialog */}
      <Dialog open={showLanguages} onOpenChange={setShowLanguages}>
        <DialogContent className="bg-sacred-blue border-primary/20 max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">Choisir une langue</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={selectedLanguage === lang.code ? "default" : "ghost"}
                onClick={() => handleLanguageSelect(lang.code)}
                className="justify-start text-left gap-3 h-12"
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="flex-1">{lang.name}</span>
                {selectedLanguage === lang.code && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Tutorial Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="sm:max-w-[650px] bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl border-primary/20">
          <DialogHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge 
                className="text-xs px-3 py-1"
                style={{ 
                  backgroundColor: tutorialSteps[tutorialStep].categoryColor,
                  color: 'white'
                }}
              >
                {tutorialSteps[tutorialStep].categoryLabel}
              </Badge>
              <span className="text-sm text-muted-foreground font-medium">
                Étape {tutorialStep + 1} sur {tutorialSteps.length}
              </span>
            </div>
            
            <DialogTitle className="text-2xl font-cinzel text-center">
              {tutorialSteps[tutorialStep].title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full blur-xl animate-pulse" 
                style={{ backgroundColor: tutorialSteps[tutorialStep].categoryColor, opacity: 0.2 }}
              />
              {StepIcon && (
                <StepIcon 
                  className="w-20 h-20 relative z-10" 
                  style={{ color: tutorialSteps[tutorialStep].categoryColor }}
                />
              )}
            </div>
            
            <p className="text-center text-muted-foreground text-base leading-relaxed px-4">
              {tutorialSteps[tutorialStep].description}
            </p>
            
            {/* Barre de progression */}
            <div className="w-full px-4 space-y-2">
              <Progress 
                value={(tutorialStep + 1) / tutorialSteps.length * 100} 
                className="h-2"
              />
              <div className="flex items-center gap-1 justify-center">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === tutorialStep
                        ? "w-6 bg-primary"
                        : index < tutorialStep
                        ? "w-1.5 bg-primary/60"
                        : "w-1.5 bg-primary/20"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex flex-col gap-3 w-full px-4 mt-2">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleTutorialPrev}
                  disabled={tutorialStep === 0}
                  className="flex-1"
                >
                  ← Précédent
                </Button>
                
                <Button
                  onClick={handleTutorialNext}
                  className="flex-1"
                  style={{
                    backgroundColor: tutorialSteps[tutorialStep].categoryColor,
                    color: 'white'
                  }}
                >
                  {tutorialStep === tutorialSteps.length - 1 ? "Terminer ✓" : "Suivant →"}
                </Button>
              </div>
              
              <Button
                variant="ghost"
                onClick={handleSkipTutorial}
                className="w-full text-sm text-muted-foreground hover:text-foreground"
              >
                Passer le tutoriel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Splash;
