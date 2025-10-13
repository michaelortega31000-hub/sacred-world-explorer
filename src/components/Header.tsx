import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, LogOut, Mail, MapPin } from 'lucide-react';
import logo from '@/assets/sacredworld-logo.png';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useApp } from '@/contexts/AppContext';

interface HeaderProps {
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
  children?: React.ReactNode;
  transparent?: boolean;
}

const Header = ({ showBack = false, backTo = '/', backLabel = 'Retour', children, transparent = false }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { unreadCount, markAsRead } = useUnreadMessages();
  const { userProgress, toggleGeolocation, userLocation, geolocationError } = useApp();

  // Pages où on affiche uniquement le texte "Sacred World" sans logo
  const isTextOnlyPage = location.pathname === '/world' || 
                         location.pathname === '/profile' ||
                         location.pathname.startsWith('/country') ||
                         location.pathname.startsWith('/place');

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de se déconnecter',
        variant: 'destructive'
      });
    } else {
      navigate('/');
    }
  };

  const handleMessagesClick = () => {
    markAsRead();
    navigate('/world?tab=social&sub=messages');
  };

  const handleGeolocationToggle = () => {
    if (!userProgress.geolocationEnabled) {
      toast({
        title: 'Mode Géolocalisation',
        description: 'La géolocalisation est maintenant activée pour l\'expérience VR/AR',
      });
    } else {
      toast({
        title: 'Mode Géolocalisation',
        description: 'La géolocalisation a été désactivée',
      });
    }
    toggleGeolocation();
  };

  return (
    <div className={`relative ${isTextOnlyPage ? 'py-2 px-4' : 'p-4'} ${transparent ? 'bg-transparent' : 'bg-sacred-blue border-b border-primary/20'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Affichage conditionnel : texte seul ou logo + texte */}
        <div className={`flex ${isTextOnlyPage ? 'flex-row justify-center items-center' : 'flex-col items-center mb-4'}`}>
          {!isTextOnlyPage && (
            <img 
              src={logo} 
              alt="SacredWorld Logo" 
              className="h-16 w-16 object-contain cursor-pointer gold-halo mb-2"
              onClick={() => navigate('/')}
            />
          )}
          <h1 
            className={`font-serif text-foreground tracking-wide cursor-pointer ${isTextOnlyPage ? 'text-3xl' : 'text-2xl'}`}
            onClick={() => navigate('/')}
          >
            Sacred World
          </h1>
        </div>
        
        {/* Barre de navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBack && (
            <Button
              variant="ghost"
              onClick={() => navigate(backTo)}
              className="gap-2 text-foreground hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mode Géolocalisation */}
            <div className="flex items-center gap-2">
              <MapPin className={`w-4 h-4 ${userProgress.geolocationEnabled && userLocation ? 'text-primary' : 'text-muted-foreground'}`} />
              <Switch
                checked={userProgress.geolocationEnabled}
                onCheckedChange={handleGeolocationToggle}
                aria-label="Activer la géolocalisation"
              />
            </div>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMessagesClick}
                className="p-2 text-foreground hover:bg-primary/10"
                aria-label="Messages"
                title="Messages"
              >
                <Mail className="w-5 h-5" />
              </Button>
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-1 bg-primary text-primary-foreground text-xs"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </div>
            {children}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
