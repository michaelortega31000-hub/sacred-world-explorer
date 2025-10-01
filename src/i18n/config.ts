import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      splash: {
        loading: 'Chargement...',
        start: 'Commencer l\'aventure'
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
        weeklyQuest: 'Quête de la semaine',
        tripPlanner: 'Préparer son voyage',
        rankings: 'Classements'
      },
      ranking: {
        yourPoints: 'Vos points',
        position: 'Position',
        badges: 'Badges'
      }
    }
  },
  en: {
    translation: {
      splash: {
        loading: 'Loading...',
        start: 'Start Adventure'
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
        weeklyQuest: 'Weekly Quest',
        tripPlanner: 'Plan Your Trip',
        rankings: 'Rankings'
      },
      ranking: {
        yourPoints: 'Your Points',
        position: 'Position',
        badges: 'Badges'
      }
    }
  },
  es: {
    translation: {
      splash: {
        loading: 'Cargando...',
        start: 'Comenzar Aventura'
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
        weeklyQuest: 'Misión Semanal',
        tripPlanner: 'Planificar Viaje',
        rankings: 'Clasificaciones'
      },
      ranking: {
        yourPoints: 'Tus Puntos',
        position: 'Posición',
        badges: 'Insignias'
      }
    }
  },
  it: {
    translation: {
      splash: {
        loading: 'Caricamento...',
        start: 'Inizia Avventura'
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
        weeklyQuest: 'Missione Settimanale',
        tripPlanner: 'Pianifica Viaggio',
        rankings: 'Classifiche'
      },
      ranking: {
        yourPoints: 'I Tuoi Punti',
        position: 'Posizione',
        badges: 'Badge'
      }
    }
  },
  de: {
    translation: {
      splash: {
        loading: 'Laden...',
        start: 'Abenteuer Starten'
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
        weeklyQuest: 'Wöchentliche Quest',
        tripPlanner: 'Reise Planen',
        rankings: 'Ranglisten'
      },
      ranking: {
        yourPoints: 'Deine Punkte',
        position: 'Position',
        badges: 'Abzeichen'
      }
    }
  },
  pt: {
    translation: {
      splash: {
        loading: 'Carregando...',
        start: 'Iniciar Aventura'
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
        weeklyQuest: 'Missão Semanal',
        tripPlanner: 'Planejar Viagem',
        rankings: 'Classificações'
      },
      ranking: {
        yourPoints: 'Seus Pontos',
        position: 'Posição',
        badges: 'Distintivos'
      }
    }
  },
  ar: {
    translation: {
      splash: {
        loading: 'جار التحميل...',
        start: 'بدء المغامرة'
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
        weeklyQuest: 'المهمة الأسبوعية',
        tripPlanner: 'خطط رحلتك',
        rankings: 'التصنيفات'
      },
      ranking: {
        yourPoints: 'نقاطك',
        position: 'الموقع',
        badges: 'الشارات'
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
