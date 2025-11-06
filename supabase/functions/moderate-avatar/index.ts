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
    const { imageBase64, fileName } = await req.json();
    
    if (!imageBase64 || !fileName) {
      return new Response(
        JSON.stringify({ error: 'Image data and filename are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Starting avatar moderation for:', fileName);

    // Analyze image with Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a content moderation AI. Analyze images for inappropriate content including:
- Nudity or sexually explicit content
- Violence, gore, or graphic imagery
- Hate symbols or extremist content
- Weapons or dangerous items
- Illegal activities
- Harassment or bullying imagery

Respond ONLY with a JSON object in this exact format:
{
  "approved": true/false,
  "reason": "Brief explanation if rejected, empty string if approved"
}

Be strict but fair. Profile pictures should be appropriate for all ages.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this avatar image for inappropriate content.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('AI Response received:', JSON.stringify(aiResponse));

    let moderationResult;
    try {
      const content = aiResponse.choices[0].message.content;
      console.log('AI Content:', content);
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      moderationResult = JSON.parse(jsonMatch[0]);
      
      if (typeof moderationResult.approved !== 'boolean') {
        throw new Error('Invalid moderation result format');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Default to rejection on parsing error for safety
      moderationResult = {
        approved: false,
        reason: 'Unable to analyze image. Please try another image.'
      };
    }

    console.log('Moderation result:', moderationResult);

    return new Response(
      JSON.stringify({
        approved: moderationResult.approved,
        reason: moderationResult.reason || ''
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in moderate-avatar function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        approved: false,
        reason: 'Moderation system error. Please try again.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
