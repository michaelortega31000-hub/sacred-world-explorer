import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Globe, ArrowRight, BookOpen, MapPin, Award, X } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import logo from '@/assets/sacredworld-logo.jpg';

const tutorialSteps = [
  {
    icon: MapPin,
    titleKey: 'welcome.tutorial.step1.title',
    descKey: 'welcome.tutorial.step1.desc',
  },
  {
    icon: BookOpen,
    titleKey: 'welcome.tutorial.step2.title',
    descKey: 'welcome.tutorial.step2.desc',
  },
  {
    icon: Award,
    titleKey: 'welcome.tutorial.step3.title',
    descKey: 'welcome.tutorial.step3.desc',
  },
];

const Welcome = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => {
    // Auto-détection de la langue si pas déjà définie
    const savedLanguage = localStorage.getItem('language');
    if (!savedLanguage) {
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = ['en', 'fr', 'es', 'it', 'de', 'pt', 'ar'];
      const detectedLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
      i18n.changeLanguage(detectedLang);
      localStorage.setItem('language', detectedLang);
    }
  }, [i18n]);

  const handleStart = () => {
    navigate('/traditions');
  };

  const handleTutorialOpen = () => {
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[hsl(200,100%,85%)] via-[hsl(200,100%,90%)] to-[hsl(200,100%,95%)]">
      {/* Sélecteur de langue en haut à droite */}
      <header className="w-full p-4 flex justify-end">
        <LanguageSelector />
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="max-w-2xl w-full text-center">
          {/* Logo */}
          <div className="mb-12 flex justify-center animate-fade-in">
            <img 
              src={logo} 
              alt="SacredWorld Logo" 
              className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72"
              style={{
                animation: 'logoEntry 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              }}
            />
          </div>

          {/* Promesse (2 phrases) */}
          <div className="space-y-6 mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight font-poppins tracking-tight">
              {t('welcome.promise1')}
            </p>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-poppins font-light">
              {t('welcome.promise2')}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Button
              onClick={handleStart}
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-poppins"
            >
              {t('welcome.cta.start')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <Button
              onClick={handleTutorialOpen}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-lg font-semibold rounded-full hover:bg-muted transition-all duration-200 font-poppins"
            >
              <BookOpen className="mr-2 w-5 h-5" />
              {t('welcome.cta.tutorial')}
            </Button>
          </div>

          {/* Accessibilité note */}
          <p className="mt-8 text-sm text-gray-600 animate-fade-in" style={{ animationDelay: '300ms' }}>
            {t('welcome.accessibility')}
          </p>
        </div>
      </div>

      {/* Tutorial Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
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
                {t(currentStep.titleKey)}
              </h3>

              <p className="text-lg text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: '100ms' }}>
                {t(currentStep.descKey)}
              </p>
            </div>

            {/* Navigation */}
            <div className="p-6 border-t flex justify-between items-center gap-4">
              <Button
                onClick={handleTutorialPrev}
                variant="ghost"
                disabled={tutorialStep === 0}
                className="disabled:opacity-50"
              >
                {t('welcome.tutorial.prev')}
              </Button>

              <span className="text-sm text-muted-foreground">
                {tutorialStep + 1} / {tutorialSteps.length}
              </span>

              <Button
                onClick={handleTutorialNext}
              >
                {tutorialStep === tutorialSteps.length - 1 
                  ? t('welcome.tutorial.finish') 
                  : t('welcome.tutorial.next')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

export default Welcome;
