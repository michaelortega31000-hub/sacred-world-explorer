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
import { Award, Trophy, Star, Lock, ArrowLeft, Calendar, Compass, Target, MapPin, Medal, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ImageBackground } from '@/components/ImageBackground';
import { getIconicImageForReligion, getImagesByReligion } from '@/lib/religionImageHelper';
import { getImageUrl } from '@/lib/imageHelper';

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

interface BadgeStats {
  totalBadges: number;
  completionRate: number;
  rareBadges: number;
  rank: number;
  totalUsers: number;
}

interface MonthlyProgress {
  month: string;
  badges: number;
}

const Badges = () => {
  const { session, userProgress } = useApp();
  const navigate = useNavigate();
  const iconicImage = getIconicImageForReligion(userProgress.selectedReligion);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [monthlyData, setMonthlyData] = useState<MonthlyProgress[]>([]);
  const [stats, setStats] = useState<BadgeStats>({
    totalBadges: 0,
    completionRate: 0,
    rareBadges: 0,
    rank: 0,
    totalUsers: 0
  });

  useEffect(() => {
    if (session?.user) {
      fetchBadges();
      fetchStats();
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
      calculateMonthlyProgress(data);
    }
    setLoading(false);
  };

  const calculateMonthlyProgress = (badgesData: UserBadge[]) => {
    const monthlyBadges: Record<string, number> = {};
    
    badgesData.forEach(badge => {
      const date = new Date(badge.unlocked_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyBadges[monthKey] = (monthlyBadges[monthKey] || 0) + 1;
    });

    // Get last 6 months
    const now = new Date();
    const last6Months: MonthlyProgress[] = [];
    let cumulativeBadges = 0;

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      
      cumulativeBadges += monthlyBadges[monthKey] || 0;
      
      last6Months.push({
        month: monthName,
        badges: cumulativeBadges
      });
    }

    setMonthlyData(last6Months);
  };

  const fetchStats = async () => {
    if (!session?.user) return;

    try {
      // Get user's badge count
      const { count: userBadgeCount } = await supabase
        .from('user_badges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      // Get rare badges count (gold, platinum, diamond)
      const { count: rareBadgeCount } = await supabase
        .from('user_badges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .in('tier', ['gold', 'platinum', 'diamond']);

      // Get all users' badge counts for ranking
      const { data: allUserBadges } = await supabase
        .from('user_badges')
        .select('user_id');

      if (allUserBadges) {
        const badgeCounts = allUserBadges.reduce((acc: Record<string, number>, curr) => {
          acc[curr.user_id] = (acc[curr.user_id] || 0) + 1;
          return acc;
        }, {});

        const userCount = userBadgeCount || 0;
        const sortedCounts = Object.values(badgeCounts).sort((a, b) => b - a);
        const userRank = sortedCounts.findIndex(count => count <= userCount) + 1;
        const totalUsers = Object.keys(badgeCounts).length;

        // Calculate completion rate (assuming 50 possible badges total)
        const TOTAL_POSSIBLE_BADGES = 50;
        const completionRate = Math.round((userCount / TOTAL_POSSIBLE_BADGES) * 100);

        setStats({
          totalBadges: userCount,
          completionRate: Math.min(completionRate, 100),
          rareBadges: rareBadgeCount || 0,
          rank: userRank || totalUsers + 1,
          totalUsers: totalUsers
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
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
      <ImageBackground 
        images={iconicImage}
        blur={5}
        overlay="dark"
        className="h-64 mb-6"
      >
        <div className="flex items-center justify-center h-full">
          <h1 className="text-4xl font-bold text-white">Mes Badges</h1>
        </div>
      </ImageBackground>

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

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-sacred-beige/90 backdrop-blur-sm border-primary/20">
            <CardContent className="pt-4 pb-3 px-3 text-center">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-accent" />
              <div className="text-xl sm:text-2xl font-bold text-sacred-blue">{stats.totalBadges}</div>
              <div className="text-xs text-muted-foreground">Badges totaux</div>
            </CardContent>
          </Card>

          <Card className="bg-sacred-beige/90 backdrop-blur-sm border-primary/20">
            <CardContent className="pt-4 pb-3 px-3 text-center">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-primary" />
              <div className="text-xl sm:text-2xl font-bold text-sacred-blue">{stats.completionRate}%</div>
              <div className="text-xs text-muted-foreground">Complétion</div>
            </CardContent>
          </Card>

          <Card className="bg-sacred-beige/90 backdrop-blur-sm border-primary/20">
            <CardContent className="pt-4 pb-3 px-3 text-center">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-xl sm:text-2xl font-bold text-sacred-blue">{stats.rareBadges}</div>
              <div className="text-xs text-muted-foreground">Badges rares</div>
            </CardContent>
          </Card>

          <Card className="bg-sacred-beige/90 backdrop-blur-sm border-primary/20">
            <CardContent className="pt-4 pb-3 px-3 text-center">
              <Medal className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-xl sm:text-2xl font-bold text-sacred-blue">#{stats.rank}</div>
              <div className="text-xs text-muted-foreground">Classement</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 backdrop-blur-sm border-accent/30">
          <CardContent className="pt-4 pb-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-sacred-blue">Progression globale</h3>
                  <p className="text-xs text-muted-foreground">
                    Vous êtes classé(e) #{stats.rank} sur {stats.totalUsers} utilisateurs
                  </p>
                </div>
                <Badge variant="default" className="bg-accent">
                  {stats.completionRate}%
                </Badge>
              </div>
              <Progress value={stats.completionRate} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{stats.totalBadges} débloqués</span>
                <span>{50 - stats.totalBadges} restants</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Progress Chart */}
        {monthlyData.length > 0 && (
          <Card className="bg-sacred-beige/90 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
                Progression mensuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorBadges" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="badges" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    fill="url(#colorBadges)" 
                    name="Badges"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Évolution de votre collection sur les 6 derniers mois
              </p>
            </CardContent>
          </Card>
        )}

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
