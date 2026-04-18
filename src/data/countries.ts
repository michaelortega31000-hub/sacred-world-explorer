// Curated country list for "country of origin" selector
// Focus: Europe + main Christian pilgrimage / heritage countries
// ISO 3166-1 alpha-2 codes
export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪' },
  { code: 'AT', name: 'Autriche', flag: '🇦🇹' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'IE', name: 'Irlande', flag: '🇮🇪' },
  { code: 'PL', name: 'Pologne', flag: '🇵🇱' },
  { code: 'CZ', name: 'Tchéquie', flag: '🇨🇿' },
  { code: 'HU', name: 'Hongrie', flag: '🇭🇺' },
  { code: 'GR', name: 'Grèce', flag: '🇬🇷' },
  { code: 'RO', name: 'Roumanie', flag: '🇷🇴' },
  { code: 'HR', name: 'Croatie', flag: '🇭🇷' },
  { code: 'SE', name: 'Suède', flag: '🇸🇪' },
  { code: 'NO', name: 'Norvège', flag: '🇳🇴' },
  { code: 'DK', name: 'Danemark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlande', flag: '🇫🇮' },
  { code: 'IL', name: 'Israël', flag: '🇮🇱' },
  { code: 'TR', name: 'Turquie', flag: '🇹🇷' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
  { code: 'CD', name: 'RD Congo', flag: '🇨🇩' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'MX', name: 'Mexique', flag: '🇲🇽' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷' },
  { code: 'AR', name: 'Argentine', flag: '🇦🇷' },
  { code: 'CL', name: 'Chili', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombie', flag: '🇨🇴' },
  { code: 'PE', name: 'Pérou', flag: '🇵🇪' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺' },
  { code: 'NZ', name: 'Nouvelle-Zélande', flag: '🇳🇿' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵' },
  { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷' },
  { code: 'OTHER', name: 'Autre', flag: '🌍' },
];

export const getCountryByCode = (code: string | null | undefined): CountryOption | undefined => {
  if (!code) return undefined;
  return COUNTRIES.find((c) => c.code === code);
};
