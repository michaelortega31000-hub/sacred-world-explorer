import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, UserPlus, UserCheck, UserX, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  username: string;
}

interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  friend?: Profile;
}

const FriendsTab = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser();
    loadFriends();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const loadFriends = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: acceptedFriends } = await supabase
      .from('friendships')
      .select('id, user_id, friend_id, status')
      .eq('user_id', user.id)
      .eq('status', 'accepted');

    const { data: reverseFriends } = await supabase
      .from('friendships')
      .select('id, user_id, friend_id, status')
      .eq('friend_id', user.id)
      .eq('status', 'accepted');

    const all = [
      ...(acceptedFriends || []),
      ...(reverseFriends || []),
    ].map((f: any) => ({ ...f, status: f.status as 'pending' | 'accepted' | 'rejected' }));

    const friendIds = Array.from(new Set(all.map((f: any) => (f.user_id === user.id ? f.friend_id : f.user_id))));

    let profilesMap: Record<string, Profile> = {};
    if (friendIds.length > 0) {
      const { data: profiles } = await supabase
        .from('public_profiles_store')
        .select('id, username')
        .in('id', friendIds as string[]);
      profilesMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, { id: p.id, username: p.username || '' }]));
    }

    const enriched = all.map((f: any) => {
      const fid = f.user_id === user.id ? f.friend_id : f.user_id;
      return { ...f, friend: profilesMap[fid] };
    });
    setFriends(enriched);

    const { data: pending } = await supabase
      .from('friendships')
      .select('id, user_id, friend_id, status')
      .eq('friend_id', user.id)
      .eq('status', 'pending');

    const pendingFriendIds = Array.from(new Set((pending || []).map((p: any) => p.user_id)));
    let pendingProfilesMap: Record<string, Profile> = {};
    if (pendingFriendIds.length > 0) {
      const { data: profiles } = await supabase
        .from('public_profiles_store')
        .select('id, username')
        .in('id', pendingFriendIds as string[]);
      pendingProfilesMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, { id: p.id, username: p.username || '' }]));
    }

    setPendingRequests((pending || []).map((p: any) => ({
      ...p,
      status: p.status as 'pending' | 'accepted' | 'rejected',
      friend: pendingProfilesMap[p.user_id],
    })));
  };

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('public_profiles_store')
      .select('id, username')
      .ilike('username', `%${searchTerm}%`)
      .neq('id', currentUserId || '')
      .limit(10);

    if (error) {
      toast.error('Erreur lors de la recherche');
    } else {
      setSearchResults(data || []);
    }
    setLoading(false);
  };

  const sendFriendRequest = async (friendId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if friendship already exists
    const { data: existing } = await supabase
      .from('friendships')
      .select('id')
      .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`)
      .single();

    if (existing) {
      toast.error('Demande déjà envoyée ou ami déjà ajouté');
      return;
    }

    const { error } = await supabase
      .from('friendships')
      .insert({ user_id: user.id, friend_id: friendId, status: 'pending' });

    if (error) {
      toast.error('Erreur lors de l\'envoi de la demande');
    } else {
      toast.success('Demande d\'ami envoyée');
      setSearchResults([]);
      setSearchTerm('');
    }
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId);

    if (error) {
      toast.error('Erreur lors de l\'acceptation');
    } else {
      toast.success('Ami ajouté');
      loadFriends();
    }
  };

  const removeFriend = async (friendshipId: string) => {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId);

    if (error) {
      toast.error('Erreur lors de la suppression');
    } else {
      toast.success('Ami supprimé');
      loadFriends();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Rechercher des utilisateurs
          </CardTitle>
          <CardDescription>
            Trouvez et ajoutez des amis à votre liste
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nom d'utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
            />
            <Button onClick={searchUsers} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <Button size="sm" onClick={() => sendFriendRequest(user.id)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Demandes reçues ({pendingRequests.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{request.friend?.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{request.friend?.username}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => acceptFriendRequest(request.id)}>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Accepter
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => removeFriend(request.id)}>
                    <UserX className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Friends List */}
      <Card>
        <CardHeader>
          <CardTitle>Mes amis ({friends.length}/100)</CardTitle>
          <CardDescription>
            Vous pouvez avoir jusqu'à 100 amis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Vous n'avez pas encore d'amis. Recherchez des utilisateurs pour commencer !
            </p>
          ) : (
            <div className="space-y-2">
              {friends.map((friendship) => (
                <div key={friendship.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{friendship.friend?.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{friendship.friend?.username}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFriend(friendship.id)}
                  >
                    <UserX className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsTab;
