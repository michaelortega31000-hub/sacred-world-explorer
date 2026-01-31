
# Plan : Ajout de restaurants réels avec coordonnées GPS pour toutes les villes

## Problème actuel

1. **310 restaurants dans la base de données, mais 0 ont des coordonnées GPS**
2. Le filtrage par proximité (50km) ne fonctionne pas car aucun restaurant n'a de coordonnées
3. Quand aucun restaurant n'est trouvé à proximité, l'application affiche tous les restaurants mondiaux (Bangkok, etc.)

## Solution complète

### Phase 1 : Mise à jour des restaurants existants avec coordonnées

Utiliser l'API Mapbox Geocoding via l'edge function `geocode-restaurants` pour ajouter automatiquement les coordonnées aux 310 restaurants existants.

### Phase 2 : Ajout de restaurants réels pour les villes manquantes

Voici les villes qui ont des lieux sacrés/culturels mais potentiellement pas assez de restaurants :

| Région | Villes concernées |
|--------|-------------------|
| **Thaïlande** | Bangkok, Chiang Mai, Chiang Rai, Ayutthaya, Pattaya, Phuket |
| **Amérique du Sud** | La Paz, Cusco, Lima, Quito, Bogotá, Buenos Aires, São Paulo |
| **Europe supplémentaire** | Londres, Madrid, Barcelone, Lisbonne, Porto, Amsterdam |
| **Asie** | Tokyo, Seoul, Taipei, Kuala Lumpur, Delhi, Kolkata |
| **Moyen-Orient/Afrique** | Le Caire, Jérusalem, Tunis, Doha, Téhéran |
| **États-Unis** | Washington D.C., Boston, New Orleans, San Francisco, Los Angeles |

Pour chaque ville, je vais ajouter **10-20 restaurants réels** avec :
- Nom authentique (vérifié sur Google/TripAdvisor)
- Adresse complète
- Coordonnées GPS précises (lat/lng)
- Type de cuisine
- Type de restaurant (halal, kosher, végétarien, etc.)

### Phase 3 : Données à insérer

Exemple pour la **Thaïlande (Bangkok)** - restaurants réels avec coordonnées :

```sql
INSERT INTO restaurants (name, cuisine, address, city, country, continent, type, coordinates, verified) VALUES
('Baan Phadthai', 'Thaï', '21-23 Charoen Krung Soi 44', 'Bangkok', 'Thailand', 'Asia', '{neutral}', '{"lat": 13.7263, "lng": 100.5018}', true),
('Raan Jay Fai', 'Thaï', '327 Maha Chai Rd, Samran Rat', 'Bangkok', 'Thailand', 'Asia', '{neutral}', '{"lat": 13.7589, "lng": 100.5029}', true),
('Thip Samai', 'Thaï', '313 Maha Chai Rd', 'Bangkok', 'Thailand', 'Asia', '{neutral}', '{"lat": 13.7525, "lng": 100.5012}', true),
('Krua Apsorn', 'Thaï', '503-505 Samsen Rd', 'Bangkok', 'Thailand', 'Asia', '{neutral}', '{"lat": 13.7698, "lng": 100.5023}', true),
('Ibrahim Restaurant', 'Halal/Moyen-Orient', '41/1-2 Charoen Krung Rd', 'Bangkok', 'Thailand', 'Asia', '{halal}', '{"lat": 13.7456, "lng": 100.5132}', true),
-- ... (15+ restaurants supplémentaires pour Bangkok)
```

Exemple pour **Chiang Mai** :

```sql
INSERT INTO restaurants (name, cuisine, address, city, country, continent, type, coordinates, verified) VALUES
('Khao Soi Khun Yai', 'Thaï du Nord', '13 Moo 13, Tambon Pa Phai', 'Chiang Mai', 'Thailand', 'Asia', '{neutral}', '{"lat": 18.7892, "lng": 98.9847}', true),
('Huen Phen', 'Thaï du Nord', '112 Rachamankha Road', 'Chiang Mai', 'Thailand', 'Asia', '{neutral}', '{"lat": 18.7875, "lng": 98.9891}', true),
('SP Chicken', 'Thaï', '9/1 Soi 1 Sam Lan Road', 'Chiang Mai', 'Thailand', 'Asia', '{neutral}', '{"lat": 18.7863, "lng": 98.9912}', true),
-- ... (15+ restaurants supplémentaires)
```

### Phase 4 : Correction du comportement de fallback

Modifier `RestaurantsTab.tsx` pour :
1. Ne **jamais** basculer automatiquement sur "tous les restaurants" si aucun n'est trouvé
2. Afficher un message clair : "Aucun restaurant trouvé dans un rayon de 50km"
3. Proposer d'ajouter un restaurant avec les coordonnées pré-remplies

## Fichiers à modifier

| Fichier | Modification |
|---------|-------------|
| Base de données | Insérer 200-300 nouveaux restaurants avec coordonnées GPS réelles |
| `src/components/RestaurantsTab.tsx` | Supprimer le fallback automatique vers "tous les restaurants" |
| `supabase/functions/geocode-restaurants/index.ts` | Exécuter pour géocoder les restaurants existants |

## Villes prioritaires (première vague)

Je vais commencer par les villes qui ont le plus de lieux sacrés dans l'application :

1. **Bangkok** (14 temples) → 20 restaurants
2. **Chiang Mai** (4 temples) → 15 restaurants
3. **Rome** (multiples basiliques) → 15 restaurants
4. **Paris** (multiples églises) → Déjà fait, vérifier coordonnées
5. **Cusco** (3 lieux) → 10 restaurants
6. **Jérusalem** → 15 restaurants (halal, kosher, autres)
7. **Le Caire** → 10 restaurants

## Résultat attendu

Après implémentation :
- Cliquer sur 🍽️ depuis un temple à Bangkok → affiche uniquement les restaurants dans les 50km autour de Bangkok
- Cliquer sur 🍽️ depuis un lieu en Bolivie → affiche "Aucun restaurant référencé" (avec option d'en ajouter)
- Les restaurants sont de vrais établissements avec coordonnées GPS précises
