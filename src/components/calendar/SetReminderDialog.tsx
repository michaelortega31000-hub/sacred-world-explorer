import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Bell, Clock, Calendar } from 'lucide-react';
import { ReligiousEvent } from '@/data/religiousEvents';
import { format, subDays, subHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface SetReminderDialogProps {
  event: ReligiousEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReminderSet?: () => void;
}

type ReminderTiming = 'day_of' | '1_day' | '3_days' | '1_week' | '2_weeks';

const SetReminderDialog = ({ event, open, onOpenChange, onReminderSet }: SetReminderDialogProps) => {
  const [timing, setTiming] = useState<ReminderTiming>('1_day');
  const [notifyPush, setNotifyPush] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { subscribe, isSubscribed } = usePushNotifications();
  
  const hasPermission = Notification.permission === 'granted';

  if (!event) return null;

  const timingOptions = [
    { value: 'day_of', label: 'Le jour même (9h)', icon: '☀️' },
    { value: '1_day', label: '1 jour avant', icon: '📅' },
    { value: '3_days', label: '3 jours avant', icon: '📆' },
    { value: '1_week', label: '1 semaine avant', icon: '🗓️' },
    { value: '2_weeks', label: '2 semaines avant', icon: '🗓️' },
  ];

  const calculateReminderOffset = (timingValue: ReminderTiming): number => {
    // Returns offset in minutes before the event
    switch (timingValue) {
      case 'day_of':
        return 0; // Same day at 9AM - handled separately
      case '1_day':
        return 24 * 60; // 1 day in minutes
      case '3_days':
        return 3 * 24 * 60; // 3 days in minutes
      case '1_week':
        return 7 * 24 * 60; // 1 week in minutes
      case '2_weeks':
        return 14 * 24 * 60; // 2 weeks in minutes
      default:
        return 24 * 60;
    }
  };

  const calculateReminderDate = (eventDate: Date, timingValue: ReminderTiming): Date => {
    if (timingValue === 'day_of') {
      return new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), 9, 0, 0);
    }
    const offset = calculateReminderOffset(timingValue);
    return subHours(eventDate, offset / 60);
  };

  const handleSetReminder = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Vous devez être connecté pour créer des rappels');
        return;
      }

      // Subscribe to push notifications if needed
      if (notifyPush && !isSubscribed) {
        const subscribed = await subscribe();
        if (!subscribed) {
          toast.error('Impossible de s\'abonner aux notifications', {
            description: 'Vérifiez les permissions dans votre navigateur'
          });
          return;
        }
      }

      const reminderOffset = calculateReminderOffset(timing);

      // Check if reminder already exists
      const { data: existingReminder } = await supabase
        .from('event_reminders')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_id', event.id)
        .maybeSingle();

      if (existingReminder) {
        // Update existing reminder
        const { error } = await supabase
          .from('event_reminders')
          .update({
            reminder_times: [reminderOffset],
            is_enabled: true,
          })
          .eq('id', existingReminder.id);

        if (error) throw error;

        toast.success('Rappel mis à jour !', {
          description: `Vous serez notifié ${timingOptions.find(t => t.value === timing)?.label.toLowerCase()}`
        });
      } else {
        // Create new reminder
        const { error } = await supabase
          .from('event_reminders')
          .insert({
            user_id: user.id,
            event_id: event.id,
            event_name: event.nameFr,
            event_date: event.date.toISOString(),
            reminder_times: [reminderOffset],
            is_enabled: true,
          });

        if (error) throw error;

        toast.success('Rappel créé !', {
          description: `Vous serez notifié ${timingOptions.find(t => t.value === timing)?.label.toLowerCase()}`
        });
      }

      onReminderSet?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error setting reminder:', error);
      toast.error('Erreur lors de la création du rappel', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getReminderPreview = () => {
    const reminderDate = calculateReminderDate(event.date, timing);
    return format(reminderDate, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${event.color}20`, border: `2px solid ${event.color}` }}
            >
              <Bell className="w-4 h-4" style={{ color: event.color }} />
            </div>
            <DialogTitle>Configurer un rappel</DialogTitle>
          </div>
          <DialogDescription>
            {event.nameFr} - {format(event.date, 'd MMMM yyyy', { locale: fr })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Timing Selection */}
          <div className="space-y-2">
            <Label htmlFor="timing" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Quand souhaitez-vous être notifié ?
            </Label>
            <Select value={timing} onValueChange={(value) => setTiming(value as ReminderTiming)}>
              <SelectTrigger id="timing">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reminder Preview */}
          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-start gap-2 text-sm">
              <Calendar className="w-4 h-4 mt-0.5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Notification prévue le :</p>
                <p className="text-muted-foreground capitalize">{getReminderPreview()}</p>
              </div>
            </div>
          </div>

          {/* Push Notification Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <div>
                <Label htmlFor="push-notify" className="font-medium cursor-pointer">
                  Notification push
                </Label>
                <p className="text-xs text-muted-foreground">
                  Recevoir une notification sur cet appareil
                </p>
              </div>
            </div>
            <Switch
              id="push-notify"
              checked={notifyPush}
              onCheckedChange={setNotifyPush}
            />
          </div>

          {!hasPermission && notifyPush && (
            <div className="text-xs text-amber-600 dark:text-amber-400 p-2 rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              ⚠️ Permission de notification requise. Elle vous sera demandée lors de la création du rappel.
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSetReminder}
            disabled={isLoading}
            className="gap-2"
          >
            <Bell className="w-4 h-4" />
            {isLoading ? 'Création...' : 'Créer le rappel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetReminderDialog;
