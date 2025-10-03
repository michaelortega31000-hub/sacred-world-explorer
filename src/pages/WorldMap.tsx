import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Maximize2, Minimize2, Calendar, MapPin, TrendingUp, Users } from 'lucide-react';
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
          {/* Globe 3D avec fond étoilé */}
          <Globe3D />

          {/* Barre de recherche overlay - côté gauche */}
          <div 
            className={`absolute top-4 left-4 rounded-xl shadow-2xl border-2 transition-all duration-300 z-50 ${
              isSearchExpanded ? 'w-96 p-4' : 'w-auto px-3 py-2'
            }`} 
            style={{ 
              background: 'rgba(0, 0, 0, 0.8)',
              borderColor: 'hsl(45 100% 51%)'
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
                className={`bg-transparent text-white placeholder:text-white/60 font-medium focus:outline-none transition-all ${
                  isSearchExpanded ? 'w-full px-2 py-1' : 'w-10 text-center'
                }`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="text-white hover:bg-white/10 p-1 h-auto"
              >
                {isSearchExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
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
