
# Plan : Filtrage des restaurants par proximité (50km)

## Problème identifié

Quand l'utilisateur clique sur l'icône restaurant d'un lieu en Bolivie :
1. Le code navigue vers `/country/Bolivia?tab=restaurants&city=La Paz`
2. `RestaurantsTab` cherche des restaurants avec `city = "La Paz"` dans la base
3. Aucun restaurant n'existe en Bolivie → le filtre passe à "tous les continents"
4. Résultat : affichage de tous les restaurants mondiaux (Bangkok, etc.)

**Cause racine** : La table `restaurants` n'a pas de coordonnées GPS, donc impossible de filtrer par distance géographique.

---

## Solution proposée

### 1. Ajouter une colonne `coordinates` à la table `restaurants`

```sql
ALTER TABLE restaurants 
ADD COLUMN coordinates jsonb;
```

### 2. Mettre à jour les restaurants existants avec leurs coordonnées

Utiliser l'API Mapbox Geocoding pour convertir `address + city + country` en coordonnées latitude/longitude pour les restaurants existants.

### 3. Modifier `RestaurantsTab` pour accepter les coordonnées du lieu

```tsx
interface RestaurantsTabProps {
  country?: string;
  city?: string;
  placeCoordinates?: [number, number]; // NOUVEAU
  maxDistanceKm?: number; // NOUVEAU (défaut: 50)
}
```

### 4. Implémenter le filtrage par proximité

Quand `placeCoordinates` est fourni :
- Récupérer tous les restaurants avec coordonnées
- Calculer la distance entre chaque restaurant et le lieu
- Filtrer ceux qui sont à moins de 50km
- Si aucun restaurant dans le rayon : afficher un message clair au lieu de basculer sur tous les restaurants

```tsx
const filterByProximity = (restaurants: Restaurant[], centerCoords: [number, number], maxKm: number) => {
  return restaurants.filter(r => {
    if (!r.coordinates) return false;
    const distance = calculateDistance(
      centerCoords[1], centerCoords[0], // lat, lon du lieu
      r.coordinates.lat, r.coordinates.lng // lat, lon du restaurant
    );
    return distance <= maxKm * 1000; // Convertir km en mètres
  });
};
```

### 5. Modifier la navigation depuis Country.tsx

Passer les coordonnées du lieu dans l'URL :

```tsx
// Avant
navigate(`/country/${country}?tab=restaurants&city=${encodeURIComponent(place.city)}`);

// Après
navigate(`/country/${country}?tab=restaurants&city=${encodeURIComponent(place.city)}&lat=${place.coordinates[1]}&lng=${place.coordinates[0]}`);
```

### 6. Améliorer l'UX quand aucun restaurant n'est trouvé

Afficher un message explicite :
```
🍽️ Aucun restaurant référencé dans un rayon de 50km
Soyez le premier à ajouter un restaurant !
[+ Ajouter un restaurant]
```

---

## Fichiers à modifier

| Fichier | Modification |
|---------|-------------|
| `supabase/migrations/` | Ajouter colonne `coordinates` à `restaurants` |
| `src/components/RestaurantsTab.tsx` | Accepter `placeCoordinates`, filtrer par distance, gérer le cas "aucun résultat" |
| `src/pages/Country.tsx` | Passer `lat` et `lng` dans l'URL de navigation |
| `src/components/AddRestaurantDialog.tsx` | Géocoder l'adresse pour stocker les coordonnées |

---

## Flux après implémentation

```text
Utilisateur clique sur 🍽️ en Bolivie
         ↓
Navigation: /country/Bolivia?tab=restaurants&city=La+Paz&lat=-16.5&lng=-68.15
         ↓
RestaurantsTab récupère tous les restaurants avec coordonnées
         ↓
Calcul distance pour chaque restaurant
         ↓
Filtre: distance ≤ 50km
         ↓
Si 0 résultats → "Aucun restaurant dans les 50km"
Si N résultats → Affiche les N restaurants proches
```

---

## Migration de données existantes

Pour les 30+ restaurants existants (Bangkok, USA, etc.), une migration sera nécessaire pour :
1. Géocoder leurs adresses via Mapbox
2. Stocker les coordonnées dans la nouvelle colonne

Cette migration peut être faite via une edge function ou manuellement.

---

## Alternative légère (sans coordonnées)

Si l'ajout de coordonnées est trop complexe pour l'instant, une solution intermédiaire :
- Quand aucun restaurant n'est trouvé dans la ville, **ne pas basculer sur "tous"**
- Afficher simplement "Aucun restaurant à [ville]" avec le bouton pour en ajouter un

Cette solution est plus rapide à implémenter mais ne résout pas le filtrage géographique réel.
