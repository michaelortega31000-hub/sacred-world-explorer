
# Plan : Personnalisation du Globe dans les Paramètres

## Objectif
Permettre à l'utilisateur de personnaliser l'apparence du globe 3D depuis la page Paramètres, avec différents thèmes visuels et effets.

---

## Options de personnalisation proposées

### 1. Style de carte (Map Style)
- **Satellite** (actuel) - Vue satellite réaliste
- **Rues** - Carte routière classique  
- **Nuit/Dark** - Style sombre élégant
- **Outdoors** - Style terrain/randonnée
- **Artistique** - Style minimaliste

### 2. Atmosphère & Espace
- **Classique** (actuel) - Bleu clair avec étoiles subtiles
- **Cosmos** - Espace noir profond avec étoiles intenses
- **Aurore** - Teintes violettes/vertes (aurore boréale)
- **Coucher de soleil** - Tons orangés/roses
- **Mystique** - Teintes profondes violettes

### 3. Intensité des étoiles
- Slider de 0% à 100%

### 4. Effet Sparkle au clic
- Activer/Désactiver
- Choix de couleur : Or (défaut), Turquoise, Arc-en-ciel

---

## Implémentation technique

### Étape 1 : Étendre le contexte AppContext
Ajouter de nouvelles préférences dans `UserProgress` :
```text
globeSettings: {
  mapStyle: 'satellite' | 'streets' | 'dark' | 'outdoors' | 'artistic'
  atmosphere: 'classic' | 'cosmos' | 'aurora' | 'sunset' | 'mystic'
  starIntensity: number (0-1)
  sparkleEnabled: boolean
  sparkleColor: 'gold' | 'turquoise' | 'rainbow'
}
```

### Étape 2 : Créer un composant GlobeSettings
Nouvelle section dans Settings.tsx avec :
- Sélecteur de style de carte
- Sélecteur d'atmosphère
- Slider pour l'intensité des étoiles
- Toggle pour l'effet sparkle
- Sélecteur de couleur sparkle

### Étape 3 : Modifier Globe3D.tsx
- Lire les préférences depuis le contexte
- Appliquer dynamiquement le style Mapbox (`setStyle`)
- Configurer `setFog()` selon l'atmosphère choisie
- Ajuster `star-intensity` selon le slider

### Étape 4 : Modifier useCountrySparkle
- Respecter le toggle sparkle
- Utiliser les couleurs personnalisées

---

## Styles Mapbox disponibles
| Style | URL |
|-------|-----|
| Satellite | `mapbox://styles/mapbox/satellite-streets-v12` |
| Rues | `mapbox://styles/mapbox/streets-v12` |
| Nuit | `mapbox://styles/mapbox/navigation-night-v1` |
| Outdoors | `mapbox://styles/mapbox/outdoors-v12` |
| Light | `mapbox://styles/mapbox/light-v11` |

---

## Presets d'atmosphère
```text
classic:  { space: '#0B0B19', fog: '#BAD2EB', stars: 0.6 }
cosmos:   { space: '#000005', fog: '#1a1a2e', stars: 1.0 }
aurora:   { space: '#0a0a1a', fog: '#2d5a4a', stars: 0.8 }
sunset:   { space: '#1a0a0a', fog: '#ff7e5f', stars: 0.3 }
mystic:   { space: '#0f0520', fog: '#4a1a6b', stars: 0.7 }
```

---

## Fichiers à modifier
1. `src/contexts/AppContext.tsx` - Ajouter `globeSettings` au state
2. `src/pages/Settings.tsx` - Nouvelle section "Globe" avec contrôles
3. `src/components/Globe3D.tsx` - Lire les settings et appliquer dynamiquement
4. `src/hooks/useCountrySparkle.ts` - Respecter les préférences

---

## Aperçu UI dans Settings
```text
┌─────────────────────────────────────────┐
│ 🌍 Personnalisation du Globe            │
├─────────────────────────────────────────┤
│ Style de carte                          │
│ [▼ Satellite (photo réaliste)       ]   │
│                                         │
│ Atmosphère                              │
│ [▼ Classique (bleu & étoiles)       ]   │
│                                         │
│ Intensité des étoiles                   │
│ ───────●──────────────── 60%            │
│                                         │
│ Effet scintillant au clic               │
│ [ON]  Couleur : [▼ Or        ]          │
└─────────────────────────────────────────┘
```

---

## Synchronisation
Les paramètres seront sauvegardés :
- En local (localStorage) pour une application immédiate
- En base de données (Lovable Cloud) pour la synchronisation multi-appareils

---

## Estimation
- Complexité : Moyenne
- Fichiers touchés : 4
- Impact visuel : Fort - améliore l'expérience utilisateur
