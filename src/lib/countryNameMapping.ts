// Mapping des noms de pays Mapbox vers les noms utilisés dans l'app
export const mapboxToAppCountryName: Record<string, string> = {
  // Variantes anglaises
  'United States of America': 'United States',
  'USA': 'United States',
  'United States': 'United States',
  'Russian Federation': 'Russia',
  'Russia': 'Russia',
  'Czechia': 'Czech Republic',
  'Czech Republic': 'Czech Republic',
  'The Netherlands': 'Netherlands',
  'Netherlands': 'Netherlands',
  'Vatican City': 'Vatican',
  'Vatican': 'Vatican',
  'United Kingdom': 'United Kingdom',
  'Great Britain': 'United Kingdom',
  'UK': 'United Kingdom',
  
  // Pays européens
  'France': 'France',
  'Spain': 'Spain',
  'España': 'Spain',
  'Italy': 'Italy',
  'Italia': 'Italy',
  'Germany': 'Germany',
  'Deutschland': 'Germany',
  'Portugal': 'Portugal',
  'Greece': 'Greece',
  'Austria': 'Austria',
  'Belgium': 'Belgium',
  'Switzerland': 'Switzerland',
  'Poland': 'Poland',
  'Hungary': 'Hungary',
  'Romania': 'Romania',
  'Bulgaria': 'Bulgaria',
  'Croatia': 'Croatia',
  'Serbia': 'Serbia',
  'Norway': 'Norway',
  'Sweden': 'Sweden',
  'Finland': 'Finland',
  'Denmark': 'Denmark',
  'Iceland': 'Iceland',
  'Ireland': 'Ireland',
  'Slovakia': 'Slovakia',
  'Slovenia': 'Slovenia',
  'Estonia': 'Estonia',
  'Latvia': 'Latvia',
  'Lithuania': 'Lithuania',
  'Luxembourg': 'Luxembourg',
  'Malta': 'Malta',
  'Cyprus': 'Cyprus',
  'Albania': 'Albania',
  
  // Asie
  'China': 'China',
  'Japan': 'Japan',
  'India': 'India',
  'Thailand': 'Thailand',
  'Indonesia': 'Indonesia',
  'Malaysia': 'Malaysia',
  'Singapore': 'Singapore',
  'Philippines': 'Philippines',
  'Vietnam': 'Vietnam',
  'Cambodia': 'Cambodia',
  'Myanmar': 'Myanmar',
  'Laos': 'Laos',
  'Nepal': 'Nepal',
  'Sri Lanka': 'Sri Lanka',
  'South Korea': 'South Korea',
  'Republic of Korea': 'South Korea',
  'North Korea': 'North Korea',
  'Taiwan': 'Taiwan',
  'Mongolia': 'Mongolia',
  'Pakistan': 'Pakistan',
  'Bangladesh': 'Bangladesh',
  'Afghanistan': 'Afghanistan',
  
  // Moyen-Orient
  'Israel': 'Israel',
  'Palestine': 'Palestine',
  'Jordan': 'Jordan',
  'Lebanon': 'Lebanon',
  'Syria': 'Syria',
  'Iraq': 'Iraq',
  'Iran': 'Iran',
  'Saudi Arabia': 'Saudi Arabia',
  'United Arab Emirates': 'United Arab Emirates',
  'UAE': 'United Arab Emirates',
  'Qatar': 'Qatar',
  'Kuwait': 'Kuwait',
  'Bahrain': 'Bahrain',
  'Oman': 'Oman',
  'Yemen': 'Yemen',
  'Turkey': 'Turkey',
  'Türkiye': 'Turkey',
  
  // Afrique
  'Egypt': 'Egypt',
  'Morocco': 'Morocco',
  'Tunisia': 'Tunisia',
  'Algeria': 'Algeria',
  'Libya': 'Libya',
  'Ethiopia': 'Ethiopia',
  'Kenya': 'Kenya',
  'Tanzania': 'Tanzania',
  'South Africa': 'South Africa',
  'Nigeria': 'Nigeria',
  'Ghana': 'Ghana',
  'Senegal': 'Senegal',
  'Côte d\'Ivoire': 'Ivory Coast',
  'Ivory Coast': 'Ivory Coast',
  'Mali': 'Mali',
  'Uganda': 'Uganda',
  'Zimbabwe': 'Zimbabwe',
  
  // Amériques
  'Canada': 'Canada',
  'Mexico': 'Mexico',
  'México': 'Mexico',
  'Brazil': 'Brazil',
  'Brasil': 'Brazil',
  'Argentina': 'Argentina',
  'Chile': 'Chile',
  'Peru': 'Peru',
  'Perú': 'Peru',
  'Colombia': 'Colombia',
  'Venezuela': 'Venezuela',
  'Ecuador': 'Ecuador',
  'Bolivia': 'Bolivia',
  'Paraguay': 'Paraguay',
  'Uruguay': 'Uruguay',
  'Guatemala': 'Guatemala',
  'Cuba': 'Cuba',
  'Jamaica': 'Jamaica',
  'Costa Rica': 'Costa Rica',
  'Panama': 'Panama',
  
  // Océanie
  'Australia': 'Australia',
  'New Zealand': 'New Zealand',
  'Fiji': 'Fiji',
  'Papua New Guinea': 'Papua New Guinea',
};

// Fonction de normalisation avec fallback intelligent
export const normalizeCountryName = (mapboxName: string): string => {
  if (!mapboxName) {
    console.warn('⚠️ normalizeCountryName called with empty name');
    return mapboxName;
  }
  
  // Si on a une correspondance exacte, on l'utilise
  if (mapboxToAppCountryName[mapboxName]) {
    return mapboxToAppCountryName[mapboxName];
  }
  
  // Sinon, on essaie quelques variantes communes
  const cleanedName = mapboxName
    .replace(/^The /, '') // "The Netherlands" → "Netherlands"
    .replace(/ of America$/, '') // "United States of America" → "United States"
    .replace(/ Federation$/, ''); // "Russian Federation" → "Russian"
  
  if (mapboxToAppCountryName[cleanedName]) {
    return mapboxToAppCountryName[cleanedName];
  }
  
  // Dernière tentative : on cherche une correspondance partielle
  for (const [mapboxKey, appName] of Object.entries(mapboxToAppCountryName)) {
    if (mapboxName.includes(mapboxKey) || mapboxKey.includes(mapboxName)) {
      return appName;
    }
  }
  
  // Si aucune correspondance, on retourne le nom original
  console.warn(`⚠️ Pas de mapping trouvé pour le pays: "${mapboxName}"`);
  return mapboxName;
};

// Fonction inverse pour obtenir tous les noms Mapbox possibles pour un pays de l'app
export const getMapboxNamesForCountry = (appCountryName: string): string[] => {
  const mapboxNames = Object.entries(mapboxToAppCountryName)
    .filter(([_, appName]) => appName === appCountryName)
    .map(([mapboxName, _]) => mapboxName);
  
  return mapboxNames.length > 0 ? mapboxNames : [appCountryName];
};
