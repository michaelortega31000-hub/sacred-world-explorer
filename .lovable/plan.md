
# Plan : Correction des images manquantes pour les lieux sacrés

## Problemes identifies

### 1. Erreur de build critique dans `toggle-group.tsx`
Le fichier `src/components/ui/toggle-group.tsx` est casse - les composants `ToggleGroup` et `ToggleGroupItem` ne retournent rien (void) au lieu de retourner du JSX. Cela cause une erreur TypeScript.

### 2. Places dans la base de donnees avec image locale existante
16 places dans la base de donnees ont `image_url = NULL` mais des images locales correspondantes existent. Il suffit de mettre a jour la base de donnees avec les URLs correctes :

| ID Place | Nom | Image locale disponible |
|----------|-----|------------------------|
| `col-las-lajas` | Sanctuaire de Las Lajas | `/src/assets/places/las-lajas.jpg` |
| `ecu-san-francisco-quito` | Eglise de San Francisco de Quito | `/src/assets/places/iglesia-san-francisco-quito.jpg` |
| `per-cusco-cathedral` | Cathedrale de Cusco | `/src/assets/places/cusco-cathedral.jpg` |
| `per-compania-jesus-cusco` | Eglise de la Compagnie de Jesus | `/src/assets/places/compania-jesus-cusco.jpg` |

### 3. Places necessitant de nouvelles images (Wikipedia)
Ces 12 places n'ont pas d'image locale ni d'URL - il faudra recuperer des images via Wikipedia ou les ajouter manuellement :

**Argentine :**
- Manzana Jesuitique de Cordoba
- Missions jesuites de San Ignacio Mini

**Bolivie :**
- Basilique Notre-Dame de Copacabana
- Tiwanaku

**Chili :**
- Eglises de Chiloe

**Paraguay (6 missions jesuites) :**
- Mission de Jesus de Tavarangue
- Mission de San Cosme y San Damian
- Mission de San Ignacio Guazu
- Mission de Santa Maria de Fe
- Mission de Santiago
- Mission de la Santisima Trinidad de Parana

**Perou :**
- Qorikancha - Temple du Soleil

---

## Plan d'implementation

### Phase 1 : Correction du fichier toggle-group.tsx

Restaurer le fichier avec le code JSX correct pour les deux composants :

```tsx
// ToggleGroup doit retourner le JSX du Provider avec les enfants
// ToggleGroupItem doit retourner le ToggleGroupPrimitive.Item avec les props
```

### Phase 2 : Mise a jour des URLs d'images en base de donnees

Executer une requete UPDATE pour les 4 places qui ont des images locales :

```text
UPDATE places SET image_url = '/src/assets/places/las-lajas.jpg' WHERE id = 'col-las-lajas';
UPDATE places SET image_url = '/src/assets/places/iglesia-san-francisco-quito.jpg' WHERE id = 'ecu-san-francisco-quito';
UPDATE places SET image_url = '/src/assets/places/cusco-cathedral.jpg' WHERE id = 'per-cusco-cathedral';
UPDATE places SET image_url = '/src/assets/places/compania-jesus-cusco.jpg' WHERE id = 'per-compania-jesus-cusco';
```

### Phase 3 : Recuperation des images manquantes via Wikipedia

Utiliser la Edge Function `fetch-wikipedia-image` existante pour recuperer automatiquement des images pour les 12 places restantes :

| Place | Titre Wikipedia suggere |
|-------|------------------------|
| Manzana Jesuitique Cordoba | "Manzana Jesuítica" |
| San Ignacio Mini | "San Ignacio Mini" |
| Copacabana Basilica | "Basilica of Our Lady of Copacabana" |
| Tiwanaku | "Tiwanaku" |
| Chiloe Churches | "Churches of Chiloé" |
| Missions Paraguay | "Jesuit Missions of Paraguay" |
| Qorikancha | "Coricancha" |

### Phase 4 : Verification du hook usePlaces

Confirmer que le fallback dans `usePlaces.ts` fonctionne correctement :
- La fonction `tryMatchLocalImage()` normalise les noms pour trouver des correspondances
- Si aucune image n'est trouvee, elle utilise `/images/place-placeholder.jpg`

---

## Fichiers a modifier

1. **`src/components/ui/toggle-group.tsx`** - Restaurer le code JSX manquant
2. **Base de donnees `places`** - Mise a jour des URLs pour 4 places
3. **Base de donnees `places`** - Ajout des URLs Wikipedia pour 12 places

---

## Resume des actions

| Etape | Action | Nombre de places |
|-------|--------|-----------------|
| 1 | Corriger erreur build toggle-group.tsx | 1 fichier |
| 2 | Mettre a jour URLs images locales | 4 places |
| 3 | Ajouter URLs images Wikipedia | 12 places |
| **Total** | Places avec images corrigees | **16 places** |
