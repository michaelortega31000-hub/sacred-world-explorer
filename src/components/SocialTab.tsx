import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare, BookHeart, Rss } from 'lucide-react';
import FriendsTab from './FriendsTab';
import ForumTab from './ForumTab';
import MessagesTab from './MessagesTab';
import MemoriesTab from './MemoriesTab';
import ActivityFeed from './ActivityFeed';

const SocialTab = ({ defaultTab = 'feed' }: { defaultTab?: 'feed' | 'memories' | 'friends' | 'messages' | 'forum' }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(defaultTab);

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
    }
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent grid grid-cols-5">
              <TabsTrigger value="feed" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Rss className="w-4 h-4" />
                Actualités
              </TabsTrigger>
              <TabsTrigger value="memories" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <BookHeart className="w-4 h-4" />
                Souvenirs
              </TabsTrigger>
              <TabsTrigger value="friends" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Users className="w-4 h-4" />
                Amis
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <MessageSquare className="w-4 h-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="forum" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <MessageSquare className="w-4 h-4" />
                Forum
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
