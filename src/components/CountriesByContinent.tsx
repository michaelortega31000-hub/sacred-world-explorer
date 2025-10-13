import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, MapPin, Globe, CheckCircle2 } from 'lucide-react';
import { getAllCountries, getAllPlaces } from '@/data/placesData';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/AppContext';

// Organisation des pays par continent
const continents = {
  'Europe': [
    'France', 'Spain', 'Italy', 'Germany', 'United Kingdom', 'Portugal', 'Greece', 
    'Belgium', 'Netherlands', 'Austria', 'Switzerland', 'Poland', 'Czech Republic',
    'Hungary', 'Denmark', 'Sweden', 'Norway', 'Finland', 'Ireland', 'Croatia',
    'Slovakia', 'Slovenia', 'Bulgaria', 'Romania', 'Serbia', 'Ukraine', 'Russia',
    'Estonia', 'Latvia', 'Lithuania', 'Luxembourg', 'Vatican', 'Cyprus', 'Malta',
    'Iceland', 'Bosnia', 'Montenegro', 'Albania', 'North Macedonia', 'Turkey'
  ],
  'Asie': [
    'China', 'Japan', 'India', 'Thailand', 'Indonesia', 'Malaysia', 'Singapore',
    'South Korea', 'Vietnam', 'Philippines', 'Myanmar', 'Cambodia', 'Laos',
    'Nepal', 'Sri Lanka', 'Tibet', 'Mongolia', 'Kazakhstan', 'Uzbekistan',
    'Saudi Arabia', 'United Arab Emirates', 'Israel', 'Jordan', 'Lebanon',
    'Iran', 'Iraq', 'Syria', 'Yemen', 'Oman', 'Qatar', 'Bahrain', 'Kuwait',
    'Pakistan', 'Bangladesh', 'Afghanistan', 'Armenia', 'Georgia', 'Azerbaijan'
  ],
  'Afrique': [
    'Egypt', 'Morocco', 'Tunisia', 'Algeria', 'South Africa', 'Kenya', 'Tanzania',
    'Ethiopia', 'Ghana', 'Nigeria', 'Senegal', 'Mali', 'Sudan', 'Libya',
    'Mauritania', 'Niger', 'Chad', 'Cameroon', 'Uganda', 'Rwanda', 'Burundi',
    'Zimbabwe', 'Botswana', 'Namibia', 'Zambia', 'Malawi', 'Mozambique',
    'Madagascar', 'Mauritius', 'Seychelles', 'Cape Verde', 'Guinea', 'Ivory Coast',
    'Burkina Faso', 'Benin', 'Togo', 'Gabon', 'Congo', 'Democratic Republic of Congo',
    'Angola', 'Central African Republic', 'Equatorial Guinea', 'Djibouti', 'Eritrea',
    'Somalia', 'Comoros', 'Lesotho', 'Eswatini'
  ],
  'Amérique du Nord': [
    'United States', 'Canada', 'Mexico', 'Cuba', 'Jamaica', 'Haiti',
    'Dominican Republic', 'Puerto Rico', 'Guatemala', 'Honduras', 'El Salvador',
    'Nicaragua', 'Costa Rica', 'Panama', 'Belize', 'Bahamas', 'Trinidad and Tobago',
    'Barbados', 'Saint Lucia', 'Grenada', 'Dominica', 'Antigua and Barbuda',
    'Saint Kitts and Nevis'
  ],
  'Amérique du Sud': [
    'Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Ecuador',
    'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname', 'French Guiana'
  ],
  'Océanie': [
    'Australia', 'New Zealand', 'Papua New Guinea', 'Fiji', 'Solomon Islands',
    'Vanuatu', 'Samoa', 'Tonga', 'Micronesia', 'Palau', 'Marshall Islands',
    'Kiribati', 'Tuvalu', 'Nauru'
  ]
};

const continentEmojis: Record<string, string> = {
  'Europe': '🇪🇺',
  'Asie': '🌏',
  'Afrique': '🌍',
  'Amérique du Nord': '🌎',
  'Amérique du Sud': '🌎',
  'Océanie': '🌏'
};

const CountriesByContinent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userProgress } = useApp();
  const [expandedContinent, setExpandedContinent] = useState<string | null>(null);
  const [showVisitedPlaces, setShowVisitedPlaces] = useState(false);
  const allCountries = getAllCountries();
  const allPlaces = getAllPlaces();
  
  // Calculer les statistiques
  const totalPlaces = allPlaces.length;
  const visitedPlaces = userProgress.visitedPlaces.length;
  
  // Obtenir les lieux visités
  const visitedPlacesDetails = allPlaces.filter(place => 
    userProgress.visitedPlaces.includes(place.id)
  );

  const getCountriesForContinent = (continent: string) => {
    const continentCountries = continents[continent as keyof typeof continents] || [];
    const filteredCountries = continentCountries.filter(country => allCountries.includes(country));
    // Trier par ordre alphabétique avec traduction
    return filteredCountries.sort((a, b) => {
      const nameA = t(`countries.${a}`, a);
      const nameB = t(`countries.${b}`, b);
      return nameA.localeCompare(nameB);
    });
  };

  const getContinentStats = (continent: string) => {
    const countries = getCountriesForContinent(continent);
    return countries.length;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {showVisitedPlaces ? (
        // Vue des lieux visités
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
                <div>
                  <CardTitle className="text-2xl">Mes Lieux Visités</CardTitle>
                  <CardDescription>
                    {visitedPlaces} lieu{visitedPlaces > 1 ? 'x' : ''} visité{visitedPlaces > 1 ? 's' : ''}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowVisitedPlaces(false)}
              >
                Retour aux continents
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-280px)]">
              {visitedPlacesDetails.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun lieu visité</h3>
                  <p className="text-muted-foreground">
                    Commencez à explorer pour visiter des lieux sacrés
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visitedPlacesDetails.map((place) => (
                    <Card
                      key={place.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/place/${place.id}`)}
                    >
                      {place.imageUrl && (
                        <div className="h-40 overflow-hidden">
                          <img
                            src={place.imageUrl}
                            alt={place.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold line-clamp-1">{place.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {place.city || place.country}
                            </p>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {place.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary font-medium">
                            {place.points} points
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {place.type}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        // Vue des continents
        <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" />
            <div className="flex-1">
              <CardTitle className="text-2xl">Explorer par Continent</CardTitle>
              <CardDescription>
                Découvrez les lieux sacrés organisés par continent
              </CardDescription>
            </div>
          </div>
          
          {/* Statistiques globales */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Lieux recensés</p>
                    <p className="text-3xl font-bold text-primary">{totalPlaces}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/5 border-secondary/20 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setShowVisitedPlaces(true)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Lieux visités</p>
                    <p className="text-3xl font-bold text-secondary">{visitedPlaces}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-secondary opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-4">
              {Object.keys(continents).map((continent) => {
                const countries = getCountriesForContinent(continent);
                const isExpanded = expandedContinent === continent;
                const countriesCount = getContinentStats(continent);

                if (countriesCount === 0) return null;

                return (
                  <Card
                    key={continent}
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg border-primary/10"
                  >
                    <button
                      onClick={() => setExpandedContinent(isExpanded ? null : continent)}
                      className="w-full text-left"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-4xl">{continentEmojis[continent]}</span>
                            <div>
                              <CardTitle className="text-xl">{continent}</CardTitle>
                              <CardDescription>
                                {countriesCount} pays disponible{countriesCount > 1 ? 's' : ''}
                              </CardDescription>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-6 h-6 text-primary transition-transform duration-300 ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        </div>
                      </CardHeader>
                    </button>

                    {isExpanded && (
                      <CardContent className="pt-0 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {countries.map((country) => (
                            <Button
                              key={country}
                              variant="outline"
                              onClick={() => navigate(`/country/${country}`)}
                              className="justify-start h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary/30 transition-all"
                            >
                              <MapPin className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                              <span className="text-left flex-1">
                                {t(`countries.${country}`, country)}
                              </span>
                              <ChevronRight className="w-4 h-4 ml-2 text-muted-foreground flex-shrink-0" />
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default CountriesByContinent;
