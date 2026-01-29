

# Plan : Effet Sparkle/Glow au clic sur un pays du globe

## Résumé

Ajouter un effet visuel de type "étoiles scintillantes" qui s'affiche à la position du clic lorsqu'on sélectionne un pays sur le globe 3D. L'effet utilisera la bibliothèque `canvas-confetti` déjà installée dans le projet.

---

## Approche technique

Le projet utilise déjà `canvas-confetti` pour les effets de célébration (badges, challenges). On va créer une configuration spécifique pour un effet "sparkle" avec des étoiles dorées/blanches qui partent de la position exacte du clic.

---

## Modifications

### 1. Créer un hook dédié : `src/hooks/useCountrySparkle.ts`

Nouveau fichier qui encapsule la logique de l'effet sparkle :

```typescript
import confetti from 'canvas-confetti';

export const useCountrySparkle = () => {
  const triggerSparkle = (x: number, y: number) => {
    // Position normalisée (0-1) pour canvas-confetti
    const originX = x / window.innerWidth;
    const originY = y / window.innerHeight;

    // Premier burst - étoiles dorées
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { x: originX, y: originY },
      colors: ['#F4C542', '#FFD700', '#FFF8E1', '#FFFFFF'],
      shapes: ['star'],
      scalar: 0.8,
      gravity: 0.6,
      ticks: 80,
      startVelocity: 15,
    });

    // Deuxième burst légèrement décalé - effet pétillant
    setTimeout(() => {
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { x: originX, y: originY },
        colors: ['#34E0A1', '#FFFFFF', '#F4C542'],
        shapes: ['circle'],
        scalar: 0.5,
        gravity: 0.4,
        ticks: 60,
        startVelocity: 10,
      });
    }, 50);
  };

  return { triggerSparkle };
};
```

---

### 2. Modifier `src/components/Globe3D.tsx`

**2.1 Importer le hook**

```typescript
import { useCountrySparkle } from '@/hooks/useCountrySparkle';
```

**2.2 Initialiser le hook dans le composant**

```typescript
const { triggerSparkle } = useCountrySparkle();
```

**2.3 Déclencher l'effet au clic sur un pays** (lignes 1008-1028)

Dans le handler de clic sur pays, juste après avoir détecté un pays valide et avant d'appeler `onCountryClick` :

```typescript
if (countryName) {
  // Déclencher l'effet sparkle à la position du clic
  triggerSparkle(e.point.x, e.point.y);
  
  console.log('🌍 Country clicked...', ...);
  onCountryClick(countryName);
}
```

---

## Résultat visuel attendu

| Élément | Description |
|---------|-------------|
| Forme | Étoiles + cercles |
| Couleurs | Or (#F4C542), blanc (#FFFFFF), vert (#34E0A1) |
| Durée | ~100ms d'animation |
| Position | Exactement à l'endroit du clic |
| Effet | Double burst pour un look "pétillant" |

---

## Fichiers modifiés

| Fichier | Changements |
|---------|-------------|
| `src/hooks/useCountrySparkle.ts` | Nouveau fichier (~30 lignes) |
| `src/components/Globe3D.tsx` | +2 imports, +1 ligne dans le handler |

---

## Avantages de cette approche

1. **Réutilisable** : Le hook peut être utilisé ailleurs (clic sur monuments, etc.)
2. **Cohérent** : Utilise la même bibliothèque que les autres effets du projet
3. **Performant** : `canvas-confetti` est optimisé pour les animations
4. **Personnalisable** : Facile d'ajuster couleurs, taille, nombre de particules

---

## Section technique

### Pourquoi `canvas-confetti` ?

- Déjà installé dans le projet (v1.9.4)
- Utilisé pour les badges (`useBadgeConfetti.ts`) et les challenges
- Support natif des formes "star" et "circle"
- API simple : `confetti({ origin: {x, y}, colors, shapes, ... })`

### Positionnement précis

Mapbox fournit `e.point.x` et `e.point.y` en pixels absolus. On les normalise en divisant par la taille de la fenêtre car `canvas-confetti` attend des valeurs entre 0 et 1.

### Timing du double burst

```text
Clic →
  ├── 0ms: Burst #1 (étoiles dorées, 25 particules)
  ├── 50ms: Burst #2 (cercles, 15 particules)
  └── ~150ms: Fin de l'animation
```

