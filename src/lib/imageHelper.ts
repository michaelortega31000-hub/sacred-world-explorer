// Helper to dynamically import images
const images = import.meta.glob('/src/assets/places/*.{jpg,jpeg,png}', { eager: true, as: 'url' });

// Normalize a filename (remove diacritics, articles, non-alphanumerics)
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\b(the|el|la|le|al|de|du|des|of)\b[-_\s]*/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getImageUrl = (path: string): string => {
  if (!path) return '/placeholder.svg';

  const isAssetPath = path.startsWith('/src/assets');
  const filename = path.split('/').pop() || '';

  // 1) Direct key match
  if (isAssetPath && images[path]) return images[path] as string;

  // 2) Match by exact filename suffix
  const bySuffix = Object.entries(images).find(([p]) => p.endsWith(filename));
  if (bySuffix) return bySuffix[1] as string;

  // 3) Fuzzy match using normalized filenames (handles el-escorial vs escorial, accents, etc.)
  const target = normalize(filename || path);
  const fuzzy = Object.entries(images).find(([p]) => normalize(p.split('/').pop() || '') === target);
  if (fuzzy) return fuzzy[1] as string;

  console.warn(`Image not found, using placeholder: ${path}`);
  return '/placeholder.svg';
};

/**
 * Resolve image URL with automatic fallback:
 * 1. If imageUrl exists and is a valid URL, use it
 * 2. Try to match a local image by normalized name
 * 3. Fall back to placeholder
 */
export const resolveImageWithFallback = (imageUrl: string | null | undefined, placeName: string): string => {
  // If we have a valid URL from database, use it
  if (imageUrl) {
    // If it's already a full URL (https://...), return as-is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // If it's a local path, try to resolve it
    const resolved = getImageUrl(imageUrl);
    if (resolved !== '/placeholder.svg') {
      return resolved;
    }
  }

  // Try to find a local image by place name
  const normalizedName = normalize(placeName);
  
  // Search for matching image in local assets
  const match = Object.entries(images).find(([path]) => {
    const filename = path.split('/').pop() || '';
    const normalizedFilename = normalize(filename.replace(/\.(jpg|jpeg|png)$/i, ''));
    return normalizedFilename.includes(normalizedName) || normalizedName.includes(normalizedFilename);
  });

  if (match) {
    return match[1] as string;
  }

  // Default to placeholder
  return '/placeholder.svg';
};

// Get all images for easy access
export const getAllPlaceImages = () => images;
