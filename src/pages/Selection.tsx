import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp, Religion } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { religionColors } from '@/config/religionColors';
import logo from '@/assets/logo-icon.png';
// Icons for religious symbols
import { Church, Moon, Star as StarIcon, Sparkles, Flame as FlameIcon, Users, AtSign, LogOut } from 'lucide-react';

interface ReligionBubble {
  id: Religion;
  icon: React.ReactNode;
}

const religions: ReligionBubble[] = [
  { id: 'christianity', icon: <Church className="w-8 h-8" /> },
  { id: 'islam', icon: <Moon className="w-8 h-8" /> },
  { id: 'judaism', icon: <StarIcon className="w-8 h-8" /> },
  { id: 'buddhism', icon: <Sparkles className="w-8 h-8" /> },
  { id: 'hinduism', icon: <FlameIcon className="w-8 h-8" /> },
  { id: 'traditional', icon: <Users className="w-8 h-8" /> },
  { id: 'atheism', icon: <AtSign className="w-8 h-8" /> }
];

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'ar', name: 'العربية' }
];

const Selection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { updateReligion, updateLanguage, userProgress } = useApp();
  const { toast } = useToast();
  const [selectedReligion, setSelectedReligion] = useState<Religion | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  // Redirect to world if religion already selected
  useEffect(() => {
    const isOfflineMode = localStorage.getItem('selectedMode') === 'offline';
    
    // Si mode hors ligne, pas de vérification d'auth
    if (!isOfflineMode && userProgress.selectedReligion) {
      navigate('/world');
    }
  }, [userProgress.selectedReligion, navigate]);

  const handleReligionSelect = (religion: Religion) => {
    setSelectedReligion(religion);
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    updateLanguage(lang);
  };

  const handleLogout = async () => {
    const isOfflineMode = localStorage.getItem('selectedMode') === 'offline';
    
    if (isOfflineMode) {
      // En mode hors ligne, simplement retourner à l'accueil
      localStorage.removeItem('selectedMode');
      navigate('/');
    } else {
      // En mode connecté, déconnexion normale
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de se déconnecter",
          variant: "destructive",
        });
      } else {
        navigate('/auth');
      }
    }
  };

  const handleContinue = () => {
    if (selectedReligion) {
      updateReligion(selectedReligion);
      navigate('/world');
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col bg-background relative">
      {/* Overlay gradient turquoise subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
      
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
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center relative z-10">
        {/* Logo au-dessus du titre */}
        <div className="mb-6 flex justify-center animate-fade-in">
          <img 
            src={logo} 
            alt="SacredWorld Logo" 
            className="w-20 h-20 md:w-24 md:h-24 object-contain"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(244, 197, 66, 0.5))'
            }}
          />
        </div>
        
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-foreground mb-3">
            {t('selection.title')}
          </h1>
          <p className="font-inter text-lg text-muted-foreground">
            {t('selection.subtitle')}
          </p>
        </div>

        <div className="mb-8 flex justify-center animate-fade-in">
          <div className="w-full max-w-xs">
            <label className="font-inter block text-sm font-medium text-foreground mb-2 drop-shadow">
              {t('selection.language')}
            </label>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl animate-scale-in">
            {religions.map((religion, index) => {
              const colors = religionColors[religion.id];
              return (
                <button
                  key={religion.id}
                  onClick={() => handleReligionSelect(religion.id)}
                  className={`
                    aspect-square rounded-full ${colors.bg} ${colors.bgHover} ${colors.text}
                    flex flex-col items-center justify-center p-6 md:p-8
                    transition-all duration-300 hover:scale-110
                    ${selectedReligion === religion.id ? 'ring-4 ring-white scale-105' : ''}
                  `}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    boxShadow: selectedReligion === religion.id ? colors.shadow : undefined
                  }}
                >
                  {religion.icon}
                  <span className="font-inter mt-3 text-sm font-medium text-center">
                    {t(`selection.religions.${religion.id}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center pb-8 animate-fade-in">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedReligion}
            className="font-inter px-12 py-6 text-lg rounded-full bg-primary hover:bg-[hsl(var(--sacred-gold-dark))] text-primary-foreground shadow-[var(--shadow-gold)]"
          >
            {t('selection.continue')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Selection;
