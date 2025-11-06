import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, TrendingUp, Check, X, Calendar, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface Stats {
  totalSent: number;
  totalOpened: number;
  openRate: number;
  byType: { type: string; count: number }[];
  byDay: { day: string; count: number }[];
  topEvents: { event_name: string; count: number }[];
}

const COLORS = ['#34E0A1', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

const ReminderStats = () => {
  const { session } = useApp();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchStats();
    }
  }, [session?.user?.id]);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_history')
        .select('*')
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      if (!data || data.length === 0) {
        setStats({
          totalSent: 0,
          totalOpened: 0,
          openRate: 0,
          byType: [],
          byDay: [],
          topEvents: []
        });
        setLoading(false);
        return;
      }

      // Calculs des statistiques
      const totalSent = data.length;
      const totalOpened = data.filter(n => n.opened).length;
      const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;

      // Par type
      const typeCount: Record<string, number> = {};
      data.forEach(n => {
        typeCount[n.notification_type] = (typeCount[n.notification_type] || 0) + 1;
      });
      const byType = Object.entries(typeCount).map(([type, count]) => ({
        type: type === 'push' ? 'Push' : type === 'browser' ? 'Navigateur' : 'Échec',
        count
      }));

      // Par jour (7 derniers jours)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const dayCount: Record<string, number> = {};
      last7Days.forEach(day => dayCount[day] = 0);
      
      data.forEach(n => {
        const day = new Date(n.sent_at).toISOString().split('T')[0];
        if (dayCount[day] !== undefined) {
          dayCount[day]++;
        }
      });

      const byDay = Object.entries(dayCount).map(([day, count]) => ({
        day: new Date(day).toLocaleDateString('fr-FR', { weekday: 'short' }),
        count
      }));

      // Top événements
      const eventCount: Record<string, number> = {};
      data.forEach(n => {
        eventCount[n.event_name] = (eventCount[n.event_name] || 0) + 1;
      });
      const topEvents = Object.entries(eventCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([event_name, count]) => ({ event_name, count }));

      setStats({
        totalSent,
        totalOpened,
        openRate,
        byType,
        byDay,
        topEvents
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats || stats.totalSent === 0) {
    return (
      <Card className="p-12 text-center">
        <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Pas encore de statistiques</h3>
        <p className="text-muted-foreground">
          Les statistiques apparaîtront une fois que vous aurez reçu des notifications
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total envoyées</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalSent}</p>
            </div>
            <Bell className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ouvertes</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalOpened}</p>
            </div>
            <Check className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Taux d'ouverture</p>
              <p className="text-3xl font-bold text-foreground">{stats.openRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Graphique des 7 derniers jours */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notifications des 7 derniers jours</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.byDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Répartition par type */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Répartition par type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats.byType}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {stats.byType.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Top événements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Événements les plus notifiés</h3>
        <div className="space-y-3">
          {stats.topEvents.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center">
                  {index + 1}
                </Badge>
                <span className="font-medium">{event.event_name}</span>
              </div>
              <Badge variant="outline">{event.count} fois</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ReminderStats;
