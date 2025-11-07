import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ban, UserX, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BansManagementTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [unbanDialog, setUnbanDialog] = useState<{ open: boolean; banId: string | null; userId: string | null }>({
    open: false,
    banId: null,
    userId: null
  });
  const [manualBanDialog, setManualBanDialog] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null
  });
  const [unbanReason, setUnbanReason] = useState('');
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState<string>('24');

  const { data: bans, isLoading } = useQuery({
    queryKey: ['admin-bans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_bans')
        .select(`
          *,
          profiles!user_bans_user_id_fkey(username),
          banned_by_profile:profiles!user_bans_banned_by_fkey(username),
          unbanned_by_profile:profiles!user_bans_unbanned_by_fkey(username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000
  });

  const unbanMutation = useMutation({
    mutationFn: async ({ banId, reason }: { banId: string; reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_bans')
        .update({
          is_active: false,
          unbanned_at: new Date().toISOString(),
          unbanned_by: user.id,
          unban_reason: reason
        })
        .eq('id', banId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bans'] });
      toast({
        title: 'Utilisateur débanni',
        description: 'L\'utilisateur peut maintenant accéder à l\'application.'
      });
      setUnbanDialog({ open: false, banId: null, userId: null });
      setUnbanReason('');
    },
    onError: (error) => {
      console.error('Unban error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de débannir l\'utilisateur.',
        variant: 'destructive'
      });
    }
  });

  const manualBanMutation = useMutation({
    mutationFn: async ({ userId, reason, durationHours }: { userId: string; reason: string; durationHours: number | null }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const expiresAt = durationHours ? new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString() : null;

      const { error } = await supabase
        .from('user_bans')
        .insert({
          user_id: userId,
          ban_reason: reason,
          strike_count: 0,
          is_active: true,
          banned_by: user.id,
          ban_duration_hours: durationHours,
          expires_at: expiresAt
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bans'] });
      toast({
        title: 'Utilisateur banni',
        description: 'L\'utilisateur ne peut plus accéder à l\'application.'
      });
      setManualBanDialog({ open: false, userId: null });
      setBanReason('');
      setBanDuration('24');
    },
    onError: (error) => {
      console.error('Ban error:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de bannir l\'utilisateur.',
        variant: 'destructive'
      });
    }
  });

  const handleUnban = () => {
    if (!unbanDialog.banId || !unbanReason.trim()) return;
    unbanMutation.mutate({ banId: unbanDialog.banId, reason: unbanReason });
  };

  const handleManualBan = () => {
    if (!manualBanDialog.userId || !banReason.trim()) return;
    const durationHours = banDuration === 'permanent' ? null : parseInt(banDuration);
    manualBanMutation.mutate({ 
      userId: manualBanDialog.userId, 
      reason: banReason,
      durationHours
    });
  };

  const getBanTypeLabel = (ban: any) => {
    if (!ban.ban_duration_hours) {
      return <Badge variant="destructive">Permanent</Badge>;
    }
    
    if (ban.expires_at && new Date(ban.expires_at) > new Date()) {
      const hoursLeft = Math.ceil((new Date(ban.expires_at).getTime() - Date.now()) / (1000 * 60 * 60));
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          {hoursLeft}h restantes
        </Badge>
      );
    }
    
    return <Badge variant="outline">Expiré</Badge>;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5" />
            Gestion des Bannissements
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            Système automatique : 3 strikes = 24h, 4 strikes = 7j, 5+ strikes = permanent
          </p>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Raison</TableHead>
                  <TableHead>Strikes</TableHead>
                  <TableHead>Banni le</TableHead>
                  <TableHead>Expire le</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : bans?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Aucun bannissement
                    </TableCell>
                  </TableRow>
                ) : (
                  bans?.map((ban: any) => (
                    <TableRow key={ban.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {ban.profiles?.username || 'Utilisateur supprimé'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {ban.user_id.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getBanTypeLabel(ban)}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm">{ban.ban_reason}</div>
                        {!ban.is_active && ban.unban_reason && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Débanni : {ban.unban_reason}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={ban.strike_count >= 3 ? 'destructive' : 'secondary'}>
                          {ban.strike_count} strikes
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(ban.banned_at).toLocaleString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-sm">
                        {ban.expires_at ? (
                          <span className={new Date(ban.expires_at) < new Date() ? 'text-muted-foreground' : 'text-warning'}>
                            {new Date(ban.expires_at).toLocaleString('fr-FR')}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Jamais</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {ban.is_active ? (
                          <Badge variant="destructive" className="gap-1">
                            <UserX className="h-3 w-3" />
                            Actif
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Inactif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {ban.is_active ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUnbanDialog({ 
                              open: true, 
                              banId: ban.id,
                              userId: ban.user_id 
                            })}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Débannir
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Débanni le {new Date(ban.unbanned_at).toLocaleDateString('fr-FR')}
                          </span>
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

      <Dialog open={unbanDialog.open} onOpenChange={(open) => setUnbanDialog({ open, banId: null, userId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Débannir l'utilisateur</DialogTitle>
            <DialogDescription>
              Indiquez la raison du débannissement. L'utilisateur pourra à nouveau accéder à l'application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="unban-reason">Raison du débannissement</Label>
              <Textarea
                id="unban-reason"
                placeholder="Ex: Appel accepté, fausse détection, etc."
                value={unbanReason}
                onChange={(e) => setUnbanReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUnbanDialog({ open: false, banId: null, userId: null })}
            >
              Annuler
            </Button>
            <Button
              onClick={handleUnban}
              disabled={!unbanReason.trim() || unbanMutation.isPending}
            >
              {unbanMutation.isPending ? 'Débannissement...' : 'Débannir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BansManagementTab;
