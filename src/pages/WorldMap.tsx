import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Trophy, Users, Target } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getAllCountries } from '@/data/placesData';
import RankingTab from '@/components/RankingTab';
import ReligionRankingTab from '@/components/ReligionRankingTab';
import WeeklyQuestTab from '@/components/WeeklyQuestTab';

const WorldMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userProgress } = useApp();
  const [mapboxToken, setMapboxToken] = useState('');
  const countries = getAllCountries();

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe' as any,
      zoom: 1.5,
      center: [30, 15],
      pitch: 0,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.scrollZoom.disable();

    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(242, 236, 226)',
        'high-color': 'rgb(0, 55, 32)',
        'horizon-blend': 0.1,
      });
    });

    map.current.on('click', (e) => {
      console.log('Map clicked at:', e.lngLat);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  if (!mapboxToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">Configuration Mapbox</h2>
          <p className="text-muted-foreground mb-6">
            Pour afficher la carte interactive, veuillez entrer votre token Mapbox.
            Obtenez-le sur <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
          </p>
          <input
            type="text"
            placeholder="pk.eyJ1Ijoi..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="w-full px-4 py-3 border border-input rounded-lg mb-4 focus:ring-2 focus:ring-ring"
          />
          <Button onClick={() => {}} className="w-full" disabled={!mapboxToken}>
            Charger la carte
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/selection')}
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
          <div ref={mapContainer} className="absolute inset-0" />
          
          <div className="absolute top-4 left-4 right-4 md:left-auto md:w-96 bg-card/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-border">
            <h2 className="text-xl font-bold text-card-foreground mb-2">
              {t('worldMap.subtitle')}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Cliquez sur un pays dans la liste ci-dessous
            </p>
            <div className="max-h-64 overflow-y-auto space-y-2">
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
