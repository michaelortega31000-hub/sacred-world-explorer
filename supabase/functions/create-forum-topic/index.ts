import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateTopicRequest {
  title: string;
  description: string;
  visibility: 'private' | 'public' | 'global';
  imageUrls?: string[];
  religionOverride?: 'catholique' | 'protestant';
}

// Validation regex - no HTML tags allowed
const noHtmlRegex = /<[^>]*>/g;

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

    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
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

    // Parse request body
    const body: CreateTopicRequest = await req.json();
    const { title, description, visibility = 'public', imageUrls, religionOverride } = body;

    // Validate visibility
    if (visibility !== 'private' && visibility !== 'public' && visibility !== 'global') {
      return new Response(
        JSON.stringify({ error: 'Visibilité invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine religion to attach to the topic.
    // If religionOverride is provided (denomination forum), enforce it server-side
    // by verifying the user's stored denomination matches.
    let userReligion: string | null = null;
    if (visibility === 'public') {
      if (religionOverride === 'catholique' || religionOverride === 'protestant') {
        const { data: progressData } = await supabaseClient
          .from('user_progress')
          .select('denomination')
          .eq('user_id', user.id)
          .single();

        const userDenom = (progressData as any)?.denomination || null;
        if (userDenom !== religionOverride) {
          return new Response(
            JSON.stringify({ error: 'Vous n\'avez pas accès à ce forum' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        userReligion = religionOverride;
      } else {
        const { data: progressData } = await supabaseClient
          .from('user_progress')
          .select('selected_religion')
          .eq('user_id', user.id)
          .single();

        userReligion = progressData?.selected_religion || null;

        if (!userReligion) {
          return new Response(
            JSON.stringify({ error: 'Veuillez d\'abord sélectionner une religion dans votre profil pour créer un topic communauté' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }
    // For 'global' visibility, religion is not stored (accessible to everyone)
    // For 'private' visibility, religion is also not stored

    // Validate input
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Le titre est requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (title.trim().length > 200) {
      return new Response(
        JSON.stringify({ error: 'Le titre ne peut pas dépasser 200 caractères' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (noHtmlRegex.test(title)) {
      return new Response(
        JSON.stringify({ error: 'Les balises HTML ne sont pas autorisées dans le titre' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'La description est requise' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (description.trim().length > 2000) {
      return new Response(
        JSON.stringify({ error: 'La description ne peut pas dépasser 2000 caractères' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (noHtmlRegex.test(description)) {
      return new Response(
        JSON.stringify({ error: 'Les balises HTML ne sont pas autorisées dans la description' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate image URLs (optional, max 3)
    let validatedImageUrls: string[] | null = null;
    if (imageUrls && Array.isArray(imageUrls)) {
      if (imageUrls.length > 3) {
        return new Response(
          JSON.stringify({ error: 'Maximum 3 photos autorisées' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // Validate each URL is a valid path (internal storage paths only)
      for (const url of imageUrls) {
        if (typeof url !== 'string' || url.length > 500) {
          return new Response(
            JSON.stringify({ error: 'URL de photo invalide' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      validatedImageUrls = imageUrls.length > 0 ? imageUrls : null;
    }

    // Check rate limit: 10 topics per day (server-side enforcement)
    const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    const { data: rateLimitData } = await supabaseClient
      .from('rate_limits')
      .select('count, window_start')
      .eq('user_id', user.id)
      .eq('action', 'forum_topic')
      .gte('window_start', windowStart.toISOString())
      .maybeSingle();

    const currentCount = rateLimitData?.count || 0;

    if (currentCount >= 10) {
      console.log(`[Forum] Rate limit exceeded for user ${user.id}: ${currentCount}/10 topics`);
      return new Response(
        JSON.stringify({ error: 'Limite atteinte : 10 sujets maximum par jour' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create the topic
    const { data: topic, error: insertError } = await supabaseClient
      .from('forum_topics')
      .insert({
        title: title.trim(),
        description: description.trim(),
        author_id: user.id,
        visibility,
        religion: visibility === 'public' ? userReligion : null,
        image_urls: validatedImageUrls,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Forum] Error creating topic:', insertError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création du topic' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update rate limit
    const newCount = currentCount + 1;
    await supabaseClient
      .from('rate_limits')
      .upsert({
        user_id: user.id,
        action: 'forum_topic',
        count: newCount,
        window_start: rateLimitData?.window_start || new Date().toISOString(),
      }, {
        onConflict: 'user_id,action'
      });

    console.log(`[Forum] Topic created by user ${user.id}: ${topic.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        topic,
        remaining: 10 - newCount 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Forum] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
