import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Friend {
  id: string;
  username: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender?: {
    username: string;
  };
}

const MessagesTab = () => {
  const { t } = useTranslation();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCurrentUser();
    loadFriends();
  }, []);

  useEffect(() => {
    if (selectedFriend && currentUserId) {
      loadMessages(selectedFriend.id);
    }
  }, [selectedFriend, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const loadFriends = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get accepted friendships
    const { data: friendships1 } = await supabase
      .from('friendships')
      .select('friend:public_profiles!friendships_friend_id_fkey(id, username)')
      .eq('user_id', user.id)
      .eq('status', 'accepted');

    const { data: friendships2 } = await supabase
      .from('friendships')
      .select('friend:public_profiles!friendships_user_id_fkey(id, username)')
      .eq('friend_id', user.id)
      .eq('status', 'accepted');

    const allFriends: Friend[] = [
      ...(friendships1?.map(f => f.friend).filter(Boolean) || []),
      ...(friendships2?.map(f => f.friend).filter(Boolean) || []),
    ].filter((f): f is Friend => f !== null);

    setFriends(allFriends);
  };

  const loadMessages = async (friendId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await (supabase as any)
      .from('messages' as any)
      .select('id, sender_id, receiver_id, content, created_at')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (error) {
      toast.error('Erreur lors du chargement des messages');
    } else {
      setMessages(data || []);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend || !currentUserId) return;

    const { error } = await (supabase as any)
      .from('messages' as any)
      .insert({
        sender_id: currentUserId,
        receiver_id: selectedFriend.id,
        content: newMessage,
      });

    if (error) {
      toast.error('Erreur lors de l\'envoi du message');
    } else {
      setNewMessage('');
      loadMessages(selectedFriend.id);
    }
  };

  if (!selectedFriend) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {friends.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Vous n'avez pas encore d'amis. Ajoutez des amis pour commencer à échanger !
              </p>
            ) : (
              <div className="space-y-2">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => setSelectedFriend(friend)}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Avatar>
                      <AvatarFallback>{friend.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{friend.username}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl flex flex-col h-[calc(100vh-200px)]">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFriend(null)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Avatar>
              <AvatarFallback>{selectedFriend.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle>{selectedFriend.username}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun message. Commencez la conversation !
            </p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender_id === currentUserId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: fr })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Écrire un message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
            <Button onClick={sendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MessagesTab;
