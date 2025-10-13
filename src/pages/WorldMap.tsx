import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Maximize2, Minimize2, Calendar, MapPin, TrendingUp, Users, Pause, Play, BookOpen } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getAllCountries, mockPlaces } from '@/data/placesData';
import WeeklyQuestTab from '@/components/WeeklyQuestTab';
import TripPlannerTab from '@/components/TripPlannerTab';
import LocationsTab from '@/components/LocationsTab';
import RankingsTab from '@/components/RankingsTab';
import SocialTab from '@/components/SocialTab';
import Globe3D from '@/components/Globe3D';
import Header from '@/components/Header';

const WorldMap = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userProgress } = useApp();
  const countries = getAllCountries();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') || 'map';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isPaused, setIsPaused] = useState(false);
  const recenterFunction = useRef<() => void>(() => {});

  // Mettre à jour l'onglet actif quand l'URL change
  useEffect(() => {
    const currentTab = params.get('tab');
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [location.search]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Ne pas naviguer automatiquement, seulement mettre à jour le terme de recherche
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      
      // D'abord, chercher dans les villes
      const placeByCity = mockPlaces.find(place => 
        place.city.toLowerCase().includes(searchLower)
      );
      
      if (placeByCity) {
        // Si une ville est trouvée, aller vers le pays
        navigate(`/country/${placeByCity.country}`);
        return;
      }
      
      // Sinon, chercher dans les noms de pays
      const filtered = countries.filter(country => {
        const translatedName = t(`countries.${country}`, country);
        return translatedName.toLowerCase().includes(searchLower) || 
               country.toLowerCase().includes(searchLower);
      });
      
      if (filtered.length > 0) {
        navigate(`/country/${filtered[0]}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header>
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{userProgress.totalPoints}</span> {t('country.points')}
        </div>
      </Header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card">
          <div className="w-full px-2 py-1">
            <TabsList className="w-full h-auto p-0 bg-transparent grid grid-cols-3 gap-1">
              <TabsTrigger value="map" className="gap-1 rounded-sm border-b-2 data-[state=active]:border-primary py-2 px-1 text-[10px] sm:text-xs">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="2" />
                </svg>
                <span className="truncate">{t('worldMap.title')}</span>
              </TabsTrigger>
              <TabsTrigger value="trip" className="gap-1 rounded-sm border-b-2 data-[state=active]:border-primary py-2 px-1 text-[10px] sm:text-xs">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{t('tabs.tripPlanner')}</span>
              </TabsTrigger>
              <TabsTrigger value="quest" className="gap-1 rounded-sm border-b-2 data-[state=active]:border-primary py-2 px-1 text-[10px] sm:text-xs">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{t('tabs.weeklyQuest')}</span>
              </TabsTrigger>
              <TabsTrigger value="locations" className="gap-1 rounded-sm border-b-2 data-[state=active]:border-primary py-2 px-1 text-[10px] sm:text-xs">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">Lieux</span>
              </TabsTrigger>
              <TabsTrigger value="rankings" className="gap-1 rounded-sm border-b-2 data-[state=active]:border-primary py-2 px-1 text-[10px] sm:text-xs">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">Classements</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="gap-1 rounded-sm border-b-2 data-[state=active]:border-primary py-2 px-1 text-[10px] sm:text-xs">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">Social</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="map" className="flex-1 m-0 relative min-h-[70vh]">
          {/* Globe 3D immersif */}
          <Globe3D 
            onRecenterRef={(fn) => { recenterFunction.current = fn; }}
            onPausedChange={setIsPaused}
          />

          {/* Barre de recherche overlay - côté gauche */}
          <div 
            className={`absolute top-4 left-4 rounded-xl backdrop-blur-md border-2 transition-all duration-300 z-50 ${
              isSearchExpanded ? 'w-96 p-4' : 'w-auto px-3 py-2'
            }`} 
            style={{ 
              background: 'rgba(20, 43, 79, 0.85)',
              borderColor: 'rgba(52, 224, 161, 0.4)',
              boxShadow: '0 0 20px rgba(244, 197, 66, 0.2)'
            }}
          >
            <div className="flex items-center gap-2">
              {isSearchExpanded && (
                <span className="text-lg">🌍</span>
              )}
              <input
                type="text"
                placeholder={isSearchExpanded ? "Rechercher un pays ou une ville..." : "🔍"}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
                className={`bg-transparent text-[#F5F5F5] placeholder:text-[#EAD7B5]/60 font-medium focus:outline-none transition-all ${
                  isSearchExpanded ? 'w-full px-2 py-1' : 'w-10 text-center'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="hover:bg-[#34E0A1]/10 p-1 h-auto transition-all duration-300"
                style={{ color: '#34E0A1' }}
              >
                {isSearchExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Contrôles immersifs en bas */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-50">
            <Button
              onClick={() => recenterFunction.current()}
              className="gap-2 backdrop-blur-md border-2 transition-all duration-300 group"
              style={{
                background: 'rgba(20, 43, 79, 0.85)',
                color: '#F5F5F5',
                borderColor: 'rgba(52, 224, 161, 0.3)',
                boxShadow: '0 0 15px rgba(244, 197, 66, 0.2)'
              }}
            >
              <Target className="w-4 h-4 group-hover:text-[#34E0A1] transition-colors" />
              <span className="hidden sm:inline">Recentrer</span>
            </Button>

            <Button
              onClick={() => setIsPaused(!isPaused)}
              className="gap-2 backdrop-blur-md border-2 transition-all duration-300 group"
              style={{
                background: isPaused 
                  ? 'linear-gradient(135deg, rgba(52, 224, 161, 0.9) 0%, rgba(52, 224, 161, 0.7) 100%)' 
                  : 'rgba(20, 43, 79, 0.85)',
                color: isPaused ? '#0E1B3F' : '#F5F5F5',
                borderColor: isPaused ? '#34E0A1' : 'rgba(52, 224, 161, 0.3)',
                boxShadow: isPaused ? '0 0 20px rgba(52, 224, 161, 0.4)' : '0 0 15px rgba(244, 197, 66, 0.2)'
              }}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPaused ? 'Rotation' : 'Pause'}</span>
            </Button>

            <Button
              onClick={() => navigate('/world?tab=locations')}
              className="gap-2 backdrop-blur-md border-2 transition-all duration-300 group"
              style={{
                background: 'rgba(20, 43, 79, 0.85)',
                color: '#F5F5F5',
                borderColor: 'rgba(52, 224, 161, 0.3)',
                boxShadow: '0 0 15px rgba(244, 197, 66, 0.2)'
              }}
            >
              <BookOpen className="w-4 h-4 group-hover:text-[#F4C542] transition-colors" />
              <span className="hidden sm:inline">Journal</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="flex-1 m-0">
          <LocationsTab />
        </TabsContent>

        <TabsContent value="rankings" className="flex-1 m-0">
          <RankingsTab />
        </TabsContent>

        <TabsContent value="trip" className="flex-1 m-0">
          <TripPlannerTab />
        </TabsContent>

        <TabsContent value="quest" className="flex-1 m-0">
          <WeeklyQuestTab />
        </TabsContent>

        <TabsContent value="social" className="flex-1 m-0">
          <SocialTab defaultTab={(params.get('sub') as 'friends' | 'messages' | 'forum') || 'friends'} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorldMap;
