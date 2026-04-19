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

import { useApp } from '@/contexts/AppContext';
import { useAssistant } from '@/App';
import { toast } from 'sonner';
import { normalizeCountryName } from '@/lib/countryNameMapping';
import { logger } from '@/lib/logger';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { userProgress } = useApp();
  const { setIsOpen: setAssistantOpen } = useAssistant();
  const navigate = useNavigate();
  
  const handleCountryClick = (countryName: string) => {
    const normalizedName = normalizeCountryName(countryName);
    logger.log('🌍 Country clicked:', countryName, '→ normalized:', normalizedName);
    toast.info(`Navigation vers ${normalizedName}...`);
    navigate(`/country/${encodeURIComponent(normalizedName)}`);
  };
  
  // Debug log removed to prevent performance issues
  
  return (
    <div className={`min-h-screen flex flex-col ${isFullscreen ? 'bg-black' : 'bg-background'}`}>
      {/* Header with category filter - hidden in fullscreen mode */}
      {!isFullscreen && (
        <Header 
          onAssistantClick={() => setAssistantOpen(true)}
        />
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {/* Contenu qui remplit l'espace disponible */}
        <div 
          className={`flex-1 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
          style={{ height: isFullscreen ? '100dvh' : 'calc(100dvh - 130px)' }}
        >
          <TabsContent value="map" className="h-full m-0 p-0">
            <div className="h-full w-full relative">
              <Globe3D 
                tripPlaces={userProgress.tripPlaces} 
                onCountryClick={handleCountryClick}
                onFullscreenChange={setIsFullscreen}
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
          <TabsList className="fixed bottom-[36px] left-2 right-2 z-40 grid grid-cols-5 h-auto bg-background/95 backdrop-blur-md shadow-2xl border-2 border-primary/40 p-1 rounded-lg">
            <TabsTrigger value="ar" className="flex flex-col items-center justify-center gap-0.5 py-1.5">
              <Camera className="w-4 h-4" />
              <span className="text-[11px] leading-none">AR</span>
            </TabsTrigger>
            <TabsTrigger value="nearby" className="flex flex-col items-center justify-center gap-0.5 py-1.5">
              <Compass className="w-4 h-4" />
              <span className="text-[11px] leading-none">Proche</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex flex-col items-center justify-center gap-0.5 py-1.5">
              <MapPin className="w-4 h-4" />
              <span className="text-[11px] leading-none">Lieux</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex flex-col items-center justify-center gap-0.5 py-1.5">
              <Target className="w-4 h-4" />
              <span className="text-[11px] leading-none">Défis</span>
            </TabsTrigger>
            <TabsTrigger value="rankings" className="flex flex-col items-center justify-center gap-0.5 py-1.5">
              <Trophy className="w-4 h-4" />
              <span className="text-[11px] leading-none">Rang</span>
            </TabsTrigger>
          </TabsList>
        )}
      </Tabs>


      {/* Bottom navigation - hidden in fullscreen mode */}
      {!isFullscreen && <BottomNavigation />}
    </div>
  );
};

export default Explore;
