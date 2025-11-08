import { supabase } from '@/integrations/supabase/client';

export interface CaptureOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'png' | 'jpeg' | 'webp';
}

/**
 * Captures the current Canvas content as a high-resolution image
 */
export const captureARScene = async (
  canvas: HTMLCanvasElement,
  options: CaptureOptions = {}
): Promise<Blob> => {
  const {
    width = 1920,
    height = 1920,
    quality = 0.95,
    format = 'png',
  } = options;

  return new Promise((resolve, reject) => {
    // Create temporary canvas for high-res capture
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    // Draw the original canvas scaled to high resolution
    ctx.drawImage(canvas, 0, 0, width, height);

    // Convert to blob
    tempCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      `image/${format}`,
      quality
    );
  });
};

/**
 * Saves the captured image to Supabase Storage with server-side validation
 * Returns a signed URL with 1-hour expiration for secure access
 */
export const saveARCapture = async (
  blob: Blob,
  userId: string,
  placeName: string
): Promise<{ url: string; path: string }> => {
  const timestamp = Date.now();
  const fileName = `${userId}/${placeName}-${timestamp}.png`;

  // Convert blob to file for upload
  const file = new File([blob], 'ar-capture.png', { type: 'image/png' });

  // Use secure server-side upload with validation
  const { secureUpload } = await import('@/lib/secureUpload');
  const uploadResult = await secureUpload({
    bucket: 'ar-captures',
    filePath: fileName,
    file,
    upsert: false,
  });

  if (!uploadResult.success || uploadResult.error) {
    throw new Error(uploadResult.error || 'Failed to upload AR capture');
  }

  return {
    url: uploadResult.url,
    path: uploadResult.path,
  };
};

/**
 * Shares the AR capture using Web Share API or clipboard fallback
 */
export const shareARCapture = async (
  blob: Blob,
  placeName: string,
  placeLocation: string
): Promise<boolean> => {
  const shareData = {
    title: `AR de ${placeName}`,
    text: `Découvrez ${placeName} en AR sur SacredWorld! 📍 ${placeLocation}`,
    files: [
      new File([blob], `${placeName}-ar.png`, {
        type: 'image/png',
      }),
    ],
  };

  // Check if Web Share API is supported and can share files
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  }

  // Fallback: Copy image to clipboard
  try {
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    // Last fallback: Download the image
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${placeName}-ar.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return false;
  }
};

/**
 * Creates a thumbnail from the full-size capture
 */
export const createThumbnail = async (
  blob: Blob,
  maxSize: number = 400
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate new dimensions maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (thumbnailBlob) => {
          URL.revokeObjectURL(url);
          if (thumbnailBlob) {
            resolve(thumbnailBlob);
          } else {
            reject(new Error('Failed to create thumbnail'));
          }
        },
        'image/jpeg',
        0.8
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};
