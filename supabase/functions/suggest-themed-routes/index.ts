import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, religion, availablePlaces, maxPlaces = 10 } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create a detailed prompt for the AI
    const systemPrompt = `Tu es un expert en voyages culturels et spirituels, spécialisé dans la création d'itinéraires thématiques pour découvrir des lieux sacrés à travers le monde.

Ta mission est de suggérer 3 itinéraires thématiques pertinents et cohérents basés sur la demande de l'utilisateur. Chaque itinéraire doit avoir :
- Un titre accrocheur et descriptif
- Une description inspirante qui explique l'intérêt du parcours
- Une liste de lieux recommandés (parmi ceux disponibles) dans un ordre logique
- Une durée estimée
- Un niveau de difficulté

Important : 
- Ne suggérer QUE des lieux qui existent dans la liste fournie
- Maximum ${maxPlaces} lieux par itinéraire
- Privilégier la cohérence géographique et thématique
- Varier les difficultés et durées entre les 3 suggestions`;

    const userPrompt = `Thème demandé : ${theme}
${religion ? `Religion spécifique : ${religion}` : ''}

Lieux disponibles :
${JSON.stringify(availablePlaces.map((p: any) => ({
  id: p.id,
  name: p.name,
  city: p.city,
  country: p.country,
  type: p.type,
  religion: p.religion,
  description: p.description.substring(0, 150)
})), null, 2)}

Génère 3 suggestions d'itinéraires thématiques différents.`;

    const body: any = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "suggest_routes",
            description: "Suggère 3 itinéraires thématiques",
            parameters: {
              type: "object",
              properties: {
                routes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { 
                        type: "string",
                        description: "Titre accrocheur de l'itinéraire"
                      },
                      description: { 
                        type: "string",
                        description: "Description inspirante de l'itinéraire (2-3 phrases)"
                      },
                      placeIds: { 
                        type: "array",
                        items: { type: "string" },
                        description: "Liste des IDs des lieux dans l'ordre de visite"
                      },
                      estimatedDays: { 
                        type: "integer",
                        description: "Durée estimée en jours"
                      },
                      difficulty: { 
                        type: "string",
                        enum: ["facile", "modéré", "difficile"],
                        description: "Niveau de difficulté du voyage"
                      },
                      highlights: {
                        type: "array",
                        items: { type: "string" },
                        description: "3-5 points forts de cet itinéraire"
                      }
                    },
                    required: ["title", "description", "placeIds", "estimatedDays", "difficulty", "highlights"],
                    additionalProperties: false
                  },
                  minItems: 3,
                  maxItems: 3
                }
              },
              required: ["routes"],
              additionalProperties: false
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "suggest_routes" } }
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes dépassée, veuillez réessayer plus tard." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Paiement requis, veuillez ajouter des crédits à votre espace Lovable AI." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erreur de l'API AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      throw new Error("No structured response from AI");
    }

    const suggestions = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(suggestions),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in suggest-themed-routes:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
