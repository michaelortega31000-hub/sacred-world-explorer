import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Activity, Shield, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardTab = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [
        { count: totalLogs24h },
        { count: criticalLogs24h },
        { data: uniqueUsersData },
        { count: rateLimitViolations }
      ] = await Promise.all([
        supabase.from('security_logs').select('*', { count: 'exact', head: true })
          .gte('created_at', oneDayAgo),
        supabase.from('security_logs').select('*', { count: 'exact', head: true })
          .eq('severity', 'critical')
          .gte('created_at', oneDayAgo),
        supabase.from('security_logs').select('user_id')
          .gte('created_at', oneDayAgo)
          .not('user_id', 'is', null),
        supabase.from('security_logs').select('*', { count: 'exact', head: true })
          .eq('event_type', 'rate_limit_exceeded')
          .gte('created_at', oneWeekAgo)
      ]);

      const uniqueUsers24h = new Set(uniqueUsersData?.map(u => u.user_id)).size;

      return {
        totalLogs24h: totalLogs24h || 0,
        criticalLogs24h: criticalLogs24h || 0,
        uniqueUsers24h,
        rateLimitViolations: rateLimitViolations || 0
      };
    },
    refetchInterval: 30000
  });

  const { data: chartData } = useQuery({
    queryKey: ['admin-chart-data'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_security_logs_by_day', { days: 7 });
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000
  });

  const { data: recentAlerts } = useQuery({
    queryKey: ['recent-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .in('severity', ['error', 'critical'])
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLogs24h}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Critiques (24h)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats?.criticalLogs24h}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs (24h)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.uniqueUsers24h}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limits (7j)</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.rateLimitViolations}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité de Sécurité (7 derniers jours)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="info" stroke="#10b981" name="Info" />
              <Line type="monotone" dataKey="warning" stroke="#f59e0b" name="Warning" />
              <Line type="monotone" dataKey="error" stroke="#ef4444" name="Error" />
              <Line type="monotone" dataKey="critical" stroke="#dc2626" name="Critical" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Alertes Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune alerte récente</p>
            ) : (
              recentAlerts?.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        alert.severity === 'critical' ? 'bg-destructive text-destructive-foreground' :
                        alert.severity === 'error' ? 'bg-orange-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium">{alert.event_type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.action}</p>
                  {alert.user_id && (
                    <p className="text-xs text-muted-foreground mt-1">
                      User ID: {alert.user_id.slice(0, 8)}...
                    </p>
                  )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.created_at).toLocaleString('fr-FR')}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
