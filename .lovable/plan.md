

# Plan : Corriger l'affichage des pays, lieux et images

## Problèmes identifiés

| Problème | Cause racine | Impact |
|----------|--------------|--------|
| Nom affiché en arabe "مصر" | Globe3D prend `name` avant `name_en` | URL incorrecte `/country/مصر` |
| 0 lieux affichés | `getPlacesByCountry("مصر")` ne trouve pas les lieux car ils utilisent `country: "Egypt"` | Page vide |
| Mauvaises images de fond | `getBackgroundRotationImages` filtre par religion, pas par pays | Images de cathédrales pour l'Égypte |

**Note importante** : Les noms des lieux sont déjà en français dans la base de données (ex: "Pyramides de Gizeh", "Temple de Karnak"). Pas de traduction supplémentaire nécessaire.

---

## Solution en 4 étapes

### 1. Corriger l'extraction du nom dans Globe3D.tsx

Prioriser `name_en` pour obtenir le nom anglais standardisé utilisé comme clé dans l'application.

**Fichier** : `src/components/Globe3D.tsx` (lignes 1007-1012)

```typescript
// AVANT (problématique)
const countryName = 
  feature.properties?.name ||        // ← مصر (arabe)
  feature.properties?.name_en ||     // ← Egypt
  ...

// APRÈS (corrigé)
const countryName = 
  feature.properties?.name_en ||     // ← Egypt (priorité)
  feature.properties?.name ||        // ← Fallback
  feature.properties?.name_fr ||
  feature.properties?.iso_3166_1 ||
  feature.properties?.worldview;
```

---

### 2. Ajouter les noms arabes au mapping (sécurité)

En cas de fallback sur `name`, le mapping convertira les noms arabes vers l'anglais.

**Fichier** : `src/lib/countryNameMapping.ts`

Ajouter ces mappings :

```typescript
// Noms arabes → Anglais (fallback sécurité)
'مصر': 'Egypt',                    // Égypte
'المغرب': 'Morocco',               // Maroc
'الجزائر': 'Algeria',              // Algérie
'تونس': 'Tunisia',                 // Tunisie
'السعودية': 'Saudi Arabia',        // Arabie Saoudite
'المملكة العربية السعودية': 'Saudi Arabia',
'الإمارات': 'United Arab Emirates',
'الإمارات العربية المتحدة': 'United Arab Emirates',
'الأردن': 'Jordan',                // Jordanie
'لبنان': 'Lebanon',                // Liban
'سوريا': 'Syria',                  // Syrie
'العراق': 'Iraq',                  // Irak
'إيران': 'Iran',                   // Iran
'فلسطين': 'Palestine',             // Palestine
'إسرائيل': 'Israel',               // Israël
'تركيا': 'Turkey',                 // Turquie
'ليبيا': 'Libya',                  // Libye
'السودان': 'Sudan',                // Soudan
'اليمن': 'Yemen',                  // Yémen
'عُمان': 'Oman',                   // Oman
'قطر': 'Qatar',                    // Qatar
'الكويت': 'Kuwait',                // Koweït
'البحرين': 'Bahrain',              // Bahreïn
```

---

### 3. Ajouter fonction `getImagesByCountry`

Créer une nouvelle fonction pour filtrer les images par pays spécifique.

**Fichier** : `src/lib/religionImageHelper.ts`

```typescript
import { normalizeCountryName } from './countryNameMapping';

/**
 * Récupère des images de fond pour un pays spécifique
 */
export function getImagesByCountry(country: string | null, count: number = 5): string[] {
  if (!country) {
    return getImagesByReligion(null, count);
  }

  // Normaliser le nom du pays (مصر → Egypt)
  const normalizedCountry = normalizeCountryName(country);
  
  // Filtrer les lieux du pays
  const countryPlaces = mockPlaces.filter(place => 
    place.country.toLowerCase() === normalizedCountry.toLowerCase()
  );

  if (countryPlaces.length === 0) {
    console.warn(`⚠️ Aucune image trouvée pour le pays: "${country}" (normalisé: "${normalizedCountry}")`);
    return getImagesByReligion(null, count);
  }

  // Mélanger et retourner
  return countryPlaces
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, countryPlaces.length))
    .map(place => getImageUrl(place.imageUrl || ''))
    .filter(url => url !== '/placeholder.svg');
}
```

---

### 4. Utiliser les images par pays dans Country.tsx

Remplacer le filtre par religion avec le filtre par pays.

**Fichier** : `src/pages/Country.tsx` (lignes 27 et 36)

```typescript
// AVANT
import { getBackgroundRotationImages } from '@/lib/religionImageHelper';
const backgroundImages = getBackgroundRotationImages(userProgress.selectedReligion);

// APRÈS
import { getImagesByCountry } from '@/lib/religionImageHelper';
const backgroundImages = getImagesByCountry(country);
```

---

## Fichiers à modifier

| Fichier | Modification |
|---------|--------------|
| `src/components/Globe3D.tsx` | Prioriser `name_en` sur `name` (ligne 1007-1012) |
| `src/lib/countryNameMapping.ts` | Ajouter mappings arabes → anglais |
| `src/lib/religionImageHelper.ts` | Ajouter fonction `getImagesByCountry()` |
| `src/pages/Country.tsx` | Utiliser `getImagesByCountry(country)` |

---

## Résultat attendu

### Pour l'Égypte :

1. **URL correcte** : `/country/Egypt` (au lieu de `/country/مصر`)

2. **Titre en français** : "Égypte" (via traduction i18n `countries.Egypt`)

3. **7 lieux sacrés affichés** (déjà en français) :
   - Pyramides de Gizeh (Le Caire)
   - Mosquée Al-Azhar (Le Caire)
   - Temple de Karnak (Louxor)
   - Monastère Sainte-Catherine
   - Mosquée du Sultan Hassan (Le Caire)
   - Mosquée Mohammed Ali (Le Caire)
   - Mosquée Ibn Tulun (Le Caire)

4. **Images de fond égyptiennes** :
   - Pyramides de Gizeh
   - Mosquées du Caire
   - Temple de Karnak
   - Monastère Sainte-Catherine

---

## Tests de validation

1. Cliquer sur l'Égypte → URL = `/country/Egypt`
2. Vérifier titre "Égypte" (français)
3. Vérifier 7 lieux affichés avec noms français
4. Vérifier images de fond = monuments égyptiens uniquement
5. Répéter pour : Maroc, Arabie Saoudite, Turquie, Tunisie

