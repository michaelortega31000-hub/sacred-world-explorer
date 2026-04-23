import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require authenticated admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authErr } = await supabaseAuth.auth.getClaims(token);
    if (authErr || !claimsData?.claims?.sub) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const { data: roleRow } = await supabaseAuth
      .from('user_roles')
      .select('role')
      .eq('user_id', claimsData.claims.sub)
      .eq('role', 'admin')
      .maybeSingle();
    if (!roleRow) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: admin only' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const mapboxToken = Deno.env.get('MAPBOX_PUBLIC_TOKEN')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch restaurants without coordinates
    const { data: restaurants, error: fetchError } = await supabase
      .from('restaurants')
      .select('id, name, address, city, country')
      .is('coordinates', null);

    if (fetchError) throw fetchError;

    console.log(`Found ${restaurants?.length || 0} restaurants without coordinates`);

    const results: { id: string; name: string; success: boolean; coordinates?: { lat: number; lng: number } }[] = [];

    for (const restaurant of restaurants || []) {
      const query = `${restaurant.address}, ${restaurant.city}, ${restaurant.country}`;
      
      try {
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1`;
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          const coordinates = { lat, lng };

          // Update restaurant with coordinates
          const { error: updateError } = await supabase
            .from('restaurants')
            .update({ coordinates })
            .eq('id', restaurant.id);

          if (updateError) {
            console.error(`Error updating ${restaurant.name}:`, updateError);
            results.push({ id: restaurant.id, name: restaurant.name, success: false });
          } else {
            console.log(`✅ Geocoded ${restaurant.name}: ${lat}, ${lng}`);
            results.push({ id: restaurant.id, name: restaurant.name, success: true, coordinates });
          }
        } else {
          console.warn(`⚠️ No results for ${restaurant.name}`);
          results.push({ id: restaurant.id, name: restaurant.name, success: false });
        }

        // Rate limit - wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (err) {
        console.error(`Error geocoding ${restaurant.name}:`, err);
        results.push({ id: restaurant.id, name: restaurant.name, success: false });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(
      JSON.stringify({
        message: `Geocoded ${successCount}/${results.length} restaurants`,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
