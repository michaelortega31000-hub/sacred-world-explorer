

# Plan : Améliorer la connaissance de l'interface par l'assistant

## Problème identifié

L'assistant a indiqué "utilisez l'icône de réglages en haut à droite" alors que :
- Le **filtre de catégories** est en **bas à gauche** (position fixe, flottante)
- Le **bouton de géolocalisation** est en **haut à gauche** dans le header
- Il n'y a **pas d'icône de réglages** dans l'interface

L'assistant "hallucine" sur les positions des éléments car son prompt système ne contient aucune description précise du layout de l'interface.

## Solution proposée

Ajouter une documentation détaillée de l'interface (UI Layout Guide) dans le prompt système de l'edge function `sacred-assistant`. Cette documentation sera **spécifique à chaque page** pour que l'assistant donne des indications précises.

## Modifications à effectuer

### 1. Créer un guide de layout détaillé par page

Ajouter une constante `UI_LAYOUT_GUIDE` dans l'edge function avec la description exacte de chaque élément et sa position :

```text
PAGE /explore (Carte interactive) :
- HEADER (en haut) :
  - Gauche : Icône de ta tradition (grand cercle), compteur de badges, bouton de géolocalisation (petit cercle)
  - Centre : Logo Sacred World
  - Droite : Bouton micro (commande vocale), icône messages, bouton assistant (grand cercle turquoise)
  
- CARTE (centre) : Globe 3D interactif avec marqueurs des lieux sacrés

- BOUTON DE FILTRE (en bas à gauche, flottant) :
  - Permet de filtrer entre "Tous" et "Lieux sacrés"
  - C'est le seul moyen de filtrer les catégories

- ONGLETS (en bas, au-dessus de la navigation) :
  - Carte | AR | Proche | Lieux | Défis | Rang
```

### 2. Injecter le contexte UI dans le prompt

Modifier la fonction pour injecter automatiquement le layout de la page actuelle dans le prompt système, afin que l'assistant sache exactement où se trouvent les éléments.

### 3. Fichier à modifier

**`supabase/functions/sacred-assistant/index.ts`** :
- Ajouter la constante `UI_LAYOUT_GUIDE` avec les descriptions de chaque page
- Ajouter une fonction `getUILayoutForRoute(route)` qui retourne le layout de la page
- Injecter ce layout dans le `fullSystemPrompt` avant l'appel à l'IA

## Exemple de résultat attendu

Quand l'utilisateur demande "Aide-moi à filtrer", l'assistant répondra :

> « Pour filtrer les lieux, regarde en **bas à gauche** de l'écran 🗺️
> Tu verras un bouton avec "Tous" ou "Lieux sacrés".
> Clique dessus pour changer le type de lieux affichés sur la carte ! ✨
> 
> Tu veux voir uniquement les lieux sacrés ou tous les lieux ? »

---

## Détails techniques

Le layout sera structuré ainsi pour chaque page clé :

| Page | Éléments clés et positions |
|------|---------------------------|
| `/explore` | Filtre = bas gauche, Géoloc = header gauche, Assistant = header droite |
| `/place/:id` | Bouton retour = header, Infos = scrollable au centre |
| `/profile` | Avatar = haut, Stats = centre, Badges = tabs |
| `/calendar` | Filtre événements = haut, Liste = centre |
| `/traditions` | Grille de traditions = centre, Recherche = haut |

