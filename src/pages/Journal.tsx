import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import SocialTab from '@/components/SocialTab';
import { BackButton } from '@/components/BackButton';
import { ImageBackground } from '@/components/ImageBackground';
import { useApp } from '@/contexts/AppContext';
import { getBackgroundRotationImages } from '@/lib/religionImageHelper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Book, Map, ChevronRight, Calendar, Camera, Trophy } from 'lucide-react';

const Journal = () => {
  const navigate = useNavigate();
  const { userProgress } = useApp();
  const backgroundImages = getBackgroundRotationImages(userProgress.selectedReligion);

  const visitedCount = userProgress.visitedPlaces?.length || 0;
  const countriesCount = new Set(
    userProgress.visitedPlaces?.map(id => {
      // Simple extraction - in real app would map from places data
      return id.split('-')[0]?.toUpperCase();
    }) || []
  ).size;

  return (
    <ImageBackground 
      images={backgroundImages}
      carousel={true}
      blur={3}
      overlay="gradient"
      className="min-h-screen pb-20"
    >
      <div className="min-h-screen relative">
        <BackButton />
        
        <div className="container mx-auto px-4 py-6 pt-16 relative z-10">
          <div className="space-y-6">
            <div className="space-y-2 animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Mon Espace Social
              </h1>
              <p className="text-lg text-muted-foreground">
                Souvenirs, amis, messages et discussions
              </p>
            </div>

            {/* Travel Journal Card */}
            <Card 
              className="border-border/50 bg-gradient-to-br from-primary/10 via-card/80 to-accent/10 backdrop-blur-sm cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all group animate-fade-in"
              onClick={() => navigate('/travel-journal')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Book className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        Mon Carnet de Voyage
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Timeline, carte du parcours & export PDF
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>

                {/* Quick stats */}
                {visitedCount > 0 && (
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Map className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground font-medium">{visitedCount} lieux</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-foreground font-medium">{userProgress.totalPoints} pts</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <SocialTab />
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    </ImageBackground>
  );
};

export default Journal;