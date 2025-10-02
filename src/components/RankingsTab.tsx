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
        <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6 bg-transparent p-0">
          <TabsTrigger value="personal" className="gap-2 w-full justify-center">
            <Trophy className="w-4 h-4" />
            {t('tabs.myRanking')}
          </TabsTrigger>
          <TabsTrigger value="country" className="gap-2 w-full justify-center">
            <Flag className="w-4 h-4" />
            {t('tabs.countryRanking')}
          </TabsTrigger>
          <TabsTrigger value="religion" className="gap-2 w-full justify-center">
            <Users className="w-4 h-4" />
            {t('tabs.religionRanking')}
          </TabsTrigger>
        </TabsList>

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
