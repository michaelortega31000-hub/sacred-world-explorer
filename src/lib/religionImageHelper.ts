import { Religion } from '@/contexts/AppContext';
import { mockPlaces } from '@/data/placesData';
import { inferReligionFromPlace } from './religionHelper';
import { getImageUrl } from './imageHelper';
import { normalizeCountryName } from './countryNameMapping';

/**
 * Récupère une liste d'images filtrées par religion
 */
export function getImagesByReligion(religion: Religion | null, count: number = 10): string[] {
  if (!religion) {
    // Si pas de religion, retourner des images variées
    return mockPlaces
      .slice(0, count)
      .map(place => getImageUrl(place.imageUrl || ''))
      .filter(url => url !== '/placeholder.svg');
  }

  // Filtrer les lieux par religion
  const filteredPlaces = mockPlaces.filter(place => {
    const placeReligion = place.religion || inferReligionFromPlace(place.type, place.name);
    return placeReligion === religion;
  });

  // Si pas assez d'images, compléter avec des images neutres
  if (filteredPlaces.length < count) {
    const remaining = count - filteredPlaces.length;
    const neutralPlaces = mockPlaces.slice(0, remaining);
    return [...filteredPlaces, ...neutralPlaces]
      .map(place => getImageUrl(place.imageUrl || ''))
      .filter(url => url !== '/placeholder.svg');
  }

  // Mélanger aléatoirement et prendre le nombre demandé
  return filteredPlaces
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map(place => getImageUrl(place.imageUrl || ''))
    .filter(url => url !== '/placeholder.svg');
}

/**
 * Récupère une image emblématique pour une religion
 */
export function getIconicImageForReligion(religion: Religion | null): string {
  const iconicPlaces: Record<Religion, string> = {
    christianity: '/src/assets/places/vatican.jpg',
    islam: '/src/assets/places/mecca-kaaba.jpg',
    judaism: '/src/assets/places/western-wall.jpg',
    buddhism: '/src/assets/places/angkor-wat.jpg',
    hinduism: '/src/assets/places/golden-temple.jpg',
    astronomy: '/src/assets/places/stonehenge.jpg',
    traditional: '/src/assets/places/uluru.jpg',
    atheism: '/src/assets/places/pantheon-rome.jpg'
  };

  if (!religion) return getImageUrl('/src/assets/places/notre-dame.jpg');
  return getImageUrl(iconicPlaces[religion]);
}

/**
 * Récupère des images de fond pour un pays spécifique
 */
export function getImagesByCountry(country: string | null, count: number = 5): string[] {
  if (!country) {
    return getImagesByReligion(null, count);
  }

  // Normaliser le nom du pays (مصر → Egypt)
  const normalizedCountry = normalizeCountryName(country);
  
  // Filtrer les lieux du pays
  const countryPlaces = mockPlaces.filter(place => 
    place.country.toLowerCase() === normalizedCountry.toLowerCase()
  );

  if (countryPlaces.length === 0) {
    console.warn(`⚠️ Aucune image trouvée pour le pays: "${country}" (normalisé: "${normalizedCountry}")`);
    return getImagesByReligion(null, count);
  }

  // Mélanger et retourner
  return countryPlaces
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, countryPlaces.length))
    .map(place => getImageUrl(place.imageUrl || ''))
    .filter(url => url !== '/placeholder.svg');
}

/**
 * Récupère des images de fond en rotation pour une religion
 */
export function getBackgroundRotationImages(religion: Religion | null): string[] {
  return getImagesByReligion(religion, 5);
}
