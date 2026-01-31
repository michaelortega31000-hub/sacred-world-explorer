

# Plan : Correction des saints dans le calendrier et de l'icône de religion

## Problèmes identifiés

### Problème 1 : Saints non visibles sur le calendrier
**Cause racine** : Dans `CalendarTab.tsx` (ligne 72), le code utilise `religiousEvents2026` directement quand le filtre est "Toutes traditions", ce qui exclut les saints.

```typescript
// Ligne 72 - PROBLÈME ACTUEL
const filteredReligiousEvents = traditionFilter === 'all' 
  ? religiousEvents2026  // ← Exclut les saints !
  : getEventsByTradition(traditionFilter);
```

Les saints sont UNIQUEMENT inclus dans `getEventsByTradition('christianity')`, donc ils n'apparaissent que si vous sélectionnez le filtre "Chrétiennes".

**Note importante** : C'est le comportement voulu selon le design (saints visibles UNIQUEMENT avec filtre Christianisme). Si vous voulez les voir, sélectionnez le filtre ✝️ "Chrétiennes".

### Problème 2 : Icône de religion manquante dans le header
**Cause racine** : La base de données montre `selected_religion: null` pour tous les utilisateurs. Le code de synchronisation écrase la valeur locale avec la valeur de la base de données.

---

## Solutions proposées

### Solution 1a : Vérifier que les saints fonctionnent avec le filtre Christianisme
Pas de modification nécessaire - les saints apparaîtront quand vous sélectionnerez le filtre "Chrétiennes" ✝️ dans le calendrier.

### Solution 1b (Alternative) : Afficher les saints AUSSI dans "Toutes traditions"
Si vous souhaitez que les saints apparaissent même avec le filtre "Toutes traditions", je peux modifier `CalendarTab.tsx` :

```typescript
// Nouvelle logique
const filteredReligiousEvents = traditionFilter === 'all' 
  ? [...religiousEvents2026, ...catholicSaints2026]  // Inclure aussi les saints
  : getEventsByTradition(traditionFilter);
```

### Solution 2 : Corriger la persistance de la religion sélectionnée

#### Fichier : `src/contexts/AppContext.tsx`

Le problème est dans le chargement initial depuis la base de données. Quand `selected_religion` est `null` en base, il écrase la valeur locale.

**Modification à apporter :**
- Lors du chargement depuis la base de données, préserver la valeur locale si la valeur en base est `null`
- S'assurer que la synchronisation vers la base fonctionne correctement

```typescript
// Dans loadProgressFromDB() - Préserver la religion locale si elle existe
const dbProgress: UserProgress = {
  selectedReligion: data.selected_religion as Religion | null 
    || localProgress?.selectedReligion || null,  // ← Fallback sur valeur locale
  // ... reste du code
};
```

---

## Fichiers à modifier

| Fichier | Modification |
|---------|--------------|
| `src/components/CalendarTab.tsx` | Optionnel : Inclure saints dans "Toutes traditions" |
| `src/contexts/AppContext.tsx` | Préserver `selectedReligion` locale lors de la synchronisation |

---

## Recommandation immédiate

1. **Pour voir les saints maintenant** : Allez sur le calendrier et cliquez sur le filtre ✝️ "Chrétiennes". Saint Jean Bosco apparaîtra le 31 janvier.

2. **Pour l'icône de religion** : Le correctif dans AppContext préservera votre sélection même si la base de données n'a pas encore la valeur.

---

## Impact
- Les saints seront visibles avec le filtre Christianisme (comportement actuel)
- L'icône de religion (croix bleue) restera visible même après rechargement de la page
- Synchronisation améliorée entre localStorage et base de données

