
# Plan: Synchroniser le bouton de géolocalisation de la carte avec le toggle du header

## Problème identifié

Le composant Globe3D utilise un **état local** (`geolocationEnabled`) qui est séparé de l'état global dans AppContext (`userProgress.geolocationEnabled`). 

Quand vous activez la géolocalisation via le toggle dans le header, cela modifie l'état global mais pas l'état local du Globe3D. Résultat : le bouton sur la carte ne sait pas que la géolocalisation est déjà activée et demande une nouvelle permission au lieu de simplement zoomer sur votre position.

## Solution

Synchroniser l'état local du Globe3D avec l'état global de AppContext pour que les deux contrôles fonctionnent ensemble.

## Modifications techniques

### Fichier: `src/components/Globe3D.tsx`

1. **Remplacer l'état local par l'état global**
   - Supprimer le `useState` local pour `geolocationEnabled`
   - Utiliser directement `userProgress.geolocationEnabled` depuis AppContext
   - Utiliser `toggleGeolocation` de AppContext au lieu de `setGeolocationEnabled`

2. **Adapter la fonction `handleRecenter`**
   - Si la géolocalisation est déjà activée et qu'on a une position → simplement zoomer
   - Sinon → activer via le contexte global

3. **Mettre à jour les hooks dépendants**
   - `useGeolocation` utilisera l'état global
   - `useLocationHistory` utilisera également l'état global

## Comportement attendu après correction

1. Vous activez le toggle dans le header → la carte zoome automatiquement sur votre position
2. Vous cliquez sur le bouton géolocalisation sur la carte → zoom sur votre position (sans message d'erreur)
3. Les deux contrôles restent synchronisés en permanence
