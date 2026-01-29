

# Plan : Animations de transition fluides pour le tutoriel

## Analyse du problème actuel

Les transitions actuelles utilisent `document.querySelector()` pour manipuler les classes CSS manuellement, ce qui :
- N'est pas idiomatique en React
- Peut causer des bugs de timing
- Ne produit pas des transitions très fluides

## Solution proposée

Remplacer la logique DOM par un système React avec `useState` pour gérer l'état d'animation, combiné avec des keyframes CSS plus sophistiquées pour des transitions de type "slide + fade".

---

## Modifications

### 1. Fichier : `tailwind.config.ts`

Ajouter de nouvelles keyframes pour des transitions plus élaborées :

```typescript
keyframes: {
  // ... existants ...
  "slide-fade-left": {
    "0%": { opacity: "1", transform: "translateX(0)" },
    "100%": { opacity: "0", transform: "translateX(-30px)" }
  },
  "slide-fade-right": {
    "0%": { opacity: "1", transform: "translateX(0)" },
    "100%": { opacity: "0", transform: "translateX(30px)" }
  },
  "slide-in-left": {
    "0%": { opacity: "0", transform: "translateX(30px)" },
    "100%": { opacity: "1", transform: "translateX(0)" }
  },
  "slide-in-right": {
    "0%": { opacity: "0", transform: "translateX(-30px)" },
    "100%": { opacity: "1", transform: "translateX(0)" }
  }
}

animation: {
  // ... existants ...
  "slide-fade-left": "slide-fade-left 0.3s ease-out forwards",
  "slide-fade-right": "slide-fade-right 0.3s ease-out forwards",
  "slide-in-left": "slide-in-left 0.4s ease-out forwards",
  "slide-in-right": "slide-in-right 0.4s ease-out forwards"
}
```

---

### 2. Fichier : `src/pages/Splash.tsx`

**2.1 Ajouter un état pour la direction et l'animation**

```typescript
const [isAnimating, setIsAnimating] = useState(false);
const [animationDirection, setAnimationDirection] = useState<'next' | 'prev'>('next');
```

**2.2 Refactorer `handleTutorialNext`**

Utiliser l'état React au lieu de `document.querySelector` :

```typescript
const handleTutorialNext = () => {
  if (isAnimating) return; // Empêcher le spam de clics
  
  const nextStep = tutorialStep + 1;
  if (nextStep < tutorialSteps.length) {
    setIsAnimating(true);
    setAnimationDirection('next');
    
    setTimeout(() => {
      setTutorialStep(nextStep);
      const newProgress = Math.max(tutorialProgress, nextStep + 1);
      setTutorialProgress(newProgress);
      localStorage.setItem('tutorialProgress', newProgress.toString());
      
      setTimeout(() => setIsAnimating(false), 400);
    }, 300);
  } else {
    // Tutoriel terminé
    setShowTutorial(false);
    setTutorialStep(0);
    localStorage.setItem('tutorialCompleted', 'true');
    localStorage.setItem('tutorialProgress', tutorialSteps.length.toString());
  }
};
```

**2.3 Refactorer `handleTutorialPrev`**

```typescript
const handleTutorialPrev = () => {
  if (isAnimating || tutorialStep === 0) return;
  
  setIsAnimating(true);
  setAnimationDirection('prev');
  
  setTimeout(() => {
    setTutorialStep(tutorialStep - 1);
    setTimeout(() => setIsAnimating(false), 400);
  }, 300);
};
```

**2.4 Modifier le rendu du contenu avec classes dynamiques**

Remplacer la classe statique `tutorial-content` par des classes conditionnelles :

```tsx
<div 
  className={`flex flex-col items-center gap-6 py-4 transition-all duration-300 ${
    isAnimating 
      ? animationDirection === 'next' 
        ? 'animate-slide-fade-left' 
        : 'animate-slide-fade-right'
      : animationDirection === 'next'
        ? 'animate-slide-in-left'
        : 'animate-slide-in-right'
  }`}
>
```

---

## Résumé des changements

| Fichier | Modifications |
|---------|---------------|
| `tailwind.config.ts` | +8 keyframes, +4 animations |
| `src/pages/Splash.tsx` | Refactoring complet des handlers + classes dynamiques |

---

## Résultat attendu

| Aspect | Avant | Après |
|--------|-------|-------|
| Méthode | DOM manipulation | État React |
| Effet | Simple fade | Slide + fade directionnel |
| Direction | Aucune | Gauche (suivant) / Droite (précédent) |
| Protection spam | Non | Oui (via `isAnimating`) |
| Fluidité | Basique | Transitions 60fps |

---

## Détails techniques

### Timing des animations

```text
Clic Suivant →
  ├── 0ms: setIsAnimating(true), direction='next'
  ├── 0-300ms: animation slide-fade-left (sortie)
  ├── 300ms: setTutorialStep(next)
  ├── 300-700ms: animation slide-in-left (entrée)
  └── 700ms: setIsAnimating(false)
```

### Classes CSS générées

```css
.animate-slide-fade-left {
  animation: slide-fade-left 0.3s ease-out forwards;
}

.animate-slide-in-left {
  animation: slide-in-left 0.4s ease-out forwards;
}
```

