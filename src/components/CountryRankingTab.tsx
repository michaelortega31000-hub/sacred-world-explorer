import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flag } from 'lucide-react';

const CountryRankingTab = () => {
  const { t } = useTranslation();

  const countryData = [
    { id: 'italy', name: 'Italie', points: 52300, percentage: 26, color: 'bg-green-500', flag: '🇮🇹' },
    { id: 'france', name: 'France', points: 48900, percentage: 24, color: 'bg-blue-500', flag: '🇫🇷' },
    { id: 'spain', name: 'Espagne', points: 41200, percentage: 20, color: 'bg-red-500', flag: '🇪🇸' },
    { id: 'india', name: 'Inde', points: 38700, percentage: 19, color: 'bg-orange-500', flag: '🇮🇳' },
    { id: 'israel', name: 'Israël', points: 31500, percentage: 16, color: 'bg-cyan-500', flag: '🇮🇱' },
    { id: 'egypt', name: 'Égypte', points: 28400, percentage: 14, color: 'bg-amber-500', flag: '🇪🇬' },
    { id: 'japan', name: 'Japon', points: 24800, percentage: 12, color: 'bg-pink-500', flag: '🇯🇵' },
    { id: 'usa', name: 'États-Unis', points: 19200, percentage: 9, color: 'bg-indigo-500', flag: '🇺🇸' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t('tabs.countryRanking')}</CardTitle>
          <CardDescription>
            Points cumulés par pays (simulation)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {countryData.map((country, index) => {
              return (
                <div key={country.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${country.color}`}>
                        <span className="text-2xl">{country.flag}</span>
                      </div>
                      <div>
                        <div className="font-medium">{country.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {country.points.toLocaleString()} points
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-semibold">
                      #{index + 1}
                    </div>
                  </div>
                  <Progress value={country.percentage} className="h-2" />
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Les points de votre pays sont la somme des points de tous les joueurs de ce pays.
              Plus vous visitez de lieux, plus votre pays progresse dans le classement !
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CountryRankingTab;
