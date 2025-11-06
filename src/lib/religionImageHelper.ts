import { Religion } from '@/contexts/AppContext';
import { mockPlaces } from '@/data/placesData';
import { inferReligionFromPlace } from './religionHelper';
import { getImageUrl } from './imageHelper';

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
 * Récupère des images de fond en rotation pour une religion
 */
export function getBackgroundRotationImages(religion: Religion | null): string[] {
  return getImagesByReligion(religion, 5);
}

/**
 * Récupère les images des onglets adaptées à la religion
 */
export function getTabImagesForReligion(religion: Religion | null): {
  map: string;
  nearby: string;
  locations: string;
  challenges: string;
  rankings: string;
} {
  // Images par défaut (sans religion spécifique)
  const defaultImages = {
    map: '/src/assets/tabs/map-bg.jpg',
    nearby: '/src/assets/tabs/nearby-bg.jpg',
    locations: '/src/assets/tabs/locations-bg.jpg',
    challenges: '/src/assets/tabs/challenges-bg.jpg',
    rankings: '/src/assets/tabs/rankings-bg.jpg'
  };

  if (!religion) return defaultImages;

  // Sélectionner des images emblématiques selon la religion
  const religionSpecificImages: Record<Religion, {
    map: string;
    nearby: string;
    locations: string;
    challenges: string;
    rankings: string;
  }> = {
    christianity: {
      map: getImageUrl('/src/assets/places/vatican.jpg'),
      nearby: getImageUrl('/src/assets/places/notre-dame.jpg'),
      locations: getImageUrl('/src/assets/places/sagrada-familia.jpg'),
      challenges: getImageUrl('/src/assets/places/santiago-compostela.jpg'),
      rankings: getImageUrl('/src/assets/places/st-patricks-nyc.jpg')
    },
    islam: {
      map: getImageUrl('/src/assets/places/mecca-kaaba.jpg'),
      nearby: getImageUrl('/src/assets/places/blue-mosque.jpg'),
      locations: getImageUrl('/src/assets/places/hassan-ii-mosque.jpg'),
      challenges: getImageUrl('/src/assets/places/al-azhar-cairo.jpg'),
      rankings: getImageUrl('/src/assets/places/dome-of-rock.jpg')
    },
    judaism: {
      map: getImageUrl('/src/assets/places/western-wall.jpg'),
      nearby: getImageUrl('/src/assets/places/old-new-synagogue.jpg'),
      locations: getImageUrl('/src/assets/places/amsterdam-synagogue.jpg'),
      challenges: getImageUrl('/src/assets/places/budapest-synagogue.jpg'),
      rankings: getImageUrl('/src/assets/places/touro-synagogue.jpg')
    },
    buddhism: {
      map: getImageUrl('/src/assets/places/angkor-wat.jpg'),
      nearby: getImageUrl('/src/assets/places/borobudur.jpg'),
      locations: getImageUrl('/src/assets/places/boudhanath-stupa.jpg'),
      challenges: getImageUrl('/src/assets/places/shwedagon-pagoda.jpg'),
      rankings: getImageUrl('/src/assets/places/potala-palace.jpg')
    },
    hinduism: {
      map: getImageUrl('/src/assets/places/golden-temple.jpg'),
      nearby: getImageUrl('/src/assets/places/taj-mahal.jpg'),
      locations: getImageUrl('/src/assets/places/meenakshi-temple.jpg'),
      challenges: getImageUrl('/src/assets/places/pashupatinath.jpg'),
      rankings: getImageUrl('/src/assets/places/akshardham.jpg')
    },
    astronomy: {
      map: getImageUrl('/src/assets/places/stonehenge.jpg'),
      nearby: getImageUrl('/src/assets/places/chichen-itza.jpg'),
      locations: getImageUrl('/src/assets/places/teotihuacan.jpg'),
      challenges: getImageUrl('/src/assets/places/machu-picchu.jpg'),
      rankings: getImageUrl('/src/assets/places/pyramids-giza.jpg')
    },
    traditional: {
      map: getImageUrl('/src/assets/places/uluru.jpg'),
      nearby: getImageUrl('/src/assets/places/sanctuary-of-truth.jpg'),
      locations: getImageUrl('/src/assets/places/mount-fuji.jpg'),
      challenges: getImageUrl('/src/assets/places/fushimi-inari.jpg'),
      rankings: getImageUrl('/src/assets/places/itsukushima.jpg')
    },
    atheism: {
      map: getImageUrl('/src/assets/places/pantheon-rome.jpg'),
      nearby: getImageUrl('/src/assets/places/parthenon.jpg'),
      locations: getImageUrl('/src/assets/places/delphi.jpg'),
      challenges: getImageUrl('/src/assets/places/ephesus-artemis.jpg'),
      rankings: getImageUrl('/src/assets/places/karnak-temple.jpg')
    }
  };

  return religionSpecificImages[religion] || defaultImages;
}
