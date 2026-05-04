import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Check, X, Flag, Eye, MapPin, User } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  fetchSubmissions,
  moderateSubmission,
  bulkModerate,
  type SubmissionStatus,
  type ModerationAction,
  type SubmissionRow,
} from '@/lib/placePhotos';

const STATUS_TABS: { value: SubmissionStatus; label: string }[] = [
  { value: 'pending', label: 'En attente' },
  { value: 'flagged', label: 'Signalées' },
  { value: 'approved', label: 'Approuvées' },
  { value: 'rejected', label: 'Rejetées' },
];

const AdminCommunitySubmissions = () => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<SubmissionStatus>('pending');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<SubmissionRow | null>(null);
  const [reasonDialog, setReasonDialog] = useState<{
    action: Exclude<ModerationAction, 'approve'>;
    ids: string[];
  } | null>(null);
  const [reason, setReason] = useState('');

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['community-submissions', status],
    queryFn: () => fetchSubmissions({ status, isNewPlace: true }),
    enabled: isAdmin,
  });

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAdmin) return <Navigate to="/welcome" replace />;

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['community-submissions'] });

  const runSingle = async (id: string, action: ModerationAction, why?: string) => {
    try {
      await moderateSubmission(id, action, why);
      toast({ title: 'Action effectuée', description: `Soumission ${action}.` });
      refresh();
      setSelected((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Échec de la modération.',
        variant: 'destructive',
      });
    }
  };

  const runBulk = async (action: ModerationAction, why?: string) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const { success, failed } = await bulkModerate(ids, action, why);
    toast({
      title: 'Action groupée terminée',
      description: `${success} succès, ${failed} échec(s).`,
    });
    setSelected(new Set());
    refresh();
  };

  const openReason = (action: 'reject' | 'flag', ids: string[]) => {
    setReason('');
    setReasonDialog({ action, ids });
  };

  const submitReason = async () => {
    if (!reasonDialog) return;
    const { action, ids } = reasonDialog;
    if (ids.length === 1) {
      await runSingle(ids[0], action, reason);
    } else {
      await runBulk(action, reason);
    }
    setReasonDialog(null);
  };

  const toggleAll = () => {
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.id)));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-16 pb-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Modération communautaire</h1>
            <p className="text-sm text-muted-foreground">
              Approuver, rejeter ou signaler les nouveaux lieux sacrés soumis par la communauté.
            </p>
          </div>
        </div>

        <Tabs value={status} onValueChange={(v) => { setStatus(v as SubmissionStatus); setSelected(new Set()); }}>
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            {STATUS_TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
            ))}
          </TabsList>

          {STATUS_TABS.map((t) => (
            <TabsContent key={t.value} value={t.value} className="mt-6">
              {status === 'pending' && rows.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg bg-muted">
                  <Checkbox
                    checked={selected.size === rows.length && rows.length > 0}
                    onCheckedChange={toggleAll}
                  />
                  <span className="text-sm text-muted-foreground">
                    {selected.size} sélectionnée(s)
                  </span>
                  <div className="ml-auto flex flex-wrap gap-2">
                    <Button size="sm" disabled={selected.size === 0} onClick={() => runBulk('approve')}>
                      <Check className="h-4 w-4 mr-1" /> Approuver
                    </Button>
                    <Button size="sm" variant="destructive" disabled={selected.size === 0} onClick={() => openReason('reject', Array.from(selected))}>
                      <X className="h-4 w-4 mr-1" /> Rejeter
                    </Button>
                    <Button size="sm" variant="outline" disabled={selected.size === 0} onClick={() => openReason('flag', Array.from(selected))}>
                      <Flag className="h-4 w-4 mr-1" /> Flagger
                    </Button>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : rows.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  Aucune soumission {t.label.toLowerCase()}.
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rows.map((r) => (
                    <Card key={r.id} className="overflow-hidden flex flex-col">
                      <div className="relative">
                        <img
                          src={r.url}
                          alt={r.place_name}
                          referrerPolicy="no-referrer"
                          className="w-full h-48 object-cover cursor-pointer"
                          onClick={() => setLightbox(r)}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/place-placeholder.jpg'; }}
                        />
                        {status === 'pending' && (
                          <div className="absolute top-2 left-2 bg-background/90 rounded p-1">
                            <Checkbox
                              checked={selected.has(r.id)}
                              onCheckedChange={(c) => {
                                setSelected((s) => {
                                  const next = new Set(s);
                                  if (c) next.add(r.id); else next.delete(r.id);
                                  return next;
                                });
                              }}
                            />
                          </div>
                        )}
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          {r.tradition ?? 'autre'}
                        </Badge>
                      </div>
                      <div className="p-4 flex-1 flex flex-col gap-2">
                        <h3 className="font-semibold leading-tight">{r.place_name}</h3>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {[r.city, r.country].filter(Boolean).join(' · ') || '—'}
                        </div>
                        {typeof r.latitude === 'number' && typeof r.longitude === 'number' && (
                          <div className="text-xs text-muted-foreground">
                            {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                          </div>
                        )}
                        {r.caption && (
                          <p className="text-sm italic text-muted-foreground line-clamp-3">"{r.caption}"</p>
                        )}
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <User className="h-3 w-3" />
                          {r.author_username ?? 'anonyme'} · {new Date(r.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        {r.moderation_reason && (
                          <div className="text-xs p-2 rounded bg-muted">
                            <strong>Raison:</strong> {r.moderation_reason}
                          </div>
                        )}
                        {status === 'pending' || status === 'flagged' ? (
                          <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
                            <Button size="sm" onClick={() => runSingle(r.id, 'approve')}>
                              <Check className="h-4 w-4 mr-1" /> Approuver
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => openReason('reject', [r.id])}>
                              <X className="h-4 w-4 mr-1" /> Rejeter
                            </Button>
                            {status === 'pending' && (
                              <Button size="sm" variant="outline" className="col-span-2" onClick={() => openReason('flag', [r.id])}>
                                <Flag className="h-4 w-4 mr-1" /> Flagger
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" className="mt-auto" onClick={() => setLightbox(r)}>
                            <Eye className="h-4 w-4 mr-1" /> Voir
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Reason dialog */}
      <Dialog open={!!reasonDialog} onOpenChange={(o) => !o && setReasonDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reasonDialog?.action === 'reject' ? 'Rejeter la soumission' : 'Signaler la soumission'}
            </DialogTitle>
            <DialogDescription>
              Indiquez une raison ({reasonDialog?.ids.length ?? 0} soumission(s)).
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 300))}
            placeholder="Ex. photo floue, doublon, contenu inapproprié…"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">{reason.length}/300</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReasonDialog(null)}>Annuler</Button>
            <Button
              variant={reasonDialog?.action === 'reject' ? 'destructive' : 'default'}
              onClick={submitReason}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{lightbox?.place_name}</DialogTitle>
          </DialogHeader>
          {lightbox && (
            <img
              src={lightbox.url}
              alt={lightbox.place_name}
              referrerPolicy="no-referrer"
              className="w-full max-h-[70vh] object-contain rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCommunitySubmissions;
