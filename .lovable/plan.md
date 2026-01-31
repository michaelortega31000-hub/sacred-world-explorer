
# Plan : Rendre le compteur de lieux sacrés dynamique

## Problème identifié

Le nombre "262 lieux sacrés" affiché dans l'application est **statique** car il provient de la fonction `getAllPlaces()` qui retourne uniquement les données locales (`mockPlaces`), ignorant les monuments ajoutés en base de données.

```text
┌─────────────────────────────────────────────────────────────┐
│ ACTUELLEMENT                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   getAllPlaces() ──► mockPlaces (262 lieux statiques)       │
│                                                             │
│   Les 20+ monuments ajoutés en BDD sont IGNORÉS             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

```text
┌─────────────────────────────────────────────────────────────┐
│ APRÈS CORRECTION                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   usePlaces() ──► Base de données (20+ nouveaux)            │
│                   + mockPlaces (262 locaux)                 │
│                   ─────────────────────────────             │
│                   = ~280+ lieux DYNAMIQUES                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Solution proposée

Remplacer les appels à `getAllPlaces()` par le hook `usePlaces()` dans les composants concernés.

## Fichiers à modifier

| Fichier | Modification |
|---------|-------------|
| `src/components/CountriesByContinent.tsx` | Remplacer `getAllPlaces()` par `usePlaces()` |
| `src/components/TripPlannerTab.tsx` | Remplacer `getAllPlaces()` par `usePlaces()` |

## Détails techniques

### 1. CountriesByContinent.tsx

**Avant :**
```typescript
import { getAllCountries, getAllPlaces } from '@/data/placesData';

const allPlaces = getAllPlaces();
const totalPlaces = allPlaces.length; // 262 statique
```

**Après :**
```typescript
import { getAllCountries } from '@/data/placesData';
import { usePlaces } from '@/hooks/usePlaces';

const { data: allPlaces = [], isLoading } = usePlaces();
const totalPlaces = allPlaces.length; // Dynamique !
```

### 2. TripPlannerTab.tsx

**Avant :**
```typescript
import { getAllPlaces } from '@/data/placesData';

const allPlaces = getAllPlaces();
```

**Après :**
```typescript
import { usePlaces } from '@/hooks/usePlaces';

const { data: allPlaces = [] } = usePlaces();
```

## Gestion du chargement

Ajouter un indicateur de chargement léger pour le compteur :

```typescript
<p className="text-3xl font-bold text-primary">
  {isLoading ? '...' : totalPlaces}
</p>
```

## Avantages

1. **Compteur automatiquement mis à jour** - Chaque nouveau monument ajouté en BDD apparaît immédiatement
2. **Cache intelligent** - Le hook utilise React Query avec 5 min de cache, évitant les requêtes répétées
3. **Cohérence des données** - Même source de données que le Globe 3D
4. **Pas de changement visuel** - L'interface reste identique, seul le nombre change

## Comportement attendu

Après cette modification :
- Le compteur affichera le nombre réel de lieux (mockPlaces + base de données vérifiée)
- Chaque fois qu'un admin ajoute un monument via `/admin/enrich-data`, le compteur s'actualisera automatiquement
- Les lieux planifiés et visités fonctionneront avec l'ensemble complet des monuments
