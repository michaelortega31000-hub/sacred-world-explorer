import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import splashHero from '@/assets/splash-hero.png';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, WifiOff, BookOpen, MapPin, Award, Users, X } from 'lucide-react';
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

const tutorialSteps = [
  {
    icon: MapPin,
    title: 'Explorez le monde sacré',
    description: 'Découvrez des milliers de lieux sacrés à travers le monde entier. Naviguez sur le globe interactif et explorez des monuments emblématiques de toutes les religions.',
  },
  {
    icon: Award,
    title: 'Collectez des points',
    description: 'Visitez des lieux en personne ou virtuellement pour gagner des points. Plus vous explorez, plus vous débloquez de badges et gravissez les classements.',
  },
  {
    icon: Users,
    title: 'Partagez vos découvertes',
    description: 'Rejoignez une communauté de passionnés. Partagez vos photos, créez des voyages personnalisés et échangez avec d\'autres explorateurs.',
  },
  {
    icon: BookOpen,
    title: 'Apprenez et découvrez',
    description: 'Chaque lieu raconte une histoire. Plongez dans la richesse culturelle et historique des monuments avec des descriptions détaillées et du contenu immersif (à venir : audio et vidéo).',
  },
];

const Splash = () => {
  const navigate = useNavigate();
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

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
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
    }
  };

  const handleTutorialPrev = () => {
    if (tutorialStep > 0) {
      setTutorialStep(prev => prev - 1);
    }
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
        alt="SacredWorld" 
        className="w-full h-full object-contain"
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
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-card border-primary/20">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setShowTutorial(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Step indicator */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-8 rounded-full transition-all duration-300 ${
                    index === tutorialStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="p-12 pt-16 text-center min-h-[400px] flex flex-col items-center justify-center">
              {StepIcon && (
                <div className="mb-6 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-scale-in">
                  <StepIcon className="w-10 h-10 text-primary" strokeWidth={2} />
                </div>
              )}

              <h3 className="text-2xl font-bold text-foreground mb-4 animate-fade-in">
                {currentStep.title}
              </h3>

              <p className="text-lg text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: '100ms' }}>
                {currentStep.description}
              </p>

              {/* Placeholder for future video */}
              {tutorialStep === 0 && (
                <div className="mt-6 w-full aspect-video bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
                  <p className="text-sm text-muted-foreground">Vidéo à venir</p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="p-6 border-t border-border flex justify-between items-center gap-4">
              <Button
                onClick={handleTutorialPrev}
                variant="ghost"
                disabled={tutorialStep === 0}
                className="disabled:opacity-50"
              >
                Précédent
              </Button>

              <span className="text-sm text-muted-foreground">
                {tutorialStep + 1} / {tutorialSteps.length}
              </span>

              <Button
                onClick={handleTutorialNext}
              >
                {tutorialStep === tutorialSteps.length - 1 
                  ? 'Terminer' 
                  : 'Suivant'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Splash;
