
# Plan : Nettoyage des pages obsolètes

## Résumé
Supprimer les 4 fichiers de pages qui ne sont plus utilisés car elles ont été remplacées ou fusionnées avec d'autres pages.

## Pages à supprimer

| Page | Remplacée par |
|------|---------------|
| `Community.tsx` | Journal (`/journal`) |
| `ModeSelection.tsx` | Welcome (`/welcome`) |
| `Selection.tsx` | Welcome (`/welcome`) |
| `WorldMap.tsx` | Explore (`/explore`) |

## Étapes

1. **Supprimer les 4 fichiers obsolètes**
   - `src/pages/Community.tsx`
   - `src/pages/ModeSelection.tsx`
   - `src/pages/Selection.tsx`
   - `src/pages/WorldMap.tsx`

2. **Conserver les redirections dans App.tsx**
   Les redirections automatiques restent en place pour éviter les liens cassés :
   ```text
   /world → /explore
   /mode-selection → /welcome
   /selection → /welcome
   /community → /journal
   ```

## Résultat attendu
- Code plus propre avec 4 fichiers en moins
- Aucun impact sur les utilisateurs (les anciennes URLs continuent de fonctionner grâce aux redirections)
- Meilleure lisibilité du projet

---

## Section technique

### Fichiers à supprimer
```text
src/pages/Community.tsx (98 lignes)
src/pages/ModeSelection.tsx (201 lignes)
src/pages/Selection.tsx (206 lignes)
src/pages/WorldMap.tsx (234 lignes)
```

### Aucune modification requise dans App.tsx
Les redirections (`Navigate`) existantes resteront en place pour la rétrocompatibilité des URLs potentiellement bookmarkées.
