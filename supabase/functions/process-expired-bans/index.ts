import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-function-secret',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require either a shared FUNCTION_SECRET (for cron / internal callers)
    // or an authenticated admin user.
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
          const { data: roleRow } = await supabaseAuth
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .eq('role', 'admin')
            .maybeSingle();
          authorized = !!roleRow;
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('[Bans] Starting expired bans processing...');

    // Call the database function to process expired bans
    const { data: unbannedCount, error } = await supabaseClient
      .rpc('process_expired_bans');

    if (error) {
      console.error('[Bans] Error processing expired bans:', error);
      throw error;
    }

    console.log(`[Bans] Successfully processed ${unbannedCount} expired bans`);

    // Log the processing in security logs
    if (unbannedCount > 0) {
      await supabaseClient
        .from('security_logs')
        .insert({
          event_type: 'admin_action',
          severity: 'info',
          action: 'auto_unban_expired_bans',
          details: { unbanned_count: unbannedCount },
          endpoint: 'process-expired-bans'
        });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        unbanned_count: unbannedCount,
        message: `Processed ${unbannedCount} expired bans`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[Bans] Fatal error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
