import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Globe, Palette, Bell, Moon, Sun, Volume2, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const { userProgress, updateLanguage } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [colorTheme, setColorTheme] = useState('default');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };
    checkAuth();

    // Load saved preferences from localStorage
    const savedNotifications = localStorage.getItem('notifications');
    const savedSound = localStorage.getItem('soundEffects');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedColorTheme = localStorage.getItem('colorTheme');

    if (savedNotifications) setNotifications(savedNotifications === 'true');
    if (savedSound) setSoundEffects(savedSound === 'true');
    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
    if (savedColorTheme) setColorTheme(savedColorTheme);
  }, [navigate]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    toast({
      title: 'Langue modifiée',
      description: `La langue a été changée en ${getLanguageName(lang)}`,
    });
  };

  const getLanguageName = (code: string): string => {
    const languages: { [key: string]: string } = {
      'fr': 'Français',
      'en': 'English',
      'es': 'Español',
      'it': 'Italiano',
      'de': 'Deutsch'
    };
    return languages[code] || code;
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem('notifications', String(checked));
    toast({
      title: checked ? 'Notifications activées' : 'Notifications désactivées',
      description: checked ? 'Vous recevrez des notifications' : 'Vous ne recevrez plus de notifications',
    });
  };

  const handleSoundToggle = (checked: boolean) => {
    setSoundEffects(checked);
    localStorage.setItem('soundEffects', String(checked));
    toast({
      title: checked ? 'Sons activés' : 'Sons désactivés',
      description: checked ? 'Les effets sonores sont activés' : 'Les effets sonores sont désactivés',
    });
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    localStorage.setItem('darkMode', String(checked));
    document.documentElement.classList.toggle('dark', checked);
    toast({
      title: checked ? 'Mode sombre activé' : 'Mode clair activé',
      description: checked ? 'L\'interface est maintenant en mode sombre' : 'L\'interface est maintenant en mode clair',
    });
  };

  const handleColorThemeChange = (theme: string) => {
    setColorTheme(theme);
    localStorage.setItem('colorTheme', theme);
    
    // Apply color theme to document root
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    toast({
      title: 'Thème de couleur modifié',
      description: `Le thème ${theme} a été appliqué`,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
      </div>

      <Header>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </Header>

      <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Smartphone className="w-8 h-8 text-primary" />
          Paramètres
        </h1>

        <div className="space-y-4">
          {/* Langue */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-lg font-semibold text-foreground mb-2 block">Langue</Label>
                <Select value={userProgress.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">🇫🇷 Français</SelectItem>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="es">🇪🇸 Español</SelectItem>
                    <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                    <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Thème de couleur */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-lg font-semibold text-foreground mb-2 block">Thème de couleur</Label>
                <Select value={colorTheme} onValueChange={handleColorThemeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Défaut (Turquoise & Or)</SelectItem>
                    <SelectItem value="ocean">Océan (Bleu & Cyan)</SelectItem>
                    <SelectItem value="sunset">Coucher de soleil (Orange & Rose)</SelectItem>
                    <SelectItem value="forest">Forêt (Vert & Émeraude)</SelectItem>
                    <SelectItem value="mystic">Mystique (Violet & Magenta)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  Personnalisez les couleurs de l'interface
                </p>
              </div>
            </div>
          </Card>

          {/* Mode sombre */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  {darkMode ? <Moon className="w-6 h-6 text-primary" /> : <Sun className="w-6 h-6 text-primary" />}
                </div>
                <div>
                  <Label className="text-lg font-semibold text-foreground">Mode sombre</Label>
                  <p className="text-sm text-muted-foreground">
                    Interface en mode nuit
                  </p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <Label className="text-lg font-semibold text-foreground">Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications push
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={handleNotificationsToggle}
              />
            </div>
          </Card>

          {/* Effets sonores */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Volume2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <Label className="text-lg font-semibold text-foreground">Effets sonores</Label>
                  <p className="text-sm text-muted-foreground">
                    Sons lors des interactions
                  </p>
                </div>
              </div>
              <Switch
                checked={soundEffects}
                onCheckedChange={handleSoundToggle}
              />
            </div>
          </Card>

          {/* Déconnexion */}
          <Card className="p-6 bg-card border-border">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              Se déconnecter
            </Button>
          </Card>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
