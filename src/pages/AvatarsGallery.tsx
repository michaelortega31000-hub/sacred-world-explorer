import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Lock, Check, Crown, Star, Sparkles, User, Trophy, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { ImageBackground } from '@/components/ImageBackground';
import { getBackgroundRotationImages } from '@/lib/religionImageHelper';
import { useApp } from '@/contexts/AppContext';
import BottomNavigation from '@/components/BottomNavigation';
import { LeaderboardSection } from '@/components/avatars/LeaderboardSection';
import { LeaderboardRewardsInfo } from '@/components/avatars/LeaderboardRewardsInfo';
import { useLeaderboardRewards } from '@/hooks/useLeaderboardRewards';

interface DefaultAvatar {
  id: string;
  name: string;
  avatar_url: string;
  category: string;
  display_order: number;
  is_exclusive: boolean;
  level_required: number | null;
  required_badge_types: string[] | null;
  rarity: string;
  unlock_description: string | null;
}

const AvatarsGallery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProgress } = useApp();
  const [avatars, setAvatars] = useState<DefaultAvatar[]>([]);
  const [unlockedAvatarIds, setUnlockedAvatarIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  // Listen for leaderboard rewards
  useLeaderboardRewards(userId);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      } else {
        setUserId(session.user.id);
        fetchAvatars();
        fetchUnlockedAvatars(session.user.id);
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchAvatars = async () => {
    try {
      const { data, error } = await supabase
        .from('default_avatars')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setAvatars(data || []);
    } catch (error) {
      logger.error('Error fetching avatars:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les avatars',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUnlockedAvatars = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('user_unlocked_default_avatars')
        .select('avatar_id')
        .eq('user_id', uid);

      if (error) throw error;
      setUnlockedAvatarIds(new Set(data?.map(u => u.avatar_id) || []));
    } catch (error) {
      logger.error('Error fetching unlocked avatars:', error);
    }
  };

  const rarityConfig = {
    legendary: { icon: Crown, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500' },
    epic: { icon: Star, color: 'text-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500' },
    rare: { icon: Sparkles, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500' },
    common: { icon: User, color: 'text-muted-foreground', bgColor: 'bg-muted', borderColor: 'border-border' }
  };

  const categoryLabels: Record<string, string> = {
    spiritual: 'Spirituels',
    nature: 'Nature',
    modern: 'Modernes',
    museum: 'Musées',
    general: 'Général',
    legendary: 'Légendaires',
    epic: 'Épiques',
    rare: 'Rares',
    achievement: 'Accomplissements'
  };

  // Stats by rarity
  const statsByRarity = useMemo(() => {
    const stats: Record<string, { total: number; unlocked: number }> = {};
    
    avatars.forEach(avatar => {
      if (!stats[avatar.rarity]) {
        stats[avatar.rarity] = { total: 0, unlocked: 0 };
      }
      stats[avatar.rarity].total++;
      if (!avatar.is_exclusive || unlockedAvatarIds.has(avatar.id)) {
        stats[avatar.rarity].unlocked++;
      }
    });

    return stats;
  }, [avatars, unlockedAvatarIds]);

  // Total progression
  const totalProgress = useMemo(() => {
    const total = avatars.length;
    const unlocked = avatars.filter(a => !a.is_exclusive || unlockedAvatarIds.has(a.id)).length;
    return { total, unlocked, percentage: total > 0 ? (unlocked / total) * 100 : 0 };
  }, [avatars, unlockedAvatarIds]);

  // Filtered avatars
  const filteredAvatars = useMemo(() => {
    if (selectedRarity === 'all') return avatars;
    return avatars.filter(a => a.rarity === selectedRarity);
  }, [avatars, selectedRarity]);

  // Group by category
  const groupedAvatars = useMemo(() => {
    const groups: Record<string, DefaultAvatar[]> = {};
    filteredAvatars.forEach(avatar => {
      if (!groups[avatar.category]) {
        groups[avatar.category] = [];
      }
      groups[avatar.category].push(avatar);
    });
    return groups;
  }, [filteredAvatars]);

  const currentLevel = useMemo(() => Math.floor(userProgress.totalPoints / 100) + 1, [userProgress.totalPoints]);

  return (
    <ImageBackground 
      images={getBackgroundRotationImages(userProgress.selectedReligion)}
      carousel={true}
      blur={3}
      overlay="gradient"
      className="min-h-screen pb-20"
    >
      <div className="min-h-screen relative">
        <BackButton to="/profile" />

        <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 pb-24">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Galerie d'Avatars
            </h1>
            <p className="text-muted-foreground">
              Débloquez des avatars exclusifs en progressant dans votre aventure
            </p>
          </div>

          {/* Leaderboard Rewards Info */}
          <div className="mb-8">
            <LeaderboardRewardsInfo />
          </div>

          {/* Global Stats */}
          <Card className="p-6 mb-8 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Collection Globale</h2>
                <p className="text-muted-foreground">
                  {totalProgress.unlocked} / {totalProgress.total} avatars débloqués
                </p>
              </div>
              <Trophy className="w-12 h-12 text-primary" />
            </div>
            <Progress value={totalProgress.percentage} className="h-3 mb-6" />

            {/* Stats by Rarity */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(statsByRarity).map(([rarity, stats]) => {
                const config = rarityConfig[rarity as keyof typeof rarityConfig];
                const Icon = config.icon;
                const percentage = stats.total > 0 ? (stats.unlocked / stats.total) * 100 : 0;

                return (
                  <Card key={rarity} className={`p-4 ${config.bgColor} border ${config.borderColor}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                      <span className="font-semibold capitalize">{rarity}</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {stats.unlocked}/{stats.total}
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </Card>
                );
              })}
            </div>
          </Card>

          {/* Rarity Filter */}
          <Card className="p-4 mb-6 bg-card/80 backdrop-blur-sm">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedRarity === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedRarity('all')}
                size="sm"
              >
                Tous
              </Button>
              {Object.keys(statsByRarity).map(rarity => (
                <Button
                  key={rarity}
                  variant={selectedRarity === rarity ? 'default' : 'outline'}
                  onClick={() => setSelectedRarity(rarity)}
                  size="sm"
                  className="capitalize"
                >
                  {rarity}
                </Button>
              ))}
            </div>
          </Card>

          {/* Avatars by Category */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedAvatars).map(([category, categoryAvatars]) => (
                <Card key={category} className="p-6 bg-card/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-4">{categoryLabels[category] || category}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categoryAvatars.map(avatar => {
                      const isLocked = avatar.is_exclusive && !unlockedAvatarIds.has(avatar.id);
                      const config = rarityConfig[avatar.rarity as keyof typeof rarityConfig];
                      const RarityIcon = config.icon;

                      return (
                        <Card
                          key={avatar.id}
                          className={`relative p-3 transition-all hover:scale-105 ${
                            isLocked ? 'opacity-60' : ''
                          } ${config.bgColor} border ${config.borderColor}`}
                        >
                          {/* Rarity Badge */}
                          <div className="absolute -top-2 -right-2 z-10">
                            <Badge className={`${config.bgColor} ${config.color} border ${config.borderColor}`}>
                              <RarityIcon className="w-3 h-3" />
                            </Badge>
                          </div>

                          {/* Avatar Image */}
                          <div className="aspect-square rounded-lg overflow-hidden bg-background/50 flex items-center justify-center relative mb-2">
                            <img
                              src={avatar.avatar_url}
                              alt={avatar.name}
                              className={`w-full h-full object-cover ${isLocked ? 'blur-sm grayscale' : ''}`}
                            />
                            
                            {isLocked ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                                <Lock className="w-8 h-8 text-muted-foreground" />
                              </div>
                            ) : (
                              <div className="absolute top-1 left-1">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Avatar Name */}
                          <p className="text-xs font-medium text-center truncate mb-1">
                            {avatar.name}
                          </p>

                          {/* Unlock Condition */}
                          {avatar.is_exclusive && (
                            <div className="text-xs text-center text-muted-foreground">
                              {isLocked ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Lock className="w-3 h-3" />
                                  {avatar.level_required && (
                                    <span>Niv. {avatar.level_required}</span>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-1 text-green-500">
                                  <Check className="w-3 h-3" />
                                  Débloqué
                                </div>
                              )}
                            </div>
                          )}

                          {/* Unlock Description on Hover */}
                          {isLocked && avatar.unlock_description && (
                            <div className="absolute inset-0 bg-background/95 rounded-lg p-2 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-xs text-center">{avatar.unlock_description}</p>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Current Level Info */}
          <Card className="mt-8 p-6 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Votre Niveau Actuel</h3>
                <p className="text-3xl font-bold text-primary">Niveau {currentLevel}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {userProgress.totalPoints} points au total
                </p>
              </div>
              <TrendingUp className="w-16 h-16 text-primary opacity-20" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Prochain niveau : {((currentLevel + 1) * 100)} points
              </p>
              <Progress 
                value={(userProgress.totalPoints % 100)} 
                className="h-2" 
              />
            </div>
          </Card>

          {/* Leaderboard */}
          <div className="mt-8">
            <LeaderboardSection currentUserId={userId || undefined} />
          </div>
        </main>

        <BottomNavigation />
      </div>
    </ImageBackground>
  );
};

export default AvatarsGallery;
