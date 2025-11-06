import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, MapPin, Star, User, Calendar, Flame } from 'lucide-react';
import { logger } from '@/lib/logger';
import { ImageBackground } from '@/components/ImageBackground';
import { getBackgroundRotationImages } from '@/lib/religionImageHelper';
import { StatsCard } from '@/components/profile/StatsCard';
import { Skeleton } from '@/components/ui/skeleton';

interface PublicProfileData {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  selected_religion: string | null;
  visited_places_count: number;
  badges_count: number;
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const backgroundImages = getBackgroundRotationImages(
    (profileData?.selected_religion as any) || 'christianisme'
  );

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!username) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Fetch from public view
        const { data, error } = await supabase
          .from('public_user_stats')
          .select('*')
          .eq('username', username)
          .maybeSingle();

        if (error) {
          logger.error('Error fetching public profile:', error);
          setNotFound(true);
          return;
        }

        if (!data) {
          setNotFound(true);
          return;
        }

        setProfileData(data as PublicProfileData);
      } catch (error) {
        logger.error('Error in fetchPublicProfile:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username]);

  const currentLevel = profileData ? Math.floor(profileData.total_points / 100) + 1 : 1;
  const joinDate = profileData ? new Date(profileData.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long'
  }) : '';

  if (loading) {
    return (
      <ImageBackground 
        images={backgroundImages}
        carousel={true}
        blur={3}
        overlay="gradient"
        className="min-h-screen pb-20"
      >
        <div className="min-h-screen relative">
          <BackButton to="/" />
          
          <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-24">
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
              </div>
            </div>
          </main>
        </div>
      </ImageBackground>
    );
  }

  if (notFound || !profileData) {
    return (
      <ImageBackground 
        images={backgroundImages}
        carousel={true}
        blur={3}
        overlay="gradient"
        className="min-h-screen pb-20"
      >
        <div className="min-h-screen relative">
          <BackButton to="/" />
          
          <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-24">
            <Card className="p-8 text-center bg-card/80 backdrop-blur-sm border-primary/20">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Profil introuvable</h2>
              <p className="text-muted-foreground mb-6">
                Ce profil n'existe pas ou n'est pas public.
              </p>
            </Card>
          </main>
        </div>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      images={backgroundImages}
      carousel={true}
      blur={3}
      overlay="gradient"
      className="min-h-screen pb-20"
    >
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        </div>

        <BackButton to="/" />

        <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-24">
          {/* Profile Header */}
          <div className="relative mb-8">
            <div 
              className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl p-8 mb-6"
              style={{
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 8s ease infinite'
              }}
            >
              <div className="flex flex-col items-center">
                <div className="relative group mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
                  <div 
                    className="absolute inset-0 rounded-full blur-xl opacity-50"
                    style={{ animation: 'glow-pulse 2s ease-in-out infinite' }}
                  />
                  <Avatar className="relative w-32 h-32 border-4 border-primary shadow-2xl">
                    <AvatarImage src={profileData.avatar_url || undefined} alt={profileData.username} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="w-16 h-16" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  @{profileData.username}
                </h1>
                
                {profileData.selected_religion && (
                  <p className="text-muted-foreground capitalize mb-2">
                    {profileData.selected_religion}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Membre depuis {joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard
                title="Points totaux"
                value={profileData.total_points}
                maxValue={Math.max(profileData.total_points + 100, 1000)}
                icon={Trophy}
                description={`Niveau ${currentLevel}`}
              />
              <StatsCard
                title="Lieux visités"
                value={profileData.visited_places_count}
                maxValue={Math.max(profileData.visited_places_count + 10, 50)}
                icon={MapPin}
              />
              <StatsCard
                title="Badges"
                value={profileData.badges_count}
                maxValue={Math.max(profileData.badges_count + 5, 20)}
                icon={Star}
              />
            </div>

            {/* Streak Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Flame className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Série actuelle</p>
                    <p className="text-2xl font-bold">{profileData.current_streak} jours</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-accent/10">
                    <Flame className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Record de série</p>
                    <p className="text-2xl font-bold">{profileData.longest_streak} jours</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Public Badge */}
            <Card className="p-4 bg-accent/10 backdrop-blur-sm border-accent/20 text-center">
              <p className="text-sm text-muted-foreground">
                🌟 Profil public de {profileData.username}
              </p>
            </Card>
          </div>
        </main>
      </div>
    </ImageBackground>
  );
}
