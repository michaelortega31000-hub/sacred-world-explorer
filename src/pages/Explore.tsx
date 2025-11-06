import { useState, useMemo } from 'react';
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
import { useApp } from '@/contexts/AppContext';
import { getTabImagesForReligion } from '@/lib/religionImageHelper';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('map');
  const { userProgress } = useApp();
  
  // Get images adapted to the selected religion
  const tabImages = useMemo(
    () => getTabImagesForReligion(userProgress.selectedReligion),
    [userProgress.selectedReligion]
  );
  
  return <div className="min-h-screen bg-background pb-20">
    <Header />
      
      <div className="container mx-auto px-4 py-2">
        <div className="space-y-6">
          <div className="space-y-2">
            
            
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-3">
              <TabsTrigger 
                value="map" 
                className="gap-2 relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${tabImages.map})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <Globe className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline relative z-10">Carte 3D</span>
              </TabsTrigger>
              <TabsTrigger 
                value="nearby" 
                className="gap-2 relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${tabImages.nearby})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <Compass className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline relative z-10">Proche</span>
              </TabsTrigger>
              <TabsTrigger 
                value="locations" 
                className="gap-2 relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${tabImages.locations})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <MapPin className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline relative z-10">Lieux</span>
              </TabsTrigger>
              <TabsTrigger 
                value="challenges" 
                className="gap-2 relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${tabImages.challenges})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <Target className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline relative z-10">Défis</span>
              </TabsTrigger>
              <TabsTrigger 
                value="rankings" 
                className="gap-2 relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${tabImages.rankings})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <Trophy className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline relative z-10">Classement</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-2xl">
                <Globe3D />
              </div>
              <NearMeFeature />
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