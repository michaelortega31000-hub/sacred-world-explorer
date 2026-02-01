
# Plan : Mise à jour des avatars par défaut

## Problème identifié

Les avatars actuels ne correspondent pas à leurs catégories :

| Catégorie | Style actuel | Problème |
|-----------|--------------|----------|
| Spirituels | `bottts` (robots) | Des robots pour la spiritualité ! |
| Nature | `thumbs` (pouces) | Aucun rapport avec la nature |
| Modernes | `lorelei` | Pas vraiment "moderne" |
| Abstraits | `shapes` | Correct |

## Solution proposée

Utiliser des styles DiceBear plus appropriés et des emojis/symboles cohérents avec le thème de SacredWorld :

### Catégorie "Spirituels" (3 avatars)
Utiliser le style `identicon` ou `initials` avec des couleurs apaisantes, ou mieux : des emojis spirituels via OpenMoji :

| Avatar | Nouveau style | Description |
|--------|---------------|-------------|
| Spirituel 1 | 🕉️ Om | Symbole hindou/bouddhiste |
| Spirituel 2 | ☯️ Yin-Yang | Harmonie et équilibre |
| Spirituel 3 | 🪷 Lotus | Fleur sacrée |

**URLs suggérées (OpenMoji SVG) :**
- `https://openmoji.org/data/color/svg/1F549.svg` (Om)
- `https://openmoji.org/data/color/svg/262F.svg` (Yin-Yang)
- `https://openmoji.org/data/color/svg/1FAB7.svg` (Lotus)

### Catégorie "Nature" (2 avatars)
| Avatar | Nouveau style | Description |
|--------|---------------|-------------|
| Nature 1 | 🌳 Arbre | Symbole de vie |
| Nature 2 | 🌸 Fleur | Nature en floraison |

**URLs suggérées :**
- `https://openmoji.org/data/color/svg/1F333.svg` (Arbre)
- `https://openmoji.org/data/color/svg/1F338.svg` (Fleur de cerisier)

### Catégorie "Modernes" (2 avatars)
| Avatar | Nouveau style | Description |
|--------|---------------|-------------|
| Moderne 1 | 🌐 Globe | Exploration mondiale |
| Moderne 2 | ✨ Étoiles | Découverte |

**URLs suggérées :**
- `https://openmoji.org/data/color/svg/1F310.svg` (Globe)
- `https://openmoji.org/data/color/svg/2728.svg` (Étoiles scintillantes)

### Catégorie "Abstraits" (2 avatars)
Garder les formes géométriques mais avec des seeds plus élégants.

---

## Modification en base de données

Migration SQL pour mettre à jour les URLs des avatars existants :

```sql
UPDATE default_avatars SET avatar_url = 'https://openmoji.org/data/color/svg/1F549.svg', name = 'Om' WHERE id = '3c728cb5-8b8b-4693-ab0a-6fbd7fbfeaf4';
UPDATE default_avatars SET avatar_url = 'https://openmoji.org/data/color/svg/262F.svg', name = 'Yin-Yang' WHERE id = 'c444e437-065c-4ce4-9968-393c08ebfaae';
-- etc.
```

---

## Catégories concernées

| Catégorie | Nombre d'avatars | Action |
|-----------|------------------|--------|
| Spirituels | 3 | Remplacer par emojis spirituels |
| Nature | 2 | Remplacer par emojis nature |
| Modernes | 2 | Remplacer par emojis exploration |
| Abstraits | 2 | Améliorer légèrement |
| Légendaires | 4 | Garder (exclusifs) |
| Épiques | 2 | Garder (exclusifs) |
| Rares | 2 | Garder (exclusifs) |
| Accomplissements | 3 | Garder (exclusifs) |

---

## Impact

- **Expérience utilisateur** : Avatars cohérents avec le thème spirituel/culturel de SacredWorld
- **Pas de code à modifier** : Seules les URLs en base de données changent
- **Rétrocompatibilité** : Les utilisateurs ayant ces avatars verront automatiquement les nouveaux

---

## Alternative

Si les URLs OpenMoji posent problème (CORS, disponibilité), on peut utiliser :
1. **Twemoji** de Twitter : `https://twemoji.maxcdn.com/v/latest/svg/`
2. **Noto Emoji** de Google
3. **Uploader les SVG** dans le bucket Supabase

