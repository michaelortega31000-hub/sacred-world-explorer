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
import NearMeFeature from '@/components/NearMeFeature';
import ProximityDetector from '@/components/ProximityDetector';
import ARCameraView from '@/components/ARCameraView';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { normalizeCountryName } from '@/lib/countryNameMapping';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('map');
  const { userProgress } = useApp();
  const navigate = useNavigate();
  
  const handleCountryClick = (countryName: string) => {
    const normalizedName = normalizeCountryName(countryName);
    console.log('🌍 Country clicked:', countryName, '→ normalized:', normalizedName);
    toast.info(`Navigation vers ${normalizedName}...`);
    navigate(`/country/${encodeURIComponent(normalizedName)}`);
  };
  
  console.log('🌍 Explore Page - userProgress.tripPlaces:', userProgress.tripPlaces);
  
  return <div className="min-h-screen bg-background pb-20">
    <Header />
      
      <div className="container mx-auto px-2 py-1 sm:px-4 sm:py-2">
        <div className="space-y-2">
          <div className="space-y-2">
            
            
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="map" className="relative space-y-2">
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-2xl h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)]">
                <Globe3D tripPlaces={userProgress.tripPlaces} onCountryClick={handleCountryClick} />
              </div>
              
              <TabsList className="absolute bottom-4 left-4 right-4 z-50 grid grid-cols-6 bg-background/95 backdrop-blur-md shadow-2xl border-2 border-primary/40 p-2 sm:p-3 rounded-lg">
                <TabsTrigger value="map" className="gap-1 sm:gap-2">
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Carte 3D</span>
                </TabsTrigger>
                <TabsTrigger value="ar" className="gap-1 sm:gap-2">
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">AR</span>
                </TabsTrigger>
                <TabsTrigger value="nearby" className="gap-1 sm:gap-2">
                  <Compass className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Proche</span>
                </TabsTrigger>
                <TabsTrigger value="locations" className="gap-1 sm:gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Lieux</span>
                </TabsTrigger>
                <TabsTrigger value="challenges" className="gap-1 sm:gap-2">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Défis</span>
                </TabsTrigger>
                <TabsTrigger value="rankings" className="gap-1 sm:gap-2">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Classement</span>
                </TabsTrigger>
              </TabsList>
              
              <NearMeFeature />
            </TabsContent>

            <TabsContent value="ar" className="h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)]">
              <ARCameraView onClose={() => setActiveTab('map')} />
            </TabsContent>

            <TabsContent value="nearby">
              <ProximityDetector />
            </TabsContent>

          <TabsContent value="locations">
            <LocationsTab />
          </TabsContent>

          <TabsContent value="challenges">
              <ChallengesTab />
            </TabsContent>

            <TabsContent value="rankings">
              <RankingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNavigation />
    </div>;
};
export default Explore;