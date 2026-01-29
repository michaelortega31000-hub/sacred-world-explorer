import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const STYLE_RULES = `
RÈGLES DE STYLE STRICTES :
- Ton chaleureux, clair et concis.
- Phrases courtes, listes scannables.
- Emojis : maximum 1 emoji par phrase, 4 à 6 emojis par message.
- Emojis autorisés UNIQUEMENT : 🙏 🗺️ 📚 📅 ✨ 🔎
- Termine toujours par une question ou un choix simple.

INTERDIT :
- Ne JAMAIS afficher de pensées internes, raisonnement ou analyse.
- Ne JAMAIS écrire "The user...", "Je pense que...", "Analysons..." ou toute réflexion interne.
- Réponds UNIQUEMENT avec la réponse finale destinée à l'utilisateur.
`;

const HELP_SYSTEM_PROMPT = `Tu es l'assistant de Sacred World, une application mobile de découverte des lieux sacrés du monde entier.

${STYLE_RULES}

Ton rôle est d'aider les utilisateurs à naviguer dans l'app :
- **Explorer** 🗺️ : Carte interactive, filtres par tradition, mode AR
- **Traditions** 📚 : Découverte des différentes traditions spirituelles  
- **Calendrier** 📅 : Événements religieux et spirituels
- **Journal** : Forum communautaire, messages, amis
- **Profil** : Badges, avatars, statistiques

Adapte tes conseils à la page actuelle de l'utilisateur.`;

const HISTORY_SYSTEM_PROMPT = `Tu es un conteur passionné par l'histoire des lieux sacrés du monde.

${STYLE_RULES}

Ton rôle est de raconter des histoires fascinantes sur les temples, cathédrales, mosquées, synagogues et autres lieux spirituels.

Style de narration :
- Captivant et immersif 🙏
- Riche en détails historiques et anecdotes 📚
- Respectueux de toutes les traditions ✨
- Accessible à tous les publics

Si l'utilisateur mentionne un lieu spécifique, concentre-toi sur ce lieu.`;

// Quick replies mapping based on route
const getQuickReplies = (route: string, mode: string): string => {
  if (route.startsWith('/traditions')) {
    return `
<lov-actions>
  <lov-suggestion message="Je veux découvrir une tradition.">📚 Découvrir</lov-suggestion>
  <lov-suggestion message="Propose-moi une tradition au hasard.">🎲 Au hasard</lov-suggestion>
  <lov-suggestion message="Explique-moi comment utiliser Explorer.">🗺️ Aller sur Explorer</lov-suggestion>
  <lov-suggestion message="Donne-moi 3 faits historiques sur une tradition.">📅 3 faits</lov-suggestion>
</lov-actions>`;
  }
  
  if (route.startsWith('/explore')) {
    return `
<lov-actions>
  <lov-suggestion message="Trouve-moi des lieux près de moi.">🔎 Près de moi</lov-suggestion>
  <lov-suggestion message="Aide-moi à filtrer (tradition / distance).">🧭 Filtrer</lov-suggestion>
  <lov-suggestion message="Fais-moi un itinéraire d'1h autour de moi.">✨ Itinéraire 1h</lov-suggestion>
</lov-actions>`;
  }
  
  if (route.startsWith('/place/')) {
    return `
<lov-actions>
  <lov-suggestion message="Donne-moi les dates clés de ce lieu.">📅 Dates clés</lov-suggestion>
  <lov-suggestion message="Raconte-moi une anecdote sur ce lieu.">📜 Anecdote</lov-suggestion>
  <lov-suggestion message="Qu'est-ce qu'il y a à voir autour ?">🗺️ Voir autour</lov-suggestion>
  <lov-suggestion message="Résume ce lieu en 3 faits.">📚 Résumé</lov-suggestion>
</lov-actions>`;
  }
  
  if (route.startsWith('/profile')) {
    return `
<lov-actions>
  <lov-suggestion message="Comment modifier mon profil ?">👤 Modifier</lov-suggestion>
  <lov-suggestion message="Comment choisir un avatar ?">🧿 Avatar</lov-suggestion>
  <lov-suggestion message="Comment gagner des badges ?">🏅 Badges</lov-suggestion>
  <lov-suggestion message="Où sont les réglages ?">⚙️ Réglages</lov-suggestion>
</lov-actions>`;
  }
  
  if (route.startsWith('/calendar')) {
    return `
<lov-actions>
  <lov-suggestion message="Quels événements arrivent bientôt ?">📅 Prochains</lov-suggestion>
  <lov-suggestion message="Comment créer un rappel ?">🔔 Rappel</lov-suggestion>
  <lov-suggestion message="Explique-moi les fêtes de ce mois.">✨ Ce mois</lov-suggestion>
</lov-actions>`;
  }

  if (route.startsWith('/country/')) {
    return `
<lov-actions>
  <lov-suggestion message="Quels sont les lieux sacrés de ce pays ?">🗺️ Lieux sacrés</lov-suggestion>
  <lov-suggestion message="Parle-moi des traditions de ce pays.">📚 Traditions</lov-suggestion>
  <lov-suggestion message="Donne-moi 3 faits historiques.">📅 3 faits</lov-suggestion>
</lov-actions>`;
  }
  
  // Default quick replies
  if (mode === 'history') {
    return `
<lov-actions>
  <lov-suggestion message="Raconte-moi l'histoire d'un lieu célèbre.">📚 Lieu célèbre</lov-suggestion>
  <lov-suggestion message="Donne-moi une anecdote surprenante.">✨ Anecdote</lov-suggestion>
  <lov-suggestion message="Parle-moi d'un lieu méconnu.">🔎 Lieu méconnu</lov-suggestion>
</lov-actions>`;
  }
  
  return `
<lov-actions>
  <lov-suggestion message="Comment explorer la carte ?">🗺️ Explorer</lov-suggestion>
  <lov-suggestion message="Comment fonctionne l'app ?">🔎 Aide</lov-suggestion>
  <lov-suggestion message="Montre-moi les traditions.">📚 Traditions</lov-suggestion>
</lov-actions>`;
};

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
    let assistantMessage = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse. 🙏";

    // Add quick replies based on current route
    const quickReplies = getQuickReplies(currentRoute || '', mode);
    assistantMessage = assistantMessage + '\n\n' + quickReplies;

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
