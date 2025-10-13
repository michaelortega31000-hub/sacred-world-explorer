import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import splashHero from '@/assets/splash-hero.png';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, WifiOff } from 'lucide-react';
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
        const hasMode = localStorage.getItem('selectedMode');
        if (hasMode) {
          navigate('/selection');
        } else {
          navigate('/mode-selection');
        }
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
    // Stocker le mode hors ligne et aller directement à la sélection
    localStorage.setItem('selectedMode', 'offline');
    navigate('/selection');
  };

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
      
      {/* Bouton Mode hors ligne en haut à droite */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          onClick={handleOfflineMode}
          variant="outline"
          className="gap-2 border-primary/30 bg-sacred-blue/80 backdrop-blur-sm hover:bg-primary/20 text-foreground"
        >
          <WifiOff className="w-4 h-4" />
          Mode hors ligne
        </Button>
      </div>
      
      {/* Clickable zones overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {/* Empty space for logo and text - centered */}
        <div className="flex-1 flex items-center justify-center w-full max-w-2xl">
          {/* This space contains the logo and text from the image */}
        </div>
        
        {/* Button zone - positioned where "Commencer l'exploration" appears */}
        <div className="w-full max-w-md mb-8">
          <button
            onClick={handleStartExploration}
            className="w-full h-16 cursor-pointer opacity-0 hover:opacity-10 transition-opacity bg-primary rounded-full"
            aria-label="Commencer l'exploration"
          />
        </div>
        
        {/* Language selector zone - positioned at bottom */}
        <div className="mb-8">
          <button
            onClick={handleLanguageClick}
            className="w-32 h-8 cursor-pointer opacity-0 hover:opacity-10 transition-opacity bg-primary rounded"
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
    </div>
  );
};

export default Splash;
