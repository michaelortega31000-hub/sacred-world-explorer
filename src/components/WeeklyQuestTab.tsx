import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Clock, Gift } from 'lucide-react';

const WeeklyQuestTab = () => {
  const { t } = useTranslation();

  const currentQuest = {
    title: 'Explorateur Européen',
    description: 'Visitez 5 lieux sacrés en Europe cette semaine',
    progress: 2,
    goal: 5,
    reward: 250,
    daysLeft: 4
  };

  const completedQuests = [
    { title: 'Pèlerin du Moyen-Orient', points: 200, date: 'Il y a 1 semaine' },
    { title: 'Découvreur Asiatique', points: 150, date: 'Il y a 2 semaines' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <Card className="border-primary border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="w-6 h-6 text-primary" />
                  {currentQuest.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {currentQuest.description}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Clock className="w-3 h-3" />
                {currentQuest.daysLeft}j
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium">
                  {currentQuest.progress}/{currentQuest.goal}
                </span>
              </div>
              <Progress 
                value={(currentQuest.progress / currentQuest.goal) * 100} 
                className="h-3"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                <span className="font-medium">Récompense</span>
              </div>
              <div className="text-xl font-bold text-primary">
                +{currentQuest.reward} points
              </div>
            </div>

            <Button className="w-full" size="lg">
              Voir les lieux recommandés
            </Button>
          </CardContent>
        </Card>

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
