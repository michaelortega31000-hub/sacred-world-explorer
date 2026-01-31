

# Plan : Réorganisation de la page Splash

## Problème identifié
Les trois boutons (Hors ligne, Tutoriel, Déconnexion) sont positionnés en bas de l'écran et chevauchent la zone de sélection de langue "Français", rendant difficile ou impossible le clic sur cette option.

## Solution proposée
Réorganiser la disposition en :
1. **Déplacer les 3 boutons tout en haut** de la page
2. **Décaler légèrement vers le bas** le logo SacredWorld et le texte pour qu'ils soient juste au-dessus du sélecteur de langue

## Modifications techniques

### Fichier : `src/pages/Splash.tsx`

#### 1. Déplacer les boutons en haut
Changer la position des boutons de `bottom-6` à `top-6` :

```typescript
// AVANT
<div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-10 px-4 sm:px-6">

// APRÈS  
<div className="absolute top-4 sm:top-6 left-0 right-0 z-10 px-4 sm:px-6">
```

#### 2. Ajuster la zone centrale
Ajouter un padding-top pour décaler visuellement le contenu vers le bas et laisser l'espace pour les boutons en haut :

```typescript
// Ajuster l'overlay des zones cliquables
<div className="absolute inset-0 flex flex-col items-center justify-center p-4 pt-20">
```

## Résultat attendu

```text
┌─────────────────────────────────────────┐
│  [Hors ligne] [Tutoriel] [Déconnexion]  │ ← Boutons tout en haut
│                                         │
│                                         │
│              🌟 Logo 🌟                 │
│             SacredWorld                 │
│     Explore. Discover. Connect          │
│          with the world.                │
│                                         │
│      [ Commencer l'exploration ]        │
│                                         │
│            🇫🇷 Français                 │ ← Maintenant accessible !
│                                         │
└─────────────────────────────────────────┘
```

## Fichiers à modifier

| Fichier | Modification |
|---------|--------------|
| `src/pages/Splash.tsx` | Changer `bottom-6` → `top-4`, ajuster le padding du conteneur central |

## Impact
- Les boutons ne bloqueront plus le sélecteur de langue
- Le logo reste centré visuellement sur l'image de fond
- L'expérience mobile sera améliorée

