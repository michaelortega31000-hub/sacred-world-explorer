

# Plan : Ajout des Hôtels et Moyens de Transport pour l'Itinéraire

## Objectif

Enrichir l'application SacredWorld Explorer avec :
1. **Hôtels** disponibles dans les principales villes où des lieux sacrés sont recensés
2. **Moyens de transport** (bus, métro, tram, aéroport) pour que les utilisateurs puissent les enregistrer dans leur itinéraire

---

## Analyse de l'existant

### Villes principales identifiées dans l'application

D'après les données locales (`placesData.ts`) et la base de données, voici les pays et grandes villes où des lieux sacrés sont recensés :

| Pays | Villes principales |
|------|-------------------|
| France | Paris, Lourdes, Chartres, Reims, Strasbourg, Lyon, Marseille, Bordeaux, Toulouse |
| Espagne | Barcelone, Madrid, Séville, Tolède, Valence |
| Italie | Rome, Vatican, Florence, Naples, Milan, Venise |
| États-Unis | Washington D.C., New York, Boston, San Antonio, Los Angeles |
| Inde | New Delhi, Varanasi, Agra, Kolkata |
| Thaïlande | Bangkok, Chiang Mai, Phuket |
| Japon | Tokyo, Kyoto, Nara |
| Pérou | Lima, Cusco, Arequipa |
| Égypte | Le Caire, Assouan, Louxor |
| Allemagne | Berlin, Cologne, Munich |
| Et d'autres... |

### Structure actuelle des POI

- Table `restaurants` : Structure existante avec `name`, `address`, `city`, `country`, `coordinates`, `verified`, etc.
- Interface `SavedPOI` dans `AppContext.tsx` : supporte `restaurant`, `lodging`, `fuel`
- La page `PlaceDetail.tsx` permet déjà de chercher des hôtels via Mapbox

---

## Plan d'implémentation

### Phase 1 : Création des tables de base de données

#### 1.1 Table `hotels`

```text
hotels
├── id (uuid, PK)
├── name (text)
├── address (text)
├── city (text)
├── country (text)
├── coordinates (jsonb: {lat, lng})
├── star_rating (integer, 1-5)
├── price_range (text: 'budget', 'mid', 'luxury')
├── hotel_type (text[]: 'hotel', 'hostel', 'b&b', 'apartment')
├── amenities (text[]: 'wifi', 'parking', 'pool', 'breakfast', etc.)
├── phone (text, nullable)
├── website (text, nullable)
├── description (text, nullable)
├── verified (boolean, default false)
├── created_by (uuid, nullable)
├── created_at (timestamptz)
├── updated_at (timestamptz)
```

#### 1.2 Table `transport_stops`

```text
transport_stops
├── id (uuid, PK)
├── name (text) - Ex: "Gare de Lyon", "Aéroport CDG"
├── city (text)
├── country (text)
├── coordinates (jsonb: {lat, lng})
├── transport_type (text: 'metro', 'bus', 'tram', 'train', 'airport', 'ferry')
├── line_name (text, nullable) - Ex: "Ligne 1", "RER B"
├── operator (text, nullable) - Ex: "RATP", "SNCF"
├── accessibility (boolean, default false)
├── connections (text[]) - Autres lignes disponibles
├── description (text, nullable)
├── verified (boolean, default true)
├── created_at (timestamptz)
├── updated_at (timestamptz)
```

#### 1.3 Politiques RLS

- SELECT : Tout le monde peut voir les hôtels/transports vérifiés
- INSERT : Utilisateurs authentifiés (avec `created_by = auth.uid()`)
- UPDATE : Admins seulement
- DELETE : Admins seulement

---

### Phase 2 : Mise à jour du contexte et types

#### 2.1 Modifier `SavedPOI` dans `AppContext.tsx`

Ajouter le support pour les transports :
```text
type POIType = 'restaurant' | 'lodging' | 'transport'

interface SavedPOI {
  id: string
  name: string
  type: POIType
  subType?: string  // 'hotel', 'metro', 'airport', etc.
  address: string
  coordinates: [number, number]
  placeId: string
}
```

#### 2.2 Ajouter les fonctions de gestion

- `saveTransport(transport: SavedPOI)`
- `removeTransport(transportId: string)`
- `getTransportsForPlace(placeId: string)`

---

### Phase 3 : Modification de l'interface utilisateur

#### 3.1 Page `PlaceDetail.tsx`

Ajouter un onglet "Transports" dans la section "Services à Proximité" :

```text
[🍴 Restaurants] [🏨 Hôtels] [🚇 Transports]
```

Chaque onglet affiche :
- Les résultats de la base de données interne
- Un fallback vers des données locales si besoin

#### 3.2 Boutons d'action rapide

Ajouter un bouton transport à côté du bouton restaurant existant :
```text
[🍴] [🏨] [🚇]  (3 icônes dans le coin supérieur)
```

#### 3.3 Section transports dans l'itinéraire (`TripPlannerTab.tsx`)

Afficher les transports sauvegardés par ville :
```text
📍 Barcelone
   ├── Sagrada Familia
   ├── Parc Güell
   ├── 🍴 El Nacional (Restaurant)
   ├── 🏨 Hotel Arts (Hôtel)
   └── 🚇 Aeroport El Prat (Aéroport)
```

---

### Phase 4 : Insertion des données

#### 4.1 Hôtels (environ 150-200 entrées)

Pour les 5 plus grandes villes de chaque pays avec des lieux sacrés :

| Pays | Hôtels à ajouter (5 par ville × 5 villes) |
|------|------------------------------------------|
| France | Paris, Lyon, Marseille, Bordeaux, Toulouse = 25 hôtels |
| Espagne | Barcelone, Madrid, Séville, Valence, Grenade = 25 hôtels |
| Italie | Rome, Florence, Venise, Milan, Naples = 25 hôtels |
| États-Unis | New York, Washington, Boston, Los Angeles, San Francisco = 25 hôtels |
| Inde | New Delhi, Varanasi, Agra, Jaipur, Kolkata = 25 hôtels |
| Japon | Tokyo, Kyoto, Osaka, Nara, Hiroshima = 25 hôtels |
| Et autres pays... |

**Catégories d'hôtels** (pour chaque ville) :
- 1 hôtel budget / auberge
- 2 hôtels mid-range
- 2 hôtels de luxe

#### 4.2 Moyens de transport (environ 200-250 entrées)

Pour chaque grande ville, ajouter :

| Type | Exemples |
|------|----------|
| **Aéroport** | CDG Paris, JFK New York, Narita Tokyo |
| **Gare principale** | Gare de Lyon, Penn Station, Tokyo Station |
| **Métro/Lignes clés** | Stations centrales ou proches des lieux sacrés |
| **Bus touristiques** | City Sightseeing, Big Bus, etc. |

---

### Phase 5 : Hook et requêtes

#### 5.1 Créer `useHotels.ts`

```text
- useHotels() : Liste tous les hôtels
- useHotelsByCity(city) : Hôtels par ville
- useHotelById(id) : Un hôtel spécifique
```

#### 5.2 Créer `useTransports.ts`

```text
- useTransports() : Liste tous les transports
- useTransportsByCity(city) : Transports par ville
- useTransportsByType(type) : Transports par type
```

---

## Résumé des fichiers à modifier/créer

### Nouveaux fichiers
1. `src/hooks/useHotels.ts` - Hook pour les hôtels
2. `src/hooks/useTransports.ts` - Hook pour les transports

### Fichiers à modifier
1. `src/contexts/AppContext.tsx` - Ajouter types et fonctions pour transports
2. `src/pages/PlaceDetail.tsx` - Ajouter onglet transports et bouton
3. `src/components/TripPlannerTab.tsx` - Afficher hôtels et transports
4. `src/integrations/supabase/types.ts` - Sera mis à jour automatiquement

### Migrations base de données
1. Création table `hotels`
2. Création table `transport_stops`
3. Politiques RLS pour les deux tables
4. Insertion des données initiales (hôtels + transports)

---

## Ordre d'exécution

1. ✅ **Migration DB** : Tables `hotels` et `transport_stops` créées avec RLS
2. ✅ **Insertion données** : 78 hôtels + 82 transports (35 villes, 11 pays)
3. ✅ **Hooks** : `useHotels.ts` et `useTransports.ts` créés
4. ⏳ **Context** : Ajouter type `'transport'` à `SavedPOI` dans `AppContext.tsx`
5. ⏳ **UI PlaceDetail** : Ajouter onglet transports et bouton d'accès rapide
6. ⏳ **UI TripPlanner** : Afficher transports sauvegardés dans l'itinéraire

---

## Prochaines étapes

Les 3 dernières tâches (Context, PlaceDetail UI, TripPlanner UI) sont à implémenter.

