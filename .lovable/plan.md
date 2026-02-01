

# Plan : Correction du filtrage des topics par religion + option "Tout public"

## Problème identifié

Actuellement, quand un utilisateur choisit "Islam" :
- Il voit encore les topics "Christianity" dans l'onglet "Par religion"
- Le frontend filtre uniquement par `visibility` (private/public), pas par `religion`
- Les RLS policies existent mais ne suffisent pas car la requête retourne quand même les données

### Données actuelles en base

| Topic | Religion | Visibility |
|-------|----------|------------|
| messe | christianity | public |
| pelerinage | null | public |

L'utilisateur avec `selected_religion: islam` voit les deux topics alors qu'il ne devrait voir que ceux de sa religion.

---

## Solution proposée

### 1. Modifier les options de visibilité (3 choix au lieu de 2)

| Option | Comportement |
|--------|--------------|
| **Privé (Amis)** | Visible uniquement par les amis |
| **Communauté** | Visible uniquement par les utilisateurs de la même religion |
| **Tout public** | Visible par tout le monde |

### 2. Modifier la structure de données

Ajouter une nouvelle valeur `visibility: 'global'` pour les topics accessibles à tous :

```typescript
visibility: 'private' | 'public' | 'global'
```

- `private` = amis seulement
- `public` = même religion (comportement actuel)
- `global` = tout le monde

### 3. Mettre à jour le frontend (`ForumTab.tsx`)

Modifier `getFilteredAndSortedTopics()` pour filtrer correctement :

```typescript
const getFilteredAndSortedTopics = () => {
  let filtered = topics;
  
  if (forumTab === 'friends') {
    // Onglet "Mes amis" : uniquement les topics privés
    filtered = topics.filter(t => t.visibility === 'private');
  } else {
    // Onglet "Par religion" : topics de ma religion OU globaux
    const userReligion = userProgress.selectedReligion;
    filtered = topics.filter(t => 
      t.visibility === 'global' || 
      (t.visibility === 'public' && t.religion === userReligion)
    );
  }
  // ... reste du code (search, sort)
};
```

### 4. Mettre à jour l'UI de création de topic

```
┌─────────────────────────────────────────┐
│ 🔒 Privé (Amis)                         │
│    Visible uniquement par vos amis      │
├─────────────────────────────────────────┤
│ 👥 Communauté (Islam)                   │
│    Visible par les utilisateurs Islam   │
├─────────────────────────────────────────┤
│ 🌍 Tout public                          │
│    Visible par tout le monde            │
└─────────────────────────────────────────┘
```

### 5. Mettre à jour l'edge function `create-forum-topic`

Accepter les 3 valeurs de visibility :
- `private` : ne pas stocker de religion
- `public` : stocker la religion de l'utilisateur
- `global` : ne pas stocker de religion (accessible à tous)

### 6. Mettre à jour les RLS policies

```sql
-- Politique mise à jour pour forum_topics SELECT
DROP POLICY IF EXISTS "Users can view topics based on visibility" ON forum_topics;

CREATE POLICY "Users can view topics based on visibility" 
ON forum_topics FOR SELECT
USING (
  CASE
    -- Topics privés : auteur ou ami
    WHEN visibility = 'private' THEN 
      (auth.uid() = author_id) OR is_friend_of(auth.uid(), author_id)
    -- Topics globaux : tout le monde peut voir
    WHEN visibility = 'global' THEN true
    -- Topics publics (communauté) : même religion ou auteur
    WHEN visibility = 'public' THEN 
      (auth.uid() = author_id) OR 
      (religion IS NOT NULL AND religion = get_user_religion(auth.uid()))
    ELSE false
  END
);
```

---

## Fichiers à modifier

| Fichier | Modification |
|---------|--------------|
| `src/components/ForumTab.tsx` | Ajouter filtrage par religion, option "global" |
| `supabase/functions/create-forum-topic/index.ts` | Accepter visibility "global" |
| Migration SQL | Mettre à jour la RLS policy |

---

## Résumé des changements

```text
AVANT                           APRÈS
─────                           ─────
[Privé] [Public]                [Privé] [Communauté] [Tout public]
                                
Filtrage: visibility only       Filtrage: visibility + religion
                                
Topics visibles: tous           Topics visibles: 
                                - Privé → amis
                                - Public → même religion
                                - Global → tout le monde
```

---

## Impact

- **Sécurité** : Les utilisateurs ne verront que les topics appropriés à leur religion
- **Flexibilité** : Possibilité de créer des topics visibles par tous
- **Rétrocompatibilité** : Les anciens topics `public` sans religion seront traités comme `global`

