import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// File size limits per bucket (in bytes)
const BUCKET_LIMITS: Record<string, number> = {
  'avatars': 5 * 1024 * 1024,        // 5MB for avatars
  'memory-photos': 10 * 1024 * 1024, // 10MB for memory photos
  'ar-captures': 5 * 1024 * 1024,    // 5MB for AR captures
  'visit-photos': 5 * 1024 * 1024,   // 5MB for visit photos
};

// Allowed MIME types per bucket
const ALLOWED_TYPES: Record<string, string[]> = {
  'avatars': ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  'memory-photos': ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  'ar-captures': ['image/png'],
  'visit-photos': ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

// Magic number validation for common image formats
const MAGIC_NUMBERS: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF
};

/**
 * Validates file signature by checking magic numbers
 */
async function validateFileSignature(file: Uint8Array, mimeType: string): Promise<boolean> {
  const signatures = MAGIC_NUMBERS[mimeType];
  if (!signatures) return true; // Skip validation for unknown types

  for (const signature of signatures) {
    let matches = true;
    for (let i = 0; i < signature.length; i++) {
      if (file[i] !== signature[i]) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  return false;
}

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

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;
    const filePath = formData.get('filePath') as string;
    const upsert = formData.get('upsert') === 'true';

    // Validate required fields
    if (!file || !bucket || !filePath) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: file, bucket, filePath' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if bucket is allowed
    if (!BUCKET_LIMITS[bucket]) {
      return new Response(
        JSON.stringify({ error: `Invalid bucket: ${bucket}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file size (server-side enforcement)
    const maxSize = BUCKET_LIMITS[bucket];
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      console.log(`[Upload] File too large for user ${user.id}: ${file.size} bytes (max: ${maxSize})`);
      return new Response(
        JSON.stringify({ 
          error: `Fichier trop volumineux. Taille maximale : ${maxSizeMB}MB`,
          maxSize: maxSize,
          actualSize: file.size
        }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file type
    const allowedTypes = ALLOWED_TYPES[bucket];
    if (!allowedTypes.includes(file.type)) {
      console.log(`[Upload] Invalid file type for user ${user.id}: ${file.type}`);
      return new Response(
        JSON.stringify({ 
          error: `Type de fichier non autorisé: ${file.type}`,
          allowedTypes
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file signature (magic numbers)
    const fileBuffer = new Uint8Array(await file.arrayBuffer());
    const isValidSignature = await validateFileSignature(fileBuffer, file.type);
    
    if (!isValidSignature) {
      console.log(`[Upload] Invalid file signature for user ${user.id}: ${file.type}`);
      return new Response(
        JSON.stringify({ error: 'Fichier invalide ou corrompu' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify file path starts with user ID (security check)
    if (!filePath.startsWith(`${user.id}/`)) {
      console.log(`[Upload] Security violation: user ${user.id} attempted to upload to ${filePath}`);
      return new Response(
        JSON.stringify({ error: 'Unauthorized file path' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upload file to storage
    const { data, error: uploadError } = await supabaseClient.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error(`[Upload] Storage error for user ${user.id}:`, uploadError);
      return new Response(
        JSON.stringify({ error: `Erreur lors de l'upload: ${uploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Upload] File uploaded successfully by user ${user.id}: ${bucket}/${filePath}`);

    // Get the URL based on bucket type
    let fileUrl: string;
    
    if (bucket === 'ar-captures' || bucket === 'memory-photos') {
      // Private buckets - use signed URL
      const { data: signedUrlData, error: signedUrlError } = await supabaseClient.storage
        .from(bucket)
        .createSignedUrl(data.path, 3600); // 1 hour expiry

      if (signedUrlError) {
        console.error(`[Upload] Signed URL error:`, signedUrlError);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de la génération de l\'URL' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      fileUrl = signedUrlData.signedUrl;
    } else {
      // Public buckets - use public URL
      const { data: { publicUrl } } = supabaseClient.storage
        .from(bucket)
        .getPublicUrl(data.path);
      fileUrl = publicUrl;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        path: data.path,
        url: fileUrl,
        size: file.size,
        type: file.type
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Upload] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
