import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Award, Trophy, Star, Lock, ArrowLeft, Calendar, Compass, Target, MapPin, Medal } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface UserBadge {
  id: string;
  badge_type: string;
  religion: string | null;
  tier: string;
  unlocked_at: string;
  place_id: string | null;
  quest_name: string | null;
  quest_description: string | null;
  quest_icon: string | null;
}

const Badges = () => {
  const { session } = useApp();
  const navigate = useNavigate();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

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

  const getBadgesByType = (type: string) => {
    return badges.filter(b => b.badge_type === type);
  };

  const getQuestBadges = () => {
    return badges.filter(b => b.badge_type === 'quest');
  };

  const getReligionBadges = () => {
    return badges.filter(b => b.religion !== null);
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'diamond':
        return <Star className="w-5 h-5 text-cyan-400" />;
      case 'platinum':
        return <Trophy className="w-5 h-5 text-blue-400" />;
      case 'gold':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'silver':
        return <Award className="w-5 h-5 text-gray-400" />;
      default:
        return <Award className="w-5 h-5 text-amber-700" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond': return 'from-cyan-400/20 to-cyan-600/20 border-cyan-400/30';
      case 'platinum': return 'from-blue-400/20 to-blue-600/20 border-blue-400/30';
      case 'gold': return 'from-yellow-400/20 to-yellow-600/20 border-yellow-400/30';
      case 'silver': return 'from-gray-400/20 to-gray-600/20 border-gray-400/30';
      default: return 'from-amber-400/20 to-amber-700/20 border-amber-400/30';
    }
  };

  const questBadges = getQuestBadges();
  const religionBadges = getReligionBadges();

  // Define progression goals
  const progressionGoals = [
    { id: 'monthly-continents', name: 'Collectionneur de Continents', description: 'Visiter 5 continents différents', icon: <Compass className="w-6 h-6" />, unlocked: false },
    { id: 'monthly-pilgrimage', name: 'Maître Pèlerin', description: 'Visiter 25 lieux sacrés', icon: <Target className="w-6 h-6" />, unlocked: false },
    { id: 'monthly-religions', name: 'Explorateur des Religions', description: 'Visiter des lieux de 4 religions différentes', icon: <Medal className="w-6 h-6" />, unlocked: false },
    { id: 'monthly-countries', name: 'Voyage Mondial', description: 'Visiter 15 pays différents', icon: <MapPin className="w-6 h-6" />, unlocked: false },
  ];

  // Mark unlocked badges
  const progressionWithStatus = progressionGoals.map(goal => ({
    ...goal,
    unlocked: badges.some(b => b.place_id === goal.id)
  }));

  const filteredBadges = filter === 'all' 
    ? badges 
    : filter === 'quest' 
    ? questBadges 
    : religionBadges;

  return (
    <div className="min-h-screen bg-sacred-blue relative overflow-hidden pb-20">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
      </div>

      <Header>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/profile')}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </Header>
      
      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
            Collection de Badges
          </h1>
          <p className="text-muted-foreground">
            {badges.length} badge{badges.length > 1 ? 's' : ''} débloqué{badges.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 justify-center flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            Tous ({badges.length})
          </Button>
          <Button
            variant={filter === 'quest' ? 'default' : 'outline'}
            onClick={() => setFilter('quest')}
            size="sm"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Quêtes ({questBadges.length})
          </Button>
          <Button
            variant={filter === 'religion' ? 'default' : 'outline'}
            onClick={() => setFilter('religion')}
            size="sm"
          >
            <Star className="w-4 h-4 mr-1" />
            Religions ({religionBadges.length})
          </Button>
        </div>

        <Tabs defaultValue="unlocked" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unlocked">Débloqués</TabsTrigger>
            <TabsTrigger value="locked">À Débloquer</TabsTrigger>
          </TabsList>

          <TabsContent value="unlocked" className="space-y-4 mt-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : filteredBadges.length === 0 ? (
              <Card className="bg-sacred-beige/80 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Aucun badge débloqué dans cette catégorie
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBadges.map(badge => (
                  <Card 
                    key={badge.id} 
                    className={`overflow-hidden hover:shadow-lg transition-all bg-gradient-to-br ${getTierColor(badge.tier)} backdrop-blur-sm`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTierIcon(badge.tier)}
                            <span className="text-xs font-medium capitalize opacity-70">
                              {badge.tier}
                            </span>
                          </div>
                          <CardTitle className="text-base line-clamp-2">
                            {badge.quest_name || badge.badge_type}
                          </CardTitle>
                        </div>
                        {badge.quest_icon && (
                          <div className="text-2xl">{badge.quest_icon}</div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {badge.quest_description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {badge.quest_description}
                        </p>
                      )}
                      {badge.religion && (
                        <Badge variant="outline" className="w-full justify-center capitalize text-xs">
                          {badge.religion}
                        </Badge>
                      )}
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        Débloqué le {new Date(badge.unlocked_at).toLocaleDateString('fr-FR')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="locked" className="mt-6 space-y-4">
            <Card className="bg-sacred-beige/80 backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Progression vers les Badges de Quêtes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {progressionWithStatus.map(goal => (
                  <div 
                    key={goal.id}
                    className={`p-4 rounded-lg border ${
                      goal.unlocked 
                        ? 'bg-gradient-to-r from-accent/20 to-transparent border-accent/30' 
                        : 'bg-white/30 border-muted'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        goal.unlocked 
                          ? 'bg-accent/20 text-accent' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {goal.unlocked ? <Trophy className="w-5 h-5" /> : goal.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{goal.name}</h3>
                          {goal.unlocked && (
                            <Badge variant="default" className="text-xs">
                              ✓ Débloqué
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                        {!goal.unlocked && (
                          <div className="mt-3">
                            <Progress value={0} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              Complétez la quête mensuelle pour débloquer
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-sacred-beige/80 backdrop-blur-sm">
              <CardContent className="py-8 text-center space-y-4">
                <Lock className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Plus de badges à venir</h3>
                  <p className="text-muted-foreground max-w-md mx-auto text-sm">
                    Continuez à explorer les lieux sacrés du monde entier, complétez des quêtes mensuelles 
                    et progressez dans votre aventure spirituelle pour débloquer de nouveaux badges exceptionnels.
                  </p>
                </div>
                <Button onClick={() => navigate('/explore')} className="mt-4">
                  <Compass className="w-4 h-4 mr-2" />
                  Explorer maintenant
                </Button>
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
