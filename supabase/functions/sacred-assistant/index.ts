import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const HELP_SYSTEM_PROMPT = `Tu es l'assistant de Sacred World, une application mobile de découverte des lieux sacrés du monde entier.

Ton rôle est d'aider les utilisateurs à naviguer dans l'app et à utiliser ses fonctionnalités :
- **Explorer** : Carte interactive avec les lieux sacrés, filtres par religion, mode AR
- **Traditions** : Découverte des différentes traditions spirituelles
- **Calendrier** : Événements religieux et spirituels à venir
- **Journal** : Forum communautaire, messages, amis
- **Profil** : Badges, avatars, statistiques, paramètres

Réponds de manière concise, amicale et utile. Si l'utilisateur est sur une page spécifique, adapte tes conseils à cette page.`;

const HISTORY_SYSTEM_PROMPT = `Tu es un conteur passionné par l'histoire des lieux sacrés du monde.

Ton rôle est de raconter des histoires fascinantes sur les temples, cathédrales, mosquées, synagogues et autres lieux spirituels.

Style de narration :
- Captivant et immersif
- Riche en détails historiques et anecdotes
- Respectueux de toutes les traditions
- Accessible à tous les publics

Si l'utilisateur mentionne un lieu spécifique (via placeId ou dans sa question), concentre-toi sur ce lieu. Sinon, propose des histoires sur des lieux emblématiques.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, mode, currentRoute, selectedPlaceId } = await req.json();

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!mode || !['help', 'history'].includes(mode)) {
      return new Response(
        JSON.stringify({ error: 'Invalid mode. Use "help" or "history"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build context message
    let contextInfo = '';
    if (currentRoute) {
      contextInfo += `L'utilisateur est actuellement sur la page: ${currentRoute}. `;
    }
    if (selectedPlaceId) {
      contextInfo += `Il regarde le lieu avec l'ID: ${selectedPlaceId}. `;
    }

    const systemPrompt = mode === 'help' ? HELP_SYSTEM_PROMPT : HISTORY_SYSTEM_PROMPT;
    const fullSystemPrompt = contextInfo 
      ? `${systemPrompt}\n\nContexte actuel: ${contextInfo}`
      : systemPrompt;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: fullSystemPrompt },
          { role: "user", content: message.trim() },
        ],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de requêtes, veuillez réessayer dans un moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporairement indisponible." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erreur du service IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse.";

    return new Response(
      JSON.stringify({ response: assistantMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("sacred-assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
