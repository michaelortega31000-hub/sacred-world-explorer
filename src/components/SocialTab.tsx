import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, BookHeart, Rss } from 'lucide-react';
import FriendsTab from './FriendsTab';
import ForumTab from './ForumTab';
import MessagesTab from './MessagesTab';
import MemoriesTab from './MemoriesTab';
import ActivityFeed from './ActivityFeed';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useUnreadForumPosts } from '@/hooks/useUnreadForumPosts';

const SocialTab = ({ defaultTab = 'feed' }: { defaultTab?: 'feed' | 'memories' | 'friends' | 'messages' | 'forum' }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { unreadCount: unreadMessages, markAsRead: markMessagesRead } = useUnreadMessages();
  const { unreadCount: unreadForumPosts, markAsRead: markForumRead } = useUnreadForumPosts();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subTab = params.get('sub') as 'feed' | 'memories' | 'friends' | 'messages' | 'forum';
    if (subTab) {
      setActiveTab(subTab);
    }
  }, [location.search]);

  const handleTabChange = (value: string) => {
    if (value === 'feed' || value === 'memories' || value === 'friends' || value === 'messages' || value === 'forum') {
      setActiveTab(value);
      
      // Mark as read when switching to the tab
      if (value === 'messages') {
        markMessagesRead();
      } else if (value === 'forum') {
        markForumRead();
      }
    }
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-2 sm:px-4">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent flex overflow-x-auto scrollbar-hide">
              <TabsTrigger value="feed" className="gap-1 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary flex-shrink-0 px-3 sm:px-4">
                <Rss className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-sm whitespace-nowrap">Actualités</span>
              </TabsTrigger>
              <TabsTrigger value="memories" className="gap-1 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary flex-shrink-0 px-3 sm:px-4">
                <BookHeart className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-sm whitespace-nowrap">Souvenirs</span>
              </TabsTrigger>
              <TabsTrigger value="friends" className="gap-1 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary flex-shrink-0 px-3 sm:px-4">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-sm whitespace-nowrap">Amis</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-1 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary flex-shrink-0 px-3 sm:px-4">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-sm whitespace-nowrap">Messages</span>
                {unreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 min-w-5 flex items-center justify-center px-1.5 text-[10px] animate-pulse">
                    {unreadMessages > 99 ? '99+' : unreadMessages}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="forum" className="gap-1 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary flex-shrink-0 px-3 sm:px-4">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-sm whitespace-nowrap">Forum</span>
                {unreadForumPosts > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 min-w-5 flex items-center justify-center px-1.5 text-[10px] animate-pulse">
                    {unreadForumPosts > 99 ? '99+' : unreadForumPosts}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="feed" className="mt-0">
          <ActivityFeed />
        </TabsContent>

        <TabsContent value="memories" className="mt-0">
          <MemoriesTab />
        </TabsContent>

        <TabsContent value="friends" className="mt-0">
          <FriendsTab />
        </TabsContent>

        <TabsContent value="messages" className="mt-0">
          <MessagesTab />
        </TabsContent>

        <TabsContent value="forum" className="mt-0">
          <ForumTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialTab;
