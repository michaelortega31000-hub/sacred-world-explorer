

# Plan : Ajouter le Quiz Quotidien dans l'onglet Défis de la page Explore

## Problème Identifié

Le quiz quotidien (`DailyQuiz`) existe et fonctionne correctement, mais il n'est **pas affiché** dans l'onglet "Défis" de la page Explore. Voici la situation actuelle :

| Composant | Page | Quiz inclus ? |
|-----------|------|---------------|
| `ChallengesTab` | `/explore` (onglet Défis) | Non |
| `WeeklyQuestTab` | `/country/:name` (onglet Quête) | Oui |

L'utilisateur s'attend à voir le quiz dans l'onglet "Défis" de la page Explore, mais actuellement il n'y est pas.

---

## Caractéristiques du Quiz Existant

Le composant `DailyQuiz` possède déjà toutes les fonctionnalités demandées :

- **5 questions** sélectionnées aléatoirement chaque jour
- **4 réponses possibles** par question
- **Rotation quotidienne** (basée sur `localStorage` avec la date du jour)
- **Catégories variées** : Religion, Monument, Édifice, Anecdote
- **Système de points** : +2 points par bonne réponse (10 points max)
- **Explication pédagogique** après chaque réponse
- **Persistance** : empêche de refaire le quiz le même jour

---

## Solution

Importer et afficher le composant `DailyQuiz` en haut de l'onglet "Journalière" dans `ChallengesTab.tsx`.

### Modification Prévue

```
┌─────────────────────────────────────────────────────────────┐
│  ONGLET DÉFIS (Explore)                                     │
├─────────────────────────────────────────────────────────────┤
│  [Journalière] [Hebdomadaire] [Mensuelle] [Culture] [Proche]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║  🧠 QUIZ DU JOUR                      Question 1/5   ║  │
│  ║  5 questions quotidiennes • 2 points par bonne rép.  ║  │
│  ║                                                       ║  │
│  ║  🕌 Religion                                          ║  │
│  ║  Quel est le lieu de pèlerinage le plus sacré ?      ║  │
│  ║                                                       ║  │
│  ║  ○ Jérusalem                                          ║  │
│  ║  ○ La Mecque                                          ║  │
│  ║  ○ Médine                                             ║  │
│  ║  ○ Le Caire                                           ║  │
│  ║                                                       ║  │
│  ║  [Valider]                                            ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🔥 Série : 5 jours • Bonus +10%                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  📍 Première Visite - Visitez 1 lieu aujourd'hui     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Fichier à Modifier

| Fichier | Modification |
|---------|--------------|
| `src/components/ChallengesTab.tsx` | Importer `DailyQuiz` et l'afficher dans l'onglet "daily" |

---

## Détails Techniques

1. Ajouter l'import du composant `DailyQuiz` en haut du fichier
2. Insérer `<DailyQuiz />` au début du `TabsContent value="daily"` (avant les quêtes journalières)

### Code à Ajouter

```typescript
// Import en haut du fichier
import DailyQuiz from './DailyQuiz';

// Dans le TabsContent value="daily", ajouter en premier :
<TabsContent value="daily" className="space-y-6">
  {/* Quiz du jour */}
  <DailyQuiz />
  
  {/* Reste du contenu existant... */}
  <Card className="border-primary/20 ...">
```

---

## Résultat Attendu

Après cette modification :
- Le quiz sera visible dès l'ouverture de l'onglet "Défis" > "Journalière"
- 5 questions avec 4 réponses chacune seront proposées
- Le quiz changera automatiquement tous les jours à minuit
- L'utilisateur ne pourra pas refaire le quiz le même jour

