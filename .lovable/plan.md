
# Plan : Corriger le compteur dans LocationsTab.tsx

## Problème identifié

Le composant `LocationsTab.tsx` (page "Lieux Sacrés du Monde") utilise **directement** `mockPlaces.length` à la ligne 660, ignorant les lieux ajoutés en base de données.

```text
┌─────────────────────────────────────────────────────────────┐
│ CODE ACTUEL (ligne 660)                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Découvrez {mockPlaces.length} lieux sacrés...             │
│             ─────────────────                               │
│                    ↓                                        │
│               262 (statique)                                │
│                                                             │
│   Les 24 lieux en BDD sont IGNORÉS                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

```text
┌─────────────────────────────────────────────────────────────┐
│ APRÈS CORRECTION                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Découvrez {allPlaces.length} lieux sacrés...              │
│             ────────────────                                │
│                    ↓                                        │
│   usePlaces() → 262 locaux + 24 BDD = 286 dynamiques        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Solution

Remplacer l'import et l'utilisation de `mockPlaces` par le hook `usePlaces()` dans `LocationsTab.tsx`.

## Fichier à modifier

| Fichier | Modification |
|---------|-------------|
| `src/components/LocationsTab.tsx` | Utiliser `usePlaces()` au lieu de `mockPlaces` |

## Changements techniques

### 1. Modifier les imports (ligne 9)

**Avant :**
```typescript
import { mockPlaces, getAllContinents, getCountriesByContinent, getCitiesByCountry, getContinent } from '@/data/placesData';
```

**Après :**
```typescript
import { getAllContinents, getCountriesByContinent, getCitiesByCountry, getContinent } from '@/data/placesData';
import { usePlaces } from '@/hooks/usePlaces';
```

### 2. Ajouter le hook dans le composant

Ajouter en début du composant :
```typescript
const { data: allPlaces = [], isLoading: isLoadingPlaces } = usePlaces();
```

### 3. Mettre à jour l'affichage du compteur (ligne 660)

**Avant :**
```typescript
<p className="text-muted-foreground text-lg">
  Découvrez {mockPlaces.length} lieux sacrés à travers le monde
</p>
```

**Après :**
```typescript
<p className="text-muted-foreground text-lg">
  Découvrez {isLoadingPlaces ? '...' : allPlaces.length} lieux sacrés à travers le monde
</p>
```

### 4. Remplacer les autres usages de mockPlaces

Toutes les références à `mockPlaces` dans le composant doivent être remplacées par `allPlaces` pour garantir la cohérence des données.

## Résultat attendu

Après cette modification :
- Le compteur affichera **286 lieux** (262 locaux + 24 de la base de données)
- Chaque nouveau lieu ajouté en BDD sera automatiquement comptabilisé
- Le hook utilise un cache de 5 minutes, donc les données ne sont pas rechargées à chaque navigation
