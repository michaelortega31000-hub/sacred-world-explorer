import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { MapPin, Award, BookHeart, Calendar, Heart, MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockPlaces } from '@/data/placesData';
import { toast } from 'sonner';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string()
    .trim()
    .min(1, 'Le commentaire ne peut pas être vide')
    .max(500, 'Le commentaire ne peut pas dépasser 500 caractères')
    .refine(val => !/<[^>]*>/g.test(val), {
      message: 'Les balises HTML ne sont pas autorisées'
    }),
});

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
  likes_count: number;
  is_liked: boolean;
  comments_count: number;
}

interface Comment {
  id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
}

const ActivityFeed = () => {
  const { session } = useApp();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});

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
        likes_count: 0,
        is_liked: false,
        comments_count: 0,
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
        likes_count: 0,
        is_liked: false,
        comments_count: 0,
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
        likes_count: 0,
        is_liked: false,
        comments_count: 0,
      });
    });

    // Sort by date
    allActivities.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const limitedActivities = allActivities.slice(0, 20);

    // Load likes and comments counts
    await loadInteractions(limitedActivities);

    setActivities(limitedActivities);
    setLoading(false);
  };

  const loadInteractions = async (activities: Activity[]) => {
    if (!session?.user || activities.length === 0) return;

    const activityMap: Record<string, { type: string; id: string }> = {};
    activities.forEach(a => {
      const [type, id] = a.id.split('-');
      activityMap[a.id] = { type, id };
    });

    // Load likes
    const { data: likesData } = await supabase
      .from('activity_likes')
      .select('activity_type, activity_id, user_id');

    // Load comments count
    const { data: commentsData } = await supabase
      .from('activity_comments')
      .select('activity_type, activity_id');

    // Update activities with interaction data
    activities.forEach(activity => {
      const { type, id } = activityMap[activity.id];
      
      const activityLikes = (likesData || []).filter(
        l => l.activity_type === type && l.activity_id === id
      );
      activity.likes_count = activityLikes.length;
      activity.is_liked = activityLikes.some(l => l.user_id === session.user.id);

      const activityComments = (commentsData || []).filter(
        c => c.activity_type === type && c.activity_id === id
      );
      activity.comments_count = activityComments.length;
    });
  };

  const toggleLike = async (activity: Activity) => {
    if (!session?.user) return;

    const [type, id] = activity.id.split('-');

    if (activity.is_liked) {
      // Unlike
      const { error } = await supabase
        .from('activity_likes')
        .delete()
        .eq('user_id', session.user.id)
        .eq('activity_type', type)
        .eq('activity_id', id);

      if (!error) {
        setActivities(prev => prev.map(a => 
          a.id === activity.id 
            ? { ...a, is_liked: false, likes_count: a.likes_count - 1 }
            : a
        ));
      }
    } else {
      // Like
      const { error } = await supabase
        .from('activity_likes')
        .insert({
          user_id: session.user.id,
          activity_type: type,
          activity_id: id,
        });

      if (!error) {
        setActivities(prev => prev.map(a => 
          a.id === activity.id 
            ? { ...a, is_liked: true, likes_count: a.likes_count + 1 }
            : a
        ));
      } else if (error.code === '23505') {
        toast.error('Vous avez déjà liké cette activité');
      }
    }
  };

  const loadComments = async (activity: Activity) => {
    const [type, id] = activity.id.split('-');

    const { data, error } = await supabase
      .from('activity_comments')
      .select('id, user_id, content, created_at')
      .eq('activity_type', type)
      .eq('activity_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      toast.error('Erreur lors du chargement des commentaires');
      return;
    }

    const userIds = Array.from(new Set((data || []).map(c => c.user_id)));
    let profilesMap: Record<string, string> = {};

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('public_profiles_store')
        .select('id, username')
        .in('id', userIds);
      profilesMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p.username || 'Anonyme']));
    }

    const enrichedComments = (data || []).map(c => ({
      ...c,
      username: profilesMap[c.user_id] || 'Anonyme',
    }));

    setComments(prev => ({ ...prev, [activity.id]: enrichedComments }));
  };

  const toggleComments = async (activity: Activity) => {
    if (expandedComments.has(activity.id)) {
      setExpandedComments(prev => {
        const next = new Set(prev);
        next.delete(activity.id);
        return next;
      });
    } else {
      await loadComments(activity);
      setExpandedComments(prev => new Set(prev).add(activity.id));
    }
  };

  const addComment = async (activity: Activity) => {
    if (!session?.user) return;

    const commentText = newComment[activity.id] || '';
    const validation = commentSchema.safeParse({ content: commentText });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    const [type, id] = activity.id.split('-');

    const { error } = await supabase
      .from('activity_comments')
      .insert({
        user_id: session.user.id,
        activity_type: type,
        activity_id: id,
        content: validation.data.content,
      });

    if (error) {
      toast.error('Erreur lors de l\'ajout du commentaire');
      return;
    }

    setNewComment(prev => ({ ...prev, [activity.id]: '' }));
    setActivities(prev => prev.map(a => 
      a.id === activity.id 
        ? { ...a, comments_count: a.comments_count + 1 }
        : a
    ));
    await loadComments(activity);
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

                  {/* Like and Comment buttons */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(activity)}
                      className="gap-1"
                    >
                      <Heart 
                        className={`w-4 h-4 ${activity.is_liked ? 'fill-destructive text-destructive' : ''}`}
                      />
                      <span className="text-sm">{activity.likes_count}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleComments(activity)}
                      className="gap-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{activity.comments_count}</span>
                    </Button>
                  </div>

                  {/* Comments section */}
                  {expandedComments.has(activity.id) && (
                    <div className="mt-4 space-y-3">
                      <Separator />
                      
                      {/* Comments list */}
                      {comments[activity.id]?.map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {comment.username[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-muted rounded-lg p-2">
                              <p className="font-semibold text-xs">{comment.username}</p>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(comment.created_at), { 
                                addSuffix: true, 
                                locale: fr 
                              })}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Add comment */}
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Ajouter un commentaire..."
                          value={newComment[activity.id] || ''}
                          onChange={(e) => setNewComment(prev => ({ 
                            ...prev, 
                            [activity.id]: e.target.value 
                          }))}
                          rows={2}
                          className="resize-none"
                        />
                        <Button
                          size="sm"
                          onClick={() => addComment(activity)}
                          disabled={!newComment[activity.id]?.trim()}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
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
