import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { religiousEvents2025, ReligiousEvent } from '@/data/religiousEvents';
import { differenceInDays, isToday, startOfDay } from 'date-fns';
import { playNotificationSound, resumeAudioContext } from '@/utils/audioEffects';

interface EventReminder {
  event: ReligiousEvent;
  daysUntil: number;
  reminderType: 'day_of' | 'day_before' | 'week_before';
}

interface ReminderPreferences {
  enabled: boolean;
  reminder_type: string;
  filter_traditions: string[] | null;
}

export const useEventReminders = (userSelectedReligion?: string | null) => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventReminder[]>([]);
  const [hasShownNotification, setHasShownNotification] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem('shownEventReminders') || '[]'))
  );

  useEffect(() => {
    checkForReminders();
    
    // Check every hour
    const interval = setInterval(checkForReminders, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [userSelectedReligion]);

  const checkForReminders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's notification preferences
      const { data: preferences } = await supabase
        .from('user_event_reminders')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_id', 'global_preference')
        .single();

      if (!preferences || !preferences.enabled) {
        setUpcomingEvents([]);
        return;
      }

      const today = startOfDay(new Date());
      const reminders: EventReminder[] = [];

      // Determine which traditions to filter
      const prefs = preferences as ReminderPreferences;
      let allowedTraditions: Set<string> | null = null;
      
      if (prefs.filter_traditions === null) {
        // Use user's selected religion only
        if (userSelectedReligion) {
          allowedTraditions = new Set([userSelectedReligion]);
        }
      } else if (prefs.filter_traditions.length === 0) {
        // All religions allowed
        allowedTraditions = null;
      } else {
        // Custom selection
        allowedTraditions = new Set(prefs.filter_traditions);
      }

      religiousEvents2025.forEach(event => {
        // Filter by tradition
        if (allowedTraditions && !allowedTraditions.has(event.tradition)) {
          return;
        }

        const eventDate = startOfDay(event.date);
        const daysUntil = differenceInDays(eventDate, today);

        // Check if we should notify based on preference
        let shouldNotify = false;
        const reminderType = preferences.reminder_type as 'day_of' | 'day_before' | 'week_before';

        switch (reminderType) {
          case 'day_of':
            shouldNotify = isToday(eventDate);
            break;
          case 'day_before':
            shouldNotify = daysUntil === 1 || isToday(eventDate);
            break;
          case 'week_before':
            shouldNotify = daysUntil === 7 || daysUntil === 1 || isToday(eventDate);
            break;
        }

        if (shouldNotify && daysUntil >= 0) {
          const reminderId = `${event.id}-${daysUntil}`;
          
          // Show notification if not shown before
          if (!hasShownNotification.has(reminderId)) {
            showEventNotification(event, daysUntil);
            
            // Mark as shown
            const newShown = new Set(hasShownNotification);
            newShown.add(reminderId);
            setHasShownNotification(newShown);
            localStorage.setItem('shownEventReminders', JSON.stringify([...newShown]));
          }

          reminders.push({
            event,
            daysUntil,
            reminderType
          });
        }
      });

      setUpcomingEvents(reminders);
    } catch (error) {
      console.error('Error checking event reminders:', error);
    }
  };

  const showEventNotification = (event: ReligiousEvent, daysUntil: number) => {
    // Check if notifications are enabled in browser
    if ('Notification' in window && Notification.permission === 'granted') {
      // Check if sound effects are enabled
      const soundEnabled = localStorage.getItem('soundEffects') !== 'false';
      if (soundEnabled) {
        resumeAudioContext();
        playNotificationSound();
      }

      let title = '';
      let body = '';

      if (daysUntil === 0) {
        title = `🎉 Aujourd'hui : ${event.nameFr}`;
        body = event.descriptionFr;
      } else if (daysUntil === 1) {
        title = `🔔 Demain : ${event.nameFr}`;
        body = event.descriptionFr;
      } else if (daysUntil === 7) {
        title = `📅 Dans une semaine : ${event.nameFr}`;
        body = event.descriptionFr;
      }

      new Notification(title, {
        body,
        icon: '/logo-icon.png',
        badge: '/logo-icon.png',
        tag: `event-${event.id}-${daysUntil}`,
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  return {
    upcomingEvents,
    requestNotificationPermission,
    checkForReminders
  };
};
