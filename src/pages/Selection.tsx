import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp, Religion } from '@/contexts/AppContext';
import { Cross, Moon, Star, Flower2, AtSign, Sun, Users } from 'lucide-react';

interface ReligionBubble {
  id: Religion;
  icon: React.ReactNode;
  color: string;
}

const religions: ReligionBubble[] = [
  { id: 'christianity', icon: <Cross className="w-8 h-8" />, color: 'bg-primary hover:bg-primary/90' },
  { id: 'islam', icon: <Moon className="w-8 h-8" />, color: 'bg-accent hover:bg-accent/90' },
  { id: 'judaism', icon: <Star className="w-8 h-8" />, color: 'bg-secondary hover:bg-secondary/90' },
  { id: 'buddhism', icon: <Flower2 className="w-8 h-8" />, color: 'bg-primary hover:bg-primary/80' },
  { id: 'hinduism', icon: <Sun className="w-8 h-8" />, color: 'bg-accent hover:bg-accent/80' },
  { id: 'traditional', icon: <Users className="w-8 h-8" />, color: 'bg-secondary hover:bg-secondary/80' },
  { id: 'atheism', icon: <AtSign className="w-8 h-8" />, color: 'bg-muted hover:bg-muted/90' }
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
  const { updateReligion, updateLanguage } = useApp();
  const [selectedReligion, setSelectedReligion] = useState<Religion | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleReligionSelect = (religion: Religion) => {
    setSelectedReligion(religion);
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    updateLanguage(lang);
  };

  const handleContinue = () => {
    if (selectedReligion) {
      updateReligion(selectedReligion);
      navigate('/world');
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col" style={{ background: 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(36 85% 55%) 100%)' }}>
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            {t('selection.title')}
          </h1>
          <p className="text-lg text-white/90 drop-shadow">
            {t('selection.subtitle')}
          </p>
        </div>

        <div className="mb-8 flex justify-center animate-fade-in">
          <div className="w-full max-w-xs">
            <label className="block text-sm font-medium text-white mb-2 drop-shadow">
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
                  ${selectedReligion === religion.id ? 'ring-4 ring-foreground scale-105' : ''}
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {religion.icon}
                <span className="mt-3 text-sm font-medium text-center">
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
            className="px-12 py-6 text-lg rounded-full"
          >
            {t('selection.continue')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Selection;
