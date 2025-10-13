import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import splashHero from '@/assets/splash-hero.png';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Globe, Check } from 'lucide-react';
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

const Splash = () => {
  const navigate = useNavigate();
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Si connecté, vérifier s'il a choisi un mode
        const hasMode = localStorage.getItem('selectedMode');
        if (hasMode) {
          navigate('/selection');
        } else {
          navigate('/mode-selection');
        }
      }
    });
  }, [navigate]);

  const handleStartExploration = () => {
    // Rediriger vers la page d'authentification pour commencer
    navigate('/auth');
  };

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    setShowLanguages(false);
  };

  const currentLanguage = languages.find(l => l.code === selectedLanguage) || languages[0];

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #0E1B3F 30%, #1a3a52 60%, #0E1B3F 100%)'
      }}
    >
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4 text-center">
        {/* Hero image from your mockup - responsive sizing */}
        <div className="mb-8 md:mb-12 animate-fade-in w-full flex justify-center">
          <img 
            src={splashHero} 
            alt="SacredWorld" 
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-contain"
            style={{
              maxHeight: '60vh'
            }}
          />
        </div>

        {/* CTA Button with golden border glow - responsive */}
        <Button
          onClick={handleStartExploration}
          size="lg"
          className="relative text-white font-medium px-8 sm:px-10 md:px-12 py-4 md:py-6 rounded-full transition-all duration-300 hover:scale-105 animate-fade-in mb-8 md:mb-12"
          style={{
            background: 'linear-gradient(135deg, rgba(52, 224, 161, 0.9) 0%, rgba(52, 224, 161, 0.7) 100%)',
            border: '2px solid rgba(244, 197, 66, 0.8)',
            boxShadow: '0 0 30px rgba(244, 197, 66, 0.6), 0 0 60px rgba(52, 224, 161, 0.4), inset 0 0 20px rgba(244, 197, 66, 0.2)',
            animationDelay: '400ms',
            fontSize: 'clamp(0.9rem, 2vw, 1.125rem)'
          }}
        >
          Commencer l'exploration
        </Button>

        {/* Language selector - responsive */}
        <div 
          onClick={() => setShowLanguages(true)}
          className="flex items-center gap-2 text-foreground opacity-80 hover:opacity-100 transition-opacity cursor-pointer animate-fade-in"
          style={{
            animationDelay: '600ms',
            fontSize: 'clamp(0.9rem, 2vw, 1.125rem)'
          }}
        >
          <Globe className="w-4 h-4 md:w-5 md:h-5" />
          <span>{currentLanguage.flag} {currentLanguage.name}</span>
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
      </div>
    </div>
  );
};

export default Splash;
