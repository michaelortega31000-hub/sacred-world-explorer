

# Plan : Enrichir et améliorer la galerie d'avatars

## Résumé des demandes

| Action | Détail |
|--------|--------|
| **Spirituels** | Ajouter croix latine ✝️, Main de Fatma (Hamsa) 🪬, Étoile de David ✡️, Croissant ☪️ |
| **Nature** | Ajouter plus de fleurs, arbres, feuilles 🌿🌺🌻 |
| **Moderne** | Ajouter boussole 🧭, fusée 🚀, diamant 💎 |
| **Statues/Musées** | Nouvelle catégorie avec statues 🗿, colonnes 🏛️, amphore 🏺 |
| **Abstraits** | **Supprimer** cette catégorie |

---

## Nouveaux avatars à ajouter

### Catégorie "Spirituels" (4 nouveaux)

| Emoji | Nom | Code OpenMoji | URL |
|-------|-----|---------------|-----|
| ✝️ | Croix Latine | 271D | `https://openmoji.org/data/color/svg/271D.svg` |
| 🪬 | Main de Fatma | 1FAAC | `https://openmoji.org/data/color/svg/1FAAC.svg` |
| ✡️ | Étoile de David | 2721 | `https://openmoji.org/data/color/svg/2721.svg` |
| ☪️ | Croissant | 262A | `https://openmoji.org/data/color/svg/262A.svg` |

### Catégorie "Nature" (4 nouveaux)

| Emoji | Nom | Code OpenMoji | URL |
|-------|-----|---------------|-----|
| 🌿 | Feuille | 1F33F | `https://openmoji.org/data/color/svg/1F33F.svg` |
| 🌺 | Hibiscus | 1F33A | `https://openmoji.org/data/color/svg/1F33A.svg` |
| 🌻 | Tournesol | 1F33B | `https://openmoji.org/data/color/svg/1F33B.svg` |
| 🌴 | Palmier | 1F334 | `https://openmoji.org/data/color/svg/1F334.svg` |

### Catégorie "Moderne" (3 nouveaux)

| Emoji | Nom | Code OpenMoji | URL |
|-------|-----|---------------|-----|
| 🧭 | Boussole | 1F9ED | `https://openmoji.org/data/color/svg/1F9ED.svg` |
| 🚀 | Fusée | 1F680 | `https://openmoji.org/data/color/svg/1F680.svg` |
| 💎 | Diamant | 1F48E | `https://openmoji.org/data/color/svg/1F48E.svg` |

### Nouvelle catégorie "Musées" (4 avatars)

| Emoji | Nom | Code OpenMoji | URL |
|-------|-----|---------------|-----|
| 🗿 | Moaï | 1F5FF | `https://openmoji.org/data/color/svg/1F5FF.svg` |
| 🏛️ | Temple Grec | 1F3DB | `https://openmoji.org/data/color/svg/1F3DB.svg` |
| 🏺 | Amphore | 1F3FA | `https://openmoji.org/data/color/svg/1F3FA.svg` |
| 🎭 | Masques | 1F3AD | `https://openmoji.org/data/color/svg/1F3AD.svg` |

---

## Avatars à supprimer

| ID | Nom | Catégorie |
|----|-----|-----------|
| `5b260771-f86a-4f15-a673-3fff262fc66a` | Cyclone | abstract |
| `efd78e90-b6e5-468b-b4e7-fe1f2d3a6aba` | Étincelle | abstract |

---

## Mise à jour du code

Le fichier `src/pages/AvatarsGallery.tsx` et `src/components/profile/DefaultAvatarSelector.tsx` contiennent les labels de catégories. Il faudra ajouter :

```typescript
const categoryLabels: Record<string, string> = {
  spiritual: 'Spirituels',
  nature: 'Nature',
  modern: 'Modernes',
  museum: 'Musées',  // ← Nouvelle catégorie
  // abstract: supprimé
  legendary: 'Légendaires',
  epic: 'Épiques',
  rare: 'Rares',
  achievement: 'Accomplissements'
};
```

---

## Résumé final

| Catégorie | Avant | Après |
|-----------|-------|-------|
| Spirituels | 3 | **7** (+4) |
| Nature | 2 | **6** (+4) |
| Moderne | 2 | **5** (+3) |
| Musées | 0 | **4** (nouveau) |
| Abstraits | 2 | **0** (supprimé) |
| **Total accessible** | **9** | **22** |

---

## Fichiers à modifier

| Fichier | Modification |
|---------|--------------|
| Migration SQL | INSERT nouveaux avatars, DELETE abstraits |
| `src/pages/AvatarsGallery.tsx` | Ajouter label "museum", supprimer "abstract" |
| `src/components/profile/DefaultAvatarSelector.tsx` | Idem |

