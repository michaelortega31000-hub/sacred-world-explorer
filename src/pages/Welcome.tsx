import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Sparkles, Users, MapPin } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import logo from '@/assets/sacredworld-logo-official.png';
import logoGlow from '@/assets/sacredworld-logo-official.png';
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
      navigate('/home');
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => navigate('/home');

  return (
    <div className="cathedral-rose-bg min-h-screen flex flex-col relative">
      {/* Header — language only, no clutter */}
      <header className="w-full p-4 flex justify-end items-center relative z-10">
        <LanguageSelector />
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
                className="sacred-logo-gold absolute inset-0 w-full h-full object-contain opacity-80 blur-2xl scale-125 animate-pulse"
                aria-hidden="true"
              />
              <img
                src={logo}
                alt="SacredWorld"
                className="sacred-logo-gold relative z-10 w-48 h-auto drop-shadow-[0_0_40px_hsl(var(--primary)/0.4)]"
              />
            </div>
          </div>

          {/* Tagline */}
          <p className="mb-8 text-lg md:text-xl font-cinzel text-amber-200/90 tracking-wide animate-fade-in">
            Découvrez, vivez et collectionnez le patrimoine sacré chrétien
          </p>

          {/* Onboarding step */}
          <div key={step} className="space-y-6 mb-10 animate-fade-in">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-amber-300/30 blur-2xl scale-125 animate-pulse" />
                <div
                  className="relative flex items-center justify-center w-24 h-24 rounded-full backdrop-blur-sm"
                  style={{
                    background: 'radial-gradient(circle, rgba(244,197,66,0.18) 0%, rgba(7,7,15,0.85) 70%)',
                    border: '1px solid rgba(244,197,66,0.35)',
                    boxShadow: '0 0 30px rgba(244,197,66,0.25), inset 0 0 20px rgba(244,197,66,0.10)',
                  }}
                >
                  <StepIcon className="w-12 h-12 text-amber-300" style={{ filter: 'drop-shadow(0 0 8px rgba(244,197,66,0.55))' }} />
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-amber-50 font-cinzel leading-tight">
              {current.title}
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-inter font-light max-w-xl mx-auto">
              {current.description}
            </p>
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {screens.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-amber-300' : 'w-2 bg-amber-300/25'
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
                variant="ghost"
                className="px-6 py-6 rounded-full border border-amber-300/30 text-amber-200 hover:bg-amber-300/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <button
              onClick={handleNext}
              className="hub-breath inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-full
                         text-amber-950 bg-gradient-to-r from-amber-300 to-orange-400
                         shadow-[0_0_28px_rgba(244,197,66,0.55)] hover:scale-105 active:scale-95
                         transition-transform duration-200"
            >
              {isLast ? 'Commencer mon pèlerinage' : 'Suivant'}
              <ArrowRight className="ml-1 w-5 h-5" />
            </button>
          </div>

          {!isLast && (
            <button
              onClick={handleSkip}
              className="mt-6 text-sm text-white/45 hover:text-amber-200 transition-colors"
            >
              Passer l'introduction
            </button>
          )}

          {/* Subtle Christian identity mark */}
          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-white/50">
            <ChristianIcon size="sm" className="opacity-70" />
            <span>Pour les chrétiens et les curieux de patrimoine</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
