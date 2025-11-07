import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyVisitRequest {
  placeId: string;
  placeCoordinates: [number, number];
  userLat: number;
  userLon: number;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

async function logSecurityEvent(
  supabaseClient: any,
  userId: string | null,
  eventType: string,
  severity: string,
  action: string,
  details: any,
  ipAddress: string,
  userAgent: string,
  statusCode: number
) {
  try {
    await supabaseClient
      .from('security_logs')
      .insert({
        user_id: userId,
        event_type: eventType,
        severity,
        action,
        details,
        ip_address: ipAddress,
        user_agent: userAgent,
        endpoint: 'verify-visit',
        status_code: statusCode
      });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: VerifyVisitRequest = await req.json();
    const { placeId, placeCoordinates, userLat, userLon } = body;

    // Validate input
    if (!placeId || !placeCoordinates || !userLat || !userLon) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate placeId format (alphanumeric and hyphens only, max 100 chars)
    const placeIdPattern = /^[a-z0-9-]+$/;
    if (!placeIdPattern.test(placeId) || placeId.length > 100) {
      console.log(`Invalid placeId format: ${placeId}`);
      return new Response(
        JSON.stringify({ error: 'Invalid place identifier format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch place data from database (server-side source of truth)
    const { data: placeData, error: placeError } = await supabaseClient
      .from('places')
      .select('id, name, points_value, coordinates')
      .eq('id', placeId)
      .maybeSingle();

    if (placeError || !placeData) {
      console.log(`Place not found in database: ${placeId}`);
      return new Response(
        JSON.stringify({ error: 'Invalid place ID. Place not found in database.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use server-side point value (not client-provided)
    const placePoints = placeData.points_value;

    // Check rate limit (10 verifications per day)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const { data: rateLimitData } = await supabaseClient
      .from('rate_limits')
      .select('count, window_start')
      .eq('user_id', user.id)
      .eq('action', 'visit_verification')
      .gte('window_start', oneDayAgo.toISOString())
      .maybeSingle();

    if (rateLimitData && rateLimitData.count >= 10) {
      const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';
      
      await logSecurityEvent(
        supabaseClient,
        user.id,
        'rate_limit_exceeded',
        'warning',
        'visit_verification_rate_limit',
        { current_count: rateLimitData.count, limit: 10 },
        clientIp,
        userAgent,
        429
      );

      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Maximum 10 verifications per day.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate distance server-side
    const distance = calculateDistance(
      userLat,
      userLon,
      placeCoordinates[1], // latitude
      placeCoordinates[0]  // longitude
    );

    // Log verification attempt (for fraud detection)
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    console.log(`Verification attempt - User: ${user.id}, Place: ${placeId}, Distance: ${distance}m, IP: ${clientIp}`);

    // Log security event
    await logSecurityEvent(
      supabaseClient,
      user.id,
      distance > 500 ? 'suspicious_activity' : 'info',
      distance > 1000 ? 'warning' : 'info',
      'visit_verification_attempt',
      {
        place_id: placeId,
        distance_meters: Math.round(distance),
        success: distance <= 500
      },
      clientIp,
      userAgent,
      distance > 500 ? 400 : 200
    );

    // Check if within 500m
    if (distance > 500) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Too far from location. You are ${Math.round(distance)}m away (maximum 500m).`,
          distance: Math.round(distance)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get current user progress
    const { data: progressData } = await supabaseClient
      .from('user_progress')
      .select('visited_places, total_points, badges')
      .eq('user_id', user.id)
      .single();

    if (!progressData) {
      return new Response(
        JSON.stringify({ error: 'User progress not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if already visited
    if (progressData.visited_places.includes(placeId)) {
      return new Response(
        JSON.stringify({ error: 'Place already visited' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Award points and update visited places
    const newTotalPoints = progressData.total_points + placePoints;
    const newVisitedPlaces = [...progressData.visited_places, placeId];
    const newBadges = [...progressData.badges];

    // Award milestone badges
    if (newTotalPoints >= 100 && !newBadges.includes('explorer')) {
      newBadges.push('explorer');
    }
    if (newTotalPoints >= 500 && !newBadges.includes('pilgrim')) {
      newBadges.push('pilgrim');
    }
    if (newTotalPoints >= 1000 && !newBadges.includes('master')) {
      newBadges.push('master');
    }

    // Award special place badges
    const specialPlaceBadges: Record<string, string> = {
      'mecca-kaaba': 'mecca_badge',
      'notre-dame': 'notre_dame_badge',
      'vatican': 'vatican_badge',
      'taj-mahal': 'taj_mahal_badge',
      'western-wall': 'western_wall_badge',
      'golden-temple': 'golden_temple_badge',
      'angkor-wat': 'angkor_wat_badge',
      'sagrada-familia': 'sagrada_familia_badge'
    };

    const badgeId = specialPlaceBadges[placeId];
    if (badgeId && !newBadges.includes(badgeId)) {
      newBadges.push(badgeId);
    }

    // Update user progress
    const { error: updateError } = await supabaseClient
      .from('user_progress')
      .update({
        visited_places: newVisitedPlaces,
        total_points: newTotalPoints,
        badges: newBadges
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating user progress:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update progress' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update rate limit
    await supabaseClient
      .from('rate_limits')
      .upsert({
        user_id: user.id,
        action: 'visit_verification',
        count: (rateLimitData?.count || 0) + 1,
        window_start: rateLimitData?.window_start || new Date().toISOString()
      }, {
        onConflict: 'user_id,action'
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        points: placePoints,
        totalPoints: newTotalPoints,
        newBadges: newBadges.filter(b => !progressData.badges.includes(b)),
        distance: Math.round(distance)
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-visit function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
