import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { getCountryByCode } from '@/data/countries';
import { logger } from '@/lib/logger';

interface CountryRow {
  code: string;
  name: string;
  flag: string;
  points: number;
  users: number;
}

const FALLBACK_PREVIEW: CountryRow[] = [
  { code: 'IT', name: 'Italie', flag: '🇮🇹', points: 52300, users: 0 },
  { code: 'FR', name: 'France', flag: '🇫🇷', points: 48900, users: 0 },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', points: 41200, users: 0 },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', points: 38700, users: 0 },
  { code: 'IL', name: 'Israël', flag: '🇮🇱', points: 31500, users: 0 },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', points: 28400, users: 0 },
  { code: 'PL', name: 'Pologne', flag: '🇵🇱', points: 24800, users: 0 },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', points: 19200, users: 0 },
];

const CountryRankingTab = () => {
  const { t } = useTranslation();
  const { userProgress } = useApp();
  const [realRows, setRealRows] = useState<CountryRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await (supabase as any).rpc('get_country_leaderboard');
        if (error) throw error;
        if (cancelled) return;
        const rows: CountryRow[] = (data || [])
          .map((r: any) => {
            const meta = getCountryByCode(r.country_code);
            return {
              code: r.country_code,
              name: meta?.name ?? r.country_code,
              flag: meta?.flag ?? '🌍',
              points: Number(r.total_points) || 0,
              users: Number(r.user_count) || 0,
            };
          });
        setRealRows(rows);
      } catch (e) {
        logger.error('country leaderboard error', e);
        if (!cancelled) setRealRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const userCountry = userProgress.countryOfOrigin;
  const realHasData = (realRows?.length ?? 0) >= 2;
  const maxRealPoints = Math.max(1, ...(realRows?.map((r) => r.points) ?? [0]));
  const maxPreviewPoints = Math.max(1, ...FALLBACK_PREVIEW.map((r) => r.points));

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('tabs.countryRanking')}</CardTitle>
          <CardDescription>
            Points cumulés par pays — basés sur les utilisateurs ayant choisi leur pays d'origine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground py-8 text-center">Chargement…</div>
          ) : realHasData ? (
            <div className="space-y-6">
              {realRows!.map((country, index) => {
                const isUser = country.code === userCountry;
                const percentage = Math.round((country.points / maxRealPoints) * 100);
                return (
                  <div
                    key={country.code}
                    className={`space-y-2 rounded-lg p-3 transition-colors ${
                      isUser ? 'bg-primary/5 ring-2 ring-primary/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                          <span className="text-2xl">{country.flag}</span>
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {country.name}
                            {isUser && (
                              <Badge variant="secondary" className="text-[10px]">
                                Votre pays
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {country.points.toLocaleString()} points · {country.users} pèlerin
                            {country.users > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-semibold">#{index + 1}</div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {realRows && realRows.length > 0 && (
                <div className="space-y-2">
                  {realRows.map((country) => {
                    const isUser = country.code === userCountry;
                    return (
                      <div
                        key={country.code}
                        className={`flex items-center justify-between rounded-lg p-3 ${
                          isUser ? 'bg-primary/5 ring-2 ring-primary/40' : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {country.name}
                              {isUser && (
                                <Badge variant="secondary" className="text-[10px]">
                                  Votre pays
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {country.points.toLocaleString()} points · {country.users} pèlerin
                              {country.users > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="p-4 bg-muted/60 rounded-lg text-sm text-muted-foreground">
                🌍 Classement mondial en construction — invitez vos amis et faites briller votre pays&nbsp;!
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!realHasData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aperçu</CardTitle>
            <CardDescription>
              Exemple de classement à atteindre — ces chiffres sont indicatifs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {FALLBACK_PREVIEW.map((country, index) => {
                const percentage = Math.round((country.points / maxPreviewPoints) * 100);
                return (
                  <div key={country.code} className="space-y-2 opacity-70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                          <span className="text-2xl">{country.flag}</span>
                        </div>
                        <div>
                          <div className="font-medium">{country.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {country.points.toLocaleString()} points
                          </div>
                        </div>
                      </div>
                      <div className="text-base font-semibold text-muted-foreground">
                        #{index + 1}
                      </div>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 Les points de votre pays sont la somme des points de tous les pèlerins qui en
                sont originaires. Plus vous visitez de lieux sacrés, plus votre pays progresse&nbsp;!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CountryRankingTab;
