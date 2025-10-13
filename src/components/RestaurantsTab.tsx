import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Globe, Star, Utensils, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

type RestaurantType = 'all' | 'halal' | 'kosher' | 'vegetarian' | 'vegan' | 'neutral';

interface Restaurant {
  id: string;
  name: string;
  type: RestaurantType[];
  cuisine: string;
  address: string;
  city: string;
  phone?: string;
  rating: number;
  website?: string;
  description: string;
}

interface RestaurantsTabProps {
  country: string;
}

// Mock data - à remplacer par une vraie base de données
const mockRestaurants: Record<string, Restaurant[]> = {
  France: [
    {
      id: 'fr-1',
      name: 'Le Jardin de la Mosquée',
      type: ['halal'],
      cuisine: 'Cuisine marocaine',
      address: '39 Rue Geoffroy-Saint-Hilaire',
      city: 'Paris',
      phone: '+33 1 43 31 38 20',
      rating: 4.5,
      website: 'https://example.com',
      description: 'Restaurant authentique proposant une cuisine marocaine halal dans un cadre magnifique.',
    },
    {
      id: 'fr-2',
      name: 'Florence Kahn',
      type: ['kosher'],
      cuisine: 'Cuisine ashkénaze',
      address: '24 Rue des Écouffes',
      city: 'Paris',
      phone: '+33 1 48 87 92 85',
      rating: 4.3,
      website: 'https://example.com',
      description: 'Boulangerie et traiteur cachère réputé dans le Marais.',
    },
    {
      id: 'fr-3',
      name: 'Le Potager du Marais',
      type: ['vegan', 'vegetarian'],
      cuisine: 'Cuisine végétale',
      address: '22 Rue Rambuteau',
      city: 'Paris',
      phone: '+33 1 42 74 24 66',
      rating: 4.6,
      website: 'https://example.com',
      description: 'Restaurant 100% végétal et bio dans le cœur du Marais.',
    },
    {
      id: 'fr-4',
      name: 'Chez Marianne',
      type: ['neutral', 'kosher'],
      cuisine: 'Cuisine méditerranéenne',
      address: '2 Rue des Hospitalières-Saint-Gervais',
      city: 'Paris',
      rating: 4.2,
      description: 'Restaurant méditerranéen proposant des options cachères et traditionnelles.',
    },
  ],
  // Autres pays...
};

const RestaurantsTab = ({ country }: RestaurantsTabProps) => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<RestaurantType>('all');
  
  const restaurants = mockRestaurants[country] || [];
  
  const filteredRestaurants = selectedType === 'all' 
    ? restaurants 
    : restaurants.filter(r => r.type.includes(selectedType));

  const filterButtons: { type: RestaurantType; label: string; emoji: string }[] = [
    { type: 'all', label: 'Tous', emoji: '🍽️' },
    { type: 'halal', label: 'Halal', emoji: '☪️' },
    { type: 'kosher', label: 'Cachère', emoji: '✡️' },
    { type: 'vegetarian', label: 'Végétarien', emoji: '🥗' },
    { type: 'vegan', label: 'Vegan', emoji: '🌱' },
    { type: 'neutral', label: 'Neutre', emoji: '🍴' },
  ];

  const getTypeColor = (type: RestaurantType) => {
    const colors = {
      halal: 'bg-green-500/20 text-green-700 border-green-500/30',
      kosher: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
      vegetarian: 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30',
      vegan: 'bg-lime-500/20 text-lime-700 border-lime-500/30',
      neutral: 'bg-slate-500/20 text-slate-700 border-slate-500/30',
      all: 'bg-primary/20 text-primary border-primary/30',
    };
    return colors[type];
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Utensils className="w-8 h-8 text-primary" />
          Restaurants
        </h2>
        <p className="text-muted-foreground">
          Découvrez les restaurants disponibles en {t(`countries.${country}`, country)}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filterButtons.map((filter) => (
          <Button
            key={filter.type}
            onClick={() => setSelectedType(filter.type)}
            variant={selectedType === filter.type ? 'default' : 'outline'}
            className={cn(
              'gap-2 transition-all',
              selectedType === filter.type && 'shadow-lg scale-105'
            )}
          >
            <span>{filter.emoji}</span>
            {filter.label}
            {filter.type !== 'all' && (
              <Badge variant="secondary" className="ml-1">
                {restaurants.filter(r => r.type.includes(filter.type)).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant trouvé' : 'restaurants trouvés'}
      </div>

      {/* Restaurants list */}
      {filteredRestaurants.length === 0 ? (
        <Card className="p-8 text-center">
          <Utensils className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Aucun restaurant trouvé
          </h3>
          <p className="text-muted-foreground">
            Aucun restaurant ne correspond à vos critères de recherche.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <CardTitle className="flex-1 text-lg">{restaurant.name}</CardTitle>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold">{restaurant.rating}</span>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Utensils className="w-3 h-3" />
                  {restaurant.cuisine}
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-2">
                  {restaurant.type.map((type) => (
                    <Badge 
                      key={type} 
                      variant="outline" 
                      className={cn('text-xs', getTypeColor(type))}
                    >
                      {filterButtons.find(f => f.type === type)?.emoji} {filterButtons.find(f => f.type === type)?.label}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {restaurant.description}
                </p>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{restaurant.address}</div>
                    <div className="text-muted-foreground">{restaurant.city}</div>
                  </div>
                </div>
                {restaurant.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {restaurant.phone}
                  </div>
                )}
              </CardContent>
              <CardFooter className="gap-2">
                {restaurant.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => window.open(restaurant.website, '_blank')}
                  >
                    <Globe className="w-4 h-4" />
                    Site web
                  </Button>
                )}
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address + ', ' + restaurant.city)}`, '_blank')}
                >
                  <MapPin className="w-4 h-4" />
                  Itinéraire
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Info note */}
      <div className="mt-8 p-6 bg-primary/5 border-2 border-primary/20 rounded-xl">
        <div className="flex gap-3">
          <Utensils className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-1">
              Base de données collaborative
            </h4>
            <p className="text-sm text-muted-foreground">
              Cette liste est maintenue par notre communauté. N'hésitez pas à nous suggérer de nouveaux restaurants ou à signaler des informations incorrectes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsTab;
