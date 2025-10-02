import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Flag, Users } from 'lucide-react';
import RankingTab from './RankingTab';
import CountryRankingTab from './CountryRankingTab';
import ReligionRankingTab from './ReligionRankingTab';

const RankingsTab = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="personal" className="w-full">
        <div className="flex flex-col gap-2 mb-6">
          <TabsList className="w-full bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="personal" 
              className="gap-2 w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3"
            >
              <Trophy className="w-4 h-4" />
              {t('tabs.myRanking')}
            </TabsTrigger>
          </TabsList>
          
          <TabsList className="w-full bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="country" 
              className="gap-2 w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3"
            >
              <Flag className="w-4 h-4" />
              {t('tabs.countryRanking')}
            </TabsTrigger>
          </TabsList>
          
          <TabsList className="w-full bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="religion" 
              className="gap-2 w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3"
            >
              <Users className="w-4 h-4" />
              {t('tabs.religionRanking')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="personal">
          <RankingTab />
        </TabsContent>

        <TabsContent value="country">
          <CountryRankingTab />
        </TabsContent>

        <TabsContent value="religion">
          <ReligionRankingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RankingsTab;
