
# Plan : Corriger l'assistant et ajouter le filtre par pays

## Résumé des problèmes

1. **Mode AR mentionné** : L'assistant dit "mode AR" dans sa description d'Explorer (ligne 27 de la edge function), mais cette fonctionnalité n'est pas encore opérationnelle
2. **Filtre pays manquant** : Le MonumentFilter permet de filtrer par religion et type, mais pas par pays

---

## Modifications prévues

### 1. Edge Function : Retirer la mention du mode AR

**Fichier** : `supabase/functions/sacred-assistant/index.ts`

**Ligne 27** : Modifier la description de la page Explorer

| Avant | Après |
|-------|-------|
| `- **Explorer** 🗺️ : Carte interactive, filtres par tradition, mode AR` | `- **Explorer** 🗺️ : Carte interactive, filtres par tradition, type de monument et pays` |

---

### 2. MonumentFilter : Ajouter le filtre par pays

**Fichier** : `src/components/MonumentFilter.tsx`

**2.1 Modifier l'interface `FilterOptions`** (lignes 15-18)

```typescript
export interface FilterOptions {
  religions: Religion[];
  types: string[];
  countries: string[];  // Nouveau
}
```

**2.2 Ajouter un state pour les pays sélectionnés**

```typescript
const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
```

**2.3 Calculer les pays disponibles et leurs counts**

```typescript
const countryCounts = useMemo(() => {
  const counts: Record<string, number> = {};
  mockPlaces.forEach(place => {
    counts[place.country] = (counts[place.country] || 0) + 1;
  });
  return counts;
}, []);

const availableCountries = useMemo(() => {
  return Object.keys(countryCounts).sort((a, b) => a.localeCompare(b));
}, [countryCounts]);
```

**2.4 Ajouter une fonction `handleCountryToggle`**

```typescript
const handleCountryToggle = (country: string) => {
  const newCountries = selectedCountries.includes(country)
    ? selectedCountries.filter(c => c !== country)
    : [...selectedCountries, country];
  
  setSelectedCountries(newCountries);
  onFilterChange({ religions: selectedReligions, types: selectedTypes, countries: newCountries });
};
```

**2.5 Ajouter une section "Par Pays" dans le panel**

Nouvelle section entre les religions et les types de monuments, avec :
- Titre "Par Pays"
- Barre de recherche filtrée
- Liste de checkboxes avec le nom du pays et le nombre de lieux

---

### 3. Mettre à jour les autres fonctions

**Dans `MonumentFilter.tsx`** :

- `clearFilters()` : vider aussi `selectedCountries`
- `savePreset()` : inclure `countries` dans les préréglages
- `loadPreset()` : restaurer aussi les pays
- `hasActiveFilters` : compter aussi les pays
- Synchronisation avec `externalFilters`

---

## Fichiers modifiés

| Fichier | Changements |
|---------|-------------|
| `supabase/functions/sacred-assistant/index.ts` | Retirer "mode AR" de la description |
| `src/components/MonumentFilter.tsx` | Ajouter filtre par pays (~80 lignes) |

---

## Résultat attendu

1. L'assistant ne mentionne plus la réalité augmentée
2. Le filtre propose 3 catégories : Religion, Type de monument, **Pays**
3. L'utilisateur peut combiner plusieurs filtres (ex: "Cathédrales en France")
