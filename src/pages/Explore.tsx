import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, MapPin, Trophy, Target, Compass, Camera } from 'lucide-react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Globe3D from '@/components/Globe3D';
import { SpiritualOverlayLegend } from '@/components/quest/SpiritualOverlayLegend';
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
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['map', 'ar', 'nearby', 'locations', 'challenges', 'rankings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.key, location.search]);
  
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
        {/* Contenu pleine hauteur — la nav du bas et le pill flottent par-dessus */}
        <div
          className={`flex-1 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
          style={{ height: isFullscreen ? '100dvh' : '100dvh' }}
        >
          <TabsContent value="map" className="h-full m-0 p-0">
            <div className="h-full w-full relative">
              <Globe3D
                tripPlaces={userProgress.tripPlaces}
                onCountryClick={handleCountryClick}
                onFullscreenChange={setIsFullscreen}
              />
              {!isFullscreen && <SpiritualOverlayLegend />}
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

        {/* Pill flottant — glass-morphism, au-dessus du bottom nav, jamais une bande pleine largeur */}
        {!isFullscreen && (
          <TabsList
            className="fixed left-1/2 -translate-x-1/2 z-40 h-auto p-1 gap-1
                       border-0 shadow-none rounded-full
                       data-[state=active]:bg-transparent
                       inline-flex w-auto"
            style={{
              bottom: 'calc(env(safe-area-inset-bottom, 0px) + 130px)',
              background: 'linear-gradient(180deg, rgba(20,43,79,0.55) 0%, rgba(14,27,63,0.82) 100%)',
              backdropFilter: 'blur(18px) saturate(140%)',
              WebkitBackdropFilter: 'blur(18px) saturate(140%)',
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.06) inset, 0 12px 28px rgba(0,0,0,0.45), 0 0 0 1px rgba(244,197,66,0.10)',
            }}
          >
            {[
              { value: 'ar',         Icon: Camera,  label: 'AR' },
              { value: 'nearby',     Icon: Compass, label: 'Proche' },
              { value: 'locations',  Icon: MapPin,  label: 'Lieux' },
              { value: 'challenges', Icon: Target,  label: 'Défis' },
              { value: 'rankings',   Icon: Trophy,  label: 'Rang' },
            ].map(({ value, Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="relative px-3 py-1.5 rounded-full flex flex-col items-center gap-0.5
                           text-white/65 hover:text-white transition-colors
                           data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-300/30 data-[state=active]:to-amber-500/15
                           data-[state=active]:text-amber-100
                           data-[state=active]:shadow-[0_0_14px_rgba(244,197,66,0.35)]
                           data-[state=active]:border data-[state=active]:border-amber-300/40"
              >
                <Icon className="w-[15px] h-[15px]" />
                <span className="text-[10px] leading-none font-medium">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        )}
      </Tabs>


      {/* Bottom navigation - hidden in fullscreen mode */}
      {!isFullscreen && <BottomNavigation />}
    </div>
  );
};

export default Explore;
