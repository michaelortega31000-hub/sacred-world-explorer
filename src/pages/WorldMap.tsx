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
import CountriesByContinent from '@/components/CountriesByContinent';
import CalendarTab from '@/components/CalendarTab';
import Globe3D from '@/components/Globe3D';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

const WorldMap = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userProgress } = useApp();
  const countries = getAllCountries();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{type: 'country' | 'city', name: string, country?: string}>>([]);
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
    
    // Autocomplétion en temps réel
    if (value.trim().length >= 2) {
      const searchLower = value.toLowerCase();
      const results: Array<{type: 'country' | 'city', name: string, country?: string}> = [];
      
      // Chercher dans les villes
      mockPlaces.forEach(place => {
        if (place.city.toLowerCase().includes(searchLower)) {
          const exists = results.find(r => r.type === 'city' && r.name === place.city);
          if (!exists) {
            results.push({ type: 'city', name: place.city, country: place.country });
          }
        }
      });
      
      // Chercher dans les pays
      countries.forEach(country => {
        const translatedName = t(`countries.${country}`, country);
        if (translatedName.toLowerCase().includes(searchLower) || 
            country.toLowerCase().includes(searchLower)) {
          results.push({ type: 'country', name: translatedName, country });
        }
      });
      
      setSuggestions(results.slice(0, 5)); // Limiter à 5 suggestions
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: {type: 'country' | 'city', name: string, country?: string}) => {
    if (suggestion.type === 'city' && suggestion.country) {
      navigate(`/country/${suggestion.country}`);
    } else if (suggestion.type === 'country' && suggestion.country) {
      navigate(`/country/${suggestion.country}`);
    }
    setSearchTerm('');
    setSuggestions([]);
    setIsSearchExpanded(false);
  };

  const handleSearchSubmit = () => {
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <Header>
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{userProgress.totalPoints}</span> {t('country.points')}
        </div>
      </Header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsContent value="map" className="flex-1 m-0 relative min-h-[70vh]">
          {/* Globe 3D immersif */}
          <Globe3D 
            onRecenterRef={(fn) => { recenterFunction.current = fn; }}
            onPausedChange={setIsPaused}
            tripPlaces={userProgress.tripPlaces}
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
            
            {/* Suggestions d'autocomplétion */}
            {isSearchExpanded && suggestions.length > 0 && (
              <div className="mt-3 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[#34E0A1]/20 flex items-center gap-2"
                    style={{ color: '#F5F5F5' }}
                  >
                    <span className="text-lg">
                      {suggestion.type === 'city' ? '🏙️' : '🌍'}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium">{suggestion.name}</div>
                      {suggestion.type === 'city' && suggestion.country && (
                        <div className="text-xs" style={{ color: '#EAD7B5' }}>
                          {t(`countries.${suggestion.country}`, suggestion.country)}
                        </div>
                      )}
                    </div>
                    <MapPin className="w-4 h-4" style={{ color: '#34E0A1' }} />
                  </button>
                ))}
              </div>
            )}
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
          </div>
        </TabsContent>

        <TabsContent value="countries" className="flex-1 m-0">
          <CountriesByContinent />
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

        <TabsContent value="calendar" className="flex-1 m-0">
          <CalendarTab />
        </TabsContent>
      </Tabs>

      <BottomNavigation />
    </div>
  );
};

export default WorldMap;
