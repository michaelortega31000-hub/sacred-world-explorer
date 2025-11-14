import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Mail, MapPin, Target, Award, Cross, Moon, Star, Flower2, Flame, Atom, Globe, Users } from 'lucide-react';
import logo from '@/assets/logo-glow.png';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useApp } from '@/contexts/AppContext';
import { Religion } from '@/contexts/AppContext';
import { religionColors } from '@/config/religionColors';
import VoiceCommand from '@/components/VoiceCommand';
interface HeaderProps {
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
  children?: React.ReactNode;
  transparent?: boolean;
}
const Header = ({
  showBack = false,
  backTo = '/',
  backLabel = 'Retour',
  children,
  transparent = false
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    unreadCount,
    markAsRead
  } = useUnreadMessages();
  const {
    userProgress,
    toggleGeolocation,
    userLocation
  } = useApp();

  // Pages où on affiche uniquement le texte "Sacred World" sans logo
  const isTextOnlyPage = location.pathname === '/explore' || location.pathname === '/profile' || location.pathname.startsWith('/country') || location.pathname.startsWith('/place');
  
  // Afficher les contrôles de géolocalisation et voix uniquement sur la page explore
  const showExploreControls = location.pathname === '/explore';
  
  const handleMessagesClick = () => {
    markAsRead();
    navigate('/journal');
  };
  const handleGeolocationToggle = () => {
    toggleGeolocation();
  };
  const getReligionIcon = (religion: Religion | null) => {
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5";
    switch (religion) {
      case 'christianity':
        return <Cross className={iconClass} />;
      case 'islam':
        return <Moon className={iconClass} />;
      case 'judaism':
        return <Star className={iconClass} />;
      case 'buddhism':
        return <Flower2 className={iconClass} />;
      case 'hinduism':
        return <Flame className={iconClass} />;
      case 'astronomy':
        return <Atom className={iconClass} />;
      case 'traditional':
        return <Globe className={iconClass} />;
      case 'atheism':
        return <Users className={iconClass} />;
      default:
        return null;
    }
  };
  const religionColor = userProgress.selectedReligion ? religionColors[userProgress.selectedReligion] : null;
  return <div className={`relative ${isTextOnlyPage ? 'py-2 px-4' : 'p-4'} ${transparent ? 'bg-transparent' : 'bg-sacred-blue border-b border-primary/20'}`}>
      <div className="max-w-7xl mx-auto">
        {isTextOnlyPage ?
      // Header compact pour les pages Globe/Planifier/Journal/Classements
      <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Gauche : Religion + Géolocalisation + Points + Badges */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Indicateur de religion */}
              {userProgress.selectedReligion && religionColor && <div className={`flex items-center justify-center p-1.5 sm:p-2 ${religionColor.bg} rounded-full`} title={userProgress.selectedReligion}>
                  <div className={religionColor.text}>
                    {getReligionIcon(userProgress.selectedReligion)}
                  </div>
                </div>}
              
              {showExploreControls && (
                <div className="flex items-center gap-2">
                  <Switch checked={userProgress.geolocationEnabled} onCheckedChange={handleGeolocationToggle} aria-label="Activer la géolocalisation" />
                </div>
              )}
              
              {/* Points obtenus */}
              <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-primary/10 rounded-full">
                
                
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
              <img src={logo} alt="SacredWorld Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain cursor-pointer" onClick={() => navigate('/explore')} />
            </div>
            
            {/* Droite : Mail + Retour */}
            <div className="flex items-center gap-1 sm:gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Button variant="ghost" size="sm" onClick={handleMessagesClick} className="p-1.5 sm:p-2 text-foreground hover:bg-primary/10" aria-label="Messages" title="Messages">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                      {unreadCount > 0 && (
                        <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                      )}
                    </div>
                  </TooltipTrigger>
                  {unreadCount > 0 && (
                    <TooltipContent>
                      <p>{unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              <Button variant="ghost" size="sm" onClick={() => navigate('/explore')} className="p-1.5 sm:p-2 text-foreground hover:bg-primary/10" aria-label="Retour" title="Retour">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div> :
      // Header normal pour les autres pages
      <>
            <div className="flex flex-col items-center mb-4">
              <img src={logo} alt="SacredWorld Logo" className="h-16 w-16 object-contain cursor-pointer mb-2" onClick={() => navigate('/explore')} />
              <h1 className="font-serif text-foreground tracking-wide cursor-pointer text-2xl" onClick={() => navigate('/explore')}>
                Sacred World
              </h1>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {showBack && <Button variant="ghost" onClick={() => backTo ? navigate(backTo) : navigate(-1)} className="gap-2 text-foreground hover:bg-primary/10">
                    <ArrowLeft className="w-4 h-4" />
                    {backLabel}
                  </Button>}
              </div>
              
              <div className="flex items-center gap-2">
                {showExploreControls && (
                  <>
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-4 h-4 ${userProgress.geolocationEnabled && userLocation ? 'text-primary' : 'text-muted-foreground'}`} />
                      <Switch checked={userProgress.geolocationEnabled} onCheckedChange={handleGeolocationToggle} aria-label="Activer la géolocalisation" />
                    </div>
                    
                    <VoiceCommand />
                  </>
                )}
                
                
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Button variant="ghost" size="sm" onClick={handleMessagesClick} className="p-2 text-foreground hover:bg-primary/10" aria-label="Messages" title="Messages">
                          <Mail className="w-5 h-5" />
                        </Button>
                        {unreadCount > 0 && (
                          <div className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                        )}
                      </div>
                    </TooltipTrigger>
                    {unreadCount > 0 && (
                      <TooltipContent>
                        <p>{unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                {children}
              </div>
            </div>
          </>}
      </div>
    </div>;
};
export default Header;