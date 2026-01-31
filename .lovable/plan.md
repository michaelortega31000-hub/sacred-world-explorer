
# Plan : Calendrier complet des 365 Saints Catholiques

## Objectif
Ajouter **un saint pour chaque jour de l'année 2026** (365 entrées) au calendrier, visibles uniquement avec le filtre "Christianisme".

---

## Structure proposée

### Organisation des données
Pour éviter un fichier gigantesque, je propose de créer un **fichier dédié** aux saints :

```
src/data/catholicSaintsData.ts  (nouveau fichier ~2000 lignes)
```

Ce fichier contiendra les 365 saints avec une structure optimisée :

```typescript
interface SaintEntry {
  day: number;      // 1-31
  month: number;    // 1-12
  nameFr: string;
  nameEn: string;
  description: string;
  patronOf?: string;
  type?: 'martyr' | 'confesseur' | 'vierge' | 'docteur' | 'pape' | 'évêque';
}
```

---

## Les 365 Saints du Calendrier Romain

Voici un extrait de la liste complète qui sera intégrée :

### Janvier (31 saints)
| Jour | Saint | Patron de |
|------|-------|-----------|
| 1 | Sainte Marie, Mère de Dieu | Mères |
| 2 | St Basile le Grand et St Grégoire de Nazianze | Théologiens |
| 3 | Ste Geneviève | Paris |
| 4 | Ste Angèle de Foligno | Veuves |
| 5 | St Édouard le Confesseur | Rois |
| 6 | Épiphanie / St Melchior | Rois Mages |
| 7 | St Raymond de Peñafort | Juristes |
| 8 | St Lucien de Beauvais | - |
| 9 | Ste Alix Le Clerc | Éducateurs |
| 10 | St Guillaume de Bourges | - |
| ... | ... | ... |
| 31 | St Jean Bosco | Éducateurs, jeunesse |

### Février (28/29 saints)
| Jour | Saint |
|------|-------|
| 1 | Ste Ella | 
| 2 | Présentation de Jésus au Temple |
| 3 | St Blaise | Gorge, animaux |
| 4 | Ste Véronique | Photographes |
| 5 | Ste Agathe | Nourrices |
| ... | ... |

### Mars à Décembre
Les 10 autres mois suivront le même schéma avec tous les saints du calendrier romain officiel.

---

## Modifications techniques

### 1. Nouveau fichier `src/data/catholicSaintsData.ts`
```typescript
// Liste compacte des 365 saints
export const saintsCalendar: SaintEntry[] = [
  // JANVIER
  { month: 1, day: 1, nameFr: 'Sainte Marie, Mère de Dieu', nameEn: 'Mary, Mother of God', description: 'Solennité de Marie', patronOf: 'mères' },
  { month: 1, day: 2, nameFr: 'Saints Basile et Grégoire', nameEn: 'Sts Basil and Gregory', description: 'Docteurs de l\'Église' },
  // ... 363 autres entrées
];

// Fonction pour générer les ReligiousEvent à partir de la liste compacte
export const generateSaintsEvents2026 = (): ReligiousEvent[] => {
  return saintsCalendar.map(saint => ({
    id: `saint-${saint.month}-${saint.day}-2026`,
    name: saint.nameEn,
    nameFr: saint.nameFr,
    nameEn: saint.nameEn,
    description: saint.description,
    descriptionFr: saint.description,
    descriptionEn: saint.description,
    tradition: 'christianity',
    date: new Date(2026, saint.month - 1, saint.day),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: saint.patronOf ? { patronOf: saint.patronOf } : undefined
  }));
};
```

### 2. Mise à jour de `src/data/religiousEvents.ts`
```typescript
import { generateSaintsEvents2026 } from './catholicSaintsData';

// Remplacer catholicSaints2026 par la génération dynamique
export const catholicSaints2026 = generateSaintsEvents2026();
```

### 3. Fichiers inchangés
- `CalendarTab.tsx` - Déjà configuré pour les saints
- `CalendarDayCell.tsx` - Affichage déjà en place
- `ListView.tsx` - Style doré déjà implémenté

---

## Sources pour les saints

Le calendrier sera basé sur :
1. **Martyrologe Romain** (calendrier officiel de l'Église catholique)
2. **Calendrier liturgique français** (saints nationaux)
3. **Calendrier des prénoms** (saints populaires)

---

## Avantages de cette approche

| Aspect | Avantage |
|--------|----------|
| **Maintenabilité** | Fichier séparé, facile à mettre à jour |
| **Performance** | Génération paresseuse des événements |
| **Extensibilité** | Facile d'ajouter des informations (biographies, images) |
| **Filtrage** | Saints visibles uniquement avec filtre Christianisme |

---

## Résultat attendu

- 365 saints disponibles dans le calendrier
- Chaque jour affiche le saint correspondant quand on clique sur "Christianisme"
- Affichage discret avec l'icône ✨ et la couleur dorée
- Les fêtes majeures (Pâques, Noël) restent distinctes des saints

---

## Estimation

- ~2000 lignes de données pour les 365 saints
- Temps de génération : ~15 minutes pour compiler la liste complète
- Aucun impact sur les performances (données statiques)
