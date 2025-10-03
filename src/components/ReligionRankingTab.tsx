import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Cross, Moon, Star, Flower2, Sun, Users, AtSign, Telescope } from 'lucide-react';
import { religionColors } from '@/config/religionColors';

const ReligionRankingTab = () => {
  const { t } = useTranslation();

  const religionData = [
    { id: 'christianity', icon: Cross, name: t('selection.religions.christianity'), points: 45200, percentage: 28 },
    { id: 'islam', icon: Moon, name: t('selection.religions.islam'), points: 38900, percentage: 24 },
    { id: 'buddhism', icon: Flower2, name: t('selection.religions.buddhism'), points: 32100, percentage: 20 },
    { id: 'hinduism', icon: Sun, name: t('selection.religions.hinduism'), points: 28500, percentage: 18 },
    { id: 'judaism', icon: Star, name: t('selection.religions.judaism'), points: 9700, percentage: 6 },
    { id: 'astronomy', icon: Telescope, name: 'Astronomie', points: 6800, percentage: 4 },
    { id: 'traditional', icon: Users, name: t('selection.religions.traditional'), points: 4200, percentage: 3 },
    { id: 'atheism', icon: AtSign, name: t('selection.religions.atheism'), points: 2400, percentage: 1 },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t('tabs.religionRanking')}</CardTitle>
          <CardDescription>
            Points cumulés par communauté (simulation)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {religionData.map((religion, index) => {
              const Icon = religion.icon;
              const colors = religionColors[religion.id as keyof typeof religionColors];
              return (
                <div key={religion.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors?.bg || 'bg-purple-500'} ${colors?.text || 'text-white'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">{religion.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {religion.points.toLocaleString()} points
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-semibold">
                      #{index + 1}
                    </div>
                  </div>
                  <Progress value={religion.percentage} className="h-2" />
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Les points de votre communauté sont la somme des points de tous les membres.
              Plus vous visitez de lieux, plus votre communauté progresse dans le classement !
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReligionRankingTab;
