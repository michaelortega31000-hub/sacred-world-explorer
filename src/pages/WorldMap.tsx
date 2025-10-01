import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Maximize2, Minimize2, Calendar, MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getAllCountries } from '@/data/placesData';
import WeeklyQuestTab from '@/components/WeeklyQuestTab';
import TripPlannerTab from '@/components/TripPlannerTab';
import LocationsStatsTab from '@/components/LocationsStatsTab';
import Globe3D from '@/components/Globe3D';
import Header from '@/components/Header';

const WorldMap = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userProgress } = useApp();
  const countries = getAllCountries();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Ne pas naviguer automatiquement, seulement mettre à jour le terme de recherche
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      // Chercher dans les noms de pays traduits
      const searchLower = searchTerm.toLowerCase();
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

      <Tabs defaultValue="map" className="flex-1 flex flex-col">
        <div className="border-b-2" style={{ 
          background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
          borderColor: 'hsl(45 100% 51%)'
        }}>
          <div className="max-w-7xl mx-auto">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger value="map" className="gap-2 rounded-none border-b-2 text-black font-medium data-[state=active]:border-black data-[state=active]:bg-black/10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="2" />
                </svg>
                {t('worldMap.title')}
              </TabsTrigger>
              <TabsTrigger value="trip" className="gap-2 rounded-none border-b-2 text-black font-medium data-[state=active]:border-black data-[state=active]:bg-black/10">
                <Calendar className="w-4 h-4" />
                {t('tabs.tripPlanner')}
              </TabsTrigger>
              <TabsTrigger value="quest" className="gap-2 rounded-none border-b-2 text-black font-medium data-[state=active]:border-black data-[state=active]:bg-black/10">
                <Target className="w-4 h-4" />
                {t('tabs.weeklyQuest')}
              </TabsTrigger>
              <TabsTrigger value="locations" className="gap-2 rounded-none border-b-2 text-black font-medium data-[state=active]:border-black data-[state=active]:bg-black/10">
                <MapPin className="w-4 h-4" />
                Lieux & Classements
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="map" className="flex-1 m-0 relative min-h-[70vh]">
          {/* Globe 3D avec fond étoilé */}
          <Globe3D />

          {/* Barre de recherche overlay - côté gauche */}
          <div 
            className={`absolute top-4 left-4 backdrop-blur-sm rounded-xl shadow-2xl border-2 transition-all duration-300 z-50 ${
              isSearchExpanded ? 'w-96 p-4' : 'w-auto px-3 py-2'
            }`} 
            style={{ 
              background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
              borderColor: 'hsl(45 100% 51%)'
            }}
          >
            <div className="flex items-center gap-2">
              {isSearchExpanded && (
                <span className="text-lg">🌍</span>
              )}
              <input
                type="text"
                placeholder={isSearchExpanded ? t('worldMap.searchPlaceholder', "Rechercher un pays...") : "🔍"}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
                className={`bg-transparent text-black placeholder:text-black/60 font-medium focus:outline-none transition-all ${
                  isSearchExpanded ? 'w-full px-2 py-1' : 'w-10 text-center'
                }`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="text-black hover:bg-black/10 p-1 h-auto"
              >
                {isSearchExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="flex-1 m-0">
          <LocationsStatsTab />
        </TabsContent>

        <TabsContent value="trip" className="flex-1 m-0">
          <TripPlannerTab />
        </TabsContent>

        <TabsContent value="quest" className="flex-1 m-0">
          <WeeklyQuestTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorldMap;
