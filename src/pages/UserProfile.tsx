import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { BackButton } from '@/components/BackButton';
import BottomNavigation from '@/components/BottomNavigation';
import { ImageBackground } from '@/components/ImageBackground';
import { getBackgroundRotationImages } from '@/lib/religionImageHelper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { MapPin, Award, BookHeart, Users, TrendingUp, Calendar, ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockPlaces } from '@/data/placesData';

interface UserStats {
  username: string;
  total_points: number;
  visited_places_count: number;
  badges_count: number;
  friends_count: number;
  created_at: string;
  current_streak: number;
  longest_streak: number;
}

interface Memory {
  id: string;
  place_id: string;
  place_name: string;
  title: string;
  content: string;
  media_urls: string[];
  created_at: string;
}

interface UserBadge {
  id: string;
  badge_type: string;
  quest_name: string;
  tier: string;
  unlocked_at: string;
  place_name?: string;
}

interface Visit {
  id: string;
  place_id: string;
  place_name: string;
  visit_timestamp: string;
  points_earned: number;
}

interface Friend {
  id: string;
  username: string;
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { session, userProgress } = useApp();
  const backgroundImages = getBackgroundRotationImages(userProgress.selectedReligion);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null);

  const isOwnProfile = session?.user?.id === userId;

  useEffect(() => {
    if (userId) {
      loadUserProfile();
      if (!isOwnProfile && session?.user) {
        checkFriendship();
      }
    }
  }, [userId, session]);

  const loadUserProfile = async () => {
    if (!userId) return;

    setLoading(true);

    // Load user profile and stats
    const [profileRes, progressRes, memoriesRes, badgesRes, visitsRes, friendsRes] = await Promise.all([
      supabase
        .from('public_profiles_store')
        .select('username, created_at')
        .eq('id', userId)
        .single(),
      
      supabase
        .from('user_progress')
        .select('total_points, visited_places, badges, current_streak, longest_streak')
        .eq('user_id', userId)
        .single(),
      
      supabase
        .from('memories')
        .select('id, place_id, title, content, media_urls, created_at')
        .eq('user_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20),
      
      supabase
        .from('user_badges')
        .select('id, badge_type, quest_name, tier, place_id, unlocked_at')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false }),
      
      supabase
        .from('visit_history')
        .select('id, place_id, visit_timestamp, points_earned')
        .eq('user_id', userId)
        .order('visit_timestamp', { ascending: false })
        .limit(20),
      
      supabase
        .from('friendships')
        .select('user_id, friend_id')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'accepted')
    ]);

    if (profileRes.data && progressRes.data) {
      const friendIds = (friendsRes.data || []).map(f => 
        f.user_id === userId ? f.friend_id : f.user_id
      );

      setStats({
        username: profileRes.data.username || 'Utilisateur',
        total_points: progressRes.data.total_points || 0,
        visited_places_count: progressRes.data.visited_places?.length || 0,
        badges_count: progressRes.data.badges?.length || 0,
        friends_count: friendIds.length,
        created_at: profileRes.data.created_at,
        current_streak: progressRes.data.current_streak || 0,
        longest_streak: progressRes.data.longest_streak || 0,
      });

      // Load friends usernames
      if (friendIds.length > 0) {
        const { data: friendsData } = await supabase
          .from('public_profiles_store')
          .select('id, username')
          .in('id', friendIds);
        
        setFriends((friendsData || []).map(f => ({
          id: f.id,
          username: f.username || 'Anonyme',
        })));
      }
    }

    // Process memories
    setMemories((memoriesRes.data || []).map(m => {
      const place = mockPlaces.find(p => p.id === m.place_id);
      return {
        ...m,
        place_name: place?.name || m.place_id,
      };
    }));

    // Process badges
    setBadges((badgesRes.data || []).map(b => {
      const place = b.place_id ? mockPlaces.find(p => p.id === b.place_id) : null;
      return {
        ...b,
        place_name: place?.name,
      };
    }));

    // Process visits
    setVisits((visitsRes.data || []).map(v => {
      const place = mockPlaces.find(p => p.id === v.place_id);
      return {
        ...v,
        place_name: place?.name || v.place_id,
      };
    }));

    setLoading(false);
  };

  const checkFriendship = async () => {
    if (!userId || !session?.user) return;

    const { data } = await supabase
      .from('friendships')
      .select('status')
      .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .single();

    if (data) {
      setFriendshipStatus(data.status);
      setIsFriend(data.status === 'accepted');
    }
  };

  const sendFriendRequest = async () => {
    if (!userId || !session?.user) return;

    const { error } = await supabase
      .from('friendships')
      .insert({
        user_id: session.user.id,
        friend_id: userId,
        status: 'pending',
      });

    if (error) {
      toast.error('Erreur lors de l\'envoi de la demande');
    } else {
      toast.success('Demande d\'ami envoyée');
      setFriendshipStatus('pending');
    }
  };

  const removeFriend = async () => {
    if (!userId || !session?.user) return;

    const { error } = await supabase
      .from('friendships')
      .delete()
      .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

    if (error) {
      toast.error('Erreur');
    } else {
      toast.success('Ami retiré');
      setIsFriend(false);
      setFriendshipStatus(null);
      if (stats) {
        setStats({ ...stats, friends_count: stats.friends_count - 1 });
      }
    }
  };

  if (loading) {
    return (
      <ImageBackground 
        images={backgroundImages}
        carousel={true}
        blur={3}
        overlay="gradient"
        className="min-h-screen pb-20"
      >
        <div className="min-h-screen pb-20 relative">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
        <BottomNavigation />
        </div>
      </ImageBackground>
    );
  }

  if (!stats) {
    return (
      <ImageBackground 
        images={backgroundImages}
        carousel={true}
        blur={3}
        overlay="gradient"
        className="min-h-screen pb-20"
      >
        <div className="min-h-screen pb-20 relative">
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Utilisateur non trouvé</p>
              <Button onClick={() => navigate(-1)} className="mt-4">
                Retour
              </Button>
            </CardContent>
          </Card>
        </div>
        <BottomNavigation />
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
      <div className="min-h-screen pb-20 relative">
      <div className="container mx-auto px-4 pt-16 pb-6 space-y-6">
        {/* Remove duplicate back button */}

        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-2xl">
                  {stats.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{stats.username}</CardTitle>
                <CardDescription>
                  Membre depuis {formatDistanceToNow(new Date(stats.created_at), { addSuffix: true, locale: fr })}
                </CardDescription>
                
                <div className="flex gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.total_points}</p>
                    <p className="text-sm text-muted-foreground">Points</p>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.visited_places_count}</p>
                    <p className="text-sm text-muted-foreground">Lieux</p>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.badges_count}</p>
                    <p className="text-sm text-muted-foreground">Badges</p>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.friends_count}</p>
                    <p className="text-sm text-muted-foreground">Amis</p>
                  </div>
                </div>
              </div>
              
              {!isOwnProfile && session?.user && (
                <div>
                  {!isFriend && friendshipStatus !== 'pending' && (
                    <Button onClick={sendFriendRequest}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  )}
                  {friendshipStatus === 'pending' && (
                    <Button disabled variant="secondary">
                      En attente
                    </Button>
                  )}
                  {isFriend && (
                    <Button onClick={removeFriend} variant="outline">
                      <UserMinus className="w-4 h-4 mr-2" />
                      Retirer
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activities">
              <BookHeart className="w-4 h-4 mr-2" />
              Activités
            </TabsTrigger>
            <TabsTrigger value="badges">
              <Award className="w-4 h-4 mr-2" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="stats">
              <TrendingUp className="w-4 h-4 mr-2" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="friends">
              <Users className="w-4 h-4 mr-2" />
              Amis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-4">
            {memories.length === 0 && visits.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookHeart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucune activité publique</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {/* Memories */}
                {memories.map((memory) => (
                  <Card key={memory.id}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <BookHeart className="w-5 h-5 text-primary mt-1" />
                        <div className="flex-1">
                          <CardTitle className="text-lg">{memory.title}</CardTitle>
                          <CardDescription>
                            {memory.place_name} • {formatDistanceToNow(new Date(memory.created_at), { addSuffix: true, locale: fr })}
                          </CardDescription>
                          {memory.content && (
                            <p className="text-sm mt-2">{memory.content}</p>
                          )}
                          {memory.media_urls && memory.media_urls.length > 0 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto">
                              {memory.media_urls.slice(0, 3).map((url, idx) => (
                                <img
                                  key={idx}
                                  src={url}
                                  alt="Memory"
                                  className="w-32 h-32 object-cover rounded"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}

                {/* Recent Visits */}
                {visits.slice(0, 5).map((visit) => (
                  <Card key={visit.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-secondary" />
                        <div className="flex-1">
                          <CardTitle className="text-base">Visite de {visit.place_name}</CardTitle>
                          <CardDescription>
                            {formatDistanceToNow(new Date(visit.visit_timestamp), { addSuffix: true, locale: fr })}
                            {' • '}{visit.points_earned} points
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            {badges.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucun badge débloqué</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {badges.map((badge) => (
                  <Card key={badge.id}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Award className="w-6 h-6 text-accent" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{badge.quest_name || badge.badge_type}</CardTitle>
                            <Badge variant="secondary">{badge.tier}</Badge>
                          </div>
                          {badge.place_name && (
                            <CardDescription>{badge.place_name}</CardDescription>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Débloqué {formatDistanceToNow(new Date(badge.unlocked_at), { addSuffix: true, locale: fr })}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Statistiques générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points totaux</span>
                    <span className="font-bold">{stats.total_points}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lieux visités</span>
                    <span className="font-bold">{stats.visited_places_count}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Badges débloqués</span>
                    <span className="font-bold">{stats.badges_count}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amis</span>
                    <span className="font-bold">{stats.friends_count}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Séries de visites
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Série actuelle</span>
                    <span className="font-bold">{stats.current_streak} jours</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meilleure série</span>
                    <span className="font-bold">{stats.longest_streak} jours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="friends" className="space-y-4">
            {friends.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucun ami</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {friends.map((friend) => (
                  <Card 
                    key={friend.id}
                    className="cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => navigate(`/user/${friend.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {friend.username[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-base">{friend.username}</CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
      </div>
    </ImageBackground>
  );
};

export default UserProfile;
