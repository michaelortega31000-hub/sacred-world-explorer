

# Plan : Icône de tradition personnalisée + Badges visibles sur mobile

## Objectif
1. Remplacer les icônes Lucide par des images personnalisées pour chaque tradition dans le header
2. Afficher le compteur de badges sur mobile (actuellement masqué)
3. Corriger la persistance de la sélection de religion

---

## Modifications a apporter

### 1. Ajouter les images des traditions

**Fichiers a creer** : Copier l'image uploadee et ajouter les autres images de tradition

| Tradition | Image existante | Source |
|-----------|-----------------|--------|
| Christianisme | NON - A AJOUTER | Image uploadee par l'utilisateur |
| Islam | crescent.png | src/assets/animations/ |
| Judaisme | star-david.png | src/assets/animations/ |
| Bouddhisme | lotus.png | src/assets/animations/ |
| Hindouisme | om.png | src/assets/animations/ |
| Traditionnel | spirit.png | src/assets/animations/ |
| Atheisme | stars.png | src/assets/animations/ |

Action : Copier `user-uploads://ChatGPT_Image_31_janv._2026_16_17_26.png` vers `src/assets/icons/cross-golden.png`

---

### 2. Creer un nouveau composant ReligionIcon

**Fichier** : `src/components/ReligionIcon.tsx`

Ce composant affichera l'image correspondant a la religion selectionnee :

```typescript
import { Religion } from '@/contexts/AppContext';
import crossGolden from '@/assets/icons/cross-golden.png';
import crescent from '@/assets/animations/crescent.png';
import starDavid from '@/assets/animations/star-david.png';
import lotus from '@/assets/animations/lotus.png';
import om from '@/assets/animations/om.png';
import spirit from '@/assets/animations/spirit.png';
import stars from '@/assets/animations/stars.png';

const religionImages: Record<Religion, string> = {
  christianity: crossGolden,
  islam: crescent,
  judaism: starDavid,
  buddhism: lotus,
  hinduism: om,
  traditional: spirit,
  atheism: stars,
  astronomy: stars, // Fallback
};

export const ReligionIcon = ({ religion, size = 'md' }) => {
  const imageSrc = religionImages[religion];
  const sizeClass = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
  
  return (
    <img 
      src={imageSrc} 
      alt={religion} 
      className={`${sizeClass} object-contain`}
    />
  );
};
```

---

### 3. Modifier le Header

**Fichier** : `src/components/Header.tsx`

**Changements** :

a) Remplacer l'icone Lucide par le nouveau composant ReligionIcon

Avant (ligne 84-102) :
```tsx
{userProgress.selectedReligion && religionColor ? (
  <div className={`... ${religionColor.bg} ...`}>
    <div className={religionColor.text}>
      {getReligionIcon(userProgress.selectedReligion)}
    </div>
  </div>
) : ...}
```

Apres :
```tsx
{userProgress.selectedReligion && (
  <div 
    className="flex items-center justify-center p-1 rounded-full bg-white/10 backdrop-blur-sm shadow-md border border-white/20"
    title={userProgress.selectedReligion}
  >
    <ReligionIcon religion={userProgress.selectedReligion} size="sm" />
  </div>
)}
```

b) Afficher les badges sur mobile (ligne 117)

Avant :
```tsx
<div className="hidden sm:flex items-center gap-1.5 ...">
```

Apres :
```tsx
<div className="flex items-center gap-1 sm:gap-1.5 ...">
```

---

### 4. Verifier la persistance de la religion

**Fichier** : `src/contexts/AppContext.tsx`

La correction precedente (ligne 167) devrait deja preserver la valeur locale :
```typescript
selectedReligion: (data.selected_religion as Religion | null) || localProgress?.selectedReligion || null,
```

Mais si le probleme persiste, nous ajouterons un log de debug pour identifier la cause exacte.

---

## Structure des fichiers

```text
src/
  assets/
    icons/
      cross-golden.png  ← NOUVEAU (image uploadee)
  components/
    ReligionIcon.tsx    ← NOUVEAU
    Header.tsx          ← MODIFIE
```

---

## Resultat attendu

- En haut a gauche du header sur `/explore` :
  - Icone de tradition (image doree pour Christianisme)
  - Switch de geolocalisation
  - Compteur de badges (visible aussi sur mobile)
  
- L'icone reste visible meme apres rechargement de la page

---

## Impact visuel

L'indicateur de tradition sera plus visible et distinctif avec une image personnalisee plutot qu'une simple icone vectorielle. La croix doree avec rayons lumineux correspondra mieux a l'identite visuelle de l'application.

