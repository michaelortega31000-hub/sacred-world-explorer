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

// Helper function to get dates for 2026
const getDateFor2026 = (month: number, day: number) => new Date(2026, month - 1, day);

export const religiousEvents2026: ReligiousEvent[] = [
  // ==================== CHRISTIANITY (7 events) ====================
  {
    id: 'epiphany-2026',
    name: 'Epiphany',
    nameFr: 'Épiphanie',
    nameEn: 'Epiphany',
    description: 'Fête des Rois Mages',
    descriptionFr: 'Célébration de la visite des Rois Mages à l\'enfant Jésus, symbolisant la révélation du Christ aux nations.',
    descriptionEn: 'Celebration of the visit of the Magi to the infant Jesus, symbolizing the revelation of Christ to the nations.',
    tradition: 'christianity',
    date: getDateFor2026(1, 6),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'easter-2026',
    name: 'Easter',
    nameFr: 'Pâques',
    nameEn: 'Easter',
    description: 'Résurrection de Jésus-Christ',
    descriptionFr: 'Commémoration de la résurrection de Jésus-Christ, événement central de la foi chrétienne célébré dans le monde entier.',
    descriptionEn: 'Commemoration of the resurrection of Jesus Christ, central event of the Christian faith celebrated worldwide.',
    tradition: 'christianity',
    date: getDateFor2026(4, 5),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'ascension-2026',
    name: 'Ascension',
    nameFr: 'Ascension',
    nameEn: 'Ascension',
    description: 'Montée de Jésus au ciel',
    descriptionFr: 'Célébration de la montée de Jésus au ciel, 40 jours après Pâques, marquant la fin de son ministère terrestre.',
    descriptionEn: 'Celebration of Jesus ascending to heaven, 40 days after Easter, marking the end of his earthly ministry.',
    tradition: 'christianity',
    date: getDateFor2026(5, 14),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'pentecost-2026',
    name: 'Pentecost',
    nameFr: 'Pentecôte',
    nameEn: 'Pentecost',
    description: 'Descente du Saint-Esprit',
    descriptionFr: 'Célébration de la descente du Saint-Esprit sur les apôtres, 50 jours après Pâques, naissance de l\'Église.',
    descriptionEn: 'Celebration of the descent of the Holy Spirit upon the apostles, 50 days after Easter, birth of the Church.',
    tradition: 'christianity',
    date: getDateFor2026(5, 24),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'assumption-2026',
    name: 'Assumption',
    nameFr: 'Assomption',
    nameEn: 'Assumption of Mary',
    description: 'Assomption de la Vierge Marie',
    descriptionFr: 'Célébration de l\'élévation de la Vierge Marie au ciel, corps et âme, fête majeure du catholicisme.',
    descriptionEn: 'Celebration of the Virgin Mary being taken up to heaven, body and soul, a major Catholic feast.',
    tradition: 'christianity',
    date: getDateFor2026(8, 15),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'all-saints-2026',
    name: 'All Saints',
    nameFr: 'Toussaint',
    nameEn: 'All Saints\' Day',
    description: 'Fête de tous les saints',
    descriptionFr: 'Fête catholique célébrant tous les saints connus et inconnus, jour de recueillement et de mémoire.',
    descriptionEn: 'Catholic feast celebrating all known and unknown saints, a day of remembrance and reflection.',
    tradition: 'christianity',
    date: getDateFor2026(11, 1),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'christmas-2026',
    name: 'Christmas',
    nameFr: 'Noël',
    nameEn: 'Christmas',
    description: 'Naissance de Jésus-Christ',
    descriptionFr: 'Célébration de la naissance de Jésus-Christ, fête majeure du christianisme célébrée dans le monde entier.',
    descriptionEn: 'Celebration of the birth of Jesus Christ, major Christian holiday celebrated worldwide.',
    tradition: 'christianity',
    date: getDateFor2026(12, 25),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },

  // ==================== ISLAM (5 events) ====================
  {
    id: 'isra-miraj-2026',
    name: 'Isra and Mi\'raj',
    nameFr: 'Isra et Miraj',
    nameEn: 'Isra and Mi\'raj',
    description: 'Voyage nocturne du Prophète',
    descriptionFr: 'Commémoration du voyage nocturne du Prophète Muhammad de La Mecque à Jérusalem et son ascension aux cieux.',
    descriptionEn: 'Commemoration of Prophet Muhammad\'s night journey from Mecca to Jerusalem and his ascension to heaven.',
    tradition: 'islam',
    date: getDateFor2026(1, 16),
    isRecurring: true,
    color: '#00C6FF',
    type: 'prayer'
  },
  {
    id: 'ramadan-start-2026',
    name: 'Ramadan',
    nameFr: 'Début du Ramadan',
    nameEn: 'Start of Ramadan',
    description: 'Début du mois sacré du jeûne',
    descriptionFr: 'Début du mois sacré du Ramadan, période de jeûne, de prière et de réflexion spirituelle pour les musulmans.',
    descriptionEn: 'Start of the holy month of Ramadan, period of fasting, prayer and spiritual reflection for Muslims.',
    tradition: 'islam',
    date: getDateFor2026(2, 18),
    isRecurring: true,
    color: '#00C6FF',
    type: 'fasting'
  },
  {
    id: 'eid-al-fitr-2026',
    name: 'Eid al-Fitr',
    nameFr: 'Aïd al-Fitr',
    nameEn: 'Eid al-Fitr',
    description: 'Fête de la rupture du jeûne',
    descriptionFr: 'Fête marquant la fin du Ramadan, célébration majeure de l\'islam avec prières, festins et partage.',
    descriptionEn: 'Feast marking the end of Ramadan, major Islamic celebration with prayers, feasts and sharing.',
    tradition: 'islam',
    date: getDateFor2026(3, 20),
    isRecurring: true,
    color: '#00C6FF',
    type: 'celebration'
  },
  {
    id: 'eid-al-adha-2026',
    name: 'Eid al-Adha',
    nameFr: 'Aïd al-Adha',
    nameEn: 'Eid al-Adha',
    description: 'Fête du sacrifice',
    descriptionFr: 'Fête du sacrifice commémorant la soumission d\'Abraham à Dieu, la plus importante fête musulmane.',
    descriptionEn: 'Feast of Sacrifice commemorating Abraham\'s submission to God, the most important Muslim feast.',
    tradition: 'islam',
    date: getDateFor2026(5, 27),
    isRecurring: true,
    color: '#00C6FF',
    type: 'celebration'
  },
  {
    id: 'mawlid-2026',
    name: 'Mawlid',
    nameFr: 'Mawlid an-Nabi',
    nameEn: 'Mawlid an-Nabi',
    description: 'Naissance du Prophète Muhammad',
    descriptionFr: 'Célébration de la naissance du Prophète Muhammad, jour de prières et de récitations du Coran.',
    descriptionEn: 'Celebration of the birth of Prophet Muhammad, a day of prayers and Quran recitations.',
    tradition: 'islam',
    date: getDateFor2026(8, 26),
    isRecurring: true,
    color: '#00C6FF',
    type: 'celebration'
  },

  // ==================== JUDAISM (7 events) ====================
  {
    id: 'purim-2026',
    name: 'Purim',
    nameFr: 'Pourim',
    nameEn: 'Purim',
    description: 'Fête des Sorts',
    descriptionFr: 'Célébration de la délivrance des Juifs de Perse, fête joyeuse avec lectures du Livre d\'Esther et costumes.',
    descriptionEn: 'Celebration of the deliverance of Jews from Persia, joyful feast with readings from the Book of Esther and costumes.',
    tradition: 'judaism',
    date: getDateFor2026(3, 3),
    isRecurring: true,
    color: '#4A90E2',
    type: 'festival'
  },
  {
    id: 'passover-2026',
    name: 'Passover',
    nameFr: 'Pessa\'h',
    nameEn: 'Passover',
    description: 'Fête de la Pâque juive',
    descriptionFr: 'Pessa\'h commémore la libération des Hébreux de l\'esclavage en Égypte, avec le Seder et les matzot.',
    descriptionEn: 'Passover commemorates the liberation of the Hebrews from slavery in Egypt, with the Seder and matzot.',
    tradition: 'judaism',
    date: getDateFor2026(4, 2),
    isRecurring: true,
    color: '#4A90E2',
    type: 'celebration'
  },
  {
    id: 'shavuot-2026',
    name: 'Shavuot',
    nameFr: 'Shavouot',
    nameEn: 'Shavuot',
    description: 'Fête des Semaines',
    descriptionFr: 'Célébration du don de la Torah au mont Sinaï, 50 jours après Pessa\'h, fête de la moisson.',
    descriptionEn: 'Celebration of the giving of the Torah at Mount Sinai, 50 days after Passover, harvest festival.',
    tradition: 'judaism',
    date: getDateFor2026(5, 22),
    isRecurring: true,
    color: '#4A90E2',
    type: 'celebration'
  },
  {
    id: 'rosh-hashanah-2026',
    name: 'Rosh Hashanah',
    nameFr: 'Rosh Hashanah',
    nameEn: 'Rosh Hashanah',
    description: 'Nouvel an juif',
    descriptionFr: 'Nouvel an juif, début des Jours redoutables, période d\'introspection et de repentance spirituelle.',
    descriptionEn: 'Jewish New Year, beginning of the High Holy Days, period of introspection and spiritual repentance.',
    tradition: 'judaism',
    date: getDateFor2026(9, 12),
    isRecurring: true,
    color: '#4A90E2',
    type: 'celebration'
  },
  {
    id: 'yom-kippur-2026',
    name: 'Yom Kippur',
    nameFr: 'Yom Kippour',
    nameEn: 'Yom Kippur',
    description: 'Jour du Grand Pardon',
    descriptionFr: 'Jour du Grand Pardon, jour le plus saint du judaïsme, consacré au jeûne et à la prière.',
    descriptionEn: 'Day of Atonement, the holiest day in Judaism, devoted to fasting and prayer.',
    tradition: 'judaism',
    date: getDateFor2026(9, 21),
    isRecurring: true,
    color: '#4A90E2',
    type: 'fasting'
  },
  {
    id: 'sukkot-2026',
    name: 'Sukkot',
    nameFr: 'Soukkot',
    nameEn: 'Sukkot',
    description: 'Fête des Tabernacles',
    descriptionFr: 'Fête des Tabernacles commémorant les 40 ans d\'errance dans le désert, avec construction de cabanes.',
    descriptionEn: 'Feast of Tabernacles commemorating 40 years of wandering in the desert, with building of booths.',
    tradition: 'judaism',
    date: getDateFor2026(9, 26),
    isRecurring: true,
    color: '#4A90E2',
    type: 'celebration'
  },
  {
    id: 'hanukkah-2026',
    name: 'Hanukkah',
    nameFr: 'Hanoucca',
    nameEn: 'Hanukkah',
    description: 'Fête des Lumières',
    descriptionFr: 'Fête des Lumières commémorant la réinauguration du Temple de Jérusalem, 8 jours de célébration.',
    descriptionEn: 'Festival of Lights commemorating the rededication of the Temple in Jerusalem, 8 days of celebration.',
    tradition: 'judaism',
    date: getDateFor2026(12, 5),
    isRecurring: true,
    color: '#4A90E2',
    type: 'festival'
  },

  // ==================== HINDUISM (5 events) ====================
  {
    id: 'holi-2026',
    name: 'Holi',
    nameFr: 'Holi',
    nameEn: 'Holi',
    description: 'Fête des Couleurs',
    descriptionFr: 'Holi, la fête des Couleurs, célébrant l\'arrivée du printemps et la victoire du bien sur le mal.',
    descriptionEn: 'Holi, the Festival of Colors, celebrating the arrival of spring and the victory of good over evil.',
    tradition: 'hinduism',
    date: getDateFor2026(3, 4),
    isRecurring: true,
    color: '#FF69B4',
    type: 'festival'
  },
  {
    id: 'ram-navami-2026',
    name: 'Ram Navami',
    nameFr: 'Ram Navami',
    nameEn: 'Ram Navami',
    description: 'Naissance du dieu Rama',
    descriptionFr: 'Célébration de la naissance de Rama, incarnation de Vishnu, avec prières et lectures du Ramayana.',
    descriptionEn: 'Celebration of the birth of Rama, incarnation of Vishnu, with prayers and readings from the Ramayana.',
    tradition: 'hinduism',
    date: getDateFor2026(3, 26),
    isRecurring: true,
    color: '#FF69B4',
    type: 'celebration'
  },
  {
    id: 'janmashtami-2026',
    name: 'Janmashtami',
    nameFr: 'Janmashtami',
    nameEn: 'Krishna Janmashtami',
    description: 'Naissance de Krishna',
    descriptionFr: 'Célébration de la naissance de Krishna, l\'une des divinités les plus vénérées de l\'hindouisme.',
    descriptionEn: 'Celebration of the birth of Krishna, one of the most revered deities in Hinduism.',
    tradition: 'hinduism',
    date: getDateFor2026(8, 15),
    isRecurring: true,
    color: '#FF69B4',
    type: 'celebration'
  },
  {
    id: 'navratri-2026',
    name: 'Navratri',
    nameFr: 'Navratri',
    nameEn: 'Navratri',
    description: 'Neuf nuits sacrées',
    descriptionFr: 'Navratri, festival de neuf nuits dédié à la déesse Durga, avec danses et célébrations.',
    descriptionEn: 'Navratri, nine-night festival dedicated to goddess Durga, with dances and celebrations.',
    tradition: 'hinduism',
    date: getDateFor2026(10, 10),
    isRecurring: true,
    color: '#FF69B4',
    type: 'festival'
  },
  {
    id: 'diwali-2026',
    name: 'Diwali',
    nameFr: 'Diwali',
    nameEn: 'Diwali',
    description: 'Fête des Lumières',
    descriptionFr: 'Diwali, la fête des Lumières, célébration majeure symbolisant la victoire de la lumière sur les ténèbres.',
    descriptionEn: 'Diwali, the Festival of Lights, major celebration symbolizing the victory of light over darkness.',
    tradition: 'hinduism',
    date: getDateFor2026(11, 8),
    isRecurring: true,
    color: '#FF69B4',
    type: 'festival'
  },

  // ==================== BUDDHISM (5 events) ====================
  {
    id: 'magha-puja-2026',
    name: 'Magha Puja',
    nameFr: 'Magha Puja',
    nameEn: 'Magha Puja',
    description: 'Jour du Sangha',
    descriptionFr: 'Magha Puja commémore la première assemblée des 1250 disciples du Bouddha, jour de mérite et de méditation.',
    descriptionEn: 'Magha Puja commemorates the first gathering of 1250 disciples of Buddha, day of merit and meditation.',
    tradition: 'buddhism',
    date: getDateFor2026(3, 3),
    isRecurring: true,
    color: '#50C878',
    type: 'prayer'
  },
  {
    id: 'vesak-2026',
    name: 'Vesak',
    nameFr: 'Vesak',
    nameEn: 'Vesak',
    description: 'Jour du Bouddha',
    descriptionFr: 'Vesak célèbre la naissance, l\'éveil et le parinirvana du Bouddha, fête la plus sacrée du bouddhisme.',
    descriptionEn: 'Vesak celebrates the birth, enlightenment and parinirvana of Buddha, the most sacred Buddhist festival.',
    tradition: 'buddhism',
    date: getDateFor2026(5, 31),
    isRecurring: true,
    color: '#50C878',
    type: 'celebration'
  },
  {
    id: 'asalha-puja-2026',
    name: 'Asalha Puja',
    nameFr: 'Asalha Puja',
    nameEn: 'Asalha Puja',
    description: 'Premier sermon du Bouddha',
    descriptionFr: 'Commémoration du premier sermon du Bouddha à Sarnath, enseignant les Quatre Nobles Vérités.',
    descriptionEn: 'Commemoration of Buddha\'s first sermon at Sarnath, teaching the Four Noble Truths.',
    tradition: 'buddhism',
    date: getDateFor2026(7, 29),
    isRecurring: true,
    color: '#50C878',
    type: 'prayer'
  },
  {
    id: 'vassa-start-2026',
    name: 'Vassa',
    nameFr: 'Début de Vassa',
    nameEn: 'Start of Vassa',
    description: 'Retraite monastique des pluies',
    descriptionFr: 'Début de Vassa, la retraite monastique de trois mois pendant la saison des pluies.',
    descriptionEn: 'Start of Vassa, the three-month monastic retreat during the rainy season.',
    tradition: 'buddhism',
    date: getDateFor2026(7, 30),
    isRecurring: true,
    color: '#50C878',
    type: 'prayer'
  },
  {
    id: 'bodhi-day-2026',
    name: 'Bodhi Day',
    nameFr: 'Bodhi Day',
    nameEn: 'Bodhi Day',
    description: 'Éveil du Bouddha',
    descriptionFr: 'Célébration du jour où Siddhartha Gautama atteignit l\'éveil sous l\'arbre de la Bodhi.',
    descriptionEn: 'Celebration of the day Siddhartha Gautama achieved enlightenment under the Bodhi tree.',
    tradition: 'buddhism',
    date: getDateFor2026(12, 8),
    isRecurring: true,
    color: '#50C878',
    type: 'celebration'
  },

  // ==================== OTHER / UNESCO (3 events) ====================
  {
    id: 'heritage-day-2026',
    name: 'World Heritage Day',
    nameFr: 'Journée du Patrimoine Mondial',
    nameEn: 'World Heritage Day',
    description: 'Journée internationale des monuments',
    descriptionFr: 'Journée internationale des monuments et des sites, célébrée par l\'UNESCO pour la préservation du patrimoine.',
    descriptionEn: 'International Day for Monuments and Sites, celebrated by UNESCO for heritage preservation.',
    tradition: 'other',
    date: getDateFor2026(4, 18),
    isRecurring: true,
    color: '#FFFFFF',
    type: 'celebration'
  },
  {
    id: 'earth-day-2026',
    name: 'Earth Day',
    nameFr: 'Jour de la Terre',
    nameEn: 'Earth Day',
    description: 'Journée mondiale de la Terre',
    descriptionFr: 'Journée mondiale de la Terre, sensibilisation à la protection de l\'environnement et de la planète.',
    descriptionEn: 'World Earth Day, raising awareness for environmental protection and the planet.',
    tradition: 'other',
    date: getDateFor2026(4, 22),
    isRecurring: true,
    color: '#FFFFFF',
    type: 'celebration'
  },
  {
    id: 'peace-day-2026',
    name: 'International Day of Peace',
    nameFr: 'Journée de la Paix',
    nameEn: 'International Day of Peace',
    description: 'Journée mondiale de la paix',
    descriptionFr: 'Journée internationale de la paix des Nations Unies, appelant à un cessez-le-feu mondial.',
    descriptionEn: 'United Nations International Day of Peace, calling for a global ceasefire.',
    tradition: 'other',
    date: getDateFor2026(9, 21),
    isRecurring: true,
    color: '#FFFFFF',
    type: 'celebration'
  }
];

export const getEventsByDate = (date: Date): ReligiousEvent[] => {
  return religiousEvents2026.filter(event => {
    return (
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  });
};

export const getEventsByTradition = (tradition: string): ReligiousEvent[] => {
  if (tradition === 'all') return religiousEvents2026;
  return religiousEvents2026.filter(event => event.tradition === tradition);
};

export const getAllEventDates = (): Date[] => {
  return religiousEvents2026.map(event => event.date);
};
