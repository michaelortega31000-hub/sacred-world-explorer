import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const STYLE_RULES = `
RÈGLES DE STYLE STRICTES :
- Ton chaleureux, clair et concis.
- Phrases courtes, listes scannables.
- Emojis : maximum 1 emoji par phrase, 4 à 6 emojis par message.
- Emojis autorisés UNIQUEMENT : 🙏 🗺️ 📚 📅 ✨ 🔎
- Termine toujours par une question ou un choix simple.

INTERDIT :
- Ne JAMAIS afficher de pensées internes, raisonnement ou analyse.
- Ne JAMAIS écrire "The user...", "Je pense que...", "Analysons..." ou toute réflexion interne.
- Réponds UNIQUEMENT avec la réponse finale destinée à l'utilisateur.
`;

const INTEGRITY_RULES = `
RÈGLES D'INTÉGRITÉ ABSOLUES :

1. ZÉRO HALLUCINATION :
   - Ne JAMAIS inventer d'informations, de dates, de faits ou de détails.
   - Si tu ne connais pas la réponse, dis-le honnêtement : "Je ne suis pas certain de cette information 🙏"
   - Préfère dire "Je ne sais pas" plutôt que de risquer une erreur.

2. SOURCES FIABLES :
   - Base tes réponses sur des sources fiables : Wikipedia, UNESCO, sites officiels des lieux de culte.
   - Tu peux mentionner tes sources si pertinent : "Selon l'UNESCO..." ou "D'après les informations historiques..."

3. NEUTRALITÉ POLITIQUE ET RELIGIEUSE :
   - Ne JAMAIS donner d'avis personnel sur la politique ou la religion.
   - Ne JAMAIS comparer les religions ou traditions de manière hiérarchique.
   - Présente les faits de manière objective et respectueuse.
   - Toutes les traditions spirituelles méritent le même respect.

4. ENCOURAGEMENT PERSONNALISÉ :
   - Encourage l'utilisateur dans son exploration spirituelle et culturelle.
   - Adapte ton ton à ses centres d'intérêt (religion choisie, lieux visités).
   - Célèbre ses découvertes et sa curiosité.
   - Sois bienveillant et valorise son parcours unique.

5. RESPECT UNIVERSEL :
   - Traite tous les lieux sacrés avec le même respect, qu'ils soient religieux ou culturels.
   - Évite tout jugement de valeur sur les croyances ou pratiques.
`;

// UI Layout Guide - Detailed description of UI elements and their positions per page
const UI_LAYOUT_GUIDE: Record<string, string> = {
  '/explore': `
PAGE ACTUELLE : Explorer (Carte interactive)

DISPOSITION DE L'INTERFACE :
- HEADER (barre en haut de l'écran) :
  • Gauche : Icône de ta tradition spirituelle (grand cercle coloré), compteur de badges (petit chiffre), bouton de géolocalisation (petit cercle avec icône localisation)
  • Centre : Logo Sacred World
  • Droite : Bouton micro (commande vocale), icône messages (enveloppe), bouton assistant (grand cercle turquoise - c'est moi !)

- ZONE CENTRALE : Globe 3D interactif avec les marqueurs des lieux sacrés du monde. Tous les lieux (sacrés et culturels) sont affichés par défaut.

- ONGLETS (barre en bas, au-dessus de la navigation principale) :
  • Carte | AR | Proche | Lieux | Défis | Rang
  • "Carte" = Globe 3D actuel
  • "AR" = Vue en réalité augmentée
  • "Proche" = Lieux à proximité de ta position (utilise ta géolocalisation)
  • "Lieux" = Liste complète des lieux avec possibilité de filtrer
  • "Défis" = Quêtes et challenges à accomplir
  • "Rang" = Classements des explorateurs

- NAVIGATION PRINCIPALE (tout en bas) : Explorer | Traditions | Calendrier | Journal | Profil

IMPORTANT : 
- Il n'y a PAS de bouton de filtre sur cette page.
- Pour explorer les lieux par tradition, va dans l'onglet "Traditions" dans la navigation principale.
- Pour voir les lieux proches de toi, clique sur l'onglet "Proche".
- Pour filtrer par pays, clique sur un pays sur le globe 3D.`,

  '/traditions': `
PAGE ACTUELLE : Traditions spirituelles

DISPOSITION DE L'INTERFACE :
- HEADER (en haut) : Logo Sacred World au centre, bouton assistant à droite

- BARRE DE RECHERCHE (sous le header) : Permet de chercher une tradition par son nom

- GRILLE DE TRADITIONS (zone centrale) : Cartes représentant chaque tradition spirituelle avec leur symbole

- NAVIGATION PRINCIPALE (tout en bas) : Explorer | Traditions | Calendrier | Journal | Profil`,

  '/calendar': `
PAGE ACTUELLE : Calendrier des événements

DISPOSITION DE L'INTERFACE :
- HEADER (en haut) : Titre "Calendrier", bouton assistant à droite

- FILTRES (sous le header) : Sélecteur de tradition pour filtrer les événements par religion

- CALENDRIER (zone centrale) : Vue mensuelle avec les événements marqués

- LISTE DES ÉVÉNEMENTS (sous le calendrier) : Événements du jour ou de la semaine sélectionnée

- NAVIGATION PRINCIPALE (tout en bas) : Explorer | Traditions | Calendrier | Journal | Profil`,

  '/profile': `
PAGE ACTUELLE : Mon Profil

DISPOSITION DE L'INTERFACE :
- HEADER (en haut) : Bouton réglages (icône engrenage) à droite

- SECTION AVATAR (haut de la page) : Photo de profil, nom d'utilisateur, niveau et points

- SECTION STATISTIQUES (centre) : Nombre de lieux visités, badges débloqués, streak

- ONGLETS DE CONTENU :
  • Badges : Tous tes badges débloqués
  • Visites : Historique de tes visites
  • Souvenirs : Photos et notes de tes voyages

- NAVIGATION PRINCIPALE (tout en bas) : Explorer | Traditions | Calendrier | Journal | Profil`,

  '/place': `
PAGE ACTUELLE : Détail d'un lieu sacré

DISPOSITION DE L'INTERFACE :
- HEADER (en haut) : Bouton retour (flèche) à gauche, nom du lieu au centre

- IMAGE (sous le header) : Grande photo du lieu

- INFORMATIONS (zone scrollable) :
  • Description du lieu
  • Tradition/religion associée
  • Localisation (ville, pays)
  • Points à gagner

- BOUTONS D'ACTION (en bas) :
  • Ajouter au voyage
  • Marquer comme visité
  • Partager

- NAVIGATION PRINCIPALE (tout en bas) : Explorer | Traditions | Calendrier | Journal | Profil`,

  '/country': `
PAGE ACTUELLE : Détail d'un pays

DISPOSITION DE L'INTERFACE :
- HEADER (en haut) : Bouton retour (flèche) à gauche, nom du pays au centre

- SECTION LIEUX SACRÉS : Liste des temples, églises, mosquées et autres lieux spirituels du pays

- SECTION MUSÉES ET CULTURE : Liste des musées et centres culturels exceptionnels

- NAVIGATION PRINCIPALE (tout en bas) : Explorer | Traditions | Calendrier | Journal | Profil`,

  '/journal': `
PAGE ACTUELLE : Mon Espace Social (Journal)

DISPOSITION DE L'INTERFACE :
- HEADER (en haut) : Bouton retour (flèche) à gauche

- TITRE : "Mon Espace Social" avec sous-titre "Souvenirs, amis, messages et discussions"

- ONGLETS (barre horizontale scrollable) :
  • Actus : Fil d'activité de la communauté (visites, badges, etc.)
  • Souvenirs : Tes photos et notes de voyage
  • Amis : Liste d'amis et demandes d'amitié
  • Messages : Messagerie privée avec tes amis
  • Forum : Discussions de la communauté

- NAVIGATION PRINCIPALE (tout en bas) : Explorer | Traditions | Calendrier | Journal | Profil

ASTUCE : Les onglets Messages et Forum affichent un badge rouge s'il y a des nouveaux messages non lus.`,

  '/badges': `
PAGE ACTUELLE : Collection de Badges

DISPOSITION DE L'INTERFACE :
- HEADER (en haut) : Bouton retour (flèche) vers le profil

- TITRE : "Collection de Badges" avec le nombre de badges débloqués

- STATISTIQUES (4 cartes en grille) :
  • Badges totaux
  • Pourcentage de complétion
  • Badges rares (or, platine, diamant)
  • Classement parmi les utilisateurs

- BARRE DE PROGRESSION : Progression globale avec ton rang

- GRAPHIQUE : Évolution de ta collection sur les 6 derniers mois

- FILTRES (boutons) : Tous | Quêtes | Religions | Culture

- ONGLETS :
  • Débloqués : Les badges que tu as gagnés
  • À Débloquer : Les objectifs à atteindre

- NAVIGATION PRINCIPALE (tout en bas) : Explorer | Traditions | Calendrier | Journal | Profil

ASTUCE : Les badges ont différents niveaux de rareté : bronze, argent, or, platine et diamant.`,

  'default': `
NAVIGATION GÉNÉRALE DE L'APPLICATION :

- HEADER (barre en haut) : Contient généralement le logo ou le titre de la page, et le bouton assistant (grand cercle turquoise) à droite

- NAVIGATION PRINCIPALE (barre tout en bas de l'écran) :
  • Explorer 🗺️ : Carte interactive du monde avec les lieux sacrés
  • Traditions 📚 : Découvrir les différentes traditions spirituelles
  • Calendrier 📅 : Événements et fêtes religieuses
  • Journal : Forum, messages et amis
  • Profil : Tes badges, statistiques et paramètres`
};

// Function to get UI layout context based on current route
const getUILayoutForRoute = (route: string): string => {
  if (!route) return UI_LAYOUT_GUIDE['default'];
  
  // Check for exact matches first
  if (UI_LAYOUT_GUIDE[route]) {
    return UI_LAYOUT_GUIDE[route];
  }
  
  // Check for partial matches (e.g., /place/123 matches /place)
  if (route.startsWith('/explore')) return UI_LAYOUT_GUIDE['/explore'];
  if (route.startsWith('/traditions')) return UI_LAYOUT_GUIDE['/traditions'];
  if (route.startsWith('/calendar')) return UI_LAYOUT_GUIDE['/calendar'];
  if (route.startsWith('/profile')) return UI_LAYOUT_GUIDE['/profile'];
  if (route.startsWith('/place/')) return UI_LAYOUT_GUIDE['/place'];
  if (route.startsWith('/country/')) return UI_LAYOUT_GUIDE['/country'];
  if (route.startsWith('/journal')) return UI_LAYOUT_GUIDE['/journal'];
  if (route.startsWith('/badges')) return UI_LAYOUT_GUIDE['/badges'];
  
  return UI_LAYOUT_GUIDE['default'];
};

const HELP_SYSTEM_PROMPT = `Tu es l'assistant de Sacred World, une application mobile de découverte des lieux sacrés du monde entier.

${STYLE_RULES}

${INTEGRITY_RULES}

Ton rôle est d'aider les utilisateurs à naviguer dans l'app :
- **Explorer** 🗺️ : Carte interactive, filtres par tradition, type de monument et pays
- **Traditions** 📚 : Découverte des différentes traditions spirituelles  
- **Calendrier** 📅 : Événements religieux et spirituels
- **Journal** : Forum communautaire, messages, amis
- **Profil** : Badges, avatars, statistiques

Adapte tes conseils à la page actuelle de l'utilisateur.`;

const HISTORY_SYSTEM_PROMPT = `Tu es un conteur passionné par l'histoire des lieux sacrés du monde.

${STYLE_RULES}

${INTEGRITY_RULES}

Ton rôle est de raconter des histoires fascinantes sur les temples, cathédrales, mosquées, synagogues et autres lieux spirituels.

Style de narration :
- Captivant et immersif 🙏
- Riche en détails historiques et anecdotes 📚
- Respectueux de toutes les traditions ✨
- Accessible à tous les publics

IMPORTANT : Base tes récits sur des faits historiques vérifiés (Wikipedia, UNESCO, sources académiques). Si tu n'es pas sûr d'un détail, précise-le.

Si l'utilisateur mentionne un lieu spécifique, concentre-toi sur ce lieu.`;

// Rate limiting: 20 requests per hour per user
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MINUTES = 60;

// Quick replies mapping based on route
const getQuickReplies = (route: string, mode: string): string => {
  if (route.startsWith('/traditions')) {
    return `
<lov-actions>
  <lov-suggestion message="Je veux découvrir une tradition.">📚 Découvrir</lov-suggestion>
  <lov-suggestion message="Propose-moi une tradition au hasard.">🎲 Au hasard</lov-suggestion>
  <lov-suggestion message="Explique-moi comment utiliser Explorer.">🗺️ Aller sur Explorer</lov-suggestion>
  <lov-suggestion message="Donne-moi 3 faits historiques sur une tradition.">📅 3 faits</lov-suggestion>
</lov-actions>`;
  }
  
  if (route.startsWith('/explore')) {
    return `
<lov-actions>
  <lov-suggestion message="Trouve-moi des lieux près de moi.">🔎 Près de moi</lov-suggestion>
  <lov-suggestion message="Aide-moi à filtrer (tradition / distance).">🧭 Filtrer</lov-suggestion>
  <lov-suggestion message="Fais-moi un itinéraire d'1h autour de moi.">✨ Itinéraire 1h</lov-suggestion>
</lov-actions>`;
  }
  
  if (route.startsWith('/place/')) {
    return `
<lov-actions>
  <lov-suggestion message="Donne-moi les dates clés de ce lieu.">📅 Dates clés</lov-suggestion>
  <lov-suggestion message="Raconte-moi une anecdote sur ce lieu.">📜 Anecdote</lov-suggestion>
  <lov-suggestion message="Qu'est-ce qu'il y a à voir autour ?">🗺️ Voir autour</lov-suggestion>
  <lov-suggestion message="Résume ce lieu en 3 faits.">📚 Résumé</lov-suggestion>
</lov-actions>`;
  }
  
  if (route.startsWith('/profile')) {
    return `
<lov-actions>
  <lov-suggestion message="Comment modifier mon profil ?">👤 Modifier</lov-suggestion>
  <lov-suggestion message="Comment choisir un avatar ?">🧿 Avatar</lov-suggestion>
  <lov-suggestion message="Comment gagner des badges ?">🏅 Badges</lov-suggestion>
  <lov-suggestion message="Où sont les réglages ?">⚙️ Réglages</lov-suggestion>
</lov-actions>`;
  }
  
  if (route.startsWith('/calendar')) {
    return `
<lov-actions>
  <lov-suggestion message="Quels événements arrivent bientôt ?">📅 Prochains</lov-suggestion>
  <lov-suggestion message="Comment créer un rappel ?">🔔 Rappel</lov-suggestion>
  <lov-suggestion message="Explique-moi les fêtes de ce mois.">✨ Ce mois</lov-suggestion>
</lov-actions>`;
  }

  if (route.startsWith('/country/')) {
    return `
<lov-actions>
  <lov-suggestion message="Quels sont les lieux sacrés de ce pays ?">🗺️ Lieux sacrés</lov-suggestion>
  <lov-suggestion message="Parle-moi des traditions de ce pays.">📚 Traditions</lov-suggestion>
  <lov-suggestion message="Donne-moi 3 faits historiques.">📅 3 faits</lov-suggestion>
</lov-actions>`;
  }

  if (route.startsWith('/journal')) {
    return `
<lov-actions>
  <lov-suggestion message="Comment ajouter un souvenir ?">📚 Ajouter souvenir</lov-suggestion>
  <lov-suggestion message="Comment trouver des amis ?">🔎 Trouver amis</lov-suggestion>
  <lov-suggestion message="Où sont mes messages privés ?">✨ Messages</lov-suggestion>
</lov-actions>`;
  }

  if (route.startsWith('/badges')) {
    return `
<lov-actions>
  <lov-suggestion message="Comment gagner plus de badges ?">🗺️ Gagner badges</lov-suggestion>
  <lov-suggestion message="C'est quoi les badges rares ?">✨ Badges rares</lov-suggestion>
  <lov-suggestion message="Comment améliorer mon classement ?">📅 Classement</lov-suggestion>
</lov-actions>`;
  }
  
  // Default quick replies
  if (mode === 'history') {
    return `
<lov-actions>
  <lov-suggestion message="Raconte-moi l'histoire d'un lieu célèbre.">📚 Lieu célèbre</lov-suggestion>
  <lov-suggestion message="Donne-moi une anecdote surprenante.">✨ Anecdote</lov-suggestion>
  <lov-suggestion message="Parle-moi d'un lieu méconnu.">🔎 Lieu méconnu</lov-suggestion>
</lov-actions>`;
  }
  
  return `
<lov-actions>
  <lov-suggestion message="Comment explorer la carte ?">🗺️ Explorer</lov-suggestion>
  <lov-suggestion message="Comment fonctionne l'app ?">🔎 Aide</lov-suggestion>
  <lov-suggestion message="Montre-moi les traditions.">📚 Traditions</lov-suggestion>
</lov-actions>`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication validation
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentification requise' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Validate JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error('JWT validation failed:', claimsError);
      return new Response(
        JSON.stringify({ error: 'Token invalide ou expiré' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Utilisateur non identifié' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting check
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .from('rate_limits')
      .select('count, window_start')
      .eq('user_id', userId)
      .eq('action', 'sacred_assistant')
      .gte('window_start', windowStart)
      .maybeSingle();

    if (rateLimitError && rateLimitError.code !== 'PGRST116') {
      console.error('Rate limit check error:', rateLimitError);
    }

    const currentCount = rateLimitData?.count || 0;

    if (currentCount >= RATE_LIMIT_MAX) {
      console.log(`Rate limit exceeded for user ${userId}: ${currentCount}/${RATE_LIMIT_MAX}`);
      return new Response(
        JSON.stringify({ 
          error: 'Limite de requêtes atteinte. Veuillez réessayer dans une heure.',
          retryAfter: RATE_LIMIT_WINDOW_MINUTES * 60
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update rate limit counter
    if (rateLimitData) {
      await supabase
        .from('rate_limits')
        .update({ count: currentCount + 1, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('action', 'sacred_assistant')
        .gte('window_start', windowStart);
    } else {
      await supabase
        .from('rate_limits')
        .insert({
          user_id: userId,
          action: 'sacred_assistant',
          count: 1,
          window_start: new Date().toISOString()
        });
    }

    const { message, mode, currentRoute, selectedPlaceId } = await req.json();

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit message length to prevent abuse
    if (message.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Message trop long (max 2000 caractères)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!mode || !['help', 'history'].includes(mode)) {
      return new Response(
        JSON.stringify({ error: 'Invalid mode. Use "help" or "history"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build context message with UI layout
    let contextInfo = '';
    if (currentRoute) {
      contextInfo += `L'utilisateur est actuellement sur la page: ${currentRoute}. `;
    }
    if (selectedPlaceId) {
      contextInfo += `Il regarde le lieu avec l'ID: ${selectedPlaceId}. `;
    }

    // Get UI layout for current route
    const uiLayout = getUILayoutForRoute(currentRoute || '');

    // Track-aware framing (Q26).
    const { data: profile } = await supabase
      .from('profiles')
      .select('denominations:denomination_id (code)')
      .eq('id', userId)
      .maybeSingle();
    const userTrack = (profile?.denominations as any)?.code as
      | 'catholic' | 'protestant' | 'orthodox' | 'heritage' | undefined;
    const TRACK_FRAMING: Record<string, string> = {
      catholic: `L'utilisateur appartient à la tradition CATHOLIQUE.
- Vocabulaire familier : sacrements, eucharistie, communion des saints, magistère, Vierge Marie, rosaire, pèlerinages, liturgie romaine.
- Citez les saints, les conciles et le Catéchisme avec respect.
- Restez factuel et fidèle à l'enseignement catholique sans le présenter comme supérieur aux autres traditions.`,
      protestant: `L'utilisateur appartient à la tradition PROTESTANTE / ÉVANGÉLIQUE.
- Cadrage : sola scriptura, foi personnelle, prédication, communauté locale, Réforme.
- Citez les Écritures directement (références bibliques) ; évitez l'autorité du magistère.
- Évoquez la diversité protestante (luthérienne, réformée, baptiste, évangélique, méthodiste...) sans hiérarchiser.`,
      orthodox: `L'utilisateur appartient à la tradition ORTHODOXE.
- Vocabulaire : Pères de l'Église, Tradition, divine liturgie, icônes, jeûnes, théosis.
- Citez les Pères grecs et les conciles œcuméniques.
- Distinguer si pertinent les Églises orthodoxes (grecque, russe, copte, antiochienne...) avec respect.`,
      heritage: `L'utilisateur s'intéresse au PATRIMOINE chrétien sans nécessairement croire.
- Cadrage culturel et historique : architecture, art sacré, héritage, contexte historique.
- Évitez le langage dévotionnel ; restez factuel et accessible.
- Présentez les traditions de manière comparée et non-hiérarchique.`,
    };
    const trackPrompt = userTrack ? TRACK_FRAMING[userTrack] : '';

    const systemPrompt = mode === 'help' ? HELP_SYSTEM_PROMPT : HISTORY_SYSTEM_PROMPT;
    const fullSystemPrompt = `${systemPrompt}

${trackPrompt ? `CADRAGE DE L'UTILISATEUR :\n${trackPrompt}\n` : ''}
CONNAISSANCE DE L'INTERFACE - UTILISE CES INFORMATIONS POUR GUIDER L'UTILISATEUR :
${uiLayout}

${contextInfo ? `Contexte additionnel: ${contextInfo}` : ''}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: fullSystemPrompt },
          { role: "user", content: message.trim() },
        ],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de requêtes, veuillez réessayer dans un moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporairement indisponible." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erreur du service IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    let assistantMessage = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse. 🙏";

    // Add quick replies based on current route
    const quickReplies = getQuickReplies(currentRoute || '', mode);
    assistantMessage = assistantMessage + '\n\n' + quickReplies;

    return new Response(
      JSON.stringify({ response: assistantMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("sacred-assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
