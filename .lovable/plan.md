
# Plan de mise à jour du calendrier spirituel 2026

## Problème identifié
Le fichier `src/data/religiousEvents.ts` contient uniquement les événements de 2025. Nous sommes en 2026, donc le calendrier affiche des dates passées qui ne correspondent plus à l'année en cours.

## Solution proposée
Mettre à jour le fichier avec tous les événements spirituels et religieux de 2026 pour les 6 traditions (Christianisme, Islam, Judaïsme, Hindouisme, Bouddhisme, Autres).

---

## Événements 2026 à intégrer

### Christianisme (7 événements)
| Fête | Date 2026 |
|------|-----------|
| Pâques | 5 avril |
| Ascension | 14 mai |
| Pentecôte | 24 mai |
| Assomption | 15 août |
| Toussaint | 1er novembre |
| Noël | 25 décembre |
| Épiphanie | 6 janvier |

### Islam (5 événements)
| Fête | Date 2026 |
|------|-----------|
| Isra et Miraj | 16 janvier |
| Début du Ramadan | 18 février |
| Aïd al-Fitr | 20 mars |
| Aïd al-Adha | 27 mai |
| Mawlid an-Nabi | 26 août |

### Judaïsme (7 événements)
| Fête | Date 2026 |
|------|-----------|
| Pourim | 3 mars |
| Pessa'h | 2 avril |
| Shavouot | 22 mai |
| Rosh Hashanah | 12 septembre |
| Yom Kippour | 21 septembre |
| Soukkot | 26 septembre |
| Hanoucca | 5 décembre |

### Hindouisme (5 événements)
| Fête | Date 2026 |
|------|-----------|
| Holi | 4 mars |
| Ram Navami | 26 mars |
| Janmashtami | 15 août |
| Navratri | 10 octobre |
| Diwali | 8 novembre |

### Bouddhisme (5 événements)
| Fête | Date 2026 |
|------|-----------|
| Magha Puja | 3 mars |
| Vesak | 31 mai |
| Asalha Puja | 29 juillet |
| Début de Vassa | 30 juillet |
| Bodhi Day | 8 décembre |

### Autres / UNESCO (3 événements)
| Fête | Date 2026 |
|------|-----------|
| Journée du Patrimoine | 18 avril |
| Jour de la Terre | 22 avril |
| Journée de la Paix | 21 septembre |

---

## Modifications techniques

### 1. Mise à jour du fichier `src/data/religiousEvents.ts`

- Renommer la fonction helper `getDateFor2025` en `getDateFor2026`
- Remplacer l'année 2025 par 2026
- Renommer le tableau `religiousEvents2025` en `religiousEvents2026`
- Ajouter tous les 32 événements avec les dates correctes pour 2026
- Ajouter des événements supplémentaires pour enrichir le calendrier

### 2. Mise à jour du composant `CalendarTab.tsx`

- Mettre à jour les imports pour utiliser `religiousEvents2026`
- Changer le titre du calendrier de "2025" à "2026"
- Mettre à jour les références internes

### 3. Mise à jour des fonctions utilitaires

- `getEventsByDate` : utiliser le nouveau tableau 2026
- `getEventsByTradition` : utiliser le nouveau tableau 2026
- `getAllEventDates` : utiliser le nouveau tableau 2026

---

## Contenu enrichi pour chaque événement

Chaque événement inclura:
- `id` : identifiant unique (ex: `easter-2026`)
- `nameFr` / `nameEn` : nom en français et anglais
- `descriptionFr` / `descriptionEn` : description bilingue
- `tradition` : catégorie religieuse
- `date` : date exacte pour 2026
- `color` : couleur selon la tradition
- `type` : type d'événement (celebration, fasting, pilgrimage, prayer, festival)
- `isRecurring` : true pour événements annuels

---

## Résultat attendu

Après cette mise à jour :
- Le calendrier affichera tous les événements spirituels de 2026
- Les utilisateurs verront les fêtes à venir correctement datées
- Les filtres par tradition fonctionneront avec les nouvelles données
- Les rappels pourront être configurés pour les événements 2026
