import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllPlaces } from '@/data/placesData';
import { MapPin, Globe2, Building2, Trophy, Flag, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import RankingTab from './RankingTab';
import CountryRankingTab from './CountryRankingTab';
import ReligionRankingTab from './ReligionRankingTab';

const LocationsStatsTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const allPlaces = getAllPlaces();

  const handleCountryClick = (country: string) => {
    navigate(`/country/${encodeURIComponent(country)}`);
  };

  const handleCityClick = (cityKey: string) => {
    // Extract country from cityKey format "City, Country"
    const country = cityKey.split(', ')[1];
    if (country) {
      navigate(`/country/${encodeURIComponent(country)}`);
    }
  };

  // Mapping des pays aux continents
  const countryToContinentMap: Record<string, string> = {
    // Europe
    'France': 'Europe',
    'Italy': 'Europe',
    'Spain': 'Europe',
    'United Kingdom': 'Europe',
    'Germany': 'Europe',
    'Greece': 'Europe',
    'Russia': 'Europe',
    'Poland': 'Europe',
    'Portugal': 'Europe',
    'Turkey': 'Europe',
    'Austria': 'Europe',
    'Hungary': 'Europe',
    'Czech Republic': 'Europe',
    'Belgium': 'Europe',
    'Netherlands': 'Europe',
    'Switzerland': 'Europe',
    'Denmark': 'Europe',
    'Sweden': 'Europe',
    'Norway': 'Europe',
    'Finland': 'Europe',
    'Ireland': 'Europe',
    'Croatia': 'Europe',
    'Serbia': 'Europe',
    'Romania': 'Europe',
    'Bulgaria': 'Europe',
    'Lithuania': 'Europe',
    'Latvia': 'Europe',
    'Estonia': 'Europe',
    'Slovakia': 'Europe',
    'Slovenia': 'Europe',
    'Albania': 'Europe',
    'Luxembourg': 'Europe',
    'Malta': 'Europe',
    'Cyprus': 'Europe',
    'Iceland': 'Europe',
    
    // Asia
    'China': 'Asie',
    'Japan': 'Asie',
    'India': 'Asie',
    'Thailand': 'Asie',
    'Cambodia': 'Asie',
    'Myanmar': 'Asie',
    'Nepal': 'Asie',
    'Tibet': 'Asie',
    'Indonesia': 'Asie',
    'Sri Lanka': 'Asie',
    'Iran': 'Asie',
    'Philippines': 'Asie',
    
    // Middle East & North Africa
    'Israel': 'Moyen-Orient',
    'Saudi Arabia': 'Moyen-Orient',
    'Egypt': 'Afrique',
    'Morocco': 'Afrique',
    'Tunisia': 'Afrique',
    'Ethiopia': 'Afrique',
    'South Africa': 'Afrique',
    
    // Americas
    'United States': 'Amérique du Nord',
    'Canada': 'Amérique du Nord',
    'Mexico': 'Amérique du Nord',
    'Brazil': 'Amérique du Sud',
    'Peru': 'Amérique du Sud',
    'Argentina': 'Amérique du Sud',
    'Colombia': 'Amérique du Sud',
    'Chile': 'Amérique du Sud',
    
    // Oceania
    'Australia': 'Océanie',
    'New Zealand': 'Océanie',
  };

  // Statistiques par continent
  const continentStats = allPlaces.reduce((acc, place) => {
    const continent = countryToContinentMap[place.country] || 'Autre';
    if (!acc[continent]) {
      acc[continent] = 0;
    }
    acc[continent]++;
    return acc;
  }, {} as Record<string, number>);

  // Statistiques par pays
  const countryStats = allPlaces.reduce((acc, place) => {
    if (!acc[place.country]) {
      acc[place.country] = 0;
    }
    acc[place.country]++;
    return acc;
  }, {} as Record<string, number>);

  // Statistiques par ville
  const cityStats = allPlaces.reduce((acc, place) => {
    const cityKey = `${place.city}, ${place.country}`;
    if (!acc[cityKey]) {
      acc[cityKey] = 0;
    }
    acc[cityKey]++;
    return acc;
  }, {} as Record<string, number>);

  // Trier par ordre décroissant
  const sortedContinents = Object.entries(continentStats).sort((a, b) => b[1] - a[1]);
  const sortedCountries = Object.entries(countryStats).sort((a, b) => b[1] - a[1]);
  const sortedCities = Object.entries(cityStats).sort((a, b) => b[1] - a[1]);

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
          <TabsTrigger value="religion" className="gap-2">
            <Users className="w-4 h-4" />
            {t('tabs.religionRanking')}
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
                <p className="text-6xl font-bold mb-2" style={{ color: 'hsl(45 100% 51%)' }}>
                  {allPlaces.length}
                </p>
                <p className="text-muted-foreground text-lg">
                  Monuments et édifices recensés dans le monde
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Par Continent */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe2 className="w-5 h-5" style={{ color: 'hsl(45 100% 51%)' }} />
                  Par Continent
                </CardTitle>
                <CardDescription>
                  {sortedContinents.length} continents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {sortedContinents.map(([continent, count]) => (
                      <div
                        key={continent}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <span className="font-medium">{continent}</span>
                        <Badge variant="secondary" className="text-base">
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Par Pays */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" style={{ color: 'hsl(45 100% 51%)' }} />
                  Par Pays
                </CardTitle>
                <CardDescription>
                  {sortedCountries.length} pays
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {sortedCountries.map(([country, count]) => (
                      <div
                        key={country}
                        onClick={() => handleCountryClick(country)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      >
                        <span className="text-sm hover:underline">{country}</span>
                        <Badge variant="outline">
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Par Ville */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" style={{ color: 'hsl(45 100% 51%)' }} />
                  Par Ville
                </CardTitle>
                <CardDescription>
                  {sortedCities.length} villes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {sortedCities.map(([city, count]) => (
                      <div
                        key={city}
                        onClick={() => handleCityClick(city)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      >
                        <span className="text-sm hover:underline">{city}</span>
                        <Badge variant="outline">
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personal">
          <RankingTab />
        </TabsContent>

        <TabsContent value="country">
          <CountryRankingTab />
        </TabsContent>

        <TabsContent value="religion">
          <ReligionRankingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocationsStatsTab;
