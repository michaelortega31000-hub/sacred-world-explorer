import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Mail, Award } from 'lucide-react';
import logo from '@/assets/sacred-world-logo-header.png';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useApp } from '@/contexts/AppContext';
import VoiceCommand from '@/components/VoiceCommand';
import ReligionIcon from '@/components/ReligionIcon';
import PlaceCategoryFilter, { PlaceCategoryFilterValue } from '@/components/PlaceCategoryFilter';

interface HeaderProps {
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
  children?: React.ReactNode;
  transparent?: boolean;
  categoryFilter?: PlaceCategoryFilterValue;
  onCategoryChange?: (value: PlaceCategoryFilterValue) => void;
}

const Header = ({
  showBack = false,
  backTo = '/',
  backLabel = 'Retour',
  children,
  transparent = false,
  categoryFilter,
  onCategoryChange
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount, markAsRead } = useUnreadMessages();
  const { userProgress } = useApp();

  // Pages où on affiche uniquement le texte "Sacred World" sans logo
  const isTextOnlyPage = location.pathname === '/explore' || location.pathname === '/profile' || location.pathname.startsWith('/country') || location.pathname.startsWith('/place');
  
  // Afficher les contrôles de géolocalisation et voix uniquement sur la page explore
  const showExploreControls = location.pathname === '/explore';
  
  const handleMessagesClick = () => {
    markAsRead();
    navigate('/journal');
  };

  return (
    <div className={`relative ${isTextOnlyPage ? 'py-2 px-4' : 'p-4'} ${transparent ? 'bg-transparent' : 'bg-sacred-blue border-b border-primary/20'}`}>
      <div className="max-w-7xl mx-auto">
        {isTextOnlyPage ? (
          // Header compact pour les pages Globe/Planifier/Journal/Classements
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Gauche : Religion + Badges + Filtre */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* 1. Indicateur de religion */}
              {userProgress.selectedReligion && (
                <div
                  className="flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm shadow-md border border-white/20 overflow-hidden"
                  title={userProgress.selectedReligion}
                >
                  <ReligionIcon religion={userProgress.selectedReligion} size="lg" />
                </div>
              )}
              
              {/* 2. Badges obtenus */}
              <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-primary/10 rounded-full">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {userProgress.badges.length}
                </span>
              </div>

              {/* 3. Filtre de catégorie */}
              {showExploreControls && categoryFilter !== undefined && onCategoryChange && (
                <PlaceCategoryFilter 
                  value={categoryFilter}
                  onChange={onCategoryChange}
                  persistKey="explore"
                />
              )}
            </div>
            
            {/* Centre : Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img src={logo} alt="SacredWorld Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain cursor-pointer" onClick={() => navigate('/explore')} />
            </div>
            
            {/* Droite : Micro + Mail + Retour */}
            <div className="flex items-center gap-1 sm:gap-2">
              {showExploreControls && <VoiceCommand />}

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

              {location.pathname !== '/explore' && (
                <Button variant="ghost" size="sm" onClick={() => navigate('/explore')} className="p-1.5 sm:p-2 text-foreground hover:bg-primary/10" aria-label="Retour au globe" title="Retour au globe">
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              )}
            </div>
          </div>
        ) : (
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
                {showBack && (
                  <Button variant="ghost" onClick={() => backTo ? navigate(backTo) : navigate(-1)} className="gap-2 text-foreground hover:bg-primary/10">
                    <ArrowLeft className="w-4 h-4" />
                    {backLabel}
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
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

                {location.pathname !== '/explore' && (
                  <Button variant="ghost" size="sm" onClick={() => navigate('/explore')} className="p-2 text-foreground hover:bg-primary/10" aria-label="Retour au globe" title="Retour au globe">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}

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
