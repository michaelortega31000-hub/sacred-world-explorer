import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Trophy, Users, Target } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getAllCountries } from '@/data/placesData';
import RankingTab from '@/components/RankingTab';
import ReligionRankingTab from '@/components/ReligionRankingTab';
import WeeklyQuestTab from '@/components/WeeklyQuestTab';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const WorldMap = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userProgress } = useApp();
  const countries = getAllCountries();
  const [searchTerm, setSearchTerm] = useState('');

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/selection');
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      const filtered = countries.filter(c => c.toLowerCase().includes(value.toLowerCase()));
      if (filtered.length === 1) {
        navigate(`/country/${filtered[0]}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('worldMap.back')}
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{userProgress.totalPoints}</span> {t('country.points')}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="map" className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger value="map" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                {t('worldMap.title')}
              </TabsTrigger>
              <TabsTrigger value="ranking" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Trophy className="w-4 h-4" />
                {t('tabs.myRanking')}
              </TabsTrigger>
              <TabsTrigger value="religion" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Users className="w-4 h-4" />
                {t('tabs.religionRanking')}
              </TabsTrigger>
              <TabsTrigger value="quest" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Target className="w-4 h-4" />
                {t('tabs.weeklyQuest')}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="map" className="flex-1 m-0 relative">
          {/* Map container - Mer bleue réaliste */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(207 74% 70%) 0%, hsl(207 84% 50%) 100%)' }}>
            <ComposableMap 
              style={{ width: '100%', height: '100%' }} 
              projection="geoMercator"
              projectionConfig={{ 
                scale: 140,
                center: [10, 20]
              }}
            >
              <ZoomableGroup 
                zoom={1}
                minZoom={0.8}
                maxZoom={8}
                center={[10, 20]}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo: any) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => navigate(`/country/${geo.properties.name}`)}
                        style={{
                          default: { 
                            fill: '#8B7355', // Marron terre réaliste
                            stroke: '#5D4E37', // Bordure marron foncé
                            strokeWidth: 0.5, 
                            outline: 'none' 
                          },
                          hover: { 
                            fill: '#D4A574', // Beige doré au survol
                            stroke: '#5D4E37', 
                            strokeWidth: 0.8, 
                            outline: 'none', 
                            cursor: 'pointer' 
                          },
                          pressed: { 
                            fill: 'hsl(45 100% 51%)', // OR au clic
                            stroke: '#5D4E37', 
                            strokeWidth: 0.8, 
                            outline: 'none' 
                          },
                        }}
                      />
                    ))
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>

          {/* Search bar overlay - Simplifié */}
          <div className="absolute top-4 left-4 right-4 md:left-auto md:w-96 bg-card/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border-2" style={{ borderColor: 'hsl(45 100% 51%)' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'hsl(45 100% 51%)' }}>
              {t('worldMap.subtitle')}
            </h2>
            <input
              type="text"
              placeholder="Rechercher un pays..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                  const filtered = countries.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
                  if (filtered.length > 0) {
                    navigate(`/country/${filtered[0]}`);
                  }
                }
              }}
              className="w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              style={{ 
                borderColor: 'hsl(220 70% 45%)'
              }}
            />
            <p className="text-sm text-muted-foreground mt-3">
              💡 Utilisez la molette pour zoomer • Cliquez pour sélectionner
            </p>
          </div>
        </TabsContent>

        <TabsContent value="ranking" className="flex-1 m-0">
          <RankingTab />
        </TabsContent>

        <TabsContent value="religion" className="flex-1 m-0">
          <ReligionRankingTab />
        </TabsContent>

        <TabsContent value="quest" className="flex-1 m-0">
          <WeeklyQuestTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorldMap;
