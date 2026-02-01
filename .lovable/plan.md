
# Plan : Corriger l'audioguide sur la page Country

## Problème Identifié

L'audioguide fonctionne sur la page **PlaceDetail.tsx** (route `/place/:placeId`), mais **pas sur la page Country.tsx** (route `/country/:countryName`) où un modal de détail de lieu affiche aussi une section audioguide.

**Code actuel (Country.tsx, lignes 258-264) :**
```typescript
const handleAudioToggle = () => {
  setIsAudioPlaying(!isAudioPlaying);
  toastHook({
    title: isAudioPlaying ? "Audio en pause" : "Lecture audio",
    description: "Fonctionnalité audio à venir", // ← Ce toast !
  });
};
```

Ce code affiche le toast "Fonctionnalité audio à venir" au lieu d'utiliser le hook `useAudioGuide`.

---

## Solution

Intégrer le hook `useAudioGuide` dans Country.tsx de la même manière que dans PlaceDetail.tsx.

---

## Modifications dans `src/pages/Country.tsx`

### 1. Ajouter l'import du hook

```typescript
// Ligne 1-30 (section imports)
import { useAudioGuide } from '@/hooks/useAudioGuide';
```

### 2. Initialiser le hook

```typescript
// Après les autres hooks (ligne ~45)
const audioGuide = useAudioGuide();
```

### 3. Supprimer l'état local inutile

```typescript
// Supprimer cette ligne (ligne 43)
const [isAudioPlaying, setIsAudioPlaying] = useState(false);
```

### 4. Remplacer la fonction handleAudioToggle

```typescript
const handleAudioToggle = () => {
  if (!selectedPlace?.description) {
    toastHook({
      title: "Aucun contenu audio",
      description: "Ce lieu n'a pas de description disponible",
      variant: "destructive"
    });
    return;
  }

  if (audioGuide.state.isPlaying) {
    audioGuide.pause();
  } else if (audioGuide.state.isPaused) {
    audioGuide.resume();
  } else {
    audioGuide.play(selectedPlace.description, selectedPlace.id);
  }
};
```

### 5. Ajouter les fonctions utilitaires

```typescript
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!audioGuide.state.duration) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percentage = x / rect.width;
  const time = percentage * audioGuide.state.duration;
  audioGuide.seek(time);
};
```

### 6. Mettre à jour l'interface du lecteur audio (lignes 700-740)

**Avant :**
```jsx
<div className="flex items-center gap-4">
  <Button onClick={handleAudioToggle} variant="outline" size="lg" className="gap-2">
    {isAudioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
    {isAudioPlaying ? 'Pause' : 'Écouter'}
  </Button>
  <Button variant="ghost" size="lg" className="gap-2">
    <Download className="w-5 h-5" />
    Télécharger
  </Button>
</div>
{isAudioPlaying && (
  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
    <div className="h-full bg-primary animate-pulse w-1/3" />
  </div>
)}
```

**Après :**
```jsx
<div className="flex items-center gap-4">
  <Button
    onClick={handleAudioToggle}
    variant="outline"
    size="lg"
    className="gap-2"
    disabled={audioGuide.state.isLoading}
  >
    {audioGuide.state.isLoading ? (
      <>
        <Loader2 className="w-5 h-5 animate-spin" />
        Chargement...
      </>
    ) : audioGuide.state.isPlaying ? (
      <>
        <Pause className="w-5 h-5" />
        Pause
      </>
    ) : audioGuide.state.isPaused ? (
      <>
        <Play className="w-5 h-5" />
        Reprendre
      </>
    ) : (
      <>
        <Play className="w-5 h-5" />
        Écouter
      </>
    )}
  </Button>
  <Button
    variant="ghost"
    size="lg"
    className="gap-2"
    onClick={() => selectedPlace && audioGuide.download(selectedPlace.name)}
    disabled={!audioGuide.state.duration}
  >
    <Download className="w-5 h-5" />
    Télécharger
  </Button>
</div>

{/* Barre de progression */}
{(audioGuide.state.isPlaying || audioGuide.state.isPaused || audioGuide.state.progress > 0) && (
  <div className="space-y-2">
    <div 
      className="w-full h-2 bg-muted rounded-full overflow-hidden cursor-pointer"
      onClick={handleProgressClick}
    >
      <div 
        className="h-full bg-primary transition-all duration-300" 
        style={{ width: `${audioGuide.state.progress}%` }}
      />
    </div>
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>{formatTime(audioGuide.state.currentTime)}</span>
      <span>{formatTime(audioGuide.state.duration)}</span>
    </div>
  </div>
)}
```

### 7. Arrêter l'audio quand le modal se ferme

Ajouter un useEffect pour nettoyer l'audio :

```typescript
// Stopper l'audio quand on ferme le modal
useEffect(() => {
  if (!selectedPlace) {
    audioGuide.stop();
  }
}, [selectedPlace]);
```

---

## Fichiers Modifiés

| Fichier | Modifications |
|---------|--------------|
| `src/pages/Country.tsx` | Import du hook, remplacement de la logique audio, UI améliorée |

---

## Résultat Attendu

Après cette correction :
- Le bouton "Écouter" sur le modal de détail de lieu (page Country) génèrera l'audio via ElevenLabs
- L'état de chargement sera affiché pendant la génération
- La barre de progression sera cliquable pour naviguer dans l'audio
- Le téléchargement fonctionnera correctement
- L'audio s'arrêtera automatiquement quand le modal se ferme
