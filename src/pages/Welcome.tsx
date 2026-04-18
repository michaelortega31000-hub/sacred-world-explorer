import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, WifiOff, BookOpen, Sparkles, Users, MapPin } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import logo from '@/assets/sacredworld-logo-new.png';
import logoGlow from '@/assets/logo-glow.png';
import ChristianIcon from '@/components/ChristianIcon';

interface OnboardingScreen {
  icon: typeof Sparkles;
  title: string;
  description: string;
}

const screens: OnboardingScreen[] = [
  {
    icon: Sparkles,
    title: 'Bienvenue sur SacredWorld',
    description: 'Votre compagnon du patrimoine spirituel et culturel chrétien.',
  },
  {
    icon: Users,
    title: 'Pour les chrétiens et les curieux',
    description: 'Pensé pour ceux qui aiment l\'architecture sacrée, l\'histoire et la beauté du patrimoine.',
  },
  {
    icon: MapPin,
    title: 'Collectionnez les lieux sacrés',
    description: 'Cathédrales, basiliques, sanctuaires, abbayes… découvrez et collectionnez comme un véritable pèlerin.',
  },
];

const Welcome = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (!savedLanguage) {
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = ['en', 'fr', 'es', 'it', 'de', 'pt', 'ar'];
      const detectedLang = supportedLangs.includes(browserLang) ? browserLang : 'fr';
      i18n.changeLanguage(detectedLang);
      localStorage.setItem('language', detectedLang);
    }
  }, [i18n]);

  const isLast = step === screens.length - 1;
  const current = screens[step];
  const StepIcon = current.icon;

  const handleNext = () => {
    if (isLast) {
      navigate('/explore');
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => navigate('/explore');

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Subtle gold/turquoise overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />

      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center relative z-10">
        <Button variant="outline" size="default" className="gap-2 font-medium">
          <WifiOff className="w-4 h-4" />
          Hors ligne
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="default"
            className="gap-2 font-medium"
            onClick={() => navigate('/?tutorial=true')}
          >
            <BookOpen className="w-4 h-4" />
            Tutoriel
          </Button>
          <LanguageSelector />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 relative z-10">
        <div className="max-w-2xl w-full text-center">
          {/* Logo with cross glow */}
          <div className="mb-10 flex justify-center animate-fade-in relative">
            <div className="relative">
              <img
                src={logoGlow}
                alt=""
                className="absolute inset-0 w-full h-full object-contain opacity-80 blur-2xl scale-125 animate-pulse"
                aria-hidden="true"
              />
              <img
                src={logo}
                alt="SacredWorld"
                className="relative z-10 w-48 h-auto drop-shadow-[0_0_40px_hsl(var(--primary)/0.4)]"
              />
            </div>
          </div>

          {/* Tagline */}
          <p className="mb-8 text-lg md:text-xl font-cinzel text-primary/90 tracking-wide animate-fade-in">
            Découvrez, vivez et collectionnez le patrimoine sacré chrétien
          </p>

          {/* Onboarding step */}
          <div
            key={step}
            className="space-y-6 mb-10 animate-fade-in"
          >
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl scale-125 animate-pulse" />
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/15 border border-primary/30 backdrop-blur-sm">
                  <StepIcon className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground font-cinzel leading-tight">
              {current.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-inter font-light max-w-xl mx-auto">
              {current.description}
            </p>
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {screens.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-primary' : 'w-2 bg-primary/30'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3 animate-fade-in">
            {step > 0 && (
              <Button
                onClick={() => setStep(step - 1)}
                size="lg"
                variant="outline"
                className="px-6 py-6 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <Button
              onClick={handleNext}
              size="lg"
              className="px-10 py-6 text-lg font-bold rounded-full shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300 font-poppins bg-gradient-to-r from-primary to-primary/80"
            >
              {isLast ? 'Commencer mon pèlerinage' : 'Suivant'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {!isLast && (
            <button
              onClick={handleSkip}
              className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Passer l'introduction
            </button>
          )}

          {/* Subtle Christian identity mark */}
          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground/70">
            <ChristianIcon size="sm" className="opacity-70" />
            <span>Pour les chrétiens et les curieux de patrimoine</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
