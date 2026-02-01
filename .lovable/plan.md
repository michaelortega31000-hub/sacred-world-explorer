
# Plan : Réduire la taille des points d'itinéraire sur la carte

## Problème identifié
Les marqueurs de l'itinéraire sur le globe sont trop volumineux, ce qui nuit à la lisibilité de la carte, particulièrement quand plusieurs étapes sont proches géographiquement.

## Valeurs actuelles vs proposées

### Layer `trip-places-pulse` (effet de halo/lueur)
| Points | Actuel | Nouveau |
|--------|--------|---------|
| 0      | 12px   | 6px     |
| 50     | 16px   | 8px     |
| 100    | 20px   | 10px    |
| 150    | 24px   | 12px    |

### Layer `trip-places-circles` (cercle principal)
| Points | Actuel | Nouveau |
|--------|--------|---------|
| 0      | 8px    | 4px     |
| 50     | 10px   | 5px     |
| 100    | 12px   | 6px     |
| 150    | 14px   | 7px     |

### Ajustement complémentaire
- **`circle-stroke-width`** : 3px → 1.5px (contour blanc proportionnel)

## Fichier à modifier
`src/components/Globe3D.tsx` (lignes 864-889)

## Aperçu visuel attendu
Les points seront environ **2x plus petits**, permettant une meilleure vue d'ensemble de l'itinéraire sans masquer les détails de la carte.
