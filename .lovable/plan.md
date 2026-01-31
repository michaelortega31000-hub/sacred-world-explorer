
# Plan : Integration des Musees Culturels dans SacredWorld

## Vue d'ensemble

Ce plan transforme SacredWorld d'une application exclusivement dediee aux lieux religieux en une plateforme explorant le patrimoine spirituel ET culturel mondial. L'ajout de 30 musees exceptionnels s'accompagne d'un nouveau systeme de categorisation, filtres, quetes et badges dedies a la culture.

---

## 1. Modifications de la Base de Donnees

### 1.1 Ajout du champ `place_category`

La table `places` actuelle contient deja un champ `type` (Cathedrale, Mosquee, Temple, etc.). On ajoute un nouveau champ `place_category` pour distinguer les grandes familles :

```text
┌─────────────────────────────────────────────────────────────┐
│ ALTER TABLE places                                          │
│ ADD COLUMN place_category TEXT DEFAULT 'religious_site';    │
├─────────────────────────────────────────────────────────────┤
│ Valeurs possibles:                                          │
│   - 'religious_site' (defaut - tous lieux existants)        │
│   - 'museum'         (nouveaux musees)                      │
│   - 'other'          (futur - autres categories)            │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Ajout du champ `tags` pour les musees

```sql
ALTER TABLE places ADD COLUMN tags TEXT[] DEFAULT '{}';
```

Tags disponibles : `art_sacre`, `manuscrits`, `rites`, `archeologie`, `civilisations`, `interreligieux`, `icones`, `calligraphie`, `antiquite`

### 1.3 Ajout du champ `traditions_related`

```sql
ALTER TABLE places ADD COLUMN traditions_related TEXT[] DEFAULT '{}';
```

### 1.4 Mise a jour des lieux existants

```sql
UPDATE places SET place_category = 'religious_site' WHERE place_category IS NULL;
```

---

## 2. Insertion des 30 Musees

Chaque musee sera insere avec les informations suivantes :

| Champ | Exemple |
|-------|---------|
| id | `mus-vatican-rome` |
| name | `Musees du Vatican` |
| country | `Italy` |
| city | `Rome` |
| type | `Musee` |
| place_category | `museum` |
| description | Description 2-3 phrases angle culture/sacre |
| coordinates | `{lng: 12.4547, lat: 41.9065}` |
| points_value | 60-80 selon importance |
| tags | `['art_sacre', 'icones', 'antiquite']` |
| traditions_related | `['christianisme', 'antiquite']` |
| image_url | URL Wikipedia |
| verification_status | `verified` |

### Liste des 30 musees (organises par region) :

**Europe (10)**
1. Musees du Vatican - Rome, Italie
2. Chester Beatty - Dublin, Irlande
3. The Cloisters (Met Cloisters) - New York, USA
4. Museum of Byzantine Culture - Thessalonique, Grece
5. Acropolis Museum - Athenes, Grece
6. Musee du quai Branly - Paris, France
7. Rijksmuseum - Amsterdam, Pays-Bas
8. Ethnological Museum (Humboldt Forum) - Berlin, Allemagne
9. State Hermitage Museum - Saint-Petersbourg, Russie
10. Museum of the History of Religion - Saint-Petersbourg, Russie

**Afrique/Moyen-Orient (8)**
11. Musee egyptien du Caire - Le Caire, Egypte
12. Coptic Museum - Le Caire, Egypte
13. Nubian Museum - Assouan, Egypte
14. Bardo National Museum - Tunis, Tunisie
15. National Museum of Ethiopia - Addis-Abeba, Ethiopie
16. Museum of Islamic Art - Doha, Qatar
17. National Museum of Iran - Teheran, Iran
18. Musee d'Israel - Jerusalem, Israel

**Asie (7)**
19. Islamic Arts Museum Malaysia - Kuala Lumpur, Malaisie
20. Tokyo National Museum - Tokyo, Japon
21. National Museum of Korea - Seoul, Coree du Sud
22. National Palace Museum - Taipei, Taiwan
23. Museum of World Religions - New Taipei City, Taiwan
24. Indian Museum - Kolkata, Inde
25. Museum of Shamanism - Oulan-Oude, Russie

**Ameriques (5)**
26. Musee national d'anthropologie - Mexico, Mexique
27. Museo Nacional del Virreinato - Tepotzotlan, Mexique
28. Museo Larco - Lima, Perou
29. Museo de Arte Religioso - Quito, Equateur
30. Museu de Arte Sacra de Sao Paulo - Sao Paulo, Bresil

---

## 3. Modifications du Type Place (TypeScript)

### Fichier : `src/contexts/AppContext.tsx`

```typescript
// Ajouter le type PlaceCategory
export type PlaceCategory = 'religious_site' | 'museum' | 'other';

// Mettre a jour l'interface Place
export interface Place {
  id: string;
  name: string;
  country: string;
  city?: string;
  type: string;
  placeCategory?: PlaceCategory;  // NOUVEAU
  description: string;
  points: number;
  coordinates: [number, number];
  imageUrl?: string;
  religion?: Religion;
  tags?: string[];               // NOUVEAU
  traditionsRelated?: string[];  // NOUVEAU
}
```

### Fichier : `src/hooks/usePlaces.ts`

Mettre a jour `normalizeDbPlace()` pour inclure les nouveaux champs.

---

## 4. UI : Filtres Tous/Lieux religieux/Musees

### 4.1 Composant SegmentedFilter (nouveau)

Creer `src/components/PlaceCategoryFilter.tsx` :

```text
┌─────────────────────────────────────────────────────────────┐
│  Composant visuel                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌────────┬─────────────────┬───────────┐                  │
│   │  Tous  │ Lieux religieux │  Musees   │                  │
│   └────────┴─────────────────┴───────────┘                  │
│                                                             │
│   - Toggle group style chips                                │
│   - Persistance localStorage                                │
│   - Prop: onCategoryChange(category)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Integration dans LocationsTab.tsx

- Ajouter le filtre au-dessus des filtres continent/pays
- Filtrer `filteredPlaces` par `placeCategory`
- Afficher une icone differente (temple vs musee)

### 4.3 Integration dans Explore.tsx (Globe3D)

- Ajouter le meme filtre
- Colorer differemment les marqueurs musees sur le globe

---

## 5. Page Pays : Sections distinctes

### Fichier : `src/pages/Country.tsx`

Restructurer la page pour afficher 2 sections/tabs :

```text
┌─────────────────────────────────────────────────────────────┐
│  FRANCE                                                     │
│  42 lieux sacres | 3 musees culturels                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┬────────────────────────┐              │
│  │ Lieux religieux  │ Musees & Centres cult. │              │
│  └──────────────────┴────────────────────────┘              │
│                                                             │
│  [Mini switch: Tous / Religieux / Musees]                   │
│                                                             │
│  === Par ville ===                                          │
│  Paris (12 lieux)                                           │
│    - Notre-Dame de Paris 🏛                                  │
│    - Musee du quai Branly 🏛                                 │
│    ...                                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Modifications :**
- Ajouter compteur separe musees dans le header
- Creer 2 TabsTrigger pour basculer entre categories
- Afficher icone differenciante pour chaque type

---

## 6. Trip Planner : Support des Musees

### Fichier : `src/components/LocationsTab.tsx` (section planned)

- Les musees peuvent etre ajoutes comme etapes
- Badge visuel "Musee" ou "Lieu religieux" sur chaque carte
- Icone differente dans la liste des etapes

```text
┌─────────────────────────────────────────────────────────────┐
│  Mon Itineraire                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 🏛 Notre-Dame de Paris        [Lieu religieux]          │
│  2. 🏛 Musee du quai Branly       [Musee]                   │
│  3. 🏛 Sacre-Coeur                [Lieu religieux]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Quetes, Badges et Titres Culture

### 7.1 Nouvelles Quetes (8 minimum)

| ID | Titre | Description | Recompense |
|----|-------|-------------|------------|
| `culture-first-museum` | Premier Musee | Visitez 1 musee | 75 pts |
| `culture-3-countries` | Globe-Trotter Culturel | Visitez 3 musees dans 3 pays differents | 300 pts |
| `culture-mixed-itinerary` | Itineraire Mixte | Completez un voyage avec 2 musees + 1 lieu religieux | 400 pts |
| `culture-read-10` | Rat de Bibliotheque | Lisez 10 fiches "Histoire" de musees | 200 pts |
| `culture-5-favorites` | Collectionneur | Ajoutez 5 musees en favoris | 150 pts |
| `culture-checkin` | Visiteur Officiel | Faites 1 check-in dans un musee | 100 pts |
| `culture-curator` | Curator | Completez 5 quetes culturelles | 500 pts |
| `culture-manuscripts` | Chasseur de Manuscrits | Visitez 3 musees lies aux manuscrits | 350 pts |

### 7.2 Nouveaux Badges (6 minimum)

| ID | Nom | Icone | Condition |
|----|-----|-------|-----------|
| `badge-museum-explorer` | Explorateur de Musees | 🏛️ | Visiter 1 musee |
| `badge-art-lover` | Amoureux de l'Art | 🎨 | Visiter 5 musees |
| `badge-curator` | Curator | 📜 | Visiter 10 musees |
| `badge-heritage-guardian` | Gardien du Patrimoine | 🛡️ | Visiter musees sur 3 continents |
| `badge-manuscript-hunter` | Chasseur de Manuscrits | 📚 | Visiter 3 musees tag "manuscrits" |
| `badge-culture-master` | Maitre de la Culture | 👑 | Completer toutes quetes culture |

### 7.3 Nouveaux Titres (5 minimum)

| Titre | Condition |
|-------|-----------|
| Curator | 10 musees visites |
| Art Seeker | 5 musees d'art sacre visites |
| Archivist | 5 musees tag "manuscrits" visites |
| Heritage Explorer | Musees sur 5 continents |
| Museum Wanderer | 20 musees visites |

### 7.4 Filtrage Badges par Type

**Fichier : `src/pages/Badges.tsx`**

Ajouter un filtre supplementaire :

```text
[Tous] [Religion] [Culture] [Quetes]
```

---

## 8. Fichiers a Modifier/Creer

### Fichiers a modifier :

| Fichier | Modifications |
|---------|---------------|
| `src/contexts/AppContext.tsx` | Ajouter `PlaceCategory`, `tags`, `traditionsRelated` au type Place |
| `src/hooks/usePlaces.ts` | Mapper les nouveaux champs depuis la BDD |
| `src/components/LocationsTab.tsx` | Ajouter filtre categorie, badge visuel musee |
| `src/pages/Country.tsx` | Sections Lieux religieux / Musees, switch filtre |
| `src/pages/Explore.tsx` | Ajouter filtre categorie au-dessus des tabs |
| `src/components/ChallengesTab.tsx` | Ajouter quetes Culture |
| `src/pages/Badges.tsx` | Ajouter badges Culture, filtre par type |
| `src/data/placesData.ts` | Ajouter `placeCategory: 'religious_site'` aux 262 lieux existants (pour coherence TypeScript) |
| `src/pages/AdminEnrichData.tsx` | Ajouter champs category, tags dans le formulaire |

### Nouveaux fichiers :

| Fichier | Description |
|---------|-------------|
| `src/components/PlaceCategoryFilter.tsx` | Composant filtre Tous/Religieux/Musees |

---

## 9. Migrations SQL

### Migration 1 : Schema

```sql
-- Ajouter les nouvelles colonnes
ALTER TABLE places ADD COLUMN IF NOT EXISTS place_category TEXT DEFAULT 'religious_site';
ALTER TABLE places ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE places ADD COLUMN IF NOT EXISTS traditions_related TEXT[] DEFAULT '{}';

-- Mettre a jour tous les lieux existants
UPDATE places SET place_category = 'religious_site' WHERE place_category IS NULL;
```

### Migration 2 : Ajouter type "Musee"

Le type `Musee` sera utilise comme valeur du champ `type` pour les 30 nouveaux lieux.

### Migration 3 : Insert 30 musees

```sql
INSERT INTO places (id, name, country, city, type, place_category, description, ...)
VALUES
  ('mus-vatican-rome', 'Musees du Vatican', 'Italy', 'Rome', 'Musee', 'museum', '...', ...),
  -- 29 autres musees
;
```

---

## 10. Estimation de l'effort

| Composant | Complexite | Temps estime |
|-----------|------------|--------------|
| Migrations BDD (schema + 30 musees) | Moyenne | 1 session |
| Types TypeScript | Faible | 1 session |
| PlaceCategoryFilter.tsx | Faible | 1 session |
| LocationsTab.tsx modifications | Moyenne | 1 session |
| Country.tsx restructuration | Haute | 2 sessions |
| ChallengesTab.tsx quetes | Moyenne | 1 session |
| Badges.tsx + filtres | Moyenne | 1 session |
| Tests et ajustements | Moyenne | 1 session |

**Total estime : 8-10 sessions de developpement**

---

## 11. Approche de Mise en Oeuvre Recommandee

Etant donne l'ampleur du projet, je recommande de proceder par phases :

### Phase 1 : Fondations (Prioritaire)
1. Migration BDD : ajouter `place_category`, `tags`, `traditions_related`
2. Mettre a jour types TypeScript
3. Inserer les 30 musees

### Phase 2 : UI Filtres
4. Creer PlaceCategoryFilter.tsx
5. Integrer dans LocationsTab.tsx
6. Integrer dans Explore.tsx

### Phase 3 : Page Pays
7. Restructurer Country.tsx avec sections/tabs

### Phase 4 : Gamification
8. Ajouter quetes Culture dans ChallengesTab
9. Ajouter badges et titres Culture
10. Filtrage par type dans Badges.tsx

### Phase 5 : Finitions
11. Trip Planner avec badges visuels
12. Tests complets et corrections

---

## 12. Points d'Attention

- **Compatibilite ascendante** : Les 262 lieux existants conservent leur fonctionnement actuel
- **Performance** : Le filtre `place_category` doit etre indexe si la BDD grossit
- **UX** : Le filtre doit etre visible et accessible sans navigation complexe
- **Persistance** : Sauvegarder le choix de filtre utilisateur dans localStorage
- **Coherence** : Meme nomenclature partout (Musee vs Museum vs Musees)
