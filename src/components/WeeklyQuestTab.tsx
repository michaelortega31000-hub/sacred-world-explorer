import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Clock, Gift, CheckCircle2 } from 'lucide-react';

const WeeklyQuestTab = () => {
  const { t } = useTranslation();

  // Calcul du nombre de jours jusqu'au prochain lundi
  const getDaysUntilMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    return daysUntilMonday;
  };

  const weeklyQuests = [
    {
      id: 1,
      title: 'Explorateur Européen',
      description: 'Visitez 5 lieux sacrés en Europe',
      progress: 2,
      goal: 5,
      reward: 250,
      icon: '🏰'
    },
    {
      id: 2,
      title: 'Pèlerin Asiatique',
      description: 'Découvrez 3 temples en Asie',
      progress: 0,
      goal: 3,
      reward: 200,
      icon: '⛩️'
    },
    {
      id: 3,
      title: 'Voyageur Africain',
      description: 'Explorez 4 sites sacrés en Afrique',
      progress: 1,
      goal: 4,
      reward: 300,
      icon: '🌍'
    },
    {
      id: 4,
      title: 'Découvreur Américain',
      description: 'Visitez 3 lieux sacrés en Amérique',
      progress: 0,
      goal: 3,
      reward: 180,
      icon: '🗽'
    },
    {
      id: 5,
      title: 'Collectionneur Mondial',
      description: 'Visitez au moins 1 lieu sur chaque continent',
      progress: 3,
      goal: 6,
      reward: 400,
      icon: '🌐'
    }
  ];

  const daysLeft = getDaysUntilMonday();

  const completedQuests = [
    { title: 'Pèlerin du Moyen-Orient', points: 200, date: 'Il y a 1 semaine' },
    { title: 'Découvreur Asiatique', points: 150, date: 'Il y a 2 semaines' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* En-tête avec compte à rebours */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="w-6 h-6 text-primary" />
                Quêtes de la semaine
              </CardTitle>
              <Badge variant="secondary" className="gap-1 text-base px-3 py-1">
                <Clock className="w-4 h-4" />
                Renouvellement dans {daysLeft}j
              </Badge>
            </div>
            <CardDescription>
              5 défis hebdomadaires renouvelés tous les lundis
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Liste des 5 quêtes */}
        <div className="grid gap-4">
          {weeklyQuests.map((quest) => (
            <Card key={quest.id} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{quest.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{quest.title}</CardTitle>
                      <CardDescription>{quest.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Gift className="w-3 h-3" />
                    +{quest.reward} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium">
                      {quest.progress}/{quest.goal}
                    </span>
                  </div>
                  <Progress 
                    value={(quest.progress / quest.goal) * 100} 
                    className="h-2"
                  />
                </div>
                {quest.progress === quest.goal && (
                  <Button className="w-full" variant="secondary" disabled>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complétée !
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quêtes complétées</CardTitle>
            <CardDescription>Vos succès récents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedQuests.map((quest, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <div className="font-medium">{quest.title}</div>
                    <div className="text-sm text-muted-foreground">{quest.date}</div>
                  </div>
                  <Badge variant="secondary">+{quest.points} pts</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comment ça marche ?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>🎯</span>
                <span>Une nouvelle quête est proposée chaque lundi</span>
              </li>
              <li className="flex gap-2">
                <span>⏰</span>
                <span>Vous avez 7 jours pour la compléter</span>
              </li>
              <li className="flex gap-2">
                <span>🎁</span>
                <span>Gagnez des points bonus en réussissant les défis</span>
              </li>
              <li className="flex gap-2">
                <span>🏆</span>
                <span>Les quêtes complétées apparaissent dans votre historique</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyQuestTab;
