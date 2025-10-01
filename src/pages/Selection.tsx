import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp, Religion } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
// Icons for religious symbols
import { Church, Moon, Star as StarIcon, Sparkles, Flame as FlameIcon, Users, AtSign, LogOut } from 'lucide-react';

interface ReligionBubble {
  id: Religion;
  icon: React.ReactNode;
  color: string;
}

const religions: ReligionBubble[] = [
  { id: 'christianity', icon: <Church className="w-8 h-8" />, color: 'bg-secondary hover:bg-secondary/90' },
  { id: 'islam', icon: <Moon className="w-8 h-8" />, color: 'bg-[hsl(142_76%_36%)] hover:bg-[hsl(142_76%_26%)]' },
  { id: 'judaism', icon: <StarIcon className="w-8 h-8" />, color: 'bg-primary hover:bg-[hsl(var(--sacred-gold-dark))]' },
  { id: 'buddhism', icon: <Sparkles className="w-8 h-8" />, color: 'bg-[hsl(25_95%_53%)] hover:bg-[hsl(25_95%_43%)]' },
  { id: 'hinduism', icon: <FlameIcon className="w-8 h-8" />, color: 'bg-accent hover:bg-accent/90' },
  { id: 'traditional', icon: <Users className="w-8 h-8" />, color: 'bg-[hsl(30_85%_50%)] hover:bg-[hsl(30_85%_40%)]' },
  { id: 'atheism', icon: <AtSign className="w-8 h-8" />, color: 'bg-muted-foreground hover:bg-muted-foreground/80' }
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
    if (userProgress.selectedReligion) {
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
  };

  const handleContinue = () => {
    if (selectedReligion) {
      updateReligion(selectedReligion);
      navigate('/world');
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col bg-gradient-to-br from-background via-[hsl(var(--sacred-blue-light))] to-[hsl(var(--sacred-red-light))]">
      <div className="absolute top-6 right-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-foreground hover:bg-background/20"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-foreground mb-3 drop-shadow-lg">
            {t('selection.title')}
          </h1>
          <p className="font-inter text-lg text-foreground/80 drop-shadow">
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
            {religions.map((religion, index) => (
              <button
                key={religion.id}
                onClick={() => handleReligionSelect(religion.id)}
                className={`
                  aspect-square rounded-full ${religion.color} text-white
                  flex flex-col items-center justify-center p-6 md:p-8
                  transition-all duration-300 hover:scale-110 hover:shadow-2xl
                  ${selectedReligion === religion.id ? 'ring-4 ring-primary scale-105 shadow-[0_0_30px_rgba(255,215,0,0.5)]' : ''}
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {religion.icon}
                <span className="font-inter mt-3 text-sm font-medium text-center">
                  {t(`selection.religions.${religion.id}`)}
                </span>
              </button>
            ))}
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
