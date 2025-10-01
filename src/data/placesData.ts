import { Place } from '@/contexts/AppContext';

// Mock data for sacred places around the world
export const mockPlaces: Place[] = [
  // ========== EUROPE ==========
  
  // France
  {
    id: 'fra-1',
    name: 'Notre-Dame de Paris',
    country: 'France',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre de l\'architecture gothique française, Notre-Dame fut construite entre 1163 et 1345. Théâtre du couronnement de Napoléon en 1804, elle a survécu aux guerres et révolutions. L\'incendie de 2019 a marqué son histoire, mais la reconstruction préserve ce joyau de 850 ans, symbole de la foi et de la résilience parisienne. Ses gargouilles, rosaces et architecture sublime continuent d\'inspirer le monde entier.',
    points: 50,
    coordinates: [2.3499, 48.8530],
    imageUrl: '/src/assets/places/notre-dame.jpg'
  },
  {
    id: 'fra-2',
    name: 'Lourdes',
    country: 'France',
    type: 'Sanctuaire',
    description: 'Lieu de pèlerinage marial célèbre',
    points: 75,
    coordinates: [-0.0458, 43.0951],
    imageUrl: '/src/assets/places/lourdes.jpg'
  },
  {
    id: 'fra-3',
    name: 'Mont Saint-Michel',
    country: 'France',
    type: 'Abbaye',
    description: 'Abbaye médiévale spectaculaire sur un îlot rocheux',
    points: 80,
    coordinates: [-1.5114, 48.6361],
    imageUrl: '/src/assets/places/mont-saint-michel.jpg'
  },
  {
    id: 'fra-4',
    name: 'Cathédrale de Chartres',
    country: 'France',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre de l\'architecture gothique',
    points: 60,
    coordinates: [1.4879, 48.4472]
  },
  {
    id: 'fra-5',
    name: 'Basilique du Sacré-Cœur',
    country: 'France',
    type: 'Basilique',
    description: 'Basilique romano-byzantine dominant Paris',
    points: 55,
    coordinates: [2.3431, 48.8867]
  },
  {
    id: 'fra-6',
    name: 'Cathédrale de Reims',
    country: 'France',
    type: 'Cathédrale',
    description: 'Lieu de couronnement des rois de France',
    points: 65,
    coordinates: [4.0342, 49.2539]
  },
  
  // Italy
  {
    id: 'ita-1',
    name: 'Vatican - Basilique Saint-Pierre',
    country: 'Italy',
    type: 'Basilique',
    description: 'Édifiée sur le tombeau présumé de Saint Pierre, la basilique actuelle fut construite de 1506 à 1626, mobilisant les plus grands artistes : Bramante, Michel-Ange, Bernini. Son dôme culmine à 136m et domine Rome. Centre spirituel du catholicisme, elle accueille les grandes cérémonies papales. Chef-d\'œuvre de la Renaissance, elle symbolise la puissance et la foi de l\'Église catholique à travers les siècles.',
    points: 100,
    coordinates: [12.4534, 41.9022],
    imageUrl: '/src/assets/places/vatican.jpg'
  },
  {
    id: 'ita-2',
    name: 'Cathédrale de Milan',
    country: 'Italy',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre gothique italien',
    points: 60,
    coordinates: [9.1917, 45.4642]
  },
  {
    id: 'ita-3',
    name: 'Basilique Saint-François d\'Assise',
    country: 'Italy',
    type: 'Basilique',
    description: 'Lieu de pèlerinage franciscain',
    points: 70,
    coordinates: [12.6056, 43.0753]
  },
  {
    id: 'ita-4',
    name: 'Cathédrale de Florence',
    country: 'Italy',
    type: 'Cathédrale',
    description: 'Le Duomo avec son dôme de Brunelleschi',
    points: 75,
    coordinates: [11.2558, 43.7731]
  },
  {
    id: 'ita-5',
    name: 'Basilique Saint-Marc',
    country: 'Italy',
    type: 'Basilique',
    description: 'Joyau byzantin de Venise',
    points: 70,
    coordinates: [12.3388, 45.4343]
  },
  {
    id: 'ita-6',
    name: 'Panthéon de Rome',
    country: 'Italy',
    type: 'Temple',
    description: 'Temple romain devenu église',
    points: 65,
    coordinates: [12.4768, 41.8986]
  },
  
  // Spain
  {
    id: 'esp-1',
    name: 'Sagrada Família',
    country: 'Spain',
    type: 'Basilique',
    description: 'Vision extraordinaire d\'Antoni Gaudí débutée en 1882, cette basilique moderniste unique reste en construction depuis 140 ans. Ses façades racontent la Naissance, la Passion et la Gloire du Christ. Ses 18 tours symbolisent les apôtres, la Vierge et Jésus. Consacrée par le Pape en 2010, son achèvement est prévu vers 2026. Monument le plus visité d\'Espagne, elle fusionne foi chrétienne et génie architectural catalan.',
    points: 90,
    coordinates: [2.1744, 41.4036],
    imageUrl: '/src/assets/places/sagrada-familia.jpg'
  },
  {
    id: 'esp-2',
    name: 'Cathédrale de Saint-Jacques-de-Compostelle',
    country: 'Spain',
    type: 'Cathédrale',
    description: 'Destination finale du Chemin de Saint-Jacques',
    points: 85,
    coordinates: [-8.5448, 42.8805]
  },
  {
    id: 'esp-3',
    name: 'Mosquée-Cathédrale de Cordoue',
    country: 'Spain',
    type: 'Monument',
    description: 'Exemple unique d\'architecture mauresque et chrétienne',
    points: 95,
    coordinates: [-4.7794, 37.8789]
  },
  {
    id: 'esp-4',
    name: 'Cathédrale de Séville',
    country: 'Spain',
    type: 'Cathédrale',
    description: 'Plus grande cathédrale gothique du monde',
    points: 80,
    coordinates: [-5.9928, 37.3861]
  },
  {
    id: 'esp-5',
    name: 'Monastère de l\'Escorial',
    country: 'Spain',
    type: 'Monastère',
    description: 'Résidence royale et monastère monumental',
    points: 70,
    coordinates: [-4.1474, 40.5897]
  },
  {
    id: 'esp-6',
    name: 'Alhambra de Grenade',
    country: 'Spain',
    type: 'Palais',
    description: 'Palais et forteresse mauresque',
    points: 85,
    coordinates: [-3.5881, 37.1761]
  },
  
  // United Kingdom
  {
    id: 'uk-1',
    name: 'Cathédrale de Canterbury',
    country: 'United Kingdom',
    type: 'Cathédrale',
    description: 'Fondée en 597, Canterbury est le siège de l\'Église anglicane et primat de toute l\'Angleterre. Le meurtre de Thomas Becket en 1170 en fit un lieu de pèlerinage majeur médiéval. Architecture gothique perpendiculaire spectaculaire, vitraux remarquables et crypte romane. Couronnement spirituel de la monarchie britannique. Site du patrimoine mondial UNESCO, elle incarne 1400 ans d\'histoire chrétienne anglaise et demeure centre spirituel de 85 millions d\'anglicans worldwide.',
    points: 70,
    coordinates: [1.0831, 51.2799],
    imageUrl: '/src/assets/places/canterbury-cathedral.jpg'
  },
  {
    id: 'uk-2',
    name: 'Abbaye de Westminster',
    country: 'United Kingdom',
    type: 'Abbaye',
    description: 'Édifiée en 1065 par Édouard le Confesseur, Westminster est le théâtre des couronnements royaux britanniques depuis 1066. 39 monarques y furent couronnés. Gothique anglais exceptionnel avec ses voûtes culminant à 31m. Sépultures de 17 rois, reines, et illustres personnages (Darwin, Newton, Dickens). Le mariage du Prince William en 2011 y fut célébré. Monument national britannique par excellence, elle symbolise 1000 ans de monarchie et de pouvoir.',
    points: 75,
    coordinates: [-0.1275, 51.4995],
    imageUrl: '/src/assets/places/westminster-abbey.jpg'
  },
  {
    id: 'uk-3',
    name: 'Cathédrale de York',
    country: 'United Kingdom',
    type: 'Cathédrale',
    description: 'Une des plus grandes cathédrales gothiques d\'Europe',
    points: 65,
    coordinates: [-1.0819, 53.9620]
  },
  {
    id: 'uk-4',
    name: 'Stonehenge',
    country: 'United Kingdom',
    type: 'Site mégalithique',
    description: 'Monument préhistorique mystérieux',
    points: 80,
    coordinates: [-1.8262, 51.1789]
  },
  
  // Germany
  {
    id: 'ger-1',
    name: 'Cathédrale de Cologne',
    country: 'Germany',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre gothique allemand',
    points: 75,
    coordinates: [6.9581, 50.9413],
    imageUrl: '/src/assets/places/cologne-cathedral.jpg'
  },
  {
    id: 'ger-2',
    name: 'Église de la Frauenkirche de Dresde',
    country: 'Germany',
    type: 'Église',
    description: 'Église baroque reconstruite',
    points: 60,
    coordinates: [13.7417, 51.0519]
  },
  {
    id: 'ger-3',
    name: 'Cathédrale d\'Aix-la-Chapelle',
    country: 'Germany',
    type: 'Cathédrale',
    description: 'Première cathédrale d\'Allemagne du Nord',
    points: 70,
    coordinates: [6.0838, 50.7753]
  },
  
  // Greece
  {
    id: 'gre-1',
    name: 'Parthénon',
    country: 'Greece',
    type: 'Temple',
    description: 'Temple dédié à Athéna',
    points: 100,
    coordinates: [23.7275, 37.9715],
    imageUrl: '/src/assets/places/parthenon.jpg'
  },
  {
    id: 'gre-2',
    name: 'Mont Athos',
    country: 'Greece',
    type: 'Monastères',
    description: 'Centre monastique orthodoxe',
    points: 90,
    coordinates: [24.3265, 40.1572]
  },
  {
    id: 'gre-3',
    name: 'Delphes',
    country: 'Greece',
    type: 'Site sacré',
    description: 'Sanctuaire de l\'Oracle de Delphes',
    points: 85,
    coordinates: [22.5011, 38.4824]
  },
  
  // Russia
  {
    id: 'rus-1',
    name: 'Cathédrale Saint-Basile',
    country: 'Russia',
    type: 'Cathédrale',
    description: 'Cathédrale emblématique de Moscou',
    points: 80,
    coordinates: [37.6231, 55.7525]
  },
  {
    id: 'rus-2',
    name: 'Monastère de la Trinité-Saint-Serge',
    country: 'Russia',
    type: 'Monastère',
    description: 'Plus important monastère orthodoxe russe',
    points: 75,
    coordinates: [38.1318, 56.3119]
  },
  
  // Poland
  {
    id: 'pol-1',
    name: 'Sanctuaire de Jasna Góra',
    country: 'Poland',
    type: 'Sanctuaire',
    description: 'Lieu de pèlerinage marial polonais',
    points: 70,
    coordinates: [19.0929, 50.8071]
  },
  {
    id: 'pol-2',
    name: 'Cathédrale du Wawel',
    country: 'Poland',
    type: 'Cathédrale',
    description: 'Cathédrale de couronnement des rois',
    points: 65,
    coordinates: [19.9352, 50.0544]
  },
  
  // Portugal
  {
    id: 'por-1',
    name: 'Sanctuaire de Fátima',
    country: 'Portugal',
    type: 'Sanctuaire',
    description: 'Lieu d\'apparitions mariales',
    points: 80,
    coordinates: [-8.6723, 39.6295]
  },
  {
    id: 'por-2',
    name: 'Monastère des Hiéronymites',
    country: 'Portugal',
    type: 'Monastère',
    description: 'Chef-d\'œuvre manuélin à Lisbonne',
    points: 70,
    coordinates: [-9.2061, 38.6979]
  },
  
  // ========== MIDDLE EAST & NORTH AFRICA ==========
  
  // Israel
  {
    id: 'isr-1',
    name: 'Mur des Lamentations',
    country: 'Israel',
    type: 'Site sacré',
    description: 'Lieu de prière le plus sacré du judaïsme',
    points: 100,
    coordinates: [35.2345, 31.7767],
    imageUrl: '/src/assets/places/western-wall.jpg'
  },
  {
    id: 'isr-2',
    name: 'Basilique du Saint-Sépulcre',
    country: 'Israel',
    type: 'Basilique',
    description: 'Lieu traditionnel de la crucifixion et résurrection du Christ',
    points: 100,
    coordinates: [35.2294, 31.7784]
  },
  {
    id: 'isr-3',
    name: 'Dôme du Rocher',
    country: 'Israel',
    type: 'Mosquée',
    description: 'Monument emblématique de Jérusalem',
    points: 100,
    coordinates: [35.2352, 31.7780]
  },
  {
    id: 'isr-4',
    name: 'Église de la Nativité',
    country: 'Israel',
    type: 'Église',
    description: 'Lieu de naissance de Jésus à Bethléem',
    points: 95,
    coordinates: [35.2078, 31.7044]
  },
  {
    id: 'isr-5',
    name: 'Basilique de l\'Annonciation',
    country: 'Israel',
    type: 'Basilique',
    description: 'Lieu de l\'Annonciation à Nazareth',
    points: 85,
    coordinates: [35.2983, 32.7018]
  },
  
  // Saudi Arabia
  {
    id: 'sau-1',
    name: 'La Mecque - Masjid al-Haram',
    country: 'Saudi Arabia',
    type: 'Mosquée',
    description: 'Lieu le plus sacré de l\'Islam, La Mecque abrite la Kaaba, cube noir vers lequel 1,8 milliard de musulmans prient 5 fois par jour. Construite selon la tradition par Abraham et Ismaël, elle fut purifiée par Mohammed en 630. Le Hajj (pèlerinage) est le 5ème pilier de l\'Islam, obligatoire une fois dans sa vie. 2-3 millions de fidèles s\'y rassemblent annuellement. Interdite aux non-musulmans, elle est le cœur spirituel absolu de l\'Oumma islamique mondiale.',
    points: 150,
    coordinates: [39.8262, 21.4225],
    imageUrl: '/src/assets/places/mecca-kaaba.jpg'
  },
  {
    id: 'sau-2',
    name: 'Médine - Mosquée du Prophète',
    country: 'Saudi Arabia',
    type: 'Mosquée',
    description: 'Deuxième lieu saint de l\'Islam après La Mecque, Médine accueille la Mosquée du Prophète construite en 622. Mohammed y vécut, y pria et y fut enterré sous le dôme vert emblématique. Lieu d\'exil (Hégire) marquant le début du calendrier islamique. La mosquée peut accueillir 1 million de fidèles. Ville interdite aux non-musulmans, lieu de paix et de méditation. Visiter Médine après La Mecque est un honneur pour tout musulman pieux.',
    points: 120,
    coordinates: [39.6111, 24.4672],
    imageUrl: '/src/assets/places/medina-mosque.jpg'
  },
  
  // Egypt
  {
    id: 'egy-1',
    name: 'Pyramides de Gizeh',
    country: 'Egypt',
    type: 'Monument',
    description: 'Érigées il y a 4500 ans sous l\'Ancien Empire égyptien, ces tombeaux monumentaux de Khéops, Khéphren et Mykérinos défient le temps. La Grande Pyramide de Khéops, haute de 146m avec 2,3 millions de blocs, fut la plus haute structure humaine pendant 3800 ans. Gardée par le Sphinx, seule Merveille du monde antique encore debout, elles incarnent la puissance des pharaons et leurs croyances en l\'éternité.',
    points: 120,
    coordinates: [31.1342, 29.9792],
    imageUrl: '/src/assets/places/pyramids-giza.jpg'
  },
  {
    id: 'egy-2',
    name: 'Mosquée Al-Azhar',
    country: 'Egypt',
    type: 'Mosquée',
    description: 'Centre historique de l\'enseignement islamique',
    points: 90,
    coordinates: [31.2629, 30.0456]
  },
  {
    id: 'egy-3',
    name: 'Temple de Karnak',
    country: 'Egypt',
    type: 'Temple',
    description: 'Vaste complexe de temples antiques',
    points: 95,
    coordinates: [32.6573, 25.7188]
  },
  {
    id: 'egy-4',
    name: 'Monastère Sainte-Catherine',
    country: 'Egypt',
    type: 'Monastère',
    description: 'Ancien monastère au pied du Mont Sinaï',
    points: 100,
    coordinates: [33.9756, 28.5569]
  },
  
  // Turkey
  {
    id: 'tur-1',
    name: 'Sainte-Sophie',
    country: 'Turkey',
    type: 'Mosquée',
    description: 'Chef-d\'œuvre absolu érigé en 537 sous Justinien, Sainte-Sophie fut la plus grande cathédrale chrétienne durant 900 ans. Son dôme de 56m révolutionna l\'architecture byzantine. Transformée en mosquée en 1453 après la conquête ottomane, elle fusionne traditions chrétienne et islamique. Ses mosaïques dorées byzantines et calligraphies islamiques coexistent. De 1935 à 2020 musée, redevenue mosquée, elle symbolise 1500 ans d\'histoire, de foi et de pouvoir à Istanbul.',
    points: 95,
    coordinates: [28.9802, 41.0086],
    imageUrl: '/src/assets/places/hagia-sophia.jpg'
  },
  {
    id: 'tur-2',
    name: 'Mosquée Bleue',
    country: 'Turkey',
    type: 'Mosquée',
    description: 'Chef-d\'œuvre de l\'architecture ottomane',
    points: 85,
    coordinates: [28.9769, 41.0054]
  },
  {
    id: 'tur-3',
    name: 'Éphèse - Temple d\'Artémis',
    country: 'Turkey',
    type: 'Ruines',
    description: 'Une des Sept Merveilles du monde antique',
    points: 90,
    coordinates: [27.3637, 37.9495]
  },
  
  // Morocco
  {
    id: 'mor-1',
    name: 'Mosquée Hassan II',
    country: 'Morocco',
    type: 'Mosquée',
    description: 'Une des plus grandes mosquées du monde',
    points: 80,
    coordinates: [-7.6323, 33.6084]
  },
  {
    id: 'mor-2',
    name: 'Médersa Ben Youssef',
    country: 'Morocco',
    type: 'École coranique',
    description: 'Plus grande médersa du Maroc',
    points: 65,
    coordinates: [-7.9847, 31.6315]
  },
  
  // ========== ASIA ==========
  
  // India
  {
    id: 'ind-1',
    name: 'Taj Mahal',
    country: 'India',
    type: 'Mausolée',
    description: 'Poème d\'amour en marbre blanc édifié de 1631 à 1653 par l\'empereur moghol Shah Jahan pour son épouse Mumtaz Mahal. 20 000 artisans créèrent ce chef-d\'œuvre incrusté de pierres précieuses. Symbole de l\'amour éternel et de l\'architecture moghole, inscrit au patrimoine mondial UNESCO, il attire 8 millions de visiteurs par an. Ses jardins persans et sa symétrie parfaite reflètent la vision du paradis selon l\'Islam.',
    points: 100,
    coordinates: [78.0421, 27.1751],
    imageUrl: '/src/assets/places/taj-mahal.jpg'
  },
  {
    id: 'ind-2',
    name: 'Temple d\'Or d\'Amritsar',
    country: 'India',
    type: 'Temple',
    description: 'Lieu le plus sacré du sikhisme',
    points: 90,
    coordinates: [74.8765, 31.6200],
    imageUrl: '/src/assets/places/golden-temple.jpg'
  },
  {
    id: 'ind-3',
    name: 'Varanasi - Ghats du Gange',
    country: 'India',
    type: 'Site sacré',
    description: 'Ville la plus sainte de l\'hindouisme, Varanasi (Bénarès) a 3000 ans d\'histoire spirituelle continue. Ses 88 ghats (escaliers) mènent au Gange sacré où hindous se baignent pour purifier leur âme et karma. Mourir à Varanasi libère du cycle des réincarnations (moksha). Chaque jour, des milliers de pèlerins prient, se baignent et accomplissent des rituels. Les crémations publiques au Manikarnika Ghat incarnent le cycle vie-mort-renaissance central à l\'hindouisme. Cœur spirituel éternel de l\'Inde.',
    points: 110,
    coordinates: [83.0047, 25.3176],
    imageUrl: '/src/assets/places/varanasi-ghats.jpg'
  },
  {
    id: 'ind-4',
    name: 'Temple de Meenakshi',
    country: 'India',
    type: 'Temple',
    description: 'Temple hindou spectaculaire à Madurai',
    points: 85,
    coordinates: [78.1194, 9.9195]
  },
  {
    id: 'ind-5',
    name: 'Grottes d\'Ajanta',
    country: 'India',
    type: 'Site bouddhiste',
    description: 'Grottes ornées de peintures bouddhistes',
    points: 80,
    coordinates: [75.7033, 20.5519]
  },
  {
    id: 'ind-6',
    name: 'Temple d\'Akshardham',
    country: 'India',
    type: 'Temple',
    description: 'Complexe de temple hindou moderne',
    points: 75,
    coordinates: [77.2773, 28.6127]
  },
  
  // Nepal
  {
    id: 'nep-1',
    name: 'Lumbini',
    country: 'Nepal',
    type: 'Site sacré',
    description: 'Lieu de naissance du Bouddha',
    points: 120,
    coordinates: [83.2760, 27.4833]
  },
  {
    id: 'nep-2',
    name: 'Stupa de Bodnath',
    country: 'Nepal',
    type: 'Stupa',
    description: 'Un des plus grands stupas bouddhistes',
    points: 80,
    coordinates: [85.3619, 27.7215]
  },
  {
    id: 'nep-3',
    name: 'Temple de Pashupatinath',
    country: 'Nepal',
    type: 'Temple',
    description: 'Temple hindou sacré dédié à Shiva',
    points: 85,
    coordinates: [85.3486, 27.7106]
  },
  
  // China
  {
    id: 'chi-1',
    name: 'Temple du Ciel',
    country: 'China',
    type: 'Temple',
    description: 'Complexe de temples taoïstes à Pékin',
    points: 90,
    coordinates: [116.4075, 39.8821]
  },
  {
    id: 'chi-2',
    name: 'Monastère de Shaolin',
    country: 'China',
    type: 'Monastère',
    description: 'Berceau du kung-fu Shaolin',
    points: 95,
    coordinates: [113.0356, 34.5086]
  },
  {
    id: 'chi-3',
    name: 'Grottes de Longmen',
    country: 'China',
    type: 'Grottes bouddhistes',
    description: 'Milliers de statues de Bouddha sculptées',
    points: 85,
    coordinates: [112.4747, 34.5552]
  },
  {
    id: 'chi-4',
    name: 'Grand Bouddha de Leshan',
    country: 'China',
    type: 'Statue',
    description: 'Plus grande statue de Bouddha en pierre',
    points: 90,
    coordinates: [103.7677, 29.5454]
  },
  
  // Tibet
  {
    id: 'tib-1',
    name: 'Palais du Potala',
    country: 'Tibet',
    type: 'Palais',
    description: 'Ancien palais du Dalaï Lama à Lhassa',
    points: 110,
    coordinates: [91.1170, 29.6558]
  },
  {
    id: 'tib-2',
    name: 'Monastère de Jokhang',
    country: 'Tibet',
    type: 'Monastère',
    description: 'Temple le plus sacré du bouddhisme tibétain',
    points: 105,
    coordinates: [91.1315, 29.6525]
  },
  
  // Thailand
  {
    id: 'tha-1',
    name: 'Wat Phra Kaew',
    country: 'Thailand',
    type: 'Temple',
    description: 'Temple du Bouddha d\'Émeraude à Bangkok',
    points: 80,
    coordinates: [100.4927, 13.7508]
  },
  {
    id: 'tha-2',
    name: 'Wat Arun',
    country: 'Thailand',
    type: 'Temple',
    description: 'Temple de l\'Aube à Bangkok',
    points: 70,
    coordinates: [100.4887, 13.7437]
  },
  {
    id: 'tha-3',
    name: 'Wat Pho',
    country: 'Thailand',
    type: 'Temple',
    description: 'Temple du Bouddha couché',
    points: 75,
    coordinates: [100.4931, 13.7465]
  },
  
  // Cambodia
  {
    id: 'cam-1',
    name: 'Angkor Wat',
    country: 'Cambodia',
    type: 'Temple',
    description: 'Plus grand monument religieux au monde',
    points: 120,
    coordinates: [103.8670, 13.4125],
    imageUrl: '/src/assets/places/angkor-wat.jpg'
  },
  {
    id: 'cam-2',
    name: 'Angkor Thom',
    country: 'Cambodia',
    type: 'Cité-temple',
    description: 'Dernière capitale de l\'Empire khmer',
    points: 100,
    coordinates: [103.8586, 13.4412]
  },
  
  // Myanmar
  {
    id: 'mya-1',
    name: 'Pagode Shwedagon',
    country: 'Myanmar',
    type: 'Pagode',
    description: 'Pagode dorée sacrée à Yangon',
    points: 95,
    coordinates: [96.1478, 16.7982]
  },
  {
    id: 'mya-2',
    name: 'Temples de Bagan',
    country: 'Myanmar',
    type: 'Site archéologique',
    description: 'Milliers de temples bouddhistes',
    points: 110,
    coordinates: [94.8582, 21.1717]
  },
  
  // Japan
  {
    id: 'jpn-1',
    name: 'Mont Fuji',
    country: 'Japan',
    type: 'Montagne sacrée',
    description: 'Volcan culminant à 3776m, le Fuji-san est la montagne la plus sacrée du Japon, vénérée depuis des millénaires par le shintoïsme et le bouddhisme. Symbole national absolu, source d\'inspiration artistique infinie (Hokusai). Des centaines de milliers de pèlerins gravissent ses pentes chaque été pour admirer le lever du soleil sacré. Patrimoine mondial UNESCO, il incarne la beauté, la spiritualité et l\'identité japonaises. Divinité féminine dans le shintoïsme, il est le pont entre terre et ciel.',
    points: 100,
    coordinates: [138.7274, 35.3606],
    imageUrl: '/src/assets/places/mount-fuji.jpg'
  },
  {
    id: 'jpn-2',
    name: 'Fushimi Inari-taisha',
    country: 'Japan',
    type: 'Sanctuaire',
    description: 'Célèbre sanctuaire shinto aux milliers de torii',
    points: 85,
    coordinates: [135.7726, 34.9671]
  },
  {
    id: 'jpn-3',
    name: 'Todai-ji',
    country: 'Japan',
    type: 'Temple',
    description: 'Temple avec le Grand Bouddha de Nara',
    points: 90,
    coordinates: [135.8397, 34.6890]
  },
  {
    id: 'jpn-4',
    name: 'Kinkaku-ji',
    country: 'Japan',
    type: 'Temple',
    description: 'Pavillon d\'Or à Kyoto',
    points: 85,
    coordinates: [135.7292, 35.0394]
  },
  {
    id: 'jpn-5',
    name: 'Itsukushima',
    country: 'Japan',
    type: 'Sanctuaire',
    description: 'Sanctuaire shinto sur l\'île de Miyajima',
    points: 90,
    coordinates: [132.3197, 34.2958]
  },
  
  // Indonesia
  {
    id: 'ind-7',
    name: 'Borobudur',
    country: 'Indonesia',
    type: 'Temple',
    description: 'Plus grand temple bouddhiste du monde',
    points: 110,
    coordinates: [110.2038, -7.6079]
  },
  {
    id: 'ind-8',
    name: 'Prambanan',
    country: 'Indonesia',
    type: 'Temple',
    description: 'Complexe de temples hindous',
    points: 95,
    coordinates: [110.4915, -7.7520]
  },
  
  // ========== NORTH AMERICA ==========
  
  // United States
  {
    id: 'usa-1',
    name: 'Cathédrale Saint-Patrick',
    country: 'United States',
    type: 'Cathédrale',
    description: 'Cathédrale néo-gothique de New York',
    points: 70,
    coordinates: [-73.9761, 40.7585]
  },
  {
    id: 'usa-2',
    name: 'Basilique du Sanctuaire National',
    country: 'United States',
    type: 'Basilique',
    description: 'Plus grande église catholique des États-Unis à Washington',
    points: 75,
    coordinates: [-77.0011, 38.9340]
  },
  {
    id: 'usa-3',
    name: 'Mission San Xavier del Bac',
    country: 'United States',
    type: 'Mission',
    description: 'Mission espagnole historique en Arizona',
    points: 60,
    coordinates: [-111.0072, 32.1062]
  },
  {
    id: 'usa-4',
    name: 'Salt Lake Temple',
    country: 'United States',
    type: 'Temple',
    description: 'Temple mormon emblématique',
    points: 65,
    coordinates: [-111.8922, 40.7704]
  },
  {
    id: 'usa-5',
    name: 'Grace Cathedral',
    country: 'United States',
    type: 'Cathédrale',
    description: 'Cathédrale épiscopale de San Francisco',
    points: 60,
    coordinates: [-122.4125, 37.7919]
  },
  
  // Mexico
  {
    id: 'mex-1',
    name: 'Basilique Notre-Dame de Guadalupe',
    country: 'Mexico',
    type: 'Basilique',
    description: 'Plus important sanctuaire marial des Amériques',
    points: 100,
    coordinates: [-99.1177, 19.4847]
  },
  {
    id: 'mex-2',
    name: 'Chichén Itzá',
    country: 'Mexico',
    type: 'Site maya',
    description: 'Cité maya majeure florissante de 600 à 1200 après J.-C., Chichén Itzá fut centre politique, économique et religieux du Yucatán. La pyramide El Castillo (Temple de Kukulcán) de 24m est un calendrier maya : 365 marches, jeux d\'ombre créant un serpent lors des équinoxes. Site astronomique avancé, terrain de jeu de balle rituel, cenote sacré pour sacrifices. Nouvelle Merveille du monde moderne, patrimoine UNESCO, elle témoigne du génie mathématique, astronomique et architectural maya.',
    points: 110,
    coordinates: [-88.5678, 20.6843],
    imageUrl: '/src/assets/places/chichen-itza.jpg'
  },
  {
    id: 'mex-3',
    name: 'Teotihuacán',
    country: 'Mexico',
    type: 'Site précolombien',
    description: 'Cité antique avec pyramides du Soleil et de la Lune',
    points: 105,
    coordinates: [-98.8438, 19.6925]
  },
  {
    id: 'mex-4',
    name: 'Cathédrale métropolitaine de Mexico',
    country: 'Mexico',
    type: 'Cathédrale',
    description: 'Plus grande cathédrale des Amériques',
    points: 80,
    coordinates: [-99.1332, 19.4342]
  },
  
  // Canada
  {
    id: 'can-1',
    name: 'Oratoire Saint-Joseph',
    country: 'Canada',
    type: 'Basilique',
    description: 'Plus grande église du Canada à Montréal',
    points: 75,
    coordinates: [-73.6169, 45.4920]
  },
  {
    id: 'can-2',
    name: 'Basilique Notre-Dame de Montréal',
    country: 'Canada',
    type: 'Basilique',
    description: 'Basilique néo-gothique spectaculaire',
    points: 70,
    coordinates: [-73.5565, 45.5045]
  },
  
  // ========== SOUTH AMERICA ==========
  
  // Brazil
  {
    id: 'bra-1',
    name: 'Christ Rédempteur',
    country: 'Brazil',
    type: 'Statue',
    description: 'Statue iconique dominant Rio de Janeiro',
    points: 100,
    coordinates: [-43.2105, -22.9519],
    imageUrl: '/src/assets/places/christ-redeemer.jpg'
  },
  {
    id: 'bra-2',
    name: 'Basilique Notre-Dame d\'Aparecida',
    country: 'Brazil',
    type: 'Basilique',
    description: 'Plus grande basilique du Brésil',
    points: 85,
    coordinates: [-45.2310, -22.8495]
  },
  {
    id: 'bra-3',
    name: 'Cathédrale de Brasília',
    country: 'Brazil',
    type: 'Cathédrale',
    description: 'Cathédrale moderniste de Niemeyer',
    points: 75,
    coordinates: [-47.8758, -15.7989]
  },
  
  // Peru
  {
    id: 'per-1',
    name: 'Machu Picchu',
    country: 'Peru',
    type: 'Site inca',
    description: 'Cité sacrée inca construite vers 1450 sous Pachacutec, perchée à 2430m d\'altitude dans les Andes péruviennes. Redécouverte en 1911 par Hiram Bingham, elle demeura cachée aux conquistadors espagnols. Ses temples du Soleil et des Trois Fenêtres, ses terrasses agricoles et son architecture astronomique témoignent du génie inca. Merveille du monde moderne et joyau du patrimoine mondial, elle attire 1,5 million de visiteurs annuels.',
    points: 120,
    coordinates: [-72.5450, -13.1631],
    imageUrl: '/src/assets/places/machu-picchu.jpg'
  },
  {
    id: 'per-2',
    name: 'Cathédrale de Cusco',
    country: 'Peru',
    type: 'Cathédrale',
    description: 'Cathédrale coloniale sur la place principale',
    points: 70,
    coordinates: [-71.9675, -13.5165]
  },
  {
    id: 'per-3',
    name: 'Monastère de Santa Catalina',
    country: 'Peru',
    type: 'Monastère',
    description: 'Cité monastique à Arequipa',
    points: 65,
    coordinates: [-71.5370, -16.3948]
  },
  
  // Colombia
  {
    id: 'col-1',
    name: 'Cathédrale de Sel de Zipaquirá',
    country: 'Colombia',
    type: 'Église',
    description: 'Église souterraine creusée dans une mine de sel',
    points: 90,
    coordinates: [-74.0047, 5.0266]
  },
  {
    id: 'col-2',
    name: 'Sanctuaire de Las Lajas',
    country: 'Colombia',
    type: 'Sanctuaire',
    description: 'Église spectaculaire dans un canyon',
    points: 85,
    coordinates: [-77.5914, 0.8139]
  },
  
  // Argentina
  {
    id: 'arg-1',
    name: 'Cathédrale métropolitaine de Buenos Aires',
    country: 'Argentina',
    type: 'Cathédrale',
    description: 'Cathédrale néo-classique principale',
    points: 65,
    coordinates: [-58.3730, -34.6076]
  },
  {
    id: 'arg-2',
    name: 'Basilique Notre-Dame de Luján',
    country: 'Argentina',
    type: 'Basilique',
    description: 'Centre de pèlerinage marial argentin',
    points: 70,
    coordinates: [-59.1167, -34.5667]
  },
  
  // ========== AFRICA ==========
  
  // Ethiopia
  {
    id: 'eth-1',
    name: 'Églises rupestres de Lalibela',
    country: 'Ethiopia',
    type: 'Églises',
    description: 'Églises monolithiques creusées dans la roche',
    points: 110,
    coordinates: [39.0417, 12.0321]
  },
  {
    id: 'eth-2',
    name: 'Axoum',
    country: 'Ethiopia',
    type: 'Site religieux',
    description: 'Ancienne capitale avec obélisques et églises',
    points: 95,
    coordinates: [38.7203, 14.1219]
  },
  
  // South Africa
  {
    id: 'saf-1',
    name: 'Cathédrale Saint-Georges',
    country: 'South Africa',
    type: 'Cathédrale',
    description: 'Cathédrale anglicane au Cap',
    points: 60,
    coordinates: [18.4193, -33.9286]
  },
  
  // ========== OCEANIA ==========
  
  // Australia
  {
    id: 'aus-1',
    name: 'Cathédrale Sainte-Marie',
    country: 'Australia',
    type: 'Cathédrale',
    description: 'Cathédrale néo-gothique de Sydney',
    points: 70,
    coordinates: [151.2131, -33.8712]
  },
  {
    id: 'aus-2',
    name: 'Uluru',
    country: 'Australia',
    type: 'Site sacré aborigène',
    description: 'Monolithe sacré des Aborigènes',
    points: 100,
    coordinates: [131.0369, -25.3444]
  },
  
  // New Zealand
  {
    id: 'nz-1',
    name: 'Cathédrale de Christchurch',
    country: 'New Zealand',
    type: 'Cathédrale',
    description: 'Cathédrale anglicane emblématique',
    points: 65,
    coordinates: [172.6366, -43.5321]
  }
];

export const getPlacesByCountry = (country: string): Place[] => {
  return mockPlaces.filter(place => place.country === country);
};

export const getPlaceById = (id: string): Place | undefined => {
  return mockPlaces.find(place => place.id === id);
};

export const getAllCountries = (): string[] => {
  return Array.from(new Set(mockPlaces.map(place => place.country))).sort();
};