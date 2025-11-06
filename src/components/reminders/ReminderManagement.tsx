import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Calendar, Trash2, Edit, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import ReminderSettings from '@/components/calendar/ReminderSettings';

interface Reminder {
  id: string;
  event_id: string;
  event_name: string;
  event_date: string;
  reminder_times: number[];
  is_enabled: boolean;
}

const ReminderManagement = () => {
  const { session } = useApp();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchReminders();
    }
  }, [session?.user?.id]);

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('event_reminders')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des rappels:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = async (reminderId: string, isEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from('event_reminders')
        .update({ is_enabled: !isEnabled })
        .eq('id', reminderId);

      if (error) throw error;

      setReminders(prev =>
        prev.map(r => r.id === reminderId ? { ...r, is_enabled: !isEnabled } : r)
      );

      toast.success(!isEnabled ? 'Rappel activé' : 'Rappel désactivé');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rappel:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('event_reminders')
        .delete()
        .eq('id', reminderId);

      if (error) throw error;

      setReminders(prev => prev.filter(r => r.id !== reminderId));
      toast.success('Rappel supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression du rappel:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getReminderTimesLabel = (times: number[]) => {
    return times
      .sort((a, b) => b - a)
      .map(minutes => {
        if (minutes < 60) return `${minutes}min`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
        return `${Math.floor(minutes / 1440)}j`;
      })
      .join(', ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Aucun rappel configuré</h3>
        <p className="text-muted-foreground mb-6">
          Configurez des rappels depuis le calendrier pour recevoir des notifications
        </p>
        <Button onClick={() => window.location.href = '/calendar'} className="gap-2">
          <Calendar className="w-4 h-4" />
          Aller au calendrier
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Mes rappels ({reminders.length})</h2>
        <Badge variant="secondary">
          {reminders.filter(r => r.is_enabled).length} actif{reminders.filter(r => r.is_enabled).length > 1 ? 's' : ''}
        </Badge>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="p-4">
              <div className="flex items-start gap-4">
                {/* Icône et switch */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-2 rounded-full ${reminder.is_enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Bell className={`w-5 h-5 ${reminder.is_enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <Switch
                    checked={reminder.is_enabled}
                    onCheckedChange={() => toggleReminder(reminder.id, reminder.is_enabled)}
                  />
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-2">
                    {reminder.event_name}
                  </h3>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {format(new Date(reminder.event_date), 'PPP', { locale: fr })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Bell className="w-3 h-3" />
                      <span>Rappels: {getReminderTimesLabel(reminder.reminder_times)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedReminder(reminder);
                      setShowSettings(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Dialog de modification */}
      {selectedReminder && (
        <ReminderSettings
          event={{
            id: selectedReminder.event_id,
            name: selectedReminder.event_name,
            nameFr: selectedReminder.event_name,
            nameEn: selectedReminder.event_name,
            description: '',
            descriptionFr: '',
            descriptionEn: '',
            date: new Date(selectedReminder.event_date),
            tradition: 'other',
            isRecurring: false,
            color: '#34E0A1',
            type: 'celebration'
          }}
          open={showSettings}
          onOpenChange={(open) => {
            setShowSettings(open);
            if (!open) {
              setSelectedReminder(null);
              fetchReminders();
            }
          }}
          onSave={() => {
            setShowSettings(false);
            setSelectedReminder(null);
            fetchReminders();
          }}
        />
      )}
    </div>
  );
};

export default ReminderManagement;
