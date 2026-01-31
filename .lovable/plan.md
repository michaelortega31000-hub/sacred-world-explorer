
# Plan : Refonte du filtre MonumentFilter

## Objectif

Simplifier le panneau de filtrage en supprimant la section "Pays" et en réorganisant l'interface en deux colonnes distinctes :
- **Colonne gauche** : Filtrer par traditions/religions (sites sacrés)
- **Colonne droite** : Filtrer par type de musée/centre culturel

---

## Structure actuelle vs. cible

```text
ACTUEL (MonumentFilter.tsx):
┌─────────────────────────────────┐
│ En-tête : Filtres               │
│ Préréglages sauvegardés         │
│ Barre de recherche              │
├─────────────────────────────────┤
│ Section : Par Religion          │
│  □ Christianisme (150)          │
│  □ Islam (45)                   │
│  □ Judaïsme (12)                │
│  ... (6 options)                │
├─────────────────────────────────┤
│ Section : Par Pays ← SUPPRIMER  │
│  □ France (25)                  │
│  □ Italie (30)                  │
│  ... (50+ pays)                 │
├─────────────────────────────────┤
│ Section : Par Type de Monument  │
│  □ Cathédrale (45)              │
│  □ Mosquée (20)                 │
│  □ Temple (35)                  │
│  ... (15+ types)                │
└─────────────────────────────────┘

CIBLE:
┌─────────────────────────────────┐
│ En-tête : Filtres               │
│ Préréglages sauvegardés         │
├─────────────────────────────────┤
│ ┌───────────────┬─────────────┐ │
│ │ LIEUX SACRÉS │ MUSÉES      │ │
│ │              │             │ │
│ │ □ Christian. │ □ Musée art │ │
│ │ □ Islam      │ □ Musée hist│ │
│ │ □ Judaïsme   │ □ Centre cu.│ │
│ │ □ Bouddhisme │ □ Exposition│ │
│ │ □ Hindouisme │             │ │
│ │ □ Traditions │             │ │
│ └───────────────┴─────────────┘ │
├─────────────────────────────────┤
│ Types de monuments (optionnel)  │
│  □ Cathédrale  □ Basilique     │
│  □ Mosquée     □ Temple        │
└─────────────────────────────────┘
```

---

## Modifications techniques

### Fichier à modifier : `src/components/MonumentFilter.tsx`

#### 1. Supprimer le filtre par pays

Retirer les éléments liés aux pays :
- État `selectedCountries`
- Fonction `handleCountryToggle`
- Calcul `countryCounts` et `availableCountries`
- Filtrage `filteredCountries`
- Section JSX "Par Pays" (lignes 527-572)
- Mise à jour de l'interface `FilterOptions` pour retirer `countries`

#### 2. Séparer les types par catégorie

Créer deux listes distinctes basées sur `placeCategory` :
- **Types religieux** : Cathédrale, Basilique, Mosquée, Temple, Synagogue, Sanctuaire, Abbaye, etc.
- **Types culturels** : Musée, Centre culturel, Galerie, Exposition, etc.

```tsx
// Classification des types
const religiousTypes = ['Cathédrale', 'Basilique', 'Mosquée', 'Temple', 
  'Synagogue', 'Sanctuaire', 'Abbaye', 'Monastère', 'Église', 'Chapelle',
  'Pagode', 'Stupa', 'Gurdwara', 'Mausolée', 'Tombeau'];

const culturalTypes = ['Musée', 'Centre culturel', 'Galerie', 'Exposition',
  'Mémorial', 'Site archéologique', 'Ruines'];
```

#### 3. Nouvelle mise en page en colonnes

Utiliser une grille CSS à 2 colonnes :

```tsx
<div className="grid grid-cols-2 gap-4 p-4">
  {/* Colonne gauche : Traditions */}
  <div className="space-y-3">
    <h4 className="text-sm font-semibold text-[#EAD7B5] flex items-center gap-2">
      <Church className="w-4 h-4" />
      Traditions
    </h4>
    {/* Liste des religions avec checkboxes */}
  </div>
  
  {/* Colonne droite : Musées */}
  <div className="space-y-3">
    <h4 className="text-sm font-semibold text-[#EAD7B5] flex items-center gap-2">
      <Building2 className="w-4 h-4" />
      Musées & Culture
    </h4>
    {/* Liste des types culturels avec checkboxes */}
  </div>
</div>
```

#### 4. Garder une section "Types de monument" optionnelle

Pour un filtrage plus fin, conserver une section réduite avec les types de monuments spécifiques (Cathédrale, Mosquée, Temple, etc.) accessible via un accordéon "Plus de filtres".

---

## Interface FilterOptions mise à jour

```tsx
export interface FilterOptions {
  religions: Religion[];
  types: string[];
  // countries supprimé
}
```

---

## Résumé des changements

| Élément | Action |
|---------|--------|
| Section "Par Pays" | Supprimer |
| Section "Par Religion" | Déplacer en colonne gauche |
| Section "Par Type" | Réorganiser en colonne droite (types culturels) |
| Barre de recherche | Supprimer (plus nécessaire sans pays) |
| Interface FilterOptions | Retirer le champ `countries` |
| Layout général | Passer en grille 2 colonnes |

---

## Fichiers impactés

```text
src/
  components/
    MonumentFilter.tsx    ← Refonte majeure
  pages/
    Globe3D.tsx           ← Adapter l'appel (retirer countries des filtres)
```

Le nouveau design sera plus épuré, plus visuel avec les colonnes, et permettra aux utilisateurs de choisir rapidement entre explorer les traditions religieuses ou les sites culturels.
