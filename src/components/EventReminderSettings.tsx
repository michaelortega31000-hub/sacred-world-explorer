import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Calendar, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ReminderType = 'day_before' | 'week_before' | 'day_of';
type TraditionFilter = 'selected_religion' | 'all_religions' | 'custom';

const traditionLabels: Record<string, { icon: string; label: string }> = {
  christianity: { icon: '✝️', label: 'Christianisme' },
  islam: { icon: '☪️', label: 'Islam' },
  judaism: { icon: '✡️', label: 'Judaïsme' },
  hinduism: { icon: '🕉️', label: 'Hindouisme' },
  buddhism: { icon: '☸️', label: 'Bouddhisme' },
  other: { icon: '🕊️', label: 'Autres' }
};

const EventReminderSettings = () => {
  const { toast } = useToast();
  const { userProgress } = useApp();
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();
  const [eventNotifications, setEventNotifications] = useState(false);
  const [reminderType, setReminderType] = useState<ReminderType>('day_before');
  const [traditionFilter, setTraditionFilter] = useState<TraditionFilter>('selected_religion');
  const [selectedTraditions, setSelectedTraditions] = useState<string[]>([]);
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
        
        // Determine tradition filter based on filter_traditions column
        if (data.filter_traditions === null) {
          setTraditionFilter('selected_religion');
        } else if (data.filter_traditions.length === 0) {
          setTraditionFilter('all_religions');
        } else {
          setTraditionFilter('custom');
          setSelectedTraditions(data.filter_traditions);
        }
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

      // If enabling, subscribe to push notifications
      if (checked && isSupported && !isSubscribed) {
        const subscribed = await subscribe();
        if (!subscribed) {
          return; // Don't enable if push subscription failed
        }
      }

      // If disabling, unsubscribe from push notifications
      if (!checked && isSubscribed) {
        await unsubscribe();
      }

      setEventNotifications(checked);

      // Determine filter_traditions value based on current filter
      let filterTraditions: string[] | null;
      if (traditionFilter === 'selected_religion') {
        filterTraditions = null; // NULL means use selected religion
      } else if (traditionFilter === 'all_religions') {
        filterTraditions = []; // Empty array means all religions
      } else {
        filterTraditions = selectedTraditions;
      }

      const { error } = await supabase
        .from('user_event_reminders')
        .upsert({
          user_id: user.id,
          event_id: 'global_preference',
          reminder_type: reminderType,
          enabled: checked,
          filter_traditions: filterTraditions,
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

      let filterTraditions: string[] | null;
      if (traditionFilter === 'selected_religion') {
        filterTraditions = null;
      } else if (traditionFilter === 'all_religions') {
        filterTraditions = [];
      } else {
        filterTraditions = selectedTraditions;
      }

      const { error } = await supabase
        .from('user_event_reminders')
        .upsert({
          user_id: user.id,
          event_id: 'global_preference',
          reminder_type: value,
          enabled: eventNotifications,
          filter_traditions: filterTraditions,
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

  const handleTraditionFilterChange = async (value: TraditionFilter) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setTraditionFilter(value);

      let filterTraditions: string[] | null;
      if (value === 'selected_religion') {
        filterTraditions = null;
      } else if (value === 'all_religions') {
        filterTraditions = [];
      } else {
        filterTraditions = selectedTraditions.length > 0 ? selectedTraditions : [userProgress.selectedReligion || 'christianity'];
        setSelectedTraditions(filterTraditions);
      }

      const { error } = await supabase
        .from('user_event_reminders')
        .upsert({
          user_id: user.id,
          event_id: 'global_preference',
          reminder_type: reminderType,
          enabled: eventNotifications,
          filter_traditions: filterTraditions,
        }, {
          onConflict: 'user_id,event_id'
        });

      if (error) throw error;

      toast({
        title: 'Filtre mis à jour',
        description: value === 'selected_religion' 
          ? 'Notifications pour votre religion uniquement' 
          : value === 'all_religions'
          ? 'Notifications pour toutes les religions'
          : 'Filtre personnalisé appliqué',
      });
    } catch (error) {
      console.error('Error updating tradition filter:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder vos préférences',
        variant: 'destructive',
      });
    }
  };

  const toggleTradition = async (tradition: string) => {
    const newTraditions = selectedTraditions.includes(tradition)
      ? selectedTraditions.filter(t => t !== tradition)
      : [...selectedTraditions, tradition];
    
    setSelectedTraditions(newTraditions);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_event_reminders')
        .upsert({
          user_id: user.id,
          event_id: 'global_preference',
          reminder_type: reminderType,
          enabled: eventNotifications,
          filter_traditions: newTraditions,
        }, {
          onConflict: 'user_id,event_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating traditions:', error);
    }
  };

  if (loading) {
    return null;
  }

  const userReligionLabel = userProgress.selectedReligion 
    ? traditionLabels[userProgress.selectedReligion]?.label 
    : 'votre religion';

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

        {!isSupported && (
          <Alert className="ml-16">
            <AlertDescription>
              Votre navigateur ne supporte pas les notifications push. Vous recevrez uniquement des notifications basiques.
            </AlertDescription>
          </Alert>
        )}

        {eventNotifications && (
          <div className="ml-16 space-y-4">
            {isSupported && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Notifications Push
                    </span>
                  </div>
                  <Badge variant={isSubscribed ? 'default' : 'outline'}>
                    {isSubscribed ? 'Activées' : 'Désactivées'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Les notifications push fonctionnent même quand l'application est fermée.
                </p>
              </div>
            )}
            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label className="text-sm text-foreground flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtrer les traditions
              </Label>
              <Select value={traditionFilter} onValueChange={handleTraditionFilterChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selected_religion">
                    <div className="flex items-center gap-2">
                      <span>{traditionLabels[userProgress.selectedReligion || 'christianity']?.icon}</span>
                      <span>Uniquement {userReligionLabel}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="all_religions">
                    <div className="flex items-center gap-2">
                      <span>🌍</span>
                      <span>Toutes les traditions</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="custom">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <span>Personnalisé</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {traditionFilter === 'custom' && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Sélectionnez les traditions à inclure
                </Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(traditionLabels).map(([key, { icon, label }]) => (
                    <Badge
                      key={key}
                      variant={selectedTraditions.includes(key) ? 'default' : 'outline'}
                      className="cursor-pointer transition-all"
                      onClick={() => toggleTradition(key)}
                    >
                      <span className="mr-1">{icon}</span>
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default EventReminderSettings;
