import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  url?: string;
  userId?: string;
}

const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
const vapidSubject = Deno.env.get('VAPID_SUBJECT');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('[Push] Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: NotificationPayload = await req.json();
    console.log('[Push] Notification payload:', payload);

    // Get target user's subscriptions (default to sender if no userId specified)
    const targetUserId = payload.userId || user.id;
    const { data: subscriptions, error: subsError } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', targetUserId);

    if (subsError) {
      console.error('[Push] Error fetching subscriptions:', subsError);
      throw subsError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('[Push] No subscriptions found for user:', targetUserId);
      return new Response(
        JSON.stringify({ message: 'No subscriptions found', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Push] Sending to ${subscriptions.length} subscription(s)`);

    // Send notification to each subscription
    let sentCount = 0;
    const failedEndpoints: string[] = [];

    for (const subscription of subscriptions) {
      try {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        };

        const notificationData = {
          title: payload.title,
          body: payload.body,
          icon: payload.icon || '/logo-icon.png',
          tag: payload.tag || 'general',
          url: payload.url || '/calendar'
        };

        // Use web-push library for sending
        const webpush = await import('https://esm.sh/web-push@3.6.6');
        
        webpush.setVapidDetails(
          vapidSubject!,
          vapidPublicKey!,
          vapidPrivateKey!
        );

        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(notificationData)
        );

        sentCount++;
        console.log('[Push] Notification sent successfully to:', subscription.endpoint.substring(0, 50) + '...');
      } catch (error: any) {
        console.error('[Push] Error sending to endpoint:', error);
        
        // If endpoint is invalid (410 Gone or 404 Not Found), mark for deletion
        if (error.statusCode === 410 || error.statusCode === 404) {
          failedEndpoints.push(subscription.endpoint);
        }
      }
    }

    // Clean up invalid subscriptions
    if (failedEndpoints.length > 0) {
      console.log('[Push] Cleaning up', failedEndpoints.length, 'invalid subscriptions');
      await supabaseClient
        .from('push_subscriptions')
        .delete()
        .in('endpoint', failedEndpoints);
    }

    return new Response(
      JSON.stringify({ 
        message: 'Notifications sent',
        sent: sentCount,
        total: subscriptions.length,
        cleaned: failedEndpoints.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[Push] Server error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
