import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Mail, MapPin, Target, Award, Trophy } from 'lucide-react';
import logo from '@/assets/logo-glow.png';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useApp } from '@/contexts/AppContext';
import VoiceCommand from '@/components/VoiceCommand';

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
  const { unreadCount, markAsRead } = useUnreadMessages();
  const { userProgress, toggleGeolocation, userLocation } = useApp();

  // Pages où on affiche uniquement le texte "Sacred World" sans logo
  const isTextOnlyPage = location.pathname === '/world' || 
                         location.pathname === '/profile' ||
                         location.pathname.startsWith('/country') ||
                         location.pathname.startsWith('/place');


  const handleMessagesClick = () => {
    markAsRead();
    navigate('/world?tab=social&sub=messages');
  };

  const handleGeolocationToggle = () => {
    toggleGeolocation();
  };

  return (
    <div className={`relative ${isTextOnlyPage ? 'py-2 px-4' : 'p-4'} ${transparent ? 'bg-transparent' : 'bg-sacred-blue border-b border-primary/20'}`}>
      <div className="max-w-7xl mx-auto">
        {isTextOnlyPage ? (
          // Header compact pour les pages Globe/Planifier/Journal/Classements
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Gauche : Géolocalisation + Points + Badges */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${userProgress.geolocationEnabled && userLocation ? 'text-primary' : 'text-muted-foreground'}`} />
                <Switch
                  checked={userProgress.geolocationEnabled}
                  onCheckedChange={handleGeolocationToggle}
                  aria-label="Activer la géolocalisation"
                />
              </div>
              
              {/* Points obtenus */}
              <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-primary/10 rounded-full">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {userProgress.totalPoints.toLocaleString()}
                </span>
              </div>
              
              {/* Badges obtenus */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {userProgress.badges.length}
                </span>
              </div>
            </div>
            
            {/* Centre : Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img 
                src={logo} 
                alt="SacredWorld Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain cursor-pointer"
                onClick={() => navigate('/')}
              />
            </div>
            
            {/* Droite : Commande vocale + Quête + Messages */}
            <div className="flex items-center gap-1 sm:gap-2">
              <VoiceCommand />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/world?tab=quest')}
                className="hidden sm:flex gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10"
              >
                <Target className="w-4 h-4" />
                Quête
              </Button>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMessagesClick}
                  className="p-1.5 sm:p-2 text-foreground hover:bg-primary/10"
                  aria-label="Messages"
                  title="Messages"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-4 min-w-[16px] sm:h-5 sm:min-w-[20px] flex items-center justify-center p-0.5 sm:p-1 bg-primary text-primary-foreground text-[10px] sm:text-xs"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Header normal pour les autres pages
          <>
            <div className="flex flex-col items-center mb-4">
              <img 
                src={logo} 
                alt="SacredWorld Logo" 
                className="h-16 w-16 object-contain cursor-pointer mb-2"
                onClick={() => navigate('/')}
              />
              <h1 
                className="font-serif text-foreground tracking-wide cursor-pointer text-2xl"
                onClick={() => navigate('/')}
              >
                Sacred World
              </h1>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {showBack && (
                  <Button
                    variant="ghost"
                    onClick={() => backTo ? navigate(backTo) : navigate(-1)}
                    className="gap-2 text-foreground hover:bg-primary/10"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {backLabel}
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${userProgress.geolocationEnabled && userLocation ? 'text-primary' : 'text-muted-foreground'}`} />
                  <Switch
                    checked={userProgress.geolocationEnabled}
                    onCheckedChange={handleGeolocationToggle}
                    aria-label="Activer la géolocalisation"
                  />
                </div>
                
                <VoiceCommand />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/world?tab=quest')}
                  className="gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                >
                  <Target className="w-4 h-4" />
                  Quête
                </Button>
                
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
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
