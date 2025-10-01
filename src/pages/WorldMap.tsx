import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Maximize2, Minimize2, Calendar } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getAllCountries } from '@/data/placesData';
import RankingsTab from '@/components/RankingsTab';
import WeeklyQuestTab from '@/components/WeeklyQuestTab';
import TripPlannerTab from '@/components/TripPlannerTab';
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
        <div className="border-b border-border" style={{ background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(42 95% 38%) 100%)' }}>
          <div className="max-w-7xl mx-auto">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger value="map" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                {t('worldMap.title')}
              </TabsTrigger>
              <TabsTrigger value="trip" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Calendar className="w-4 h-4" />
                {t('tabs.tripPlanner')}
              </TabsTrigger>
              <TabsTrigger value="quest" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Target className="w-4 h-4" />
                {t('tabs.weeklyQuest')}
              </TabsTrigger>
              <TabsTrigger value="rankings" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Trophy className="w-4 h-4" />
                {t('tabs.rankings')}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="map" className="flex-1 m-0 relative min-h-[70vh]">
          {/* Globe 3D avec fond étoilé */}
          <Globe3D />

          {/* Barre de recherche overlay */}
          <div 
            className={`absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-xl shadow-2xl border-2 transition-all duration-300 z-50 ${
              isSearchExpanded ? 'w-[90%] max-w-2xl p-4' : 'w-auto px-4 py-2'
            }`} 
            style={{ borderColor: 'hsl(45 100% 51%)' }}
          >
            <div className="flex items-center gap-2">
              {isSearchExpanded && (
                <span style={{ color: 'hsl(45 100% 51%)' }} className="text-lg">🌍</span>
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
                className={`bg-transparent text-white placeholder:text-gray-400 focus:outline-none transition-all ${
                  isSearchExpanded ? 'w-full px-2 py-1' : 'w-24 text-center'
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

        <TabsContent value="trip" className="flex-1 m-0">
          <TripPlannerTab />
        </TabsContent>

        <TabsContent value="quest" className="flex-1 m-0">
          <WeeklyQuestTab />
        </TabsContent>

        <TabsContent value="rankings" className="flex-1 m-0">
          <RankingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorldMap;
