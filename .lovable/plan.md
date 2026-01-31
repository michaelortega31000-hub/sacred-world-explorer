
# Plan : Améliorer la détection des clics sur les pays dans le Globe 3D

## Problème identifié

Actuellement, pour cliquer sur un pays (comme le Brésil), l'utilisateur doit cliquer **exactement** sur :
- Les lignes de frontière (`admin-0-boundary`, `admin-0-boundary-bg`)
- Les labels des pays (`country-label`)

Ces éléments sont très petits et difficiles à cibler, surtout sur mobile ou pour les grands pays.

## Solution proposée

Ajouter une **couche de remplissage invisible** (fill layer) qui couvre toute la surface de chaque pays, permettant de cliquer n'importe où sur le territoire.

```text
┌─────────────────────────────────────────────────────────────┐
│ AVANT (actuel)                  │ APRÈS (proposé)           │
├─────────────────────────────────┼───────────────────────────┤
│                                 │                           │
│    ┌──────────────────┐         │    ┌──────────────────┐   │
│    │      Brésil      │         │    │██████████████████│   │
│    │                  │ ← clic  │    │██████████████████│   │
│    │       ✗         │   raté   │    │███████ ✓ ███████│   │
│    │                  │         │    │██████████████████│   │
│    └──────────────────┘         │    └──────────────────┘   │
│         ↑                       │         ↑                 │
│    Frontière seule              │    Zone cliquable = 100%  │
│    détectable                   │    de la surface          │
└─────────────────────────────────┴───────────────────────────┘
```

## Étapes techniques

### 1. Ajouter une source de données pour les frontières des pays

Utiliser la source Mapbox `mapbox://mapbox.country-boundaries-v1` qui contient les polygones complets de chaque pays.

```typescript
map.current.addSource('country-boundaries', {
  type: 'vector',
  url: 'mapbox://mapbox.country-boundaries-v1'
});
```

### 2. Créer une couche de remplissage invisible

Ajouter une couche `fill` transparente mais cliquable :

```typescript
map.current.addLayer({
  id: 'country-fills',
  type: 'fill',
  source: 'country-boundaries',
  'source-layer': 'country_boundaries',
  paint: {
    'fill-color': 'transparent',
    'fill-opacity': 0
  }
}, 'places-circles'); // Insérer sous les marqueurs
```

### 3. Ajouter une couche de survol (hover)

Pour donner un retour visuel à l'utilisateur quand il survole un pays :

```typescript
map.current.addLayer({
  id: 'country-fills-hover',
  type: 'fill',
  source: 'country-boundaries',
  'source-layer': 'country_boundaries',
  paint: {
    'fill-color': '#34E0A1',
    'fill-opacity': 0.15
  },
  filter: ['==', 'iso_3166_1', ''] // Vide par défaut
});
```

### 4. Mettre à jour les gestionnaires d'événements

Modifier les événements `mousemove` et `click` pour utiliser la nouvelle couche :

**Hover :**
```typescript
map.current.on('mousemove', 'country-fills', (e) => {
  map.current.getCanvas().style.cursor = 'pointer';
  if (e.features && e.features[0]) {
    const iso = e.features[0].properties?.iso_3166_1;
    map.current.setFilter('country-fills-hover', ['==', 'iso_3166_1', iso]);
  }
});

map.current.on('mouseleave', 'country-fills', () => {
  map.current.getCanvas().style.cursor = '';
  map.current.setFilter('country-fills-hover', ['==', 'iso_3166_1', '']);
});
```

**Clic :**
```typescript
map.current.on('click', 'country-fills', (e) => {
  // Vérifier d'abord si on clique sur un marqueur
  const placeFeatures = map.current.queryRenderedFeatures(e.point, {
    layers: ['places-circles', 'trip-places-circles']
  });
  if (placeFeatures.length > 0) return;

  // Récupérer le nom du pays
  const countryName = e.features[0].properties?.name_en || 
                      e.features[0].properties?.name;
  if (countryName) {
    triggerSparkle(e.point.x, e.point.y);
    onCountryClick(countryName);
  }
});
```

### 5. Supprimer les anciens gestionnaires

Retirer les gestionnaires génériques `mousemove` et `click` sur toute la carte qui utilisaient `queryRenderedFeatures` avec les couches de frontières.

## Fichiers à modifier

| Fichier | Modifications |
|---------|--------------|
| `src/components/Globe3D.tsx` | Ajouter source + layers + gestionnaires d'événements |

## Avantages de cette solution

1. **Toute la surface du pays est cliquable** - Plus besoin de viser précisément
2. **Retour visuel au survol** - L'utilisateur voit quel pays sera sélectionné
3. **Meilleure expérience mobile** - Les zones tactiles sont beaucoup plus grandes
4. **Compatible avec les marqueurs existants** - Les monuments restent prioritaires
5. **Performance identique** - Les couches fill sont très légères

## Comportement attendu

1. Survoler un pays → le pays se met en surbrillance légère (vert transparent)
2. Cliquer n'importe où sur le pays → navigation vers la page du pays
3. Cliquer sur un marqueur de monument → popup du monument (priorité)
