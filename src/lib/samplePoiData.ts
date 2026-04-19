// Realistic fallback POI samples shown when the database has no entries
// for a given place's city. Country-aware templates + deterministic seeding
// from place.id ensure every city receives a unique, stable trio.

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

// ---- Helpers ----------------------------------------------------------------

const hash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const pick = <T,>(arr: T[], seed: number): T => arr[seed % arr.length];

const jitter = (coords: [number, number], seed: number): [number, number] => {
  const offset = 0.005 + (seed % 5) * 0.002; // ~500m–1.4km
  const dirLng = seed % 2 === 0 ? 1 : -1;
  const dirLat = seed % 3 === 0 ? 1 : -1;
  return [coords[0] + offset * dirLng, coords[1] + offset * dirLat * 0.7];
};

const normalizeCountry = (country: string): string => {
  const c = country.toLowerCase();
  if (c.includes('france')) return 'FR';
  if (c.includes('suisse') || c.includes('switzerland')) return 'CH';
  if (c.includes('espagne') || c.includes('spain')) return 'ES';
  if (c.includes('italie') || c.includes('italy')) return 'IT';
  if (c.includes('allemagne') || c.includes('german')) return 'DE';
  if (c.includes('portugal')) return 'PT';
  if (c.includes('grèce') || c.includes('greece')) return 'GR';
  if (c.includes('belgique') || c.includes('belgium')) return 'BE';
  if (c.includes('autriche') || c.includes('austria')) return 'AT';
  if (c.includes('royaume') || c.includes('united kingdom') || c.includes('angleterre')) return 'GB';
  if (c.includes('irlande') || c.includes('ireland')) return 'IE';
  if (c.includes('pologne') || c.includes('poland')) return 'PL';
  return 'DEFAULT';
};

// ---- Restaurant templates ---------------------------------------------------

const REST_TEMPLATES: Record<string, ((c: string, p: string) => string)[]> = {
  FR: [
    (c) => `Le Cloître ${c} — cuisine traditionnelle`,
    (c) => `Auberge du Parvis — bistrot du terroir à ${c}`,
    (c, p) => `Table de ${p.split(' ').slice(-1)[0]} — gastronomie régionale`,
    (c) => `Bistrot Saint-Pierre — spécialités locales à ${c}`,
    (c) => `Le Réfectoire ${c} — cuisine de pèlerin`,
  ],
  CH: [
    (c) => `Auberge des Alpes ${c} — fondue & raclette`,
    (c) => `Café Helvétia ${c} — cuisine helvète`,
    (c) => `Le Tilleul ${c} — spécialités du terroir suisse`,
    (c) => `Restaurant du Lac ${c} — perches & filets`,
  ],
  ES: [
    (c) => `Mesón ${c} — cocina tradicional`,
    () => `Posada del Camino — tapas & raciones del peregrino`,
    (c) => `Taberna ${c} — paella & jamón ibérico`,
    (c) => `Casa del Peregrino ${c} — menú del día`,
  ],
  IT: [
    (c) => `Trattoria ${c} — cucina della nonna`,
    () => `Osteria del Pellegrino — pasta & vino della casa`,
    (c) => `Locanda ${c} — specialità regionali`,
    (c) => `Ristorante San Michele ${c} — antipasti & primi`,
  ],
  DE: [
    (c) => `Gasthaus ${c} — deutsche Küche`,
    () => `Pilger Stube — Schnitzel & Bier vom Fass`,
    () => `Klosterhof — regionale Spezialitäten`,
    (c) => `Brauhaus ${c} — Wurst & Brezel`,
  ],
  PT: [
    (c) => `Tasca ${c} — cozinha portuguesa`,
    () => `Adega do Romeiro — bacalhau & vinho verde`,
    (c) => `Casa do Peregrino ${c} — pratos do dia`,
  ],
  GR: [
    (c) => `Taverna ${c} — moussaká & souvláki`,
    () => `Estiatorio Ágios — meze & ouzo`,
    (c) => `Psarotaverna ${c} — poissons grillés`,
  ],
  BE: [
    (c) => `Estaminet ${c} — bières d'abbaye & carbonnade`,
    (c) => `Brasserie du Béguinage ${c} — moules-frites`,
    () => `Refuge des Pèlerins — cuisine flamande`,
  ],
  AT: [
    (c) => `Gasthof ${c} — Wiener Schnitzel & Apfelstrudel`,
    () => `Klosterstube — Tiroler Spezialitäten`,
    (c) => `Café Mozart ${c} — pâtisseries viennoises`,
  ],
  GB: [
    (c) => `The Pilgrim's Rest ${c} — pub & Sunday roast`,
    (c) => `Abbey Tea Room ${c} — scones & cream tea`,
    () => `The Wayfarer Inn — fish & chips`,
  ],
  IE: [
    (c) => `The Pilgrim Inn ${c} — Irish stew & Guinness`,
    () => `Monastery Café — soda bread & seafood chowder`,
  ],
  PL: [
    (c) => `Karczma ${c} — pierogi & żurek`,
    () => `Gospoda Pielgrzyma — kuchnia polska`,
  ],
  DEFAULT: [
    (c, p) => `Le Réfectoire — cuisine locale près de ${p}`,
    (c) => `Café du Cloître ${c} — bistrot & spécialités`,
    (c) => `Table d'Hôte ${c} — gastronomie régionale`,
  ],
};

// ---- Hotel templates --------------------------------------------------------

const HOTEL_TEMPLATES: Record<string, ((c: string, p: string) => string)[]> = {
  FR: [
    (c) => `Hôtel des Pèlerins ${c} ⭐⭐⭐ — dès 95 €/nuit`,
    (c) => `Maison ${c} ⭐⭐⭐⭐ — boutique-hôtel, dès 145 €/nuit`,
    () => `Auberge du Sanctuaire ⭐⭐ — dès 55 €/nuit`,
  ],
  CH: [
    (c) => `Hôtel des Alpes ${c} ⭐⭐⭐⭐ — dès 180 CHF/nuit`,
    (c) => `Pension Edelweiss ${c} ⭐⭐⭐ — dès 110 CHF/nuit`,
    () => `Auberge du Lac ⭐⭐ — dès 75 CHF/nuit`,
  ],
  ES: [
    (c) => `Hostal ${c} ⭐⭐⭐ — desde 70 €/noche`,
    () => `Parador del Camino ⭐⭐⭐⭐ — desde 130 €/noche`,
    (c) => `Albergue del Peregrino ${c} ⭐ — desde 25 €/noche`,
  ],
  IT: [
    (c) => `Albergo ${c} ⭐⭐⭐ — da 90 €/notte`,
    () => `Locanda del Pellegrino ⭐⭐ — da 60 €/notte`,
    (c) => `Hotel San Marco ${c} ⭐⭐⭐⭐ — da 140 €/notte`,
  ],
  DE: [
    (c) => `Hotel ${c} ⭐⭐⭐ — ab 95 €/Nacht`,
    () => `Pension Klosterblick ⭐⭐ — ab 60 €/Nacht`,
    (c) => `Gasthof zur Post ${c} ⭐⭐⭐ — ab 80 €/Nacht`,
  ],
  PT: [
    (c) => `Pousada ${c} ⭐⭐⭐⭐ — desde 120 €/noite`,
    (c) => `Residencial ${c} ⭐⭐ — desde 55 €/noite`,
  ],
  GR: [
    (c) => `Xenodocheío ${c} ⭐⭐⭐ — από 80 €/βράδυ`,
    () => `Pension Akropolis ⭐⭐ — από 50 €/βράδυ`,
  ],
  BE: [
    (c) => `Hôtel du Béguinage ${c} ⭐⭐⭐ — dès 100 €/nuit`,
    () => `Auberge des Moines ⭐⭐ — dès 65 €/nuit`,
  ],
  AT: [
    (c) => `Hotel ${c} ⭐⭐⭐⭐ — ab 130 €/Nacht`,
    () => `Pension Alpenblick ⭐⭐ — ab 70 €/Nacht`,
  ],
  GB: [
    (c) => `${c} Abbey Hotel ⭐⭐⭐ — from £95/night`,
    () => `The Pilgrim's Inn ⭐⭐ — from £60/night`,
  ],
  IE: [
    (c) => `${c} Manor Hotel ⭐⭐⭐ — from €110/night`,
    () => `Monastery Guesthouse ⭐⭐ — from €70/night`,
  ],
  PL: [
    (c) => `Hotel ${c} ⭐⭐⭐ — od 280 zł/noc`,
    () => `Dom Pielgrzyma ⭐ — od 90 zł/noc`,
  ],
  DEFAULT: [
    (c) => `Hôtel des Pèlerins ${c} ⭐⭐⭐ — confort, dès 95 €/nuit`,
    (c) => `Maison ${c} ⭐⭐⭐⭐ — boutique-hôtel, dès 145 €/nuit`,
    () => `Auberge du Sanctuaire ⭐⭐ — économique, dès 55 €/nuit`,
  ],
};

// ---- Transport labels per country ------------------------------------------

const TRANSPORT_LABELS: Record<string, { train: string; bus: string; airport: string }> = {
  FR: { train: 'Gare', bus: 'Arrêt', airport: 'Aéroport' },
  CH: { train: 'Bahnhof', bus: 'Haltestelle', airport: 'Flughafen' },
  ES: { train: 'Estación', bus: 'Parada', airport: 'Aeropuerto' },
  IT: { train: 'Stazione', bus: 'Fermata', airport: 'Aeroporto' },
  DE: { train: 'Bahnhof', bus: 'Haltestelle', airport: 'Flughafen' },
  PT: { train: 'Estação', bus: 'Paragem', airport: 'Aeroporto' },
  GR: { train: 'Stathmós', bus: 'Stási', airport: 'Aerodrómio' },
  BE: { train: 'Gare', bus: 'Arrêt', airport: 'Aéroport' },
  AT: { train: 'Bahnhof', bus: 'Haltestelle', airport: 'Flughafen' },
  GB: { train: 'Station', bus: 'Stop', airport: 'Airport' },
  IE: { train: 'Station', bus: 'Stop', airport: 'Airport' },
  PL: { train: 'Dworzec', bus: 'Przystanek', airport: 'Lotnisko' },
  DEFAULT: { train: 'Gare', bus: 'Arrêt', airport: 'Aéroport' },
};

// ---- Builders ---------------------------------------------------------------

const buildThree = (
  place: PlaceLike,
  templates: ((c: string, p: string) => string)[],
  type: 'restaurant' | 'lodging',
  prefix: string,
): SamplePOI[] => {
  const seed = hash(place.id);
  const picks: string[] = [];
  // Deterministic 3 unique picks
  for (let i = 0; i < templates.length && picks.length < 3; i++) {
    const candidate = templates[(seed + i) % templates.length](place.city, place.name);
    if (!picks.includes(candidate)) picks.push(candidate);
  }
  while (picks.length < 3) {
    picks.push(templates[picks.length % templates.length](place.city, place.name));
  }
  return picks.map((name, i) => ({
    id: `sample-${prefix}-${i + 1}-${place.id}`,
    name,
    type,
    address: `${place.city}, ${place.country}`,
    coordinates: jitter(place.coordinates, seed + i + 1),
  }));
};

export const buildSampleHotels = (place: PlaceLike): SamplePOI[] => {
  const code = normalizeCountry(place.country);
  return buildThree(place, HOTEL_TEMPLATES[code] ?? HOTEL_TEMPLATES.DEFAULT, 'lodging', 'hotel');
};

export const buildSampleRestaurants = (place: PlaceLike): SamplePOI[] => {
  const code = normalizeCountry(place.country);
  return buildThree(place, REST_TEMPLATES[code] ?? REST_TEMPLATES.DEFAULT, 'restaurant', 'rest');
};

export const buildSampleTransports = (place: PlaceLike): SamplePOI[] => {
  const code = normalizeCountry(place.country);
  const labels = TRANSPORT_LABELS[code] ?? TRANSPORT_LABELS.DEFAULT;
  const c = place.city;
  const seed = hash(place.id);
  return [
    {
      id: `sample-trans-1-${place.id}`,
      name: `🚆 ${labels.train} de ${c} — ~10 min à pied`,
      type: 'transport',
      address: `Liaisons régionales et grandes lignes`,
      coordinates: jitter(place.coordinates, seed + 7),
      transportType: 'train',
    },
    {
      id: `sample-trans-2-${place.id}`,
      name: `🚌 ${labels.bus} ${c} Centre — ~3 min à pied`,
      type: 'transport',
      address: `Lignes desservant ${place.name}`,
      coordinates: jitter(place.coordinates, seed + 8),
      transportType: 'bus',
    },
    {
      id: `sample-trans-3-${place.id}`,
      name: `✈️ ${labels.airport} ${c} — ~45 min en taxi/navette`,
      type: 'transport',
      address: `Vols nationaux et européens`,
      coordinates: jitter(place.coordinates, seed + 9),
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
