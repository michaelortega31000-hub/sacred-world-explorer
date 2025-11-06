import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Award, BookHeart, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockPlaces } from '@/data/placesData';

interface Activity {
  id: string;
  type: 'memory' | 'badge' | 'visit';
  user_id: string;
  username: string;
  created_at: string;
  data: {
    place_id?: string;
    place_name?: string;
    title?: string;
    content?: string;
    badge_type?: string;
    quest_name?: string;
    tier?: string;
    media_urls?: string[];
  };
}

const ActivityFeed = () => {
  const { session } = useApp();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadActivities();
    }
  }, [session]);

  const loadActivities = async () => {
    if (!session?.user) return;

    setLoading(true);

    // Get friends IDs
    const { data: friendships } = await supabase
      .from('friendships')
      .select('user_id, friend_id')
      .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
      .eq('status', 'accepted');

    if (!friendships || friendships.length === 0) {
      setLoading(false);
      return;
    }

    const friendIds = friendships.map(f => 
      f.user_id === session.user.id ? f.friend_id : f.user_id
    );

    // Fetch all activities in parallel
    const [memoriesRes, badgesRes, visitsRes, profilesRes] = await Promise.all([
      // Public memories from friends
      supabase
        .from('memories')
        .select('id, user_id, created_at, place_id, title, content, media_urls')
        .in('user_id', friendIds)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(10),
      
      // Badges from friends
      supabase
        .from('user_badges')
        .select('id, user_id, unlocked_at, badge_type, quest_name, tier, place_id')
        .in('user_id', friendIds)
        .order('unlocked_at', { ascending: false })
        .limit(10),
      
      // Recent visits from friends
      supabase
        .from('visit_history')
        .select('id, user_id, visit_timestamp, place_id')
        .in('user_id', friendIds)
        .order('visit_timestamp', { ascending: false })
        .limit(10),
      
      // Get usernames
      supabase
        .from('public_profiles_store')
        .select('id, username')
        .in('id', friendIds)
    ]);

    const profilesMap: Record<string, string> = Object.fromEntries(
      (profilesRes.data || []).map(p => [p.id, p.username || 'Anonyme'])
    );

    // Combine and format activities
    const allActivities: Activity[] = [];

    // Add memories
    (memoriesRes.data || []).forEach(m => {
      const place = mockPlaces.find(p => p.id === m.place_id);
      allActivities.push({
        id: `memory-${m.id}`,
        type: 'memory',
        user_id: m.user_id,
        username: profilesMap[m.user_id] || 'Anonyme',
        created_at: m.created_at,
        data: {
          place_id: m.place_id,
          place_name: place?.name || m.place_id,
          title: m.title,
          content: m.content,
          media_urls: m.media_urls,
        },
      });
    });

    // Add badges
    (badgesRes.data || []).forEach(b => {
      const place = b.place_id ? mockPlaces.find(p => p.id === b.place_id) : null;
      allActivities.push({
        id: `badge-${b.id}`,
        type: 'badge',
        user_id: b.user_id,
        username: profilesMap[b.user_id] || 'Anonyme',
        created_at: b.unlocked_at || new Date().toISOString(),
        data: {
          badge_type: b.badge_type,
          quest_name: b.quest_name,
          tier: b.tier,
          place_name: place?.name,
        },
      });
    });

    // Add visits
    (visitsRes.data || []).forEach(v => {
      const place = mockPlaces.find(p => p.id === v.place_id);
      allActivities.push({
        id: `visit-${v.id}`,
        type: 'visit',
        user_id: v.user_id,
        username: profilesMap[v.user_id] || 'Anonyme',
        created_at: v.visit_timestamp,
        data: {
          place_id: v.place_id,
          place_name: place?.name || v.place_id,
        },
      });
    });

    // Sort by date
    allActivities.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setActivities(allActivities.slice(0, 20));
    setLoading(false);
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'memory':
        return <BookHeart className="w-5 h-5 text-primary" />;
      case 'badge':
        return <Award className="w-5 h-5 text-accent" />;
      case 'visit':
        return <MapPin className="w-5 h-5 text-secondary" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'memory':
        return `a partagé un souvenir à ${activity.data.place_name}`;
      case 'badge':
        return `a débloqué le badge "${activity.data.quest_name || activity.data.badge_type}"`;
      case 'visit':
        return `a visité ${activity.data.place_name}`;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Aucune activité récente de vos amis
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Ajoutez des amis pour voir leurs activités ici
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-4">
      <h2 className="text-2xl font-bold">Fil d'actualité</h2>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <Card key={activity.id} className="hover:bg-accent/5 transition-colors">
            <CardHeader>
              <div className="flex gap-3">
                <Avatar>
                  <AvatarFallback>
                    {activity.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getActivityIcon(activity.type)}
                    <span className="font-semibold">{activity.username}</span>
                    <span className="text-sm text-muted-foreground">
                      {getActivityText(activity)}
                    </span>
                  </div>
                  <CardDescription className="mt-1">
                    {formatDistanceToNow(new Date(activity.created_at), { 
                      addSuffix: true, 
                      locale: fr 
                    })}
                  </CardDescription>

                  {activity.type === 'memory' && activity.data.title && (
                    <div className="mt-3 space-y-2">
                      <p className="font-medium text-sm">{activity.data.title}</p>
                      {activity.data.content && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {activity.data.content}
                        </p>
                      )}
                      {activity.data.media_urls && activity.data.media_urls.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {activity.data.media_urls.slice(0, 3).map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt="Memory"
                              className="w-24 h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activity.type === 'badge' && activity.data.tier && (
                    <Badge variant="secondary" className="mt-2">
                      {activity.data.tier}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
