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
        back: 'Retour'
      },
      country: {
        title: 'Lieux sacrés',
        visitPlace: 'Marquer comme visité',
        visited: 'Déjà visité',
        points: 'points'
      },
      tabs: {
        myRanking: 'Mon classement',
        religionRanking: 'Classement par religion',
        weeklyQuest: 'Quête de la semaine'
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
        back: 'Back'
      },
      country: {
        title: 'Sacred Places',
        visitPlace: 'Mark as Visited',
        visited: 'Already Visited',
        points: 'points'
      },
      tabs: {
        myRanking: 'My Ranking',
        religionRanking: 'Religion Rankings',
        weeklyQuest: 'Weekly Quest'
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
        back: 'Volver'
      },
      country: {
        title: 'Lugares Sagrados',
        visitPlace: 'Marcar como Visitado',
        visited: 'Ya Visitado',
        points: 'puntos'
      },
      tabs: {
        myRanking: 'Mi Clasificación',
        religionRanking: 'Clasificación por Religión',
        weeklyQuest: 'Misión Semanal'
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
        back: 'Indietro'
      },
      country: {
        title: 'Luoghi Sacri',
        visitPlace: 'Segna come Visitato',
        visited: 'Già Visitato',
        points: 'punti'
      },
      tabs: {
        myRanking: 'La Mia Classifica',
        religionRanking: 'Classifica per Religione',
        weeklyQuest: 'Missione Settimanale'
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
        back: 'Zurück'
      },
      country: {
        title: 'Heilige Orte',
        visitPlace: 'Als Besucht Markieren',
        visited: 'Bereits Besucht',
        points: 'punkte'
      },
      tabs: {
        myRanking: 'Meine Rangliste',
        religionRanking: 'Rangliste nach Religion',
        weeklyQuest: 'Wöchentliche Quest'
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
        back: 'Voltar'
      },
      country: {
        title: 'Lugares Sagrados',
        visitPlace: 'Marcar como Visitado',
        visited: 'Já Visitado',
        points: 'pontos'
      },
      tabs: {
        myRanking: 'Minha Classificação',
        religionRanking: 'Classificação por Religião',
        weeklyQuest: 'Missão Semanal'
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
        back: 'رجوع'
      },
      country: {
        title: 'الأماكن المقدسة',
        visitPlace: 'تحديد كمزار',
        visited: 'تم الزيارة',
        points: 'نقاط'
      },
      tabs: {
        myRanking: 'ترتيبي',
        religionRanking: 'الترتيب حسب الديانة',
        weeklyQuest: 'المهمة الأسبوعية'
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
