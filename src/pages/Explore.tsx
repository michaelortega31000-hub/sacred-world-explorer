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

const Explore = () => {
  const [activeTab, setActiveTab] = useState('map');
  
  return <div className="min-h-screen bg-background pb-20">
    <Header />
      
      <div className="container mx-auto px-2 py-1 sm:px-4 sm:py-2">
        <div className="space-y-2">
          <div className="space-y-2">
            
            
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-2 sm:mb-4">
              <TabsTrigger value="map" className="gap-1 sm:gap-2">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Carte 3D</span>
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

            <TabsContent value="map" className="space-y-2">
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-2xl h-[calc(100vh-200px)] sm:h-[calc(100vh-220px)]">
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