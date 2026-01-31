import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, LogIn, Crown, Medal, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface FriendStats {
  id: string;
  username: string | null;
  avatar_url: string | null;
  total_points: number | null;
}

const FriendsRankingTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useApp();
  const [loading, setLoading] = useState(true);
  const [friendsRanking, setFriendsRanking] = useState<FriendStats[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchFriendsRanking();
    } else {
      setLoading(false);
    }
  }, [session?.user?.id]);

  const fetchFriendsRanking = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);

      // 1. Get all accepted friendships where user is either user_id or friend_id
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('user_id, friend_id')
        .eq('status', 'accepted')
        .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`);

      if (friendshipsError) throw friendshipsError;

      // 2. Extract unique friend IDs
      const friendIds = new Set<string>();
      friendships?.forEach(f => {
        if (f.user_id === session.user.id) {
          friendIds.add(f.friend_id);
        } else {
          friendIds.add(f.user_id);
        }
      });

      // 3. Include current user in the list
      const allIds = [...friendIds, session.user.id];

      if (allIds.length === 0) {
        setFriendsRanking([]);
        return;
      }

      // 4. Fetch stats for all users
      const { data: stats, error: statsError } = await supabase
        .from('public_user_stats')
        .select('id, username, avatar_url, total_points')
        .in('id', allIds)
        .order('total_points', { ascending: false });

      if (statsError) throw statsError;

      setFriendsRanking(stats || []);
    } catch (error) {
      logger.error('Error fetching friends ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  // Not logged in
  if (!session?.user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-8 pb-8">
            <LogIn className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Connectez-vous</h3>
            <p className="text-muted-foreground mb-4">
              Connectez-vous pour voir le classement de vos amis
            </p>
            <Button onClick={() => navigate('/auth')}>
              <LogIn className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-muted-foreground">Chargement...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No friends (only current user in list)
  if (friendsRanking.length <= 1) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-8 pb-8">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Pas encore d'amis</h3>
            <p className="text-muted-foreground mb-4">
              Ajoutez des amis pour les défier et comparer vos scores !
            </p>
            <Button onClick={() => navigate('/profile?tab=social')}>
              <UserPlus className="w-4 h-4 mr-2" />
              Trouver des amis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const maxPoints = Math.max(...friendsRanking.map(f => f.total_points || 0), 1);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Classement Amis
          </CardTitle>
          <CardDescription>
            Comparez-vous à vos amis ({friendsRanking.length} participants)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {friendsRanking.map((friend, index) => {
              const rank = index + 1;
              const isCurrentUser = friend.id === session.user.id;
              const percentage = ((friend.total_points || 0) / maxPoints) * 100;

              return (
                <Card
                  key={friend.id}
                  className={`p-4 transition-all hover:scale-[1.01] cursor-pointer ${
                    isCurrentUser ? 'ring-2 ring-primary bg-primary/5' : ''
                  } ${rank === 1 ? 'border-yellow-500/50' : ''}`}
                  onClick={() => !isCurrentUser && navigate(`/user/${friend.id}`)}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                      {getRankIcon(rank)}
                    </div>

                    {/* Avatar */}
                    <Avatar className="w-10 h-10 border-2 border-primary/30">
                      <AvatarImage src={friend.avatar_url || undefined} />
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {friend.username || 'Utilisateur'}
                        </span>
                        {isCurrentUser && (
                          <Badge variant="secondary" className="text-xs">
                            Vous
                          </Badge>
                        )}
                      </div>
                      <Progress value={percentage} className="h-2 mt-2" />
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {(friend.total_points || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Visitez plus de lieux sacrés pour grimper dans le classement !
              <Button 
                variant="link" 
                className="p-0 h-auto ml-1"
                onClick={() => navigate('/profile?tab=social')}
              >
                Ajouter des amis
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsRankingTab;
