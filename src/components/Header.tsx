import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, LogOut, Mail, MapPin } from 'lucide-react';
import logo from '@/assets/sacredworld-logo.jpg';
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
  const { toast } = useToast();
  const { unreadCount, markAsRead } = useUnreadMessages();
  const { userProgress, toggleGeolocation, userLocation, geolocationError } = useApp();

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
    <div className={`p-4 ${transparent ? 'bg-transparent' : 'border-b border-border'}`} style={!transparent ? { background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(42 95% 38%) 100%)' } : {}}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
          <Button
            variant="ghost"
            onClick={() => navigate(backTo)}
            className={`gap-2 ${transparent ? 'text-white hover:bg-white/10' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Button>
          )}
          <img 
            src={logo} 
            alt="SacredWorld Logo" 
            className="h-12 w-12 object-contain cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mode Géolocalisation */}
          <div className="flex items-center gap-2">
            <MapPin className={`w-4 h-4 ${userProgress.geolocationEnabled && userLocation ? 'text-green-500' : transparent ? 'text-white' : 'text-muted-foreground'}`} />
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
              className={`p-2 ${transparent ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/10'}`}
              aria-label="Messages"
              title="Messages"
            >
              <Mail className="w-5 h-5" />
            </Button>
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-1 bg-red-500 text-white text-xs"
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
            className={`gap-2 ${transparent ? 'text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
