

# Plan : Ajout de photos dans le forum (Topics et Réponses)

## Objectif

Permettre aux utilisateurs de :
1. **Ajouter des photos** lors de la création d'un nouveau topic
2. **Ajouter des photos** lors de la réponse à un topic
3. **Visualiser les photos** en grand (lightbox) en cliquant dessus

---

## Architecture technique

### 1. Nouveau bucket de stockage

Créer un bucket dédié pour les photos du forum :

| Bucket | Public | Taille max | Types autorisés |
|--------|--------|------------|-----------------|
| `forum-photos` | Non (private) | 5MB | JPEG, PNG, WebP |

### 2. Modifications de la base de données

Ajouter une colonne `image_urls` aux deux tables :

```text
forum_topics
├── image_urls: TEXT[] (nullable, max 3 images)
└── ... (colonnes existantes)

forum_posts
├── image_urls: TEXT[] (nullable, max 3 images)
└── ... (colonnes existantes)
```

### 3. Mise à jour des Edge Functions

**`create-forum-topic`** : Accepter un tableau `imageUrls` optionnel
**`create-forum-post`** : Accepter un tableau `imageUrls` optionnel

### 4. Mise à jour du frontend (ForumTab.tsx)

| Composant | Modification |
|-----------|--------------|
| Dialog "Nouveau topic" | Ajouter zone d'upload photo (max 3) |
| Zone de réponse | Ajouter bouton + preview photo |
| Affichage topic | Afficher les images avec miniatures cliquables |
| Affichage posts | Afficher les images avec miniatures cliquables |
| Lightbox | Réutiliser ImageLightbox existant |

---

## Flux d'upload

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Utilisateur sélectionne photo(s)                         │
├─────────────────────────────────────────────────────────────┤
│ 2. Preview locale (FileReader)                              │
├─────────────────────────────────────────────────────────────┤
│ 3. Upload via secureUpload() → forum-photos bucket          │
├─────────────────────────────────────────────────────────────┤
│ 4. Récupération des paths                                   │
├─────────────────────────────────────────────────────────────┤
│ 5. Envoi topic/post avec imageUrls au edge function         │
├─────────────────────────────────────────────────────────────┤
│ 6. Edge function valide et stocke dans DB                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Interface utilisateur

### Création de topic

```text
┌─────────────────────────────────────────────┐
│ Créer un nouveau topic                      │
├─────────────────────────────────────────────┤
│ Titre: [________________________]           │
├─────────────────────────────────────────────┤
│ Description: [                              │
│              ________________________       │
│              ________________________]      │
├─────────────────────────────────────────────┤
│ Visibilité: ○ Privé ○ Communauté ○ Public  │
├─────────────────────────────────────────────┤
│ Photos (0/3):                               │
│ [📷 Ajouter des photos]                     │
│                                             │
│ [img1] [img2] [img3] (miniatures)           │
├─────────────────────────────────────────────┤
│         [Créer le topic]                    │
└─────────────────────────────────────────────┘
```

### Zone de réponse

```text
┌─────────────────────────────────────────────┐
│ [Écrire une réponse...               ] 📷  │
│                                             │
│ [img1] ×  (preview si photo sélectionnée)   │
├─────────────────────────────────────────────┤
│         [📤 Envoyer]                        │
└─────────────────────────────────────────────┘
```

### Affichage d'un post avec photo

```text
┌─────────────────────────────────────────────┐
│ 👤 Username • il y a 2h                     │
├─────────────────────────────────────────────┤
│ Voici ma photo de la cathédrale...          │
│                                             │
│ ┌───────┐ ┌───────┐                         │
│ │ 📷    │ │ 📷    │  ← Cliquable            │
│ │ mini  │ │ mini  │                         │
│ └───────┘ └───────┘                         │
└─────────────────────────────────────────────┘
```

---

## Fichiers à modifier

| Fichier | Modification |
|---------|--------------|
| **Migration SQL** | Créer bucket `forum-photos`, ajouter colonnes `image_urls` |
| **`src/lib/secureUpload.ts`** | Ajouter bucket 'forum-photos' au type |
| **`supabase/functions/upload-file/index.ts`** | Ajouter config pour 'forum-photos' |
| **`supabase/functions/create-forum-topic/index.ts`** | Accepter et stocker `imageUrls` |
| **`supabase/functions/create-forum-post/index.ts`** | Accepter et stocker `imageUrls` |
| **`src/components/ForumTab.tsx`** | Upload photos + affichage + lightbox |

---

## Sécurité

- **Upload validé côté serveur** via `upload-file` edge function (taille, type, signature)
- **Quota utilisateur** respecté (stockage limité par user)
- **Bucket privé** : les URLs sont signées (expiration 1h)
- **Validation HTML** : les URLs sont des paths internes, pas d'injection possible

---

## Limites

| Élément | Limite |
|---------|--------|
| Photos par topic | 3 max |
| Photos par post | 3 max |
| Taille par photo | 5 MB |
| Types acceptés | JPEG, PNG, WebP |

