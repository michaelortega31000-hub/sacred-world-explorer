import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyVisitRequest {
  placeId: string;
  userLat: number;
  userLon: number;
  photoBase64: string;
}

interface AIAnalysisResponse {
  match: boolean;
  confidence: number;
  identified_elements: string[];
  reason: string;
}

// Haversine distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
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

    const { placeId, userLat, userLon, photoBase64 }: VerifyVisitRequest = await req.json();

    if (!placeId || !userLat || !userLon || !photoBase64) {
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

    // Calculate distance
    const coordinates = place.coordinates as { lat: number; lon: number };
    const distance = calculateDistance(userLat, userLon, coordinates.lat, coordinates.lon);

    if (distance > 500) {
      return new Response(JSON.stringify({ 
        error: 'Vous devez être à moins de 500m du lieu',
        distance: Math.round(distance)
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create AI prompt for image analysis
    const validationPrompt = `Tu es un expert en architecture religieuse mondiale. Analyse cette photo et détermine si elle correspond au lieu suivant :

**Lieu attendu :** ${place.name}
**Type :** ${place.type}
**Ville :** ${place.city}
**Pays :** ${place.country}
**Religion :** ${place.religion || 'Non spécifié'}
**Description :** ${place.description || 'Aucune description'}

**Ta mission :**
1. Identifier les éléments architecturaux visibles dans la photo
2. Comparer avec les caractéristiques du lieu attendu
3. Évaluer le niveau de correspondance (0-100%)
4. Expliquer ta décision

**Réponds au format JSON :**
{
  "match": true/false,
  "confidence": 0-100,
  "identified_elements": ["élément 1", "élément 2", ...],
  "reason": "Explication détaillée"
}

**Critères d'acceptation :**
- Architecture correspond à la description
- Style architectural cohérent
- Éléments caractéristiques visibles
- Photo originale (pas de capture d'écran ou photo d'internet)`;

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
              { type: 'text', text: validationPrompt },
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

    // If confidence is high enough, validate the visit
    if (analysis.match && analysis.confidence >= 70) {
      // Upload photo to storage
      const photoFileName = `${user.id}/${placeId}/${Date.now()}.jpg`;
      const photoBuffer = Uint8Array.from(atob(photoBase64), c => c.charCodeAt(0));
      
      const { error: uploadError } = await supabase.storage
        .from('visit-photos')
        .upload(photoFileName, photoBuffer, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('visit-photos')
        .getPublicUrl(photoFileName);

      // Save visit photo record
      const { error: photoError } = await supabase
        .from('visit_photos')
        .insert({
          user_id: user.id,
          place_id: placeId,
          photo_url: publicUrl,
          ai_confidence: analysis.confidence,
          ai_analysis: analysis.reason,
          identified_elements: analysis.identified_elements,
          geolocation: { lat: userLat, lon: userLon },
          is_public: false
        });

      if (photoError) {
        console.error('Error saving photo record:', photoError);
      }

      // Award points and update user progress
      const pointsEarned = place.points_value || 50;
      
      const { data: userProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (userProgress) {
        const visitedPlaces = userProgress.visited_places || [];
        if (!visitedPlaces.includes(placeId)) {
          await supabase
            .from('user_progress')
            .update({
              total_points: (userProgress.total_points || 0) + pointsEarned,
              visited_places: [...visitedPlaces, placeId]
            })
            .eq('user_id', user.id);
        }
      }

      // Save visit history
      await supabase
        .from('visit_history')
        .insert({
          user_id: user.id,
          place_id: placeId,
          points_earned: pointsEarned,
          gps_location: { lat: userLat, lon: userLon },
        });

      return new Response(JSON.stringify({
        success: true,
        match: true,
        confidence: analysis.confidence,
        reason: analysis.reason,
        pointsEarned,
        photoUrl: publicUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Visit not validated
    return new Response(JSON.stringify({
      success: false,
      match: analysis.match,
      confidence: analysis.confidence,
      reason: analysis.reason,
      identified_elements: analysis.identified_elements
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in verify-visit-with-photo:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erreur interne' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});