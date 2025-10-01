import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, Trophy, Users, Target, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getPlacesByCountry } from '@/data/placesData';
import RankingTab from '@/components/RankingTab';
import ReligionRankingTab from '@/components/ReligionRankingTab';
import WeeklyQuestTab from '@/components/WeeklyQuestTab';
import { toast } from 'sonner';

const Country = () => {
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { visitPlace, isPlaceVisited, userProgress } = useApp();
  
  const places = country ? getPlacesByCountry(country) : [];

  const handleVisit = (placeId: string, placeName: string, points: number) => {
    if (!isPlaceVisited(placeId)) {
      visitPlace(placeId, points);
      toast.success(`${placeName} visité ! +${points} points`, {
        description: `Total: ${userProgress.totalPoints + points} points`
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/world')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('worldMap.back')}
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{userProgress.totalPoints}</span> {t('country.points')}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="places" className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger value="places" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <MapPin className="w-4 h-4" />
                {t('country.title')}
              </TabsTrigger>
              <TabsTrigger value="ranking" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Trophy className="w-4 h-4" />
                {t('tabs.myRanking')}
              </TabsTrigger>
              <TabsTrigger value="religion" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Users className="w-4 h-4" />
                {t('tabs.religionRanking')}
              </TabsTrigger>
              <TabsTrigger value="quest" className="gap-2 rounded-none border-b-2 data-[state=active]:border-primary">
                <Target className="w-4 h-4" />
                {t('tabs.weeklyQuest')}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="places" className="flex-1 m-0 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {country}
            </h1>
            <p className="text-muted-foreground mb-8">
              {places.length} {places.length === 1 ? 'lieu sacré' : 'lieux sacrés'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => {
                const visited = isPlaceVisited(place.id);
                return (
                  <Card key={place.id} className={`overflow-hidden transition-all hover:shadow-lg ${visited ? 'opacity-75' : ''}`}>
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <MapPin className="w-16 h-16 text-primary" />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between gap-2">
                        <span>{place.name}</span>
                        {visited && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                      </CardTitle>
                      <CardDescription>{place.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{place.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => handleVisit(place.id, place.name, place.points)}
                        disabled={visited}
                        className="w-full"
                        variant={visited ? 'secondary' : 'default'}
                      >
                        {visited ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {t('country.visited')}
                          </>
                        ) : (
                          `${t('country.visitPlace')} (+${place.points} pts)`
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ranking" className="flex-1 m-0">
          <RankingTab />
        </TabsContent>

        <TabsContent value="religion" className="flex-1 m-0">
          <ReligionRankingTab />
        </TabsContent>

        <TabsContent value="quest" className="flex-1 m-0">
          <WeeklyQuestTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Country;
