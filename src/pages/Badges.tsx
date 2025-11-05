import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReligiousSymbol from '@/components/ReligiousSymbol';
import { Award, Trophy, Star, Lock } from 'lucide-react';

interface UserBadge {
  id: string;
  badge_type: string;
  religion: string | null;
  tier: string;
  unlocked_at: string;
  place_id: string | null;
}

const Badges = () => {
  const { session } = useApp();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchBadges();
    }
  }, [session]);

  const fetchBadges = async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', session.user.id)
      .order('unlocked_at', { ascending: false });

    if (!error && data) {
      setBadges(data);
    }
    setLoading(false);
  };

  const getBadgesByReligion = (religion: string) => {
    return badges.filter(b => b.religion === religion);
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'diamond':
        return <Star className="w-4 h-4 text-cyan-400" />;
      case 'platinum':
        return <Trophy className="w-4 h-4 text-blue-400" />;
      case 'gold':
        return <Award className="w-4 h-4 text-yellow-500" />;
      case 'silver':
        return <Award className="w-4 h-4 text-gray-400" />;
      default:
        return <Award className="w-4 h-4 text-amber-700" />;
    }
  };

  const religions = ['christianity', 'islam', 'judaism', 'buddhism', 'hinduism'];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Mes Badges
          </h1>
          <p className="text-muted-foreground">
            {badges.length} badge{badges.length > 1 ? 's' : ''} débloqué{badges.length > 1 ? 's' : ''}
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="by-religion">Par Religion</TabsTrigger>
            <TabsTrigger value="locked">À Débloquer</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : badges.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Visitez des lieux sacrés pour débloquer vos premiers badges !
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map(badge => (
                  <Card key={badge.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-1">
                            {badge.badge_type}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            {getTierIcon(badge.tier)}
                            <span className="text-xs text-muted-foreground capitalize">
                              {badge.tier}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-center">
                        <ReligiousSymbol 
                          religion={badge.religion || undefined}
                          unlocked={true}
                          size="md"
                          intensity={80}
                        />
                      </div>
                      {badge.religion && (
                        <Badge variant="outline" className="w-full justify-center capitalize">
                          {badge.religion}
                        </Badge>
                      )}
                      <p className="text-xs text-muted-foreground text-center">
                        Débloqué le {new Date(badge.unlocked_at).toLocaleDateString('fr-FR')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="by-religion" className="space-y-6 mt-6">
            {religions.map(religion => {
              const religionBadges = getBadgesByReligion(religion);
              
              return (
                <div key={religion} className="space-y-3">
                  <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
                    <ReligiousSymbol 
                      religion={religion}
                      unlocked={religionBadges.length > 0}
                      size="sm"
                      intensity={60}
                    />
                    {religion}
                    <Badge variant="secondary">{religionBadges.length}</Badge>
                  </h3>
                  {religionBadges.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {religionBadges.map(badge => (
                        <Card key={badge.id} className="p-3 text-center hover:shadow-md transition-shadow">
                          <div className="flex justify-center mb-2">
                            {getTierIcon(badge.tier)}
                          </div>
                          <p className="text-xs font-medium line-clamp-2">
                            {badge.badge_type}
                          </p>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-4 text-center text-sm text-muted-foreground">
                      Aucun badge pour cette religion
                    </Card>
                  )}
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="locked" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center space-y-4">
                <Lock className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Badges à Débloquer</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Continuez à explorer les lieux sacrés du monde entier pour débloquer de nouveaux badges et progresser dans votre aventure spirituelle.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Badges;
