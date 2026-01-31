

# Correction de la géolocalisation : Synchronisation et UX

## Resume

Ce plan corrige le comportement de la géolocalisation pour que :
1. Le **bouton header (toggle)** active/desactive uniquement la géolocalisation
2. Le **bouton "Recentrer"** (carte) zoome sur la position uniquement si la géo est active, sinon il est desactive
3. Les **erreurs de permission** sont affichees immediatement quand le toggle est active
4. La section **"Decouvrez les lieux sacres"** utilise le meme etat global que le header

---

## Fichiers a modifier

### 1. `src/components/Globe3D.tsx`

**Probleme actuel** : Le bouton Recentrer affiche un toast "Active la geolocalisation..." meme quand la geo est OFF, et les erreurs n'apparaissent pas au bon moment.

**Modifications** :

- **Bouton Recentrer desactive visuellement** si `geolocationEnabled === false`
  - Ajouter `disabled={!geolocationEnabled}` au bouton
  - Changer le style pour montrer qu'il est inactif (opacite reduite)
  - Supprimer le toast "Active la geolocalisation via le bouton..."

- **Afficher l'erreur de permission immediatement**
  - Quand `geolocationError` apparait ET que `geolocationEnabled` est true, afficher le toast d'erreur tout de suite (pas seulement sur recenter)
  - Message court : "Permission de geolocalisation refusee" ou "Erreur de localisation"

- **Supprimer la logique `pendingRecenter`** pour les erreurs
  - Les erreurs s'affichent au moment ou elles surviennent, pas au recenter

**Code cible (bouton)** :
```tsx
<Button 
  variant={geolocationEnabled ? "default" : "secondary"} 
  size="icon" 
  onClick={handleRecenter} 
  disabled={!geolocationEnabled}
  className={cn(
    "rounded-full shadow-lg h-9 w-9",
    !geolocationEnabled && "opacity-50 cursor-not-allowed"
  )}
>
  <Locate className="h-4 w-4" />
</Button>
```

**Code cible (handleRecenter simplifie)** :
```tsx
const handleRecenter = () => {
  if (!geolocationEnabled) return; // Bouton desactive, ne fait rien

  if (userPosition) {
    map.current?.flyTo({
      center: [userPosition.longitude, userPosition.latitude],
      zoom: 12,
      duration: 2000
    });
  } else {
    // Position pas encore disponible, zoom des qu'elle arrive
    pendingRecenter.current = true;
  }
};
```

**Code cible (gestion erreur immediate)** :
```tsx
// Dans le useEffect de geolocation
if (geolocationError && geolocationEnabled) {
  const errorMessage = geolocationError.code === 1 
    ? 'Permission de geolocalisation refusee' 
    : 'Erreur de localisation';
  toast.error(errorMessage, { duration: 5000 });
}
```

---

### 2. `src/components/ProximityDetector.tsx`

**Probleme actuel** : Ce composant utilise son propre etat local `permissionRequested` au lieu du toggle global.

**Modifications** :

- **Utiliser `userProgress.geolocationEnabled`** au lieu de `permissionRequested`
- **Le bouton "Activer la localisation"** appelle `toggleGeolocation()` du contexte global
- Cela synchronise la section "Decouvrez les lieux sacres" avec le header

**Code cible** :
```tsx
const ProximityDetector = () => {
  const { userProgress, toggleGeolocation } = useApp();
  const geolocationEnabled = userProgress.geolocationEnabled;
  const { position, error, loading } = useGeolocation(geolocationEnabled);
  
  // ...
  
  if (!geolocationEnabled) {
    return (
      <Card className="p-6 text-center ...">
        {/* ... */}
        <Button onClick={toggleGeolocation} size="lg">
          <Navigation className="w-4 h-4 mr-2" />
          Activer la localisation
        </Button>
      </Card>
    );
  }
  
  // ...reste du composant
};
```

---

## Comportement final attendu

| Action | Resultat |
|--------|----------|
| Toggle header ON | Active la geolocation, affiche erreur si permission refusee |
| Toggle header OFF | Desactive la geolocation, masque le marqueur utilisateur |
| Bouton Recentrer (geo OFF) | Bouton grise, non cliquable |
| Bouton Recentrer (geo ON) | Zoome sur la position |
| Section "Proche" bouton | Active le toggle global (synchronise avec header) |

---

## Resume des changements

- Globe3D : bouton desactive si geo OFF + erreur immediate
- ProximityDetector : utilise le toggle global au lieu d'un etat local
- UX coherente : un seul point d'activation (header), un seul comportement

