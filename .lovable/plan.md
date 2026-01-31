
# Plan : Remplacer le classement par religion par un classement des amis

## Resume

Transformer l'onglet "Classement par religion" en "Classement amis et communaute" qui affichera un classement des amis de l'utilisateur connecte, bases sur leurs points.

---

## Modifications

### 1. Renommer et modifier `ReligionRankingTab.tsx` → `FriendsRankingTab.tsx`

**Nouveau composant** qui :
- Recupere les amis de l'utilisateur connecte depuis la table `friendships`
- Recupere leurs points depuis la vue `public_user_stats`
- Affiche un classement trie par points (decroissant)
- Affiche la position de l'utilisateur dans ce classement

**Structure du composant** :

```text
┌─────────────────────────────────────────────┐
│  👥 Classement Amis                         │
│  Comparez-vous à vos amis                   │
├─────────────────────────────────────────────┤
│  🥇 #1  Sophie      1,250 pts  ████████     │
│  🥈 #2  Marc          890 pts  ██████       │
│  🥉 #3  Julie         720 pts  █████        │
│  ⭐ #4  VOUS          450 pts  ███   ← vous │
│     #5  Thomas        320 pts  ██           │
├─────────────────────────────────────────────┤
│  💡 Ajoutez des amis pour les defier !      │
│     [Ajouter des amis]                      │
└─────────────────────────────────────────────┘
```

**Donnees affichees** :
- Avatar + nom d'utilisateur
- Points totaux
- Barre de progression (relative au meilleur score)
- Position dans le classement
- L'utilisateur actuel est mis en evidence

**Cas particuliers** :
- Si pas d'amis : message invitant a en ajouter avec un bouton vers l'onglet Social
- Si non connecte : message demandant de se connecter

---

### 2. Modifier `RankingsTab.tsx`

**Changements** :
- Remplacer l'import de `ReligionRankingTab` par `FriendsRankingTab`
- Changer l'icone de `Users` (deja correcte) 
- Mettre a jour le libelle du tab : "Classement amis"
- Mettre a jour la valeur du tab de `religion` → `friends`

---

### 3. Creer `FriendsRankingTab.tsx`

**Logique de recuperation des donnees** :

1. Recuperer l'ID de l'utilisateur connecte depuis `session`
2. Recuperer tous les amis acceptes depuis `friendships` (user_id OU friend_id)
3. Recuperer les stats de ces amis + l'utilisateur depuis `public_user_stats`
4. Trier par `total_points` decroissant
5. Afficher avec mise en evidence de l'utilisateur

**Requete principale** :
- D'abord recuperer les IDs des amis depuis `friendships`
- Puis recuperer leurs stats depuis `public_user_stats`
- Inclure l'utilisateur actuel dans le classement

---

### 4. Supprimer `ReligionRankingTab.tsx`

Le fichier ne sera plus utilise une fois remplace.

---

## Fichiers concernes

| Fichier | Action |
|---------|--------|
| `src/components/FriendsRankingTab.tsx` | Creer (nouveau) |
| `src/components/RankingsTab.tsx` | Modifier (import + tab) |
| `src/components/ReligionRankingTab.tsx` | Supprimer |

---

## Details techniques

### Structure du nouveau composant FriendsRankingTab

```tsx
// Hooks utilises
const { session } = useApp();
const [friends, setFriends] = useState([]);
const [loading, setLoading] = useState(true);

// Requete Supabase
1. SELECT friend_id FROM friendships WHERE user_id = currentUser AND status = 'accepted'
2. SELECT user_id FROM friendships WHERE friend_id = currentUser AND status = 'accepted'
3. Combiner les IDs uniques
4. SELECT * FROM public_user_stats WHERE id IN (friendIds + currentUserId)
5. Trier par total_points DESC
```

### Affichage conditionnel

- **Non connecte** : Message "Connectez-vous pour voir le classement de vos amis"
- **Pas d'amis** : Message "Vous n'avez pas encore d'amis" + Bouton "Trouver des amis"
- **Avec amis** : Liste classee avec l'utilisateur mis en surbrillance

---

## Comportement final

| Element | Description |
|---------|-------------|
| Onglet "Mon classement" | Inchange - vos stats personnelles |
| Onglet "Par pays" | Inchange - classement par pays |
| Onglet "Amis" | Nouveau - classement entre amis |

L'utilisateur peut :
- Voir sa position parmi ses amis
- Cliquer sur un ami pour voir son profil
- Ajouter des amis s'il n'en a pas encore
