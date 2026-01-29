
# Plan : Bouton flottant "Assistant" avec panneau de chat

## Résumé

Ajout d'un bouton flottant "Assistant" visible sur toutes les pages, ouvrant un panneau de chat latéral avec deux modes (Aide dans l'app / Histoire) qui communique avec une nouvelle edge function IA.

---

## Fonctionnalités

1. **Bouton flottant "Assistant"**
   - Visible sur toutes les pages (sauf splash/auth)
   - Positionné en bas à droite, au-dessus de la navigation
   - Design cohérent avec l'identité visuelle (couleur primary)

2. **Panneau de chat**
   - Ouvre depuis la droite (Sheet component existant)
   - Toggle pour choisir le mode : "Aide dans l'app" ou "Histoire"
   - Zone de messages avec scroll
   - Input pour écrire + bouton d'envoi

3. **Communication API**
   - Envoie `{ message, mode, currentRoute, selectedPlaceId }` à `/functions/v1/sacred-assistant`
   - Affiche les réponses de l'IA en temps réel

---

## Architecture des fichiers

```text
src/
├── components/
│   └── AssistantChat.tsx          # Nouveau - Composant principal
│
└── App.tsx                        # Modifié - Ajout du composant global

supabase/
├── config.toml                    # Modifié - Ajout config edge function
└── functions/
    └── sacred-assistant/
        └── index.ts               # Nouveau - Edge function IA
```

---

## Détails techniques

### 1. Composant AssistantChat.tsx

Structure du composant :
- Utilise le hook `useLocation` pour obtenir la route actuelle
- Utilise le hook `useParams` pour obtenir `placeId` si disponible
- État local pour : messages, mode sélectionné, input, loading, isOpen
- Sheet (panneau latéral) pour l'interface de chat

Éléments UI utilisés :
- `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle` (existants)
- `ToggleGroup`, `ToggleGroupItem` (existants) pour le toggle mode
- `ScrollArea` (existant) pour la zone de messages
- `Textarea` + `Button` (existants) pour l'input
- Icône `MessageCircle` ou `Bot` de Lucide pour le bouton flottant

### 2. Edge Function sacred-assistant

Utilise Lovable AI Gateway (déjà configuré avec LOVABLE_API_KEY) :
- Modèle : `google/gemini-2.5-flash` (rapide et efficace)
- Système prompt différent selon le mode :
  - **Aide** : Assistant pour naviguer dans l'app Sacred World
  - **Histoire** : Conteur d'histoires sur les lieux sacrés

### 3. Intégration dans App.tsx

- Ajout du composant `AssistantChat` au niveau global, à l'intérieur du `TooltipProvider`
- Visible partout sauf sur `/` (Splash) et `/auth`

---

## Flux de données

```text
┌──────────────────────────────────────────────────────────┐
│                    Utilisateur                           │
│                         │                                │
│                    ▼ Clique bouton                       │
│              ┌─────────────────┐                         │
│              │  AssistantChat  │                         │
│              │   (Sheet open)  │                         │
│              └────────┬────────┘                         │
│                       │                                  │
│         Écrit message + choisit mode                     │
│                       │                                  │
│                       ▼                                  │
│   ┌───────────────────────────────────────────┐          │
│   │  POST /functions/v1/sacred-assistant      │          │
│   │  {message, mode, currentRoute, placeId}   │          │
│   └───────────────────┬───────────────────────┘          │
│                       │                                  │
│                       ▼                                  │
│         ┌─────────────────────────┐                      │
│         │  Lovable AI Gateway     │                      │
│         │  (Gemini 2.5 Flash)     │                      │
│         └────────────┬────────────┘                      │
│                      │                                   │
│                      ▼                                   │
│              Réponse affichée                            │
└──────────────────────────────────────────────────────────┘
```

---

## Interface utilisateur

**Bouton flottant :**
- Position : `fixed bottom-24 right-4` (au-dessus de BottomNavigation)
- Style : Cercle avec icône, fond primary, shadow
- Animation : pulse subtle pour attirer l'attention

**Panneau chat :**
- Header : Titre "Assistant Sacred World" + bouton fermer
- Toggle modes : 2 boutons "Aide dans l'app" / "Histoire"
- Zone messages : Liste scrollable, bulles de chat
- Input : Textarea + bouton envoi

---

## Sécurité

- Edge function avec `verify_jwt = true` (utilisateur authentifié requis)
- Validation des entrées (message non vide, mode valide)
- Rate limiting côté serveur recommandé
- Pas de données sensibles exposées

---

## Étapes d'implémentation

1. Créer l'edge function `sacred-assistant` avec prompts IA
2. Mettre à jour `supabase/config.toml` avec la config JWT
3. Créer le composant `AssistantChat.tsx`
4. Intégrer dans `App.tsx`
5. Tester les deux modes de conversation

