

# Plan de Vérification et Correction des 316 Images de Lieux Sacrés

## Résumé du Problème

Après analyse approfondie du projet, voici la situation actuelle :
- **316 lieux** sont définis dans `src/data/placesData.ts` (fichier local)
- **54 lieux supplémentaires** sont dans la base de données Supabase (principalement des musées)
- **209 images locales** existent dans `src/assets/places/`
- **~107 lieux** n'ont potentiellement pas d'image locale correspondante

Le problème identifié : certaines images locales ne représentent pas correctement le lieu indiqué. Par exemple, la Cathédrale Saint-Étienne de Toulouse affiche une mauvaise image malgré l'existence d'un fichier `toulouse-st-etienne.jpg`.

---

## Stratégie de Correction

### Phase 1 : Audit Complet des Images Locales (Priorité Haute)

Vérifier manuellement les 209 images existantes dans `/src/assets/places/` pour identifier :
- Images incorrectes (ne représentant pas le bon lieu)
- Images de mauvaise qualité
- Images dupliquées

### Phase 2 : Récupération Automatisée via Wikipedia API

Pour chaque lieu sans image ou avec image incorrecte :

1. Utiliser l'edge function `fetch-wikipedia-image` existante
2. Construire une recherche Wikipedia basée sur le nom du lieu
3. Récupérer l'URL Wikimedia Commons officielle
4. Mettre à jour le champ `image_url` dans Supabase

### Phase 3 : Migration vers Base de Données

Plutôt que de stocker 316 images locales, nous allons :

1. **Migrer tous les lieux locaux vers Supabase** avec des URLs Wikipedia/Wikimedia valides
2. **Stocker les URLs d'images directement dans la BDD** (champ `image_url`)
3. **Conserver les images locales en fallback** pour les cas sans Wikipedia

---

## Implémentation Technique

### Étape 1 : Créer un Script d'Audit Admin

Un nouvel outil admin pour :
- Lister tous les lieux avec leur image actuelle
- Afficher un aperçu de chaque image
- Permettre la validation/correction manuelle
- Récupérer automatiquement l'image Wikipedia si disponible

### Étape 2 : Améliorer l'Edge Function Wikipedia

Modifier `fetch-wikipedia-image` pour :
- Supporter les recherches multilingues (fr, en, es, de, it)
- Fallback sur Wikimedia Commons direct
- Retourner plusieurs images candidates

### Étape 3 : Créer une Page Admin d'Audit d'Images

Nouvelle page `/admin/audit-images` avec :

```
┌─────────────────────────────────────────────────────────────┐
│  AUDIT DES IMAGES - 316 LIEUX                               │
├─────────────────────────────────────────────────────────────┤
│  ☐ Afficher uniquement les problèmes                        │
│  ☐ Trier par pays                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🇫🇷 France (35 lieux)                                      │
│  ┌─────────┬──────────────────────────────────────────────┐ │
│  │ [Image] │ Notre-Dame de Paris                         │ │
│  │         │ ✅ Image locale valide                       │ │
│  │         │ [Voir Wikipedia] [Remplacer]                │ │
│  └─────────┴──────────────────────────────────────────────┘ │
│  ┌─────────┬──────────────────────────────────────────────┐ │
│  │ [Image] │ Cathédrale Saint-Étienne de Toulouse        │ │
│  │ ⚠️      │ ⚠️ Image potentiellement incorrecte          │ │
│  │         │ [Charger depuis Wikipedia] [Upload]         │ │
│  └─────────┴──────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Étape 4 : Mise à Jour en Masse

Créer un bouton "Corriger automatiquement" qui :
1. Parcourt les 316 lieux un par un
2. Vérifie si une image Wikipedia existe
3. Met à jour la BDD avec l'URL valide
4. Génère un rapport des corrections

---

## Fichiers à Créer/Modifier

| Fichier | Action |
|---------|--------|
| `src/pages/AdminAuditImages.tsx` | Créer - Interface d'audit des images |
| `src/hooks/useImageAudit.ts` | Créer - Logique d'audit et correction |
| `supabase/functions/batch-fetch-images/index.ts` | Créer - Récupération en masse Wikipedia |
| `supabase/functions/fetch-wikipedia-image/index.ts` | Modifier - Améliorer la recherche |
| `src/App.tsx` | Modifier - Ajouter la route admin |
| Migration SQL | Exécuter - Migrer les lieux locaux vers BDD |

---

## Avantages de Cette Approche

1. **Vérification Visuelle** : Chaque image peut être validée par un admin
2. **Sources Fiables** : Wikipedia/Wikimedia Commons = images vérifiées et libres de droits
3. **Maintenabilité** : URLs en BDD plutôt que fichiers locaux
4. **Scalabilité** : Facile d'ajouter de nouveaux lieux
5. **Traçabilité** : Historique des corrections dans la BDD

---

## Estimation du Travail

- **Phase 1** (Interface Admin) : ~2 heures
- **Phase 2** (Amélioration Edge Function) : ~1 heure
- **Phase 3** (Migration des 316 lieux) : ~3 heures (semi-automatisé)
- **Phase 4** (Vérification manuelle) : Variable selon les corrections nécessaires

---

## Note Importante

Cette tâche nécessite une vérification humaine car :
- Les API Wikipedia ne garantissent pas toujours la bonne image
- Certains lieux ont plusieurs images possibles
- La qualité des images varie

Je recommande de procéder pays par pays pour une validation progressive plutôt qu'une correction globale risquée.

