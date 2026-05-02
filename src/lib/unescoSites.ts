// UNESCO World Heritage sites — global pin layer for the 3D globe.
//
// Pulled from Wikidata via SPARQL (CC0). Total ~1,200 sites.
// Cached aggressively (24h staleTime, 7d gcTime via React Query) since
// the list barely changes — a few additions per year.
//
// Wikidata model used:
//   wdt:P1435 = "heritage designation"
//   wd:Q9259  = "World Heritage Site"
//   wdt:P625  = coordinates
//   wdt:P17   = country
//   wdt:P18   = image (optional)

export interface UnescoSite {
  id: string;        // Wikidata QID
  name: string;
  countryLabel: string;
  coord: [number, number]; // [lng, lat]
  image?: string;
  category: 'cultural' | 'natural' | 'mixed';
  inDanger: boolean;
}

const QUERY = `
SELECT DISTINCT ?site ?siteLabel ?coord ?image ?countryLabel ?categoryLabel ?danger WHERE {
  ?site wdt:P1435 wd:Q9259 ;
        wdt:P625 ?coord ;
        wdt:P17 ?country .
  OPTIONAL { ?site wdt:P18 ?image . }
  OPTIONAL { ?site wdt:P5008 ?danger . FILTER(?danger = wd:Q3010369) }
  OPTIONAL {
    ?site wdt:P31 ?cat .
    VALUES ?cat { wd:Q9259 wd:Q1187811 wd:Q1758382 }
    ?cat rdfs:label ?categoryLabel .
    FILTER(LANG(?categoryLabel) = "en")
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}
LIMIT 2000
`;

const parsePoint = (point: string): [number, number] | null => {
  const m = point.match(/Point\(([-\d.]+)\s+([-\d.]+)\)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2])];
};

const inferCategory = (label: string | undefined): UnescoSite['category'] => {
  if (!label) return 'cultural';
  const l = label.toLowerCase();
  if (l.includes('mixed')) return 'mixed';
  if (l.includes('natural')) return 'natural';
  return 'cultural';
};

interface SparqlBinding {
  site: { value: string };
  siteLabel?: { value: string };
  coord: { value: string };
  image?: { value: string };
  countryLabel?: { value: string };
  categoryLabel?: { value: string };
  danger?: { value: string };
}

interface SparqlResponse {
  results: { bindings: SparqlBinding[] };
}

/**
 * Fetch every UNESCO World Heritage site with coordinates.
 * Returns a deduplicated list (~1,200 entries).
 */
export async function fetchUnescoSites(): Promise<UnescoSite[]> {
  const url =
    'https://query.wikidata.org/sparql?format=json&query=' +
    encodeURIComponent(QUERY);

  // No custom headers — User-Agent triggers CORS preflight that fails.
  const res = await fetch(url, {
    headers: { Accept: 'application/sparql-results+json' },
  });
  if (!res.ok) throw new Error(`UNESCO SPARQL HTTP ${res.status}`);

  const data: SparqlResponse = await res.json();
  const seen = new Set<string>();
  const sites: UnescoSite[] = [];

  for (const b of data.results.bindings) {
    const uri = b.site.value;
    if (seen.has(uri)) continue;
    const coord = parsePoint(b.coord.value);
    if (!coord) continue;
    seen.add(uri);

    sites.push({
      id: uri.split('/').pop() ?? uri,
      name: b.siteLabel?.value ?? '',
      countryLabel: b.countryLabel?.value ?? '',
      coord,
      image: b.image?.value,
      category: inferCategory(b.categoryLabel?.value),
      inDanger: !!b.danger,
    });
  }

  return sites;
}
