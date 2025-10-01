import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/selection');
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
          {/* Map container */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(36 85% 55%) 100%)' }}>
            <ComposableMap style={{ width: '100%', height: '100%' }} projectionConfig={{ scale: 160 }}>
              <ZoomableGroup>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo: any) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => navigate(`/country/${geo.properties.name}`)}
                        style={{
                          default: { fill: 'hsl(155 100% 11%)', stroke: 'hsl(39 36% 93%)', strokeWidth: 0.5, outline: 'none' },
                          hover: { fill: 'hsl(0 63% 23%)', stroke: 'hsl(39 36% 93%)', strokeWidth: 0.5, outline: 'none', cursor: 'pointer' },
                          pressed: { fill: 'hsl(210 100% 20%)', stroke: 'hsl(39 36% 93%)', strokeWidth: 0.5, outline: 'none' },
                        }}
                      />
                    ))
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>

          {/* Search bar overlay */}
          <div className="absolute top-4 left-4 right-4 md:left-auto md:w-96 bg-card/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border">
            <h2 className="text-xl font-bold text-card-foreground mb-4">
              {t('worldMap.subtitle')}
            </h2>
            <input
              type="text"
              placeholder="Rechercher un pays..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                const filtered = countries.filter(c => c.toLowerCase().includes(value));
                const list = document.getElementById('countries-list');
                if (list) {
                  list.innerHTML = filtered.map(c => 
                    `<button class="w-full text-left px-4 py-3 bg-background hover:bg-accent rounded-lg transition-colors country-btn" data-country="${c}">
                      <span class="font-medium text-foreground">${c}</span>
                    </button>`
                  ).join('');
                  // Re-attach event listeners
                  list.querySelectorAll('.country-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                      navigate(`/country/${btn.getAttribute('data-country')}`);
                    });
                  });
                }
              }}
            />
            <div id="countries-list" className="max-h-64 overflow-y-auto space-y-2 mt-4">
              {countries.map((country) => (
                <button
                  key={country}
                  onClick={() => navigate(`/country/${country}`)}
                  className="w-full text-left px-4 py-3 bg-background hover:bg-accent rounded-lg transition-colors"
                >
                  <span className="font-medium text-foreground">{country}</span>
                </button>
              ))}
            </div>
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
