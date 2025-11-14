import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-function-secret',
};

interface Reminder {
  id: string;
  user_id: string;
  event_id: string;
  event_name: string;
  event_date: string;
  reminder_times: number[];
  is_enabled: boolean;
  last_sent_at: string | null;
}

// Rate limiting: Track last execution time
let lastExecutionTime = 0;
const MIN_INTERVAL_MS = 60000; // 1 minute cooldown

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Cooldown protection: Prevent rapid repeated calls
  const now = Date.now();
  if (lastExecutionTime > 0 && (now - lastExecutionTime) < MIN_INTERVAL_MS) {
    console.log('[Reminders] Rate limit: Function called too soon');
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429,
      }
    );
  }

  // Secret-based authentication for manual triggers (optional for scheduled tasks)
  const secretHeader = req.headers.get('x-function-secret');
  const expectedSecret = Deno.env.get('FUNCTION_SECRET');
  
  if (expectedSecret && secretHeader && secretHeader !== expectedSecret) {
    console.log('[Reminders] Unauthorized: Invalid function secret');
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      }
    );
  }

  lastExecutionTime = now;

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    console.log('[Reminders] Starting check for event reminders...');

    // Récupérer tous les rappels actifs
    const { data: reminders, error: remindersError } = await supabaseClient
      .from('event_reminders')
      .select('*')
      .eq('is_enabled', true);

    if (remindersError) {
      console.error('[Reminders] Error fetching reminders:', remindersError);
      throw remindersError;
    }

    if (!reminders || reminders.length === 0) {
      console.log('[Reminders] No active reminders found');
      return new Response(
        JSON.stringify({ message: 'No active reminders', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Reminders] Found ${reminders.length} active reminder(s)`);

    const now = new Date();
    let sentCount = 0;
    const processedReminders: string[] = [];

    for (const reminder of reminders as Reminder[]) {
      const eventDate = new Date(reminder.event_date);
      
      // Si l'événement est passé, on peut désactiver le rappel
      if (eventDate < now) {
        console.log(`[Reminders] Event ${reminder.event_name} is past, disabling reminder`);
        await supabaseClient
          .from('event_reminders')
          .update({ is_enabled: false })
          .eq('id', reminder.id);
        continue;
      }

      // Calculer le temps restant en minutes
      const minutesUntilEvent = Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60));

      console.log(`[Reminders] Event: ${reminder.event_name}, minutes until: ${minutesUntilEvent}`);

      // Vérifier chaque temps de rappel configuré
      for (const reminderTime of reminder.reminder_times) {
        // Vérifier si on est dans la fenêtre de notification (dans les 5 minutes)
        const shouldSend = minutesUntilEvent <= reminderTime && minutesUntilEvent > (reminderTime - 5);
        
        if (shouldSend) {
          // Vérifier si on n'a pas déjà envoyé récemment (pour éviter les doublons)
          if (reminder.last_sent_at) {
            const lastSent = new Date(reminder.last_sent_at);
            const minutesSinceLastSent = Math.floor((now.getTime() - lastSent.getTime()) / (1000 * 60));
            
            if (minutesSinceLastSent < 10) {
              console.log(`[Reminders] Skipping, already sent recently`);
              continue;
            }
          }

          console.log(`[Reminders] Sending reminder for ${reminder.event_name} (${reminderTime} minutes before)`);

          // Récupérer les abonnements push de l'utilisateur
          const { data: subscriptions, error: subsError } = await supabaseClient
            .from('push_subscriptions')
            .select('*')
            .eq('user_id', reminder.user_id);

          if (subsError || !subscriptions || subscriptions.length === 0) {
            console.log(`[Reminders] No push subscriptions for user ${reminder.user_id}`);
            continue;
          }

          // Préparer le message de notification
          let timeText = '';
          if (reminderTime >= 1440) {
            const days = Math.floor(reminderTime / 1440);
            timeText = `dans ${days} jour${days > 1 ? 's' : ''}`;
          } else if (reminderTime >= 60) {
            const hours = Math.floor(reminderTime / 60);
            timeText = `dans ${hours} heure${hours > 1 ? 's' : ''}`;
          } else {
            timeText = `dans ${reminderTime} minute${reminderTime > 1 ? 's' : ''}`;
          }

          const notificationData = {
            title: `📅 ${reminder.event_name}`,
            body: `Cet événement aura lieu ${timeText}`,
            icon: '/logo-icon.png',
            tag: `reminder-${reminder.id}`,
            url: '/calendar'
          };

          // Envoyer les notifications
          const webpush = await import('https://esm.sh/web-push@3.6.6');
          
          webpush.setVapidDetails(
            Deno.env.get('VAPID_SUBJECT')!,
            Deno.env.get('VAPID_PUBLIC_KEY')!,
            Deno.env.get('VAPID_PRIVATE_KEY')!
          );

          for (const subscription of subscriptions) {
            try {
              const pushSubscription = {
                endpoint: subscription.endpoint,
                keys: {
                  p256dh: subscription.p256dh,
                  auth: subscription.auth
                }
              };

              await webpush.sendNotification(
                pushSubscription,
                JSON.stringify(notificationData)
              );

              console.log(`[Reminders] Notification sent to user ${reminder.user_id}`);
              sentCount++;
              
              // Enregistrer dans l'historique
              await supabaseClient.from('notification_history').insert({
                user_id: reminder.user_id,
                event_id: reminder.event_id,
                event_name: reminder.event_name,
                event_date: reminder.event_date,
                notification_type: 'push',
                reminder_time_minutes: reminderTime
              });
            } catch (error: any) {
              console.error(`[Reminders] Failed to send notification:`, error);
              
              // Enregistrer l'échec dans l'historique
              await supabaseClient.from('notification_history').insert({
                user_id: reminder.user_id,
                event_id: reminder.event_id,
                event_name: reminder.event_name,
                event_date: reminder.event_date,
                notification_type: 'failed',
                reminder_time_minutes: reminderTime
              });
              
              // Nettoyer les abonnements invalides
              if (error.statusCode === 410 || error.statusCode === 404) {
                await supabaseClient
                  .from('push_subscriptions')
                  .delete()
                  .eq('endpoint', subscription.endpoint);
              }
            }
          }

          // Mettre à jour la date du dernier envoi
          await supabaseClient
            .from('event_reminders')
            .update({ last_sent_at: now.toISOString() })
            .eq('id', reminder.id);

          processedReminders.push(reminder.id);
        }
      }
    }

    console.log(`[Reminders] Check complete. Sent ${sentCount} notification(s)`);

    return new Response(
      JSON.stringify({ 
        message: 'Reminder check complete',
        processed: processedReminders.length,
        sent: sentCount,
        total: reminders.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[Reminders] Server error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
