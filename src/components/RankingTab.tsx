import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star } from 'lucide-react';

const RankingTab = () => {
  const { t } = useTranslation();
  const { userProgress } = useApp();

  const badgeIcons = {
    explorer: <Star className="w-4 h-4" />,
    pilgrim: <Award className="w-4 h-4" />,
    master: <Trophy className="w-4 h-4" />
  };

  const badgeNames = {
    explorer: 'Explorateur (100 pts)',
    pilgrim: 'Pèlerin (500 pts)',
    master: 'Maître (1000 pts)'
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              {t('ranking.yourPoints')}
            </CardTitle>
            <CardDescription>Score total accumulé</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {userProgress.totalPoints}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {userProgress.visitedPlaces.length} lieux visités
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary" />
              {t('ranking.badges')}
            </CardTitle>
            <CardDescription>Récompenses débloquées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userProgress.badges.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Visitez des lieux pour débloquer des badges !
                </p>
              ) : (
                userProgress.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="gap-1">
                    {badgeIcons[badge as keyof typeof badgeIcons]}
                    {badgeNames[badge as keyof typeof badgeNames]}
                  </Badge>
                ))
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="text-xs text-muted-foreground">Prochains badges :</div>
              {!userProgress.badges.includes('explorer') && (
                <div className="text-sm">
                  🎯 Explorateur à {100 - userProgress.totalPoints} points
                </div>
              )}
              {!userProgress.badges.includes('pilgrim') && userProgress.totalPoints >= 100 && (
                <div className="text-sm">
                  🎯 Pèlerin à {500 - userProgress.totalPoints} points
                </div>
              )}
              {!userProgress.badges.includes('master') && userProgress.totalPoints >= 500 && (
                <div className="text-sm">
                  🎯 Maître à {1000 - userProgress.totalPoints} points
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('ranking.position')}</CardTitle>
            <CardDescription>Classement général (simulation)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-medium">Marco Explorer</div>
                    <div className="text-sm text-muted-foreground">2,450 points</div>
                  </div>
                </div>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-medium">Sofia Voyager</div>
                    <div className="text-sm text-muted-foreground">1,890 points</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-medium">Alex Wanderer</div>
                    <div className="text-sm text-muted-foreground">1,230 points</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border-2 border-primary">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    ?
                  </div>
                  <div>
                    <div className="font-medium">Vous</div>
                    <div className="text-sm text-muted-foreground">{userProgress.totalPoints} points</div>
                  </div>
                </div>
                <Star className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RankingTab;
