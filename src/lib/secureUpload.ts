import { supabase } from '@/integrations/supabase/client';

export interface UploadOptions {
  bucket: 'avatars' | 'memory-photos' | 'ar-captures' | 'visit-photos';
  filePath: string;
  file: File;
  upsert?: boolean;
}

export interface UploadResult {
  success: boolean;
  path: string;
  url: string;
  size: number;
  type: string;
  error?: string;
}

/**
 * Securely uploads a file using the server-side validation edge function
 * This ensures file size and type validation is enforced server-side
 * and cannot be bypassed by modifying client code
 */
export async function secureUpload(options: UploadOptions): Promise<UploadResult> {
  const { bucket, filePath, file, upsert = false } = options;

  try {
    // Get current session for auth token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Authentication required');
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    formData.append('filePath', filePath);
    formData.append('upsert', upsert.toString());

    // Call the edge function with proper auth
    const { data, error } = await supabase.functions.invoke('upload-file', {
      body: formData,
    });

    if (error) {
      // Parse error message for better user feedback
      const errorMessage = error.message || 'Erreur lors de l\'upload';
      
      // Check for specific error codes
      if (errorMessage.includes('413') || errorMessage.includes('trop volumineux')) {
        throw new Error('Fichier trop volumineux');
      }
      if (errorMessage.includes('400') || errorMessage.includes('non autorisé')) {
        throw new Error('Type de fichier non autorisé');
      }
      if (errorMessage.includes('403') || errorMessage.includes('Unauthorized')) {
        throw new Error('Accès non autorisé');
      }
      
      throw new Error(errorMessage);
    }

    if (!data.success) {
      throw new Error(data.error || 'Upload failed');
    }

    return data as UploadResult;

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[SecureUpload] Error:', errorMessage);
    
    return {
      success: false,
      path: '',
      url: '',
      size: 0,
      type: '',
      error: errorMessage,
    };
  }
}

/**
 * Client-side file validation (for UX only, not security)
 * Server-side validation is still required and enforced
 */
export function validateFileClientSide(
  file: File,
  maxSizeMB: number,
  allowedTypes: string[]
): { valid: boolean; error?: string } {
  // Check file size
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Taille maximale : ${maxSizeMB}MB`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    const allowedExtensions = allowedTypes.map(t => t.split('/')[1]).join(', ');
    return {
      valid: false,
      error: `Type de fichier non autorisé. Types acceptés : ${allowedExtensions}`,
    };
  }

  return { valid: true };
}
