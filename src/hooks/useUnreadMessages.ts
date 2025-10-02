import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadUnreadCount();
      
      // Subscribe to new messages
      const channel = supabase
        .channel('unread-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${currentUserId}`,
          },
          () => {
            loadUnreadCount();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUserId]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const loadUnreadCount = async () => {
    if (!currentUserId) return;

    // Get last read timestamp from localStorage
    const lastReadKey = `lastReadMessages_${currentUserId}`;
    const lastRead = localStorage.getItem(lastReadKey);
    
    const query = (supabase as any)
      .from('messages' as any)
      .select('id', { count: 'exact', head: true })
      .eq('receiver_id', currentUserId);

    if (lastRead) {
      query.gt('created_at', lastRead);
    }

    const { count } = await query;
    setUnreadCount(count || 0);
  };

  const markAsRead = () => {
    if (!currentUserId) return;
    const lastReadKey = `lastReadMessages_${currentUserId}`;
    localStorage.setItem(lastReadKey, new Date().toISOString());
    setUnreadCount(0);
  };

  return { unreadCount, markAsRead };
};
