import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-function-secret',
};

interface LeaderboardRewardPayload {
  userId: string;
  rank: number;
  avatarName: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('[Leaderboard Notify] Starting notification process...');

  try {
    // Restrict to internal callers only.
    // Accept either: (a) shared FUNCTION_SECRET header from internal callers (DB triggers / cron),
    // or (b) an authenticated admin user.
    const functionSecret = Deno.env.get('FUNCTION_SECRET');
    const providedSecret = req.headers.get('x-function-secret');
    let authorized = false;

    if (functionSecret && providedSecret && providedSecret === functionSecret) {
      authorized = true;
    } else {
      const authHeader = req.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const supabaseAuth = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          { global: { headers: { Authorization: authHeader } } }
        );
        const token = authHeader.replace('Bearer ', '');
        const { data: claimsData } = await supabaseAuth.auth.getClaims(token);
        const userId = claimsData?.claims?.sub;
        if (userId) {
          const { data: roleData } = await supabaseAuth
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .eq('role', 'admin')
            .maybeSingle();
          authorized = !!roleData;
        }
      }
    }

    if (!authorized) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const payload: LeaderboardRewardPayload = await req.json();
    console.log('[Leaderboard Notify] Payload:', payload);

    const { userId, rank, avatarName } = payload;

    // Get user's push subscriptions
    const { data: subscriptions, error: subsError } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (subsError) {
      console.error('[Leaderboard Notify] Error fetching subscriptions:', subsError);
      throw subsError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('[Leaderboard Notify] No subscriptions found for user:', userId);
      return new Response(
        JSON.stringify({ message: 'No subscriptions found', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Prepare notification based on rank
    let title = '🏆 Félicitations !';
    let body = '';
    let rankEmoji = '';

    if (rank === 1) {
      rankEmoji = '🥇';
      title = '🥇 Champion Collectionneur !';
      body = 'Vous êtes 1er du classement ! Avatar légendaire débloqué.';
    } else if (rank === 2) {
      rankEmoji = '🥈';
      title = '🥈 Vice-Champion !';
      body = 'Vous êtes 2ème du classement ! Avatar légendaire débloqué.';
    } else if (rank === 3) {
      rankEmoji = '🥉';
      title = '🥉 Top 3 !';
      body = 'Vous êtes 3ème du classement ! Avatar épique débloqué.';
    }

    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidSubject = Deno.env.get('VAPID_SUBJECT');

    const webpush = await import('https://esm.sh/web-push@3.6.6');
    
    webpush.setVapidDetails(
      vapidSubject!,
      vapidPublicKey!,
      vapidPrivateKey!
    );

    let sentCount = 0;
    const failedEndpoints: string[] = [];

    // Send notification to each subscription
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
          title,
          body,
          icon: '/logo-icon.png',
          tag: 'leaderboard-reward',
          url: '/avatars'
        };

        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(notificationData)
        );

        sentCount++;
        console.log('[Leaderboard Notify] Notification sent to:', subscription.endpoint.substring(0, 50) + '...');
      } catch (error: any) {
        console.error('[Leaderboard Notify] Error sending to endpoint:', error);
        
        if (error.statusCode === 410 || error.statusCode === 404) {
          failedEndpoints.push(subscription.endpoint);
        }
      }
    }

    // Clean up invalid subscriptions
    if (failedEndpoints.length > 0) {
      console.log('[Leaderboard Notify] Cleaning up', failedEndpoints.length, 'invalid subscriptions');
      await supabaseClient
        .from('push_subscriptions')
        .delete()
        .in('endpoint', failedEndpoints);
    }

    console.log(`[Leaderboard Notify] Sent ${sentCount}/${subscriptions.length} notifications`);

    return new Response(
      JSON.stringify({ 
        message: 'Notifications sent',
        sent: sentCount,
        total: subscriptions.length,
        cleaned: failedEndpoints.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error('[Leaderboard Notify] Server error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
