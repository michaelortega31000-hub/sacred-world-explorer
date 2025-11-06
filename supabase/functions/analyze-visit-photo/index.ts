import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzeRequest {
  placeId: string;
  photoBase64: string;
}

interface AIAnalysisResponse {
  match: boolean;
  confidence: number;
  identified_elements: string[];
  reason: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { placeId, photoBase64 }: AnalyzeRequest = await req.json();

    if (!placeId || !photoBase64) {
      return new Response(JSON.stringify({ error: 'Paramètres manquants' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch place data
    const { data: place, error: placeError } = await supabase
      .from('places')
      .select('*')
      .eq('id', placeId)
      .single();

    if (placeError || !place) {
      return new Response(JSON.stringify({ error: 'Lieu non trouvé' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create AI prompt for image analysis
    const analysisPrompt = `Tu es un expert en architecture religieuse mondiale. Analyse cette photo et détermine si elle correspond au lieu suivant :

**Lieu attendu :** ${place.name}
**Type :** ${place.type}
**Ville :** ${place.city}
**Pays :** ${place.country}
**Religion :** ${place.religion || 'Non spécifié'}
**Description :** ${place.description || 'Aucune description'}

**Ta mission :**
1. Identifier TOUS les éléments architecturaux visibles dans la photo (au moins 5-10 éléments)
2. Comparer avec les caractéristiques du lieu attendu
3. Évaluer le niveau de correspondance (0-100%)
4. Expliquer ta décision de manière détaillée

**Réponds au format JSON :**
{
  "match": true/false,
  "confidence": 0-100,
  "identified_elements": ["élément 1", "élément 2", "élément 3", ...],
  "reason": "Explication détaillée de ce qui correspond ou non"
}

**Critères d'analyse :**
- Architecture correspond à la description
- Style architectural cohérent
- Éléments caractéristiques visibles (clochers, dômes, portails, etc.)
- Matériaux de construction identifiables
- Photo originale de bonne qualité

**Important :** Sois très descriptif dans identified_elements (minimum 5 éléments).`;

    console.log('Calling Lovable AI for image analysis...');

    // Call Lovable AI with vision model
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: analysisPrompt },
              { 
                type: 'image_url', 
                image_url: { 
                  url: `data:image/jpeg;base64,${photoBase64}` 
                } 
              }
            ]
          }
        ],
        max_tokens: 1000
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      return new Response(JSON.stringify({ 
        error: 'Erreur lors de l\'analyse IA',
        details: errorText 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    console.log('AI response:', JSON.stringify(aiData));

    const aiContent = aiData.choices[0].message.content;
    
    // Extract JSON from AI response
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not extract JSON from AI response:', aiContent);
      return new Response(JSON.stringify({ 
        error: 'Format de réponse IA invalide',
        aiResponse: aiContent
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const analysis: AIAnalysisResponse = JSON.parse(jsonMatch[0]);

    console.log('AI analysis:', analysis);

    // Return analysis without validating the visit
    return new Response(JSON.stringify({
      success: true,
      analysis: {
        match: analysis.match,
        confidence: analysis.confidence,
        identified_elements: analysis.identified_elements,
        reason: analysis.reason
      },
      place: {
        name: place.name,
        type: place.type,
        city: place.city,
        country: place.country
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-visit-photo:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erreur interne' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
