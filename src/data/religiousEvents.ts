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
  // ==================== CHRISTIANITY (25+ events) ====================
  {
    id: 'new-year-mary-2026',
    name: 'Mary, Mother of God',
    nameFr: 'Sainte Marie, Mère de Dieu',
    nameEn: 'Mary, Mother of God',
    description: 'Solennité de Marie',
    descriptionFr: 'Solennité de Marie, Mère de Dieu. Premier jour de l\'année civile, octave de Noël.',
    descriptionEn: 'Solemnity of Mary, Mother of God. First day of the civil year, octave of Christmas.',
    tradition: 'christianity',
    date: getDateFor2026(1, 1),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
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
    id: 'baptism-lord-2026',
    name: 'Baptism of the Lord',
    nameFr: 'Baptême du Seigneur',
    nameEn: 'Baptism of the Lord',
    description: 'Baptême de Jésus par Jean',
    descriptionFr: 'Commémoration du baptême de Jésus par Jean-Baptiste dans le Jourdain, révélation de la Sainte Trinité.',
    descriptionEn: 'Commemoration of Jesus\' baptism by John the Baptist in the Jordan, revelation of the Holy Trinity.',
    tradition: 'christianity',
    date: getDateFor2026(1, 11),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'presentation-2026',
    name: 'Presentation of the Lord',
    nameFr: 'Présentation du Seigneur (Chandeleur)',
    nameEn: 'Presentation of the Lord (Candlemas)',
    description: 'Chandeleur',
    descriptionFr: 'Fête de la Chandeleur, présentation de Jésus au Temple 40 jours après sa naissance.',
    descriptionEn: 'Candlemas, presentation of Jesus at the Temple 40 days after his birth.',
    tradition: 'christianity',
    date: getDateFor2026(2, 2),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'ash-wednesday-2026',
    name: 'Ash Wednesday',
    nameFr: 'Mercredi des Cendres',
    nameEn: 'Ash Wednesday',
    description: 'Début du Carême',
    descriptionFr: 'Début du Carême, 40 jours de jeûne et de pénitence avant Pâques.',
    descriptionEn: 'Beginning of Lent, 40 days of fasting and penance before Easter.',
    tradition: 'christianity',
    date: getDateFor2026(2, 18),
    isRecurring: true,
    color: '#C6A45A',
    type: 'fasting'
  },
  {
    id: 'annunciation-2026',
    name: 'Annunciation',
    nameFr: 'Annonciation',
    nameEn: 'Annunciation of the Lord',
    description: 'L\'ange Gabriel annonce à Marie',
    descriptionFr: 'L\'ange Gabriel annonce à Marie qu\'elle sera la mère du Sauveur. Neuf mois avant Noël.',
    descriptionEn: 'The angel Gabriel announces to Mary that she will be the mother of the Savior. Nine months before Christmas.',
    tradition: 'christianity',
    date: getDateFor2026(3, 25),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'palm-sunday-2026',
    name: 'Palm Sunday',
    nameFr: 'Dimanche des Rameaux',
    nameEn: 'Palm Sunday',
    description: 'Entrée de Jésus à Jérusalem',
    descriptionFr: 'Entrée triomphale de Jésus à Jérusalem, début de la Semaine Sainte.',
    descriptionEn: 'Triumphal entry of Jesus into Jerusalem, beginning of Holy Week.',
    tradition: 'christianity',
    date: getDateFor2026(3, 29),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'holy-thursday-2026',
    name: 'Holy Thursday',
    nameFr: 'Jeudi Saint',
    nameEn: 'Holy Thursday',
    description: 'Dernière Cène',
    descriptionFr: 'Commémoration de la Dernière Cène et institution de l\'Eucharistie.',
    descriptionEn: 'Commemoration of the Last Supper and institution of the Eucharist.',
    tradition: 'christianity',
    date: getDateFor2026(4, 2),
    isRecurring: true,
    color: '#C6A45A',
    type: 'prayer'
  },
  {
    id: 'good-friday-2026',
    name: 'Good Friday',
    nameFr: 'Vendredi Saint',
    nameEn: 'Good Friday',
    description: 'Passion du Christ',
    descriptionFr: 'Jour de la Passion et de la mort de Jésus sur la Croix. Jour de jeûne et d\'abstinence.',
    descriptionEn: 'Day of the Passion and death of Jesus on the Cross. Day of fasting and abstinence.',
    tradition: 'christianity',
    date: getDateFor2026(4, 3),
    isRecurring: true,
    color: '#C6A45A',
    type: 'fasting'
  },
  {
    id: 'holy-saturday-2026',
    name: 'Holy Saturday',
    nameFr: 'Samedi Saint',
    nameEn: 'Holy Saturday',
    description: 'Veillée pascale',
    descriptionFr: 'Jour de silence et de recueillement. Veillée pascale dans la nuit.',
    descriptionEn: 'Day of silence and reflection. Easter Vigil in the night.',
    tradition: 'christianity',
    date: getDateFor2026(4, 4),
    isRecurring: true,
    color: '#C6A45A',
    type: 'prayer'
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
    id: 'divine-mercy-2026',
    name: 'Divine Mercy Sunday',
    nameFr: 'Dimanche de la Divine Miséricorde',
    nameEn: 'Divine Mercy Sunday',
    description: 'Fête de la Miséricorde',
    descriptionFr: 'Dimanche après Pâques, fête instituée par Saint Jean-Paul II en l\'honneur de la Divine Miséricorde.',
    descriptionEn: 'Sunday after Easter, feast instituted by Saint John Paul II in honor of Divine Mercy.',
    tradition: 'christianity',
    date: getDateFor2026(4, 12),
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
    id: 'trinity-sunday-2026',
    name: 'Trinity Sunday',
    nameFr: 'Fête de la Sainte Trinité',
    nameEn: 'Trinity Sunday',
    description: 'Fête de la Trinité',
    descriptionFr: 'Célébration du mystère de la Sainte Trinité : Père, Fils et Saint-Esprit.',
    descriptionEn: 'Celebration of the mystery of the Holy Trinity: Father, Son and Holy Spirit.',
    tradition: 'christianity',
    date: getDateFor2026(5, 31),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'corpus-christi-2026',
    name: 'Corpus Christi',
    nameFr: 'Fête-Dieu (Corpus Christi)',
    nameEn: 'Corpus Christi',
    description: 'Fête du Saint-Sacrement',
    descriptionFr: 'Fête du Corps et du Sang du Christ, célébrant la présence réelle dans l\'Eucharistie.',
    descriptionEn: 'Feast of the Body and Blood of Christ, celebrating the Real Presence in the Eucharist.',
    tradition: 'christianity',
    date: getDateFor2026(6, 7),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'sacred-heart-2026',
    name: 'Sacred Heart of Jesus',
    nameFr: 'Sacré-Cœur de Jésus',
    nameEn: 'Sacred Heart of Jesus',
    description: 'Fête du Sacré-Cœur',
    descriptionFr: 'Solennité du Sacré-Cœur de Jésus, symbole de l\'amour divin pour l\'humanité.',
    descriptionEn: 'Solemnity of the Sacred Heart of Jesus, symbol of divine love for humanity.',
    tradition: 'christianity',
    date: getDateFor2026(6, 12),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'nativity-john-baptist-2026',
    name: 'Nativity of John the Baptist',
    nameFr: 'Nativité de Saint Jean-Baptiste',
    nameEn: 'Nativity of John the Baptist',
    description: 'Naissance de Jean-Baptiste',
    descriptionFr: 'Fête de la naissance de Saint Jean-Baptiste, précurseur du Christ.',
    descriptionEn: 'Feast of the birth of Saint John the Baptist, precursor of Christ.',
    tradition: 'christianity',
    date: getDateFor2026(6, 24),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'peter-paul-2026',
    name: 'Saints Peter and Paul',
    nameFr: 'Saints Pierre et Paul',
    nameEn: 'Saints Peter and Paul',
    description: 'Fête des apôtres Pierre et Paul',
    descriptionFr: 'Solennité des apôtres Pierre et Paul, piliers de l\'Église.',
    descriptionEn: 'Solemnity of apostles Peter and Paul, pillars of the Church.',
    tradition: 'christianity',
    date: getDateFor2026(6, 29),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'transfiguration-2026',
    name: 'Transfiguration of the Lord',
    nameFr: 'Transfiguration du Seigneur',
    nameEn: 'Transfiguration of the Lord',
    description: 'Transfiguration sur le mont Thabor',
    descriptionFr: 'Fête de la Transfiguration de Jésus sur le mont Thabor devant Pierre, Jacques et Jean.',
    descriptionEn: 'Feast of the Transfiguration of Jesus on Mount Tabor before Peter, James and John.',
    tradition: 'christianity',
    date: getDateFor2026(8, 6),
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
    id: 'nativity-mary-2026',
    name: 'Nativity of Mary',
    nameFr: 'Nativité de la Vierge Marie',
    nameEn: 'Nativity of the Blessed Virgin Mary',
    description: 'Naissance de Marie',
    descriptionFr: 'Fête de la naissance de la Vierge Marie.',
    descriptionEn: 'Feast of the birth of the Blessed Virgin Mary.',
    tradition: 'christianity',
    date: getDateFor2026(9, 8),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'holy-cross-2026',
    name: 'Exaltation of the Holy Cross',
    nameFr: 'Exaltation de la Sainte Croix',
    nameEn: 'Exaltation of the Holy Cross',
    description: 'Fête de la Croix',
    descriptionFr: 'Fête de l\'Exaltation de la Sainte Croix, instrument de notre salut.',
    descriptionEn: 'Feast of the Exaltation of the Holy Cross, instrument of our salvation.',
    tradition: 'christianity',
    date: getDateFor2026(9, 14),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'our-lady-sorrows-2026',
    name: 'Our Lady of Sorrows',
    nameFr: 'Notre-Dame des Douleurs',
    nameEn: 'Our Lady of Sorrows',
    description: 'Fête des sept douleurs de Marie',
    descriptionFr: 'Mémoire des sept douleurs de la Vierge Marie.',
    descriptionEn: 'Memorial of the seven sorrows of the Virgin Mary.',
    tradition: 'christianity',
    date: getDateFor2026(9, 15),
    isRecurring: true,
    color: '#C6A45A',
    type: 'prayer'
  },
  {
    id: 'archangels-2026',
    name: 'Saints Michael, Gabriel and Raphael',
    nameFr: 'Saints Michel, Gabriel et Raphaël',
    nameEn: 'Saints Michael, Gabriel and Raphael, Archangels',
    description: 'Fête des Archanges',
    descriptionFr: 'Fête des trois archanges : Michel, Gabriel et Raphaël.',
    descriptionEn: 'Feast of the three archangels: Michael, Gabriel and Raphael.',
    tradition: 'christianity',
    date: getDateFor2026(9, 29),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'guardian-angels-2026',
    name: 'Guardian Angels',
    nameFr: 'Saints Anges Gardiens',
    nameEn: 'Guardian Angels',
    description: 'Fête des Anges Gardiens',
    descriptionFr: 'Fête des saints Anges Gardiens.',
    descriptionEn: 'Feast of the Holy Guardian Angels.',
    tradition: 'christianity',
    date: getDateFor2026(10, 2),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'our-lady-rosary-2026',
    name: 'Our Lady of the Rosary',
    nameFr: 'Notre-Dame du Rosaire',
    nameEn: 'Our Lady of the Rosary',
    description: 'Fête du Rosaire',
    descriptionFr: 'Mémoire de Notre-Dame du Rosaire, instituée après la bataille de Lépante.',
    descriptionEn: 'Memorial of Our Lady of the Rosary, instituted after the Battle of Lepanto.',
    tradition: 'christianity',
    date: getDateFor2026(10, 7),
    isRecurring: true,
    color: '#C6A45A',
    type: 'prayer'
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
    id: 'all-souls-2026',
    name: 'All Souls',
    nameFr: 'Commémoration des défunts',
    nameEn: 'All Souls\' Day',
    description: 'Jour des défunts',
    descriptionFr: 'Commémoration de tous les fidèles défunts. Prières pour les âmes du purgatoire.',
    descriptionEn: 'Commemoration of all the faithful departed. Prayers for the souls in purgatory.',
    tradition: 'christianity',
    date: getDateFor2026(11, 2),
    isRecurring: true,
    color: '#C6A45A',
    type: 'prayer'
  },
  {
    id: 'christ-king-2026',
    name: 'Christ the King',
    nameFr: 'Christ Roi de l\'Univers',
    nameEn: 'Christ the King',
    description: 'Fête du Christ Roi',
    descriptionFr: 'Solennité du Christ Roi de l\'Univers, dernier dimanche de l\'année liturgique.',
    descriptionEn: 'Solemnity of Christ the King of the Universe, last Sunday of the liturgical year.',
    tradition: 'christianity',
    date: getDateFor2026(11, 22),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'advent-start-2026',
    name: 'First Sunday of Advent',
    nameFr: 'Premier dimanche de l\'Avent',
    nameEn: 'First Sunday of Advent',
    description: 'Début de l\'Avent',
    descriptionFr: 'Premier dimanche de l\'Avent, début de la nouvelle année liturgique et préparation à Noël.',
    descriptionEn: 'First Sunday of Advent, beginning of the new liturgical year and preparation for Christmas.',
    tradition: 'christianity',
    date: getDateFor2026(11, 29),
    isRecurring: true,
    color: '#C6A45A',
    type: 'prayer'
  },
  {
    id: 'immaculate-conception-2026',
    name: 'Immaculate Conception',
    nameFr: 'Immaculée Conception',
    nameEn: 'Immaculate Conception',
    description: 'Conception sans péché de Marie',
    descriptionFr: 'Solennité de l\'Immaculée Conception de la Vierge Marie, patronne de la France.',
    descriptionEn: 'Solemnity of the Immaculate Conception of the Blessed Virgin Mary.',
    tradition: 'christianity',
    date: getDateFor2026(12, 8),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'our-lady-guadalupe-2026',
    name: 'Our Lady of Guadalupe',
    nameFr: 'Notre-Dame de Guadalupe',
    nameEn: 'Our Lady of Guadalupe',
    description: 'Patronne des Amériques',
    descriptionFr: 'Fête de Notre-Dame de Guadalupe, patronne des Amériques.',
    descriptionEn: 'Feast of Our Lady of Guadalupe, patroness of the Americas.',
    tradition: 'christianity',
    date: getDateFor2026(12, 12),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },
  {
    id: 'christmas-eve-2026',
    name: 'Christmas Eve',
    nameFr: 'Veillée de Noël',
    nameEn: 'Christmas Eve',
    description: 'Veillée de Noël',
    descriptionFr: 'Veillée de Noël, nuit de la Nativité du Seigneur.',
    descriptionEn: 'Christmas Eve, night of the Nativity of the Lord.',
    tradition: 'christianity',
    date: getDateFor2026(12, 24),
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
  {
    id: 'holy-family-2026',
    name: 'Holy Family',
    nameFr: 'Sainte Famille',
    nameEn: 'Holy Family of Jesus, Mary and Joseph',
    description: 'Fête de la Sainte Famille',
    descriptionFr: 'Fête de la Sainte Famille de Jésus, Marie et Joseph.',
    descriptionEn: 'Feast of the Holy Family of Jesus, Mary and Joseph.',
    tradition: 'christianity',
    date: getDateFor2026(12, 27),
    isRecurring: true,
    color: '#C6A45A',
    type: 'celebration'
  },

  // ==================== ISLAM (15+ events) ====================
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
    id: 'shaban-15-2026',
    name: 'Laylat al-Bara\'at',
    nameFr: 'Nuit du Pardon (15 Chaabane)',
    nameEn: 'Night of Forgiveness',
    description: 'Nuit de la rémission des péchés',
    descriptionFr: 'Nuit du 15 Chaabane, nuit de prière et de demande de pardon avant le Ramadan.',
    descriptionEn: 'Night of the 15th of Shaban, night of prayer and seeking forgiveness before Ramadan.',
    tradition: 'islam',
    date: getDateFor2026(2, 3),
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
    id: 'laylat-qadr-2026',
    name: 'Laylat al-Qadr',
    nameFr: 'Nuit du Destin',
    nameEn: 'Night of Power',
    description: 'Nuit de la révélation du Coran',
    descriptionFr: 'La Nuit du Destin, nuit la plus sacrée du Ramadan où le Coran fut révélé au Prophète.',
    descriptionEn: 'The Night of Power, the most sacred night of Ramadan when the Quran was revealed to the Prophet.',
    tradition: 'islam',
    date: getDateFor2026(3, 13),
    isRecurring: true,
    color: '#00C6FF',
    type: 'prayer'
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
    id: 'hajj-start-2026',
    name: 'Start of Hajj',
    nameFr: 'Début du Hajj',
    nameEn: 'Start of Hajj',
    description: 'Début du pèlerinage à La Mecque',
    descriptionFr: 'Début du Hajj, le pèlerinage annuel à La Mecque, cinquième pilier de l\'Islam.',
    descriptionEn: 'Beginning of Hajj, the annual pilgrimage to Mecca, fifth pillar of Islam.',
    tradition: 'islam',
    date: getDateFor2026(5, 24),
    isRecurring: true,
    color: '#00C6FF',
    type: 'pilgrimage'
  },
  {
    id: 'day-arafat-2026',
    name: 'Day of Arafat',
    nameFr: 'Jour d\'Arafat',
    nameEn: 'Day of Arafat',
    description: 'Veille de l\'Aïd al-Adha',
    descriptionFr: 'Jour où les pèlerins se rassemblent sur le mont Arafat. Jour de jeûne recommandé pour les non-pèlerins.',
    descriptionEn: 'Day when pilgrims gather on Mount Arafat. Recommended fasting day for non-pilgrims.',
    tradition: 'islam',
    date: getDateFor2026(5, 26),
    isRecurring: true,
    color: '#00C6FF',
    type: 'fasting'
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
    id: 'islamic-new-year-2026',
    name: 'Islamic New Year',
    nameFr: 'Nouvel An Islamique (1448)',
    nameEn: 'Islamic New Year (1448 AH)',
    description: 'Premier jour de Mouharram',
    descriptionFr: 'Premier jour de Mouharram, début de l\'année 1448 de l\'Hégire.',
    descriptionEn: 'First day of Muharram, beginning of the year 1448 AH.',
    tradition: 'islam',
    date: getDateFor2026(6, 17),
    isRecurring: true,
    color: '#00C6FF',
    type: 'celebration'
  },
  {
    id: 'ashura-2026',
    name: 'Ashura',
    nameFr: 'Achoura',
    nameEn: 'Ashura',
    description: '10e jour de Mouharram',
    descriptionFr: 'Jour de jeûne commémorant différents événements sacrés dont le salut de Moïse.',
    descriptionEn: 'Day of fasting commemorating various sacred events including the salvation of Moses.',
    tradition: 'islam',
    date: getDateFor2026(6, 26),
    isRecurring: true,
    color: '#00C6FF',
    type: 'fasting'
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

  // ==================== JUDAISM (15+ events) ====================
  {
    id: 'tu-bshevat-2026',
    name: 'Tu BiShvat',
    nameFr: 'Tou Bichevat',
    nameEn: 'Tu BiShvat',
    description: 'Nouvel An des Arbres',
    descriptionFr: 'Nouvel An des Arbres, fête écologique célébrant la nature et les plantations.',
    descriptionEn: 'New Year for Trees, ecological holiday celebrating nature and planting.',
    tradition: 'judaism',
    date: getDateFor2026(2, 2),
    isRecurring: true,
    color: '#4A90E2',
    type: 'celebration'
  },
  {
    id: 'fast-esther-2026',
    name: 'Fast of Esther',
    nameFr: 'Jeûne d\'Esther',
    nameEn: 'Fast of Esther',
    description: 'Jeûne avant Pourim',
    descriptionFr: 'Jour de jeûne précédant Pourim, commémorant le jeûne d\'Esther avant de plaider pour son peuple.',
    descriptionEn: 'Fast day preceding Purim, commemorating Esther\'s fast before pleading for her people.',
    tradition: 'judaism',
    date: getDateFor2026(3, 2),
    isRecurring: true,
    color: '#4A90E2',
    type: 'fasting'
  },
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
    id: 'yom-hashoah-2026',
    name: 'Yom HaShoah',
    nameFr: 'Yom HaShoah',
    nameEn: 'Holocaust Remembrance Day',
    description: 'Jour de mémoire de la Shoah',
    descriptionFr: 'Jour de commémoration des victimes de la Shoah.',
    descriptionEn: 'Day of commemoration of the victims of the Holocaust.',
    tradition: 'judaism',
    date: getDateFor2026(4, 15),
    isRecurring: true,
    color: '#4A90E2',
    type: 'prayer'
  },
  {
    id: 'yom-hazikaron-2026',
    name: 'Yom HaZikaron',
    nameFr: 'Yom HaZikaron',
    nameEn: 'Israeli Memorial Day',
    description: 'Jour du souvenir en Israël',
    descriptionFr: 'Jour de commémoration des soldats et victimes du terrorisme en Israël.',
    descriptionEn: 'Day of commemoration of fallen soldiers and victims of terrorism in Israel.',
    tradition: 'judaism',
    date: getDateFor2026(4, 22),
    isRecurring: true,
    color: '#4A90E2',
    type: 'prayer'
  },
  {
    id: 'yom-haatzmaut-2026',
    name: 'Yom HaAtzmaut',
    nameFr: 'Yom HaAtsmaout',
    nameEn: 'Israeli Independence Day',
    description: 'Jour de l\'Indépendance d\'Israël',
    descriptionFr: 'Célébration de l\'indépendance de l\'État d\'Israël (1948).',
    descriptionEn: 'Celebration of the independence of the State of Israel (1948).',
    tradition: 'judaism',
    date: getDateFor2026(4, 23),
    isRecurring: true,
    color: '#4A90E2',
    type: 'celebration'
  },
  {
    id: 'lag-baomer-2026',
    name: 'Lag BaOmer',
    nameFr: 'Lag BaOmer',
    nameEn: 'Lag BaOmer',
    description: '33e jour du Omer',
    descriptionFr: 'Fête du 33e jour du décompte de l\'Omer, associée à Rabbi Shimon bar Yochaï.',
    descriptionEn: 'Festival of the 33rd day of the Omer count, associated with Rabbi Shimon bar Yochai.',
    tradition: 'judaism',
    date: getDateFor2026(5, 7),
    isRecurring: true,
    color: '#4A90E2',
    type: 'festival'
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
    id: 'tisha-bav-2026',
    name: 'Tisha B\'Av',
    nameFr: 'Tisha BeAv',
    nameEn: 'Tisha B\'Av',
    description: '9 Av - Jour de deuil',
    descriptionFr: 'Jour de jeûne commémorant la destruction des deux Temples de Jérusalem.',
    descriptionEn: 'Fast day commemorating the destruction of both Temples in Jerusalem.',
    tradition: 'judaism',
    date: getDateFor2026(7, 23),
    isRecurring: true,
    color: '#4A90E2',
    type: 'fasting'
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
    id: 'tzom-gedaliah-2026',
    name: 'Fast of Gedaliah',
    nameFr: 'Jeûne de Guedalia',
    nameEn: 'Fast of Gedaliah',
    description: 'Jour de jeûne',
    descriptionFr: 'Jeûne commémorant l\'assassinat de Guedalia, gouverneur de Judée.',
    descriptionEn: 'Fast commemorating the assassination of Gedaliah, governor of Judea.',
    tradition: 'judaism',
    date: getDateFor2026(9, 14),
    isRecurring: true,
    color: '#4A90E2',
    type: 'fasting'
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
    id: 'simchat-torah-2026',
    name: 'Simchat Torah',
    nameFr: 'Simhat Torah',
    nameEn: 'Simchat Torah',
    description: 'Joie de la Torah',
    descriptionFr: 'Célébration de la fin et du recommencement de la lecture annuelle de la Torah.',
    descriptionEn: 'Celebration of the completion and restart of the annual Torah reading.',
    tradition: 'judaism',
    date: getDateFor2026(10, 4),
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

  // ==================== HINDUISM (15+ events) ====================
  {
    id: 'makar-sankranti-2026',
    name: 'Makar Sankranti',
    nameFr: 'Makar Sankranti',
    nameEn: 'Makar Sankranti',
    description: 'Fête du solstice',
    descriptionFr: 'Fête marquant le passage du soleil dans le Capricorne, célébration de la moisson.',
    descriptionEn: 'Festival marking the sun\'s transition into Capricorn, harvest celebration.',
    tradition: 'hinduism',
    date: getDateFor2026(1, 14),
    isRecurring: true,
    color: '#FF69B4',
    type: 'celebration'
  },
  {
    id: 'vasant-panchami-2026',
    name: 'Vasant Panchami',
    nameFr: 'Vasant Panchami',
    nameEn: 'Vasant Panchami',
    description: 'Fête de Saraswati',
    descriptionFr: 'Fête dédiée à Saraswati, déesse de la connaissance et des arts, célébrant le printemps.',
    descriptionEn: 'Festival dedicated to Saraswati, goddess of knowledge and arts, celebrating spring.',
    tradition: 'hinduism',
    date: getDateFor2026(2, 3),
    isRecurring: true,
    color: '#FF69B4',
    type: 'celebration'
  },
  {
    id: 'maha-shivaratri-2026',
    name: 'Maha Shivaratri',
    nameFr: 'Maha Shivaratri',
    nameEn: 'Maha Shivaratri',
    description: 'Grande nuit de Shiva',
    descriptionFr: 'La Grande Nuit de Shiva, fête majeure avec veillée nocturne et prières au Seigneur Shiva.',
    descriptionEn: 'The Great Night of Shiva, major festival with night vigil and prayers to Lord Shiva.',
    tradition: 'hinduism',
    date: getDateFor2026(2, 26),
    isRecurring: true,
    color: '#FF69B4',
    type: 'prayer'
  },
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
    id: 'ugadi-2026',
    name: 'Ugadi',
    nameFr: 'Ugadi / Gudi Padwa',
    nameEn: 'Ugadi / Gudi Padwa',
    description: 'Nouvel An hindou',
    descriptionFr: 'Nouvel An hindou célébré dans le sud de l\'Inde et au Maharashtra.',
    descriptionEn: 'Hindu New Year celebrated in South India and Maharashtra.',
    tradition: 'hinduism',
    date: getDateFor2026(3, 22),
    isRecurring: true,
    color: '#FF69B4',
    type: 'celebration'
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
    id: 'hanuman-jayanti-2026',
    name: 'Hanuman Jayanti',
    nameFr: 'Hanuman Jayanti',
    nameEn: 'Hanuman Jayanti',
    description: 'Naissance de Hanuman',
    descriptionFr: 'Célébration de la naissance de Hanuman, le dieu-singe dévoué à Rama.',
    descriptionEn: 'Celebration of the birth of Hanuman, the monkey god devoted to Rama.',
    tradition: 'hinduism',
    date: getDateFor2026(4, 4),
    isRecurring: true,
    color: '#FF69B4',
    type: 'celebration'
  },
  {
    id: 'raksha-bandhan-2026',
    name: 'Raksha Bandhan',
    nameFr: 'Raksha Bandhan',
    nameEn: 'Raksha Bandhan',
    description: 'Fête des liens fraternels',
    descriptionFr: 'Fête célébrant le lien entre frères et sœurs, où les sœurs attachent un bracelet protecteur.',
    descriptionEn: 'Festival celebrating the bond between brothers and sisters, where sisters tie a protective thread.',
    tradition: 'hinduism',
    date: getDateFor2026(8, 9),
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
    id: 'ganesh-chaturthi-2026',
    name: 'Ganesh Chaturthi',
    nameFr: 'Ganesh Chaturthi',
    nameEn: 'Ganesh Chaturthi',
    description: 'Fête de Ganesh',
    descriptionFr: 'Grande fête célébrant la naissance de Ganesh, le dieu à tête d\'éléphant, pendant 10 jours.',
    descriptionEn: 'Major festival celebrating the birth of Ganesha, the elephant-headed god, for 10 days.',
    tradition: 'hinduism',
    date: getDateFor2026(8, 27),
    isRecurring: true,
    color: '#FF69B4',
    type: 'festival'
  },
  {
    id: 'pitru-paksha-2026',
    name: 'Pitru Paksha',
    nameFr: 'Pitru Paksha',
    nameEn: 'Pitru Paksha',
    description: 'Quinzaine des ancêtres',
    descriptionFr: 'Période de 15 jours dédiée aux rituels pour les ancêtres défunts.',
    descriptionEn: '15-day period dedicated to rituals for deceased ancestors.',
    tradition: 'hinduism',
    date: getDateFor2026(9, 18),
    isRecurring: true,
    color: '#FF69B4',
    type: 'prayer'
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
    id: 'dussehra-2026',
    name: 'Dussehra',
    nameFr: 'Dussehra / Vijaya Dashami',
    nameEn: 'Dussehra / Vijaya Dashami',
    description: 'Victoire du bien sur le mal',
    descriptionFr: 'Célébration de la victoire de Rama sur Ravana et de Durga sur Mahishasura.',
    descriptionEn: 'Celebration of Rama\'s victory over Ravana and Durga\'s victory over Mahishasura.',
    tradition: 'hinduism',
    date: getDateFor2026(10, 19),
    isRecurring: true,
    color: '#FF69B4',
    type: 'celebration'
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
  {
    id: 'bhai-dooj-2026',
    name: 'Bhai Dooj',
    nameFr: 'Bhai Dooj',
    nameEn: 'Bhai Dooj',
    description: 'Fête des frères et sœurs',
    descriptionFr: 'Fête où les sœurs prient pour la longue vie de leurs frères, deux jours après Diwali.',
    descriptionEn: 'Festival where sisters pray for the long life of their brothers, two days after Diwali.',
    tradition: 'hinduism',
    date: getDateFor2026(11, 10),
    isRecurring: true,
    color: '#FF69B4',
    type: 'celebration'
  },

  // ==================== BUDDHISM (12+ events) ====================
  {
    id: 'losar-2026',
    name: 'Losar',
    nameFr: 'Losar (Nouvel An Tibétain)',
    nameEn: 'Losar (Tibetan New Year)',
    description: 'Nouvel An tibétain',
    descriptionFr: 'Losar, le Nouvel An tibétain, célébré pendant 15 jours avec danses et rituels.',
    descriptionEn: 'Losar, the Tibetan New Year, celebrated for 15 days with dances and rituals.',
    tradition: 'buddhism',
    date: getDateFor2026(2, 17),
    isRecurring: true,
    color: '#50C878',
    type: 'celebration'
  },
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
    id: 'songkran-2026',
    name: 'Songkran',
    nameFr: 'Songkran (Nouvel An Thaï)',
    nameEn: 'Songkran (Thai New Year)',
    description: 'Nouvel An thaïlandais',
    descriptionFr: 'Nouvel An bouddhiste en Thaïlande, célébré avec aspersions d\'eau et visites aux temples.',
    descriptionEn: 'Buddhist New Year in Thailand, celebrated with water splashing and temple visits.',
    tradition: 'buddhism',
    date: getDateFor2026(4, 13),
    isRecurring: true,
    color: '#50C878',
    type: 'celebration'
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
    id: 'poson-2026',
    name: 'Poson Poya',
    nameFr: 'Poson Poya',
    nameEn: 'Poson Poya',
    description: 'Arrivée du bouddhisme au Sri Lanka',
    descriptionFr: 'Commémoration de l\'arrivée du bouddhisme au Sri Lanka par Mahinda.',
    descriptionEn: 'Commemoration of the arrival of Buddhism in Sri Lanka by Mahinda.',
    tradition: 'buddhism',
    date: getDateFor2026(6, 29),
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
    id: 'ullambana-2026',
    name: 'Ullambana',
    nameFr: 'Ullambana (Fête des Fantômes)',
    nameEn: 'Ullambana (Ghost Festival)',
    description: 'Fête des ancêtres',
    descriptionFr: 'Fête bouddhiste mahayana pour honorer les ancêtres et les esprits errants.',
    descriptionEn: 'Mahayana Buddhist festival to honor ancestors and wandering spirits.',
    tradition: 'buddhism',
    date: getDateFor2026(8, 28),
    isRecurring: true,
    color: '#50C878',
    type: 'prayer'
  },
  {
    id: 'pavarana-2026',
    name: 'Pavarana',
    nameFr: 'Pavarana (Fin de Vassa)',
    nameEn: 'Pavarana (End of Vassa)',
    description: 'Fin de la retraite des pluies',
    descriptionFr: 'Fin de Vassa, cérémonie où les moines s\'invitent mutuellement à exprimer leurs fautes.',
    descriptionEn: 'End of Vassa, ceremony where monks invite each other to express their faults.',
    tradition: 'buddhism',
    date: getDateFor2026(10, 27),
    isRecurring: true,
    color: '#50C878',
    type: 'prayer'
  },
  {
    id: 'kathina-2026',
    name: 'Kathina',
    nameFr: 'Kathina',
    nameEn: 'Kathina',
    description: 'Offrande des robes aux moines',
    descriptionFr: 'Cérémonie d\'offrande de robes aux moines après la fin de Vassa.',
    descriptionEn: 'Ceremony of offering robes to monks after the end of Vassa.',
    tradition: 'buddhism',
    date: getDateFor2026(10, 28),
    isRecurring: true,
    color: '#50C878',
    type: 'celebration'
  },
  {
    id: 'loy-krathong-2026',
    name: 'Loy Krathong',
    nameFr: 'Loy Krathong',
    nameEn: 'Loy Krathong',
    description: 'Fête des lanternes flottantes',
    descriptionFr: 'Fête thaïlandaise des lanternes flottantes pour honorer le Bouddha et demander pardon.',
    descriptionEn: 'Thai festival of floating lanterns to honor the Buddha and ask for forgiveness.',
    tradition: 'buddhism',
    date: getDateFor2026(11, 25),
    isRecurring: true,
    color: '#50C878',
    type: 'festival'
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

  // ==================== OTHER / UNESCO / International (5 events) ====================
  {
    id: 'interfaith-harmony-2026',
    name: 'World Interfaith Harmony Week',
    nameFr: 'Semaine mondiale de l\'harmonie interconfessionnelle',
    nameEn: 'World Interfaith Harmony Week',
    description: 'Semaine de dialogue interreligieux',
    descriptionFr: 'Semaine mondiale pour promouvoir l\'harmonie entre toutes les religions, proclamée par l\'ONU.',
    descriptionEn: 'World week to promote harmony among all religions, proclaimed by the UN.',
    tradition: 'other',
    date: getDateFor2026(2, 1),
    isRecurring: true,
    color: '#FFFFFF',
    type: 'celebration'
  },
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
    id: 'cultural-diversity-2026',
    name: 'World Day for Cultural Diversity',
    nameFr: 'Journée mondiale de la diversité culturelle',
    nameEn: 'World Day for Cultural Diversity',
    description: 'Dialogue et développement',
    descriptionFr: 'Journée mondiale de la diversité culturelle pour le dialogue et le développement.',
    descriptionEn: 'World Day for Cultural Diversity for Dialogue and Development.',
    tradition: 'other',
    date: getDateFor2026(5, 21),
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

// Import saints from dedicated file
import { generateSaintsEvents2026 } from './catholicSaintsData';

// Generate the full 365-day saints calendar
export const catholicSaints2026: ReligiousEvent[] = generateSaintsEvents2026();

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
