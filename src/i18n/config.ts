import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      splash: {
        loading: 'Chargement...',
        start: 'Commencer l\'aventure'
      },
      welcome: {
        title: 'SacredWorld',
        promise1: 'Des lieux sacrés du monde entier, dans ta poche.',
        promise2: 'Explore, découvre et collectionne des badges en visitant les monuments les plus emblématiques.',
        cta: {
          start: 'Commencer',
          tutorial: 'Voir comment ça marche'
        },
        accessibility: 'Accessible à tous • Contenu culturel neutre',
        tutorial: {
          step1: {
            title: 'Explore le monde',
            desc: 'Découvre des milliers de lieux sacrés et monuments culturels à travers le monde.'
          },
          step2: {
            title: 'Apprends et partage',
            desc: 'Écoute des histoires fascinantes et partage tes découvertes avec la communauté.'
          },
          step3: {
            title: 'Collectionne des badges',
            desc: 'Gagne des points et des badges rares en visitant des lieux et en accomplissant des quêtes.'
          },
          prev: 'Précédent',
          next: 'Suivant',
          finish: 'Commencer'
        }
      },
      selection: {
        title: 'Choisissez votre parcours',
        subtitle: 'Sélectionnez une religion ou une philosophie',
        language: 'Langue',
        continue: 'Continuer',
        religions: {
          christianity: 'Christianisme',
          islam: 'Islam',
          judaism: 'Judaïsme',
          buddhism: 'Bouddhisme',
          hinduism: 'Hindouisme',
          traditional: 'Religions Traditionnelles',
          atheism: 'Athéisme'
        }
      },
      worldMap: {
        title: 'Explorer le monde',
        subtitle: 'Sélectionnez un pays à découvrir',
        back: 'Retour',
        searchPlaceholder: 'Rechercher un pays...'
      },
      countries: {
        "France": "France",
        "Italy": "Italie",
        "Spain": "Espagne",
        "United Kingdom": "Royaume-Uni",
        "Germany": "Allemagne",
        "Greece": "Grèce",
        "Russia": "Russie",
        "Poland": "Pologne",
        "Portugal": "Portugal",
        "Israel": "Israël",
        "Saudi Arabia": "Arabie Saoudite",
        "Egypt": "Égypte",
        "Turkey": "Turquie",
        "Morocco": "Maroc",
        "India": "Inde",
        "Thailand": "Thaïlande",
        "Japan": "Japon",
        "Myanmar": "Myanmar",
        "China": "Chine",
        "Nepal": "Népal",
        "Cambodia": "Cambodge",
        "Indonesia": "Indonésie",
        "Tibet": "Tibet",
        "United States": "États-Unis",
        "Mexico": "Mexique",
        "Peru": "Pérou",
        "Brazil": "Brésil",
        "Colombia": "Colombie",
        "Argentina": "Argentine",
        "Canada": "Canada",
        "Ethiopia": "Éthiopie",
        "South Africa": "Afrique du Sud",
        "Australia": "Australie"
      },
      country: {
        title: 'Lieux sacrés',
        visitPlace: 'Marquer comme visité',
        visited: 'Déjà visité',
        points: 'points'
      },
      tabs: {
        myRanking: 'Mon classement',
        countryRanking: 'Classement par pays',
        religionRanking: 'Classement par religion',
        weeklyQuest: 'Quête',
        tripPlanner: 'Préparer son voyage',
        rankings: 'Classements'
      },
      ranking: {
        yourPoints: 'Vos points',
        position: 'Position',
        badges: 'Badges'
      },
      calendar: {
        button: 'Calendrier',
        tooltip: 'Ouvrir le calendrier'
      }
    }
  },
  en: {
    translation: {
      splash: {
        loading: 'Loading...',
        start: 'Start Adventure'
      },
      welcome: {
        title: 'SacredWorld',
        promise1: 'Sacred places from around the world, in your pocket.',
        promise2: 'Explore, discover and collect badges by visiting the most iconic monuments.',
        cta: {
          start: 'Get Started',
          tutorial: 'See how it works'
        },
        accessibility: 'Accessible to all • Neutral cultural content',
        tutorial: {
          step1: {
            title: 'Explore the world',
            desc: 'Discover thousands of sacred places and cultural monuments around the world.'
          },
          step2: {
            title: 'Learn and share',
            desc: 'Listen to fascinating stories and share your discoveries with the community.'
          },
          step3: {
            title: 'Collect badges',
            desc: 'Earn points and rare badges by visiting places and completing quests.'
          },
          prev: 'Previous',
          next: 'Next',
          finish: 'Get Started'
        }
      },
      selection: {
        title: 'Choose Your Path',
        subtitle: 'Select a religion or philosophy',
        language: 'Language',
        continue: 'Continue',
        religions: {
          christianity: 'Christianity',
          islam: 'Islam',
          judaism: 'Judaism',
          buddhism: 'Buddhism',
          hinduism: 'Hinduism',
          traditional: 'Traditional Religions',
          atheism: 'Atheism'
        }
      },
      worldMap: {
        title: 'Explore the World',
        subtitle: 'Select a country to discover',
        back: 'Back',
        searchPlaceholder: 'Search for a country...'
      },
      countries: {
        "France": "France",
        "Italy": "Italy",
        "Spain": "Spain",
        "United Kingdom": "United Kingdom",
        "Germany": "Germany",
        "Greece": "Greece",
        "Russia": "Russia",
        "Poland": "Poland",
        "Portugal": "Portugal",
        "Israel": "Israel",
        "Saudi Arabia": "Saudi Arabia",
        "Egypt": "Egypt",
        "Turkey": "Turkey",
        "Morocco": "Morocco",
        "India": "India",
        "Thailand": "Thailand",
        "Japan": "Japan",
        "Myanmar": "Myanmar",
        "China": "China",
        "Nepal": "Nepal",
        "Cambodia": "Cambodia",
        "Indonesia": "Indonesia",
        "Tibet": "Tibet",
        "United States": "United States",
        "Mexico": "Mexico",
        "Peru": "Peru",
        "Brazil": "Brazil",
        "Colombia": "Colombia",
        "Argentina": "Argentina",
        "Canada": "Canada",
        "Ethiopia": "Ethiopia",
        "South Africa": "South Africa",
        "Australia": "Australia"
      },
      country: {
        title: 'Sacred Places',
        visitPlace: 'Mark as Visited',
        visited: 'Already Visited',
        points: 'points'
      },
      tabs: {
        myRanking: 'My Ranking',
        countryRanking: 'Country Rankings',
        religionRanking: 'Religion Rankings',
        weeklyQuest: 'Quest',
        tripPlanner: 'Plan Your Trip',
        rankings: 'Rankings'
      },
      ranking: {
        yourPoints: 'Your Points',
        position: 'Position',
        badges: 'Badges'
      },
      calendar: {
        button: 'Calendar',
        tooltip: 'Open the calendar'
      }
    }
  },
  es: {
    translation: {
      splash: {
        loading: 'Cargando...',
        start: 'Comenzar Aventura'
      },
      welcome: {
        title: 'SacredWorld',
        promise1: 'Lugares sagrados de todo el mundo, en tu bolsillo.',
        promise2: 'Explora, descubre y colecciona insignias visitando los monumentos más emblemáticos.',
        cta: {
          start: 'Comenzar',
          tutorial: 'Ver cómo funciona'
        },
        accessibility: 'Accesible para todos • Contenido cultural neutral',
        tutorial: {
          step1: {
            title: 'Explora el mundo',
            desc: 'Descubre miles de lugares sagrados y monumentos culturales de todo el mundo.'
          },
          step2: {
            title: 'Aprende y comparte',
            desc: 'Escucha historias fascinantes y comparte tus descubrimientos con la comunidad.'
          },
          step3: {
            title: 'Colecciona insignias',
            desc: 'Gana puntos e insignias raras visitando lugares y completando misiones.'
          },
          prev: 'Anterior',
          next: 'Siguiente',
          finish: 'Comenzar'
        }
      },
      selection: {
        title: 'Elige tu Camino',
        subtitle: 'Selecciona una religión o filosofía',
        language: 'Idioma',
        continue: 'Continuar',
        religions: {
          christianity: 'Cristianismo',
          islam: 'Islam',
          judaism: 'Judaísmo',
          buddhism: 'Budismo',
          hinduism: 'Hinduismo',
          traditional: 'Religiones Tradicionales',
          atheism: 'Ateísmo'
        }
      },
      worldMap: {
        title: 'Explorar el Mundo',
        subtitle: 'Selecciona un país para descubrir',
        back: 'Volver',
        searchPlaceholder: 'Buscar un país...'
      },
      countries: {
        "France": "Francia",
        "Italy": "Italia",
        "Spain": "España",
        "United Kingdom": "Reino Unido",
        "Germany": "Alemania",
        "Greece": "Grecia",
        "Russia": "Rusia",
        "Poland": "Polonia",
        "Portugal": "Portugal",
        "Israel": "Israel",
        "Saudi Arabia": "Arabia Saudita",
        "Egypt": "Egipto",
        "Turkey": "Turquía",
        "Morocco": "Marruecos",
        "India": "India",
        "Thailand": "Tailandia",
        "Japan": "Japón",
        "Myanmar": "Myanmar",
        "China": "China",
        "Nepal": "Nepal",
        "Cambodia": "Camboya",
        "Indonesia": "Indonesia",
        "Tibet": "Tíbet",
        "United States": "Estados Unidos",
        "Mexico": "México",
        "Peru": "Perú",
        "Brazil": "Brasil",
        "Colombia": "Colombia",
        "Argentina": "Argentina",
        "Canada": "Canadá",
        "Ethiopia": "Etiopía",
        "South Africa": "Sudáfrica",
        "Australia": "Australia"
      },
      country: {
        title: 'Lugares Sagrados',
        visitPlace: 'Marcar como Visitado',
        visited: 'Ya Visitado',
        points: 'puntos'
      },
      tabs: {
        myRanking: 'Mi Clasificación',
        countryRanking: 'Clasificación por País',
        religionRanking: 'Clasificación por Religión',
        weeklyQuest: 'Misión',
        tripPlanner: 'Planificar Viaje',
        rankings: 'Clasificaciones'
      },
      ranking: {
        yourPoints: 'Tus Puntos',
        position: 'Posición',
        badges: 'Insignias'
      },
      calendar: {
        button: 'Calendario',
        tooltip: 'Abrir el calendario'
      }
    }
  },
  it: {
    translation: {
      splash: {
        loading: 'Caricamento...',
        start: 'Inizia Avventura'
      },
      welcome: {
        title: 'SacredWorld',
        promise1: 'Luoghi sacri da tutto il mondo, nella tua tasca.',
        promise2: 'Esplora, scopri e colleziona distintivi visitando i monumenti più iconici.',
        cta: {
          start: 'Inizia',
          tutorial: 'Scopri come funziona'
        },
        accessibility: 'Accessibile a tutti • Contenuto culturale neutrale',
        tutorial: {
          step1: {
            title: 'Esplora il mondo',
            desc: 'Scopri migliaia di luoghi sacri e monumenti culturali in tutto il mondo.'
          },
          step2: {
            title: 'Impara e condividi',
            desc: 'Ascolta storie affascinanti e condividi le tue scoperte con la comunità.'
          },
          step3: {
            title: 'Colleziona distintivi',
            desc: 'Guadagna punti e distintivi rari visitando luoghi e completando missioni.'
          },
          prev: 'Precedente',
          next: 'Avanti',
          finish: 'Inizia'
        }
      },
      selection: {
        title: 'Scegli il tuo Percorso',
        subtitle: 'Seleziona una religione o filosofia',
        language: 'Lingua',
        continue: 'Continua',
        religions: {
          christianity: 'Cristianesimo',
          islam: 'Islam',
          judaism: 'Ebraismo',
          buddhism: 'Buddhismo',
          hinduism: 'Induismo',
          traditional: 'Religioni Tradizionali',
          atheism: 'Ateismo'
        }
      },
      worldMap: {
        title: 'Esplora il Mondo',
        subtitle: 'Seleziona un paese da scoprire',
        back: 'Indietro',
        searchPlaceholder: 'Cerca un paese...'
      },
      countries: {
        "France": "Francia",
        "Italy": "Italia",
        "Spain": "Spagna",
        "United Kingdom": "Regno Unito",
        "Germany": "Germania",
        "Greece": "Grecia",
        "Russia": "Russia",
        "Poland": "Polonia",
        "Portugal": "Portogallo",
        "Israel": "Israele",
        "Saudi Arabia": "Arabia Saudita",
        "Egypt": "Egitto",
        "Turkey": "Turchia",
        "Morocco": "Marocco",
        "India": "India",
        "Thailand": "Thailandia",
        "Japan": "Giappone",
        "Myanmar": "Myanmar",
        "China": "Cina",
        "Nepal": "Nepal",
        "Cambodia": "Cambogia",
        "Indonesia": "Indonesia",
        "Tibet": "Tibet",
        "United States": "Stati Uniti",
        "Mexico": "Messico",
        "Peru": "Perù",
        "Brazil": "Brasile",
        "Colombia": "Colombia",
        "Argentina": "Argentina",
        "Canada": "Canada",
        "Ethiopia": "Etiopia",
        "South Africa": "Sudafrica",
        "Australia": "Australia"
      },
      country: {
        title: 'Luoghi Sacri',
        visitPlace: 'Segna come Visitato',
        visited: 'Già Visitato',
        points: 'punti'
      },
      tabs: {
        myRanking: 'La Mia Classifica',
        countryRanking: 'Classifica per Paese',
        religionRanking: 'Classifica per Religione',
        weeklyQuest: 'Missione',
        tripPlanner: 'Pianifica Viaggio',
        rankings: 'Classifiche'
      },
      ranking: {
        yourPoints: 'I Tuoi Punti',
        position: 'Posizione',
        badges: 'Badge'
      },
      calendar: {
        button: 'Calendario',
        tooltip: 'Aprire il calendario'
      }
    }
  },
  de: {
    translation: {
      splash: {
        loading: 'Laden...',
        start: 'Abenteuer Starten'
      },
      welcome: {
        title: 'SacredWorld',
        promise1: 'Heilige Stätten aus der ganzen Welt, in deiner Tasche.',
        promise2: 'Erkunde, entdecke und sammle Abzeichen, indem du die ikonischsten Denkmäler besuchst.',
        cta: {
          start: 'Loslegen',
          tutorial: 'So funktioniert es'
        },
        accessibility: 'Für alle zugänglich • Neutraler kultureller Inhalt',
        tutorial: {
          step1: {
            title: 'Entdecke die Welt',
            desc: 'Entdecke Tausende von heiligen Stätten und kulturellen Denkmälern auf der ganzen Welt.'
          },
          step2: {
            title: 'Lerne und teile',
            desc: 'Höre faszinierende Geschichten und teile deine Entdeckungen mit der Community.'
          },
          step3: {
            title: 'Sammle Abzeichen',
            desc: 'Verdiene Punkte und seltene Abzeichen, indem du Orte besuchst und Quests abschließt.'
          },
          prev: 'Zurück',
          next: 'Weiter',
          finish: 'Loslegen'
        }
      },
      selection: {
        title: 'Wähle deinen Weg',
        subtitle: 'Wähle eine Religion oder Philosophie',
        language: 'Sprache',
        continue: 'Weiter',
        religions: {
          christianity: 'Christentum',
          islam: 'Islam',
          judaism: 'Judentum',
          buddhism: 'Buddhismus',
          hinduism: 'Hinduismus',
          traditional: 'Traditionelle Religionen',
          atheism: 'Atheismus'
        }
      },
      worldMap: {
        title: 'Entdecke die Welt',
        subtitle: 'Wähle ein Land zum Entdecken',
        back: 'Zurück',
        searchPlaceholder: 'Land suchen...'
      },
      countries: {
        "France": "Frankreich",
        "Italy": "Italien",
        "Spain": "Spanien",
        "United Kingdom": "Vereinigtes Königreich",
        "Germany": "Deutschland",
        "Greece": "Griechenland",
        "Russia": "Russland",
        "Poland": "Polen",
        "Portugal": "Portugal",
        "Israel": "Israel",
        "Saudi Arabia": "Saudi-Arabien",
        "Egypt": "Ägypten",
        "Turkey": "Türkei",
        "Morocco": "Marokko",
        "India": "Indien",
        "Thailand": "Thailand",
        "Japan": "Japan",
        "Myanmar": "Myanmar",
        "China": "China",
        "Nepal": "Nepal",
        "Cambodia": "Kambodscha",
        "Indonesia": "Indonesien",
        "Tibet": "Tibet",
        "United States": "Vereinigte Staaten",
        "Mexico": "Mexiko",
        "Peru": "Peru",
        "Brazil": "Brasilien",
        "Colombia": "Kolumbien",
        "Argentina": "Argentinien",
        "Canada": "Kanada",
        "Ethiopia": "Äthiopien",
        "South Africa": "Südafrika",
        "Australia": "Australien"
      },
      country: {
        title: 'Heilige Orte',
        visitPlace: 'Als Besucht Markieren',
        visited: 'Bereits Besucht',
        points: 'punkte'
      },
      tabs: {
        myRanking: 'Meine Rangliste',
        countryRanking: 'Rangliste nach Land',
        religionRanking: 'Rangliste nach Religion',
        weeklyQuest: 'Quest',
        tripPlanner: 'Reise Planen',
        rankings: 'Ranglisten'
      },
      ranking: {
        yourPoints: 'Deine Punkte',
        position: 'Position',
        badges: 'Abzeichen'
      },
      calendar: {
        button: 'Kalender',
        tooltip: 'Kalender öffnen'
      }
    }
  },
  pt: {
    translation: {
      splash: {
        loading: 'Carregando...',
        start: 'Iniciar Aventura'
      },
      welcome: {
        title: 'SacredWorld',
        promise1: 'Lugares sagrados de todo o mundo, no seu bolso.',
        promise2: 'Explore, descubra e colecione distintivos visitando os monumentos mais icônicos.',
        cta: {
          start: 'Começar',
          tutorial: 'Ver como funciona'
        },
        accessibility: 'Acessível a todos • Conteúdo cultural neutro',
        tutorial: {
          step1: {
            title: 'Explore o mundo',
            desc: 'Descubra milhares de lugares sagrados e monumentos culturais ao redor do mundo.'
          },
          step2: {
            title: 'Colecione distintivos',
            desc: 'Ganhe pontos e distintivos raros visitando lugares e completando missões.'
          },
          step3: {
            title: 'Aprenda e compartilhe',
            desc: 'Ouça histórias fascinantes e compartilhe suas descobertas com a comunidade.'
          },
          prev: 'Anterior',
          next: 'Próximo',
          finish: 'Começar'
        }
      },
      selection: {
        title: 'Escolha seu Caminho',
        subtitle: 'Selecione uma religião ou filosofia',
        language: 'Idioma',
        continue: 'Continuar',
        religions: {
          christianity: 'Cristianismo',
          islam: 'Islã',
          judaism: 'Judaísmo',
          buddhism: 'Budismo',
          hinduism: 'Hinduísmo',
          traditional: 'Religiões Tradicionais',
          atheism: 'Ateísmo'
        }
      },
      worldMap: {
        title: 'Explorar o Mundo',
        subtitle: 'Selecione um país para descobrir',
        back: 'Voltar',
        searchPlaceholder: 'Buscar um país...'
      },
      countries: {
        "France": "França",
        "Italy": "Itália",
        "Spain": "Espanha",
        "United Kingdom": "Reino Unido",
        "Germany": "Alemanha",
        "Greece": "Grécia",
        "Russia": "Rússia",
        "Poland": "Polônia",
        "Portugal": "Portugal",
        "Israel": "Israel",
        "Saudi Arabia": "Arábia Saudita",
        "Egypt": "Egito",
        "Turkey": "Turquia",
        "Morocco": "Marrocos",
        "India": "Índia",
        "Thailand": "Tailândia",
        "Japan": "Japão",
        "Myanmar": "Myanmar",
        "China": "China",
        "Nepal": "Nepal",
        "Cambodia": "Camboja",
        "Indonesia": "Indonésia",
        "Tibet": "Tibete",
        "United States": "Estados Unidos",
        "Mexico": "México",
        "Peru": "Peru",
        "Brazil": "Brasil",
        "Colombia": "Colômbia",
        "Argentina": "Argentina",
        "Canada": "Canadá",
        "Ethiopia": "Etiópia",
        "South Africa": "África do Sul",
        "Australia": "Austrália"
      },
      country: {
        title: 'Lugares Sagrados',
        visitPlace: 'Marcar como Visitado',
        visited: 'Já Visitado',
        points: 'pontos'
      },
      tabs: {
        myRanking: 'Minha Classificação',
        countryRanking: 'Classificação por País',
        religionRanking: 'Classificação por Religião',
        weeklyQuest: 'Missão',
        tripPlanner: 'Planejar Viagem',
        rankings: 'Classificações'
      },
      ranking: {
        yourPoints: 'Seus Pontos',
        position: 'Posição',
        badges: 'Distintivos'
      },
      calendar: {
        button: 'Calendário',
        tooltip: 'Abrir o calendário'
      }
    }
  },
  ar: {
    translation: {
      splash: {
        loading: 'جار التحميل...',
        start: 'بدء المغامرة'
      },
      welcome: {
        title: 'SacredWorld',
        promise1: 'أماكن مقدسة من جميع أنحاء العالم، في جيبك.',
        promise2: 'استكشف واكتشف واجمع الشارات من خلال زيارة المعالم الأكثر شهرة.',
        cta: {
          start: 'ابدأ',
          tutorial: 'شاهد كيف يعمل'
        },
        accessibility: 'متاح للجميع • محتوى ثقافي محايد',
        tutorial: {
          step1: {
            title: 'استكشف العالم',
            desc: 'اكتشف آلاف الأماكن المقدسة والمعالم الثقافية حول العالم.'
          },
          step2: {
            title: 'اجمع الشارات',
            desc: 'اكسب النقاط والشارات النادرة من خلال زيارة الأماكن وإكمال المهام.'
          },
          step3: {
            title: 'تعلم وشارك',
            desc: 'استمع إلى قصص رائعة وشارك اكتشافاتك مع المجتمع.'
          },
          prev: 'السابق',
          next: 'التالي',
          finish: 'ابدأ'
        }
      },
      selection: {
        title: 'اختر طريقك',
        subtitle: 'اختر ديناً أو فلسفة',
        language: 'اللغة',
        continue: 'متابعة',
        religions: {
          christianity: 'المسيحية',
          islam: 'الإسلام',
          judaism: 'اليهودية',
          buddhism: 'البوذية',
          hinduism: 'الهندوسية',
          traditional: 'الديانات التقليدية',
          atheism: 'الإلحاد'
        }
      },
      worldMap: {
        title: 'استكشف العالم',
        subtitle: 'اختر بلداً لاكتشافه',
        back: 'رجوع',
        searchPlaceholder: 'ابحث عن بلد...'
      },
      countries: {
        "France": "فرنسا",
        "Italy": "إيطاليا",
        "Spain": "إسبانيا",
        "United Kingdom": "المملكة المتحدة",
        "Germany": "ألمانيا",
        "Greece": "اليونان",
        "Russia": "روسيا",
        "Poland": "بولندا",
        "Portugal": "البرتغال",
        "Israel": "إسرائيل",
        "Saudi Arabia": "المملكة العربية السعودية",
        "Egypt": "مصر",
        "Turkey": "تركيا",
        "Morocco": "المغرب",
        "India": "الهند",
        "Thailand": "تايلاند",
        "Japan": "اليابان",
        "Myanmar": "ميانمار",
        "China": "الصين",
        "Nepal": "نيبال",
        "Cambodia": "كمبوديا",
        "Indonesia": "إندونيسيا",
        "Tibet": "التبت",
        "United States": "الولايات المتحدة",
        "Mexico": "المكسيك",
        "Peru": "بيرو",
        "Brazil": "البرازيل",
        "Colombia": "كولومبيا",
        "Argentina": "الأرجنتين",
        "Canada": "كندا",
        "Ethiopia": "إثيوبيا",
        "South Africa": "جنوب أفريقيا",
        "Australia": "أستراليا"
      },
      country: {
        title: 'الأماكن المقدسة',
        visitPlace: 'تحديد كمزار',
        visited: 'تم الزيارة',
        points: 'نقاط'
      },
      tabs: {
        myRanking: 'ترتيبي',
        countryRanking: 'الترتيب حسب البلد',
        religionRanking: 'الترتيب حسب الديانة',
        weeklyQuest: 'المهمة',
        tripPlanner: 'خطط رحلتك',
        rankings: 'التصنيفات'
      },
      ranking: {
        yourPoints: 'نقاطك',
        position: 'الموقع',
        badges: 'الشارات'
      },
      calendar: {
        button: 'التقويم',
        tooltip: 'فتح التقويم'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
