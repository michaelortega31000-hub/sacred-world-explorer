import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { MapPin, Clock, Route, TrendingUp, Utensils, Hotel, Fuel } from 'lucide-react';
import type { Place, SavedPOI } from '@/contexts/AppContext';

interface RouteSegment {
  distance: number;
  duration: number;
}

interface TripStatsDashboardProps {
  places: Place[];
  segments: RouteSegment[];
  savedPOIs: SavedPOI[];
  transportMode: 'driving' | 'cycling' | 'walking';
}

const COLORS = {
  restaurant: 'hsl(var(--primary))',
  lodging: 'hsl(var(--secondary))',
  fuel: 'hsl(var(--accent))',
};

const TripStatsDashboard = ({ places, segments, savedPOIs, transportMode }: TripStatsDashboardProps) => {
  // Calculate total distance and duration
  const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
  const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);
  const hours = Math.floor(totalDuration / 60);
  const minutes = Math.round(totalDuration % 60);

  // Count unique cities
  const uniqueCities = new Set(places.map(p => `${p.city}, ${p.country}`));
  const cityCount = uniqueCities.size;

  // Calculate average time between steps
  const avgDuration = segments.length > 0 ? totalDuration / segments.length : 0;
  const avgHours = Math.floor(avgDuration / 60);
  const avgMinutes = Math.round(avgDuration % 60);

  // Count POIs by type
  const poiCounts = {
    restaurant: savedPOIs.filter(p => p.type === 'restaurant').length,
    lodging: savedPOIs.filter(p => p.type === 'lodging').length,
    fuel: savedPOIs.filter(p => p.type === 'fuel').length,
  };

  // Data for POI distribution pie chart
  const poiDistributionData = [
    { name: 'Restaurants', value: poiCounts.restaurant, icon: '🍴' },
    { name: 'Hébergements', value: poiCounts.lodging, icon: '🏨' },
    { name: 'Stations-service', value: poiCounts.fuel, icon: '⛽' },
  ].filter(item => item.value > 0);

  // Data for segment distances chart
  const segmentData = segments.map((seg, index) => ({
    name: `Étape ${index + 1}`,
    distance: parseFloat(seg.distance.toFixed(1)),
    duration: parseFloat(seg.duration.toFixed(0)),
  }));

  // Transport mode emoji
  const transportEmoji = transportMode === 'driving' ? '🚗' : transportMode === 'cycling' ? '🚴' : '🚶';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{payload[0].payload.name}</p>
          <p className="text-sm text-primary">Distance: {payload[0].value} km</p>
          <p className="text-sm text-secondary">Durée: {payload[0].payload.duration} min</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">
            {payload[0].payload.icon} {payload[0].name}
          </p>
          <p className="text-sm text-primary">{payload[0].value} points</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Distance totale</CardTitle>
              <Route className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalDistance.toFixed(1)} km</div>
            <p className="text-xs text-muted-foreground mt-1">{transportEmoji} Mode: {transportMode === 'driving' ? 'Voiture' : transportMode === 'cycling' ? 'Vélo' : 'Marche'}</p>
          </CardContent>
        </Card>

        <Card className="border-secondary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Durée totale</CardTitle>
              <Clock className="w-4 h-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Temps de trajet</p>
          </CardContent>
        </Card>

        <Card className="border-accent/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Villes visitées</CardTitle>
              <MapPin className="w-4 h-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{cityCount}</div>
            <p className="text-xs text-muted-foreground mt-1">{places.length} lieux sacrés</p>
          </CardContent>
        </Card>

        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Temps moyen</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {avgHours > 0 ? `${avgHours}h ${avgMinutes}m` : `${avgMinutes} min`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Par étape</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Segment Distances Chart */}
        {segmentData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="w-5 h-5 text-primary" />
                Distance par étape
              </CardTitle>
              <CardDescription>
                Répartition des distances entre chaque lieu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={segmentData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    label={{ value: 'km', position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="distance" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* POI Distribution Pie Chart */}
        {savedPOIs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" />
                Répartition des points d'arrêt
              </CardTitle>
              <CardDescription>
                {savedPOIs.length} point{savedPOIs.length > 1 ? 's' : ''} sauvegardé{savedPOIs.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={poiDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {poiDistributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name.includes('Restaurant') ? COLORS.restaurant : 
                              entry.name.includes('Hébergement') ? COLORS.lodging : 
                              COLORS.fuel} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {poiCounts.restaurant > 0 && (
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-primary" />
                    <span className="text-sm">{poiCounts.restaurant}</span>
                  </div>
                )}
                {poiCounts.lodging > 0 && (
                  <div className="flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-secondary" />
                    <span className="text-sm">{poiCounts.lodging}</span>
                  </div>
                )}
                {poiCounts.fuel > 0 && (
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-accent" />
                    <span className="text-sm">{poiCounts.fuel}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Duration Timeline Chart */}
      {segmentData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              Durée de trajet par segment
            </CardTitle>
            <CardDescription>
              Temps estimé entre chaque étape de votre itinéraire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={segmentData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  label={{ value: 'minutes', position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold text-foreground">{payload[0].payload.name}</p>
                          <p className="text-sm text-secondary">
                            Durée: {payload[0].payload.duration < 60 
                              ? `${payload[0].payload.duration} min`
                              : `${Math.floor(payload[0].payload.duration / 60)}h ${Math.round(payload[0].payload.duration % 60)}min`
                            }
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="duration" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--secondary))', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TripStatsDashboard;
