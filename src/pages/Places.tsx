import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Church } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import PlaceCard from '@/components/PlaceCard';
import { usePlaces } from '@/hooks/usePlaces';
import { useApp } from '@/contexts/AppContext';
import ChristianIcon from '@/components/ChristianIcon';

const REGIONS = [
  'Toutes les régions',
  'Île-de-France',
  'Normandie',
  'Bretagne',
  'Occitanie',
  'Provence-Alpes-Côte d\'Azur',
  'Auvergne-Rhône-Alpes',
  'Nouvelle-Aquitaine',
  'Hauts-de-France',
  'Grand Est',
  'Bourgogne-Franche-Comté',
  'Centre-Val de Loire',
  'Pays de la Loire',
];

const TYPES = [
  'Tous les types',
  'Cathédrale',
  'Basilique',
  'Sanctuaire',
  'Abbaye',
  'Église',
  'Chemin de pèlerinage',
];

// Light city → région mapping for FR pilot. Unmapped cities fall under "Autres".
const CITY_TO_REGION: Record<string, string> = {
  Paris: 'Île-de-France',
  Versailles: 'Île-de-France',
  Chartres: 'Centre-Val de Loire',
  Reims: 'Grand Est',
  Strasbourg: 'Grand Est',
  Metz: 'Grand Est',
  Amiens: 'Hauts-de-France',
  Lille: 'Hauts-de-France',
  Lourdes: 'Occitanie',
  Toulouse: 'Occitanie',
  Albi: 'Occitanie',
  Carcassonne: 'Occitanie',
  Marseille: 'Provence-Alpes-Côte d\'Azur',
  Avignon: 'Provence-Alpes-Côte d\'Azur',
  Nice: 'Provence-Alpes-Côte d\'Azur',
  Lyon: 'Auvergne-Rhône-Alpes',
  Vezelay: 'Bourgogne-Franche-Comté',
  Vézelay: 'Bourgogne-Franche-Comté',
  Cluny: 'Bourgogne-Franche-Comté',
  Bordeaux: 'Nouvelle-Aquitaine',
  Conques: 'Occitanie',
  'Mont-Saint-Michel': 'Normandie',
  Bayeux: 'Normandie',
  Rouen: 'Normandie',
  Caen: 'Normandie',
  Rennes: 'Bretagne',
  Quimper: 'Bretagne',
  'Sainte-Anne-d\'Auray': 'Bretagne',
  Nantes: 'Pays de la Loire',
  Tours: 'Centre-Val de Loire',
  Orleans: 'Centre-Val de Loire',
  Orléans: 'Centre-Val de Loire',
};

const matchesType = (placeType: string | undefined, filter: string) => {
  if (!placeType) return false;
  const t = placeType.toLowerCase();
  const f = filter.toLowerCase();
  if (f === 'chemin de pèlerinage') {
    return t.includes('chemin') || t.includes('pèlerin') || t.includes('pelerin');
  }
  return t.includes(f);
};

const Places = () => {
  const { userProgress } = useApp();
  const { data: allPlaces = [], isLoading } = usePlaces();
  // Phase 1 forces christianity — but we double-filter just in case the DB returns mixed data
  const places = allPlaces.filter(
    (p) => !p.religion || p.religion === 'christianity' || p.religion === userProgress.selectedReligion,
  );
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState(REGIONS[0]);
  const [type, setType] = useState(TYPES[0]);

  const visited = userProgress.visitedPlaces;

  const filtered = useMemo(() => {
    return places
      .filter((p) => {
        // France-first: prioritize France, but allow others below
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.city ?? '').toLowerCase().includes(search.toLowerCase());
        const placeRegion = CITY_TO_REGION[p.city ?? ''] ?? 'Autres';
        const matchesRegion =
          region === REGIONS[0] || (p.country === 'France' && placeRegion === region);
        const matchesTypeFilter = type === TYPES[0] || matchesType(p.type, type);
        return matchesSearch && matchesRegion && matchesTypeFilter;
      })
      .sort((a, b) => {
        // France first
        if (a.country === 'France' && b.country !== 'France') return -1;
        if (b.country === 'France' && a.country !== 'France') return 1;
        return a.name.localeCompare(b.name);
      });
  }, [places, search, region, type]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-4 pt-6 pb-3 flex items-center gap-3">
        <ChristianIcon size="md" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold leading-tight">Lieux sacrés</h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            Patrimoine chrétien — France & Europe
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Church className="w-3 h-3" /> {filtered.length}
        </Badge>
      </header>

      <main className="px-4 space-y-4 max-w-3xl mx-auto">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un lieu, une ville…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger>
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        {isLoading ? (
          <p className="text-center text-muted-foreground py-12">Chargement des lieux…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Church className="w-10 h-10 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Aucun lieu ne correspond à vos filtres.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <PlaceCard
                key={p.id}
                id={p.id}
                name={p.name}
                city={p.city ?? ''}
                country={p.country}
                religion={p.religion}
                imageUrl={p.imageUrl}
                unlocked={visited.includes(p.id)}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Places;
