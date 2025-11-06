import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUnreadForumPosts = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadUnreadCount();
      
      // Subscribe to new forum posts
      const channel = supabase
        .channel('unread-forum-posts')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'community_posts',
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
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    setCurrentUserId(user?.id || null);
  };

  const loadUnreadCount = async () => {
    if (!currentUserId) return;

    // Get last read timestamp from localStorage
    const lastReadKey = `lastReadForum_${currentUserId}`;
    const lastRead = localStorage.getItem(lastReadKey);
    
    const query = (supabase as any)
      .from('community_posts' as any)
      .select('id', { count: 'exact', head: true });

    if (lastRead) {
      query.gt('created_at', lastRead);
    }

    const { count } = await query;
    setUnreadCount(count || 0);
  };

  const markAsRead = () => {
    if (!currentUserId) return;
    const lastReadKey = `lastReadForum_${currentUserId}`;
    localStorage.setItem(lastReadKey, new Date().toISOString());
    setUnreadCount(0);
  };

  return { unreadCount, markAsRead };
};
