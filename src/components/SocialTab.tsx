import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, BookHeart, Newspaper, MessagesSquare } from 'lucide-react';
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
          <div className="container mx-auto px-1 sm:px-4">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent flex overflow-x-auto scrollbar-hide gap-0.5 sm:gap-1">
              <TabsTrigger value="feed" className="flex-col sm:flex-row gap-0.5 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary flex-shrink-0 px-2 sm:px-4 py-2 min-w-[60px] sm:min-w-0">
                <Newspaper className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-sm whitespace-nowrap leading-tight">Actus</span>
              </TabsTrigger>
              <TabsTrigger value="memories" className="flex-col sm:flex-row gap-0.5 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary flex-shrink-0 px-2 sm:px-4 py-2 min-w-[60px] sm:min-w-0">
                <BookHeart className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-sm whitespace-nowrap leading-tight">Souvenirs</span>
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex-col sm:flex-row gap-0.5 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary flex-shrink-0 px-2 sm:px-4 py-2 min-w-[60px] sm:min-w-0">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-sm whitespace-nowrap leading-tight">Amis</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex-col sm:flex-row gap-0.5 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary flex-shrink-0 px-2 sm:px-4 py-2 min-w-[60px] sm:min-w-0 relative">
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-sm whitespace-nowrap leading-tight">Messages</span>
                {unreadMessages > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center px-1 text-[9px] animate-pulse">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="forum" className="flex-col sm:flex-row gap-0.5 sm:gap-2 rounded-none border-b-2 data-[state=active]:border-primary flex-shrink-0 px-2 sm:px-4 py-2 min-w-[60px] sm:min-w-0 relative">
                <MessagesSquare className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] sm:text-sm whitespace-nowrap leading-tight">Forum</span>
                {unreadForumPosts > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center px-1 text-[9px] animate-pulse">
                    {unreadForumPosts > 9 ? '9+' : unreadForumPosts}
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
