// Wikidata SPARQL adapter — fetches sacred / heritage sites for a given country
// and normalizes them into the app's Place shape.
//
// Endpoint: https://query.wikidata.org/sparql (no API key, free, CC0 data)
// Image attribution: Wikipedia text is CC-BY-SA, images vary by file
// (we link to the originals on Wikimedia Commons; no rehosting required).
//
// Coverage: instance-of / subclass-of any of:
//   church (Q16970), monastery (Q44613), abbey (Q120560),
//   cathedral (Q2977), chapel (Q108325), basilica (Q317557),
//   sanctuary (Q3914), shrine (Q697295), pilgrimage church (Q1769299),
//   archaeological site (Q839954), UNESCO World Heritage Site (Q9259)
//
// Cyprus alone yields ~50–100 sites. France yields ~5000+.

import type { Place, PlaceCategory, Religion } from '@/contexts/AppContext';

// ────────────────────────────────────────────────────────────────────────────
// Country name → Wikidata QID. Covers the main countries the app supports.
// For anything not in this map we skip the Wikidata enrichment rather than
// firing a separate label-resolution query (one round-trip, predictable).
// ────────────────────────────────────────────────────────────────────────────
const COUNTRY_QID: Record<string, string> = {
  // Europe — major
  france: 'Q142',
  italy: 'Q38',          italie: 'Q38',
  spain: 'Q29',          espagne: 'Q29',
  portugal: 'Q45',
  germany: 'Q183',       allemagne: 'Q183',
  'united kingdom': 'Q145', 'royaume-uni': 'Q145', 'royaume uni': 'Q145', uk: 'Q145',
  ireland: 'Q27',        irlande: 'Q27',
  belgium: 'Q31',        belgique: 'Q31',
  netherlands: 'Q55',    'pays-bas': 'Q55', 'pays bas': 'Q55',
  switzerland: 'Q39',    suisse: 'Q39',
  austria: 'Q40',        autriche: 'Q40',
  poland: 'Q36',         pologne: 'Q36',
  czechia: 'Q213',       'czech republic': 'Q213', 'république tchèque': 'Q213',
  hungary: 'Q28',        hongrie: 'Q28',
  greece: 'Q41',         grèce: 'Q41', grece: 'Q41',
  cyprus: 'Q229',        chypre: 'Q229',
  malta: 'Q233',         malte: 'Q233',
  croatia: 'Q224',       croatie: 'Q224',
  slovenia: 'Q215',      slovénie: 'Q215',
  romania: 'Q218',       roumanie: 'Q218',
  bulgaria: 'Q219',      bulgarie: 'Q219',
  serbia: 'Q403',        serbie: 'Q403',
  ukraine: 'Q212',
  russia: 'Q159',        russie: 'Q159',
  // Nordics
  sweden: 'Q34',         suède: 'Q34', suede: 'Q34',
  norway: 'Q20',         norvège: 'Q20', norvege: 'Q20',
  denmark: 'Q35',        danemark: 'Q35',
  finland: 'Q33',        finlande: 'Q33',
  iceland: 'Q189',       islande: 'Q189',
  // Mediterranean / MENA
  turkey: 'Q43',         turquie: 'Q43',
  israel: 'Q801',        israël: 'Q801',
  palestine: 'Q23792',
  lebanon: 'Q822',       liban: 'Q822',
  jordan: 'Q810',        jordanie: 'Q810',
  egypt: 'Q79',          égypte: 'Q79', egypte: 'Q79',
  morocco: 'Q1028',      maroc: 'Q1028',
  tunisia: 'Q948',       tunisie: 'Q948',
  // Americas
  'united states': 'Q30', 'etats-unis': 'Q30', 'états-unis': 'Q30', usa: 'Q30',
  canada: 'Q16',
  mexico: 'Q96',         mexique: 'Q96',
  brazil: 'Q155',        brésil: 'Q155', bresil: 'Q155',
  argentina: 'Q414',     argentine: 'Q414',
  // Asia
  india: 'Q668',         inde: 'Q668',
  japan: 'Q17',          japon: 'Q17',
  china: 'Q148',         chine: 'Q148',
  thailand: 'Q869',      thaïlande: 'Q869',
};

const lookupCountryQid = (country: string): string | null => {
  const norm = country
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
  return COUNTRY_QID[norm] ?? COUNTRY_QID[country.toLowerCase().trim()] ?? null;
};

// ────────────────────────────────────────────────────────────────────────────
// Wikidata "type" QIDs we accept and their app-side mapping
// ────────────────────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  Q2977:   'Cathédrale',
  Q44613:  'Monastère',
  Q120560: 'Abbaye',
  Q16970:  'Église',
  Q317557: 'Basilique',
  Q108325: 'Chapelle',
  Q3914:   'Sanctuaire',
  Q697295: 'Sanctuaire',
  Q1769299:'Église de pèlerinage',
  Q839954: 'Site archéologique',
  Q9259:   'Site UNESCO',
};

// ────────────────────────────────────────────────────────────────────────────
// SPARQL — single query, returns up to 200 results per country
// ────────────────────────────────────────────────────────────────────────────
const buildQuery = (countryQid: string): string => `
SELECT DISTINCT ?place ?placeLabel ?coord ?image ?typeQid ?cityLabel ?descr WHERE {
  ?place wdt:P17 wd:${countryQid} ;
         wdt:P625 ?coord ;
         wdt:P31/wdt:P279* ?type .
  VALUES ?type {
    wd:Q2977 wd:Q44613 wd:Q120560 wd:Q16970 wd:Q317557
    wd:Q108325 wd:Q3914 wd:Q697295 wd:Q1769299
    wd:Q839954 wd:Q9259
  }
  BIND(STRAFTER(STR(?type), "entity/") AS ?typeQid)
  OPTIONAL { ?place wdt:P18 ?image . }
  OPTIONAL { ?place wdt:P131 ?city . ?city rdfs:label ?cityLabel . FILTER(LANG(?cityLabel) IN ("fr","en")) }
  OPTIONAL { ?place schema:description ?descr . FILTER(LANG(?descr) IN ("fr","en")) }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
LIMIT 200
`;

// SPARQL POINT serialization: "Point(lng lat)"
const parsePoint = (point: string): [number, number] | null => {
  const m = point.match(/Point\(([-\d.]+)\s+([-\d.]+)\)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2])];
};

interface SparqlBinding {
  place: { value: string };
  placeLabel?: { value: string };
  coord: { value: string };
  image?: { value: string };
  typeQid?: { value: string };
  cityLabel?: { value: string };
  descr?: { value: string };
}

interface SparqlResponse {
  results: { bindings: SparqlBinding[] };
}

/**
 * Fetch heritage sites for a country from Wikidata.
 * Returns a normalized Place[] tagged with 'wikidata' for attribution.
 * Returns [] if the country isn't in our QID map (caller can fall back).
 */
export async function fetchWikidataPlaces(country: string): Promise<Place[]> {
  const qid = lookupCountryQid(country);
  if (!qid) return [];

  const url =
    'https://query.wikidata.org/sparql?format=json&query=' +
    encodeURIComponent(buildQuery(qid));

  // NOTE: do NOT set a custom User-Agent header — browsers treat User-Agent
  // as a forbidden header, which forces a CORS preflight that Wikidata's
  // SPARQL endpoint doesn't satisfy → request fails with ERR_FAILED.
  // Wikidata accepts unauthenticated browser requests with simple Accept.
  //
  // Hard 15s timeout — the public SPARQL endpoint regularly stalls under
  // load. Without this the page would spin indefinitely on hot countries.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: 'application/sparql-results+json' },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    throw new Error(`Wikidata SPARQL HTTP ${res.status}`);
  }

  const data: SparqlResponse = await res.json();

  // De-dupe by entity URI (a single place can match multiple type QIDs)
  const seen = new Set<string>();
  const places: Place[] = [];

  for (const b of data.results.bindings) {
    const uri = b.place.value;
    if (seen.has(uri)) continue;
    seen.add(uri);

    const coords = parsePoint(b.coord.value);
    if (!coords) continue;

    const wikidataId = uri.split('/').pop() ?? uri;
    const typeLabel = b.typeQid ? TYPE_LABELS[b.typeQid.value] ?? 'Lieu sacré' : 'Lieu sacré';
    const isMuseum = b.typeQid?.value === 'Q33506';
    const placeCategory: PlaceCategory = isMuseum ? 'museum' : 'religious_site';

    places.push({
      id: `wd-${wikidataId}`,
      name: b.placeLabel?.value ?? wikidataId,
      country,
      city: b.cityLabel?.value ?? '',
      type: typeLabel,
      placeCategory,
      description: b.descr?.value ?? '',
      points: 30, // Wikidata-sourced sites get a baseline reward
      coordinates: coords,
      // Intentionally NO imageUrl — Wikidata P18 is community-edited and
      // frequently mismatched (e.g. baroque cathedral photo on a pyramid
      // entry). Showing wrong photography is worse than showing none —
      // the UI falls back to <PlaceSymbol> with a typographic icon card.
      imageUrl: undefined,
      // Heuristic: anything matching our religious type set is Christian-leaning,
      // but we don't *assert* it — leave undefined so the UI doesn't claim wrongly.
      religion: undefined as unknown as Religion | undefined,
      tags: ['wikidata'], // attribution flag — UI shows "Source: Wikidata"
      traditionsRelated: [],
    });
  }

  return places;
}
