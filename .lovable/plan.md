
# Plan : Réorganisation des contrôles Header + Zone Globe

## Objectif
Réorganiser les éléments de contrôle sur la page `/explore` :
1. Déplacer le filtre de catégorie en haut à gauche du header
2. Descendre le bouton de géolocalisation et l'aligner avec le chatbot (en bas de l'écran)
3. Garder l'icône de religion + badge tout à gauche du header

---

## Structure actuelle vs. Structure cible

```text
ACTUEL:
┌─────────────────────────────────────────┐
│ [Géoloc] [Religion] [Badge]  [Logo]  [Actions] │  ← Header
├─────────────────────────────────────────┤
│           [Filtre Catégorie]            │  ← Au-dessus du globe (centre)
│                                         │
│              Globe 3D                   │
│                                         │
│                              [Chatbot]  │  ← Bas droite (fixed)
├─────────────────────────────────────────┤
│        [Onglets exploration]            │
└─────────────────────────────────────────┘

CIBLE:
┌─────────────────────────────────────────┐
│ [Religion] [Badge] [Filtre]  [Logo]  [Actions] │  ← Header (filtre ajouté)
├─────────────────────────────────────────┤
│                                         │
│              Globe 3D                   │
│                                         │
│  [Géoloc]                    [Chatbot]  │  ← Bas (géoloc à gauche, chatbot à droite)
├─────────────────────────────────────────┤
│        [Onglets exploration]            │
└─────────────────────────────────────────┘
```

---

## Modifications a apporter

### 1. Modifier le Header pour inclure le filtre de catégorie

**Fichier** : `src/components/Header.tsx`

Changements :
- Ajouter une prop `categoryFilter` et `onCategoryChange` pour recevoir le filtre
- Retirer le switch de géolocalisation du header
- Ajouter le composant `PlaceCategoryFilter` après les badges
- Réorganiser l'ordre des éléments

```tsx
interface HeaderProps {
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
  children?: React.ReactNode;
  transparent?: boolean;
  // Nouvelles props pour le filtre
  categoryFilter?: PlaceCategoryFilterValue;
  onCategoryChange?: (value: PlaceCategoryFilterValue) => void;
}
```

Layout gauche du header :
```tsx
<div className="flex items-center gap-1.5 sm:gap-3">
  {/* 1. Indicateur de religion */}
  {userProgress.selectedReligion && (
    <div className="...">
      <ReligionIcon religion={userProgress.selectedReligion} size="sm" />
    </div>
  )}
  
  {/* 2. Badges obtenus */}
  <div className="flex items-center ...">
    <Award className="..." />
    <span>{userProgress.badges.length}</span>
  </div>
  
  {/* 3. Filtre de catégorie (nouveau) */}
  {showExploreControls && categoryFilter !== undefined && (
    <PlaceCategoryFilter 
      value={categoryFilter}
      onChange={onCategoryChange}
      persistKey="explore"
    />
  )}
</div>
```

---

### 2. Créer un nouveau composant GeolocationToggle flottant

**Fichier** : `src/components/GeolocationToggle.tsx` (nouveau)

Ce composant sera positionné en bas à gauche, aligné avec le chatbot :

```tsx
import { Switch } from '@/components/ui/switch';
import { MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const GeolocationToggle = () => {
  const { userProgress, toggleGeolocation, userLocation } = useApp();
  
  return (
    <div className="fixed bottom-24 left-4 z-50 flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-border/50">
      <MapPin className={`w-4 h-4 ${
        userProgress.geolocationEnabled && userLocation 
          ? 'text-primary' 
          : 'text-muted-foreground'
      }`} />
      <Switch 
        checked={userProgress.geolocationEnabled} 
        onCheckedChange={toggleGeolocation} 
        aria-label="Activer la géolocalisation" 
      />
    </div>
  );
};

export default GeolocationToggle;
```

Position : `fixed bottom-24 left-4` (symétrique au chatbot qui est `fixed bottom-24 right-4`)

---

### 3. Modifier la page Explore

**Fichier** : `src/pages/Explore.tsx`

Changements :
- Retirer le `PlaceCategoryFilter` de l'overlay du globe
- Passer le filtre au Header via les nouvelles props
- Ajouter le composant `GeolocationToggle` flottant

```tsx
import GeolocationToggle from '@/components/GeolocationToggle';

// Dans le return:
{!isFullscreen && (
  <>
    <Header 
      categoryFilter={categoryFilter}
      onCategoryChange={setCategoryFilter}
    />
    <GeolocationToggle />
  </>
)}
```

Retirer le bloc de l'overlay :
```tsx
// SUPPRIMER ce bloc :
{!isFullscreen && (
  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
    <PlaceCategoryFilter ... />
  </div>
)}
```

---

## Structure des fichiers

```text
src/
  components/
    GeolocationToggle.tsx  ← NOUVEAU
    Header.tsx             ← MODIFIE
  pages/
    Explore.tsx            ← MODIFIE
```

---

## Résultat attendu

Sur la page `/explore` :
- **Header (haut)** : [Croix dorée] [Badge: X] [Filtre: Tous/Sacrés/Musées] ... [Logo] ... [Micro] [Mail]
- **Bas gauche** : Bouton géolocalisation flottant (aligné avec le chatbot)
- **Bas droite** : Bouton chatbot (position inchangée)

Le bouton géolocalisation sera visuellement similaire au chatbot (arrondi, avec ombre) pour une cohérence visuelle.
