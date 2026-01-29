
# Plan : Réduire le tutoriel de 15 à 8 étapes

## Résumé

Passer de 15 étapes à **8 étapes** en :
1. Supprimant l'étape AR (non fonctionnelle)
2. Regroupant les étapes similaires
3. Ajoutant l'Assistant Sacred World

---

## Nouveau tutoriel proposé : 8 étapes

| # | Catégorie | Titre | Contenu fusionné |
|---|-----------|-------|------------------|
| 1 | Découverte | Bienvenue dans SacredWorld | Introduction générale |
| 2 | Découverte | Explorez le Monde | Globe 3D + Filtres + Lieux proches |
| **3** | **Découverte** | **Assistant Sacred World** | **Mode Aide + Mode Histoire (NOUVEAU)** |
| 4 | Gamification | Gagnez des Points et Badges | Visites + Points + Badges |
| 5 | Gamification | Défis et Classements | Défis quotidiens + Classements |
| 6 | Social | Communauté et Souvenirs | Journal + Communauté + Voyages |
| 7 | Calendrier | Calendrier Multi-Religieux | Événements + Rappels |
| 8 | Personnalisation | Personnalisez Votre Expérience | Avatar + Langue + Notifications |

---

## Détail des fusions

### Étape 2 : Explorez le Monde (fusion de 4 anciennes étapes)
```
Globe 3D + Filtres par pays/religion + Géolocalisation
"Faites tourner le globe 3D, filtrez par pays, religion ou type 
de monument, et découvrez les lieux près de chez vous avec la géolocalisation."
```

### Étape 3 : Assistant Sacred World (NOUVELLE)
```
Mode Aide + Mode Histoire
"Posez vos questions à l'assistant ! Mode « Aide » pour naviguer 
dans l'app, mode « Histoire » pour découvrir l'histoire des lieux sacrés."
```

### Étape 4 : Gagnez des Points et Badges (fusion de 3 anciennes)
```
Visites vérifiées + Système XP + Badges
"Validez vos visites par photo GPS+IA, gagnez des points (10 pts 
par visite physique) et débloquez des badges exclusifs !"
```

### Étape 5 : Défis et Classements (fusion de 2 anciennes)
```
Défis quotidiens/hebdo + Classements
"Relevez des défis quotidiens et hebdomadaires. Grimpez dans les 
classements mondiaux, par pays et par religion !"
```

### Étape 6 : Communauté et Souvenirs (fusion de 3 anciennes)
```
Journal + Forum + Amis + Voyages
"Créez vos souvenirs, partagez avec la communauté, ajoutez des 
amis et planifiez vos itinéraires personnalisés."
```

---

## Avantages

| Critère | Avant | Après |
|---------|-------|-------|
| Nombre d'étapes | 15 | **8** |
| Temps estimé | ~5 min | **~2 min** |
| Étape AR | ❌ Présente | ✅ Supprimée |
| Assistant | ❌ Absent | ✅ Présent |

---

## Fichier modifié

| Fichier | Changements |
|---------|-------------|
| `src/pages/Splash.tsx` | Réécrire `tutorialSteps` (lignes 35-195) |

---

## Section technique

### Import à ajouter
```typescript
import { MessageCircle } from "lucide-react";
```

### Nouveau tableau `tutorialSteps`

```typescript
const tutorialSteps: TutorialStep[] = [
  // 1. Bienvenue
  {
    category: 'discovery',
    icon: Globe,
    title: "Bienvenue dans SacredWorld",
    description: "Partez à la découverte des lieux sacrés et monuments culturels les plus emblématiques du monde entier. Une aventure spirituelle et culturelle vous attend !",
    categoryColor: "hsl(var(--primary))",
    categoryLabel: "Découverte & Exploration",
    ctaText: "Commencer l'Exploration",
    ctaLink: "/welcome"
  },
  // 2. Explorez le Monde (fusion Globe + Filtres + Géoloc)
  {
    category: 'discovery',
    icon: Globe,
    title: "Explorez le Monde",
    description: "Faites tourner le globe 3D interactif, filtrez par pays, religion ou type de monument, et découvrez les lieux près de chez vous grâce à la géolocalisation.",
    categoryColor: "hsl(var(--primary))",
    categoryLabel: "Découverte & Exploration",
    ctaText: "Voir le Globe 3D",
    ctaLink: "/worldmap"
  },
  // 3. Assistant Sacred World (NOUVEAU)
  {
    category: 'discovery',
    icon: MessageCircle,
    title: "Assistant Sacred World",
    description: "Posez vos questions à l'assistant intelligent ! Mode « Aide » pour naviguer dans l'app, mode « Histoire » pour découvrir l'histoire des lieux sacrés.",
    categoryColor: "hsl(var(--primary))",
    categoryLabel: "Découverte & Exploration",
    ctaText: "Essayer l'Assistant",
    ctaLink: "/explore"
  },
  // 4. Points et Badges (fusion)
  {
    category: 'gamification',
    icon: Trophy,
    title: "Gagnez des Points et Badges",
    description: "Validez vos visites par photo GPS+IA (10 pts/visite). Montez de niveau et débloquez des badges exclusifs pour 10, 25, 50, 100+ visites !",
    categoryColor: "hsl(45 93% 47%)",
    categoryLabel: "Gamification & Progression",
    ctaText: "Voir Mon Profil",
    ctaLink: "/profile"
  },
  // 5. Défis et Classements (fusion)
  {
    category: 'gamification',
    icon: Target,
    title: "Défis et Classements",
    description: "Relevez des défis quotidiens et hebdomadaires pour gagner des bonus. Grimpez dans les classements mondiaux, par pays et par religion !",
    categoryColor: "hsl(45 93% 47%)",
    categoryLabel: "Gamification & Progression",
    ctaText: "Voir les Défis",
    ctaLink: "/profile"
  },
  // 6. Communauté et Souvenirs (fusion)
  {
    category: 'social',
    icon: Users,
    title: "Communauté et Souvenirs",
    description: "Créez votre journal de voyage, partagez avec la communauté, ajoutez des amis et planifiez des itinéraires personnalisés jusqu'à 10 lieux.",
    categoryColor: "hsl(270 60% 60%)",
    categoryLabel: "Social & Communauté",
    ctaText: "Voir la Communauté",
    ctaLink: "/community"
  },
  // 7. Calendrier
  {
    category: 'calendar',
    icon: Calendar,
    title: "Calendrier Multi-Religieux",
    description: "Consultez les événements de toutes les traditions. Activez les rappels personnalisés et explorez les vues année, mois, semaine ou jour.",
    categoryColor: "hsl(217 91% 60%)",
    categoryLabel: "Calendrier & Événements",
    ctaText: "Voir le Calendrier",
    ctaLink: "/calendar"
  },
  // 8. Personnalisation
  {
    category: 'personalization',
    icon: Settings,
    title: "Personnalisez Votre Expérience",
    description: "Choisissez votre avatar, configurez votre profil public/privé, sélectionnez votre langue parmi 8 disponibles et gérez vos notifications.",
    categoryColor: "hsl(142 71% 45%)",
    categoryLabel: "Personnalisation",
    ctaText: "Ouvrir les Paramètres",
    ctaLink: "/settings"
  },
];
```

### Icônes conservées
- `Globe`, `MessageCircle` (nouveau), `Trophy`, `Target`, `Users`, `Calendar`, `Settings`

### Icônes supprimées
- `Camera` (AR), `Compass`, `MapPin`, `CheckCircle`, `Award`, `TrendingUp`, `Heart`, `Route`
