import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReligiousEvent } from '@/data/religiousEvents';
import { format, addDays, isSameDay, differenceInDays, startOfToday, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, BellOff, Calendar, Clock, Settings2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReminderSettings from './ReminderSettings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UpcomingEventsWeekProps {
  events: ReligiousEvent[];
  onEventClick: (event: ReligiousEvent) => void;
  traditionColors: Record<string, string>;
}

const UpcomingEventsWeek = ({ events, onEventClick, traditionColors }: UpcomingEventsWeekProps) => {
  const [selectedEventForReminder, setSelectedEventForReminder] = useState<ReligiousEvent | null>(null);
  const [reminders, setReminders] = useState<Record<string, any>>({});
  const { toast } = useToast();

  // Filtrer les événements de la semaine à venir (7 prochains jours)
  const upcomingEvents = useMemo(() => {
    const today = startOfToday();
    const nextWeek = addDays(today, 7);

    return events
      .filter(event => {
        const eventDate = event.date;
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events]);

  // Charger les rappels existants
  useEffect(() => {
    loadReminders();
  }, [upcomingEvents]);

  const loadReminders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const eventIds = upcomingEvents.map(e => e.id);
    if (eventIds.length === 0) return;

    const { data, error } = await supabase
      .from('event_reminders')
      .select('*')
      .eq('user_id', user.id)
      .in('event_id', eventIds);

    if (!error && data) {
      const remindersMap = data.reduce((acc, reminder) => {
        acc[reminder.event_id] = reminder;
        return acc;
      }, {} as Record<string, any>);
      setReminders(remindersMap);
    }
  };

  const getCountdown = (eventDate: Date) => {
    const today = new Date();
    const days = differenceInDays(eventDate, today);
    
    if (days === 0) return { text: "Aujourd'hui", urgent: true };
    if (days === 1) return { text: "Demain", urgent: true };
    return { text: `Dans ${days} jours`, urgent: false };
  };

  const toggleReminder = async (event: ReligiousEvent) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Authentification requise',
        description: 'Veuillez vous connecter pour activer les rappels',
        variant: 'destructive'
      });
      return;
    }

    const existingReminder = reminders[event.id];

    if (existingReminder) {
      // Toggle enable/disable
      const { error } = await supabase
        .from('event_reminders')
        .update({ is_enabled: !existingReminder.is_enabled })
        .eq('id', existingReminder.id);

      if (!error) {
        setReminders(prev => ({
          ...prev,
          [event.id]: { ...existingReminder, is_enabled: !existingReminder.is_enabled }
        }));
        toast({
          title: existingReminder.is_enabled ? 'Rappel désactivé' : 'Rappel activé',
          description: `Pour ${event.nameFr}`
        });
      }
    } else {
      // Créer un nouveau rappel avec les valeurs par défaut
      const { data, error } = await supabase
        .from('event_reminders')
        .insert({
          user_id: user.id,
          event_id: event.id,
          event_name: event.nameFr,
          event_date: event.date.toISOString(),
          reminder_times: [1440, 60], // 1 jour et 1 heure avant
          is_enabled: true
        })
        .select()
        .single();

      if (!error && data) {
        setReminders(prev => ({ ...prev, [event.id]: data }));
        toast({
          title: 'Rappel activé',
          description: `Vous serez notifié 1 jour et 1 heure avant ${event.nameFr}`
        });
        // Ouvrir automatiquement les paramètres pour personnaliser
        setTimeout(() => setSelectedEventForReminder(event), 500);
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible de créer le rappel',
          variant: 'destructive'
        });
      }
    }
  };

  const hasReminder = (eventId: string) => {
    return reminders[eventId]?.is_enabled;
  };

  if (upcomingEvents.length === 0) {
    return (
      <Card className="border-border bg-card/50 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Événements à venir cette semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground">Aucun événement prévu dans les 7 prochains jours</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border bg-card/50 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse-subtle" />
            Événements à venir cette semaine
          </CardTitle>
          <CardDescription>
            {upcomingEvents.length} événement{upcomingEvents.length > 1 ? 's' : ''} dans les 7 prochains jours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const countdown = getCountdown(event.date);
                const hasReminderEnabled = hasReminder(event.id);

                return (
                  <div
                    key={event.id}
                    className={cn(
                      "relative group rounded-lg border-2 overflow-hidden transition-all",
                      "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
                      countdown.urgent && "ring-2 ring-primary/50"
                    )}
                    style={{
                      borderColor: event.color,
                      background: `linear-gradient(135deg, ${event.color}08 0%, transparent 100%)`
                    }}
                  >
                    {/* Glow effect */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 40px ${event.color}`
                      }}
                    />

                    <div className="relative p-4">
                      <div className="flex items-start gap-3">
                        {/* Colored indicator */}
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0 mt-2 group-hover:scale-125 transition-transform"
                          style={{
                            backgroundColor: event.color,
                            boxShadow: `0 0 12px ${event.color}`
                          }}
                        />

                        <div className="flex-1 min-w-0" onClick={() => onEventClick(event)}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {event.nameFr}
                            </h4>
                            <Badge
                              variant={countdown.urgent ? "default" : "secondary"}
                              className={cn(
                                "flex items-center gap-1 whitespace-nowrap flex-shrink-0",
                                countdown.urgent && "animate-pulse-subtle"
                              )}
                            >
                              <Clock className="w-3 h-3" />
                              {countdown.text}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {event.descriptionFr}
                          </p>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {format(event.date, "EEEE d MMMM yyyy", { locale: fr })}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        <Button
                          size="sm"
                          variant={hasReminderEnabled ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleReminder(event);
                          }}
                          className="flex-1"
                        >
                          {hasReminderEnabled ? (
                            <>
                              <Bell className="w-3 h-3 mr-1" />
                              Rappel activé
                            </>
                          ) : (
                            <>
                              <BellOff className="w-3 h-3 mr-1" />
                              Activer rappel
                            </>
                          )}
                        </Button>

                        {hasReminderEnabled && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventForReminder(event);
                            }}
                          >
                            <Settings2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Reminder Settings Dialog */}
      {selectedEventForReminder && (
        <ReminderSettings
          event={selectedEventForReminder}
          open={!!selectedEventForReminder}
          onOpenChange={(open) => !open && setSelectedEventForReminder(null)}
          onSave={() => {
            loadReminders();
            setSelectedEventForReminder(null);
          }}
        />
      )}
    </>
  );
};

export default UpcomingEventsWeek;
