
# Plan : Corriger les problèmes de géolocalisation

## Objectif
Résoudre les 3 problèmes signalés :
1. La permission refusée n'est pas gérée correctement
2. La carte ne se centre pas sur la position
3. La position ne s'affiche pas

---

## Analyse des Causes

| Problème | Cause | Fichier |
|----------|-------|---------|
| Permission refusée | Pas de guide pour réactiver | `useGeolocation.ts`, `Globe3D.tsx` |
| Carte ne se centre pas | Toast et flyTo déclenchés à chaque mise à jour de position | `Globe3D.tsx` ligne 1175-1180 |
| Position ne s'affiche pas | État `geolocationEnabled` remis à false immédiatement après erreur | `Globe3D.tsx` ligne 1184 |
| Toast répétés | `toast.success()` dans useEffect déclenché par `watchPosition` | `Globe3D.tsx` ligne 1180 |

---

## Modifications à Apporter

### 1. Améliorer `src/hooks/useGeolocation.ts`

**Ajouter un état pour distinguer la première demande** :

```typescript
export const useGeolocation = (enabled: boolean = false) => {
  const [position, setPosition] = useState<UserGeolocation | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');
  const hasInitialPosition = useRef(false); // Track first position

  useEffect(() => {
    // Vérifier l'état de la permission au montage
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setPermissionState(result.state);
        result.onchange = () => setPermissionState(result.state);
      }).catch(() => setPermissionState('unknown'));
    }
  }, []);

  // ... reste du code avec hasInitialPosition pour éviter les callbacks répétés
};
```

**Retourner aussi** : `permissionState`, `hasInitialPosition`

### 2. Corriger `src/components/Globe3D.tsx`

**Problème principal** : Le useEffect (lignes 1144-1186) déclenche `flyTo` et `toast` à chaque mise à jour de position.

**Solution** : Utiliser un flag pour ne zoomer qu'une seule fois.

```typescript
// Ajouter un ref pour tracker le premier centrage
const hasInitiallyZoomed = useRef(false);

// Modifier le useEffect geolocation
useEffect(() => {
  if (!map.current || !geolocationEnabled) {
    if (userLocationMarker.current) {
      userLocationMarker.current.remove();
      userLocationMarker.current = null;
    }
    hasInitiallyZoomed.current = false; // Reset quand désactivé
    return;
  }

  if (userPosition) {
    const { latitude, longitude } = userPosition;
    
    // Créer ou mettre à jour le marqueur
    if (!userLocationMarker.current) {
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      el.style.cssText = `...`;
      userLocationMarker.current = new mapboxgl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    } else {
      userLocationMarker.current.setLngLat([longitude, latitude]);
    }

    // Ne zoomer qu'UNE SEULE FOIS lors de la première position
    if (!hasInitiallyZoomed.current) {
      hasInitiallyZoomed.current = true;
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 12,
        duration: 2000
      });
      toast.success(t('location.enabled'));
    }
  }

  if (geolocationError) {
    // Afficher un message avec instructions
    toast.error(
      geolocationError.code === 1 
        ? 'Géolocalisation refusée. Allez dans les paramètres de votre navigateur pour l\'activer.'
        : t('location.error'),
      { duration: 5000 }
    );
    // NE PAS désactiver immédiatement - laisser l'utilisateur réessayer
    // setGeolocationEnabled(false); // Retirer cette ligne
  }
}, [userPosition, geolocationError, geolocationEnabled]);
```

**Modifier `handleRecenter`** pour forcer un re-zoom :

```typescript
const handleRecenter = () => {
  if (geolocationEnabled && userPosition) {
    // Si déjà activé avec position, recentrer manuellement
    map.current?.flyTo({
      center: [userPosition.longitude, userPosition.latitude],
      zoom: 12,
      duration: 2000
    });
  } else {
    // Activer et reset le flag pour permettre le zoom initial
    hasInitiallyZoomed.current = false;
    setGeolocationEnabled(true);
  }
};
```

### 3. Améliorer `src/components/ProximityDetector.tsx`

**Problème** : Demande la permission immédiatement sans explication.

**Solution** : Ajouter un écran d'activation préalable.

```typescript
const ProximityDetector = () => {
  const [permissionRequested, setPermissionRequested] = useState(false);
  const { position, error, loading, permissionState } = useGeolocation(permissionRequested);
  
  // Si pas encore demandé, afficher un écran d'explication
  if (!permissionRequested) {
    return (
      <Card className="p-6 text-center">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-semibold mb-2">Découvrez les lieux sacrés autour de vous</h3>
        <p className="text-muted-foreground mb-4">
          Activez la géolocalisation pour voir les monuments à proximité de votre position actuelle.
        </p>
        <Button onClick={() => setPermissionRequested(true)}>
          <Navigation className="w-4 h-4 mr-2" />
          Activer la localisation
        </Button>
      </Card>
    );
  }

  // Si permission refusée, afficher les instructions
  if (error && error.code === 1) {
    return (
      <Alert variant="destructive">
        <MapPin className="h-4 w-4" />
        <AlertDescription className="space-y-2">
          <p>La permission de géolocalisation a été refusée.</p>
          <p className="text-xs">
            Pour l'activer : Paramètres du navigateur → Confidentialité → Localisation → Autoriser pour ce site
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  // ... reste du code existant
};
```

### 4. Nettoyer `NearMeFeature.tsx`

Le composant est vide et inutile. Deux options :
- **Option A** : Le supprimer complètement et retirer son import de `Explore.tsx`
- **Option B** : Le restaurer avec une fonctionnalité utile

**Choix recommandé** : Option A (supprimer) car `ProximityDetector` fait déjà le travail.

Modifier `src/pages/Explore.tsx` :
```diff
- import NearMeFeature from '@/components/NearMeFeature';

// Dans le JSX, retirer:
-             <NearMeFeature />
```

---

## Résumé des Fichiers à Modifier

| Fichier | Action |
|---------|--------|
| `src/hooks/useGeolocation.ts` | Ajouter `permissionState`, `hasInitialPosition`, améliorer les erreurs |
| `src/components/Globe3D.tsx` | Ajouter `hasInitiallyZoomed` ref, corriger useEffect, améliorer handleRecenter |
| `src/components/ProximityDetector.tsx` | Ajouter écran d'activation préalable, meilleurs messages d'erreur |
| `src/pages/Explore.tsx` | Retirer `<NearMeFeature />` (inutile) |
| `src/components/NearMeFeature.tsx` | Supprimer le fichier |

---

## Résultat Attendu

1. **Bouton géolocalisation sur la carte 3D** : 
   - Premier clic → demande permission → zoom sur la position
   - Clics suivants → recentre immédiatement
   - Toast affiché une seule fois

2. **Onglet "Proche"** :
   - Affiche d'abord une explication avec bouton "Activer"
   - Après clic → demande permission
   - Si refusé → instructions claires pour réactiver

3. **Marqueur position** :
   - S'affiche correctement après autorisation
   - Se met à jour silencieusement (sans toast à chaque fois)
