export interface ReligiousEvent {
  id: string;
  name: string;
  nameFr: string;
  nameEn: string;
  description: string;
  descriptionFr: string;
  descriptionEn: string;
  longDescriptionFr?: string;
  longDescriptionEn?: string;
  tradition: 'christianity' | 'islam' | 'judaism' | 'hinduism' | 'buddhism' | 'other';
  date: Date;
  endDate?: Date;
  isRecurring: boolean;
  relatedPlaces?: string[]; // Place IDs
  color: string;
  photos?: string[];
  videoUrl?: string;
  rituals?: string[];
  traditionalFoods?: string[];
  quotes?: string[];
  symbolism?: string;
  musicPlaylist?: string;
  duration?: number;
  type?: 'celebration' | 'fasting' | 'pilgrimage' | 'prayer' | 'festival';
}

// Helper function to get dates for 2025
const getDateFor2025 = (month: number, day: number) => new Date(2025, month - 1, day);

export const religiousEvents2025: ReligiousEvent[] = [
  // Christian Events
  {
    id: 'christmas-2025',
    name: 'Christmas',
    nameFr: 'Noël',
    nameEn: 'Christmas',
    description: 'Célébration de la naissance de Jésus-Christ',
    descriptionFr: 'Célébration de la naissance de Jésus-Christ, fête majeure du christianisme célébrée dans le monde entier.',
    descriptionEn: 'Celebration of the birth of Jesus Christ, major Christian holiday celebrated worldwide.',
    tradition: 'christianity',
    date: getDateFor2025(12, 25),
    isRecurring: true,
    color: '#C6A45A'
  },
  {
    id: 'easter-2025',
    name: 'Easter',
    nameFr: 'Pâques',
    nameEn: 'Easter',
    description: 'Résurrection de Jésus-Christ',
    descriptionFr: 'Commémoration de la résurrection de Jésus-Christ, événement central de la foi chrétienne.',
    descriptionEn: 'Commemoration of the resurrection of Jesus Christ, central event of the Christian faith.',
    tradition: 'christianity',
    date: getDateFor2025(4, 20),
    isRecurring: true,
    color: '#C6A45A'
  },
  {
    id: 'ascension-2025',
    name: 'Ascension',
    nameFr: 'Ascension',
    nameEn: 'Ascension',
    description: 'Montée de Jésus au ciel',
    descriptionFr: 'Célébration de la montée de Jésus au ciel, 40 jours après Pâques.',
    descriptionEn: 'Celebration of Jesus ascending to heaven, 40 days after Easter.',
    tradition: 'christianity',
    date: getDateFor2025(5, 29),
    isRecurring: true,
    color: '#C6A45A'
  },
  {
    id: 'pentecost-2025',
    name: 'Pentecost',
    nameFr: 'Pentecôte',
    nameEn: 'Pentecost',
    description: 'Descente du Saint-Esprit',
    descriptionFr: 'Célébration de la descente du Saint-Esprit sur les apôtres.',
    descriptionEn: 'Celebration of the descent of the Holy Spirit upon the apostles.',
    tradition: 'christianity',
    date: getDateFor2025(6, 8),
    isRecurring: true,
    color: '#C6A45A'
  },
  {
    id: 'all-saints-2025',
    name: 'All Saints',
    nameFr: 'Toussaint',
    nameEn: 'All Saints',
    description: 'Fête de tous les saints',
    descriptionFr: 'Fête catholique célébrant tous les saints connus et inconnus.',
    descriptionEn: 'Catholic feast celebrating all known and unknown saints.',
    tradition: 'christianity',
    date: getDateFor2025(11, 1),
    isRecurring: true,
    color: '#C6A45A'
  },

  // Islamic Events (2025)
  {
    id: 'ramadan-start-2025',
    name: 'Ramadan',
    nameFr: 'Début du Ramadan',
    nameEn: 'Start of Ramadan',
    description: 'Début du mois sacré du jeûne',
    descriptionFr: 'Début du mois sacré du Ramadan, période de jeûne et de prière pour les musulmans.',
    descriptionEn: 'Start of the holy month of Ramadan, period of fasting and prayer for Muslims.',
    tradition: 'islam',
    date: getDateFor2025(2, 28),
    isRecurring: true,
    color: '#00C6FF'
  },
  {
    id: 'eid-al-fitr-2025',
    name: 'Eid al-Fitr',
    nameFr: 'Aïd al-Fitr',
    nameEn: 'Eid al-Fitr',
    description: 'Fête de la rupture du jeûne',
    descriptionFr: 'Fête marquant la fin du Ramadan, célébration majeure de l\'islam.',
    descriptionEn: 'Feast marking the end of Ramadan, major Islamic celebration.',
    tradition: 'islam',
    date: getDateFor2025(3, 30),
    isRecurring: true,
    color: '#00C6FF'
  },
  {
    id: 'eid-al-adha-2025',
    name: 'Eid al-Adha',
    nameFr: 'Aïd al-Adha',
    nameEn: 'Eid al-Adha',
    description: 'Fête du sacrifice',
    descriptionFr: 'Fête du sacrifice, commémorant le sacrifice d\'Abraham, la plus importante fête musulmane.',
    descriptionEn: 'Feast of Sacrifice, commemorating Abraham\'s sacrifice, the most important Muslim feast.',
    tradition: 'islam',
    date: getDateFor2025(6, 6),
    isRecurring: true,
    color: '#00C6FF'
  },
  {
    id: 'mawlid-2025',
    name: 'Mawlid',
    nameFr: 'Mawlid an-Nabi',
    nameEn: 'Mawlid an-Nabi',
    description: 'Naissance du Prophète Muhammad',
    descriptionFr: 'Célébration de la naissance du Prophète Muhammad.',
    descriptionEn: 'Celebration of the birth of Prophet Muhammad.',
    tradition: 'islam',
    date: getDateFor2025(9, 4),
    isRecurring: true,
    color: '#00C6FF'
  },

  // Jewish Events (2025)
  {
    id: 'rosh-hashanah-2025',
    name: 'Rosh Hashanah',
    nameFr: 'Rosh Hashanah',
    nameEn: 'Rosh Hashanah',
    description: 'Nouvel an juif',
    descriptionFr: 'Nouvel an juif, début des Jours redoutables.',
    descriptionEn: 'Jewish New Year, beginning of the High Holy Days.',
    tradition: 'judaism',
    date: getDateFor2025(9, 22),
    isRecurring: true,
    color: '#4A90E2'
  },
  {
    id: 'yom-kippur-2025',
    name: 'Yom Kippur',
    nameFr: 'Yom Kippour',
    nameEn: 'Yom Kippur',
    description: 'Jour du Grand Pardon',
    descriptionFr: 'Jour du Grand Pardon, jour le plus saint du judaïsme.',
    descriptionEn: 'Day of Atonement, the holiest day in Judaism.',
    tradition: 'judaism',
    date: getDateFor2025(10, 1),
    isRecurring: true,
    color: '#4A90E2'
  },
  {
    id: 'hanukkah-2025',
    name: 'Hanukkah',
    nameFr: 'Hanoucca',
    nameEn: 'Hanukkah',
    description: 'Fête des Lumières',
    descriptionFr: 'Fête des Lumières, commémorant la réinauguration du Temple de Jérusalem.',
    descriptionEn: 'Festival of Lights, commemorating the rededication of the Temple in Jerusalem.',
    tradition: 'judaism',
    date: getDateFor2025(12, 14),
    isRecurring: true,
    color: '#4A90E2'
  },
  {
    id: 'passover-2025',
    name: 'Passover',
    nameFr: 'Pessa\'h',
    nameEn: 'Passover',
    description: 'Fête de la Pâque juive',
    descriptionFr: 'Pessa\'h, commémorant la libération des Hébreux de l\'esclavage en Égypte.',
    descriptionEn: 'Passover, commemorating the liberation of the Hebrews from slavery in Egypt.',
    tradition: 'judaism',
    date: getDateFor2025(4, 12),
    isRecurring: true,
    color: '#4A90E2'
  },

  // Hindu Events (2025)
  {
    id: 'diwali-2025',
    name: 'Diwali',
    nameFr: 'Diwali',
    nameEn: 'Diwali',
    description: 'Fête des Lumières',
    descriptionFr: 'Diwali, la fête des Lumières, célébration majeure de l\'hindouisme.',
    descriptionEn: 'Diwali, the Festival of Lights, major Hindu celebration.',
    tradition: 'hinduism',
    date: getDateFor2025(10, 20),
    isRecurring: true,
    color: '#FF69B4'
  },
  {
    id: 'holi-2025',
    name: 'Holi',
    nameFr: 'Holi',
    nameEn: 'Holi',
    description: 'Fête des Couleurs',
    descriptionFr: 'Holi, la fête des Couleurs, célébrant l\'arrivée du printemps.',
    descriptionEn: 'Holi, the Festival of Colors, celebrating the arrival of spring.',
    tradition: 'hinduism',
    date: getDateFor2025(3, 14),
    isRecurring: true,
    color: '#FF69B4'
  },
  {
    id: 'navratri-2025',
    name: 'Navratri',
    nameFr: 'Navratri',
    nameEn: 'Navratri',
    description: 'Neuf nuits sacrées',
    descriptionFr: 'Navratri, festival de neuf nuits dédié à la déesse Durga.',
    descriptionEn: 'Navratri, nine-night festival dedicated to goddess Durga.',
    tradition: 'hinduism',
    date: getDateFor2025(9, 22),
    isRecurring: true,
    color: '#FF69B4'
  },

  // Buddhist Events (2025)
  {
    id: 'vesak-2025',
    name: 'Vesak',
    nameFr: 'Vesak',
    nameEn: 'Vesak',
    description: 'Anniversaire du Bouddha',
    descriptionFr: 'Vesak, célébration de la naissance, l\'éveil et la mort du Bouddha.',
    descriptionEn: 'Vesak, celebration of the birth, enlightenment and death of Buddha.',
    tradition: 'buddhism',
    date: getDateFor2025(5, 12),
    isRecurring: true,
    color: '#50C878'
  },
  {
    id: 'magha-puja-2025',
    name: 'Magha Puja',
    nameFr: 'Magha Puja',
    nameEn: 'Magha Puja',
    description: 'Jour du Sangha',
    descriptionFr: 'Magha Puja, commémoration de la première assemblée des disciples du Bouddha.',
    descriptionEn: 'Magha Puja, commemoration of the first gathering of Buddha\'s disciples.',
    tradition: 'buddhism',
    date: getDateFor2025(2, 12),
    isRecurring: true,
    color: '#50C878'
  },

  // Other / UNESCO
  {
    id: 'earth-day-2025',
    name: 'Earth Day',
    nameFr: 'Jour de la Terre',
    nameEn: 'Earth Day',
    description: 'Journée mondiale de la Terre',
    descriptionFr: 'Journée mondiale de la Terre, sensibilisation à la protection de l\'environnement.',
    descriptionEn: 'World Earth Day, raising awareness for environmental protection.',
    tradition: 'other',
    date: getDateFor2025(4, 22),
    isRecurring: true,
    color: '#FFFFFF'
  },
  {
    id: 'heritage-day-2025',
    name: 'World Heritage Day',
    nameFr: 'Journée du Patrimoine Mondial',
    nameEn: 'World Heritage Day',
    description: 'Journée internationale des monuments et des sites',
    descriptionFr: 'Journée internationale des monuments et des sites, célébrée par l\'UNESCO.',
    descriptionEn: 'International Day for Monuments and Sites, celebrated by UNESCO.',
    tradition: 'other',
    date: getDateFor2025(4, 18),
    isRecurring: true,
    color: '#FFFFFF'
  }
];

export const getEventsByDate = (date: Date): ReligiousEvent[] => {
  return religiousEvents2025.filter(event => {
    return (
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  });
};

export const getEventsByTradition = (tradition: string): ReligiousEvent[] => {
  if (tradition === 'all') return religiousEvents2025;
  return religiousEvents2025.filter(event => event.tradition === tradition);
};

export const getAllEventDates = (): Date[] => {
  return religiousEvents2025.map(event => event.date);
};
