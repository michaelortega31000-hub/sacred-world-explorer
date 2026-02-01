
# Plan : Supprimer la catégorie "Autres" et harmoniser les continents

## Problème Identifié

Le composant `LocationsStatsTab.tsx` utilise **son propre mapping pays→continent incomplet** au lieu d'utiliser les fonctions exportées par `placesData.ts`.

| Fichier | Mapping | Noms Continents | Complet ? |
|---------|---------|-----------------|-----------|
| `placesData.ts` (L.3108-3154) | 70+ pays | Anglais (Asia, Europe...) | Oui |
| `LocationsStatsTab.tsx` (L.23-102) | ~50 pays | Français (Asie, Moyen-Orient...) | Non |

### Conséquence
Les pays non répertoriés dans le mapping de `LocationsStatsTab` (comme **Ecuador**) tombent dans le fallback `'Autre'` (ligne 106).

---

## Solution

Supprimer le mapping local de `LocationsStatsTab.tsx` et utiliser la fonction `getContinent()` de `placesData.ts`, puis traduire les noms de continents en français.

### Avantages
- Un seul mapping centralisé à maintenir
- Pas de catégorie "Autres" parasite
- Cohérence avec les 7 continents standards

---

## Continents Finaux (sans "Autres")

| Continent (Anglais) | Continent (Français) |
|---------------------|----------------------|
| Africa | Afrique |
| Asia | Asie |
| Europe | Europe |
| North America | Amérique du Nord |
| South America | Amérique du Sud |
| Oceania | Océanie |
| Antarctica | Antarctique |

Note : Pas de catégorie "Moyen-Orient" séparée - ces pays seront classés en **Asie** conformément à la classification géographique standard.

---

## Fichiers à Modifier

| Fichier | Modification |
|---------|--------------|
| `src/components/LocationsStatsTab.tsx` | Supprimer le mapping local, importer `getContinent` de placesData, ajouter traduction FR |

---

## Implémentation Technique

### 1. Import de la fonction centralisée
```typescript
import { getContinent } from '@/data/placesData';
```

### 2. Ajout d'un mapping de traduction des continents
```typescript
const continentTranslations: Record<string, string> = {
  'Africa': 'Afrique',
  'Asia': 'Asie',
  'Europe': 'Europe',
  'North America': 'Amérique du Nord',
  'South America': 'Amérique du Sud',
  'Oceania': 'Océanie',
  'Antarctica': 'Antarctique',
  'Other': 'Autre' // Fallback au cas où
};
```

### 3. Modification du calcul des statistiques par continent
```typescript
// Statistiques par continent
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

### 4. Suppression
- Supprimer le mapping local `countryToContinentMap` (lignes 24-102)
- Supprimer la référence à ce mapping dans les filtres de pays

---

## Résultat Attendu

```
┌─────────────────────────────────────────────────────────────┐
│  CONTINENTS                                                 │
├─────────────────────────────────────────────────────────────┤
│  🌍 Afrique           - 6 pays • 25 lieux                  │
│  🌏 Amérique du Nord  - 3 pays • 18 lieux                  │
│  🌎 Amérique du Sud   - 5 pays • 15 lieux                  │
│  🌍 Asie              - 15 pays • 85 lieux                 │
│  🌍 Europe            - 35 pays • 180 lieux                │
│  🌏 Océanie           - 2 pays • 3 lieux                   │
└─────────────────────────────────────────────────────────────┘
```

**Plus de catégorie "Autres"** - tous les lieux sont correctement classés dans les 6 continents où des lieux sacrés sont recensés.
