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
  // New fields for saints
  subType?: 'major_feast' | 'saint' | 'liturgical';
  saintInfo?: {
    patronOf?: string;
    martyrOrConfessor?: 'martyr' | 'confesseur' | 'vierge' | 'docteur';
  };
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

// ==================== CATHOLIC SAINTS 2026 ====================
// Golden color for saints: #D4AF37
export const catholicSaints2026: ReligiousEvent[] = [
  // JANUARY
  {
    id: 'saint-genevieve-2026',
    name: 'Saint Genevieve',
    nameFr: 'Sainte Geneviève',
    nameEn: 'Saint Genevieve',
    description: 'Patronne de Paris',
    descriptionFr: 'Patronne de Paris, elle protégea la ville des invasions barbares par sa prière.',
    descriptionEn: 'Patron saint of Paris, she protected the city from barbarian invasions through her prayers.',
    tradition: 'christianity',
    date: getDateFor2026(1, 3),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'Paris', martyrOrConfessor: 'vierge' }
  },
  {
    id: 'saint-antoine-abbé-2026',
    name: 'Saint Anthony the Great',
    nameFr: 'Saint Antoine le Grand',
    nameEn: 'Saint Anthony the Great',
    description: 'Père du monachisme',
    descriptionFr: 'Père du monachisme chrétien, il vécut en ermite dans le désert d\'Égypte.',
    descriptionEn: 'Father of Christian monasticism, he lived as a hermit in the Egyptian desert.',
    tradition: 'christianity',
    date: getDateFor2026(1, 17),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'moines, ermites', martyrOrConfessor: 'confesseur' }
  },
  {
    id: 'saint-sebastien-2026',
    name: 'Saint Sebastian',
    nameFr: 'Saint Sébastien',
    nameEn: 'Saint Sebastian',
    description: 'Martyr et soldat romain',
    descriptionFr: 'Officier romain martyrisé sous Dioclétien, patron des archers et des athlètes.',
    descriptionEn: 'Roman officer martyred under Diocletian, patron of archers and athletes.',
    tradition: 'christianity',
    date: getDateFor2026(1, 20),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'archers, athlètes', martyrOrConfessor: 'martyr' }
  },
  {
    id: 'saint-francois-sales-2026',
    name: 'Saint Francis de Sales',
    nameFr: 'Saint François de Sales',
    nameEn: 'Saint Francis de Sales',
    description: 'Docteur de l\'Église',
    descriptionFr: 'Évêque de Genève, docteur de l\'Église, patron des journalistes et écrivains.',
    descriptionEn: 'Bishop of Geneva, Doctor of the Church, patron of journalists and writers.',
    tradition: 'christianity',
    date: getDateFor2026(1, 24),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'journalistes, écrivains', martyrOrConfessor: 'docteur' }
  },

  // FEBRUARY
  {
    id: 'sainte-agathe-2026',
    name: 'Saint Agatha',
    nameFr: 'Sainte Agathe',
    nameEn: 'Saint Agatha',
    description: 'Vierge et martyre',
    descriptionFr: 'Vierge et martyre sicilienne du IIIe siècle, patronne des nourrices.',
    descriptionEn: 'Virgin and Sicilian martyr of the 3rd century, patron of nurses.',
    tradition: 'christianity',
    date: getDateFor2026(2, 5),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'nourrices', martyrOrConfessor: 'martyr' }
  },
  {
    id: 'saint-valentin-2026',
    name: 'Saint Valentine',
    nameFr: 'Saint Valentin',
    nameEn: 'Saint Valentine',
    description: 'Patron des amoureux',
    descriptionFr: 'Prêtre romain martyrisé au IIIe siècle, patron des amoureux et des fiancés.',
    descriptionEn: 'Roman priest martyred in the 3rd century, patron of lovers and engaged couples.',
    tradition: 'christianity',
    date: getDateFor2026(2, 14),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'amoureux, fiancés', martyrOrConfessor: 'martyr' }
  },
  {
    id: 'sainte-bernadette-2026',
    name: 'Saint Bernadette',
    nameFr: 'Sainte Bernadette Soubirous',
    nameEn: 'Saint Bernadette Soubirous',
    description: 'Voyante de Lourdes',
    descriptionFr: 'Jeune bergère à qui la Vierge Marie apparut à Lourdes en 1858.',
    descriptionEn: 'Young shepherdess to whom the Virgin Mary appeared at Lourdes in 1858.',
    tradition: 'christianity',
    date: getDateFor2026(2, 18),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'malades, Lourdes', martyrOrConfessor: 'vierge' }
  },

  // MARCH
  {
    id: 'sainte-blandine-2026',
    name: 'Saint Blandina',
    nameFr: 'Sainte Blandine',
    nameEn: 'Saint Blandina',
    description: 'Martyre de Lyon',
    descriptionFr: 'Esclave chrétienne martyrisée à Lyon en 177, symbole de courage.',
    descriptionEn: 'Christian slave martyred in Lyon in 177, symbol of courage.',
    tradition: 'christianity',
    date: getDateFor2026(3, 2),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'Lyon', martyrOrConfessor: 'martyr' }
  },
  {
    id: 'saint-patrick-2026',
    name: 'Saint Patrick',
    nameFr: 'Saint Patrick',
    nameEn: 'Saint Patrick',
    description: 'Apôtre de l\'Irlande',
    descriptionFr: 'Évangélisateur de l\'Irlande au Ve siècle, patron de l\'Irlande.',
    descriptionEn: 'Evangelizer of Ireland in the 5th century, patron of Ireland.',
    tradition: 'christianity',
    date: getDateFor2026(3, 17),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'Irlande', martyrOrConfessor: 'confesseur' }
  },
  {
    id: 'saint-joseph-2026',
    name: 'Saint Joseph',
    nameFr: 'Saint Joseph',
    nameEn: 'Saint Joseph',
    description: 'Époux de la Vierge Marie',
    descriptionFr: 'Époux de Marie et père nourricier de Jésus, patron des travailleurs.',
    descriptionEn: 'Spouse of Mary and foster father of Jesus, patron of workers.',
    tradition: 'christianity',
    date: getDateFor2026(3, 19),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'travailleurs, pères de famille', martyrOrConfessor: 'confesseur' }
  },

  // APRIL
  {
    id: 'saint-georges-2026',
    name: 'Saint George',
    nameFr: 'Saint Georges',
    nameEn: 'Saint George',
    description: 'Soldat et martyr',
    descriptionFr: 'Soldat romain légendaire qui terrassa le dragon, patron de l\'Angleterre.',
    descriptionEn: 'Legendary Roman soldier who slew the dragon, patron of England.',
    tradition: 'christianity',
    date: getDateFor2026(4, 23),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'Angleterre, cavaliers', martyrOrConfessor: 'martyr' }
  },
  {
    id: 'saint-marc-2026',
    name: 'Saint Mark',
    nameFr: 'Saint Marc',
    nameEn: 'Saint Mark the Evangelist',
    description: 'Évangéliste',
    descriptionFr: 'Auteur du deuxième Évangile, patron de Venise et des notaires.',
    descriptionEn: 'Author of the second Gospel, patron of Venice and notaries.',
    tradition: 'christianity',
    date: getDateFor2026(4, 25),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'Venise, notaires', martyrOrConfessor: 'martyr' }
  },
  {
    id: 'sainte-catherine-sienne-2026',
    name: 'Saint Catherine of Siena',
    nameFr: 'Sainte Catherine de Sienne',
    nameEn: 'Saint Catherine of Siena',
    description: 'Docteur de l\'Église',
    descriptionFr: 'Mystique italienne, docteur de l\'Église, conseillère des papes.',
    descriptionEn: 'Italian mystic, Doctor of the Church, advisor to popes.',
    tradition: 'christianity',
    date: getDateFor2026(4, 29),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'Europe, Italie', martyrOrConfessor: 'docteur' }
  },

  // MAY
  {
    id: 'saint-joseph-travailleur-2026',
    name: 'Saint Joseph the Worker',
    nameFr: 'Saint Joseph Travailleur',
    nameEn: 'Saint Joseph the Worker',
    description: 'Fête du travail',
    descriptionFr: 'Fête instituée par Pie XII en 1955 pour sanctifier le travail.',
    descriptionEn: 'Feast instituted by Pius XII in 1955 to sanctify work.',
    tradition: 'christianity',
    date: getDateFor2026(5, 1),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'travailleurs', martyrOrConfessor: 'confesseur' }
  },
  {
    id: 'saint-philippe-2026',
    name: 'Saints Philip and James',
    nameFr: 'Saints Philippe et Jacques',
    nameEn: 'Saints Philip and James',
    description: 'Apôtres',
    descriptionFr: 'Deux des douze apôtres de Jésus, fêtés ensemble.',
    descriptionEn: 'Two of the twelve apostles of Jesus, celebrated together.',
    tradition: 'christianity',
    date: getDateFor2026(5, 3),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { martyrOrConfessor: 'martyr' }
  },
  {
    id: 'sainte-jeanne-arc-2026',
    name: 'Saint Joan of Arc',
    nameFr: 'Sainte Jeanne d\'Arc',
    nameEn: 'Saint Joan of Arc',
    description: 'Pucelle d\'Orléans',
    descriptionFr: 'Héroïne française et sainte patronne de la France, brûlée en 1431.',
    descriptionEn: 'French heroine and patron saint of France, burned at the stake in 1431.',
    tradition: 'christianity',
    date: getDateFor2026(5, 30),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'France', martyrOrConfessor: 'martyr' }
  },

  // JUNE
  {
    id: 'saint-antoine-padoue-2026',
    name: 'Saint Anthony of Padua',
    nameFr: 'Saint Antoine de Padoue',
    nameEn: 'Saint Anthony of Padua',
    description: 'Docteur de l\'Église',
    descriptionFr: 'Franciscain portugais, patron des objets perdus et des pauvres.',
    descriptionEn: 'Portuguese Franciscan, patron of lost objects and the poor.',
    tradition: 'christianity',
    date: getDateFor2026(6, 13),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'objets perdus, pauvres', martyrOrConfessor: 'docteur' }
  },
  {
    id: 'saint-jean-baptiste-2026',
    name: 'Saint John the Baptist',
    nameFr: 'Saint Jean-Baptiste',
    nameEn: 'Saint John the Baptist',
    description: 'Le Précurseur',
    descriptionFr: 'Prophète qui baptisa Jésus, précurseur du Messie.',
    descriptionEn: 'Prophet who baptized Jesus, precursor of the Messiah.',
    tradition: 'christianity',
    date: getDateFor2026(6, 24),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'Québec, Florence', martyrOrConfessor: 'martyr' }
  },
  {
    id: 'saints-pierre-paul-2026',
    name: 'Saints Peter and Paul',
    nameFr: 'Saints Pierre et Paul',
    nameEn: 'Saints Peter and Paul',
    description: 'Apôtres fondateurs',
    descriptionFr: 'Les deux piliers de l\'Église primitive, martyrisés à Rome.',
    descriptionEn: 'The two pillars of the early Church, martyred in Rome.',
    tradition: 'christianity',
    date: getDateFor2026(6, 29),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'Rome, papauté', martyrOrConfessor: 'martyr' }
  },

  // JULY
  {
    id: 'sainte-marie-madeleine-2026',
    name: 'Saint Mary Magdalene',
    nameFr: 'Sainte Marie-Madeleine',
    nameEn: 'Saint Mary Magdalene',
    description: 'Apôtre des apôtres',
    descriptionFr: 'Première témoin de la Résurrection, "apôtre des apôtres".',
    descriptionEn: 'First witness of the Resurrection, "apostle of the apostles".',
    tradition: 'christianity',
    date: getDateFor2026(7, 22),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'pénitents, parfumeurs', martyrOrConfessor: 'confesseur' }
  },
  {
    id: 'saint-jacques-2026',
    name: 'Saint James the Greater',
    nameFr: 'Saint Jacques le Majeur',
    nameEn: 'Saint James the Greater',
    description: 'Apôtre',
    descriptionFr: 'Apôtre de Jésus, patron des pèlerins de Compostelle.',
    descriptionEn: 'Apostle of Jesus, patron of Compostela pilgrims.',
    tradition: 'christianity',
    date: getDateFor2026(7, 25),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'Espagne, pèlerins', martyrOrConfessor: 'martyr' }
  },
  {
    id: 'sainte-anne-2026',
    name: 'Saints Joachim and Anne',
    nameFr: 'Saints Joachim et Anne',
    nameEn: 'Saints Joachim and Anne',
    description: 'Grands-parents de Jésus',
    descriptionFr: 'Parents de la Vierge Marie, patrons des grands-parents.',
    descriptionEn: 'Parents of the Virgin Mary, patrons of grandparents.',
    tradition: 'christianity',
    date: getDateFor2026(7, 26),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'grands-parents, Québec', martyrOrConfessor: 'confesseur' }
  },

  // AUGUST
  {
    id: 'saint-laurent-2026',
    name: 'Saint Lawrence',
    nameFr: 'Saint Laurent',
    nameEn: 'Saint Lawrence',
    description: 'Diacre et martyr',
    descriptionFr: 'Diacre romain martyrisé sur un gril en 258, patron des cuisiniers.',
    descriptionEn: 'Roman deacon martyred on a gridiron in 258, patron of cooks.',
    tradition: 'christianity',
    date: getDateFor2026(8, 10),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'cuisiniers, bibliothécaires', martyrOrConfessor: 'martyr' }
  },
  {
    id: 'saint-bernard-2026',
    name: 'Saint Bernard of Clairvaux',
    nameFr: 'Saint Bernard de Clairvaux',
    nameEn: 'Saint Bernard of Clairvaux',
    description: 'Docteur de l\'Église',
    descriptionFr: 'Moine cistercien, docteur de l\'Église, réformateur du XIIe siècle.',
    descriptionEn: 'Cistercian monk, Doctor of the Church, 12th century reformer.',
    tradition: 'christianity',
    date: getDateFor2026(8, 20),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'apiculteurs', martyrOrConfessor: 'docteur' }
  },
  {
    id: 'saint-augustin-2026',
    name: 'Saint Augustine',
    nameFr: 'Saint Augustin',
    nameEn: 'Saint Augustine of Hippo',
    description: 'Docteur de l\'Église',
    descriptionFr: 'Évêque d\'Hippone, père de l\'Église et grand théologien.',
    descriptionEn: 'Bishop of Hippo, Church Father and great theologian.',
    tradition: 'christianity',
    date: getDateFor2026(8, 28),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'théologiens, imprimeurs', martyrOrConfessor: 'docteur' }
  },

  // SEPTEMBER
  {
    id: 'sainte-therese-calcutta-2026',
    name: 'Saint Teresa of Calcutta',
    nameFr: 'Sainte Thérèse de Calcutta',
    nameEn: 'Saint Teresa of Calcutta',
    description: 'Mère Teresa',
    descriptionFr: 'Fondatrice des Missionnaires de la Charité, prix Nobel de la Paix.',
    descriptionEn: 'Founder of the Missionaries of Charity, Nobel Peace Prize laureate.',
    tradition: 'christianity',
    date: getDateFor2026(9, 5),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'missionnaires, pauvres', martyrOrConfessor: 'confesseur' }
  },
  {
    id: 'saint-vincent-paul-2026',
    name: 'Saint Vincent de Paul',
    nameFr: 'Saint Vincent de Paul',
    nameEn: 'Saint Vincent de Paul',
    description: 'Apôtre de la charité',
    descriptionFr: 'Prêtre français, fondateur des Lazaristes et des Filles de la Charité.',
    descriptionEn: 'French priest, founder of the Lazarists and Daughters of Charity.',
    tradition: 'christianity',
    date: getDateFor2026(9, 27),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'œuvres charitables', martyrOrConfessor: 'confesseur' }
  },
  {
    id: 'saint-michel-2026',
    name: 'Saints Michael, Gabriel and Raphael',
    nameFr: 'Saints Michel, Gabriel et Raphaël',
    nameEn: 'Saints Michael, Gabriel and Raphael',
    description: 'Archanges',
    descriptionFr: 'Les trois archanges de la tradition biblique.',
    descriptionEn: 'The three archangels of biblical tradition.',
    tradition: 'christianity',
    date: getDateFor2026(9, 29),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'policiers, médecins, messagers' }
  },

  // OCTOBER
  {
    id: 'sainte-therese-lisieux-2026',
    name: 'Saint Thérèse of Lisieux',
    nameFr: 'Sainte Thérèse de Lisieux',
    nameEn: 'Saint Thérèse of Lisieux',
    description: 'La petite Thérèse',
    descriptionFr: 'Carmélite française, docteur de l\'Église, patronne des missions.',
    descriptionEn: 'French Carmelite, Doctor of the Church, patron of missions.',
    tradition: 'christianity',
    date: getDateFor2026(10, 1),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'missions, France', martyrOrConfessor: 'docteur' }
  },
  {
    id: 'saint-francois-assise-2026',
    name: 'Saint Francis of Assisi',
    nameFr: 'Saint François d\'Assise',
    nameEn: 'Saint Francis of Assisi',
    description: 'Fondateur des Franciscains',
    descriptionFr: 'Fondateur de l\'ordre franciscain, patron de l\'écologie.',
    descriptionEn: 'Founder of the Franciscan order, patron of ecology.',
    tradition: 'christianity',
    date: getDateFor2026(10, 4),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'animaux, écologie, Italie', martyrOrConfessor: 'confesseur' }
  },
  {
    id: 'sainte-faustine-2026',
    name: 'Saint Faustina Kowalska',
    nameFr: 'Sainte Faustine Kowalska',
    nameEn: 'Saint Faustina Kowalska',
    description: 'Apôtre de la Miséricorde',
    descriptionFr: 'Religieuse polonaise, apôtre de la Divine Miséricorde.',
    descriptionEn: 'Polish nun, apostle of Divine Mercy.',
    tradition: 'christianity',
    date: getDateFor2026(10, 5),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'Divine Miséricorde', martyrOrConfessor: 'vierge' }
  },

  // NOVEMBER
  {
    id: 'saint-martin-2026',
    name: 'Saint Martin of Tours',
    nameFr: 'Saint Martin de Tours',
    nameEn: 'Saint Martin of Tours',
    description: 'Le partageur de manteau',
    descriptionFr: 'Évêque de Tours, célèbre pour avoir partagé son manteau avec un pauvre.',
    descriptionEn: 'Bishop of Tours, famous for sharing his cloak with a poor man.',
    tradition: 'christianity',
    date: getDateFor2026(11, 11),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'France, soldats', martyrOrConfessor: 'confesseur' }
  },
  {
    id: 'sainte-elisabeth-hongrie-2026',
    name: 'Saint Elizabeth of Hungary',
    nameFr: 'Sainte Élisabeth de Hongrie',
    nameEn: 'Saint Elizabeth of Hungary',
    description: 'Princesse charitable',
    descriptionFr: 'Princesse hongroise connue pour sa charité envers les pauvres.',
    descriptionEn: 'Hungarian princess known for her charity towards the poor.',
    tradition: 'christianity',
    date: getDateFor2026(11, 17),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'boulangers, tertiaires franciscains', martyrOrConfessor: 'confesseur' }
  },
  {
    id: 'sainte-cecile-2026',
    name: 'Saint Cecilia',
    nameFr: 'Sainte Cécile',
    nameEn: 'Saint Cecilia',
    description: 'Patronne des musiciens',
    descriptionFr: 'Vierge et martyre romaine, patronne des musiciens.',
    descriptionEn: 'Roman virgin and martyr, patron of musicians.',
    tradition: 'christianity',
    date: getDateFor2026(11, 22),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'musiciens', martyrOrConfessor: 'martyr' }
  },

  // DECEMBER
  {
    id: 'saint-nicolas-2026',
    name: 'Saint Nicholas',
    nameFr: 'Saint Nicolas',
    nameEn: 'Saint Nicholas',
    description: 'Patron des enfants',
    descriptionFr: 'Évêque de Myre, patron des enfants et des marins.',
    descriptionEn: 'Bishop of Myra, patron of children and sailors.',
    tradition: 'christianity',
    date: getDateFor2026(12, 6),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'enfants, marins, Lorraine', martyrOrConfessor: 'confesseur' }
  },
  {
    id: 'sainte-lucie-2026',
    name: 'Saint Lucy',
    nameFr: 'Sainte Lucie',
    nameEn: 'Saint Lucy',
    description: 'Vierge et martyre',
    descriptionFr: 'Vierge et martyre de Syracuse, patronne des aveugles.',
    descriptionEn: 'Virgin and martyr of Syracuse, patron of the blind.',
    tradition: 'christianity',
    date: getDateFor2026(12, 13),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'aveugles, Suède', martyrOrConfessor: 'martyr' }
  },
  {
    id: 'saint-etienne-2026',
    name: 'Saint Stephen',
    nameFr: 'Saint Étienne',
    nameEn: 'Saint Stephen',
    description: 'Premier martyr',
    descriptionFr: 'Premier diacre et premier martyr de l\'Église chrétienne.',
    descriptionEn: 'First deacon and first martyr of the Christian Church.',
    tradition: 'christianity',
    date: getDateFor2026(12, 26),
    isRecurring: true,
    color: '#D4AF37',
    subType: 'saint',
    saintInfo: { patronOf: 'diacres', martyrOrConfessor: 'martyr' }
  }
];

// Get all Christianity events including saints
export const getChristianityEventsWithSaints = (): ReligiousEvent[] => {
  return [
    ...religiousEvents2026.filter(e => e.tradition === 'christianity'),
    ...catholicSaints2026
  ];
};

export const getEventsByDate = (date: Date, includeSaints: boolean = true): ReligiousEvent[] => {
  const baseEvents = religiousEvents2026.filter(event => {
    return (
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  });
  
  if (includeSaints) {
    const saintEvents = catholicSaints2026.filter(event => {
      return (
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      );
    });
    return [...baseEvents, ...saintEvents];
  }
  
  return baseEvents;
};

export const getEventsByTradition = (tradition: string): ReligiousEvent[] => {
  if (tradition === 'all') return religiousEvents2026; // Saints NOT included in "all"
  if (tradition === 'christianity') return getChristianityEventsWithSaints(); // Include saints
  return religiousEvents2026.filter(event => event.tradition === tradition);
};

export const getAllEventDates = (includeSaints: boolean = false): Date[] => {
  const baseDates = religiousEvents2026.map(event => event.date);
  if (includeSaints) {
    return [...baseDates, ...catholicSaints2026.map(event => event.date)];
  }
  return baseDates;
};
