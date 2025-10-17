import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Search, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockPlaces, getAllCountries } from '@/data/placesData';
import { useApp } from '@/contexts/AppContext';
import NearMeFeature from './NearMeFeature';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LocationsTab = () => {
  const navigate = useNavigate();
  const { userProgress } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');

  const countries = useMemo(() => getAllCountries(), []);

  // Get planned places
  const plannedPlaces = useMemo(() => {
    return mockPlaces.filter(place => userProgress.tripPlaces?.includes(place.id) ?? false);
  }, [userProgress.tripPlaces]);

  // Filter places based on selections and search
  const filteredPlaces = useMemo(() => {
    let filtered = activeTab === 'planned' ? plannedPlaces : mockPlaces;

    if (selectedCountry !== 'all') {
      filtered = filtered.filter(p => p.country === selectedCountry);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.city?.toLowerCase().includes(query) ||
        p.country.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedCountry, searchQuery, activeTab, plannedPlaces]);

  const isPlaceVisited = (placeId: string) => {
    return userProgress.visitedPlaces.includes(placeId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 pb-24">
      <div className="text-center mb-8">
        <h1 
          className="text-4xl font-serif font-bold mb-2"
          style={{ color: '#34E0A1' }}
        >
          Lieux Sacrés du Monde
        </h1>
        <p className="text-muted-foreground text-lg">
          Découvrez {mockPlaces.length} lieux sacrés à travers le monde
        </p>
      </div>

      {/* Near Me Feature */}
      <NearMeFeature />

      {/* Tabs for All vs Planned */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all" className="gap-2">
            <MapPin className="w-4 h-4" />
            Tous les lieux
          </TabsTrigger>
          <TabsTrigger value="planned" className="gap-2">
            <Calendar className="w-4 h-4" />
            Mon itinéraire ({plannedPlaces.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 mt-6">
          {/* Search and filters for all places */}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, ville ou pays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Filtrer par pays</label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un pays" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto z-50 bg-background">
                <SelectItem value="all">Tous les pays</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredPlaces.length} lieu{filteredPlaces.length > 1 ? 'x' : ''} trouvé{filteredPlaces.length > 1 ? 's' : ''}
          </div>

          {filteredPlaces.length === 0 ? (
            <Card className="border-2" style={{ borderColor: '#34E0A1' }}>
              <CardContent className="py-12 text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground mb-2">
                  Aucun lieu trouvé
                </p>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                {filteredPlaces.map((place) => (
                  <Card 
                    key={place.id}
                    className="overflow-hidden cursor-pointer transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, rgba(20, 43, 79, 0.95) 0%, rgba(14, 27, 63, 0.98) 100%)',
                      border: '1px solid rgba(52, 224, 161, 0.2)'
                    }}
                    onClick={() => navigate(`/place/${place.id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                      {isPlaceVisited(place.id) && (
                        <Badge 
                          className="absolute top-2 right-2 bg-primary text-primary-foreground"
                          style={{
                            boxShadow: '0 0 15px rgba(52, 224, 161, 0.5)'
                          }}
                        >
                          Visité
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-foreground line-clamp-1">
                        {place.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {place.city}, {place.country}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {place.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="planned" className="space-y-6 mt-6">
          {/* Search and filters for planned places */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans votre itinéraire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredPlaces.length} lieu{filteredPlaces.length > 1 ? 'x' : ''} dans votre itinéraire
          </div>

          {plannedPlaces.length === 0 ? (
            <Card className="border-2" style={{ borderColor: '#34E0A1' }}>
              <CardContent className="py-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground mb-2">
                  Aucun lieu planifié
                </p>
                <p className="text-muted-foreground">
                  Ajoutez des lieux à votre itinéraire depuis l'onglet "Tous les lieux"
                </p>
              </CardContent>
            </Card>
          ) : filteredPlaces.length === 0 ? (
            <Card className="border-2" style={{ borderColor: '#34E0A1' }}>
              <CardContent className="py-12 text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground mb-2">
                  Aucun lieu trouvé
                </p>
                <p className="text-muted-foreground">
                  Essayez de modifier votre recherche
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                {filteredPlaces.map((place) => (
                  <Card 
                    key={place.id}
                    className="overflow-hidden cursor-pointer transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, rgba(20, 43, 79, 0.95) 0%, rgba(14, 27, 63, 0.98) 100%)',
                      border: '1px solid rgba(52, 224, 161, 0.2)'
                    }}
                    onClick={() => navigate(`/place/${place.id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                      {isPlaceVisited(place.id) && (
                        <Badge 
                          className="absolute top-2 right-2 bg-primary text-primary-foreground"
                          style={{
                            boxShadow: '0 0 15px rgba(52, 224, 161, 0.5)'
                          }}
                        >
                          Visité
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-foreground line-clamp-1">
                        {place.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {place.city}, {place.country}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {place.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocationsTab;
