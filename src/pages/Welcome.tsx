import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight, WifiOff, BookOpen } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import logo from '@/assets/sacredworld-logo-new.png';
import logoGlow from '@/assets/logo-glow.png';
const Welcome = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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
  return <div className="min-h-screen flex flex-col bg-background relative">
      {/* Overlay gradient turquoise subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
      
      {/* Header avec boutons Hors ligne (gauche), Tutoriel (droite) et Sélecteur de langue (droite) */}
      <header className="w-full p-4 flex justify-between items-center relative z-10">
        {/* Bouton Hors ligne - en haut à gauche */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <WifiOff className="w-4 h-4" />
          {t('welcome.offline')}
        </Button>

        {/* Boutons à droite : Tutoriel et Sélecteur de langue */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <BookOpen className="w-4 h-4" />
            {t('welcome.tutorial')}
          </Button>
          <LanguageSelector />
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 relative z-10">
        <div className="max-w-2xl w-full text-center">
          {/* Logo */}
          <div className="mb-12 flex justify-center animate-fade-in relative">
            <div className="relative">
              {/* Multiple glow layers for better effect */}
              <img 
                src={logoGlow} 
                alt="" 
                className="absolute inset-0 w-full h-full object-contain opacity-80 blur-2xl scale-125 animate-pulse"
                aria-hidden="true"
              />
              <img 
                src={logoGlow} 
                alt="" 
                className="absolute inset-0 w-full h-full object-contain opacity-40 blur-md scale-110"
                aria-hidden="true"
              />
              {/* Main logo - transparent background */}
              <img 
                src={logo} 
                alt="SacredWorld Logo" 
                className="relative z-10 w-64 h-auto drop-shadow-[0_0_40px_rgba(79,209,197,0.3)]"
              />
            </div>
          </div>

          {/* Promesse (2 phrases) */}
          <div className="space-y-6 mb-12 animate-fade-in" style={{
          animationDelay: '100ms'
        }}>
            <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight font-cinzel tracking-tight">
              {t('welcome.promise1')}
            </p>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-inter font-light">
              {t('welcome.promise2')}
            </p>
          </div>

          {/* CTA Bouton */}
          <div className="flex justify-center items-center animate-fade-in" style={{
          animationDelay: '200ms'
        }}>
            <Button 
              onClick={handleStart} 
              size="lg" 
              className="px-12 py-8 text-xl font-bold rounded-full shadow-2xl hover:shadow-primary/50 hover:scale-110 transition-all duration-300 font-poppins bg-gradient-to-r from-primary to-primary/80"
            >
              {t('welcome.cta.start')}
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

    </div>;
};
export default Welcome;