import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '@/components/BackButton';
import BottomNavigation from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Globe, Palette, Bell, Moon, Sun, Volume2, Smartphone, User, Shield, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useTranslation } from 'react-i18next';
import { ImageBackground } from '@/components/ImageBackground';
import { getBackgroundRotationImages } from '@/lib/religionImageHelper';
import EventReminderSettings from '@/components/EventReminderSettings';
import { logger } from '@/lib/logger';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const { userProgress, updateLanguage } = useApp();
  const { isAdmin } = useIsAdmin();
  const backgroundImages = getBackgroundRotationImages(userProgress.selectedReligion);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [colorTheme, setColorTheme] = useState('default');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      } else {
        setUserId(session.user.id);
        // Fetch username
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (!error && data?.username) {
          setUsername(data.username);
        }
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
    if (savedDarkMode) {
      const isDark = savedDarkMode === 'true';
      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
      document.documentElement.setAttribute('data-theme', savedColorTheme);
    }
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

  const handleUsernameUpdate = async () => {
    if (!userId) return;
    
    // Validate username
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3) {
      toast({
        variant: 'destructive',
        title: 'Nom d\'utilisateur trop court',
        description: 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
      });
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      toast({
        variant: 'destructive',
        title: 'Nom d\'utilisateur invalide',
        description: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores',
      });
      return;
    }

    setIsUpdatingUsername(true);
    
    try {
      // Check if username is already taken
      const { data: existing, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', trimmedUsername)
        .neq('id', userId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        toast({
          variant: 'destructive',
          title: 'Nom d\'utilisateur déjà pris',
          description: 'Ce nom d\'utilisateur est déjà utilisé par un autre utilisateur',
        });
        return;
      }

      // Update username
      const { error } = await supabase
        .from('profiles')
        .update({ username: trimmedUsername })
        .eq('id', userId);

      if (error) throw error;

      setUsername(trimmedUsername);
      toast({
        title: 'Nom d\'utilisateur mis à jour',
        description: 'Votre nom d\'utilisateur a été modifié avec succès',
      });
    } catch (error) {
      logger.error('Error updating username:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le nom d\'utilisateur',
      });
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  return (
    <ImageBackground 
      images={backgroundImages}
      carousel={true}
      blur={3}
      overlay="gradient"
      className="min-h-screen pb-20"
    >
      <div className="min-h-screen relative overflow-hidden pb-20">
        <BackButton />

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

          {/* Nom d'utilisateur */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-lg font-semibold text-foreground mb-2 block">
                  Nom d'utilisateur
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="votre_nom_utilisateur"
                    className="flex-1"
                    maxLength={30}
                  />
                  <Button
                    onClick={handleUsernameUpdate}
                    disabled={isUpdatingUsername || !username.trim()}
                    size="sm"
                  >
                    {isUpdatingUsername ? 'Mise à jour...' : 'Enregistrer'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Requis pour partager votre profil publiquement
                </p>
                
                {/* Link to Avatar Gallery */}
                <Button
                  onClick={() => navigate('/avatars')}
                  variant="outline"
                  className="w-full mt-3"
                  size="sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Galerie d'Avatars
                </Button>
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

          {/* Event Reminders */}
          <EventReminderSettings />

          {/* Test de Sécurité */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-success/10 rounded-full">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <Label className="text-lg font-semibold text-foreground mb-2 block">
                  Test de Sécurité
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Vérifiez que vos données sont correctement protégées par les politiques de sécurité
                </p>
                <Button
                  onClick={() => navigate('/security-test')}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Lancer les tests de sécurité
                </Button>
              </div>
            </div>
          </Card>

          {/* Admin Dashboard */}
          {isAdmin && (
            <Card className="p-6 bg-card border-border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <Label className="text-lg font-semibold text-foreground mb-2 block">
                    Administration
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Accéder au tableau de bord administrateur pour surveiller la sécurité
                  </p>
                  <Button
                    onClick={() => navigate('/admin/dashboard')}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Tableau de bord admin
                  </Button>
                </div>
              </div>
            </Card>
          )}

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
  </ImageBackground>
  );
};

export default Settings;
