import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RateLimitsTab = () => {
  const { data: rateLimits, isLoading } = useQuery({
    queryKey: ['admin-rate-limits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rate_limits')
        .select('*, profiles(username)')
        .order('window_start', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const isNearLimit = (count: number, action: string) => {
    const limits: Record<string, number> = {
      'message': 100,
      'visit_verification': 10
    };
    const limit = limits[action] || 100;
    return count >= limit * 0.8;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Monitoring des Rate Limits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Compteur</TableHead>
                <TableHead>Fenêtre</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : rateLimits?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Aucune donnée de rate limit
                  </TableCell>
                </TableRow>
              ) : (
                rateLimits?.map((limit: any) => (
                  <TableRow key={limit.id}>
                    <TableCell className="font-medium">
                      {limit.profiles?.username || 'Inconnu'}
                    </TableCell>
                    <TableCell>{limit.action}</TableCell>
                    <TableCell>
                      <span className={isNearLimit(limit.count, limit.action) ? 'text-destructive font-semibold' : ''}>
                        {limit.count}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(limit.window_start).toLocaleString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {isNearLimit(limit.count, limit.action) ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Proche limite
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Normal</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RateLimitsTab;
