import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreatePostRequest {
  topicId: string;
  content: string;
  imageUrls?: string[];
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
    const body: CreatePostRequest = await req.json();
    const { topicId, content, imageUrls } = body;

    // Validate topic ID
    if (!topicId || typeof topicId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Topic ID invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate content
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Le message est requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (content.trim().length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Le message ne peut pas dépasser 5000 caractères' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (noHtmlRegex.test(content)) {
      return new Response(
        JSON.stringify({ error: 'Les balises HTML ne sont pas autorisées' }),
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
      // Validate each URL is a valid path
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

    // Verify topic exists
    const { data: topic, error: topicError } = await supabaseClient
      .from('forum_topics')
      .select('id')
      .eq('id', topicId)
      .single();

    if (topicError || !topic) {
      return new Response(
        JSON.stringify({ error: 'Topic non trouvé' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit: 50 posts per day (server-side enforcement)
    const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    const { data: rateLimitData } = await supabaseClient
      .from('rate_limits')
      .select('count, window_start')
      .eq('user_id', user.id)
      .eq('action', 'forum_post')
      .gte('window_start', windowStart.toISOString())
      .maybeSingle();

    const currentCount = rateLimitData?.count || 0;

    if (currentCount >= 50) {
      console.log(`[Forum] Rate limit exceeded for user ${user.id}: ${currentCount}/50 posts`);
      return new Response(
        JSON.stringify({ error: 'Limite atteinte : 50 messages maximum par jour' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create the post
    const { data: post, error: insertError } = await supabaseClient
      .from('forum_posts')
      .insert({
        topic_id: topicId,
        content: content.trim(),
        author_id: user.id,
        image_urls: validatedImageUrls,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Forum] Error creating post:', insertError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'envoi du message' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update rate limit
    const newCount = currentCount + 1;
    await supabaseClient
      .from('rate_limits')
      .upsert({
        user_id: user.id,
        action: 'forum_post',
        count: newCount,
        window_start: rateLimitData?.window_start || new Date().toISOString(),
      }, {
        onConflict: 'user_id,action'
      });

    console.log(`[Forum] Post created by user ${user.id} in topic ${topicId}: ${post.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        post,
        remaining: 50 - newCount 
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
