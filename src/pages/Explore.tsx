import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, MapPin, Trophy, Target } from 'lucide-react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import Globe3D from '@/components/Globe3D';
import LocationsTab from '@/components/LocationsTab';
import RankingsTab from '@/components/RankingsTab';
import ChallengesTab from '@/components/ChallengesTab';
import NearMeFeature from '@/components/NearMeFeature';
const Explore = () => {
  const [activeTab, setActiveTab] = useState('map');
  return <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            
            <p className="text-lg text-muted-foreground">
              Découvrez les lieux sacrés du monde entier
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="map" className="gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Carte 3D</span>
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
              <div className="rounded-xl overflow-hidden border border-border/50 shadow-2xl">
                <Globe3D />
              </div>
              <NearMeFeature />
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