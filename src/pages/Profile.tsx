import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, MapPin, Star, Globe } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { userProgress } = useApp();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  const badgeLabels: Record<string, string> = {
    explorer: 'Explorateur',
    pilgrim: 'Pèlerin',
    master: 'Maître'
  };

  return (
    <div className="min-h-screen bg-sacred-blue relative overflow-hidden">
      {/* Background with rotating globe effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
      </div>

      <Header />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 pb-24">
        <div 
          className="bg-sacred-beige/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl"
          style={{
            boxShadow: '0 0 40px rgba(52, 224, 161, 0.2), 0 0 80px rgba(244, 197, 66, 0.1)'
          }}
        >
          <h1 className="text-3xl font-serif text-sacred-blue mb-8 text-center">
            Mon Profil
          </h1>

          <div className="space-y-6">
            {/* Points totaux */}
            <Card className="p-6 bg-white/50 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Points totaux</p>
                  <p className="text-3xl font-bold text-primary">{userProgress.totalPoints}</p>
                </div>
              </div>
            </Card>

            {/* Lieux visités */}
            <Card className="p-6 bg-white/50 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lieux visités</p>
                  <p className="text-3xl font-bold text-sacred-blue">{userProgress.visitedPlaces.length}</p>
                </div>
              </div>
            </Card>

            {/* Religion sélectionnée */}
            {userProgress.selectedReligion && (
              <Card className="p-6 bg-white/50 border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Star className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tradition spirituelle</p>
                    <p className="text-xl font-semibold text-sacred-blue capitalize">
                      {userProgress.selectedReligion}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Langue */}
            <Card className="p-6 bg-white/50 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Langue</p>
                  <p className="text-xl font-semibold text-sacred-blue uppercase">
                    {userProgress.language}
                  </p>
                </div>
              </div>
            </Card>

            {/* Badges */}
            {userProgress.badges.length > 0 && (
              <Card className="p-6 bg-white/50 border-primary/20">
                <h2 className="text-lg font-semibold text-sacred-blue mb-4">Mes Badges</h2>
                <div className="flex flex-wrap gap-2">
                  {userProgress.badges.map((badge) => (
                    <Badge 
                      key={badge}
                      className="bg-primary/20 text-primary px-4 py-2 text-base"
                      style={{
                        boxShadow: '0 0 10px rgba(52, 224, 161, 0.3)'
                      }}
                    >
                      {badgeLabels[badge] || badge}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Voyage planifié */}
            {userProgress.tripPlaces.length > 0 && (
              <Card className="p-6 bg-white/50 border-primary/20">
                <h2 className="text-lg font-semibold text-sacred-blue mb-2">Voyage en cours</h2>
                <p className="text-muted-foreground">
                  {userProgress.tripPlaces.length} lieu{userProgress.tripPlaces.length > 1 ? 'x' : ''} planifié{userProgress.tripPlaces.length > 1 ? 's' : ''}
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
