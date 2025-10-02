// Helper to dynamically import images
const images = import.meta.glob('/src/assets/places/*.{jpg,jpeg,png}', { eager: true, as: 'url' });

export const getImageUrl = (path: string): string => {
  // If path already starts with /, use it as is
  if (!path.startsWith('/src/assets')) {
    return path;
  }
  
  // Get the image from the glob
  const image = images[path];
  
  if (!image) {
    console.warn(`Image not found: ${path}`);
    return '/placeholder.svg'; // fallback
  }
  
  return image as string;
};

// Get all images for easy access
export const getAllPlaceImages = () => images;
