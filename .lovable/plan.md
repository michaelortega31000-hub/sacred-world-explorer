

# Plan : Restaurer l'icône de religion dans le Header

## Problème identifié
L'utilisateur signale que l'icône de religion (croix bleue pour le christianisme) n'apparaît plus dans le header à côté du bouton de géolocalisation sur la page `/explore`.

## Analyse du code actuel

En examinant le fichier `src/components/Header.tsx`, le code pour afficher l'icône de religion existe bien aux lignes 84-88 :

```tsx
{/* Indicateur de religion */}
{userProgress.selectedReligion && religionColor && (
  <div className={`flex items-center justify-center p-1.5 sm:p-2 ${religionColor.bg} rounded-full`}>
    <div className={religionColor.text}>
      {getReligionIcon(userProgress.selectedReligion)}
    </div>
  </div>
)}
```

L'icône devrait s'afficher si :
- `userProgress.selectedReligion` n'est pas `null` (l'utilisateur a choisi "christianity")
- `religionColor` est défini (ce qui est le cas pour "christianity" dans `religionColors.ts`)

## Diagnostic probable

Le code semble correct. Les causes possibles sont :

1. **État non synchronisé** : La valeur `selectedReligion` n'est pas correctement chargée depuis localStorage ou la base de données
2. **Condition mal évaluée** : Un problème avec l'opérateur `&&` si `religionColor` est `undefined`
3. **Icône masquée par CSS** : Un problème de z-index ou de visibilité

## Solution proposée

Vérifier que l'icône est bien présente et ajouter un rendu de secours pour assurer sa visibilité :

### Fichier : `src/components/Header.tsx`

```typescript
// Ligne 75 - Assurer que religionColor a une valeur de fallback
const religionColor = userProgress.selectedReligion 
  ? religionColors[userProgress.selectedReligion] 
  : null;

// Lignes 84-88 - L'indicateur de religion est déjà présent
// Vérifier que le rendu est correct
{userProgress.selectedReligion && religionColor && (
  <div 
    className={`flex items-center justify-center p-1.5 sm:p-2 ${religionColor.bg} rounded-full`} 
    title={userProgress.selectedReligion}
  >
    <div className={religionColor.text}>
      {getReligionIcon(userProgress.selectedReligion)}
    </div>
  </div>
)}
```

## Action recommandée

Le code existant semble correct. La solution consiste à :

1. **Vérifier l'état** : S'assurer que `userProgress.selectedReligion` contient bien `'christianity'`
2. **Ajouter un log de debug** temporaire pour confirmer les valeurs
3. **Forcer un rafraîchissement** de la page pour recharger l'état depuis localStorage

Si le problème persiste, nous pouvons ajouter un indicateur visuel de fallback ou debugger plus en profondeur l'état de l'application.

## Impact
- L'icône de religion (croix bleue dans un cercle) sera visible dans le header gauche
- Position : à gauche, avant le switch de géolocalisation
- Style : icône blanche sur fond bleu pour le christianisme

