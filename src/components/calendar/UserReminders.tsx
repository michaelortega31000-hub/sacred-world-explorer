import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, BellOff, Trash2, Edit, Calendar, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, isPast, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EventReminder {
  id: string;
  event_id: string;
  event_name: string;
  event_date: string;
  reminder_times: number[];
  is_enabled: boolean;
  last_sent_at: string | null;
}

export const UserReminders = () => {
  const [reminders, setReminders] = useState<EventReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteReminderId, setDeleteReminderId] = useState<string | null>(null);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('event_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true });

      if (error) throw error;

      setReminders(data || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
      toast.error('Erreur lors du chargement des rappels');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReminder = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('event_reminders')
        .update({ is_enabled: !currentState })
        .eq('id', id);

      if (error) throw error;

      toast.success(!currentState ? 'Rappel activé' : 'Rappel désactivé');
      loadReminders();
    } catch (error) {
      console.error('Error toggling reminder:', error);
      toast.error('Erreur lors de la modification du rappel');
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('event_reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Rappel supprimé');
      loadReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Erreur lors de la suppression du rappel');
    } finally {
      setDeleteReminderId(null);
    }
  };

  const formatReminderTime = (offsetMinutes: number): string => {
    if (offsetMinutes === 0) return 'Le jour même à 9h';
    const days = Math.floor(offsetMinutes / (24 * 60));
    if (days >= 14) return '2 semaines avant';
    if (days >= 7) return '1 semaine avant';
    if (days >= 3) return '3 jours avant';
    if (days >= 1) return '1 jour avant';
    const hours = Math.floor(offsetMinutes / 60);
    return `${hours}h avant`;
  };

  const upcomingReminders = reminders.filter(r => !isPast(parseISO(r.event_date)));
  const pastReminders = reminders.filter(r => isPast(parseISO(r.event_date)));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Mes rappels
              </CardTitle>
              <CardDescription>
                {upcomingReminders.length} rappel{upcomingReminders.length > 1 ? 's' : ''} à venir
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {reminders.length} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground">
                Aucun rappel configuré
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Créez des rappels depuis les détails d'un événement
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {/* Upcoming Reminders */}
                {upcomingReminders.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      À venir
                    </h3>
                    {upcomingReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="p-4 rounded-lg border-2 bg-card transition-all hover:shadow-md"
                        style={{
                          borderColor: reminder.is_enabled ? 'hsl(var(--primary) / 0.5)' : 'hsl(var(--border))',
                          opacity: reminder.is_enabled ? 1 : 0.6,
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">
                                {reminder.event_name}
                              </h4>
                              {!reminder.is_enabled && (
                                <Badge variant="outline" className="text-xs">
                                  Désactivé
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {format(parseISO(reminder.event_date), 'd MMMM yyyy', { locale: fr })}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {reminder.reminder_times.map(offset => formatReminderTime(offset)).join(', ')}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleReminder(reminder.id, reminder.is_enabled)}
                            >
                              {reminder.is_enabled ? (
                                <Bell className="w-4 h-4" />
                              ) : (
                                <BellOff className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteReminderId(reminder.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Past Reminders */}
                {pastReminders.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Passés
                    </h3>
                    {pastReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="p-4 rounded-lg border bg-secondary/30 opacity-60"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-1">
                            <h4 className="font-semibold text-foreground">
                              {reminder.event_name}
                            </h4>
                            <div className="text-sm text-muted-foreground">
                              {format(parseISO(reminder.event_date), 'd MMMM yyyy', { locale: fr })}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteReminderId(reminder.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteReminderId} onOpenChange={(open) => !open && setDeleteReminderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le rappel ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le rappel sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteReminderId && deleteReminder(deleteReminderId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserReminders;
