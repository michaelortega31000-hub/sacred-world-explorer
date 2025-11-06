import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Star, Sparkles, Trophy, User, Medal } from 'lucide-react';
import { logger } from '@/lib/logger';

interface CollectorStats {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_unlocked: number;
  legendary_count: number;
  epic_count: number;
  rare_count: number;
  common_count: number;
  last_unlock_at: string | null;
}

interface LeaderboardSectionProps {
  currentUserId?: string;
}

export const LeaderboardSection = ({ currentUserId }: LeaderboardSectionProps) => {
  const [stats, setStats] = useState<CollectorStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'total' | 'legendary' | 'epic' | 'rare'>('total');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('avatar_collector_stats')
        .select('*')
        .order('total_unlocked', { ascending: false })
        .limit(50);

      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      logger.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSortedStats = () => {
    const sorted = [...stats];
    switch (sortBy) {
      case 'legendary':
        return sorted.sort((a, b) => b.legendary_count - a.legendary_count);
      case 'epic':
        return sorted.sort((a, b) => b.epic_count - a.epic_count);
      case 'rare':
        return sorted.sort((a, b) => b.rare_count - a.rare_count);
      default:
        return sorted.sort((a, b) => b.total_unlocked - a.total_unlocked);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const rarityConfig = {
    legendary: { icon: Crown, color: 'text-yellow-500', label: 'Légendaires' },
    epic: { icon: Star, color: 'text-purple-500', label: 'Épiques' },
    rare: { icon: Sparkles, color: 'text-blue-500', label: 'Rares' }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card/80 backdrop-blur-sm">
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </Card>
    );
  }

  if (stats.length === 0) {
    return (
      <Card className="p-6 bg-card/80 backdrop-blur-sm text-center">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">Aucun collectionneur pour le moment</p>
      </Card>
    );
  }

  const sortedStats = getSortedStats();

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Classement des Collectionneurs</h2>
          <p className="text-sm text-muted-foreground">
            Top {stats.length} des meilleurs collectionneurs d'avatars
          </p>
        </div>
      </div>

      {/* Sort Filters */}
      <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="total">
            <Trophy className="w-4 h-4 mr-1" />
            Total
          </TabsTrigger>
          <TabsTrigger value="legendary">
            <Crown className="w-4 h-4 mr-1" />
            Légendaires
          </TabsTrigger>
          <TabsTrigger value="epic">
            <Star className="w-4 h-4 mr-1" />
            Épiques
          </TabsTrigger>
          <TabsTrigger value="rare">
            <Sparkles className="w-4 h-4 mr-1" />
            Rares
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {sortedStats.map((collector, index) => {
          const rank = index + 1;
          const isCurrentUser = collector.user_id === currentUserId;
          const displayValue = sortBy === 'legendary' ? collector.legendary_count 
            : sortBy === 'epic' ? collector.epic_count
            : sortBy === 'rare' ? collector.rare_count
            : collector.total_unlocked;

          return (
            <Card
              key={collector.user_id}
              className={`p-4 transition-all hover:scale-[1.02] ${
                isCurrentUser ? 'ring-2 ring-primary bg-primary/5' : ''
              } ${rank <= 3 ? 'border-2' : ''} ${
                rank === 1 ? 'border-yellow-500/50 bg-yellow-500/5' :
                rank === 2 ? 'border-gray-400/50 bg-gray-400/5' :
                rank === 3 ? 'border-amber-600/50 bg-amber-600/5' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                  {getRankIcon(rank)}
                </div>

                {/* Avatar */}
                <Avatar className="w-12 h-12 border-2 border-primary">
                  <AvatarImage src={collector.avatar_url || undefined} />
                  <AvatarFallback>
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">
                      {collector.username}
                    </h3>
                    {isCurrentUser && (
                      <Badge variant="secondary" className="text-xs">
                        Vous
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mt-1">
                    {sortBy === 'total' ? (
                      <>
                        <div className="flex items-center gap-1">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{collector.legendary_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">{collector.epic_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{collector.rare_count}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        {sortBy === 'legendary' && <Crown className="w-4 h-4 text-yellow-500" />}
                        {sortBy === 'epic' && <Star className="w-4 h-4 text-purple-500" />}
                        {sortBy === 'rare' && <Sparkles className="w-4 h-4 text-blue-500" />}
                        <span className="text-sm text-muted-foreground">
                          {rarityConfig[sortBy as keyof typeof rarityConfig]?.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {displayValue}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {sortBy === 'total' ? 'avatars' : rarityConfig[sortBy as keyof typeof rarityConfig]?.label.toLowerCase()}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* User's Position if not in top */}
      {currentUserId && !sortedStats.slice(0, 10).find(s => s.user_id === currentUserId) && (
        <>
          <div className="my-4 text-center text-muted-foreground">
            <span className="inline-block px-4 py-1 bg-muted rounded-full text-sm">
              ...
            </span>
          </div>
          {(() => {
            const userIndex = sortedStats.findIndex(s => s.user_id === currentUserId);
            if (userIndex !== -1) {
              const collector = sortedStats[userIndex];
              const rank = userIndex + 1;
              const displayValue = sortBy === 'legendary' ? collector.legendary_count 
                : sortBy === 'epic' ? collector.epic_count
                : sortBy === 'rare' ? collector.rare_count
                : collector.total_unlocked;

              return (
                <Card className="p-4 ring-2 ring-primary bg-primary/5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                      <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
                    </div>

                    <Avatar className="w-12 h-12 border-2 border-primary">
                      <AvatarImage src={collector.avatar_url || undefined} />
                      <AvatarFallback>
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{collector.username}</h3>
                        <Badge variant="secondary" className="text-xs">Vous</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Votre position</p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{displayValue}</div>
                      <div className="text-xs text-muted-foreground">
                        {sortBy === 'total' ? 'avatars' : rarityConfig[sortBy as keyof typeof rarityConfig]?.label.toLowerCase()}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            }
            return null;
          })()}
        </>
      )}
    </Card>
  );
};
