import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecalculateRequest {
  userId?: string; // If provided, recalculate for specific user, otherwise all users
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user authentication for manual calls
    const authHeader = req.headers.get('Authorization');
    let isAdmin = false;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
      
      if (!authError && user) {
        // Check if user is admin
        const { data: roleData } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
        
        isAdmin = !!roleData;
      }
    }

    // Parse request body
    const body: RecalculateRequest = await req.json().catch(() => ({}));
    const { userId } = body;

    // If userId is specified, verify authorization
    if (userId && !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Admin access required.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Storage Quota] Starting recalculation${userId ? ` for user ${userId}` : ' for all users'}`);

    // Query storage.objects to calculate actual usage per user
    // Group by bucket and user folder
    const { data: storageObjects, error: storageError } = await supabaseClient
      .from('objects')
      .select('name, bucket_id, metadata')
      .in('bucket_id', ['avatars', 'memory-photos', 'ar-captures', 'visit-photos']);

    if (storageError) {
      console.error('[Storage Quota] Error fetching storage objects:', storageError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch storage data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate usage per user
    const userUsage = new Map<string, number>();
    
    for (const obj of storageObjects || []) {
      // Extract user ID from path (format: {user_id}/filename)
      const pathParts = obj.name.split('/');
      if (pathParts.length < 2) continue;
      
      const objUserId = pathParts[0];
      
      // If filtering by userId, skip others
      if (userId && objUserId !== userId) continue;
      
      // Get file size from metadata
      const size = obj.metadata?.size || 0;
      
      // Add to user's total
      const currentUsage = userUsage.get(objUserId) || 0;
      userUsage.set(objUserId, currentUsage + size);
    }

    console.log(`[Storage Quota] Calculated usage for ${userUsage.size} users`);

    // Update user_storage_quotas table
    const updates: Array<{ user_id: string; used_bytes: number; updated: boolean }> = [];
    
    for (const [uId, usedBytes] of userUsage.entries()) {
      // Initialize quota if doesn't exist
      const { error: upsertError } = await supabaseClient
        .from('user_storage_quotas')
        .upsert({
          user_id: uId,
          used_bytes: usedBytes,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        console.error(`[Storage Quota] Failed to update quota for user ${uId}:`, upsertError);
        updates.push({ user_id: uId, used_bytes: usedBytes, updated: false });
      } else {
        updates.push({ user_id: uId, used_bytes: usedBytes, updated: true });
      }
    }

    const successCount = updates.filter(u => u.updated).length;
    const failCount = updates.filter(u => !u.updated).length;

    console.log(`[Storage Quota] Recalculation complete. Success: ${successCount}, Failed: ${failCount}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        recalculated: userUsage.size,
        updated: successCount,
        failed: failCount,
        details: updates.slice(0, 100) // Limit response size
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Storage Quota] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
