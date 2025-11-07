import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LogsQuery {
  page?: number;
  limit?: number;
  severity?: string;
  event_type?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: isAdmin, error: adminError } = await supabaseClient
      .rpc('is_admin');

    if (adminError || !isAdmin) {
      await supabaseClient.from('security_logs').insert({
        user_id: user.id,
        event_type: 'unauthorized_access',
        severity: 'warning',
        action: 'attempted_admin_access',
        details: { endpoint: 'get-security-logs' },
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        endpoint: 'get-security-logs',
        status_code: 403
      });

      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const query: LogsQuery = await req.json();
    const page = query.page || 1;
    const limit = query.limit || 50;
    const offset = (page - 1) * limit;

    let logsQuery = supabaseClient
      .from('security_logs')
      .select('*, profiles(username)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (query.severity) {
      logsQuery = logsQuery.eq('severity', query.severity);
    }
    if (query.event_type) {
      logsQuery = logsQuery.eq('event_type', query.event_type);
    }
    if (query.user_id) {
      logsQuery = logsQuery.eq('user_id', query.user_id);
    }
    if (query.start_date) {
      logsQuery = logsQuery.gte('created_at', query.start_date);
    }
    if (query.end_date) {
      logsQuery = logsQuery.lte('created_at', query.end_date);
    }

    const { data: logs, error: logsError, count } = await logsQuery;

    if (logsError) {
      throw logsError;
    }

    return new Response(
      JSON.stringify({ 
        logs, 
        total: count,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit)
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-security-logs:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
