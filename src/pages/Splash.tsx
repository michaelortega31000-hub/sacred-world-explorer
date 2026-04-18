import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import splashHero from '@/assets/splash-hero.webp';
import splashHeroMobile from '@/assets/splash-hero-mobile.webp';
import splashHeroTablet from '@/assets/splash-hero-tablet.webp';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { WifiOff, BookOpen, Globe, Trophy, Calendar, Target, Users, Settings, Check, LogOut, LucideIcon, MessageCircle } from 'lucide-react';
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
  ctaText?: string;
  ctaLink?: string;
}

const tutorialSteps: TutorialStep[] = [
  // 1. Bienvenue
  {
    category: 'discovery',
    icon: Globe,
    title: "Bienvenue dans SacredWorld",
    description: "Partez à la découverte des lieux sacrés et monuments culturels les plus emblématiques du monde entier. Une aventure spirituelle et culturelle vous attend !",
    categoryColor: "hsl(var(--primary))",
    categoryLabel: "Découverte & Exploration",
    ctaText: "Commencer l'Exploration",
    ctaLink: "/welcome"
  },
  // 2. Explorez le Monde (fusion Globe + Filtres + Géoloc)
  {
    category: 'discovery',
    icon: Globe,
    title: "Explorez le Monde",
    description: "Faites tourner le globe 3D interactif, filtrez par pays, religion ou type de monument, et découvrez les lieux près de chez vous grâce à la géolocalisation.",
    categoryColor: "hsl(var(--primary))",
    categoryLabel: "Découverte & Exploration",
    ctaText: "Voir le Globe 3D",
    ctaLink: "/worldmap"
  },
  // 3. Assistant Sacred World (NOUVEAU)
  {
    category: 'discovery',
    icon: MessageCircle,
    title: "Assistant Sacred World",
    description: "Posez vos questions à l'assistant intelligent ! Mode « Aide » pour naviguer dans l'app, mode « Histoire » pour découvrir l'histoire des lieux sacrés.",
    categoryColor: "hsl(var(--primary))",
    categoryLabel: "Découverte & Exploration",
    ctaText: "Essayer l'Assistant",
    ctaLink: "/explore"
  },
  // 4. Points et Badges (fusion)
  {
    category: 'gamification',
    icon: Trophy,
    title: "Gagnez des Points et Badges",
    description: "Validez vos visites par photo GPS+IA (10 pts/visite). Montez de niveau et débloquez des badges exclusifs pour 10, 25, 50, 100+ visites !",
    categoryColor: "hsl(45 93% 47%)",
    categoryLabel: "Gamification & Progression",
    ctaText: "Voir Mon Profil",
    ctaLink: "/profile"
  },
  // 5. Défis et Classements (fusion)
  {
    category: 'gamification',
    icon: Target,
    title: "Défis et Classements",
    description: "Relevez des défis quotidiens et hebdomadaires pour gagner des bonus. Grimpez dans les classements mondiaux, par pays et par religion !",
    categoryColor: "hsl(45 93% 47%)",
    categoryLabel: "Gamification & Progression",
    ctaText: "Voir les Défis",
    ctaLink: "/profile"
  },
  // 6. Communauté et Souvenirs (fusion)
  {
    category: 'social',
    icon: Users,
    title: "Communauté et Souvenirs",
    description: "Créez votre journal de voyage, partagez avec la communauté, ajoutez des amis et planifiez des itinéraires personnalisés jusqu'à 10 lieux.",
    categoryColor: "hsl(270 60% 60%)",
    categoryLabel: "Social & Communauté",
    ctaText: "Voir la Communauté",
    ctaLink: "/community"
  },
  // 7. Calendrier
  {
    category: 'calendar',
    icon: Calendar,
    title: "Calendrier Multi-Religieux",
    description: "Consultez les événements de toutes les traditions. Activez les rappels personnalisés et explorez les vues année, mois, semaine ou jour.",
    categoryColor: "hsl(217 91% 60%)",
    categoryLabel: "Calendrier & Événements",
    ctaText: "Voir le Calendrier",
    ctaLink: "/calendar"
  },
  // 8. Personnalisation
  {
    category: 'personalization',
    icon: Settings,
    title: "Personnalisez Votre Expérience",
    description: "Choisissez votre avatar, configurez votre profil public/privé, sélectionnez votre langue parmi 8 disponibles et gérez vos notifications.",
    categoryColor: "hsl(142 71% 45%)",
    categoryLabel: "Personnalisation",
    ctaText: "Ouvrir les Paramètres",
    ctaLink: "/settings"
  },
];

const Splash = () => {
  const navigate = useNavigate();
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev'>('next');
  
  // Charger la progression du tutoriel depuis localStorage
  const [tutorialProgress, setTutorialProgress] = useState(() => {
    const saved = localStorage.getItem('tutorialProgress');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté (sans redirection automatique)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Ouvrir automatiquement le tutoriel si paramètre URL présent
    if (searchParams.get('tutorial') === 'true') {
      setShowTutorial(true);
      setTutorialStep(0);
    }
  }, [searchParams]);

  const handleStartExploration = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoggedIn) {
      navigate('/home');
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
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
    if (isAnimating) return;
    
    const nextStep = tutorialStep + 1;
    if (nextStep < tutorialSteps.length) {
      setIsAnimating(true);
      setAnimationDirection('next');
      
      setTimeout(() => {
        setTutorialStep(nextStep);
        const newProgress = Math.max(tutorialProgress, nextStep + 1);
        setTutorialProgress(newProgress);
        localStorage.setItem('tutorialProgress', newProgress.toString());
        
        setTimeout(() => setIsAnimating(false), 400);
      }, 300);
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
      localStorage.setItem('tutorialCompleted', 'true');
      localStorage.setItem('tutorialProgress', tutorialSteps.length.toString());
    }
  };

  const handleTutorialPrev = () => {
    if (isAnimating || tutorialStep === 0) return;
    
    setIsAnimating(true);
    setAnimationDirection('prev');
    
    setTimeout(() => {
      setTutorialStep(tutorialStep - 1);
      setTimeout(() => setIsAnimating(false), 400);
    }, 300);
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
      
      {/* Boutons Mode hors ligne, Tutoriel et Déconnexion - En haut */}
      <div className="absolute top-4 sm:top-6 left-0 right-0 z-10 px-4 sm:px-6">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {/* Bouton Mode hors ligne */}
          <Button
            onClick={handleOfflineMode}
            variant="outline"
            size="lg"
            className="gap-2 border-primary/30 bg-sacred-blue/90 backdrop-blur-md hover:bg-primary/20 text-foreground shadow-lg h-11 sm:h-12 text-xs sm:text-sm px-3 sm:px-4"
          >
            <WifiOff className="w-4 h-4" />
            <span>Hors ligne</span>
          </Button>
          
          {/* Bouton Tutoriel */}
          <Button
            onClick={handleTutorialOpen}
            variant="outline"
            size="lg"
            className="gap-2 border-primary/30 bg-sacred-blue/90 backdrop-blur-md hover:bg-primary/20 text-foreground shadow-lg h-11 sm:h-12 text-xs sm:text-sm px-3 sm:px-4"
          >
            <BookOpen className="w-4 h-4" />
            <span>Tutoriel</span>
          </Button>

          {/* Bouton Déconnexion - visible uniquement si connecté */}
          {isLoggedIn && (
            <Button
              onClick={handleLogout}
              variant="outline"
              size="lg"
              className="gap-2 border-destructive/40 bg-sacred-blue/90 backdrop-blur-md hover:bg-destructive/20 text-foreground shadow-lg h-11 sm:h-12 text-xs sm:text-sm px-3 sm:px-4"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Clickable zones overlay - transparent areas positioned on the image */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pt-20">
        {/* Empty space for logo and text - centered */}
        <div className="flex-1 flex items-center justify-center w-full max-w-2xl">
          {/* This space contains the logo and text from the image */}
        </div>

        {/* Tagline overlay (Phase 3) — visible above the CTA */}
        <div className="w-full max-w-xl mb-4 px-4 text-center pointer-events-none">
          <p className="text-base sm:text-lg font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] leading-snug">
            Découvrez, vivez et collectionnez le patrimoine sacré chrétien
          </p>
          <p className="text-xs sm:text-sm text-white/85 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] mt-1">
            Pour les chrétiens et les curieux de patrimoine
          </p>
        </div>

        {/* Button zone 1 - "Commencer l'exploration" ou "Continuer" */}
        <div className="w-full max-w-md mb-3">
          <button
            onClick={handleStartExploration}
            className="w-full h-16 cursor-pointer opacity-0 hover:opacity-5 transition-opacity bg-primary rounded-full"
            aria-label={isLoggedIn ? "Continuer vers l'application" : "Commencer l'exploration"}
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
        <DialogContent className="sm:max-w-[650px] bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl border-primary/20 animate-fade-in">
          <DialogHeader>
            <div className="flex items-center justify-between mb-4 animate-fade-in">
              <Badge 
                className="text-xs px-3 py-1 transition-all duration-300"
                style={{ 
                  backgroundColor: tutorialSteps[tutorialStep].categoryColor,
                  color: 'white'
                }}
              >
                {tutorialSteps[tutorialStep].categoryLabel}
              </Badge>
              <span className="text-sm text-muted-foreground font-medium animate-fade-in">
                Étape {tutorialStep + 1} sur {tutorialSteps.length}
              </span>
            </div>
            
            <DialogTitle className="text-2xl font-cinzel text-center animate-fade-in" style={{ animationDelay: '100ms' }}>
              {tutorialSteps[tutorialStep].title}
            </DialogTitle>
          </DialogHeader>
          
          <div 
            className={`flex flex-col items-center gap-6 py-4 ${
              isAnimating 
                ? animationDirection === 'next' 
                  ? 'animate-slide-fade-left' 
                  : 'animate-slide-fade-right'
                : animationDirection === 'next'
                  ? 'animate-slide-in-left'
                  : 'animate-slide-in-right'
            }`}
          >
            <div className="relative animate-scale-in" style={{ animationDelay: '200ms' }}>
              {/* Glow pulsant en arrière-plan */}
              <div 
                className="absolute inset-0 rounded-full blur-2xl animate-pulse" 
                style={{ 
                  backgroundColor: tutorialSteps[tutorialStep].categoryColor, 
                  opacity: 0.3,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
              {/* Second glow pour effet plus fort */}
              <div 
                className="absolute inset-0 rounded-full blur-xl animate-pulse" 
                style={{ 
                  backgroundColor: tutorialSteps[tutorialStep].categoryColor, 
                  opacity: 0.2,
                  animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
              {StepIcon && (
                <StepIcon 
                  className="w-20 h-20 relative z-10 transition-all duration-500 drop-shadow-2xl" 
                  style={{ 
                    color: tutorialSteps[tutorialStep].categoryColor,
                    filter: `drop-shadow(0 0 20px ${tutorialSteps[tutorialStep].categoryColor}40)`
                  }}
                />
              )}
            </div>
            
            <p className="text-center text-muted-foreground text-base leading-relaxed px-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              {tutorialSteps[tutorialStep].description}
            </p>
            
            {/* Barre de progression */}
            <div className="w-full px-4 space-y-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <Progress 
                value={(tutorialStep + 1) / tutorialSteps.length * 100} 
                className="h-2 transition-all duration-500"
              />
              <div className="flex items-center gap-1 justify-center">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === tutorialStep
                        ? "w-6 bg-primary scale-110"
                        : index < tutorialStep
                        ? "w-1.5 bg-primary/60"
                        : "w-1.5 bg-primary/20"
                    }`}
                    style={{
                      boxShadow: index === tutorialStep 
                        ? `0 0 10px ${tutorialSteps[tutorialStep].categoryColor}` 
                        : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex flex-col gap-3 w-full px-4 mt-2 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleTutorialPrev}
                  disabled={tutorialStep === 0}
                  className="flex-1 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  ← Précédent
                </Button>
                
                <Button
                  onClick={handleTutorialNext}
                  className="flex-1 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: tutorialSteps[tutorialStep].categoryColor,
                    color: 'white',
                    boxShadow: `0 4px 20px ${tutorialSteps[tutorialStep].categoryColor}40`
                  }}
                >
                  {tutorialStep === tutorialSteps.length - 1 ? "Terminer ✓" : "Suivant →"}
                </Button>
              </div>
              
              {/* Bouton Essayer Maintenant */}
              {currentStep.ctaLink && (
                <Button
                  onClick={() => {
                    setShowTutorial(false);
                    navigate(currentStep.ctaLink!);
                  }}
                  variant="outline"
                  className="w-full border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    borderColor: tutorialSteps[tutorialStep].categoryColor,
                    color: tutorialSteps[tutorialStep].categoryColor,
                    boxShadow: `0 0 15px ${tutorialSteps[tutorialStep].categoryColor}20`
                  }}
                >
                  {currentStep.ctaText || "Essayer Maintenant"} →
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={handleSkipTutorial}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
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
