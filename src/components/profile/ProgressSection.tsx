import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp } from 'lucide-react';

interface ProgressSectionProps {
  totalPoints: number;
}

const calculateLevel = (points: number) => {
  return Math.floor(points / 100) + 1;
};

const getPointsForNextLevel = (currentLevel: number) => {
  return currentLevel * 100;
};

export const ProgressSection = ({ totalPoints }: ProgressSectionProps) => {
  const currentLevel = calculateLevel(totalPoints);
  const pointsInCurrentLevel = totalPoints % 100;
  const pointsForNextLevel = 100;
  const progressPercentage = (pointsInCurrentLevel / pointsForNextLevel) * 100;
  const pointsNeeded = pointsForNextLevel - pointsInCurrentLevel;

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Progression
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-primary">Niveau {currentLevel}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {pointsInCurrentLevel} / {pointsForNextLevel} points
            </span>
            <span className="text-primary font-medium">
              {pointsNeeded} points restants
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
            Prochain niveau : Niveau {currentLevel + 1}
          </h4>
          <p className="text-sm text-muted-foreground">
            Continue d'explorer de nouveaux lieux sacrés pour gagner plus de points et débloquer des badges exclusifs !
          </p>
        </div>
      </div>
    </Card>
  );
};
