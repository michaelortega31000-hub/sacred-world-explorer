// Realistic fallback POI samples shown when the database has no entries
// for a given place's city. Keeps the experience helpful and never empty.

export interface SamplePOI {
  id: string;
  name: string;
  type: 'restaurant' | 'lodging' | 'transport';
  address: string;
  coordinates: [number, number]; // [lng, lat]
  transportType?: string;
}

interface PlaceLike {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates: [number, number];
}

// Small jitter so markers don't stack on the same pixel as the place itself
const jitter = (coords: [number, number], seed: number): [number, number] => {
  const offset = 0.005 + (seed % 5) * 0.002; // ~500m–1.4km
  const dirLng = seed % 2 === 0 ? 1 : -1;
  const dirLat = seed % 3 === 0 ? 1 : -1;
  return [coords[0] + offset * dirLng, coords[1] + offset * dirLat * 0.7];
};

export const buildSampleHotels = (place: PlaceLike): SamplePOI[] => {
  const c = place.city;
  return [
    {
      id: `sample-hotel-1-${place.id}`,
      name: `Hôtel des Pèlerins ⭐⭐⭐ — confort à 600 m, dès 95 €/nuit`,
      type: 'lodging',
      address: `Centre historique, ${c}`,
      coordinates: jitter(place.coordinates, 1),
    },
    {
      id: `sample-hotel-2-${place.id}`,
      name: `Maison ${c} ⭐⭐⭐⭐ — boutique-hôtel à 1,2 km, dès 145 €/nuit`,
      type: 'lodging',
      address: `Quartier ancien, ${c}`,
      coordinates: jitter(place.coordinates, 2),
    },
    {
      id: `sample-hotel-3-${place.id}`,
      name: `Auberge du Sanctuaire ⭐⭐ — économique à 400 m, dès 55 €/nuit`,
      type: 'lodging',
      address: `À deux pas de ${place.name}, ${c}`,
      coordinates: jitter(place.coordinates, 3),
    },
  ];
};

export const buildSampleRestaurants = (place: PlaceLike): SamplePOI[] => {
  const c = place.city;
  return [
    {
      id: `sample-rest-1-${place.id}`,
      name: `Le Réfectoire — cuisine locale traditionnelle`,
      type: 'restaurant',
      address: `Plats du terroir, vue sur ${place.name} • ${c}`,
      coordinates: jitter(place.coordinates, 4),
    },
    {
      id: `sample-rest-2-${place.id}`,
      name: `Café du Cloître — bistrot & spécialités végétariennes`,
      type: 'restaurant',
      address: `Pause déjeuner conviviale à 300 m • ${c}`,
      coordinates: jitter(place.coordinates, 5),
    },
    {
      id: `sample-rest-3-${place.id}`,
      name: `Table d'Hôte ${c} — gastronomie régionale`,
      type: 'restaurant',
      address: `Menu du jour 22 €, à 800 m • ${c}`,
      coordinates: jitter(place.coordinates, 6),
    },
  ];
};

export const buildSampleTransports = (place: PlaceLike): SamplePOI[] => {
  const c = place.city;
  return [
    {
      id: `sample-trans-1-${place.id}`,
      name: `🚆 Gare de ${c} — TER & TGV, ~10 min à pied`,
      type: 'transport',
      address: `Liaisons régionales et grandes lignes`,
      coordinates: jitter(place.coordinates, 7),
      transportType: 'train',
    },
    {
      id: `sample-trans-2-${place.id}`,
      name: `🚌 Arrêt Centre — bus urbain, ~3 min à pied`,
      type: 'transport',
      address: `Lignes desservant ${place.name}`,
      coordinates: jitter(place.coordinates, 8),
      transportType: 'bus',
    },
    {
      id: `sample-trans-3-${place.id}`,
      name: `✈️ Aéroport régional — ~45 min en taxi/navette`,
      type: 'transport',
      address: `Vols nationaux et européens`,
      coordinates: jitter(place.coordinates, 9),
      transportType: 'airport',
    },
  ];
};

export const buildSamplePOIs = (
  place: PlaceLike,
  type: 'restaurant' | 'hotel' | 'transport',
): SamplePOI[] => {
  if (type === 'hotel') return buildSampleHotels(place);
  if (type === 'restaurant') return buildSampleRestaurants(place);
  return buildSampleTransports(place);
};
