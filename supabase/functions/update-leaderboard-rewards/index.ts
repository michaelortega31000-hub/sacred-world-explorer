import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-function-secret',
};

// Rate limiting: Track last execution time
let lastExecutionTime = 0;
const MIN_INTERVAL_MS = 60000; // 1 minute cooldown

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Cooldown protection: Prevent rapid repeated calls
  const now = Date.now();
  if (lastExecutionTime > 0 && (now - lastExecutionTime) < MIN_INTERVAL_MS) {
    console.log('Rate limit: Function called too soon');
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please wait before calling again.' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429,
      }
    );
  }

  // Secret-based authentication for manual triggers (optional for scheduled tasks)
  const secretHeader = req.headers.get('x-function-secret');
  const expectedSecret = Deno.env.get('FUNCTION_SECRET');
  
  // If secret is configured and provided, validate it
  if (expectedSecret && secretHeader && secretHeader !== expectedSecret) {
    console.log('Unauthorized: Invalid function secret');
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      }
    );
  }

  lastExecutionTime = now;
  console.log('Starting leaderboard rewards update...');

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Call the function to check and award leaderboard positions
    const { error: functionError } = await supabaseClient.rpc('check_leaderboard_positions');

    if (functionError) {
      console.error('Error updating leaderboard rewards:', functionError);
      throw functionError;
    }

    console.log('Leaderboard rewards updated successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Leaderboard rewards updated' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in update-leaderboard-rewards:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
