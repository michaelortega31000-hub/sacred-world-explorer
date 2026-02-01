
# Plan : Correction de l'affichage de la photo de profil

## Problème identifié

L'upload de la photo de profil réussit (message de succès affiché), mais l'image ne s'affiche pas. Deux causes ont été identifiées :

### Cause 1 : Bucket de stockage privé
Le bucket `avatars` est actuellement configuré en mode **privé** (`public: false`), mais le code génère des URLs publiques. Résultat : le navigateur ne peut pas charger l'image car l'URL publique d'un bucket privé renvoie une erreur 403.

### Cause 2 : Problème de synchronisation de l'état
Après l'upload, le code :
1. Met à jour l'état avec un cache buster : `setAvatarUrl(url?t=123)`
2. Puis appelle immédiatement `fetchAvatar()` qui écrase cette valeur

---

## Solution proposée

### Étape 1 : Rendre le bucket avatars public
Le bucket avatars doit être public car les photos de profil sont visibles par tous les utilisateurs (classements, profils publics, etc.).

```sql
UPDATE storage.buckets 
SET public = true 
WHERE id = 'avatars';
```

### Étape 2 : Corriger la logique de rafraîchissement
Dans `Profile.tsx`, supprimer l'appel à `fetchAvatar()` après l'upload réussi, car l'état est déjà mis à jour localement avec le cache buster.

**Avant :**
```typescript
setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
toast({ ... });
if (userId) {
  await fetchAvatar(userId); // ❌ Écrase la valeur
}
```

**Après :**
```typescript
setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
toast({ ... });
// Pas de fetchAvatar() ici - l'état est déjà à jour
```

---

## Fichiers à modifier

| Fichier | Modification |
|---------|--------------|
| Migration SQL | Remettre le bucket avatars en public |
| `src/pages/Profile.tsx` | Supprimer l'appel à `fetchAvatar()` après upload |

---

## Impact

- **Base de données** : Le bucket avatars sera accessible publiquement (comportement attendu pour les photos de profil)
- **Sécurité** : Les politiques RLS existantes restent en place pour contrôler qui peut upload/modifier/supprimer
- **UX** : L'avatar s'affichera immédiatement après l'upload sans nécessiter de rafraîchissement

---

## Vérification

Après correction :
1. Uploader une nouvelle photo de profil
2. L'avatar doit s'afficher immédiatement dans l'interface
3. L'URL doit être accessible publiquement
