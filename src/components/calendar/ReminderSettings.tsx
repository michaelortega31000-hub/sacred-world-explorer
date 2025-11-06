import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ReligiousEvent } from '@/data/religiousEvents';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bell, Clock, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface ReminderSettingsProps {
  event: ReligiousEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const REMINDER_OPTIONS = [
  { label: '1 semaine avant', minutes: 10080, icon: '📅' },
  { label: '3 jours avant', minutes: 4320, icon: '📆' },
  { label: '1 jour avant', minutes: 1440, icon: '🌅' },
  { label: '12 heures avant', minutes: 720, icon: '🕐' },
  { label: '6 heures avant', minutes: 360, icon: '⏰' },
  { label: '1 heure avant', minutes: 60, icon: '⏱️' },
  { label: '30 minutes avant', minutes: 30, icon: '⚡' },
  { label: '15 minutes avant', minutes: 15, icon: '🔔' },
];

const ReminderSettings = ({ event, open, onOpenChange, onSave }: ReminderSettingsProps) => {
  const [selectedTimes, setSelectedTimes] = useState<number[]>([1440, 60]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { isSupported, isSubscribed, subscribe } = usePushNotifications();

  useEffect(() => {
    if (open) {
      loadExistingReminder();
    }
  }, [open, event.id]);

  const loadExistingReminder = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('event_reminders')
      .select('reminder_times')
      .eq('user_id', user.id)
      .eq('event_id', event.id)
      .single();

    if (!error && data) {
      setSelectedTimes(data.reminder_times || [1440, 60]);
    }
    setLoading(false);
  };

  const toggleTime = (minutes: number) => {
    setSelectedTimes(prev => {
      if (prev.includes(minutes)) {
        return prev.filter(t => t !== minutes);
      } else {
        return [...prev, minutes].sort((a, b) => b - a);
      }
    });
  };

  const handleSave = async () => {
    if (selectedTimes.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner au moins un moment de rappel',
        variant: 'destructive'
      });
      return;
    }

    // Vérifier si les notifications sont activées
    if (isSupported && !isSubscribed) {
      const subscribed = await subscribe();
      if (!subscribed) {
        toast({
          title: 'Notifications désactivées',
          description: 'Les rappels seront créés mais vous ne recevrez pas de notifications',
          variant: 'destructive'
        });
        return;
      }
    }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté',
        variant: 'destructive'
      });
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('event_reminders')
      .upsert({
        user_id: user.id,
        event_id: event.id,
        event_name: event.nameFr,
        event_date: event.date.toISOString(),
        reminder_times: selectedTimes,
        is_enabled: true
      }, {
        onConflict: 'user_id,event_id'
      });

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les rappels',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Rappels configurés',
        description: `${selectedTimes.length} rappel${selectedTimes.length > 1 ? 's' : ''} activé${selectedTimes.length > 1 ? 's' : ''} pour ${event.nameFr}`
      });
      onSave();
    }

    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Configurer les rappels
          </DialogTitle>
          <DialogDescription>
            Choisissez quand vous souhaitez être rappelé pour <strong>{event.nameFr}</strong>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status des notifications */}
            {isSupported && !isSubscribed && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ Les notifications push ne sont pas activées. Cliquez sur "Sauvegarder" pour les activer automatiquement.
                </p>
              </div>
            )}

            {/* Options de rappel */}
            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2">
              {REMINDER_OPTIONS.map((option) => {
                const isSelected = selectedTimes.includes(option.minutes);
                
                return (
                  <div
                    key={option.minutes}
                    onClick={() => toggleTime(option.minutes)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-primary bg-primary/10 shadow-md' 
                        : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }
                    `}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleTime(option.minutes)}
                      className="pointer-events-none"
                    />
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1">
                      <Label className="cursor-pointer font-medium">
                        {option.label}
                      </Label>
                    </div>
                    {isSelected && (
                      <Badge variant="default" className="animate-fade-in">
                        <Clock className="w-3 h-3 mr-1" />
                        Activé
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Résumé */}
            {selectedTimes.length > 0 && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium mb-1">
                  {selectedTimes.length} rappel{selectedTimes.length > 1 ? 's' : ''} sélectionné{selectedTimes.length > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  Vous recevrez une notification push à chaque moment choisi
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading || saving || selectedTimes.length === 0}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderSettings;
