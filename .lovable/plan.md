
# Plan : Supprimer "Autres" + Supprimer l'onglet "À proximité" des Défis

## Résumé des Modifications

Ce plan combine deux corrections demandées :
1. **Supprimer la catégorie "Autres"** dans les continents (plan approuvé)
2. **Supprimer l'onglet "À proximité"** des défis (doublon avec l'onglet "Proche" de Explore)

---

## Partie 1 : Supprimer la catégorie "Autres" des continents

### Problème
Le composant `LocationsStatsTab.tsx` utilise son propre mapping pays→continent incomplet (lignes 24-102), créant une catégorie "Autre" pour les pays non répertoriés.

### Solution
Utiliser la fonction `getContinent()` de `placesData.ts` qui contient un mapping complet avec 70+ pays, puis traduire les noms en français.

### Fichier à modifier : `src/components/LocationsStatsTab.tsx`

**Changements :**
1. Ajouter l'import de `getContinent` depuis `placesData.ts`
2. Supprimer le mapping local `countryToContinentMap` (lignes 24-102)
3. Ajouter un mapping de traduction des continents anglais→français
4. Modifier le calcul des statistiques pour utiliser `getContinent()` + traduction

```typescript
// Avant (ligne 3)
import { usePlaces } from '@/hooks/usePlaces';

// Après
import { usePlaces } from '@/hooks/usePlaces';
import { getContinent } from '@/data/placesData';
```

```typescript
// Nouveau mapping de traduction (à ajouter après les imports)
const continentTranslations: Record<string, string> = {
  'Africa': 'Afrique',
  'Asia': 'Asie',
  'Europe': 'Europe',
  'North America': 'Amérique du Nord',
  'South America': 'Amérique du Sud',
  'Oceania': 'Océanie',
  'Other': 'Autre',
};
```

```typescript
// Modification du calcul des stats (lignes 104-113)
const continentStats = allPlaces.reduce((acc, place) => {
  const continentEN = getContinent(place.country);
  const continentFR = continentTranslations[continentEN] || continentEN;
  
  if (!acc[continentFR]) {
    acc[continentFR] = { count: 0, countries: new Set<string>() };
  }
  acc[continentFR].count++;
  acc[continentFR].countries.add(place.country);
  return acc;
}, {} as Record<string, { count: number; countries: Set<string> }>);
```

---

## Partie 2 : Supprimer l'onglet "À proximité" des Défis

### Problème
L'onglet "À proximité" (value="nearby") dans `ChallengesTab.tsx` est un doublon de l'onglet "Proche" déjà disponible dans la barre de navigation principale de la page Explore.

### Situation actuelle

| Page | Onglet | Fonction |
|------|--------|----------|
| `/explore` | Proche (Compass icon) | ProximityDetector |
| `/explore` → Défis | À proximité (MapPin icon) | Doublon redondant |

### Solution
Supprimer l'onglet "À proximité" du composant `ChallengesTab.tsx` et le code associé.

### Fichier à modifier : `src/components/ChallengesTab.tsx`

**Changements :**

1. **Supprimer le TabsTrigger** (lignes 492-495)
```typescript
// À SUPPRIMER
<TabsTrigger value="nearby" className="flex-shrink-0 gap-2">
  <MapPin className="w-4 h-4" />
  <span className="hidden sm:inline">À proximité</span>
</TabsTrigger>
```

2. **Supprimer le TabsContent** (lignes 797-855)
```typescript
// À SUPPRIMER - tout le bloc TabsContent value="nearby"
<TabsContent value="nearby" className="space-y-4">
  ...
</TabsContent>
```

3. **Supprimer le code inutilisé** :
   - La variable `nearbyPlaces` (lignes 388-412)
   - La fonction `calculateDistance` (lignes 114-124) - utilisée uniquement pour nearbyPlaces

4. **Modifier le grid des onglets** (ligne 475)
```typescript
// Avant : grid-cols-5
<TabsList className="w-full grid grid-cols-5 ...">

// Après : grid-cols-4
<TabsList className="w-full grid grid-cols-4 ...">
```

---

## Résumé des Fichiers Modifiés

| Fichier | Modifications |
|---------|--------------|
| `src/components/LocationsStatsTab.tsx` | Import `getContinent`, supprimer mapping local, ajouter traductions |
| `src/components/ChallengesTab.tsx` | Supprimer onglet "nearby", code associé, passer à 4 colonnes |

---

## Résultat Attendu

### Onglet Défis (après modification)
```
┌─────────────────────────────────────────────────────────────┐
│  [Journalière] [Hebdomadaire] [Mensuelle] [Culture]        │
│       ↑ Seulement 4 onglets, "À proximité" supprimé        │
└─────────────────────────────────────────────────────────────┘
```

### Continents (après modification)
```
┌─────────────────────────────────────────────────────────────┐
│  Afrique           - 6 pays • 25 lieux                     │
│  Amérique du Nord  - 3 pays • 18 lieux                     │
│  Amérique du Sud   - 5 pays • 15 lieux                     │
│  Asie              - 15 pays • 85 lieux                    │
│  Europe            - 35 pays • 180 lieux                   │
│  Océanie           - 2 pays • 3 lieux                      │
│       ↑ Plus de catégorie "Autres"                         │
└─────────────────────────────────────────────────────────────┘
```

L'utilisateur accèdera aux "Lieux à proximité" via l'onglet **"Proche"** (icône boussole) dans la barre de navigation principale de la page Explore.
