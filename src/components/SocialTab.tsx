import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare } from 'lucide-react';
import FriendsTab from './FriendsTab';
import ForumTab from './ForumTab';

const SocialTab = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="friends" className="w-full">
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger value="friends" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Users className="w-4 h-4" />
                Amis
              </TabsTrigger>
              <TabsTrigger value="forum" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <MessageSquare className="w-4 h-4" />
                Forum
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="friends" className="mt-0">
          <FriendsTab />
        </TabsContent>

        <TabsContent value="forum" className="mt-0">
          <ForumTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialTab;
