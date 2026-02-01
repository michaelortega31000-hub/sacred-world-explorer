
# Plan : Actions rapides sur les popups du globe

## Contexte

Actuellement, lorsqu'on clique sur un lieu depuis le globe 3D, une popup s'affiche avec :
- L'image du lieu
- Le nom, type et pays
- La description (150 caracteres)
- Les points
- Le statut "visite" si applicable

**Probleme identifie** : L'utilisateur ne peut pas directement :
1. Ajouter le lieu a son itineraire
2. Acceder aux services de proximite (restaurants, hotels, transports)

Il doit obligatoirement naviguer vers la page de detail du lieu pour effectuer ces actions.

---

## Solution proposee

Enrichir les popups du globe avec des boutons d'action rapide pour :
- **Ajouter/retirer de l'itineraire** (bouton + ou checkmark)
- **Voir les services a proximite** (bouton couverts/hotel)
- **Acceder a la page detail** (garder le comportement actuel sur clic image)

---

## Implementation technique

### 1. Modifier la popup des lieux standards (places-circles)

**Fichier** : `src/components/Globe3D.tsx` (lignes ~944-979)

Ajouter une barre d'actions en bas de la popup avec :

```text
+-----------------------------------------------+
|  [Image cliquable -> page detail]             |
|  Nom du lieu                                  |
|  Type - Pays                                  |
|  Description...                               |
|  Points          Statut visite                |
+-----------------------------------------------+
|  [+ Itineraire]  [Couverts]  [Hotel]  [Bus]   |
+-----------------------------------------------+
```

### 2. Gerer les evenements depuis le HTML inline

Comme les popups Mapbox utilisent du HTML inline, on utilisera des `CustomEvent` dispatches sur `window` pour communiquer avec React :

- `addToTripFromGlobe` : Ajouter a l'itineraire
- `removeFromTripFromGlobe` : Retirer de l'itineraire  
- `openServicesFromGlobe` : Ouvrir les services (restaurant/hotel/transport)
- `navigateToPlace` : Naviguer vers la page detail (deja existant)

### 3. Ajouter les event listeners dans l'effet d'initialisation

```text
window.addEventListener('addToTripFromGlobe', ...)
window.addEventListener('removeFromTripFromGlobe', ...)
window.addEventListener('openServicesFromGlobe', ...)
```

### 4. Modifier la popup de l'itineraire (trip-places-circles)

Pour les lieux deja dans l'itineraire, proposer :
- **Retirer de l'itineraire** (bouton X)
- **Voir les services**
- **Ouvrir la page**

---

## Details de la popup modifiee

### Boutons d'action (style inline)

| Action | Icone | Couleur | Comportement |
|--------|-------|---------|--------------|
| Ajouter itineraire | + | Vert | Ajoute et affiche toast |
| Retirer itineraire | X | Rouge | Retire et affiche toast |
| Restaurants | Couverts | Blanc | Navigue vers `/country/{pays}?tab=restaurants&city={ville}` |
| Hotels | Lit | Blanc | Navigue vers `/place/{id}` puis scroll vers services |
| Transports | Bus | Blanc | Idem |

### Contrainte technique

Comme la popup est du HTML inline (pas du React), on passera les donnees necessaires dans les attributs `onclick` et on ecoutera les evenements sur `window`.

---

## Fichiers a modifier

| Fichier | Modifications |
|---------|---------------|
| `src/components/Globe3D.tsx` | Ajouter boutons dans les popups HTML, ajouter event listeners pour les actions |

---

## Flux utilisateur ameliore

```text
1. L'utilisateur clique sur un lieu depuis le globe
2. Une popup s'affiche avec :
   - Image + infos du lieu
   - Barre d'actions rapides en bas
3. L'utilisateur peut :
   a) Cliquer sur l'image -> Page detail complete
   b) Cliquer sur [+] -> Ajoute a l'itineraire (toast confirmation)
   c) Cliquer sur [Couverts] -> Page pays, onglet restaurants filtre par ville
   d) Cliquer sur [Hotel/Transport] -> Page detail, scroll vers services
```

---

## Avantages

- **Gain de temps** : Plus besoin de naviguer vers la page detail pour des actions simples
- **Coherence** : Memes actions disponibles partout (globe, page pays, page detail)
- **Accessibilite** : Options de reservation/services immediatement visibles
