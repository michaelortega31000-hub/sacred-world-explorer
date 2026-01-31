import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, MapPin, Trophy, Target, Compass, Camera } from 'lucide-react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Globe3D from '@/components/Globe3D';
import LocationsTab from '@/components/LocationsTab';
import RankingsTab from '@/components/RankingsTab';
import ChallengesTab from '@/components/ChallengesTab';
import ProximityDetector from '@/components/ProximityDetector';
import ARCameraView from '@/components/ARCameraView';
import PlaceCategoryFilter, { PlaceCategoryFilterValue } from '@/components/PlaceCategoryFilter';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { normalizeCountryName } from '@/lib/countryNameMapping';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<PlaceCategoryFilterValue>('all');
  const { userProgress } = useApp();
  const navigate = useNavigate();
  
  const handleCountryClick = (countryName: string) => {
    const normalizedName = normalizeCountryName(countryName);
    console.log('🌍 Country clicked:', countryName, '→ normalized:', normalizedName);
    toast.info(`Navigation vers ${normalizedName}...`);
    navigate(`/country/${encodeURIComponent(normalizedName)}`);
  };
  
  console.log('🌍 Explore Page - userProgress.tripPlaces:', userProgress.tripPlaces);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with category filter - hidden in fullscreen mode */}
      {!isFullscreen && (
        <Header 
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {/* Contenu qui remplit l'espace disponible */}
        <div 
          className="flex-1 overflow-hidden" 
          style={{ height: isFullscreen ? '100dvh' : 'calc(100dvh - 130px)' }}
        >
          <TabsContent value="map" className="h-full m-0 p-0">
            <div className="h-full w-full relative">
              <Globe3D 
                tripPlaces={userProgress.tripPlaces} 
                onCountryClick={handleCountryClick}
                onFullscreenChange={setIsFullscreen}
                categoryFilter={categoryFilter}
              />
            </div>
          </TabsContent>

          <TabsContent value="ar" className="h-full m-0 p-0">
            <ARCameraView onClose={() => setActiveTab('map')} />
          </TabsContent>

          <TabsContent value="nearby" className="h-full m-0 p-2 overflow-auto">
            <ProximityDetector />
          </TabsContent>

          <TabsContent value="locations" className="h-full m-0 p-2 overflow-auto">
            <LocationsTab />
          </TabsContent>

          <TabsContent value="challenges" className="h-full m-0 p-2 overflow-auto">
            <ChallengesTab />
          </TabsContent>

          <TabsContent value="rankings" className="h-full m-0 p-2 overflow-auto">
            <RankingsTab />
          </TabsContent>
        </div>

        {/* TabsList FIXE au-dessus de BottomNavigation - hidden in fullscreen mode */}
        {!isFullscreen && (
          <TabsList className="fixed bottom-[36px] left-2 right-2 z-40 grid grid-cols-6 bg-background/95 backdrop-blur-md shadow-2xl border-2 border-primary/40 p-1 rounded-lg">
            <TabsTrigger value="map" className="flex flex-col items-center gap-0.5 py-1.5">
              <Globe className="w-4 h-4" />
              <span className="text-[10px]">Carte</span>
            </TabsTrigger>
            <TabsTrigger value="ar" className="flex flex-col items-center gap-0.5 py-1.5">
              <Camera className="w-4 h-4" />
              <span className="text-[10px]">AR</span>
            </TabsTrigger>
            <TabsTrigger value="nearby" className="flex flex-col items-center gap-0.5 py-1.5">
              <Compass className="w-4 h-4" />
              <span className="text-[10px]">Proche</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex flex-col items-center gap-0.5 py-1.5">
              <MapPin className="w-4 h-4" />
              <span className="text-[10px]">Lieux</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex flex-col items-center gap-0.5 py-1.5">
              <Target className="w-4 h-4" />
              <span className="text-[10px]">Défis</span>
            </TabsTrigger>
            <TabsTrigger value="rankings" className="flex flex-col items-center gap-0.5 py-1.5">
              <Trophy className="w-4 h-4" />
              <span className="text-[10px]">Rang</span>
            </TabsTrigger>
          </TabsList>
        )}
      </Tabs>

      {/* Category filter - floating bottom left, aligned with chatbot */}
      {!isFullscreen && (
        <div className="fixed bottom-24 left-4 z-50">
          <PlaceCategoryFilter 
            value={categoryFilter}
            onChange={setCategoryFilter}
            persistKey="explore"
          />
        </div>
      )}

      {/* Bottom navigation - hidden in fullscreen mode */}
      {!isFullscreen && <BottomNavigation />}
    </div>
  );
};

export default Explore;
