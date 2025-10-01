import { Place } from '@/contexts/AppContext';

// Mock data for sacred places around the world
export const mockPlaces: Place[] = [
  // France
  {
    id: 'fra-1',
    name: 'Notre-Dame de Paris',
    country: 'France',
    type: 'Cathédrale',
    description: 'Cathédrale gothique emblématique au cœur de Paris',
    points: 50,
    coordinates: [2.3499, 48.8530]
  },
  {
    id: 'fra-2',
    name: 'Lourdes',
    country: 'France',
    type: 'Sanctuaire',
    description: 'Lieu de pèlerinage marial célèbre',
    points: 75,
    coordinates: [-0.0458, 43.0951]
  },
  {
    id: 'fra-3',
    name: 'Mont Saint-Michel',
    country: 'France',
    type: 'Abbaye',
    description: 'Abbaye médiévale spectaculaire sur un îlot rocheux',
    points: 80,
    coordinates: [-1.5114, 48.6361]
  },
  // Italy
  {
    id: 'ita-1',
    name: 'Vatican - Basilique Saint-Pierre',
    country: 'Italy',
    type: 'Basilique',
    description: 'Centre du catholicisme mondial',
    points: 100,
    coordinates: [12.4534, 41.9022]
  },
  {
    id: 'ita-2',
    name: 'Cathédrale de Milan',
    country: 'Italy',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre gothique italien',
    points: 60,
    coordinates: [9.1917, 45.4642]
  },
  {
    id: 'ita-3',
    name: 'Basilique Saint-François d\'Assise',
    country: 'Italy',
    type: 'Basilique',
    description: 'Lieu de pèlerinage franciscain',
    points: 70,
    coordinates: [12.6056, 43.0753]
  },
  // Spain
  {
    id: 'esp-1',
    name: 'Sagrada Família',
    country: 'Spain',
    type: 'Basilique',
    description: 'Basilique moderniste de Gaudí à Barcelone',
    points: 90,
    coordinates: [2.1744, 41.4036]
  },
  {
    id: 'esp-2',
    name: 'Cathédrale de Saint-Jacques-de-Compostelle',
    country: 'Spain',
    type: 'Cathédrale',
    description: 'Destination finale du Chemin de Saint-Jacques',
    points: 85,
    coordinates: [-8.5448, 42.8805]
  },
  {
    id: 'esp-3',
    name: 'Mosquée-Cathédrale de Cordoue',
    country: 'Spain',
    type: 'Monument',
    description: 'Exemple unique d\'architecture mauresque et chrétienne',
    points: 95,
    coordinates: [-4.7794, 37.8789]
  },
  // Israel
  {
    id: 'isr-1',
    name: 'Mur des Lamentations',
    country: 'Israel',
    type: 'Site sacré',
    description: 'Lieu de prière le plus sacré du judaïsme',
    points: 100,
    coordinates: [35.2345, 31.7767]
  },
  {
    id: 'isr-2',
    name: 'Basilique du Saint-Sépulcre',
    country: 'Israel',
    type: 'Basilique',
    description: 'Lieu traditionnel de la crucifixion et résurrection du Christ',
    points: 100,
    coordinates: [35.2294, 31.7784]
  },
  {
    id: 'isr-3',
    name: 'Dôme du Rocher',
    country: 'Israel',
    type: 'Mosquée',
    description: 'Monument emblématique de Jérusalem',
    points: 100,
    coordinates: [35.2352, 31.7780]
  },
  // Saudi Arabia
  {
    id: 'sau-1',
    name: 'La Mecque - Masjid al-Haram',
    country: 'Saudi Arabia',
    type: 'Mosquée',
    description: 'Lieu le plus sacré de l\'Islam',
    points: 150,
    coordinates: [39.8262, 21.4225]
  },
  {
    id: 'sau-2',
    name: 'Médine - Mosquée du Prophète',
    country: 'Saudi Arabia',
    type: 'Mosquée',
    description: 'Deuxième lieu saint de l\'Islam',
    points: 120,
    coordinates: [39.6111, 24.4672]
  },
  // India
  {
    id: 'ind-1',
    name: 'Taj Mahal',
    country: 'India',
    type: 'Mausolée',
    description: 'Monument funéraire emblématique',
    points: 100,
    coordinates: [78.0421, 27.1751]
  },
  {
    id: 'ind-2',
    name: 'Temple d\'Or d\'Amritsar',
    country: 'India',
    type: 'Temple',
    description: 'Lieu le plus sacré du sikhisme',
    points: 90,
    coordinates: [74.8765, 31.6200]
  },
  {
    id: 'ind-3',
    name: 'Varanasi - Ghats du Gange',
    country: 'India',
    type: 'Site sacré',
    description: 'Ville sainte de l\'hindouisme',
    points: 110,
    coordinates: [83.0047, 25.3176]
  },
  // Nepal
  {
    id: 'nep-1',
    name: 'Lumbini',
    country: 'Nepal',
    type: 'Site sacré',
    description: 'Lieu de naissance du Bouddha',
    points: 120,
    coordinates: [83.2760, 27.4833]
  },
  // Tibet
  {
    id: 'tib-1',
    name: 'Palais du Potala',
    country: 'Tibet',
    type: 'Palais',
    description: 'Ancien palais du Dalaï Lama à Lhassa',
    points: 110,
    coordinates: [91.1170, 29.6558]
  },
  // Thailand
  {
    id: 'tha-1',
    name: 'Wat Phra Kaew',
    country: 'Thailand',
    type: 'Temple',
    description: 'Temple du Bouddha d\'Émeraude à Bangkok',
    points: 80,
    coordinates: [100.4927, 13.7508]
  },
  // Japan
  {
    id: 'jpn-1',
    name: 'Mont Fuji',
    country: 'Japan',
    type: 'Montagne sacrée',
    description: 'Montagne sacrée du shintoïsme',
    points: 100,
    coordinates: [138.7274, 35.3606]
  },
  {
    id: 'jpn-2',
    name: 'Fushimi Inari-taisha',
    country: 'Japan',
    type: 'Sanctuaire',
    description: 'Célèbre sanctuaire shinto aux milliers de torii',
    points: 85,
    coordinates: [135.7726, 34.9671]
  },
  // Egypt
  {
    id: 'egy-1',
    name: 'Pyramides de Gizeh',
    country: 'Egypt',
    type: 'Monument',
    description: 'Tombeaux des pharaons, merveille antique',
    points: 120,
    coordinates: [31.1342, 29.9792]
  },
  {
    id: 'egy-2',
    name: 'Mosquée Al-Azhar',
    country: 'Egypt',
    type: 'Mosquée',
    description: 'Centre historique de l\'enseignement islamique',
    points: 90,
    coordinates: [31.2629, 30.0456]
  }
];

export const getPlacesByCountry = (country: string): Place[] => {
  return mockPlaces.filter(place => place.country === country);
};

export const getPlaceById = (id: string): Place | undefined => {
  return mockPlaces.find(place => place.id === id);
};

export const getAllCountries = (): string[] => {
  return Array.from(new Set(mockPlaces.map(place => place.country))).sort();
};
