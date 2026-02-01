// Helper to dynamically import images
const images = import.meta.glob('/src/assets/places/*.{jpg,jpeg,png}', { eager: true, as: 'url' });

export const getImageUrl = (path: string): string => {
  if (!path) return '/placeholder.svg';

  // Normalize a filename (remove diacritics, articles, non-alphanumerics)
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\b(the|el|la|le|al|de|du|des|of)\b[-_\s]*/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

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

// Get all images for easy access
export const getAllPlaceImages = () => images;

// Get image for a place object
export const getPlaceImage = (place: { imageUrl?: string; name?: string }): string => {
  if (place.imageUrl) {
    return getImageUrl(place.imageUrl);
  }
  return '/placeholder.svg';
};
