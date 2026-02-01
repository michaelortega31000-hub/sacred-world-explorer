import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePlaces } from '@/hooks/usePlaces';
import { getContinent } from '@/data/placesData';
import { MapPin, Globe2, Building2, Trophy, Flag, Users, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import RankingTab from './RankingTab';
import CountryRankingTab from './CountryRankingTab';
import FriendsRankingTab from './FriendsRankingTab';

// Translation mapping for continent names (English to French)
const continentTranslations: Record<string, string> = {
  'Africa': 'Afrique',
  'Asia': 'Asie',
  'Europe': 'Europe',
  'North America': 'Amérique du Nord',
  'South America': 'Amérique du Sud',
  'Oceania': 'Océanie',
  'Other': 'Autre',
};

const LocationsStatsTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: allPlaces = [], isLoading } = usePlaces();
  
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Statistiques par continent (utilise le mapping centralisé de placesData.ts)
  const continentStats = allPlaces.reduce((acc, place) => {
    const continentEN = getContinent(place.country);
    const continent = continentTranslations[continentEN] || continentEN;
    if (!acc[continent]) {
      acc[continent] = { count: 0, countries: new Set<string>() };
    }
    acc[continent].count++;
    acc[continent].countries.add(place.country);
    return acc;
  }, {} as Record<string, { count: number; countries: Set<string> }>);

  // Statistiques par pays (filtrées par continent si sélectionné)
  const countryStats = allPlaces
    .filter(place => !selectedContinent || (continentTranslations[getContinent(place.country)] || getContinent(place.country)) === selectedContinent)
    .reduce((acc, place) => {
      if (!acc[place.country]) {
        acc[place.country] = { count: 0, cities: new Set<string>() };
      }
      acc[place.country].count++;
      acc[place.country].cities.add(place.city);
      return acc;
    }, {} as Record<string, { count: number; cities: Set<string> }>);

  // Statistiques par ville (filtrées par pays si sélectionné)
  const cityStats = allPlaces
    .filter(place => !selectedCountry || place.country === selectedCountry)
    .reduce((acc, place) => {
      if (!acc[place.city]) {
        acc[place.city] = 0;
      }
      acc[place.city]++;
      return acc;
    }, {} as Record<string, number>);

  // Trier par ordre alphabétique
  const sortedContinents = Object.entries(continentStats).sort((a, b) => a[0].localeCompare(b[0]));
  const sortedCountries = Object.entries(countryStats).sort((a, b) => a[0].localeCompare(b[0]));
  const sortedCities = Object.entries(cityStats).sort((a, b) => a[0].localeCompare(b[0]));

  const handleContinentClick = (continent: string) => {
    setSelectedContinent(continent);
    setSelectedCountry(null);
  };

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country);
  };

  const handleCityClick = (city: string) => {
    if (selectedCountry) {
      navigate(`/country/${encodeURIComponent(selectedCountry)}`);
    }
  };

  const handleBack = () => {
    if (selectedCountry) {
      setSelectedCountry(null);
    } else if (selectedContinent) {
      setSelectedContinent(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'hsl(45 100% 51%)' }}>
          Lieux Recensés & Classements
        </h1>
        <p className="text-muted-foreground text-lg">
          Base de données mondiale et statistiques
        </p>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="stats" className="gap-2">
            <Globe2 className="w-4 h-4" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="personal" className="gap-2">
            <Trophy className="w-4 h-4" />
            {t('tabs.myRanking')}
          </TabsTrigger>
          <TabsTrigger value="country" className="gap-2">
            <Flag className="w-4 h-4" />
            {t('tabs.countryRanking')}
          </TabsTrigger>
          <TabsTrigger value="friends" className="gap-2">
            <Users className="w-4 h-4" />
            Classement amis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          {/* Total général */}
          <Card className="border-2" style={{ borderColor: 'hsl(45 100% 51%)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="w-6 h-6" style={{ color: 'hsl(45 100% 51%)' }} />
                Total Mondial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <p className="text-6xl font-bold mb-2" style={{ color: 'hsl(45 100% 51%)' }}>
                      {allPlaces.length}
                    </p>
                    <p className="text-muted-foreground text-lg">
                      Monuments et édifices recensés dans le monde
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation hiérarchique */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {!selectedContinent && (
                    <>
                      <Globe2 className="w-5 h-5" style={{ color: 'hsl(45 100% 51%)' }} />
                      Continents
                    </>
                  )}
                  {selectedContinent && !selectedCountry && (
                    <>
                      <MapPin className="w-5 h-5" style={{ color: 'hsl(45 100% 51%)' }} />
                      Pays - {selectedContinent}
                    </>
                  )}
                  {selectedCountry && (
                    <>
                      <Building2 className="w-5 h-5" style={{ color: 'hsl(45 100% 51%)' }} />
                      Villes - {selectedCountry}
                    </>
                  )}
                </CardTitle>
                {(selectedContinent || selectedCountry) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </Button>
                )}
              </div>
              <CardDescription>
                {!selectedContinent && `${sortedContinents.length} continents • Ordre alphabétique`}
                {selectedContinent && !selectedCountry && `${sortedCountries.length} pays • Ordre alphabétique`}
                {selectedCountry && `${sortedCities.length} villes • Ordre alphabétique`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-2">
                  {/* Liste des continents */}
                  {!selectedContinent && sortedContinents.map(([continent, data]) => (
                    <div
                      key={continent}
                      onClick={() => handleContinentClick(continent)}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Globe2 className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div>
                          <p className="font-semibold">{continent}</p>
                          <p className="text-sm text-muted-foreground">
                            {data.countries.size} pays • {data.count} lieux
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  ))}

                  {/* Liste des pays */}
                  {selectedContinent && !selectedCountry && sortedCountries.map(([country, data]) => (
                    <div
                      key={country}
                      onClick={() => handleCountryClick(country)}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <div>
                          <p className="font-semibold">{country}</p>
                          <p className="text-sm text-muted-foreground">
                            {data.cities.size} villes • {data.count} lieux
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  ))}

                  {/* Liste des villes */}
                  {selectedCountry && sortedCities.map(([city, count]) => (
                    <div
                      key={city}
                      onClick={() => handleCityClick(city)}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <p className="font-medium">{city}</p>
                      </div>
                      <Badge variant="secondary" className="text-base">
                        {count} {count > 1 ? 'lieux' : 'lieu'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal">
          <RankingTab />
        </TabsContent>

        <TabsContent value="country">
          <CountryRankingTab />
        </TabsContent>

        <TabsContent value="friends">
          <FriendsRankingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocationsStatsTab;
