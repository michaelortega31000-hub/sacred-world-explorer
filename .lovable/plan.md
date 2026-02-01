

# Plan : Implémenter l'Audioguide avec ElevenLabs TTS

## Résumé

Quand l'utilisateur clique sur "Écouter" dans la section Audio-guide d'un lieu sacré, le texte de la section "À savoir" (description du lieu) sera converti en audio via l'API ElevenLabs et lu à haute voix.

---

## Architecture Technique

```text
┌─────────────────────────────────────────────────────────────┐
│                    PlaceDetail.tsx                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ "À savoir"                                            │ │
│  │ Chef-d'œuvre de l'architecture gothique française...  │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│                           ▼                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🎧 Audio-guide           [▶ Écouter] [⬇ Télécharger]  │ │
│  │ ████████░░░░░░░░░░░░░░░░░░░  35%  1:12 / 2:05         │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼ POST { text, voiceId }
┌─────────────────────────────────────────────────────────────┐
│           Edge Function: elevenlabs-tts                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 1. Authentifie l'utilisateur                          │ │
│  │ 2. Vérifie le rate limit (50 requêtes/jour)           │ │
│  │ 3. Appelle ElevenLabs API                             │ │
│  │ 4. Retourne le blob audio MP3                         │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼ audio/mpeg blob
┌─────────────────────────────────────────────────────────────┐
│                   Navigateur                                │
│  new Audio(URL.createObjectURL(blob)).play()               │
└─────────────────────────────────────────────────────────────┘
```

---

## Fichiers à Créer/Modifier

| Fichier | Action | Description |
|---------|--------|-------------|
| `supabase/functions/elevenlabs-tts/index.ts` | Créer | Edge function pour convertir texte → audio |
| `src/hooks/useAudioGuide.ts` | Créer | Hook React pour gérer la lecture audio |
| `src/pages/PlaceDetail.tsx` | Modifier | Intégrer le hook et améliorer le lecteur |

---

## Partie 1 : Edge Function ElevenLabs TTS

### Fichier : `supabase/functions/elevenlabs-tts/index.ts`

Cette function serveur protège la clé API et gère :
- Authentification utilisateur
- Rate limiting (50 requêtes/jour par utilisateur)
- Appel à l'API ElevenLabs
- Retour du blob audio MP3

**Paramètres :**
- `text` : Le texte à convertir (description du lieu)
- `voiceId` : ID de la voix ElevenLabs (défaut : voix française "Laura")

**Voix recommandée :** `FGY2WhTYpPnrIDTdsKH5` (Laura) - voix féminine française naturelle

---

## Partie 2 : Hook useAudioGuide

### Fichier : `src/hooks/useAudioGuide.ts`

Hook personnalisé pour gérer l'état complet du lecteur audio :

```typescript
interface AudioGuideState {
  isLoading: boolean;      // Chargement en cours
  isPlaying: boolean;      // Lecture en cours
  isPaused: boolean;       // En pause
  progress: number;        // Progression (0-100)
  currentTime: number;     // Temps actuel (secondes)
  duration: number;        // Durée totale (secondes)
  error: string | null;    // Message d'erreur
}

interface UseAudioGuideReturn {
  state: AudioGuideState;
  play: (text: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (time: number) => void;
  download: () => void;
}
```

**Fonctionnalités :**
- Génère l'audio via l'edge function
- Met en cache l'audio généré (évite les appels répétés)
- Gère play/pause/stop/seek
- Affiche progression et temps restant
- Permet le téléchargement du fichier MP3

---

## Partie 3 : Amélioration du Lecteur Audio

### Modifications dans `PlaceDetail.tsx`

**Avant :**
```tsx
const handleAudioToggle = () => {
  setIsAudioPlaying(!isAudioPlaying);
  // TODO: Implémenter avec ElevenLabs
  toast({ title: "Fonctionnalité audio à venir" });
};
```

**Après :**
```tsx
const audioGuide = useAudioGuide();

const handleAudioToggle = () => {
  if (audioGuide.state.isPlaying) {
    audioGuide.pause();
  } else if (audioGuide.state.isPaused) {
    audioGuide.resume();
  } else {
    audioGuide.play(place.description);
  }
};
```

### Interface Utilisateur Améliorée

```text
┌─────────────────────────────────────────────────────────────┐
│  🎧 Audio-guide                                             │
│                                                             │
│  Écoutez l'histoire fascinante de ce lieu                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ████████████░░░░░░░░░░░░░░░░░░░░░░░  35%               ││
│  └─────────────────────────────────────────────────────────┘│
│  1:12                                              2:05     │
│                                                             │
│  [⏸ Pause]  [⬇ Télécharger]  [🔊 Volume]                  │
│                                                             │
│  Voix : Laura (FR)                                          │
└─────────────────────────────────────────────────────────────┘
```

**Éléments UI :**
1. **Barre de progression** cliquable (seek)
2. **Affichage temps** : temps écoulé / durée totale
3. **Bouton dynamique** : ▶ Écouter / ⏸ Pause / ▶ Reprendre
4. **Bouton télécharger** : Sauvegarde le MP3 localement
5. **État de chargement** : Spinner pendant la génération

---

## Partie 4 : Secret API ElevenLabs

Une clé API ElevenLabs sera nécessaire pour faire fonctionner l'audioguide.

**Variable d'environnement :** `ELEVENLABS_API_KEY`

L'utilisateur devra :
1. Créer un compte sur elevenlabs.io
2. Obtenir une clé API depuis le dashboard
3. La configurer dans les secrets du projet

---

## Gestion des Erreurs

| Scénario | Comportement |
|----------|--------------|
| Pas connecté | Toast "Connexion requise" |
| Rate limit atteint | Toast "Limite de 50 écoutes/jour atteinte" |
| Clé API manquante | Toast "Service audio non disponible" |
| Erreur réseau | Toast avec option de réessayer |
| Texte trop long (>5000 car) | Découpage automatique en segments |

---

## Mise en Cache

Pour éviter les appels API répétés :

1. **Cache mémoire** : L'audio généré est stocké en mémoire pendant la session
2. **Clé de cache** : `placeId` (un audio par lieu)
3. **Comportement** : Si l'audio existe déjà, lecture directe sans appel API

---

## Estimation des Coûts

| Élément | Valeur |
|---------|--------|
| Longueur moyenne description | ~150 mots (~800 caractères) |
| Durée audio estimée | ~1-2 minutes |
| Coût ElevenLabs | ~$0.0003 par caractère (Starter) |
| Coût par lieu | ~$0.24 |
| 316 lieux (si tous écoutés) | ~$76 total |

**Optimisation :** Le rate limit de 50/jour par utilisateur limite naturellement les coûts.

---

## Prérequis

Avant de commencer l'implémentation, il faudra :

1. **Configurer le secret ElevenLabs** : Une clé API ElevenLabs devra être ajoutée au projet
2. **Choisir une voix** : Laura (FR) recommandée, mais d'autres voix françaises sont disponibles

---

## Résultat Attendu

Après cette implémentation :
- L'utilisateur clique sur "Écouter" sur n'importe quel lieu
- Le texte "À savoir" est converti en audio naturel
- Un lecteur audio complet s'affiche avec progression
- L'audio peut être mis en pause, repris, ou téléchargé
- Fonctionne pour les 316 lieux de l'application

