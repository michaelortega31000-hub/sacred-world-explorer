import { Place } from '@/contexts/AppContext';

// Mock data for sacred places around the world
export const mockPlaces: Place[] = [
  // ========== EUROPE ==========
  
  // France
  {
    id: 'fra-1',
    name: 'Notre-Dame de Paris',
    country: 'France',
    city: 'Paris',
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
    city: 'Lourdes',
    type: 'Sanctuaire',
    description: 'Haut lieu du pèlerinage catholique mondial depuis 1858, Lourdes vit 18 apparitions de la Vierge Marie à Bernadette Soubirous. La Grotte de Massabielle et sa source miraculeuse attirent 6 millions de pèlerins annuels. Basilique du Rosaire, Basilique supérieure et Basilique souterraine accueillent processions et messes. Des milliers de guérisons rapportées, 70 reconnues officiellement comme miracles par l\'Église. Lourdes symbolise foi, espoir et guérison spirituelle, 2ème lieu de pèlerinage chrétien mondial après le Vatican.',
    points: 75,
    coordinates: [-0.0458, 43.0951],
    imageUrl: '/src/assets/places/lourdes.jpg'
  },
  {
    id: 'fra-3',
    name: 'Mont Saint-Michel',
    country: 'France',
    city: 'Mont-Saint-Michel',
    type: 'Abbaye',
    description: 'Merveille de l\'Occident érigée dès 708 après l\'apparition de l\'archange Saint-Michel à l\'évêque Aubert. Abbaye bénédictine fortifiée couronnant un îlot rocheux de 92m entouré de marées spectaculaires (14m d\'amplitude). Architecture mêlant roman, gothique et flamboyant sur 13 siècles. Lieu de pèlerinage médiéval majeur sur le chemin vers Saint-Jacques. Prison politique de 1793 à 1863. Patrimoine UNESCO, symbole de la France, elle accueille 3 millions de visiteurs annuels. Chef-d\'œuvre absolu alliant spiritualité, architecture et nature.',
    points: 80,
    coordinates: [-1.5114, 48.6361],
    imageUrl: '/src/assets/places/mont-saint-michel.jpg'
  },
  {
    id: 'fra-4',
    name: 'Cathédrale de Chartres',
    country: 'France',
    city: 'Chartres',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre absolu du gothique français (1194-1250), Chartres possède les plus beaux vitraux médiévaux au monde : 176 verrières couvrant 2600m² illuminent la nef de couleurs divines. Son labyrinthe au sol (13m) symbolise le chemin spirituel vers Jérusalem. Architecture gothique primitive parfaitement conservée, elle influença toute l\'Europe. Patrimoine UNESCO, lieu de pèlerinage marial depuis 876, elle incarne la foi médiévale, l\'art des bâtisseurs de cathédrales et la quête de lumière divine.',
    points: 60,
    coordinates: [1.4879, 48.4472],
    imageUrl: '/src/assets/places/chartres-cathedral.jpg'
  },
  {
    id: 'fra-5',
    name: 'Basilique du Sacré-Cœur',
    country: 'France',
    city: 'Paris',
    type: 'Basilique',
    description: 'Perchée au sommet de Montmartre à 130m, la basilique romano-byzantine (1875-1914) domine tout Paris. Construite après la défaite de 1870 comme symbole d\'espoir national, son dôme blanc en pierre de Château-Landon reste immaculé. Vue panoramique exceptionnelle sur Paris. Sa mosaïque du Christ en gloire de 480m² est l\'une des plus grandes au monde. Adoration perpétuelle depuis 1885, elle accueille 11 millions de visiteurs par an. Symbole spirituel et touristique parisien incontournable.',
    points: 55,
    coordinates: [2.3431, 48.8867],
    imageUrl: '/src/assets/places/sacre-coeur.jpg'
  },
  {
    id: 'fra-6',
    name: 'Cathédrale de Reims',
    country: 'France',
    city: 'Reims',
    type: 'Cathédrale',
    description: 'Cathédrale royale où 33 rois de France furent sacrés de 1027 à 1825, dont Clovis en 498. Chef-d\'œuvre gothique (1211-1275) avec 2303 statues dont le célèbre Ange au Sourire. Bombardée en 1914, restaurée grâce à la Fondation Rockefeller. Vitraux de Chagall (1974) fusionnent art médiéval et moderne. Patrimoine UNESCO, elle symbolise la monarchie sacrée française, l\'art gothique champenois et la réconciliation franco-allemande. Lieu historique et spirituel majeur de la nation.',
    points: 65,
    coordinates: [4.0342, 49.2539],
    imageUrl: '/src/assets/places/reims-cathedral.jpg'
  },
  {
    id: 'fra-7',
    name: 'Cathédrale Saint-Étienne de Toulouse',
    country: 'France',
    city: 'Toulouse',
    type: 'Cathédrale',
    description: 'Cathédrale unique par son architecture composite mêlant roman méridional (XIe) et gothique rayonnant (XIIIe-XVIIe). Édifice inachevé à l\'histoire mouvementée, elle présente une nef romane en brique toulousaine et un chœur gothique monumental dévié de 11°. Siège épiscopal de Toulouse depuis le Ve siècle, elle témoigne de l\'évolution architecturale sur 900 ans. Ses dimensions impressionnantes (90m de long, voûtes à 28m) et sa rose du transept nord font d\'elle un chef-d\'œuvre méconnu du Midi. Lieu spirituel majeur de l\'Occitanie.',
    points: 55,
    coordinates: [1.4492, 43.6005],
    imageUrl: '/src/assets/places/toulouse-st-etienne.jpg'
  },
  {
    id: 'fra-8',
    name: 'Basilique Saint-Sernin de Toulouse',
    country: 'France',
    city: 'Toulouse',
    type: 'Basilique',
    description: 'Plus grande église romane conservée d\'Europe (1080-1120), Saint-Sernin est joyau de l\'art roman méridional sur le chemin de Saint-Jacques-de-Compostelle. Son clocher octogonal en brique (64m, 5 étages) domine Toulouse. Construite pour accueillir pèlerins, elle abrite reliques de 128 saints dont Saint Sernin, premier évêque de Toulouse martyrisé vers 250. Architecture en croix latine avec 260 chapiteaux sculptés, crypte unique en France. Patrimoine UNESCO, elle symbolise architecture romane languedocienne, pèlerinage médiéval et rayonnement spirituel toulousain.',
    points: 60,
    coordinates: [1.4418, 43.6084],
    imageUrl: '/src/assets/places/toulouse-st-sernin.jpg'
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
    description: 'Le Duomo de Milan, débuté en 1386, prit 6 siècles à compléter. Troisième plus grande église du monde, joyau gothique italien unique avec ses 3400 statues, 135 flèches et sa façade en marbre rose de Candoglia. Son toit accessible offre vue spectaculaire et proximité avec les sculptures. La statue dorée de la Madonnina (4m, 1774) culmine à 108m. Cœur spirituel et culturel milanais, elle fusionne gothique flamboyant et Renaissance italienne. 40 000 personnes peuvent s\'y rassembler.',
    points: 60,
    coordinates: [9.1917, 45.4642],
    imageUrl: '/src/assets/places/milan-cathedral.jpg'
  },
  {
    id: 'ita-3',
    name: 'Basilique Saint-François d\'Assise',
    country: 'Italy',
    type: 'Basilique',
    description: 'Érigée dès 1228, deux ans après la mort de Saint François (1182-1226), fondateur de l\'ordre franciscain et saint patron de l\'Italie. Basilique supérieure et inférieure ornées des fresques révolutionnaires de Giotto (1290s) narrant la vie de François. Architecture gothique italienne sobre reflétant l\'idéal de pauvreté franciscaine. Tombeau de Saint François dans la crypte. Patrimoine UNESCO, centre spirituel franciscain mondial attirant 5 millions de pèlerins annuels. Symbole de paix, humilité et amour de la nature.',
    points: 70,
    coordinates: [12.6056, 43.0753],
    imageUrl: '/src/assets/places/assisi-basilica.jpg'
  },
  {
    id: 'ita-4',
    name: 'Cathédrale de Florence',
    country: 'Italy',
    type: 'Cathédrale',
    description: 'Santa Maria del Fiore (1296-1436) est couronnée du dôme révolutionnaire de Brunelleschi (1420-1436), chef-d\'œuvre de l\'ingénierie Renaissance : 45m de diamètre, 116m de haut, 37 000 tonnes sans échafaudage central. Sa coupole à double coque préfigure l\'architecture moderne. Façade polychrome en marbres blanc, vert et rose. Le campanile de Giotto (82m) et le Baptistère aux portes du Paradis complètent l\'ensemble. Symbole de Florence, elle incarne le génie de la Renaissance italienne.',
    points: 75,
    coordinates: [11.2558, 43.7731],
    imageUrl: '/src/assets/places/florence-duomo.jpg'
  },
  {
    id: 'ita-5',
    name: 'Basilique Saint-Marc',
    country: 'Italy',
    type: 'Basilique',
    description: 'Chef-d\'œuvre byzantin vénitien (828-1094) abritant les reliques de Saint Marc l\'Évangéliste, patron de Venise. Façade ornée de 500 colonnes de marbre et mosaïques dorées couvrant 8000m². Architecture fusion d\'influences byzantines, islamiques et gothiques reflétant l\'empire commercial vénitien. Quatre chevaux de bronze pillés de Constantinople en 1204. Symbole de la puissance et richesse de la Sérénissime République. Cathédrale du Patriarcat de Venise depuis 1807.',
    points: 70,
    coordinates: [12.3388, 45.4343],
    imageUrl: '/src/assets/places/st-marks-venice.jpg'
  },
  {
    id: 'ita-6',
    name: 'Panthéon de Rome',
    country: 'Italy',
    type: 'Temple',
    description: 'Temple romain (126 après J.-C.) dédié à tous les dieux, construit sous l\'empereur Hadrien. Son dôme de 43m fut la plus grande coupole non armée du monde pendant 1300 ans. L\'oculus de 9m au sommet illumine l\'intérieur et crée effets atmosphériques spectaculaires. Converti en église chrétienne Santa Maria ad Martyres en 609, sauvant ainsi le monument. Tombeaux de Raphaël et rois d\'Italie. Chef-d\'œuvre d\'ingénierie romaine inspirant architectes depuis 2000 ans, dont Michel-Ange et Brunelleschi.',
    points: 65,
    coordinates: [12.4768, 41.8986],
    imageUrl: '/src/assets/places/pantheon-rome.jpg'
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
    description: 'Destination finale du Chemin de Saint-Jacques, l\'un des 3 plus grands pèlerinages chrétiens avec Rome et Jérusalem. Construite au XIe siècle sur le tombeau présumé de l\'apôtre Jacques, elle accueille 300 000 pèlerins par an venus de toute l\'Europe. Architecture romane et baroque spectaculaire avec sa façade de l\'Obradoiro. Le botafumeiro, encensoir géant de 80kg, se balance lors des cérémonies. Patrimoine UNESCO, cœur spirituel de la Galice et d\'une tradition millénaire de foi et de marche.',
    points: 85,
    coordinates: [-8.5448, 42.8805],
    imageUrl: '/src/assets/places/santiago-compostela.jpg'
  },
  {
    id: 'esp-3',
    name: 'Mosquée-Cathédrale de Cordoue',
    country: 'Spain',
    type: 'Monument',
    description: 'La Mezquita de Cordoue (785-987) est un joyau unique fusionnant architecture islamique et chrétienne. 856 colonnes créent une forêt d\'arcs bicolores rouges et blancs hypnotiques, chef-d\'œuvre omeyyade. En 1236, après la Reconquista, une cathédrale Renaissance fut insérée au centre sans détruire la mosquée. Ce palimpseste architectural raconte 1200 ans d\'histoire andalouse, de coexistence et tensions entre Islam et Christianisme. Patrimoine UNESCO, elle symbolise Al-Andalus, âge d\'or culturel et scientifique de l\'Espagne médiévale.',
    points: 95,
    coordinates: [-4.7794, 37.8789],
    imageUrl: '/src/assets/places/cordoba-mosque.jpg'
  },
  {
    id: 'esp-4',
    name: 'Cathédrale de Séville',
    country: 'Spain',
    type: 'Cathédrale',
    description: 'Plus grande cathédrale gothique du monde (1402-1506) construite sur l\'ancienne mosquée almohade. 126m de long, 5 nefs, 80 chapelles. La Giralda, ancien minaret (97m) devenu clocher, est symbole de Séville. Tombeaux de Christophe Colomb et Ferdinand III. Son retable baroque (20m) est le plus grand au monde. Patrimoine UNESCO, elle témoigne de la Reconquista, la richesse coloniale espagnole et la fusion architecturale chrétienne-mauresque. "Construisons une église si grande que l\'on nous croira fous".',
    points: 80,
    coordinates: [-5.9928, 37.3861],
    imageUrl: '/src/assets/places/seville-cathedral.jpg'
  },
  {
    id: 'esp-5',
    name: 'Monastère de l\'Escorial',
    country: 'Spain',
    type: 'Monastère',
    description: 'Palais-monastère-panthéon royal (1563-1584) construit par Philippe II, l\'Escorial près de Madrid est complexe Renaissance austère abritant monastère hiéronymite, bibliothèque de 40 000 livres, basilique et crypte des rois d\'Espagne. Architecture sobre de Juan de Herrera influença le style "herreriano". Patrimoine UNESCO, il symbolise contre-réforme catholique, puissance de l\'Empire espagnol sous les Habsbourg et centralisme monarchique. Musée abritant œuvres du Greco, Vélasquez, Titien.',
    points: 70,
    coordinates: [-4.1474, 40.5897],
    imageUrl: '/src/assets/places/escorial.jpg'
  },
  {
    id: 'esp-6',
    name: 'Alhambra de Grenade',
    country: 'Spain',
    type: 'Palais',
    description: 'Palais-forteresse mauresque (XIIIe-XIVe) couronnant Grenade, chef-d\'œuvre absolu de l\'architecture islamique andalouse. Palais Nasrides aux stucs ciselés, calligraphies coraniques, jardins du Généralife, Cour des Lions avec ses 124 colonnes. Eau omniprésente symbole du paradis. Dernier bastion musulman d\'Espagne jusqu\'en 1492. Patrimoine UNESCO, elle incarne l\'âge d\'or d\'Al-Andalus : science, art, tolérance. 3 millions de visiteurs annuels. "Dale limosna mujer, que no hay en la vida nada, como la pena de ser ciego en Granada".',
    points: 85,
    coordinates: [-3.5881, 37.1761],
    imageUrl: '/src/assets/places/alhambra.jpg'
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
    description: 'Plus grande cathédrale médiévale gothique d\'Europe du Nord (1220-1472), York Minster abrite 128 vitraux médiévaux dont la fameuse Rose Window (1420, 11m de diamètre). Ses fondations romaines, saxonnes et normandes racontent 2000 ans d\'histoire. Crypte romane du XIe siècle. Les Two Towers (60m) dominent la ville fortifiée. Siège de l\'Archevêque d\'York depuis 314. Incendiée en 1984 (foudre), restaurée miraculeusement. Elle symbolise la chrétienté anglaise médiévale et la puissance de York.',
    points: 65,
    coordinates: [-1.0819, 53.9620],
    imageUrl: '/src/assets/places/york-minster.jpg'
  },
  {
    id: 'uk-4',
    name: 'Stonehenge',
    country: 'United Kingdom',
    type: 'Site mégalithique',
    description: 'Monument préhistorique énigmatique érigé entre 3000 et 2000 avant J.-C., Stonehenge est un cercle de pierres massives (jusqu\'à 25 tonnes) dont le but exact reste mystérieux : observatoire astronomique, temple solaire, site funéraire, lieu de guérison ? Aligné sur les solstices, il témoigne de connaissances astronomiques avancées néolithiques. Les pierres bleues furent transportées sur 250km depuis le Pays de Galles. Site du patrimoine UNESCO, il fascine archéologues et visiteurs par son mystère millénaire.',
    points: 80,
    coordinates: [-1.8262, 51.1789],
    imageUrl: '/src/assets/places/stonehenge.jpg'
  },
  
  // Germany
  {
    id: 'ger-1',
    name: 'Cathédrale de Cologne',
    country: 'Germany',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre gothique germanique (1248-1880), la cathédrale de Cologne avec ses flèches jumelles culminant à 157m fut le plus haut édifice du monde de 1880 à 1884. Elle abrite les reliques des Rois Mages dans un reliquaire d\'or. Miraculeusement épargnée malgré 14 bombes en 1944, elle symbolise la résilience allemande. Patrimoine UNESCO, 6 millions de visiteurs annuels. Ses vitraux modernes de Gerhard Richter (2007) fusionnent art médiéval et contemporain. Monument national allemand par excellence.',
    points: 75,
    coordinates: [6.9581, 50.9413],
    imageUrl: '/src/assets/places/cologne-cathedral.jpg'
  },
  {
    id: 'ger-2',
    name: 'Église de la Frauenkirche de Dresde',
    country: 'Germany',
    type: 'Église',
    description: 'Chef-d\'œuvre baroque luthérien (1743), la Frauenkirche de Dresde avec son dôme "cloche de pierre" fut détruite lors du bombardement de 1945. Ses ruines restèrent 50 ans comme mémorial. Reconstruite pierre par pierre (1994-2005) grâce à une mobilisation mondiale, utilisant pierres originales noircies. Symbole puissant de réconciliation, paix et renaissance après guerre. Elle incarne la mémoire, pardon et résilience allemande post-WWII.',
    points: 60,
    coordinates: [13.7417, 51.0519],
    imageUrl: '/src/assets/places/frauenkirche-dresden.jpg'
  },
  {
    id: 'ger-3',
    name: 'Cathédrale d\'Aix-la-Chapelle',
    country: 'Germany',
    type: 'Cathédrale',
    description: 'Plus ancienne cathédrale d\'Europe du Nord (796), la Chapelle Palatine de Charlemagne à Aix-la-Chapelle vit couronnement de 30 rois germaniques. Architecture carolingienne octogonale inspirée de Byzance. Trône de Charlemagne, reliquaire contenant reliques de Charlemagne canonisé. Patrimoine UNESCO, première inscrite en Allemagne (1978). Elle symbolise l\'empire carolingien, naissance du Saint-Empire et unité européenne médiévale.',
    points: 70,
    coordinates: [6.0838, 50.7753],
    imageUrl: '/src/assets/places/aachen-cathedral.jpg'
  },
  
  // Greece
  {
    id: 'gre-1',
    name: 'Parthénon',
    country: 'Greece',
    type: 'Temple',
    description: 'Temple emblématique de la démocratie athénienne (447-432 av. J.-C.), le Parthénon couronne l\'Acropole d\'Athènes. Dédié à Athéna Parthénos, chef-d\'œuvre de l\'architecture dorique avec 46 colonnes de marbre pentélique. Sculpture de Phidias : la statue chryséléphantine d\'Athéna (12m) disparue. Trésor de la cité, il symbolise l\'apogée de la Grèce classique, la beauté, la démocratie et la civilisation occidentale. Patrimoine UNESCO, icône mondiale de la culture antique et de l\'hellénisme.',
    points: 100,
    coordinates: [23.7275, 37.9715],
    imageUrl: '/src/assets/places/parthenon.jpg'
  },
  {
    id: 'gre-2',
    name: 'Mont Athos',
    country: 'Greece',
    type: 'Monastères',
    description: 'République monastique autonome orthodoxe depuis 1054, l\'Athos héberge 20 monastères et 2000 moines sur péninsule de 336km². Accès interdit aux femmes depuis 1045. Centre spirituel majeur de l\'orthodoxie avec manuscrits précieux, icônes et fresques byzantines. Patrimoine UNESCO, sanctuaire intemporel où le temps s\'est arrêté au Moyen Âge. Visa spécial requis, 120 visiteurs/jour maximum. Montagne sacrée culminant à 2033m, jardin de la Vierge Marie.',
    points: 90,
    coordinates: [24.3265, 40.1572],
    imageUrl: '/src/assets/places/mount-athos.jpg'
  },
  {
    id: 'gre-3',
    name: 'Delphes',
    country: 'Greece',
    type: 'Site sacré',
    description: 'Centre du monde grec antique (VIIIe siècle av. J.-C.), Delphes abritait l\'Oracle d\'Apollon, la Pythie, prophétesse consultée par rois et citoyens. Temple d\'Apollon, Trésor des Athéniens, théâtre de 5000 places sur les pentes du Mont Parnasse. Jeux Pythiques rivalisaient avec Olympie. "Connais-toi toi-même" gravé au temple. Patrimoine UNESCO, site archéologique spectaculaire incarnant la spiritualité, sagesse et mystère de la Grèce antique.',
    points: 85,
    coordinates: [22.5011, 38.4824],
    imageUrl: '/src/assets/places/delphi.jpg'
  },
  
  // Russia
  {
    id: 'rus-1',
    name: 'Cathédrale Saint-Basile',
    country: 'Russia',
    type: 'Cathédrale',
    description: 'Icône de Moscou et de la Russie, Saint-Basile (1555-1561) fut commandée par Ivan le Terrible pour célébrer la conquête de Kazan. Ses 9 coupoles bulbeuses colorées uniques créent silhouette féerique sur la Place Rouge. Architecture traditionnelle russe fusionnée d\'influences byzantines et tatares. Légende veut qu\'Ivan ait aveuglé les architectes pour qu\'ils ne reproduisent jamais pareil chef-d\'œuvre. Musée depuis 1928, patrimoine UNESCO, symbole absolu de la Russie reconnaissable instantanément dans le monde entier.',
    points: 80,
    coordinates: [37.6231, 55.7525],
    imageUrl: '/src/assets/places/st-basils-moscow.jpg'
  },
  {
    id: 'rus-2',
    name: 'Monastère de la Trinité-Saint-Serge',
    country: 'Russia',
    type: 'Monastère',
    description: 'Plus important monastère orthodoxe russe fondé en 1345 par Saint Serge de Radonège. Forteresse spirituelle avec cathédrales aux bulbes colorés, beffroi de 88m, trésor d\'icônes et manuscrits. Résista au siège polonais de 1608-1610. Lieu de couronnement et pèlerinage des tsars. Patrimoine UNESCO, académie théologique orthodoxe. Il incarne la spiritualité russe, tradition monastique et identité nationale à travers 7 siècles.',
    points: 75,
    coordinates: [38.1318, 56.3119],
    imageUrl: '/src/assets/places/trinity-sergius.jpg'
  },
  
  // Poland
  {
    id: 'pol-1',
    name: 'Sanctuaire de Jasna Góra',
    country: 'Poland',
    type: 'Sanctuaire',
    description: 'Forteresse spirituelle de la Pologne à Częstochowa, ce monastère paulinien abrite l\'icône miraculeuse de la Vierge Noire depuis 1382. Pèlerinage national majeur avec 4-5 millions de visiteurs annuels. L\'icône attribuée à saint Luc fut couronnée Reine de Pologne en 1656. Le sanctuaire résista au siège suédois de 1655, événement fondateur de l\'identité polonaise. Patrimoine spirituel et patriotique, symbole de résistance face aux invasions et au communisme.',
    points: 70,
    coordinates: [19.0929, 50.8071],
    imageUrl: '/src/assets/places/jasna-gora.jpg'
  },
  {
    id: 'pol-2',
    name: 'Cathédrale du Wawel',
    country: 'Poland',
    type: 'Cathédrale',
    description: 'Cathédrale royale de Cracovie (1364) où furent couronnés rois et reines de Pologne pendant 5 siècles. Nécropole nationale : tombeaux de monarques, héros nationaux et Pape Jean-Paul II. Chapelle Sigismond Renaissance avec dôme doré. Cloche Sigismond de 11 tonnes. Patrimoine UNESCO sur colline du Wawel. Sanctuaire national incarnant 1000 ans d\'histoire, monarchie et catholicisme polonais.',
    points: 65,
    coordinates: [19.9352, 50.0544],
    imageUrl: '/src/assets/places/wawel-cathedral.jpg'
  },
  
  // Portugal
  {
    id: 'por-1',
    name: 'Sanctuaire de Fátima',
    country: 'Portugal',
    type: 'Sanctuaire',
    description: 'Lieu d\'apparitions mariales majeures en 1917 à trois jeunes bergers. La Vierge de Fátima délivra trois secrets prophétiques et appela à la prière du Rosaire. Le miracle du soleil du 13 octobre 1917 devant 70 000 témoins marqua l\'histoire. Aujourd\'hui 6 millions de pèlerins annuels visitent la basilique, la Capelinha des Apparitions et prient sur l\'esplanade. Troisième sanctuaire marial catholique mondial après Lourdes et Guadalupe. Symbole d\'espoir, paix et conversion.',
    points: 80,
    coordinates: [-8.6723, 39.6295],
    imageUrl: '/src/assets/places/fatima.jpg'
  },
  {
    id: 'por-2',
    name: 'Monastère des Hiéronymites',
    country: 'Portugal',
    type: 'Monastère',
    description: 'Chef-d\'œuvre manuélin à Lisbonne (1501-1601), le Mosteiro dos Jerónimos célèbre les découvertes portugaises. Architecture flamboyante mêlant gothique tardif et motifs maritimes. Commandé par Manuel Ier, financé par l\'or des épices. Tombeaux de Vasco de Gama et poète Camões. Cloître magnifique avec voûtes ciselées. Patrimoine UNESCO, il symbolise l\'Âge d\'Or portugais, les grandes découvertes et l\'expansion maritime lusitanienne.',
    points: 70,
    coordinates: [-9.2061, 38.6979],
    imageUrl: '/src/assets/places/jeronimos.jpg'
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
    description: 'Lieu le plus sacré du christianisme, la basilique du Saint-Sépulcre (335 après J.-C.) fut construite par l\'empereur Constantin sur le site présumé de la crucifixion, sépulture et résurrection du Christ. Détruite et reconstruite à travers les siècles, elle est partagée entre 6 confessions chrétiennes (catholiques, orthodoxes grecs, arméniens, coptes, syriaques, éthiopiens). Le calvaire, la pierre de l\'onction et l\'édicule du tombeau attirent des millions de pèlerins. Cœur spirituel de la Chrétienté.',
    points: 100,
    coordinates: [35.2294, 31.7784],
    imageUrl: '/src/assets/places/holy-sepulchre.jpg'
  },
  {
    id: 'isr-3',
    name: 'Dôme du Rocher',
    country: 'Israel',
    type: 'Mosquée',
    description: 'Chef-d\'œuvre de l\'architecture islamique primitive (691), le Dôme du Rocher est le 3e lieu saint de l\'Islam. Son dôme doré (20m) domine l\'Esplanade des Mosquées/Mont du Temple. Il abrite le Rocher sacré d\'où Mohammed serait monté au ciel lors du voyage nocturne (Isra et Miraj). Lieu saint aussi pour juifs (mont Moriah, sacrifice d\'Isaac) et chrétiens. Mosaïques byzantines, calligraphies coraniques. Symbole de Jérusalem, il cristallise tensions et espoirs de paix israélo-palestiniens depuis 1300 ans.',
    points: 100,
    coordinates: [35.2352, 31.7780],
    imageUrl: '/src/assets/places/dome-of-rock.jpg'
  },
  {
    id: 'isr-4',
    name: 'Église de la Nativité',
    country: 'Israel',
    type: 'Église',
    description: 'Une des plus anciennes églises chrétiennes (339), construite par Constantin sur le lieu de naissance de Jésus à Bethléem. Partagée entre catholiques, grecs-orthodoxes et arméniens. Étoile d\'argent marque l\'emplacement exact de la crèche. Porte d\'Humilité (1,2m) oblige à se pencher. Mosaïques byzantines, colonnes de Justinien. Patrimoine UNESCO en péril. Lieu saint de la Chrétienté attirant 2 millions de pèlerins. Symbole de foi, paix et espoir au cœur du conflit israélo-palestinien.',
    points: 95,
    coordinates: [35.2078, 31.7044],
    imageUrl: '/src/assets/places/nativity-church.jpg'
  },
  {
    id: 'isr-5',
    name: 'Basilique de l\'Annonciation',
    country: 'Israel',
    type: 'Basilique',
    description: 'Plus grande église du Moyen-Orient (1969) construite sur le site où l\'ange Gabriel annonça à Marie sa maternité divine. Deux niveaux : grotte de l\'Annonciation en bas, basilique moderne en haut avec dôme inversé. Mosaïques de 50 pays représentant la Vierge. Architecture audacieuse fusionnant tradition et modernité. Pèlerinage marial majeur à Nazareth, ville de l\'enfance de Jésus.',
    points: 85,
    coordinates: [35.2983, 32.7018],
    imageUrl: '/src/assets/places/annunciation-nazareth.jpg'
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
    description: 'Fondée en 970 par la dynastie fatimide, Al-Azhar est la plus ancienne université du monde encore en activité et le centre intellectuel de l\'Islam sunnite. Son nom signifie "la Resplendissante" en référence à Fatima, fille de Mohammed. Elle forme imams, juristes et théologiens depuis 1050 ans. Architecture islamique mélangeant styles fatimide, mamelouk et ottoman. Bibliothèque de 100 000 manuscrits. Autorité théologique mondiale influençant 1,8 milliard de musulmans. Patrimoine spirituel, intellectuel et culturel islamique inestimable.',
    points: 90,
    coordinates: [31.2629, 30.0456],
    imageUrl: '/src/assets/places/al-azhar-cairo.jpg'
  },
  {
    id: 'egy-3',
    name: 'Temple de Karnak',
    country: 'Egypt',
    type: 'Temple',
    description: 'Plus vaste complexe religieux de l\'Antiquité (2000 ans de construction), Karnak fut le principal temple du dieu Amon-Rê. La Grande Salle Hypostyle compte 134 colonnes géantes de 23m dont les chapiteaux pourraient contenir 100 personnes. Avenue des Sphinx (2,7km) menant à Louxor. Obélisques, statues colossales, reliefs narratifs. Chaque pharaon y ajoutait sa contribution. Patrimoine UNESCO, il témoigne de 2000 ans de religion égyptienne, du pouvoir des pharaons et du génie architectural de l\'Égypte ancienne.',
    points: 95,
    coordinates: [32.6573, 25.7188],
    imageUrl: '/src/assets/places/karnak-temple.jpg'
  },
  {
    id: 'egy-4',
    name: 'Monastère Sainte-Catherine',
    country: 'Egypt',
    type: 'Monastère',
    description: 'Plus ancien monastère chrétien en activité continue (527), Sainte-Catherine au pied du Mont Sinaï (Horeb) abrite le Buisson Ardent de Moïse. Fortifié par Justinien, il préserve manuscrits anciens, icônes byzantines, bibliothèque de 3000 codex. Mosquée dans l\'enceinte témoigne de coexistence. Patrimoine UNESCO. Lieu saint pour judaïsme, christianisme et islam. Pèlerinage vers sommet du Sinaï (2285m) où Moïse reçut les Tables de la Loi.',
    points: 100,
    coordinates: [33.9756, 28.5569],
    imageUrl: '/src/assets/places/st-catherine-sinai.jpg'
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
    description: 'La Mosquée Sultan Ahmed (1609-1616), dite Mosquée Bleue pour ses 20 000 carreaux d\'Iznik bleus ornant l\'intérieur, est le joyau de l\'architecture ottomane classique. Seule mosquée au monde avec 6 minarets (controverse avec La Mecque). Ses 260 fenêtres inondent l\'intérieur de lumière. Cascade de dômes et semi-dômes. Face à Sainte-Sophie, elles symbolisent dialogue et rivalité Islam-Christianisme. Active pour la prière, elle accueille 3,5 millions de visiteurs annuels. Icône d\'Istanbul et de la Turquie.',
    points: 85,
    coordinates: [28.9769, 41.0054],
    imageUrl: '/src/assets/places/blue-mosque.jpg'
  },
  {
    id: 'tur-3',
    name: 'Éphèse - Temple d\'Artémis',
    country: 'Turkey',
    type: 'Ruines',
    description: 'Une des Sept Merveilles du monde antique, le temple d\'Artémis (550 av. J.-C.) fut le plus grand temple grec avec 127 colonnes de 18m. Incendié par Érostrate en 356 av. J.-C. la nuit de naissance d\'Alexandre, reconstruit, puis détruit définitivement au Ve siècle. Ne subsiste qu\'une colonne reconstituée. Site archéologique d\'Éphèse révèle bibliothèque de Celsus, Grand Théâtre (25 000 places). Patrimoine UNESCO, il témoigne de la grandeur de l\'Ionie grecque et de l\'éphémère de la gloire humaine.',
    points: 90,
    coordinates: [27.3637, 37.9495],
    imageUrl: '/src/assets/places/ephesus-artemis.jpg'
  },
  
  // Morocco
  {
    id: 'mor-1',
    name: 'Mosquée Hassan II',
    country: 'Morocco',
    type: 'Mosquée',
    description: 'Une des plus grandes mosquées du monde, la Hassan II de Casablanca (1993) possède le minaret le plus haut du monde (210m) avec laser pointant vers La Mecque. Partiellement construite sur l\'océan Atlantique, elle peut accueillir 105 000 fidèles. Toit ouvrant laisse entrer lumière divine. Architecture marocaine traditionnelle avec mosaïques, marbre, cèdre sculpté. Chef-d\'œuvre moderne fusionnant tradition et technologie, elle symbolise l\'Islam marocain et l\'ouverture du royaume (rare mosquée accessible aux non-musulmans).',
    points: 80,
    coordinates: [-7.6323, 33.6084],
    imageUrl: '/src/assets/places/hassan-ii-mosque.jpg'
  },
  {
    id: 'mor-2',
    name: 'Médersa Ben Youssef',
    country: 'Morocco',
    type: 'École coranique',
    description: 'Plus grande médersa (école coranique) du Maghreb (1564-1565), Ben Youssef à Marrakech pouvait accueillir 900 étudiants. Architecture hispano-mauresque sublime : zellige polychrome, bois de cèdre sculpté, stuc ciselé, calligraphies coraniques. Cour centrale avec bassin de marbre. 130 cellules d\'étudiants. Fermée 1960, restaurée, ouverte au public 1982-2020. Chef-d\'œuvre de l\'art saadien incarnant l\'éducation islamique traditionnelle et beauté architecturale marocaine.',
    points: 65,
    coordinates: [-7.9847, 31.6315],
    imageUrl: '/src/assets/places/ben-youssef.jpg'
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
    description: 'Harmandir Sahib, le lieu le plus sacré du sikhisme, fut fondé en 1604 par le 5e Guru Arjan Dev. Temple recouvert de 750kg de feuilles d\'or au centre du bassin sacré Amrit Sarovar (Bassin de Nectar). Architecture fusionnant styles hindou et islamique symbolisant l\'ouverture sikhe. Ses 4 portes accueillent toutes les religions. Langar (cuisine communautaire) gratuit sert 100 000 repas/jour à tous sans distinction. Attaque de 1984 et massacre marquèrent l\'histoire. Symbole de paix, égalité et service désintéressé sikh.',
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
    description: 'Chef-d\'œuvre de l\'architecture dravidienne à Madurai (Tamil Nadu), le temple Meenakshi (XIVe-XVIIe) est dédié à la déesse Parvati (Meenakshi "aux yeux de poisson") et Shiva. Ses 14 gopurams (tours-portes) culminent à 50m, couverts de milliers de sculptures polychromes de dieux, déesses et animaux mythiques. Complexe de 6ha avec bassin sacré. 15 000 visiteurs quotidiens, 25 millions annuels. Vivant temple hindou où rituels millénaires perdurent. Il incarne l\'exubérance spirituelle et artistique de l\'hindouisme tamoul.',
    points: 85,
    coordinates: [78.1194, 9.9195],
    imageUrl: '/src/assets/places/meenakshi-temple.jpg'
  },
  {
    id: 'ind-5',
    name: 'Grottes d\'Ajanta',
    country: 'India',
    type: 'Site bouddhiste',
    description: 'Ensemble de 29 grottes bouddhistes creusées dans falaise basaltique entre IIe siècle av. J.-C. et Ve siècle ap. J.-C. Monastères et temples rupestres ornés de fresques et sculptures parmi les plus belles de l\'art bouddhiste ancien. Redécouvertes en 1819 après 1000 ans d\'oubli. Les peintures murales racontent vies antérieures de Bouddha (Jataka). Patrimoine UNESCO, elles témoignent de l\'apogée artistique de l\'Inde bouddhiste et influencèrent l\'art asiatique pendant des siècles.',
    points: 80,
    coordinates: [75.7033, 20.5519],
    imageUrl: '/src/assets/places/ajanta.jpg'
  },
  {
    id: 'ind-6',
    name: 'Temple d\'Akshardham',
    country: 'India',
    type: 'Temple',
    description: 'Plus grand temple hindou moderne au monde, Akshardham Delhi (2005) fut construit en 5 ans par 7000 artisans selon techniques védiques traditionnelles. Aucun acier : 20 000 tonnes de grès rose et marbre blanc sculpté. Architecture stupéfiante avec 234 piliers ciselés, 9 dômes, 20 000 statues. Jardins, fontaines musicales, expositions sur spiritualité hindoue. Record Guinness du plus grand complexe hindou complet. Il célèbre 10 000 ans de culture indienne et incarne la renaissance spirituelle hindoue moderne.',
    points: 75,
    coordinates: [77.2773, 28.6127],
    imageUrl: '/src/assets/places/akshardham.jpg'
  },
  
  // Nepal
  {
    id: 'nep-1',
    name: 'Lumbini',
    country: 'Nepal',
    type: 'Site sacré',
    description: 'Lieu de naissance de Siddhartha Gautama (Bouddha) en 563 avant J.-C., Lumbini est le site le plus sacré du bouddhisme. Le pilier d\'Ashoka (249 av. J.-C.) marque l\'emplacement exact. Temple Maya Devi sur les ruines du lieu de naissance. Jardin paisible avec monastères de toutes traditions bouddhistes. Patrimoine UNESCO, 1 million de pèlerins annuels. Il symbolise les origines du bouddhisme et son message universel de paix, compassion et éveil. Destination spirituelle primordiale pour 500 millions de bouddhistes mondiaux.',
    points: 120,
    coordinates: [83.2760, 27.4833],
    imageUrl: '/src/assets/places/lumbini-buddha.jpg'
  },
  {
    id: 'nep-2',
    name: 'Stupa de Bodnath',
    country: 'Nepal',
    type: 'Stupa',
    description: 'Plus grand stupa d\'Asie (36m de haut), Bodnath est le cœur spirituel de la communauté tibétaine en exil depuis 1959. Construit au Ve siècle, ses yeux de Bouddha peints surveillent les quatre directions. Drapeaux de prières transmettent mantras au vent. Kora (circumambulation) rituelle effectuée par milliers de pèlerins quotidiennement. Monastères tibétains environnants. Patrimoine UNESCO endommagé en 2015 (séisme), parfaitement restauré. Il symbolise le bouddhisme tibétain, la diaspora, et la préservation d\'une culture menacée.',
    points: 80,
    coordinates: [85.3619, 27.7215],
    imageUrl: '/src/assets/places/boudhanath-stupa.jpg'
  },
  {
    id: 'nep-3',
    name: 'Temple de Pashupatinath',
    country: 'Nepal',
    type: 'Temple',
    description: 'Temple hindou le plus sacré du Népal (VIe siècle), Pashupatinath est dédié à Shiva sous sa forme de Pashupati, "Seigneur des animaux". Situé sur les rives sacrées de la rivière Bagmati, il accueille pèlerins et sadhus. Architecture pagode népalaise avec toit doré. Ghats de crémation où hindous sont incinérés selon rituels ancestraux. Interdit aux non-hindous à l\'intérieur du temple principal. Patrimoine UNESCO, il incarne la foi shivaïte vivante et les traditions funéraires hindoues millénaires.',
    points: 85,
    coordinates: [85.3486, 27.7106],
    imageUrl: '/src/assets/places/pashupatinath.jpg'
  },
  
  // China
  {
    id: 'chi-1',
    name: 'Temple du Ciel',
    country: 'China',
    type: 'Temple',
    description: 'Complexe taoïste (1420) où les empereurs Ming et Qing effectuaient sacrifices annuels au Ciel pour bonnes récoltes. La Salle des Prières pour la Moisson, triple-toit circulaire bleu de 38m, est chef-d\'œuvre d\'architecture chinoise sans clous. Géométrie sacrée : cercle (Ciel) et carré (Terre). Acoustique exceptionnelle de l\'Écho Wall. Patrimoine UNESCO, parc de 273ha où Pékinois pratiquent tai-chi. Symbole de l\'harmonie entre Ciel et Terre, de la piété impériale et de la cosmologie chinoise.',
    points: 90,
    coordinates: [116.4075, 39.8821],
    imageUrl: '/src/assets/places/temple-of-heaven.jpg'
  },
  {
    id: 'chi-2',
    name: 'Monastère de Shaolin',
    country: 'China',
    type: 'Monastère',
    description: 'Berceau du kung-fu Shaolin et du bouddhisme Chan (Zen), ce monastère du Mont Song (495) vit naître les arts martiaux bouddhistes. Légende raconte que Bodhidharma y médita 9 ans face au mur. Forêt de 228 pagodes-tombes de moines. École de kung-fu forme disciples dans discipline, méditation et combat. Patrimoine UNESCO, icône de la culture martiale chinoise mondialement reconnue par le cinéma. Il incarne fusion unique de spiritualité bouddhiste et maîtrise corporelle.',
    points: 95,
    coordinates: [113.0356, 34.5086],
    imageUrl: '/src/assets/places/shaolin.jpg'
  },
  {
    id: 'chi-3',
    name: 'Grottes de Longmen',
    country: 'China',
    type: 'Grottes bouddhistes',
    description: 'Trésor d\'art bouddhiste chinois (493-1127), les grottes de Longmen comptent 110 000 statues bouddhistes, 2800 inscriptions, 43 pagodes sculptées dans falaises calcaires. Le Bouddha Vairocana (17m) commandé par l\'Impératrice Wu Zetian est chef-d\'œuvre de la dynastie Tang. Site de 1km le long de la rivière Yi. Patrimoine UNESCO, elles témoignent de l\'apogée du bouddhisme en Chine et de l\'excellence artistique impériale sur 400 ans.',
    points: 85,
    coordinates: [112.4747, 34.5552],
    imageUrl: '/src/assets/places/longmen.jpg'
  },
  {
    id: 'chi-4',
    name: 'Grand Bouddha de Leshan',
    country: 'China',
    type: 'Statue',
    description: 'Plus grande statue de Bouddha en pierre au monde (71m), sculptée dans falaise entre 713 et 803. Bouddha Maitreya assis domine confluence de trois rivières. Construit pour apaiser eaux tumultueuses dangereuses. Ses oreilles de 7m, nez de 5,6m. Système de drainage ingénieux préserve statue depuis 1200 ans. Patrimoine UNESCO, il incarne la foi bouddhiste Tang, le génie ingénierie chinoise et la protection divine. Pèlerinage et site touristique majeur du Sichuan.',
    points: 90,
    coordinates: [103.7677, 29.5454],
    imageUrl: '/src/assets/places/leshan-buddha.jpg'
  },
  
  // Tibet
  {
    id: 'tib-1',
    name: 'Palais du Potala',
    country: 'Tibet',
    type: 'Palais',
    description: 'Palais-forteresse (1645-1694) perché à 3700m d\'altitude à Lhassa, le Potala fut résidence des Dalaï-Lamas et siège du gouvernement tibétain. 13 étages, 1000 pièces, chapelles ornées d\'or et de turquoises. Architecture tibétaine unique adaptée altitude et climat extrêmes. Trésor d\'art bouddhiste : thangkas, statues, manuscrits sacrés. Abandonné en 1959 lors de l\'exil du 14e Dalaï-Lama. Patrimoine UNESCO, symbole du bouddhisme tibétain, de l\'identité tibétaine et de la quête de liberté d\'un peuple.',
    points: 110,
    coordinates: [91.1170, 29.6558],
    imageUrl: '/src/assets/places/potala-palace.jpg'
  },
  {
    id: 'tib-2',
    name: 'Monastère de Jokhang',
    country: 'Tibet',
    type: 'Monastère',
    description: 'Temple le plus sacré du bouddhisme tibétain (647), Jokhang à Lhassa abrite la statue de Jowo Shakyamuni (Bouddha à 12 ans) apportée de Chine par la Princesse Wencheng. Centre spirituel absolu du Tibet, but ultime de tout pèlerin tibétain. Kora (circumambulation) rituelle effectuée par milliers quotidiennement. Architecture tibétaine traditionnelle avec toit doré. Patrimoine UNESCO. Malgré destructions durant Révolution culturelle, il demeure cœur vivant de la foi tibétaine et symbole d\'identité culturelle menacée.',
    points: 105,
    coordinates: [91.1315, 29.6525],
    imageUrl: '/src/assets/places/jokhang.jpg'
  },
  
  // Thailand
  {
    id: 'tha-1',
    name: 'Wat Phra Kaew',
    country: 'Thailand',
    type: 'Temple',
    description: 'Temple du Bouddha d\'Émeraude (Palais Royal, 1782), sanctuaire le plus sacré de Thaïlande. La statue de jade du Bouddha d\'Émeraude (66cm) change de costumes 3 fois par an selon saisons. Architecture thaïe éblouissante : toits dorés, mosaïques colorées, fresques du Ramakien. Interdit aux moines, réservé à la famille royale et cérémonies d\'État. Aucun culte public. Patrimoine national symbolisant monarchie, bouddhisme theravada et âme thaïlandaise.',
    points: 80,
    coordinates: [100.4927, 13.7508],
    imageUrl: '/src/assets/places/wat-phra-kaew.jpg'
  },
  {
    id: 'tha-2',
    name: 'Wat Arun',
    country: 'Thailand',
    type: 'Temple',
    description: 'Temple de l\'Aube dominant la Chao Phraya, Wat Arun possède un prang khmer de 82m incrusté de millions de porcelaines chinoises. Nommé d\'après Aruna, dieu hindou de l\'aube. Construit sous Ayutthaya, agrandi sous Rama II-III. Escaliers raides symbolisent difficulté d\'atteindre l\'illumination. Vue spectaculaire au coucher du soleil. Icône de Bangkok, symbole du renouveau après la chute d\'Ayutthaya.',
    points: 70,
    coordinates: [100.4887, 13.7437],
    imageUrl: '/src/assets/places/wat-arun.jpg'
  },
  {
    id: 'tha-3',
    name: 'Wat Pho',
    country: 'Thailand',
    type: 'Temple',
    description: 'Plus ancien et plus grand temple de Bangkok (1688), Wat Pho abrite le Bouddha couché géant de 46m recouvert de feuilles d\'or. Berceau du massage thaï traditionnel depuis Rama III. Université ouverte avec inscriptions médicales gravées. 1000 images de Bouddha, 91 stupas. Patrimoine UNESCO du massage. Symbole du savoir traditionnel thaïlandais, médecine et spiritualité bouddhiste theravada.',
    points: 75,
    coordinates: [100.4931, 13.7465],
    imageUrl: '/src/assets/places/wat-pho.jpg'
  },
  
  // Cambodia
  {
    id: 'cam-1',
    name: 'Angkor Wat',
    country: 'Cambodia',
    type: 'Temple',
    description: 'Plus grand monument religieux au monde (162ha), Angkor Wat fut construit par Suryavarman II (1113-1150) dédié à Vishnu puis converti au bouddhisme. Cinq tours lotus représentent le mont Meru. Bas-reliefs de 800m narrant épopées hindoues. Orientation ouest (inhabituelle) suggère temple funéraire. Redécouvert en 1860, restauré. Patrimoine UNESCO, symbole du Cambodge sur drapeau national. Chef-d\'œuvre absolu de l\'architecture khmère et de la civilisation d\'Angkor.',
    points: 120,
    coordinates: [103.8670, 13.4125],
    imageUrl: '/src/assets/places/angkor-wat.jpg'
  },
  {
    id: 'cam-2',
    name: 'Angkor Thom',
    country: 'Cambodia',
    type: 'Cité-temple',
    description: 'Dernière capitale khmère (fin XIIe), Angkor Thom de Jayavarman VII couvre 9km². Le Bayon avec ses 216 visages de Bouddha/Avalokiteshvara souriants est son joyau. Terrasse des Éléphants, Terrasse du Roi Lépreux. Portes monumentales gardées par statues. Fusion bouddhisme mahayana et culte royal khmer. Patrimoine UNESCO témoignant de l\'apogée et déclin de l\'empire d\'Angkor.',
    points: 100,
    coordinates: [103.8586, 13.4412],
    imageUrl: '/src/assets/places/angkor-thom.jpg'
  },
  
  // Myanmar
  {
    id: 'mya-1',
    name: 'Pagode Shwedagon',
    country: 'Myanmar',
    type: 'Pagode',
    description: 'Pagode dorée la plus sacrée de Birmanie (Ve siècle av. J.-C. selon la légende), Shwedagon culmine à 99m et est recouverte de 60 tonnes de feuilles d\'or, 5000 diamants et 2000 rubis. Son sommet porte un diamant de 76 carats. Elle abriterait 8 cheveux de Bouddha. Centre spirituel birman où générations se sont rassemblées pour prière, méditation et révoltes (Révolution Safran 2007). Patrimoine spirituel national, elle domine Yangon de son éclat doré, symbolisant foi bouddhiste et identité birmane.',
    points: 95,
    coordinates: [96.1478, 16.7982],
    imageUrl: '/src/assets/places/shwedagon-pagoda.jpg'
  },
  {
    id: 'mya-2',
    name: 'Temples de Bagan',
    country: 'Myanmar',
    type: 'Site archéologique',
    description: 'Plaine miraculeuse de 2000+ temples et pagodes bouddhistes (IXe-XIIIe), capitale du Royaume de Pagan. À son apogée, 10 000 structures couvraient 104km². Temples majeurs : Ananda, Shwezigon, Dhammayangyi. Lever du soleil en montgolfière offre vue spectaculaire. Séismes réguliers endommagent monuments. Patrimoine UNESCO (2019), Bagan rivalise avec Angkor comme plus grand site archéologique bouddhiste mondial.',
    points: 110,
    coordinates: [94.8582, 21.1717],
    imageUrl: '/src/assets/places/bagan-temples.jpg'
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
    description: 'Sanctuaire shinto emblématique dédié à Inari, déesse du riz, prospérité et renards. Ses 10 000 torii vermillon offerts par donateurs créent tunnels mystiques serpentant 4km jusqu\'au sommet du mont Inari (233m). Fondé en 711, agrandi par Toyotomi Hideyoshi. Statues de renards kitsune, messagers d\'Inari. Site le plus photographié du Japon, il attire 3 millions visiteurs annuels. Il incarne la spiritualité shinto, harmonie nature-divinité, et beauté esthétique japonaise. Scènes de Mémoires d\'une Geisha.',
    points: 85,
    coordinates: [135.7726, 34.9671],
    imageUrl: '/src/assets/places/fushimi-inari.jpg'
  },
  {
    id: 'jpn-3',
    name: 'Todai-ji',
    country: 'Japan',
    type: 'Temple',
    description: 'Temple bouddhiste de Nara (752) abritant le Daibutsu, Grand Bouddha en bronze de 15m et 500 tonnes. Plus grande structure en bois au monde (57m). Fondé par l\'empereur Shōmu pour protéger le Japon. Siège de l\'école Kegon. Daims sacrés errent librement. Patrimoine UNESCO, il incarne la puissance du bouddhisme Nara et l\'unification spirituelle du Japon ancien.',
    points: 90,
    coordinates: [135.8397, 34.6890],
    imageUrl: '/src/assets/places/todaiji.jpg'
  },
  {
    id: 'jpn-4',
    name: 'Kinkaku-ji',
    country: 'Japan',
    type: 'Temple',
    description: 'Le Pavillon d\'Or (1397) est temple zen recouvert de feuilles d\'or pur se reflétant dans le miroir d\'eau du lac Kyōko-chi. Construit par le shogun Ashikaga Yoshimitsu comme villa de retraite, converti en temple à sa mort. Incendié en 1950 par un moine obsédé (roman de Mishima), reconstruit à l\'identique en 1955. Architecture harmonieuse fusionnant styles aristocratique, samouraï et zen. Jardin paysager parfait. Patrimoine UNESCO, icône de Kyoto et du Japon, il symbolise beauté éphémère, paix zen et esthétique wabi-sabi.',
    points: 85,
    coordinates: [135.7292, 35.0394],
    imageUrl: '/src/assets/places/kinkakuji.jpg'
  },
  {
    id: 'jpn-5',
    name: 'Itsukushima',
    country: 'Japan',
    type: 'Sanctuaire',
    description: 'Sanctuaire shinto (593) sur l\'île sacrée de Miyajima. Son torii flottant vermillon de 16m semble planer sur mer à marée haute. Classé Trésor National et patrimoine UNESCO. L\'île entière est sacrée, naissances et morts y sont interdites. Architecture harmonieuse avec nature. Icône du Japon, symbole de beauté éphémère et spiritualité shinto.',
    points: 90,
    coordinates: [132.3197, 34.2958],
    imageUrl: '/src/assets/places/itsukushima.jpg'
  },
  
  // Indonesia
  {
    id: 'ind-7',
    name: 'Borobudur',
    country: 'Indonesia',
    type: 'Temple',
    description: 'Plus grand monument bouddhiste au monde (IXe siècle), Borobudur est mandala architectural en trois dimensions représentant le cosmos bouddhiste. Pyramide de 9 plateformes, 504 statues de Bouddha, 2672 panneaux narratifs sculptés, 72 stupas ajourés. Pèlerinage spirituel ascendant du monde des désirs vers l\'illumination. Oublié 1000 ans sous cendres volcaniques, redécouvert en 1814. Patrimoine UNESCO, restauré par l\'UNESCO. Symbole de Java, du bouddhisme mahayana et chef-d\'œuvre architectural mondial comparable à Angkor.',
    points: 110,
    coordinates: [110.2038, -7.6079],
    imageUrl: '/src/assets/places/borobudur.jpg'
  },
  {
    id: 'ind-8',
    name: 'Prambanan',
    country: 'Indonesia',
    type: 'Temple',
    description: 'Plus grand complexe de temples hindous d\'Indonésie (IXe), Prambanan compte 240 temples dont les 3 tours principales de 47m dédiées à Trimurti (Brahma, Vishnu, Shiva). Bas-reliefs du Ramayana. Construit par dynastie Sanjaya. Séismes réguliers endommagent structures. Patrimoine UNESCO proche de Borobudur, témoignant coexistence hindouisme-bouddhisme à Java.',
    points: 95,
    coordinates: [110.4915, -7.7520],
    imageUrl: '/src/assets/places/prambanan.jpg'
  },
  
  // ========== NORTH AMERICA ==========
  
  // United States
  {
    id: 'usa-1',
    name: 'Cathédrale Saint-Patrick',
    country: 'United States',
    type: 'Cathédrale',
    description: 'Cathédrale néo-gothique (1878) de Manhattan, St. Patrick\'s est la plus grande cathédrale catholique des États-Unis avec flèches de 100m. Refuge spirituel au cœur de la 5e Avenue. 3 millions de visiteurs annuels. Messes pour immigrés irlandais puis communauté diverse. Elle symbolise la foi catholique américaine et l\'intégration immigrant.',
    points: 70,
    coordinates: [-73.9761, 40.7585],
    imageUrl: '/src/assets/places/st-patricks-nyc.jpg'
  },
  {
    id: 'usa-2',
    name: 'Basilique du Sanctuaire National',
    country: 'United States',
    type: 'Basilique',
    description: 'Plus grande église catholique d\'Amérique du Nord (1920-1961) à Washington DC, le Sanctuaire National de l\'Immaculée Conception combine styles néo-byzantin et néo-roman. 70 chapelles représentant héritages catholiques mondiaux. Mosaïques couvrant 7400m². Elle accueille 1 million visiteurs annuels. Basilique mineure depuis 1990, elle symbolise diversité catholique américaine et dévotion mariale.',
    points: 75,
    coordinates: [-77.0011, 38.9340],
    imageUrl: '/src/assets/places/national-shrine-dc.jpg'
  },
  {
    id: 'usa-3',
    name: 'Mission San Xavier del Bac',
    country: 'United States',
    type: 'Mission',
    description: 'Mission espagnole (1797) en Arizona surnommée "Colombe Blanche du Désert". Architecture baroque coloniale avec façade blanche ornée. Fondée par missionnaire jésuite Eusebio Kino en 1692 pour évangéliser Tohono O\'odham. Toujours active, elle incarne l\'héritage catholique hispanique du Sud-Ouest américain et dialogue culturel hispano-amérindien.',
    points: 60,
    coordinates: [-111.0072, 32.1062],
    imageUrl: '/src/assets/places/san-xavier-mission.jpg'
  },
  {
    id: 'usa-4',
    name: 'Salt Lake Temple',
    country: 'United States',
    type: 'Temple',
    description: 'Temple emblématique mormon à Salt Lake City (1893), construit en 40 ans en granit. Six flèches dont centrale avec statue dorée de l\'ange Moroni. Réservé aux membres pratiquants de l\'Église de Jésus-Christ des Saints des Derniers Jours pour rites sacrés (baptêmes, mariages éternels). Symbole mondial du mormonisme, de l\'Utah et de la foi des pionniers mormons.',
    points: 65,
    coordinates: [-111.8922, 40.7704],
    imageUrl: '/src/assets/places/salt-lake-temple.jpg'
  },
  {
    id: 'usa-5',
    name: 'Grace Cathedral',
    country: 'United States',
    type: 'Cathédrale',
    description: 'Cathédrale épiscopale néo-gothique (1964) sur Nob Hill à San Francisco. Deux labyrinthes (extérieur et intérieur) inspirés de Chartres pour méditation. Vitraux dont "Human Endeavor" représentant Einstein. Portes du Paradis, réplique de celles du Baptistère de Florence. Cathédrale progressiste ouverte à toutes spiritualités. Elle incarne l\'ouverture religieuse californienne et dialogue interreligieux.',
    points: 60,
    coordinates: [-122.4125, 37.7919],
    imageUrl: '/src/assets/places/grace-cathedral-sf.jpg'
  },
  
  // Mexico
  {
    id: 'mex-1',
    name: 'Basilique Notre-Dame de Guadalupe',
    country: 'Mexico',
    type: 'Basilique',
    description: 'Sanctuaire marial le plus visité au monde (20 millions/an), la basilique abrite la tilma miraculeuse de Juan Diego portant l\'image de la Vierge de Guadalupe apparue en 1531. Patronne des Amériques et du Mexique, elle symbolise le métissage culturel post-conquête espagnole. Basilique moderne (1976) et ancienne basilique coloniale coexistent. Pèlerinages massifs le 12 décembre. Elle incarne la foi catholique latino-américaine, l\'identité mexicaine et le syncrétisme religieux.',
    points: 100,
    coordinates: [-99.1177, 19.4847],
    imageUrl: '/src/assets/places/guadalupe-basilica.jpg'
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
    description: 'Cité sacrée précolombienne (100-650 après J.-C.), Teotihuacán fut la plus grande ville des Amériques avec 125 000 habitants. La Pyramide du Soleil (65m) et la Pyramide de la Lune dominent l\'Avenue des Morts (4km). Civilisation mystérieuse disparue avant les Aztèques qui la nommèrent "lieu où naissent les dieux". Patrimoine UNESCO.',
    points: 105,
    coordinates: [-98.8438, 19.6925],
    imageUrl: '/src/assets/places/teotihuacan.jpg'
  },
  {
    id: 'mex-4',
    name: 'Cathédrale métropolitaine de Mexico',
    country: 'Mexico',
    type: 'Cathédrale',
    description: 'Plus grande cathédrale des Amériques (1573-1813), bâtie sur ruines du temple aztèque Teocalli. Fusion d\'architectures baroque, néo-classique, churrigueresque sur 250 ans de construction. Clochers de 67m, 16 chapelles, retables dorés, crypte des archevêques. Elle repose sur sol instable du lac Texcoco asséché, inclinée et renforcée. Patrimoine UNESCO, cœur spirituel et historique de Mexico, elle symbolise conquête espagnole et syncrétisme hispano-aztèque.',
    points: 80,
    coordinates: [-99.1332, 19.4342],
    imageUrl: '/src/assets/places/mexico-city-cathedral.jpg'
  },
  
  // Canada
  {
    id: 'can-1',
    name: 'Oratoire Saint-Joseph',
    country: 'Canada',
    type: 'Basilique',
    description: 'Plus grande église du Canada (1924-1967) sur le Mont-Royal à Montréal, l\'Oratoire Saint-Joseph possède un dôme de 97m, troisième plus grand au monde. Fondé par Frère André (canonisé 2010), thaumaturge réputé pour guérisons miraculeuses. Escalier de 283 marches que pèlerins gravissent à genoux. 2 millions visiteurs annuels. Il incarne la foi catholique québécoise, les miracles et la piété populaire canadienne-française.',
    points: 75,
    coordinates: [-73.6169, 45.4920],
    imageUrl: '/src/assets/places/st-joseph-oratory.jpg'
  },
  {
    id: 'can-2',
    name: 'Basilique Notre-Dame de Montréal',
    country: 'Canada',
    type: 'Basilique',
    description: 'Chef-d\'œuvre néo-gothique (1829) au Vieux-Montréal, célèbre pour son intérieur bleu et or spectaculaire avec voûte étoilée. Orgue Casavant de 7000 tuyaux. Tours jumelles de 69m. Funérailles de Céline Dion\'s husband. Symbole de l\'héritage catholique français au Canada.',
    points: 70,
    coordinates: [-73.5565, 45.5045],
    imageUrl: '/src/assets/places/notre-dame-montreal.jpg'
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
    description: 'Deuxième plus grande basilique catholique au monde (1980), Aparecida accueille 12 millions de pèlerins annuels. Statue miraculeuse de Notre-Dame (1717) trouvée par pêcheurs. Patronne du Brésil. Architecture moderne massive pouvant contenir 45 000 personnes. Cœur spirituel catholique brésilien.',
    points: 85,
    coordinates: [-45.2310, -22.8495],
    imageUrl: '/src/assets/places/aparecida.jpg'
  },
  {
    id: 'bra-3',
    name: 'Cathédrale de Brasília',
    country: 'Brazil',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre moderniste d\'Oscar Niemeyer (1970), structure hyperboloïde de 16 colonnes blanches de 40m représentant mains vers le ciel. Vitraux de Marianne Peretti inondent intérieur de lumière colorée. Patrimoine UNESCO, icône de l\'architecture moderne brésilienne fusionnant foi et avant-garde.',
    points: 75,
    coordinates: [-47.8758, -15.7989],
    imageUrl: '/src/assets/places/brasilia-cathedral.jpg'
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
    description: 'Cathédrale baroque (1559-1654) construite sur les fondations du palais inca Viracocha. Fusionnant styles européen et andin, elle symbolise la conquête espagnole. Toiles de l\'École de Cusco mêlant iconographie catholique et symboles incas. Elle témoigne du syncrétisme culturel andin-catholique.',
    points: 70,
    coordinates: [-71.9675, -13.5165],
    imageUrl: '/src/assets/places/cusco-cathedral.jpg'
  },
  {
    id: 'per-3',
    name: 'Monastère de Santa Catalina',
    country: 'Peru',
    type: 'Monastère',
    description: 'Cité monastique (1579-1580) à Arequipa, Santa Catalina est un monastère dominicain occupant 20 000m² avec rues colorées orange et bleues, places, chapelles. Fermé au monde 400 ans, ouvert au public 1970. 20 religieuses y vivent toujours en clôture. Architecture coloniale espagnole-andalouse préservée. Musée vivant colonial du Pérou vice-royal. Il incarne vie religieuse coloniale, isolement mystique et richesse artistique baroque andin.',
    points: 65,
    coordinates: [-71.5370, -16.3948],
    imageUrl: '/src/assets/places/santa-catalina.jpg'
  },
  
  // Colombia
  {
    id: 'col-1',
    name: 'Cathédrale de Sel de Zipaquirá',
    country: 'Colombia',
    type: 'Église',
    description: 'Cathédrale souterraine unique creusée à 180m dans mine de sel (1995). Trois nefs représentent naissance, vie et mort du Christ. Croix monumentale de 16m illuminée. Capacité 8400 personnes. Architecture minérale spectaculaire avec jeux de lumière. Merveille architecturale colombienne fusionnant foi et géologie.',
    points: 90,
    coordinates: [-74.0047, 5.0266],
    imageUrl: '/src/assets/places/zipaquira-salt.jpg'
  },
  {
    id: 'col-2',
    name: 'Sanctuaire de Las Lajas',
    country: 'Colombia',
    type: 'Sanctuaire',
    description: 'Basilique néo-gothique miraculeuse (1916-1949) construite sur pont enjambant gorge de 100m. Image de la Vierge apparut sur roche en 1754. Architecture vertigineuse défiant gravité. Pèlerinage marial majeur d\'Amérique du Sud. Chef-d\'œuvre architectural et site spectaculaire incarnant foi et audace.',
    points: 85,
    coordinates: [-77.5914, 0.8139],
    imageUrl: '/src/assets/places/las-lajas.jpg'
  },
  
  // Argentina
  {
    id: 'arg-1',
    name: 'Cathédrale métropolitaine de Buenos Aires',
    country: 'Argentina',
    type: 'Cathédrale',
    description: 'Cathédrale néo-classique (1752-1852) de Buenos Aires avec façade grecque à 12 colonnes représentant 12 apôtres. Tombeau du héros national José de San Martín dans mausolée gardé. Architecture sobre contrastant avec églises baroques latino-américaines. Siège de l\'archidiocèse où officia le Cardinal Bergoglio (Pape François). Elle symbolise indépendance argentine, identité nationale et leadership catholique latino-américain.',
    points: 65,
    coordinates: [-58.3730, -34.6076],
    imageUrl: '/src/assets/places/buenos-aires-cathedral.jpg'
  },
  {
    id: 'arg-2',
    name: 'Basilique Notre-Dame de Luján',
    country: 'Argentina',
    type: 'Basilique',
    description: 'Centre de pèlerinage marial argentin (1887-1935), Luján accueille 6 millions fidèles annuels. Statue miraculeuse de Notre-Dame (40cm) datant de 1630 s\'arrêta mystérieusement ici. Architecture néo-gothique avec tours jumelles de 106m. Patronne de l\'Argentine, Uruguay et Paraguay. Pèlerinage à pied de 68km depuis Buenos Aires (Peregrinación Juvenil). Symbole de la foi populaire argentine et unité nationale.',
    points: 70,
    coordinates: [-59.1167, -34.5667],
    imageUrl: '/src/assets/places/lujan-basilica.jpg'
  },
  
  // ========== AFRICA ==========
  
  // Ethiopia
  {
    id: 'eth-1',
    name: 'Églises rupestres de Lalibela',
    country: 'Ethiopia',
    type: 'Églises',
    description: 'Nouvelle Jérusalem d\'Afrique, Lalibela abrite 11 églises monolithiques taillées dans le roc au XIIe siècle. Bete Giyorgis en forme de croix est la plus spectaculaire. Architecture excavée unique au monde. Centre spirituel de l\'Église orthodoxe éthiopienne. Patrimoine UNESCO.',
    points: 110,
    coordinates: [39.0417, 12.0321],
    imageUrl: '/src/assets/places/lalibela-churches.jpg'
  },
  {
    id: 'eth-2',
    name: 'Axoum',
    country: 'Ethiopia',
    type: 'Site religieux',
    description: 'Ancienne capitale du Royaume d\'Aksum (100-940), Axoum possède obélisques monumentaux (stèles) de 33m et 500 tonnes, merveilles d\'ingénierie antique. Église Sainte-Marie-de-Sion abriterait l\'Arche d\'Alliance selon tradition éthiopienne. Premier royaume chrétien d\'Afrique (330). Patrimoine UNESCO. Axoum incarne christianisme éthiopien millénaire, héritage juif (Reine de Saba) et grandeur de l\'Éthiopie antique.',
    points: 95,
    coordinates: [38.7203, 14.1219],
    imageUrl: '/src/assets/places/aksum.jpg'
  },
  
  // South Africa
  {
    id: 'saf-1',
    name: 'Cathédrale Saint-Georges',
    country: 'South Africa',
    type: 'Cathédrale',
    description: 'Cathédrale anglicane (1834) du Cap, St. George\'s fut chaire de l\'archevêque Desmond Tutu, prix Nobel de la Paix 1984. Surnommée "Cathédrale du Peuple", elle fut centre de résistance anti-apartheid. Lieu de réconciliation nationale post-1994. Architecture néo-gothique victorienne. Elle symbolise lutte pour justice, égalité raciale et transition démocratique sud-africaine.',
    points: 60,
    coordinates: [18.4193, -33.9286],
    imageUrl: '/src/assets/places/st-georges-capetown.jpg'
  },
  
  // ========== OCEANIA ==========
  
  // Australia
  {
    id: 'aus-1',
    name: 'Cathédrale Sainte-Marie',
    country: 'Australia',
    type: 'Cathédrale',
    description: 'Cathédrale néo-gothique (1928) de Sydney, St. Mary\'s avec flèches de 74m domine Hyde Park. Plus grande église catholique d\'Australie. Architecture style gothique anglais. Elle symbolise immigration catholique irlandaise et croissance du catholicisme australien. Lieu de cérémonies nationales et messes télévisées.',
    points: 70,
    coordinates: [151.2131, -33.8712],
    imageUrl: '/src/assets/places/st-marys-sydney.jpg'
  },
  {
    id: 'aus-2',
    name: 'Uluru',
    country: 'Australia',
    type: 'Site sacré aborigène',
    description: 'Monolithe sacré rouge (348m) au cœur du désert australien, Uluru est le site spirituel le plus important des Aborigènes Anangu depuis 60 000 ans. Ses grottes abritent peintures rupestres ancestrales. Changement de couleurs spectaculaire au lever/coucher du soleil. Escalade interdite depuis 2019 (respect tradition). Patrimoine UNESCO double (naturel et culturel), il incarne la plus ancienne culture vivante au monde.',
    points: 100,
    coordinates: [131.0369, -25.3444],
    imageUrl: '/src/assets/places/uluru.jpg'
  },
  
  // New Zealand
  {
    id: 'nz-1',
    name: 'Cathédrale de Christchurch',
    country: 'New Zealand',
    type: 'Cathédrale',
    description: 'Cathédrale anglicane emblématique (1864-1904) de Christchurch, gravement endommagée par séismes de 2011. Sa flèche s\'effondra, symbole de la tragédie néo-zélandaise (185 morts). Débats sur reconstruction ou démolition divisèrent la communauté. Cathédrale transitoire en carton (Shigeru Ban) créée en attendant. Elle incarne résilience, patrimoine britannique néo-zélandais et questionnements post-catastrophe.',
    points: 65,
    coordinates: [172.6366, -43.5321],
    imageUrl: '/src/assets/places/christchurch-cathedral.jpg'
  }
];

export const getPlacesByCountry = (country: string): Place[] => {
  return mockPlaces.filter(place => place.country === country);
};

export const getAllPlaces = (): Place[] => {
  return mockPlaces;
};

export const getPlaceById = (id: string): Place | undefined => {
  return mockPlaces.find(place => place.id === id);
};

export const getAllCountries = (): string[] => {
  return Array.from(new Set(mockPlaces.map(place => place.country))).sort();
};