/**
 * City name normalization utilities for POI matching
 */

// Common city name variations (key: normalized, values: variations)
const cityVariations: Record<string, string[]> = {
  // Spain
  'barcelona': ['barcelone', 'bcn'],
  'madrid': ['madri'],
  'seville': ['sevilla', 'séville'],
  'valencia': ['valence', 'valència'],
  'granada': ['grenade'],
  'toledo': ['tolède'],
  
  // France
  'paris': ['paname'],
  'lyon': ['lion'],
  'marseille': ['marseilles'],
  'bordeaux': ['bordeau'],
  
  // Russia
  'moscow': ['moscou', 'moskva', 'moskau', 'mosca'],
  'saint petersburg': ['st petersburg', 'st. petersburg', 'saint-petersburg', 'saint-pétersbourg', 'st-pétersbourg', 'leningrad'],
  
  // Italy
  'rome': ['roma', 'rom'],
  'milan': ['milano', 'mailand'],
  'venice': ['venezia', 'venise', 'venedig'],
  'florence': ['firenze', 'florenz'],
  'naples': ['napoli', 'neapel'],
  
  // Germany
  'munich': ['münchen', 'munchen'],
  'cologne': ['köln', 'koln'],
  'frankfurt': ['francfort'],
  
  // UK
  'london': ['londres', 'londra'],
  'edinburgh': ['édimbourg', 'edimbourg'],
  
  // Asia
  'tokyo': ['tokio', 'tōkyō'],
  'beijing': ['peking', 'pékin', 'pekin'],
  'bangkok': ['krung thep'],
  'hong kong': ['hongkong'],
  
  // Middle East
  'jerusalem': ['jérusalem', 'yerushalayim', 'al-quds'],
  'cairo': ['le caire', 'al-qahira', 'kairo'],
  'amman': ['aman'],
  
  // Americas
  'new york': ['new-york', 'nyc', 'nueva york', 'nova york'],
  'mexico city': ['ciudad de mexico', 'mexico ciudad', 'mexico df', 'cdmx'],
  'buenos aires': ['buenosaires'],
  'rio de janeiro': ['rio'],
  'sao paulo': ['são paulo'],
  
  // India
  'mumbai': ['bombay'],
  'kolkata': ['calcutta', 'calcuta'],
  'chennai': ['madras'],
  'varanasi': ['benares', 'bénarès', 'kashi'],
  
  // Other
  'istanbul': ['constantinople', 'byzance'],
  'athens': ['athènes', 'athen', 'atene'],
  'prague': ['praha', 'prag', 'praga'],
  'vienna': ['wien', 'vienne'],
  'lisbon': ['lisboa', 'lisbonne'],
  'amsterdam': ['amsterdan'],
  'brussels': ['bruxelles', 'brussel', 'brüssel'],
  'warsaw': ['varsovie', 'warszawa', 'warschau'],
  'budapest': [],
  'kyoto': ['kioto'],
};

// Build reverse lookup map
const cityNormalizationMap = new Map<string, string>();
for (const [normalized, variations] of Object.entries(cityVariations)) {
  cityNormalizationMap.set(normalized.toLowerCase(), normalized);
  for (const variation of variations) {
    cityNormalizationMap.set(variation.toLowerCase(), normalized);
  }
}

/**
 * Remove accents and diacritics from a string
 */
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normalize a city name for matching
 */
export function normalizeCity(city: string): string {
  if (!city) return '';
  
  // Convert to lowercase and trim
  let normalized = city.toLowerCase().trim();
  
  // Remove accents
  normalized = removeAccents(normalized);
  
  // Remove common prefixes/suffixes
  normalized = normalized
    .replace(/^city of /i, '')
    .replace(/^la /i, '')
    .replace(/^le /i, '')
    .replace(/^el /i, '')
    .replace(/^los /i, '')
    .replace(/^las /i, '')
    .replace(/ city$/i, '')
    .trim();
  
  // Check if we have a known normalization
  const knownNormalized = cityNormalizationMap.get(normalized);
  if (knownNormalized) {
    return knownNormalized;
  }
  
  return normalized;
}

/**
 * Check if two city names match (considering variations)
 */
export function citiesMatch(city1: string, city2: string): boolean {
  if (!city1 || !city2) return false;
  
  const norm1 = normalizeCity(city1);
  const norm2 = normalizeCity(city2);
  
  // Exact match after normalization
  if (norm1 === norm2) return true;
  
  // Check if one contains the other (for compound names)
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
  
  return false;
}

/**
 * Get all variations of a city name for database search
 */
export function getCitySearchTerms(city: string): string[] {
  if (!city) return [];
  
  const normalized = normalizeCity(city);
  const terms = new Set<string>();
  
  // Add the normalized version
  terms.add(normalized);
  
  // Add the original (lowercase)
  terms.add(city.toLowerCase().trim());
  
  // Add without accents
  terms.add(removeAccents(city.toLowerCase().trim()));
  
  // Add known variations if this is a known city
  for (const [key, variations] of Object.entries(cityVariations)) {
    if (key === normalized || variations.map(v => normalizeCity(v)).includes(normalized)) {
      terms.add(key);
      variations.forEach(v => terms.add(v.toLowerCase()));
    }
  }
  
  return Array.from(terms).filter(t => t.length > 0);
}
