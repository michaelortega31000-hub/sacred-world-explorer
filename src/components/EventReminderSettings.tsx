import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ReminderType = 'day_before' | 'week_before' | 'day_of';

const EventReminderSettings = () => {
  const { toast } = useToast();
  const [eventNotifications, setEventNotifications] = useState(false);
  const [reminderType, setReminderType] = useState<ReminderType>('day_before');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminderPreferences();
  }, []);

  const loadReminderPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_event_reminders')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_id', 'global_preference')
        .single();

      if (data) {
        setEventNotifications(data.enabled);
        setReminderType(data.reminder_type as ReminderType);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading reminder preferences:', error);
      setLoading(false);
    }
  };

  const handleToggleEventNotifications = async (checked: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEventNotifications(checked);

      const { error } = await supabase
        .from('user_event_reminders')
        .upsert({
          user_id: user.id,
          event_id: 'global_preference',
          reminder_type: reminderType,
          enabled: checked,
        }, {
          onConflict: 'user_id,event_id'
        });

      if (error) throw error;

      toast({
        title: checked ? 'Rappels activés' : 'Rappels désactivés',
        description: checked 
          ? 'Vous recevrez des notifications pour les événements religieux à venir' 
          : 'Vous ne recevrez plus de rappels',
      });
    } catch (error) {
      console.error('Error updating reminder preference:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder vos préférences',
        variant: 'destructive',
      });
      setEventNotifications(!checked);
    }
  };

  const handleReminderTypeChange = async (value: ReminderType) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setReminderType(value);

      const { error } = await supabase
        .from('user_event_reminders')
        .upsert({
          user_id: user.id,
          event_id: 'global_preference',
          reminder_type: value,
          enabled: eventNotifications,
        }, {
          onConflict: 'user_id,event_id'
        });

      if (error) throw error;

      const labels: Record<ReminderType, string> = {
        day_before: '1 jour avant',
        week_before: '1 semaine avant',
        day_of: 'Le jour même'
      };

      toast({
        title: 'Préférence mise à jour',
        description: `Vous recevrez les rappels ${labels[value]}`,
      });
    } catch (error) {
      console.error('Error updating reminder type:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder vos préférences',
        variant: 'destructive',
      });
      setReminderType(reminderType);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <Label className="text-lg font-semibold text-foreground">
                Rappels d'événements
              </Label>
              <p className="text-sm text-muted-foreground">
                Notifications pour les événements religieux
              </p>
            </div>
          </div>
          <Switch
            checked={eventNotifications}
            onCheckedChange={handleToggleEventNotifications}
          />
        </div>

        {eventNotifications && (
          <div className="ml-16 space-y-2">
            <Label className="text-sm text-foreground">Quand recevoir le rappel</Label>
            <Select value={reminderType} onValueChange={handleReminderTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day_of">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span>Le jour même</span>
                  </div>
                </SelectItem>
                <SelectItem value="day_before">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span>1 jour avant</span>
                  </div>
                </SelectItem>
                <SelectItem value="week_before">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span>1 semaine avant</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EventReminderSettings;
