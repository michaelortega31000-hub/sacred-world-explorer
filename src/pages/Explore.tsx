import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, MapPin, Trophy, Target, Compass } from 'lucide-react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Globe3D from '@/components/Globe3D';
import LocationsTab from '@/components/LocationsTab';
import RankingsTab from '@/components/RankingsTab';
import ChallengesTab from '@/components/ChallengesTab';
import NearMeFeature from '@/components/NearMeFeature';
import ProximityDetector from '@/components/ProximityDetector';
import { ImageBackground } from '@/components/ImageBackground';
import { useApp } from '@/contexts/AppContext';
import { getBackgroundRotationImages } from '@/lib/religionImageHelper';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('map');
  const { userProgress } = useApp();
  const backgroundImages = getBackgroundRotationImages(userProgress.selectedReligion);
  
  return <ImageBackground 
    images={backgroundImages}
    carousel={true}
    blur={4}
    overlay="gradient"
    className="min-h-screen pb-20"
  >
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
      </div>
      
      <Header />
      
      <div className="container mx-auto px-4 py-2 relative z-10">
        <div className="space-y-6">
          <div className="space-y-2">
            
            
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-3 bg-card/80 backdrop-blur-sm">
              <TabsTrigger value="map" className="gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Carte 3D</span>
              </TabsTrigger>
              <TabsTrigger value="nearby" className="gap-2">
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">Proche</span>
              </TabsTrigger>
              <TabsTrigger value="locations" className="gap-2">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Lieux</span>
              </TabsTrigger>
              <TabsTrigger value="challenges" className="gap-2">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Défis</span>
              </TabsTrigger>
              <TabsTrigger value="rankings" className="gap-2">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Classement</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-2xl bg-background/80 backdrop-blur-sm">
                <Globe3D />
              </div>
              <NearMeFeature />
            </TabsContent>

            <TabsContent value="nearby">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4">
                <ProximityDetector />
              </div>
            </TabsContent>

            <TabsContent value="locations">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4">
                <LocationsTab />
              </div>
            </TabsContent>

            <TabsContent value="challenges">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4">
                <ChallengesTab />
              </div>
            </TabsContent>

            <TabsContent value="rankings">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4">
                <RankingsTab />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNavigation />
    </div>
  </ImageBackground>;
};
export default Explore;