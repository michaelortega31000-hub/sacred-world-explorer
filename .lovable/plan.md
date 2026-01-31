
# Plan : Ajout des Saints Catholiques au Calendrier

## Objectif
Intégrer les saints patrons catholiques au calendrier, visibles **uniquement lorsque le filtre "Christianisme" est sélectionné**, avec un affichage discret pour ne pas surcharger le calendrier.

---

## Approche proposée

### Distinction visuelle Saints vs Fêtes majeures
- Les **fêtes majeures** (Pâques, Noël, etc.) gardent leur affichage actuel avec les gros points colorés
- Les **saints du jour** sont affichés de façon plus discrète :
  - Petite icône d'auréole ✨ à côté du nom
  - Couleur dorée atténuée (#D4AF37)
  - Pas de point sur le calendrier (pour ne pas surcharger)
  - Affichage dans la section "Événements du jour" uniquement

---

## Événements à ajouter (Saints les plus populaires)

### Sélection de ~50 saints majeurs répartis sur l'année

| Mois | Saints proposés |
|------|-----------------|
| Janvier | Ste Geneviève (3), St Antoine (17), St Sébastien (20), St François de Sales (24) |
| Février | Ste Agathe (5), St Valentin (14), Ste Bernadette (18) |
| Mars | St Joseph (19), St Patrick (17), Ste Blandine (2) |
| Avril | St Georges (23), St Marc (25), Ste Catherine de Sienne (29) |
| Mai | St Joseph travailleur (1), Ste Jeanne d'Arc (30), St Philippe (3) |
| Juin | St Antoine de Padoue (13), St Jean-Baptiste (24), St Pierre et St Paul (29) |
| Juillet | Ste Marie-Madeleine (22), St Jacques (25), Ste Anne (26) |
| Août | St Laurent (10), St Bernard (20), St Augustin (28) |
| Septembre | Ste Thérèse de Calcutta (5), St Michel (29), St Vincent de Paul (27) |
| Octobre | Ste Thérèse de Lisieux (1), St François d'Assise (4), Ste Faustine (5) |
| Novembre | St Martin (11), Ste Élisabeth de Hongrie (17), Ste Cécile (22) |
| Décembre | St Nicolas (6), Ste Lucie (13), St Étienne (26) |

---

## Modifications techniques

### 1. Mise à jour de l'interface `ReligiousEvent`
```typescript
// src/data/religiousEvents.ts
export interface ReligiousEvent {
  // ... champs existants
  subType?: 'major_feast' | 'saint' | 'liturgical';  // Nouveau champ
  saintInfo?: {                                       // Nouveau champ optionnel
    patronOf?: string;       // "Patron de Paris"
    martyrOrConfessor?: string;  // "Martyr" ou "Confesseur"
  };
}
```

### 2. Création du tableau des Saints
```typescript
// Tableau séparé pour les saints, facilement extensible
export const catholicSaints2026: ReligiousEvent[] = [
  {
    id: 'saint-genevieve-2026',
    nameFr: 'Sainte Geneviève',
    nameEn: 'Saint Genevieve',
    descriptionFr: 'Patronne de Paris, elle sauva la ville des Huns.',
    tradition: 'christianity',
    date: getDateFor2026(1, 3),
    color: '#D4AF37', // Or atténué pour les saints
    subType: 'saint',
    saintInfo: { patronOf: 'Paris' }
  },
  // ... autres saints
];
```

### 3. Fusion conditionnelle des événements
```typescript
// Nouvelle fonction pour obtenir tous les événements Christianity
export const getChristianityEventsWithSaints = (): ReligiousEvent[] => {
  return [...religiousEvents2026.filter(e => e.tradition === 'christianity'), ...catholicSaints2026];
};

// Mise à jour de getEventsByTradition
export const getEventsByTradition = (tradition: string): ReligiousEvent[] => {
  if (tradition === 'all') return religiousEvents2026; // Saints non inclus dans "all"
  if (tradition === 'christianity') return getChristianityEventsWithSaints();
  return religiousEvents2026.filter(event => event.tradition === tradition);
};
```

### 4. Mise à jour du composant CalendarDayCell
- Différencier visuellement les saints (point plus petit, couleur dorée)
- Afficher une icône d'auréole pour les saints dans le tooltip

### 5. Mise à jour de la section "Événements du jour"
- Afficher les saints avec un style distinct
- Ajouter l'information "Patron de..." si disponible

---

## Affichage visuel proposé

### Dans le calendrier (vue mois)
- **Fêtes majeures** : Point coloré standard (1.5px)
- **Saints** : Point plus petit doré (1px) - ou pas de point du tout pour éviter la surcharge

### Dans la liste des événements du jour
```
┌─────────────────────────────────────────┐
│ 🎄 Noël                                  │ ← Fête majeure
│ Célébration de la naissance...          │
│ [Christianisme]                         │
├─────────────────────────────────────────┤
│ ✨ Saint Étienne                         │ ← Saint (style discret)
│ Premier martyr de l'Église              │
│ Patron des diacres                      │
└─────────────────────────────────────────┘
```

---

## Fichiers à modifier

| Fichier | Modifications |
|---------|---------------|
| `src/data/religiousEvents.ts` | Ajouter interface, tableau des saints, fonctions |
| `src/components/CalendarTab.tsx` | Utiliser la nouvelle fonction de filtrage |
| `src/components/calendar/CalendarDayCell.tsx` | Différencier l'affichage saints vs fêtes |
| `src/components/calendar/ListView.tsx` | Affichage distinct pour les saints |

---

## Résultat attendu

- ✅ Filtre "Toutes traditions" : Affiche uniquement les fêtes majeures (pas les saints)
- ✅ Filtre "Christianisme" : Affiche les fêtes majeures + les saints du jour
- ✅ Saints affichés de façon discrète pour ne pas surcharger le calendrier
- ✅ Informations enrichies sur chaque saint (patron de, martyr/confesseur)
- ✅ Structure extensible pour ajouter facilement d'autres saints
