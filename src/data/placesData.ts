import type { Place } from '@/contexts/AppContext';

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
  {
    id: 'fra-9',
    name: 'Cathédrale de Strasbourg',
    country: 'France',
    city: 'Strasbourg',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre gothique en grès rose des Vosges (1015-1439), la cathédrale de Strasbourg fut le plus haut édifice du monde de 1647 à 1874 avec sa flèche unique culminant à 142m. Façade occidentale d\'une finesse extraordinaire avec des centaines de sculptures. Horloge astronomique Renaissance (1574) chef-d\'œuvre de mécanique et d\'art. Vitraux médiévaux exceptionnels du XIIe au XIVe siècle. Vue panoramique unique depuis la plateforme à 66m. Symbole de Strasbourg et de l\'Alsace, patrimoine UNESCO, elle témoigne du génie gothique rhénan et de l\'histoire franco-allemande.',
    points: 70,
    coordinates: [7.7507, 48.5816],
    imageUrl: '/src/assets/places/strasbourg-cathedral.jpg'
  },
  {
    id: 'fra-10',
    name: 'Basilique Sainte-Marie-Madeleine de Vézelay',
    country: 'France',
    city: 'Vézelay',
    type: 'Basilique',
    description: 'Joyau de l\'art roman bourguignon (XIIe siècle) perché sur la colline éternelle de Vézelay. Point de départ majeur du pèlerinage vers Saint-Jacques-de-Compostelle depuis le Moyen Âge. Son tympan du Jugement dernier et sa nef aux pierres claires et sombres alternées sont des chefs-d\'œuvre absolus. Abritait les reliques de Marie-Madeleine, attirant rois et pèlerins. Saint Bernard y prêcha la deuxième croisade en 1146. Restaurée par Viollet-le-Duc au XIXe siècle. Patrimoine UNESCO, lieu spirituel exceptionnel symbole du renouveau roman et de la foi médiévale.',
    points: 65,
    coordinates: [3.7469, 47.4659],
    imageUrl: '/src/assets/places/vezelay-basilica.jpg'
  },
  {
    id: 'fra-11',
    name: 'Cathédrale Notre-Dame d\'Amiens',
    country: 'France',
    city: 'Amiens',
    type: 'Cathédrale',
    description: 'Plus vaste cathédrale de France par ses volumes intérieurs (200 000m³), chef-d\'œuvre du gothique classique (1220-1288). Nef culminant à 42,30m sous voûte, longueur de 145m. Façade occidentale harmonieuse avec trois portails sculptés présentant 750 figures. Labyrinthe au sol reconstituant le chemin spirituel. "Bible d\'Amiens" pour Ruskin qui la considérait comme la perfection gothique. Patrimoine UNESCO. Spectacle "Amiens en couleurs" illumine chaque été la façade, révélant les couleurs médiévales d\'origine. Symbole du génie picard et de l\'apogée de l\'art gothique français.',
    points: 65,
    coordinates: [2.3019, 49.8947],
    imageUrl: '/src/assets/places/amiens-cathedral.jpg'
  },
  {
    id: 'fra-12',
    name: 'Sainte-Chapelle de Paris',
    country: 'France',
    city: 'Paris',
    type: 'Chapelle',
    description: 'Joyau absolu du gothique rayonnant (1242-1248) commandé par Saint Louis pour abriter les reliques de la Passion du Christ, dont la Couronne d\'épines. Chapelle palatine du palais royal, elle éblouit par ses 15 verrières de 15m de haut couvrant 600m² et narrant l\'histoire biblique de la Genèse à la Résurrection. 1113 scènes en vitraux du XIIIe siècle, 2/3 d\'origine. Architecture audacieuse supprimant les murs au profit du verre et de la lumière divine. Reliquaire monumental, elle incarnait la Jérusalem céleste sur terre. Chef-d\'œuvre absolu de l\'art gothique et de la spiritualité médiévale.',
    points: 75,
    coordinates: [2.3451, 48.8556],
    imageUrl: '/src/assets/places/sainte-chapelle.jpg'
  },
  
  // Italy
  {
    id: 'ita-1',
    name: 'Vatican - Basilique Saint-Pierre',
    country: 'Italy',
    city: 'Vatican',
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
    city: 'Milan',
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
    city: 'Assise',
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
    city: 'Florence',
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
    city: 'Venise',
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
    city: 'Rome',
    type: 'Temple',
    description: 'Temple romain (126 après J.-C.) dédié à tous les dieux, construit sous l\'empereur Hadrien. Son dôme de 43m fut la plus grande coupole non armée du monde pendant 1300 ans. L\'oculus de 9m au sommet illumine l\'intérieur et crée effets atmosphériques spectaculaires. Converti en église chrétienne Santa Maria ad Martyres en 609, sauvant ainsi le monument. Tombeaux de Raphaël et rois d\'Italie. Chef-d\'œuvre d\'ingénierie romaine inspirant architectes depuis 2000 ans, dont Michel-Ange et Brunelleschi.',
    points: 65,
    coordinates: [12.4768, 41.8986],
    imageUrl: '/src/assets/places/pantheon-rome.jpg'
  },
  {
    id: 'ita-7',
    name: 'Cathédrale de Sienne',
    country: 'Italy',
    city: 'Sienne',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre gothique toscan (1215-1263) au revêtement unique de marbre blanc et noir en bandes horizontales, symboles de Sienne. Façade Giovanni Pisano (1284-1299) richement sculptée. Sol en mosaïque de marbre (1369-1547) racontant histoires bibliques sur 3000m². Bibliothèque Piccolomini aux fresques éclatantes du Pinturicchio. Chaire octogonale de Nicola Pisano (1265-1268) chef-d\'œuvre de sculpture gothique. Patrimoine UNESCO. Projet grandiose d\'agrandissement abandonné après la Peste Noire de 1348. Symbole de la République de Sienne, rival de Florence, et summum de l\'art gothique italien.',
    points: 70,
    coordinates: [11.3287, 43.3178],
    imageUrl: '/src/assets/places/siena-cathedral.jpg'
  },
  {
    id: 'ita-8',
    name: 'Basilique Saint-Antoine de Padoue',
    country: 'Italy',
    city: 'Padoue',
    type: 'Basilique',
    description: 'Basilique pontificale (1232-1310) érigée sur le tombeau de Saint Antoine de Padoue (1195-1231), franciscain docteur de l\'Église vénéré pour ses miracles. Architecture fusionnant roman, gothique, byzantin avec ses 8 dômes inspirés de Saint-Marc de Venise. Chapelle des Reliques abritant la langue miraculeusement préservée du saint. Œuvres de Donatello dont le maître-autel en bronze. 6,5 millions de pèlerins annuels. Lieu de dévotion mondiale pour retrouver objets perdus et miracles. Patrimoine artistique et spirituel exceptionnel du catholicisme italien.',
    points: 65,
    coordinates: [11.8812, 45.4015],
    imageUrl: '/src/assets/places/padua-basilica.jpg'
  },
  {
    id: 'ita-9',
    name: 'Ensemble Cathédral de Pise',
    country: 'Italy',
    city: 'Pise',
    type: 'Cathédrale',
    description: 'Piazza dei Miracoli (Place des Miracles) patrimoine UNESCO réunissant quatre chefs-d\'œuvre du roman pisan en marbre blanc (XIe-XIVe) : la Cathédrale (1063), le Baptistère (1152), le Campanile (Tour penchée, 1173) et le Camposanto (1278). Tour inclinée de 56m célèbre mondialement pour sa déviation de 3,97° due au sol argileux, stabilisée après travaux (1990-2001). Galilée y étudia les lois du pendule. Baptistère à l\'acoustique parfaite. Fresques du Camposanto. Ensemble unique célébrant la puissance maritime de Pise médiévale et le génie architectural italien.',
    points: 80,
    coordinates: [10.3966, 43.7230],
    imageUrl: '/src/assets/places/pisa-complex.jpg'
  },
  {
    id: 'ita-10',
    name: 'Basilique Saint-Paul-hors-les-Murs',
    country: 'Italy',
    city: 'Rome',
    type: 'Basilique',
    description: 'Basilique papale majeure érigée au IVe siècle sur le tombeau de Saint Paul, apôtre martyrisé en 67. Reconstruite après l\'incendie de 1823 en conservant le plan paléochrétien d\'origine. Deuxième plus grande église de Rome après Saint-Pierre. Nef de 131m avec 80 colonnes de granit. Mosaïques byzantines du XIIIe siècle dans l\'abside. Portraits en médaillons des 266 papes depuis Saint Pierre. Cloître bénédictin du XIIIe aux colonnes incrustées de mosaïques cosmatesques. Patrimoine UNESCO, lieu de pèlerinage paulinien majeur, extraterritorialité du Vatican.',
    points: 70,
    coordinates: [12.4765, 41.8588],
    imageUrl: '/src/assets/places/san-paolo-rome.jpg'
  },
  {
    id: 'ita-11',
    name: 'Cathédrale de Naples',
    country: 'Italy',
    city: 'Naples',
    type: 'Cathédrale',
    description: 'Duomo di San Gennaro, cathédrale (1272-1323) dédiée à Saint Janvier, patron et protecteur de Naples. Chapelle du Trésor baroque (1608-1637) abritant les reliques et le sang miraculeusement liquéfié du saint trois fois par an devant des milliers de fidèles. Miracle observé depuis 1389, symbole napolitain de protection divine. Architecture mêlant gothique, baroque et néoclassique après reconstructions. Baptistère paléochrétien du IVe siècle, plus ancien d\'Occident, avec mosaïques. Cœur spirituel de Naples et de la ferveur catholique napolitaine passionnée.',
    points: 65,
    coordinates: [14.2569, 40.8529],
    imageUrl: '/src/assets/places/naples-cathedral.jpg'
  },
  {
    id: 'ita-12',
    name: 'Basilique Sainte-Marie-Majeure',
    country: 'Italy',
    city: 'Rome',
    type: 'Basilique',
    description: 'Basilique papale majeure fondée en 432-440, plus ancien sanctuaire marial d\'Occident. Légende de la Vierge apparue au Pape Libère en 358 demandant une église "où tombera la neige en août". Mosaïques paléochrétiennes du Ve siècle parmi les plus belles au monde narrant l\'Ancien Testament. Plafond à caissons doré à l\'or rapporté des Amériques (1498). Reliques de la crèche du Christ. Chapelles Sixtine et Pauline baroques. Façade et campanile roman (75m, plus haut de Rome). Patrimoine UNESCO, extraterritorialité vaticane, cœur de la dévotion mariale romaine depuis 1600 ans.',
    points: 75,
    coordinates: [12.4990, 41.8976],
    imageUrl: '/src/assets/places/santa-maria-maggiore.jpg'
  },
  
  // Spain
  {
    id: 'esp-1',
    name: 'Sagrada Família',
    country: 'Spain',
    city: 'Barcelone',
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
    city: 'Saint-Jacques-de-Compostelle',
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
    city: 'Cordoue',
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
    city: 'Séville',
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
    city: 'San Lorenzo de El Escorial',
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
    city: 'Grenade',
    type: 'Palais',
    description: 'Palais-forteresse mauresque (XIIIe-XIVe) couronnant Grenade, chef-d\'œuvre absolu de l\'architecture islamique andalouse. Palais Nasrides aux stucs ciselés, calligraphies coraniques, jardins du Généralife, Cour des Lions avec ses 124 colonnes. Eau omniprésente symbole du paradis. Dernier bastion musulman d\'Espagne jusqu\'en 1492. Patrimoine UNESCO, elle incarne l\'âge d\'or d\'Al-Andalus : science, art, tolérance. 3 millions de visiteurs annuels. "Dale limosna mujer, que no hay en la vida nada, como la pena de ser ciego en Granada".',
    points: 85,
    coordinates: [-3.5881, 37.1761],
    imageUrl: '/src/assets/places/alhambra.jpg'
  },
  {
    id: 'esp-7',
    name: 'Cathédrale de Burgos',
    country: 'Spain',
    city: 'Burgos',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre gothique espagnol (1221-1567) de style français influencé par Reims et Bourges. Première cathédrale gothique de Castille. Flèches ajourées du XVe siècle influencées par l\'art germanique. Chapelle des Connétables au plafond étoilé spectaculaire. Tombeau du Cid Campeador, héros reconquérant légendaire. Escalera Dorada (Escalier Doré) Renaissance de Diego de Siloé. Patrimoine UNESCO. Cimborrio (lanterne) octogonal gothique flamboyant. Symbole de Burgos et de la Castille, elle représente 3 siècles d\'évolution gothique espagnole, fusion d\'influences européennes et génie ibérique.',
    points: 70,
    coordinates: [-3.7044, 42.3405],
    imageUrl: '/src/assets/places/burgos-cathedral.jpg'
  },
  {
    id: 'esp-8',
    name: 'Monastère de Montserrat',
    country: 'Spain',
    city: 'Montserrat',
    type: 'Monastère',
    description: 'Monastère bénédictin (XIe siècle) perché à 1236m sur les montagnes spectaculaires de Montserrat aux formations rocheuses uniques en dents de scie. Sanctuaire de la Moreneta (Vierge Noire du XIIe siècle), patronne de la Catalogne, vénérée depuis 880. Escolania, l\'un des plus anciens chœurs de garçons d\'Europe (XIVe siècle). Lieu de pèlerinage majeur catalan accueillant 2,5 millions de visiteurs annuels. Vue panoramique exceptionnelle. Symbole de l\'identité catalane, de la résistance culturelle sous Franco. Centre spirituel, culturel et national de la Catalogne millénaire.',
    points: 75,
    coordinates: [1.8376, 41.5933],
    imageUrl: '/src/assets/places/montserrat-monastery.jpg'
  },
  {
    id: 'esp-9',
    name: 'Cathédrale de Tolède',
    country: 'Spain',
    city: 'Tolède',
    type: 'Cathédrale',
    description: 'Catedral Primada (Cathédrale Primatiale), siège archiépiscopal d\'Espagne depuis le VIe siècle. Chef-d\'œuvre gothique hispano-flamand (1226-1493) sur l\'ancienne mosquée. Transparente baroque spectaculaire (1732) illuminant le chœur. Trésor abritant custode de 3m pesant 183kg en argent doré. Sacristie musée avec tableaux du Greco, Goya, Titien, Van Dyck. Clocher de 92m. Architecture fusionnant gothique, mudéjar, Renaissance, baroque. Symbole de Tolède, ville des trois cultures (chrétienne, musulmane, juive) et ancien cœur spirituel et politique de l\'Espagne wisigothique et médiévale.',
    points: 80,
    coordinates: [-4.0244, 39.8578],
    imageUrl: '/src/assets/places/toledo-cathedral.jpg'
  },
  {
    id: 'esp-10',
    name: 'Cathédrale de León',
    country: 'Spain',
    city: 'León',
    type: 'Cathédrale',
    description: 'Pulchra Leonina (Belle Léonaise), summum du gothique espagnol (1205-1301) influencé par Chartres et Reims. Surnommée "Maison de la Lumière" pour ses 1800m² de vitraux médiévaux exceptionnels (125 verrières, XIIIe-XVIe siècles) parmi les plus beaux d\'Europe. Architecture gothique française pure rare en Espagne. Façade occidentale aux trois portails sculptés. Cloître Renaissance (1534). Tombeau de Saint Froilan, patron de León. Patrimoine UNESCO en cours. Symbole du royaume médiéval de León, étape majeure du Chemin de Saint-Jacques, elle illustre l\'apogée de l\'art vitrail gothique hispanique.',
    points: 70,
    coordinates: [-5.5670, 42.5987],
    imageUrl: '/src/assets/places/leon-cathedral.jpg'
  },
  {
    id: 'esp-11',
    name: 'Monastère Royal de Guadalupe',
    country: 'Spain',
    city: 'Guadalupe',
    type: 'Monastère',
    description: 'Monastère-forteresse (XIVe-XVIIIe) en Estrémadure, centre spirituel majeur d\'Espagne et d\'Amérique latine. Sanctuaire de la Vierge de Guadalupe, patronne de l\'hispanité. Christophe Colomb y pria avant et après son voyage en Amérique (1492-1493). Architecture mêlant gothique, mudéjar, Renaissance et baroque. Huit cloîtres. Bibliothèque de manuscrits enluminés. Peintures de Zurbarán dans la sacristie. Lieu de baptême des premiers Amérindiens convertis. Patrimoine UNESCO. Symbole de la Reconquista, de la découverte des Amériques et du catholicisme hispano-américain sur cinq siècles.',
    points: 75,
    coordinates: [-5.3279, 39.4537],
    imageUrl: '/src/assets/places/guadalupe-monastery.jpg'
  },
  
  // United Kingdom
  {
    id: 'uk-1',
    name: 'Cathédrale de Canterbury',
    country: 'United Kingdom',
    city: 'Canterbury',
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
    city: 'Londres',
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
    city: 'York',
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
    city: 'Amesbury',
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
    city: 'Cologne',
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
    city: 'Dresde',
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
    city: 'Aix-la-Chapelle',
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
    city: 'Athènes',
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
    city: 'Mont Athos',
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
    city: 'Delphes',
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
    city: 'Moscou',
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
    city: 'Sergueïev Possad',
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
    city: 'Częstochowa',
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
    city: 'Cracovie',
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
    city: 'Fátima',
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
    city: 'Lisbonne',
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
    city: 'Jérusalem',
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
    city: 'Jérusalem',
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
    city: 'Jérusalem',
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
    city: 'Bethléem',
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
    city: 'Nazareth',
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
    city: 'La Mecque',
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
    city: 'Médine',
    type: 'Mosquée',
    description: 'Deuxième lieu saint de l\'Islam après La Mecque, Médine accueille la Mosquée du Prophète construite en 622. Mohammed y vécut, y pria et y fut enterré sous le dôme vert emblématique. Lieu d\'exil (Hégire) marquant le début du calendrier islamique. La mosquée peut accueillir 1 million de fidèles. Ville interdite aux non-musulmans, lieu de paix et de méditation. Visiter Médine après La Mecque est un honneur pour tout musulman pieux.',
    points: 120,
    coordinates: [39.6111, 24.4672],
    imageUrl: '/src/assets/places/medina-mosque.jpg'
  },
  {
    id: 'sau-3',
    name: 'Mosquée Quba',
    country: 'Saudi Arabia',
    city: 'Médine',
    type: 'Mosquée',
    description: 'Première mosquée construite dans l\'histoire de l\'Islam (622), édifiée par le Prophète Muhammad lors de sa migration (Hijra) de La Mecque à Médine. Architecture moderne blanche éclatante avec 4 minarets élancés. Capacité 20 000 fidèles. Selon la tradition, prier deux rak\'ahs ici équivaut à une Omra. Elle symbolise les débuts de l\'Islam et la communauté musulmane originelle. Lieu de grande bénédiction spirituelle.',
    points: 80,
    coordinates: [39.6161, 24.4397],
    imageUrl: '/src/assets/places/quba-mosque.jpg'
  },
  
  // Egypt
  {
    id: 'egy-1',
    name: 'Pyramides de Gizeh',
    country: 'Egypt',
    city: 'Le Caire',
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
    city: 'Le Caire',
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
    city: 'Louxor',
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
    city: 'Sainte-Catherine',
    type: 'Monastère',
    description: 'Plus ancien monastère chrétien en activité continue (527), Sainte-Catherine au pied du Mont Sinaï (Horeb) abrite le Buisson Ardent de Moïse. Fortifié par Justinien, il préserve manuscrits anciens, icônes byzantines, bibliothèque de 3000 codex. Mosquée dans l\'enceinte témoigne de coexistence. Patrimoine UNESCO. Lieu saint pour judaïsme, christianisme et islam. Pèlerinage vers sommet du Sinaï (2285m) où Moïse reçut les Tables de la Loi.',
    points: 100,
    coordinates: [33.9756, 28.5569],
    imageUrl: '/src/assets/places/st-catherine-sinai.jpg'
  },
  {
    id: 'egy-5',
    name: 'Mosquée du Sultan Hassan',
    country: 'Egypt',
    city: 'Le Caire',
    type: 'Mosquée',
    description: 'Chef-d\'œuvre de l\'architecture mamelouke (1356-1363), la mosquée du Sultan Hassan est l\'une des plus grandes mosquées médiévales du monde islamique. Architecture monumentale avec minarets de 81m, cour centrale, iwans immenses. Madrasa abritant 4 écoles juridiques islamiques. Décoration de marbre, stalactites, calligraphie coranique. Elle incarne l\'âge d\'or mamelouk, grandeur architecturale cairote et science islamique médiévale.',
    points: 75,
    coordinates: [31.2565, 30.0321],
    imageUrl: '/src/assets/places/sultan-hassan.jpg'
  },
  {
    id: 'egy-6',
    name: 'Mosquée Mohammed Ali',
    country: 'Egypt',
    city: 'Le Caire',
    type: 'Mosquée',
    description: 'Mosquée monumentale ottomane (1830-1848) dominant la Citadelle du Caire. Architecture inspirée Mosquée Bleue Istanbul avec dôme central 52m, 2 minarets élancés 82m. Intérieur somptueux : albâtre, lustres cristal, tapis persan. Tombeau Mohammed Ali fondateur Égypte moderne. Vue panoramique exceptionnelle sur tout Le Caire. Elle symbolise modernisation Égypte XIXe, influence ottomane et pouvoir dynastie Muhammad Ali.',
    points: 70,
    coordinates: [31.2602, 30.0288],
    imageUrl: '/src/assets/places/mohammed-ali.jpg'
  },
  {
    id: 'egy-7',
    name: 'Mosquée Ibn Tulun',
    country: 'Egypt',
    city: 'Le Caire',
    type: 'Mosquée',
    description: 'Plus ancienne mosquée du Caire conservée intacte (876-879), Ibn Tulun est chef-d\'œuvre architecture abbasside. Minaret hélicoïdal unique inspiré Samarra (Irak), cour immense 92x92m, arcades sur piliers massifs, ziyadas (extensions). Architecture sobre et monumentale en brique. Elle témoigne indépendance dynastie tulunide, influences mésopotamiennes et préservation exceptionnelle architecture islamique précoce.',
    points: 75,
    coordinates: [31.2477, 30.0288],
    imageUrl: '/src/assets/places/ibn-tulun.jpg'
  },
  
  // Turkey
  {
    id: 'tur-1',
    name: 'Sainte-Sophie',
    country: 'Turkey',
    city: 'Istanbul',
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
    city: 'Istanbul',
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
    city: 'Selçuk',
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
    city: 'Casablanca',
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
    city: 'Marrakech',
    type: 'École coranique',
    description: 'Plus grande médersa (école coranique) du Maghreb (1564-1565), Ben Youssef à Marrakech pouvait accueillir 900 étudiants. Architecture hispano-mauresque sublime : zellige polychrome, bois de cèdre sculpté, stuc ciselé, calligraphies coraniques. Cour centrale avec bassin de marbre. 130 cellules d\'étudiants. Fermée 1960, restaurée, ouverte au public 1982-2020. Chef-d\'œuvre de l\'art saadien incarnant l\'éducation islamique traditionnelle et beauté architecturale marocaine.',
    points: 65,
    coordinates: [-7.9847, 31.6315],
    imageUrl: '/src/assets/places/ben-youssef.jpg'
  },
  {
    id: 'mor-4',
    name: 'Mosquée Quaraouiyine',
    country: 'Morocco',
    city: 'Fès',
    type: 'Mosquée',
    description: 'Fondée en 859 par Fatima al-Fihri, la mosquée-université Quaraouiyine est reconnue par le Guinness comme plus ancienne université en activité continue au monde. Architecture idrisside, almoravide, almohade sur 12 siècles. Capacité 20 000 fidèles. Bibliothèque manuscrits rares dont Coran IXe siècle. Interdite non-musulmans. Patrimoine UNESCO Fès. Elle incarne excellence éducative islamique millénaire, rôle féminin fondateur et rayonnement intellectuel marocain.',
    points: 90,
    coordinates: [-4.9747, 34.0647],
    imageUrl: '/src/assets/places/quaraouiyine.jpg'
  },
  {
    id: 'mor-5',
    name: 'Mosquée Hassan de Rabat',
    country: 'Morocco',
    city: 'Rabat',
    type: 'Mosquée',
    description: 'Mosquée inachevée (1195) du sultan almohade Yacoub el-Mansour, le minaret Tour Hassan de 44m devait culminer à 86m. Projet monumental interrompu par mort du sultan 1199 et séisme 1755. 200 colonnes subsistent. Mausolée Mohammed V (1971) et son fils Hassan II complètent site. Architecture almohade inspirant Giralda Séville et Koutoubia Marrakech. Patrimoine UNESCO. Elle symbolise ambition almohade, grandeur inachevée et pouvoir royal alaouite.',
    points: 75,
    coordinates: [-6.8214, 34.0241],
    imageUrl: '/src/assets/places/hassan-rabat.jpg'
  },
  
  // ========== ASIA ==========
  
  // India
  {
    id: 'ind-1',
    name: 'Taj Mahal',
    country: 'India',
    city: 'Agra',
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
    city: 'Amritsar',
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
    city: 'Varanasi',
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
    city: 'Madurai',
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
    city: 'Aurangabad',
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
    city: 'Delhi',
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
    city: 'Lumbini',
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
    city: 'Katmandou',
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
    city: 'Katmandou',
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
    city: 'Beijing',
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
    city: 'Dengfeng',
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
    city: 'Luoyang',
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
    city: 'Leshan',
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
    city: 'Lhassa',
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
    city: 'Lhassa',
    type: 'Monastère',
    description: 'Temple le plus sacré du bouddhisme tibétain (647), Jokhang à Lhassa abrite la statue de Jowo Shakyamuni (Bouddha à 12 ans) apportée de Chine par la Princesse Wencheng. Centre spirituel absolu du Tibet, but ultime de tout pèlerin tibétain. Kora (circumambulation) rituelle effectuée par milliers quotidiennement. Architecture tibétaine traditionnelle avec toit doré. Patrimoine UNESCO. Malgré destructions durant Révolution culturelle, il demeure cœur vivant de la foi tibétaine et symbole d\'identité culturelle menacée.',
    points: 105,
    coordinates: [91.1315, 29.6525],
    imageUrl: '/src/assets/places/jokhang.jpg'
  },
  
  // Cambodia
  {
    id: 'cam-1',
    name: 'Angkor Wat',
    country: 'Cambodia',
    city: 'Siem Reap',
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
    city: 'Siem Reap',
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
    city: 'Yangon',
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
    city: 'Bagan',
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
    city: 'Fujinomiya',
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
    city: 'Kyoto',
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
    city: 'Nara',
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
    city: 'Kyoto',
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
    city: 'Miyajima',
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
    city: 'Magelang',
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
    city: 'Yogyakarta',
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
    city: 'New York',
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
    city: 'Washington DC',
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
    city: 'Tucson',
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
    city: 'Salt Lake City',
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
    city: 'San Francisco',
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
    city: 'Mexico City',
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
    city: 'Chichén Itzá',
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
    city: 'Teotihuacán',
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
    city: 'Mexico City',
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
    city: 'Montréal',
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
    city: 'Montréal',
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
    city: 'Rio de Janeiro',
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
    city: 'Aparecida',
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
    city: 'Brasília',
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
    city: 'Aguas Calientes',
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
    city: 'Cusco',
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
    city: 'Arequipa',
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
    city: 'Zipaquirá',
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
    city: 'Ipiales',
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
    city: 'Buenos Aires',
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
    city: 'Luján',
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
    city: 'Lalibela',
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
    city: 'Axoum',
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
    city: 'Cape Town',
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
    city: 'Sydney',
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
    city: 'Uluru',
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
    city: 'Christchurch',
    type: 'Cathédrale',
    description: 'Cathédrale anglicane emblématique (1864-1904) de Christchurch, gravement endommagée par séismes de 2011. Sa flèche s\'effondra, symbole de la tragédie néo-zélandaise (185 morts). Débats sur reconstruction ou démolition divisèrent la communauté. Cathédrale transitoire en carton (Shigeru Ban) créée en attendant. Elle incarne résilience, patrimoine britannique néo-zélandais et questionnements post-catastrophe.',
    points: 65,
    coordinates: [172.6366, -43.5321],
    imageUrl: '/src/assets/places/christchurch-cathedral.jpg'
  },
  
  // ========== ADDITIONAL SACRED SITES ==========
  
  // Hungary
  {
    id: 'hun-3',
    name: 'Grande Synagogue de Budapest',
    country: 'Hungary',
    city: 'Budapest',
    type: 'Synagogue',
    description: 'Plus grande synagogue d\'Europe et 2ème au monde (1854-1859), la Grande Synagogue Dohány peut accueillir 3000 fidèles. Architecture mauresque-byzantine avec 2 tours de 43m. Orgue monumental joué par Franz Liszt et Camille Saint-Saëns. Durant la Shoah, le ghetto de Budapest entoura la synagogue (70 000 personnes). Mémorial de l\'Arbre de Vie honore 400 000 victimes hongroises. Elle symbolise judaïsme hongrois, mémoire de la Shoah et renaissance communautaire.',
    points: 70,
    coordinates: [19.0603, 47.4957],
    imageUrl: '/src/assets/places/budapest-synagogue.jpg'
  },
  
  // Tunisia
  {
    id: 'tun-1',
    name: 'Grande Mosquée de Kairouan',
    country: 'Tunisia',
    city: 'Kairouan',
    type: 'Mosquée',
    description: 'Fondée en 670 par Oqba Ibn Nafi, la Grande Mosquée de Kairouan est l\'une des plus anciennes et importantes du monde musulman. 4ème ville sainte de l\'Islam après La Mecque, Médine et Jérusalem. Architecture omeyyade avec minaret de 31m (modèle maghrébin). Son mihrab en faïence est chef-d\'œuvre d\'art islamique. Salle de prière à 17 nefs, 414 colonnes antiques recyclées. Patrimoine UNESCO, elle incarne expansion islamique en Afrique du Nord et architecture sacrée du Maghreb.',
    points: 85,
    coordinates: [10.1029, 35.6781],
    imageUrl: '/src/assets/places/kairouan-mosque.jpg'
  },
  {
    id: 'tun-2',
    name: 'Mosquée Zitouna',
    country: 'Tunisia',
    city: 'Tunis',
    type: 'Mosquée',
    description: 'Grande Mosquée de Tunis (732), cœur spirituel et intellectuel de la capitale. Nom "Zitouna" (olivier) référence arbre légendaire du site. Architecture aghlabide, hafside et ottomane. Minaret carré 43m, 184 colonnes antiques, bibliothèque manuscrits. Université Zitouna forma savants et réformistes tunisiens. Patrimoine médina UNESCO. Elle incarne histoire millénaire Tunis, tradition intellectuelle tunisienne et identité nationale.',
    points: 70,
    coordinates: [10.1731, 36.8163],
    imageUrl: '/src/assets/places/zitouna.jpg'
  },
  {
    id: 'tun-3',
    name: 'Mosquée Sidi Sahbi',
    country: 'Tunisia',
    city: 'Kairouan',
    type: 'Mosquée',
    description: 'Mosquée du Barbier (VIIe siècle), abritant tombeau Abu Zama el-Balawi, compagnon Prophète portant 3 cheveux sacrés. Architecture andalouse-maghrébine, cour mosaïques zellige colorées, stucs ciselés, coupoles peintes. Lieu pèlerinage important Kairouan. Restaurations hafside et husseinite. Elle symbolise vénération compagnons Prophète, artisanat tunisien et piété populaire.',
    points: 65,
    coordinates: [10.1033, 35.6692],
    imageUrl: '/src/assets/places/sidi-sahbi.jpg'
  },
  
  // UAE
  {
    id: 'uae-1',
    name: 'Grande Mosquée Cheikh Zayed',
    country: 'United Arab Emirates',
    city: 'Abu Dhabi',
    type: 'Mosquée',
    description: 'Une des plus grandes et luxueuses mosquées au monde (2007), la Mosquée Cheikh Zayed peut accueillir 41 000 fidèles. 4 minarets de 107m, 82 dômes blancs, 1000 colonnes incrustées pierres semi-précieuses. Plus grand tapis tissé main au monde (5627m²), 7 lustres cristal Swarovski dont le plus grand (10 tonnes). Marbre blanc Macédoine, or 24 carats. Ouverte aux non-musulmans. Elle symbolise modernité, richesse et ouverture des Émirats Arabes Unis.',
    points: 90,
    coordinates: [54.4747, 24.4128],
    imageUrl: '/src/assets/places/sheikh-zayed.jpg'
  },
  {
    id: 'uae-2',
    name: 'Mosquée Jumeirah',
    country: 'United Arab Emirates',
    city: 'Dubai',
    type: 'Mosquée',
    description: 'Icône architecturale de Dubaï (1979), la Mosquée Jumeirah est l\'une des rares mosquées ouvertes aux non-musulmans pour visites guidées "Portes ouvertes, esprits ouverts". Architecture fatimide médiévale avec 2 minarets élancés et dôme central. Illuminée de nuit, elle devient spectacle lumineux. Capacité 1200 fidèles. Elle incarne tradition islamique et dialogue interculturel émirati.',
    points: 70,
    coordinates: [55.2323, 25.2321],
    imageUrl: '/src/assets/places/jumeirah.jpg'
  },
  {
    id: 'uae-3',
    name: 'Mosquée Al Noor',
    country: 'United Arab Emirates',
    city: 'Sharjah',
    type: 'Mosquée',
    description: 'Joyau ottoman de Sharjah (2005), Al Noor est construite dans pur style ottoman avec dôme central, 2 minarets, arcades et fontaine ablutions. Première mosquée Émirats ouverte au public non-musulman pour visites éducatives. Architecture inspirée Mosquée Bleue Istanbul. Illumination nocturne spectaculaire. Elle symbolise patrimoine islamique et éducation interculturelle à Sharjah, capitale culturelle UAE.',
    points: 65,
    coordinates: [55.3776, 25.3268],
    imageUrl: '/src/assets/places/al-noor.jpg'
  },
  
  // Jordan
  {
    id: 'jor-1',
    name: 'Mosquée du Roi Abdallah',
    country: 'Jordan',
    city: 'Amman',
    type: 'Mosquée',
    description: 'Mosquée emblématique d\'Amman (1989) avec son dôme bleu éclatant de 35m visible de toute la capitale. Construite par le roi Hussein en mémoire de son grand-père Abdallah Ier. Architecture islamique moderne avec mosaïques, calligraphies, marbres. Capacité 10 000 fidèles. Musée islamique attenant. Ouverte aux non-musulmans. Elle incarne monarchie hachémite, modernité jordanienne et identité nationale.',
    points: 70,
    coordinates: [35.9265, 32.0026],
    imageUrl: '/src/assets/places/king-abdullah.jpg'
  },
  {
    id: 'jor-2',
    name: 'Mosquée du Roi Hussein Ben Talal',
    country: 'Jordan',
    city: 'Amman',
    type: 'Mosquée',
    description: 'Plus grande mosquée de Jordanie (2005), construite par le roi Abdallah II en l\'honneur de son père Hussein. Architecture ottomane avec 4 minarets de 65m, dôme principal 35m. Capacité 7000 fidèles intériieurs, 3000 cour. Marbre italien, bois sculpté, calligraphies dorées. Centre islamique avec bibliothèque, salles conférences. Elle symbolise la continuité de la dynastie hachémite et le leadership spirituel jordanien.',
    points: 75,
    coordinates: [35.8667, 31.9667],
    imageUrl: '/src/assets/places/king-hussein.jpg'
  },
  {
    id: 'jor-3',
    name: 'Mosquée Abu Darwish',
    country: 'Jordan',
    city: 'Amman',
    type: 'Mosquée',
    description: 'Mosquée unique (1961) reconnaissable à son architecture noir et blanc en damier inspirée de styles syrien et ottoman. Perchée sur Jabal Ashrafieh dominant Amman. Commandée par Abu Darwish, marchand circassien. 2 minarets octogonaux. Architecture distincte créant motifs géométriques islamiques. Elle incarne diversité architecturale jordanienne et héritage circassien.',
    points: 60,
    coordinates: [35.9456, 31.9636],
    imageUrl: '/src/assets/places/abu-darwish.jpg'
  },
  
  // Algeria
  {
    id: 'alg-1',
    name: 'Mosquée Djamaa el-Djazaïr',
    country: 'Algeria',
    city: 'Algiers',
    type: 'Mosquée',
    description: 'Troisième plus grande mosquée au monde (2019), Djamaa el-Djazaïr possède le plus haut minaret du monde (265m). Capacité 120 000 fidèles. Architecture algéro-mauresque moderne avec influences ottomanes et andalouses. Bibliothèque d\'un million de livres, musée d\'art islamique, centre de recherche. Elle symbolise renaissance algérienne, fierté nationale et ambition architecturale post-indépendance.',
    points: 95,
    coordinates: [3.1530, 36.7500],
    imageUrl: '/src/assets/places/djamaa-djazair.jpg'
  },
  {
    id: 'alg-2',
    name: 'Mosquée Ketchaoua',
    country: 'Algeria',
    city: 'Algiers',
    type: 'Mosquée',
    description: 'Mosquée historique (1612) de la Casbah d\'Alger, convertie en cathédrale 1832-1962 durant colonisation française, rendue au culte musulman 1962 après indépendance. Architecture ottomane avec 2 minarets, transformations byzantines durant période coloniale, restauration ottomane post-indépendance. Patrimoine UNESCO Casbah. Elle incarne histoire complexe algérienne, colonisation et décolonisation.',
    points: 70,
    coordinates: [3.0603, 36.7841],
    imageUrl: '/src/assets/places/ketchaoua.jpg'
  },
  {
    id: 'alg-3',
    name: 'Mosquée Emir Abdelkader',
    country: 'Algeria',
    city: 'Constantine',
    type: 'Mosquée',
    description: 'Mosquée monumentale de Constantine (1994), dédiée au héros national Emir Abdelkader, résistant contre colonisation française (XIXe siècle). Architecture néo-mauresque avec minaret octogonal 107m. Capacité 15 000 fidèles. Vue panoramique gorges Rhumel. Elle symbolise résistance algérienne, patrimoine ottoman-maghrébin et fierté constantinoise.',
    points: 75,
    coordinates: [6.6147, 36.3650],
    imageUrl: '/src/assets/places/emir-abdelkader.jpg'
  },
  
  // Austria
  {
    id: 'aut-2',
    name: 'Abbaye de Melk',
    country: 'Austria',
    city: 'Melk',
    type: 'Abbaye',
    description: 'Abbaye bénédictine baroque (1702-1736) dominant le Danube du haut de son rocher. Chef-d\'œuvre de l\'architecte Jakob Prandtauer, elle incarne l\'apogée du baroque autrichien. Bibliothèque somptueuse avec 100 000 volumes dont manuscrits médiévaux précieux. Église abbatiale ornée de fresques monumentales de Paul Troger. Patrimoine UNESCO, elle inspira Umberto Eco pour "Le Nom de la Rose". Toujours habitée par moines bénédictins depuis 1089, symbole vivant de foi, culture et beauté baroque.',
    points: 75,
    coordinates: [15.3358, 48.2272],
    imageUrl: '/src/assets/places/melk-abbey.jpg'
  },
  
  // Netherlands
  {
    id: 'nld-2',
    name: 'Synagogue portugaise d\'Amsterdam',
    country: 'Netherlands',
    city: 'Amsterdam',
    type: 'Synagogue',
    description: 'Synagogue séfarade (1675) construite par juifs portugais fuyant l\'Inquisition. Architecture sobre protestante hollandaise adaptée au culte juif. Éclairée par 1000 bougies comme au XVIIe siècle. Miraculeusement préservée durant occupation nazie. Bibliothèque Ets Haim-Livraria Montezinos (1616) : plus ancienne bibliothèque juive au monde encore fonctionnelle. Patrimoine UNESCO, elle symbolise tolérance hollandaise, diaspora séfarade et résilience juive face à persécutions.',
    points: 70,
    coordinates: [4.9049, 52.3676],
    imageUrl: '/src/assets/places/amsterdam-synagogue.jpg'
  },
  
  // Iran
  {
    id: 'irn-2',
    name: 'Mosquée Bleue de Tabriz',
    country: 'Iran',
    city: 'Tabriz',
    type: 'Mosquée',
    description: 'Mosquée Kaboud (1465), joyau du style timuride, célèbre pour ses céramiques bleues extraordinaires recouvrant murs et voûtes. Surnommée "turquoise de l\'Islam". Séisme de 1779 détruisit grande partie, mais mosaïques survivantes témoignent génie artistique persan. Restauration progressive révèle splendeur originelle. Calligraphies coufiques et florales en lapis-lazuli. Patrimoine UNESCO, elle symbolise âge d\'or de Tabriz, capitale culturelle, et art céramique islamique à son apogée.',
    points: 75,
    coordinates: [46.2919, 38.0800],
    imageUrl: '/src/assets/places/tabriz-blue-mosque.jpg'
  },
  
  // Sweden
  {
    id: 'swe-1',
    name: 'Cathédrale d\'Uppsala',
    country: 'Sweden',
    city: 'Uppsala',
    type: 'Cathédrale',
    description: 'Plus grande cathédrale de Scandinavie (1287-1435), Uppsala culmine à 118m de hauteur. Architecture gothique française importée en Suède. Couronnement des rois suédois et lieu de sépulture : roi Gustav Vasa, botaniste Carl von Linné, théologien Nathan Söderblom. Conversion forcée vikings au christianisme au XIe siècle débuta ici. Elle remplaça temple païen d\'Uppsala où sacrifices humains étaient pratiqués. Symbole christianisation nordique, pouvoir royal suédois et patrimoine luthérien.',
    points: 70,
    coordinates: [17.6324, 59.8586],
    imageUrl: '/src/assets/places/uppsala-cathedral.jpg'
  },
  
  // Italy
  {
    id: 'ita-14',
    name: 'Grande Synagogue de Rome',
    country: 'Italy',
    city: 'Rome',
    type: 'Synagogue',
    description: 'Tempio Maggiore (1904), monumentale synagogue Art Nouveau avec dôme carré aluminium de 35m dominant le Tibre. Architecture éclectique italo-babylonienne. Communauté juive romaine existe depuis 2000 ans, plus ancienne diaspora d\'Europe. Ghetto de Rome (1555-1870) fut l\'un des plus restrictifs. Rafle du 16 octobre 1943 : 1023 juifs déportés à Auschwitz. Musée juif attenant témoigne Histoire millénaire. Elle incarne résilience du judaïsme romain, émancipation post-unification italienne et mémoire de la Shoah.',
    points: 70,
    coordinates: [12.4771, 41.8905],
    imageUrl: '/src/assets/places/rome-synagogue.jpg'
  },
  
  // Philippines
  {
    id: 'phl-1',
    name: 'Cathédrale de Manille',
    country: 'Philippines',
    city: 'Manila',
    type: 'Cathédrale',
    description: 'Cathédrale-basilique Immaculée-Conception (1958), siège de l\'archidiocèse de Manille depuis 1581. Détruite 6 fois (séismes, typhons, incendies, guerre), reconstruite symbolisant foi philippine inébranlable. Architecture néo-romane actuelle par Fernando Ocampo. Visite du Pape Jean-Paul II en 1981 et 1995. Orgue Klais allemand de 4500 tuyaux. Plus grand pays catholique d\'Asie (86 millions fidèles). Elle incarne 450 ans catholicisme philippin, colonisation espagnole et dévotion nationale.',
    points: 65,
    coordinates: [120.9750, 14.5921],
    imageUrl: '/src/assets/places/manila-cathedral.jpg'
  },
  
  // Morocco
  {
    id: 'mar-3',
    name: 'Mosquée de la Koutoubia',
    country: 'Morocco',
    city: 'Marrakech',
    type: 'Mosquée',
    description: 'Mosquée almohade (1147-1158), symbole de Marrakech avec minaret de 77m inspirant Giralda de Séville et Tour Hassan de Rabat. Architecture sacrée marocaine parfaite. Nom "Koutoubia" vient du souk des libraires voisin. Interdite aux non-musulmans mais visible de toute la ville. Illuminée la nuit, elle domine place Jemaa el-Fna. Proportions divines (1:5). Patrimoine UNESCO candidat, elle incarne grandeur almohade, beauté architecturale islamique et âme spirituelle de Marrakech.',
    points: 70,
    coordinates: [-7.9930, 31.6237],
    imageUrl: '/src/assets/places/koutoubia-mosque.jpg'
  },
  
  // Poland
  {
    id: 'pol-3',
    name: 'Synagogue Remuh de Cracovie',
    country: 'Poland',
    city: 'Krakow',
    type: 'Synagogue',
    description: 'Petite synagogue (1557) du quartier juif Kazimierz, une des 2 synagogues actives de Cracovie. Construite par banquier Israel Isserles pour son fils Rabbi Moses Isserles (Remu), célèbre commentateur Talmud. Cimetière attenant (1551) : pierres tombales Renaissance uniques, miraculeusement préservées. Kazimierz fut centre judaïsme polonais avant Shoah (65 000 juifs cracoviens exterminés). Lieu de tournage "La Liste de Schindler". Elle symbolise judaïsme ashkénaze polonais, renaissance post-communiste et mémoire de la Shoah.',
    points: 65,
    coordinates: [19.9471, 50.0524],
    imageUrl: '/src/assets/places/remuh-synagogue.jpg'
  },
  
  // ========== ORTHODOX & PROTESTANT CHURCHES ==========
  
  // Russia
  {
    id: 'rus-4',
    name: 'Cathédrale Saint-Sauveur-sur-le-Sang-Versé',
    country: 'Russia',
    city: 'Saint Petersburg',
    type: 'Église orthodoxe',
    description: 'Cathédrale orthodoxe (1883-1907) construite sur lieu d\'assassinat du Tsar Alexandre II en 1881. Architecture russo-byzantine avec 9 bulbes multicolores dorés, mosaïques extérieures et intérieures couvrant 7000m² (plus grand ensemble mosaïques Russie). Fermée par Soviets en 1930, utilisée comme entrepôt. Restauration 1997 après chute URSS. Elle incarne art orthodoxe russe, martyre tsariste et renaissance religieuse post-soviétique. Joyau architectural de Saint-Pétersbourg avec ses couleurs éclatantes.',
    points: 80,
    coordinates: [30.3289, 59.9402],
    imageUrl: '/src/assets/places/savior-blood-spb.jpg'
  },
  
  // Germany
  {
    id: 'deu-3',
    name: 'Cathédrale de Berlin',
    country: 'Germany',
    city: 'Berlin',
    type: 'Église protestante',
    description: 'Berliner Dom (1905), plus grande église protestante luthérienne d\'Allemagne. Architecture baroque wilhelminienne avec dôme vert de 98m. Lieu sépulture dynastie Hohenzollern (94 sarcophages royaux). Endommagée 1944, restaurée après réunification allemande. Orgue Sauer de 7000 tuyaux. Elle incarne protestantisme prussien, pouvoir impérial Hohenzollern et réunification allemande. Vue panoramique exceptionnelle depuis dôme sur Berlin.',
    points: 70,
    coordinates: [13.4013, 52.5191],
    imageUrl: '/src/assets/places/berlin-cathedral.jpg'
  },
  
  // Greece
  {
    id: 'grc-3',
    name: 'Monastère de Meteora',
    country: 'Greece',
    city: 'Meteora',
    type: 'Monastères orthodoxes',
    description: 'Ensemble unique de 6 monastères orthodoxes (sur 24 originels) perchés sur pitons rocheux vertigineux de 400m. Fondés XIVe siècle par moines ermites fuyant invasions turques. Accès initial par échelles et paniers hissés. Architecture byzantine intégrée à falaises naturelles. Fresques post-byzantines XVIe siècle. Patrimoine UNESCO double (culturel et naturel). Ils incarnent ascétisme orthodoxe, prouesse architecturale défiant gravité et harmonie homme-nature. Site spirituel et touristique majeur de Grèce.',
    points: 90,
    coordinates: [21.6309, 39.7217],
    imageUrl: '/src/assets/places/meteora-monasteries.jpg'
  },
  
  // Finland
  {
    id: 'fin-1',
    name: 'Cathédrale d\'Helsinki',
    country: 'Finland',
    city: 'Helsinki',
    type: 'Église luthérienne',
    description: 'Tuomiokirkko (1852), cathédrale luthérienne néoclassique blanche dominant place du Sénat. Architecture inspirée Saint-Isaac de Saint-Pétersbourg. Dôme vert et 4 coupoles, 12 statues apôtres sur toit. Conçue par Carl Ludvig Engel sous domination russe. Symbole national finlandais, lieu cérémonies d\'État. Elle incarne luthéranisme nordique, période Grand-Duché russe et identité architecturale Helsinki. Icône photographique Finlande avec ses escaliers monumentaux.',
    points: 65,
    coordinates: [24.9524, 60.1699],
    imageUrl: '/src/assets/places/helsinki-cathedral.jpg'
  },
  
  // Ethiopia
  {
    id: 'eth-2',
    name: 'Monastère de Debre Damo',
    country: 'Ethiopia',
    city: 'Debre Damo',
    type: 'Monastère orthodoxe',
    description: 'Monastère orthodoxe éthiopien (VIe siècle) perché sur plateau montagneux isolé accessible uniquement par corde de 15m (femmes interdites). Fondé par Saint Abuna Aregawi. Plus ancien monastère éthiopien intact. Architecture aksumite unique : bois et pierre, plafond sculpté style yéménite. Manuscrits enluminés précieux. Communauté monastique vivante depuis 1500 ans. Il incarne orthodoxie éthiopienne Tewahedo, isolement ascétique extrême et préservation traditions chrétiennes africaines ancestrales.',
    points: 85,
    coordinates: [39.2833, 14.3833],
    imageUrl: '/src/assets/places/debre-damo.jpg'
  },
  
  // United States
  {
    id: 'usa-5',
    name: 'Cathédrale Riverside Church',
    country: 'United States',
    city: 'New York',
    type: 'Église protestante',
    description: 'Église interconfessionnelle protestante (1930) néo-gothique à Harlem, Manhattan. Tour de 120m, 74 cloches carillon (plus grand monde). Architecture inspirée Cathédrale Chartres. Financement John D. Rockefeller Jr. Lieu prédications Martin Luther King Jr., Nelson Mandela, Fidel Castro. Engagement social, justice raciale et paix. Elle incarne protestantisme libéral américain, activisme social chrétien et dialogue interreligieux. Vue panoramique sur Manhattan depuis tour.',
    points: 70,
    coordinates: [-73.9632, 40.8112],
    imageUrl: '/src/assets/places/riverside-church.jpg'
  },
  
  // Romania
  {
    id: 'rou-1',
    name: 'Cathédrale du Salut du Peuple',
    country: 'Romania',
    city: 'Bucharest',
    type: 'Cathédrale orthodoxe',
    description: 'Plus grande cathédrale orthodoxe au monde (2018), Catedrala Mântuirii Neamului culmine à 120m avec dôme de 25m. Architecture néo-byzantine roumaine monumentale. Construction controversée (500 millions €) sous pression Église orthodoxe roumaine. Capacité 5000 fidèles. Fresques byzantines modernes couvrant 25 000m². Elle symbolise renouveau orthodoxe post-communiste, nationalisme religieux roumain et puissance Église orthodoxe. Débats sur coût durant austérité économique.',
    points: 75,
    coordinates: [26.0952, 44.4283],
    imageUrl: '/src/assets/places/bucharest-cathedral.jpg'
  },
  
  // Iceland
  {
    id: 'isl-1',
    name: 'Église Hallgrímskirkja',
    country: 'Iceland',
    city: 'Reykjavik',
    type: 'Église luthérienne',
    description: 'Église luthérienne (1945-1986) au design expressionniste unique inspiré des orgues basaltiques islandais. Tour de 74m dominant Reykjavik. Architecture moderne brutaliste de Guðjón Samúelsson. Orgue Klais de 5275 tuyaux, 25 tonnes. Elle honore poète Hallgrímur Pétursson (XVIIe). Symbole national Islande, visible de toute la capitale. Elle incarne luthéranisme islandais, architecture nordique moderne et identité nationale. Point de vue panoramique sur Reykjavik et océan.',
    points: 70,
    coordinates: [-21.9266, 64.1420],
    imageUrl: '/src/assets/places/hallgrimskirkja.jpg'
  },
  
  // Bulgaria
  {
    id: 'bgr-1',
    name: 'Cathédrale Alexandre-Nevski',
    country: 'Bulgaria',
    city: 'Sofia',
    type: 'Cathédrale orthodoxe',
    description: 'Cathédrale orthodoxe (1882-1912), symbole de Sofia et Bulgarie. Architecture néo-byzantine avec 12 dômes dorés, le principal culminant à 45m. Capacité 5000 fidèles. Construite en mémoire 200 000 soldats russes morts libération Bulgarie du joug ottoman (1877-78). Icônes, fresques et marbres précieux. Plus grande cathédrale péninsule balkanique. Elle incarne orthodoxie bulgare, gratitude envers Russie libératrice et renaissance nationale bulgare post-ottomane.',
    points: 75,
    coordinates: [23.3331, 42.6966],
    imageUrl: '/src/assets/places/sofia-cathedral.jpg'
  },
  
  // Norway
  {
    id: 'nor-2',
    name: 'Stavkirke de Borgund',
    country: 'Norway',
    city: 'Borgund',
    type: 'Église médiévale en bois',
    description: 'Stavkirke (église en bois debout) la mieux préservée de Norvège (1180-1250). Architecture viking christianisé unique : bois de pin, toits superposés, sculptures dragons nordiques. 28 stavkirker survivent sur 1000-2000 originelles. Technique construction poteaux ancrés sur pierres (anti-pourriture). Conversion Vikings christianisme Xe-XIIe siècles. Patrimoine UNESCO. Elle incarne transition paganisme-christianisme nordique, génie artisanal viking et architecture bois médiévale unique au monde.',
    points: 80,
    coordinates: [7.5467, 61.0403],
    imageUrl: '/src/assets/places/borgund-stave.jpg'
  },
  {
    id: 'nor-3',
    name: 'Cathédrale de Nidaros',
    country: 'Norway',
    city: 'Trondheim',
    type: 'Cathédrale',
    description: 'Cathédrale gothique (1070-1300) construite sur tombeau Saint Olaf, roi patron de Norvège. Plus important édifice médiéval Scandinavie. Lieu couronnement rois norvégiens. Destination pèlerinage nordique majeure (Chemin Saint-Olaf). Façade occidentale sculptée somptueuse. Détruite incendies, restaurée XIXe-XXe. Elle incarne christianisation Norvège, monarchie sacrée nordique et patrimoine médiéval scandinave.',
    points: 70,
    coordinates: [10.3951, 63.4270],
    imageUrl: '/src/assets/places/nidaros-cathedral.jpg'
  },
  
  // ========== ADDITIONAL EUROPEAN MONUMENTS ==========
  
  // Czech Republic
  {
    id: 'cze-1',
    name: 'Cathédrale Saint-Guy',
    country: 'Czech Republic',
    city: 'Prague',
    type: 'Cathédrale',
    description: 'Joyau gothique du château de Prague (1344-1929), Saint-Guy abrite joyaux couronne tchèque, tombeaux rois de Bohême et reliques Saint Venceslas. Vitraux Art Nouveau Alfons Mucha (1931). Flèches de 96m dominant Prague. Chapelle Saint-Venceslas recouverte pierres précieuses. Lieu couronnement souverains tchèques. Patrimoine UNESCO. Elle incarne histoire tchèque millénaire, identité nationale et foi catholique bohémienne.',
    points: 75,
    coordinates: [14.4003, 50.0910],
    imageUrl: '/src/assets/places/st-vitus-prague.jpg'
  },
  {
    id: 'cze-2',
    name: 'Synagogue Vieille-Nouvelle',
    country: 'Czech Republic',
    city: 'Prague',
    type: 'Synagogue',
    description: 'Plus ancienne synagogue active d\'Europe (1270), la Staronová synagóga gothique est cœur quartier juif Josefov. Légende du Golem créé par Rabbi Loew au XVIe siècle. Communauté juive pragoise florissante avant Shoah (118 000 victimes). Elle symbolise judaïsme ashkénaze médiéval, richesse culturelle juive tchèque et mémoire Shoah. Patrimoine UNESCO.',
    points: 70,
    coordinates: [14.4189, 50.0900],
    imageUrl: '/src/assets/places/old-new-synagogue.jpg'
  },
  {
    id: 'cze-3',
    name: 'Église Saint-Nicolas de Malá Strana',
    country: 'Czech Republic',
    city: 'Prague',
    type: 'Église baroque',
    description: 'Chef-d\'œuvre baroque (1704-1755), l\'église Saint-Nicolas avec dôme de 79m domine quartier Malá Strana. Fresques monumentales, sculptures dorées, orgue joué par Mozart en 1787. Architecture Dientzenhofer père et fils. Trésor baroque tchèque incarnant Contre-Réforme catholique et splendeur baroque bohémien. Concerts classiques réguliers.',
    points: 65,
    coordinates: [14.4038, 50.0881],
    imageUrl: '/src/assets/places/st-nicholas-prague.jpg'
  },
  
  // Belgium
  {
    id: 'bel-1',
    name: 'Cathédrale Saints-Michel-et-Gudule',
    country: 'Belgium',
    city: 'Brussels',
    type: 'Cathédrale',
    description: 'Cathédrale gothique (1226-1519) de Bruxelles, lieu mariages royaux belges et cérémonies nationales. Vitraux Renaissance exceptionnels XVIe siècle. Tours jumelles de 69m. Chaire baroque Jean-François van Geel (1699). Elle symbolise catholicisme belge, monarchie constitutionnelle et unité nationale belge. Patrimoine architectural bruxellois majeur.',
    points: 65,
    coordinates: [4.3604, 50.8479],
    imageUrl: '/src/assets/places/brussels-cathedral.jpg'
  },
  {
    id: 'bel-2',
    name: 'Basilique du Sacré-Cœur de Bruxelles',
    country: 'Belgium',
    city: 'Brussels',
    type: 'Basilique',
    description: 'Une des plus grandes églises monde (1905-1970), basilique Art Déco avec dôme vert de 89m culminant à 164m d\'altitude sur plateau Koekelberg. Capacité 3500 fidèles. Architecture unique mêlant Art Déco et néo-gothique. Vue panoramique sur Bruxelles. Elle incarne ambition architecturale belge XXe siècle et foi catholique flamande.',
    points: 70,
    coordinates: [4.3275, 50.8670],
    imageUrl: '/src/assets/places/sacre-coeur-brussels.jpg'
  },
  {
    id: 'bel-3',
    name: 'Cathédrale Notre-Dame d\'Anvers',
    country: 'Belgium',
    city: 'Antwerp',
    type: 'Cathédrale',
    description: 'Plus grande église gothique Pays-Bas (1352-1521), cathédrale d\'Anvers avec flèche de 123m abrite 4 chefs-d\'œuvre Rubens dont "La Descente de Croix". 49 cloches carillon. Patrimoine UNESCO. Elle symbolise richesse commerciale Anvers baroque, génie Rubens et catholicisme flamand. Trésor d\'art religieux exceptionnel.',
    points: 70,
    coordinates: [4.4010, 51.2206],
    imageUrl: '/src/assets/places/antwerp-cathedral.jpg'
  },
  {
    id: 'bel-4',
    name: 'Cathédrale Saint-Bavon',
    country: 'Belgium',
    city: 'Ghent',
    type: 'Cathédrale',
    description: 'Cathédrale gothique et romane (Xe-XVIe) abritant le retable mystique "L\'Agneau mystique" des frères Van Eyck (1432), chef-d\'œuvre absolu art flamand primitif. 24 panneaux restaurés récemment. Crypte romane XIe siècle. Chaire baroque rococo. Elle incarne splendeur Gand médiéval, Renaissance flamande et patrimoine artistique belge inestimable.',
    points: 75,
    coordinates: [3.7266, 51.0537],
    imageUrl: '/src/assets/places/ghent-cathedral.jpg'
  },
  {
    id: 'bel-5',
    name: 'Basilique Notre-Dame de Tongres',
    country: 'Belgium',
    city: 'Tongeren',
    type: 'Basilique',
    description: 'Basilique gothique (1240-1541) de plus ancienne ville Belgique. Trésor exceptionnel d\'orfèvrerie médiévale mosane. Cloître roman, statue miraculeuse Notre-Dame de Tongres (pèlerinage). Tour de 64m. Elle incarne art mosan, christianisation primitive Belgique et tradition mariale limbourgeoise.',
    points: 60,
    coordinates: [5.4646, 50.7804],
    imageUrl: '/src/assets/places/tongeren-basilica.jpg'
  },
  
  // Denmark
  {
    id: 'dnk-1',
    name: 'Cathédrale de Roskilde',
    country: 'Denmark',
    city: 'Roskilde',
    type: 'Cathédrale',
    description: 'Cathédrale gothique brique (1170-1280), panthéon royal danois abritant 39 rois et reines depuis 1536. Patrimoine UNESCO, première cathédrale gothique brique Scandinavie, influençant architecture nordique. Orgue baroque, chapelles Renaissance. Elle incarne monarchie millénaire danoise, luthéranisme nordique et identité nationale danoise.',
    points: 70,
    coordinates: [12.0806, 55.6419],
    imageUrl: '/src/assets/places/roskilde-cathedral.jpg'
  },
  {
    id: 'dnk-2',
    name: 'Église de Marbre',
    country: 'Denmark',
    city: 'Copenhagen',
    type: 'Église',
    description: 'Frederiks Kirke (1749-1894), église baroque luthérienne avec dôme de 31m inspiré Saint-Pierre Rome. Architecture néoclassique danoise monumentale. Statues 12 apôtres et figures religieuses. Lieu mariages royaux danois. Elle symbolise âge d\'or danois, monarchie absolue et architecture néoclassique nordique.',
    points: 65,
    coordinates: [12.5860, 55.6846],
    imageUrl: '/src/assets/places/marble-church-copenhagen.jpg'
  },
  {
    id: 'dnk-3',
    name: 'Cathédrale d\'Aarhus',
    country: 'Denmark',
    city: 'Aarhus',
    type: 'Cathédrale',
    description: 'Plus longue et haute église Danemark (1201-1520), cathédrale gothique brique de 93m. Fresques médiévales redécouvertes après Réforme. Retable triptyque doré Renaissance (1479). Orgue moderne. Elle incarne catholicisme médiéval danois, Réforme luthérienne et patrimoine Jylland.',
    points: 60,
    coordinates: [10.2105, 56.1575],
    imageUrl: '/src/assets/places/aarhus-cathedral.jpg'
  },
  
  // Ireland  
  {
    id: 'irl-1',
    name: 'Cathédrale Saint-Patrick',
    country: 'Ireland',
    city: 'Dublin',
    type: 'Cathédrale',
    description: 'Cathédrale nationale anglicane Irlande (1191-1270), Saint-Patrick honore saint patron Irlande ayant christianisé île Ve siècle. Jonathan Swift y fut doyen (1713-1745), enterré dans cathédrale. Architecture gothique victorienne restaurée. Lieu cérémonies nationales irlandaises. Elle incarne christianisation Irlande, littérature irlandaise et coexistence confessionnelle post-indépendance.',
    points: 65,
    coordinates: [-6.2714, 53.3394],
    imageUrl: '/src/assets/places/st-patrick-dublin.jpg'
  },
  {
    id: 'irl-2',
    name: 'Cathédrale Christ Church',
    country: 'Ireland',
    city: 'Dublin',
    type: 'Cathédrale',
    description: 'Plus ancienne cathédrale Dublin (1030), fondée Vikings, reconstruite Normands XIIe. Architecture médiévale restaurée XIXe. Crypte médiévale plus grande Irlande-Angleterre. Pont couvert vers Synod Hall. Lieu couronnement Lambert Simnel (1487). Elle symbolise Dublin viking et normand, Église d\'Irlande et histoire médiévale irlandaise.',
    points: 65,
    coordinates: [-6.2713, 53.3432],
    imageUrl: '/src/assets/places/christ-church-dublin.jpg'
  },
  {
    id: 'irl-3',
    name: 'Abbaye de Kylemore',
    country: 'Ireland',
    city: 'Connemara',
    type: 'Abbaye',
    description: 'Abbaye bénédictine (1920) dans château néo-gothique romantique (1868) au bord lac Connemara. Église néo-gothique miniature réplique cathédrale Norwich. Jardins victoriens restaurés. Communauté bénédictine vivante. Elle incarne romantisme victorien, foi bénédictine et beauté sauvage irlandaise. Icône touristique Connemara.',
    points: 60,
    coordinates: [-9.8908, 53.5604],
    imageUrl: '/src/assets/places/kylemore-abbey.jpg'
  },
  {
    id: 'irl-4',
    name: 'Abbaye de Clonmacnoise',
    country: 'Ireland',
    city: 'Clonmacnoise',
    type: 'Site monastique',
    description: 'Site monastique majeur (544) fondé Saint Ciarán sur Shannon. Centre d\'érudition européen VIe-XIIe siècles. Tours rondes, croix celtiques sculptées, églises médiévales en ruines. Nécropole rois irlandais. Raids vikings, suppression anglaise. Patrimoine national. Il incarne âge d\'or monastique irlandais, érudition celtique et christianisme gaélique.',
    points: 70,
    coordinates: [-7.9879, 53.3267],
    imageUrl: '/src/assets/places/clonmacnoise.jpg'
  },
  
  // Switzerland
  {
    id: 'che-1',
    name: 'Cathédrale de Lausanne',
    country: 'Switzerland',
    city: 'Lausanne',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre gothique suisse (1170-1275), cathédrale protestante depuis Réforme 1536. Portail peint XIIIe, rosace de 9m, crypte. Guetteur annonce heures chaque nuit depuis 1405, tradition unique mondiale. Elle incarne transition catholique-protestant, Réforme calviniste et patrimoine vaudois.',
    points: 65,
    coordinates: [6.6356, 46.5225],
    imageUrl: '/src/assets/places/lausanne-cathedral.jpg'
  },
  {
    id: 'che-2',
    name: 'Abbaye de Saint-Gall',
    country: 'Switzerland',
    city: 'Saint Gallen',
    type: 'Abbaye',
    description: 'Abbaye bénédictine (719), centre culturel européen majeur Moyen Âge. Bibliothèque baroque (1758) patrimoine UNESCO : 170 000 volumes, 2100 manuscrits médiévaux dont plan monastique carolingien plus ancien (820). Architecture baroque rococo. Elle incarne érudition monastique médiévale, Réforme suisse et transmission savoir millénaire.',
    points: 75,
    coordinates: [9.3767, 47.4239],
    imageUrl: '/src/assets/places/st-gallen-abbey.jpg'
  },
  {
    id: 'che-3',
    name: 'Cathédrale de Berne',
    country: 'Switzerland',
    city: 'Bern',
    type: 'Cathédrale',
    description: 'Cathédrale gothique tardif (1421-1893), plus haute flèche Suisse (100m). Protestante depuis Réforme 1528. Portail Jugement Dernier avec 234 figures sculptées. Vitraux XIXe. Vue panoramique Alpes. Elle symbolise Réforme bernoise, confédération suisse et identité protestante alémanique.',
    points: 60,
    coordinates: [7.4513, 46.9472],
    imageUrl: '/src/assets/places/bern-cathedral.jpg'
  },
  {
    id: 'che-4',
    name: 'Abbaye d\'Einsiedeln',
    country: 'Switzerland',
    city: 'Einsiedeln',
    type: 'Abbaye',
    description: 'Abbaye bénédictine baroque (934), pèlerinage marial majeur Suisse. Statue Vierge Noire miraculeuse. Église baroque somptueuse (1719-1735), fresques, stucs. Bibliothèque 230 000 volumes. Communauté monastique active. Elle incarne dévotion mariale suisse, baroque alpin et tradition bénédictine millénaire.',
    points: 70,
    coordinates: [8.7462, 47.1279],
    imageUrl: '/src/assets/places/einsiedeln-abbey.jpg'
  },
  
  // Croatia
  {
    id: 'hrv-1',
    name: 'Cathédrale de Zagreb',
    country: 'Croatia',
    city: 'Zagreb',
    type: 'Cathédrale',
    description: 'Cathédrale gothique (1093-1217) avec flèches néo-gothiques de 108m (1880) dominant Zagreb. Trésor médiéval exceptionnel. Endommagée séisme 2020, en restauration. Lieu couronnement rois croato-hongrois. Elle symbolise catholicisme croate, identité nationale et résilience face envahisseurs ottomans.',
    points: 65,
    coordinates: [15.9795, 45.8144],
    imageUrl: '/src/assets/places/zagreb-cathedral.jpg'
  },
  {
    id: 'hrv-2',
    name: 'Cathédrale Saint-Jacques de Šibenik',
    country: 'Croatia',
    city: 'Sibenik',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre Renaissance (1431-1535), entièrement pierre sans bois ni brique. 71 têtes sculptées citoyens XVe siècle sur abside. Architecture Juraj Dalmatinac. Patrimoine UNESCO. Elle incarne Renaissance dalmate, indépendance Šibenik et génie sculpteurs croates.',
    points: 70,
    coordinates: [15.8956, 43.7350],
    imageUrl: '/src/assets/places/sibenik-cathedral.jpg'
  },
  {
    id: 'hrv-3',
    name: 'Cathédrale de l\'Assomption de Dubrovnik',
    country: 'Croatia',
    city: 'Dubrovnik',
    type: 'Cathédrale',
    description: 'Cathédrale baroque (1672-1713) reconstruite après séisme 1667. Trésor reliquaires or et argent byzantins, dont crâne Saint Blaise patron Dubrovnik. Tableaux Titien, Raphaël. Elle symbolise République Raguse (Dubrovnik), commerce méditerranéen et résilience face catastrophes.',
    points: 65,
    coordinates: [18.1108, 42.6414],
    imageUrl: '/src/assets/places/dubrovnik-cathedral.jpg'
  },
  
  // Serbia
  {
    id: 'srb-1',
    name: 'Cathédrale Saint-Sava',
    country: 'Serbia',
    city: 'Belgrade',
    type: 'Cathédrale orthodoxe',
    description: 'Plus grande église orthodoxe monde (1935-2004), Saint-Sava domine Belgrade avec dôme de 70m pesant 4000 tonnes. Dédiée fondateur église serbe autocéphale (XIIIe). Architecture néo-byzantine monumentale blanche. Mosaïques dorées intérieures. Elle incarne orthodoxie serbe, nationalisme religieux et renaissance post-communiste. Symbole Belgrade.',
    points: 80,
    coordinates: [20.4689, 44.7982],
    imageUrl: '/src/assets/places/st-sava-belgrade.jpg'
  },
  {
    id: 'srb-2',
    name: 'Monastère de Studenica',
    country: 'Serbia',
    city: 'Studenica',
    type: 'Monastère',
    description: 'Monastère orthodoxe (1190), berceau école fresques serbes médiévales. Fondé Stefan Nemanja, fondateur dynastie Nemanjić. Églises marbre blanc byzantines, fresques XIIIe-XIVe chefs-d\'œuvre. Patrimoine UNESCO. Il incarne médiéval serbe, orthodoxie balkanique et identité nationale serbe millénaire.',
    points: 70,
    coordinates: [20.5350, 43.4894],
    imageUrl: '/src/assets/places/studenica-monastery.jpg'
  },
  
  // Lithuania
  {
    id: 'ltu-1',
    name: 'Cathédrale de Vilnius',
    country: 'Lithuania',
    city: 'Vilnius',
    type: 'Cathédrale',
    description: 'Cathédrale néoclassique (1783) sur site temple païen Perkūnas. Lieu baptême Lituanie 1387 (dernier pays européen christianisé). Crypte royale, chapelle Saint-Casimir baroque. Clocher séparé 57m. Elle incarne christianisation tardive Lituanie, catholicisme lituanien et résistance soviétique (messe clandestine).',
    points: 65,
    coordinates: [25.2878, 54.6859],
    imageUrl: '/src/assets/places/vilnius-cathedral.jpg'
  },
  {
    id: 'ltu-2',
    name: 'Église Sainte-Anne',
    country: 'Lithuania',
    city: 'Vilnius',
    type: 'Église',
    description: 'Chef-d\'œuvre gothique flamboyant brique rouge (1495-1500), 33 types briques différentes. Façade dentelle pierre admirée Napoléon (aurait voulu l\'emporter à Paris). Architecture gothique balte unique. Patrimoine UNESCO Vilnius. Elle incarne artisanat lituanien, gothique tardif et beauté architecturale ville baroque.',
    points: 70,
    coordinates: [25.2970, 54.6837],
    imageUrl: '/src/assets/places/st-anne-vilnius.jpg'
  },
  
  // Latvia
  {
    id: 'lva-1',
    name: 'Cathédrale du Dôme de Riga',
    country: 'Latvia',
    city: 'Riga',
    type: 'Cathédrale',
    description: 'Plus grande église médiévale États baltes (1211), cathédrale luthérienne. Architecture mêlant roman, gothique, baroque. Orgue monumental 6718 tuyaux (1884), un des plus grands Europe. Cloître médiéval, musée Histoire Riga. Elle incarne conquête germanique Livonie, Réforme balte et identité lettone.',
    points: 65,
    coordinates: [24.1045, 56.9496],
    imageUrl: '/src/assets/places/riga-cathedral.jpg'
  },
  {
    id: 'lva-2',
    name: 'Église Saint-Pierre',
    country: 'Latvia',
    city: 'Riga',
    type: 'Église',
    description: 'Église gothique brique (1209) avec flèche baroque de 123m dominant Riga. Plateforme observation panoramique. Détruite WWII, reconstruite ère soviétique. Architecture gothique balte hanséatique. Patrimoine UNESCO centre historique. Elle symbolise Ligue hanséatique, commerce balte et reconstruction post-guerre.',
    points: 60,
    coordinates: [24.1091, 56.9477],
    imageUrl: '/src/assets/places/st-peter-riga.jpg'
  },
  
  // Estonia
  {
    id: 'est-1',
    name: 'Cathédrale Alexandre-Nevski',
    country: 'Estonia',
    city: 'Tallinn',
    type: 'Cathédrale orthodoxe',
    description: 'Cathédrale orthodoxe russe (1900), symbole russification tsariste. Architecture russo-byzantine avec 5 bulbes. Bells 11 cloches. Controversée indépendance estonienne 1991 (débats démolition). Toujours active malgré tensions. Elle incarne occupation russe, minorité orthodoxe Estonie et histoire complexe balto-russe.',
    points: 60,
    coordinates: [24.7393, 59.4356],
    imageUrl: '/src/assets/places/alexander-nevsky-tallinn.jpg'
  },
  {
    id: 'est-2',
    name: 'Cathédrale Sainte-Marie',
    country: 'Estonia',
    city: 'Tallinn',
    type: 'Cathédrale',
    description: 'Plus ancienne église Estonie (XIIIe), cathédrale luthérienne. Architecture gothique balte, intérieur baroque. Armoiries noblesse balto-allemande. Orgue baroque. Panthéon élite germano-balte. Elle incarne domination germanique médiévale, Réforme luthérienne et stratification sociale Tallinn hanséatique.',
    points: 60,
    coordinates: [24.7450, 59.4367],
    imageUrl: '/src/assets/places/st-mary-tallinn.jpg'
  },
  
  // Slovakia
  {
    id: 'svk-1',
    name: 'Cathédrale Saint-Martin',
    country: 'Slovakia',
    city: 'Bratislava',
    type: 'Cathédrale',
    description: 'Cathédrale gothique (1452) où furent couronnés 11 rois et 8 reines Hongrie (1563-1830) quand Bratislava était capitale. Couronne dorée 150kg sur tour. Crypte royale. Architecture gothique tardif. Elle symbolise royaume Hongrie, monarchie Habsbourg et identité slovaque.',
    points: 65,
    coordinates: [17.1050, 48.1415],
    imageUrl: '/src/assets/places/bratislava-cathedral.jpg'
  },
  {
    id: 'svk-2',
    name: 'Église Sainte-Élisabeth',
    country: 'Slovakia',
    city: 'Bratislava',
    type: 'Église',
    description: 'Église Art Nouveau unique (1913), surnommée "Église Bleue" pour ses façades bleu pastel et mosaïques bleues. Architecture Ödön Lechner style Sécession hongroise. Dédiée Sainte Élisabeth Hongrie. Elle incarne modernisme centre-européen, Art Nouveau et patrimoine austro-hongrois.',
    points: 60,
    coordinates: [17.1180, 48.1402],
    imageUrl: '/src/assets/places/blue-church-bratislava.jpg'
  },
  
  // Slovenia
  {
    id: 'svn-1',
    name: 'Cathédrale Saint-Nicolas',
    country: 'Slovenia',
    city: 'Ljubljana',
    type: 'Cathédrale',
    description: 'Cathédrale baroque (1707-1706) sur site église romane XIIIe. Fresques baroques Giulio Quaglio. Portes bronze modernes (1996) : 1250 ans christianisme slovène. Elle incarne Contre-Réforme catholique, baroque alpin et identité slovène catholique face protestantisme germanique.',
    points: 60,
    coordinates: [14.5068, 46.0505],
    imageUrl: '/src/assets/places/ljubljana-cathedral.jpg'
  },
  {
    id: 'svn-2',
    name: 'Île de Bled',
    country: 'Slovenia',
    city: 'Bled',
    type: 'Église de pèlerinage',
    description: 'Église baroque (1698) sur île lac Bled, unique île naturelle Slovénie. Accessible barques traditionnelles pletna. Cloche des vœux, escalier 99 marches, tradition marié porte mariée. Lieu mariage romantique. Elle incarne paysage alpin slovène, traditions locales et tourisme romantique.',
    points: 65,
    coordinates: [14.0993, 46.3686],
    imageUrl: '/src/assets/places/bled-island.jpg'
  },
  
  // Albania
  {
    id: 'alb-1',
    name: 'Cathédrale de la Résurrection',
    country: 'Albania',
    city: 'Tirana',
    type: 'Cathédrale orthodoxe',
    description: 'Cathédrale orthodoxe (2012), troisième plus grande Balkans. Construite après chute régime communiste athée Enver Hoxha (1967-1991, religion interdite). Architecture néo-byzantine moderne. Elle symbolise renaissance religieuse post-communiste, liberté culte et renouveau orthodoxe albanais.',
    points: 60,
    coordinates: [19.8227, 41.3275],
    imageUrl: '/src/assets/places/tirana-cathedral.jpg'
  },
  
  // Luxembourg
  {
    id: 'lux-1',
    name: 'Cathédrale Notre-Dame',
    country: 'Luxembourg',
    city: 'Luxembourg',
    type: 'Cathédrale',
    description: 'Cathédrale gothique tardif (1613-1621) devenue cathédrale 1870. Architecture gothique Renaissance. Notre-Dame Consolatrice Affligés, patronne Luxembourg, statue miraculeuse pèlerinage. Tombeaux famille grand-ducale. Elle incarne catholicisme luxembourgeois, dynastie grand-ducale et petite nation européenne.',
    points: 55,
    coordinates: [6.1319, 49.6095],
    imageUrl: '/src/assets/places/luxembourg-cathedral.jpg'
  },
  
  // Malta
  {
    id: 'mlt-1',
    name: 'Co-Cathédrale Saint-Jean',
    country: 'Malta',
    city: 'Valletta',
    type: 'Cathédrale',
    description: 'Cathédrale baroque (1577) Ordre Malte, trésor art baroque méditerranéen. Sol marbre avec 400 tombes chevaliers. Voûtes peintes Mattia Preti. Oratoire abrite 2 Caravage dont "Décollation Saint Jean-Baptiste". Elle incarne Ordre Malte, Contre-Réforme et richesse baroque insulaire. Patrimoine UNESCO Valletta.',
    points: 75,
    coordinates: [14.5116, 35.8978],
    imageUrl: '/src/assets/places/st-john-valletta.jpg'
  },
  
  // Cyprus
  {
    id: 'cyp-1',
    name: 'Monastère de Kykkos',
    country: 'Cyprus',
    city: 'Kykkos',
    type: 'Monastère orthodoxe',
    description: 'Monastère orthodoxe (1100) montagnes Troodos, plus riche Chypre. Icône miraculeuse Vierge attribuée Saint Luc. Mosaïques dorées byzantines modernes. Musée byzantin. Lieu naissance Makarios III, premier président Chypre. Il incarne orthodoxie chypriote, résistance ottomane et identité grecque-chypriote.',
    points: 65,
    coordinates: [32.7417, 34.9824],
    imageUrl: '/src/assets/places/kykkos-monastery.jpg'
  },
  
  // Additional French monuments
  {
    id: 'fra-13',
    name: 'Basilique Notre-Dame de la Garde',
    country: 'France',
    city: 'Marseille',
    type: 'Basilique',
    description: 'Basilique romano-byzantine (1864) dominant Marseille et Méditerranée depuis colline 162m. Statue dorée Vierge de 11m ("Bonne Mère"). Mosaïques intérieures somptueuses. Ex-voto marins. Elle incarne protection maritime, dévotion mariale provençale et identité marseillaise. Vue panoramique exceptionnelle.',
    points: 65,
    coordinates: [5.3716, 43.2842],
    imageUrl: '/src/assets/places/notre-dame-garde.jpg'
  },
  {
    id: 'fra-14',
    name: 'Basilique Saint-Denis',
    country: 'France',
    city: 'Saint-Denis',
    type: 'Basilique',
    description: 'Nécropole royale française (639-1824), Saint-Denis abrite 42 rois, 32 reines, 63 princes dans 70 gisants et tombeaux sculptés. Première église gothique monde (1135-1144) Suger. Profanée Révolution 1793. Patrimoine UNESCO. Elle incarne monarchie française millénaire, art funéraire royal et naissance architecture gothique.',
    points: 80,
    coordinates: [2.3599, 48.9356],
    imageUrl: '/src/assets/places/st-denis-basilica.jpg'
  },
  {
    id: 'fra-15',
    name: 'Abbaye du Mont-Saint-Odile',
    country: 'France',
    city: 'Ottrott',
    type: 'Abbaye',
    description: 'Abbaye (680) perchée 763m Vosges, fondée Sainte Odile patronne Alsace. Pèlerinage alsacien majeur. Vue panoramique plaine Alsace, Forêt-Noire. Mur païen énigmatique 11km. Chapelle tombeaux, source miraculeuse. Elle incarne christianisation Alsace, dévotion alsacienne et identité régionale.',
    points: 60,
    coordinates: [7.4049, 48.4374],
    imageUrl: '/src/assets/places/mont-sainte-odile.jpg'
  },
  {
    id: 'fra-16',
    name: 'Cathédrale Notre-Dame de Rouen',
    country: 'France',
    city: 'Rouen',
    type: 'Cathédrale',
    description: 'Cathédrale gothique normande (1020-1506), immortalisée par Monet (30 tableaux "Cathédrales"). Flèche fonte 151m, plus haute France jusqu\'à Tour Eiffel. Tombeaux ducs Normandie dont cœur Richard Cœur de Lion. Vitraux XIIIe. Elle incarne gothique normand, conquête Angleterre et art impressionniste.',
    points: 70,
    coordinates: [1.0939, 49.4404],
    imageUrl: '/src/assets/places/rouen-cathedral.jpg'
  },
  {
    id: 'fra-17',
    name: 'Basilique Notre-Dame de Fourvière',
    country: 'France',
    city: 'Lyon',
    type: 'Basilique',
    description: 'Basilique romano-byzantine (1872-1896) dominant Lyon depuis colline Fourvière. Architecture éclectique, mosaïques dorées, vitraux Art Nouveau. Construite vœu épidémie 1643 et vœu guerre 1870. Vue panoramique Lyon, Alpes. Elle incarne dévotion mariale lyonnaise, Vierge sauvant ville des fléaux et identité lyonnaise.',
    points: 65,
    coordinates: [4.8227, 45.7622],
    imageUrl: '/src/assets/places/fourviere-lyon.jpg'
  },
  {
    id: 'fra-18',
    name: 'Cathédrale Saint-Jean de Lyon',
    country: 'France',
    city: 'Lyon',
    type: 'Cathédrale',
    description: 'Cathédrale primatiale romano-gothique (1180-1480), siège de l\'archevêque primant des Gaules. Horloge astronomique du XIVe siècle, automate sonnant à midi. Vitraux médiévaux remarquables, rosace du transept. Lieu du Concile de Lyon 1245 et 1274. Elle incarne pouvoir religieux lyonnais et patrimoine architectural vieux Lyon.',
    points: 60,
    coordinates: [4.8269, 45.7608],
    imageUrl: '/src/assets/places/lyon-cathedral.jpg'
  },
  {
    id: 'fra-19',
    name: 'Abbaye Saint-Martin d\'Ainay',
    country: 'France',
    city: 'Lyon',
    type: 'Abbaye',
    description: 'Basilique romane du XIIe siècle, plus ancien édifice religieux de Lyon encore debout. Architecture romane auvergnate exceptionnelle, colonnes antiques romaines réutilisées. Mosaïque choeur Byzantine. Patrimoine UNESCO. Elle témoigne continuité spirituelle Lyon depuis époque romaine et art roman lyonnais.',
    points: 55,
    coordinates: [4.8275, 45.7504],
    imageUrl: '/src/assets/places/ainay-lyon.jpg'
  },
  {
    id: 'fra-20',
    name: 'Église Saint-Paul de Lyon',
    country: 'France',
    city: 'Lyon',
    type: 'Église',
    description: 'Église néo-gothique (1872) quartier Vaise, flèche élancée 70m. Architecture néo-gothique remarquable, vitraux colorés, orgue Cavaillé-Coll. Elle incarne renouveau architectural religieux XIXe siècle Lyon et expansion urbaine quartiers nord.',
    points: 50,
    coordinates: [4.8040, 45.7705],
    imageUrl: '/src/assets/places/st-paul-lyon.jpg'
  },
  {
    id: 'fra-21',
    name: 'Cathédrale Saint-André de Bordeaux',
    country: 'France',
    city: 'Bordeaux',
    type: 'Cathédrale',
    description: 'Cathédrale gothique (XIIe-XVIe siècles), lieu du mariage d\'Aliénor d\'Aquitaine avec Louis VII en 1137. Tours jumelles 81m, portail royal sculpté XIIIe. Patrimoine UNESCO. Orgue monumental. Elle symbolise pouvoir royal, spiritualité aquitaine et mariage unissant France et Aquitaine.',
    points: 65,
    coordinates: [-0.5765, 44.8378],
    imageUrl: '/src/assets/places/bordeaux-cathedral.jpg'
  },
  {
    id: 'fra-22',
    name: 'Basilique Saint-Michel de Bordeaux',
    country: 'France',
    city: 'Bordeaux',
    type: 'Basilique',
    description: 'Chef-d\'œuvre gothique flamboyant (XIVe-XVIe siècles), flèche séparée 114m plus haute tour-clocher France. Architecture gothique méridional, portail nord sculpté. Momies découvertes crypte XIXe siècle. Patrimoine UNESCO. Elle incarne art gothique aquitain et dévotion populaire bordelaise.',
    points: 60,
    coordinates: [-0.5639, 44.8321],
    imageUrl: '/src/assets/places/st-michel-bordeaux.jpg'
  },
  {
    id: 'fra-23',
    name: 'Basilique Saint-Seurin de Bordeaux',
    country: 'France',
    city: 'Bordeaux',
    type: 'Basilique',
    description: 'Basilique romane (XIe siècle) sur nécropole paléochrétienne IVe siècle. Crypte archéologique exceptionnelle, sarcophages mérovingiens, chapiteaux romans. Étape chemin Saint-Jacques. Patrimoine UNESCO. Elle témoigne christianisation précoce Aquitaine et continuité cultuelle 1600 ans.',
    points: 55,
    coordinates: [-0.5889, 44.8485],
    imageUrl: '/src/assets/places/st-seurin-bordeaux.jpg'
  },
  {
    id: 'fra-24',
    name: 'Église Sainte-Croix de Bordeaux',
    country: 'France',
    city: 'Bordeaux',
    type: 'Église',
    description: 'Abbaye bénédictine romane (VIIe siècle), reconstruite style roman-byzantin XIXe. Façade sculptée remarquable, orgue Cavaillé-Coll 1865. Architecture éclectique unique Bordeaux. Elle illustre renouveau architectural religieux XIXe et patrimoine monastique bordelais.',
    points: 50,
    coordinates: [-0.5603, 44.8327],
    imageUrl: '/src/assets/places/ste-croix-bordeaux.jpg'
  },
  {
    id: 'fra-25',
    name: 'Cathédrale de la Major de Marseille',
    country: 'France',
    city: 'Marseille',
    type: 'Cathédrale',
    description: 'Cathédrale romano-byzantine monumentale (1852-1893), 141m long, dômes 70m. Architecture éclectique marbre vert Florence et Carrare. Une des plus grandes cathédrales France. Orgue Grand-Orgue monumental. Elle symbolise ambition Marseille Second Empire, port méditerranéen et diversité culturelle.',
    points: 65,
    coordinates: [5.3657, 43.2995],
    imageUrl: '/src/assets/places/major-marseille.jpg'
  },
  {
    id: 'fra-26',
    name: 'Abbaye Saint-Victor de Marseille',
    country: 'France',
    city: 'Marseille',
    type: 'Abbaye',
    description: 'Abbaye fortifiée (Ve siècle) fondée Jean Cassien sur tombeaux martyrs chrétiens dont Saint Victor. Crypte paléochrétienne exceptionnelle, sarcophages IIIe-Ve siècles. Architecture romane provençale, allure forteresse. Pèlerinage Chandeleur. Elle témoigne christianisation précoce Marseille et continuité monastique 1600 ans.',
    points: 70,
    coordinates: [5.3646, 43.2904],
    imageUrl: '/src/assets/places/st-victor-marseille.jpg'
  },
  {
    id: 'fra-27',
    name: 'Basilique du Sacré-Cœur de Marseille',
    country: 'France',
    city: 'Marseille',
    type: 'Basilique',
    description: 'Basilique néo-byzantine (1920) sommet colline Périer dominant Marseille. Architecture inspirée Sacré-Cœur Paris, mosaïques, vitraux Art Déco. Construite vœu Grande Guerre. Vue panoramique ville et mer. Elle incarne mémoire combattants marseillais et dévotion populaire provençale.',
    points: 55,
    coordinates: [5.3956, 43.2831],
    imageUrl: '/src/assets/places/sacre-coeur-marseille.jpg'
  },
  {
    id: 'fra-28',
    name: 'Panthéon de Paris',
    country: 'France',
    city: 'Paris',
    type: 'Monument',
    description: 'Monument néo-classique (1758-1790) conçu Soufflot comme église Sainte-Geneviève, transformé nécropole laïque 1791. Architecture inspirée Panthéon Rome, dôme 83m, crypte abritant tombeaux Voltaire, Rousseau, Hugo, Zola, Curie, Malraux, Veil... 80 grands personnages France. Pendule Foucault 1851. Il incarne nation française, mémoire collective, valeurs républicaines et génie national.',
    points: 70,
    coordinates: [2.3462, 48.8462],
    imageUrl: '/src/assets/places/pantheon-paris.jpg'
  },
  {
    id: 'fra-29',
    name: 'Couvent des Jacobins de Toulouse',
    country: 'France',
    city: 'Toulouse',
    type: 'Couvent',
    religion: 'christianity',
    description: 'Chef-d\'œuvre gothique méridional (1230-1385) en brique toulousaine. Église à deux nefs, voûte palmier 28m colonnes centrales. Architecture gothique languedocien unique. Reliques Saint Thomas d\'Aquin. Centre intellectuel dominicain médiéval. Elle incarne ordres mendiants, architecture brique Midi et rayonnement intellectuel Toulouse.',
    points: 60,
    coordinates: [1.4419, 43.6062],
    imageUrl: '/src/assets/places/jacobins-toulouse.jpg'
  },
  {
    id: 'fra-30',
    name: 'Chapelle des Carmélites de Toulouse',
    country: 'France',
    city: 'Toulouse',
    type: 'Chapelle',
    description: 'Chapelle baroque (1643-1652) décors peints plafond trompe-l\'œil exceptionnel Jean-Pierre Rivalz et Jean-Baptiste Despax. Unique ensemble baroque conservé Toulouse. Architecture classique, décors illusionnistes. Elle témoigne Contre-Réforme catholique et baroque toulousain XVIIe siècle.',
    points: 55,
    coordinates: [1.4387, 43.6002],
    imageUrl: '/src/assets/places/carmelites-toulouse.jpg'
  },
  
  // Additional Italian monuments
  {
    id: 'ita-15',
    name: 'Basilique Saint-Antoine de Padoue',
    country: 'Italy',
    city: 'Padua',
    type: 'Basilique',
    description: 'Basilique (1232-1310) abritant reliques Saint Antoine Padoue, langue miraculeusement préservée. Architecture romano-gothique-byzantine 8 dômes. Fresques, bronzes Donatello. Pèlerinage majeur 6,5 millions visiteurs. Elle incarne ordre franciscain, dévotion antonienne et patrimoine Padoue.',
    points: 70,
    coordinates: [11.8812, 45.4015],
    imageUrl: '/src/assets/places/padua-st-anthony.jpg'
  },
  {
    id: 'ita-16',
    name: 'Basilique Saint-François de Ravenne',
    country: 'Italy',
    city: 'Ravenna',
    type: 'Basilique',
    description: 'Basilique (450) où furent célébrées funérailles Dante 1321. Crypte inondée eau de nappe phréatique, poissons rouges. Mosaïques byzantines. Tombe Dante adjacente. Elle incarne capitale byzantine occidentale, mosaïques paléochrétiennes et exil Dante.',
    points: 60,
    coordinates: [12.2035, 44.4184],
    imageUrl: '/src/assets/places/ravenna-basilica.jpg'
  },
  {
    id: 'ita-17',
    name: 'Basilique de la Sainte-Maison',
    country: 'Italy',
    city: 'Loreto',
    type: 'Basilique',
    description: 'Basilique (1469-1587) abritant Santa Casa, maison nazaréenne Vierge Marie miraculeusement transportée anges 1294. Pèlerinage marial majeur. Fortifications Renaissance. Elle incarne dévotion mariale, légende médiévale et foi populaire italienne. Patronne aviateurs.',
    points: 70,
    coordinates: [13.6099, 43.4406],
    imageUrl: '/src/assets/places/loreto-basilica.jpg'
  },
  
  // Additional Spanish monuments
  {
    id: 'esp-11',
    name: 'Cathédrale de la Almudena',
    country: 'Spain',
    city: 'Madrid',
    type: 'Cathédrale',
    description: 'Cathédrale néoclassique (1883-1993) Madrid, consacrée Jean-Paul II 1993. Architecture éclectique mêlant styles. Face Palais Royal. Crypte néo-romane polychrome. Mariage royal 2004. Elle symbolise Madrid capitale, monarchie espagnole moderne et catholicisme madrilène.',
    points: 60,
    coordinates: [-3.7144, 40.4156],
    imageUrl: '/src/assets/places/almudena-cathedral.jpg'
  },
  {
    id: 'esp-12',
    name: 'Monastère de l\'Escurial',
    country: 'Spain',
    city: 'San Lorenzo de El Escorial',
    type: 'Monastère',
    description: 'Complexe monumental Renaissance (1563-1584) Philippe II : monastère, palais, bibliothèque, panthéon rois Espagne. Architecture austère Juan de Herrera. 2673 pièces. Bibliothèque 40 000 volumes, fresques. Patrimoine UNESCO. Il incarne puissance empire espagnol, Contre-Réforme et Siècle d\'Or.',
    points: 80,
    coordinates: [-4.1476, 40.5892],
    imageUrl: '/src/assets/places/el-escorial.jpg'
  },
  {
    id: 'esp-13',
    name: 'Cathédrale de Valence',
    country: 'Spain',
    city: 'Valencia',
    type: 'Cathédrale',
    description: 'Cathédrale gothique (1262-1482) sur mosquée. Abrite Saint Calice (Graal), coupe Cène selon tradition. Mélange roman, gothique, Renaissance, baroque, néoclassique. Clocher Miguelete 51m emblème Valence. Elle incarne Reconquista, relique christique et diversité architecturale valencienne.',
    points: 65,
    coordinates: [-0.3750, 39.4755],
    imageUrl: '/src/assets/places/valencia-cathedral.jpg'
  },
  {
    id: 'esp-14',
    name: 'Cathédrale de Salamanque',
    country: 'Spain',
    city: 'Salamanca',
    type: 'Cathédrale',
    description: 'Deux cathédrales accolées : Vieille (1120) romane, Nouvelle (1513-1733) gothique-Renaissance. Tour 110m. Façade plateresque sculptée. Astronaute sculpté restauration 1992 (anachronisme voulu). Patrimoine UNESCO. Elles incarnent université médiévale, Siècle d\'Or et pierre dorée Salamanque.',
    points: 65,
    coordinates: [-5.6643, 40.9607],
    imageUrl: '/src/assets/places/salamanca-cathedral.jpg'
  },
  
  // Additional German monuments  
  {
    id: 'deu-4',
    name: 'Cathédrale d\'Ulm',
    country: 'Germany',
    city: 'Ulm',
    type: 'Cathédrale',
    description: 'Plus haute flèche église monde (1890) : 161,53m, 768 marches. Gothique (1377-1890). Protestante depuis 1530. Capacité 20 000 personnes. Vitraux modernes. Elle incarne ambition citadine médiévale, Réforme luthérienne et prouesse architecturale gothique.',
    points: 70,
    coordinates: [9.9925, 48.3986],
    imageUrl: '/src/assets/places/ulm-cathedral.jpg'
  },
  {
    id: 'deu-5',
    name: 'Abbaye de Corvey',
    country: 'Germany',
    city: 'Höxter',
    type: 'Abbaye',
    description: 'Abbaye bénédictine (822), centre culturel carolingien. Westwerk carolingien unique (873-885) patrimoine UNESCO. Bibliothèque ducale 74 000 volumes. Tombeau poète Heinrich Hoffmann von Fallersleben (hymne national). Elle incarne Renaissance carolingienne, érudition monastique et patrimoine westphalien.',
    points: 60,
    coordinates: [9.4127, 51.7769],
    imageUrl: '/src/assets/places/corvey-abbey.jpg'
  },
  {
    id: 'deu-6',
    name: 'Église Kaiser-Wilhelm-Gedächtniskirche',
    country: 'Germany',
    city: 'Berlin',
    type: 'Église mémorial',
    description: 'Église néo-romane (1895) bombardée 1943, ruine conservée mémorial guerre. Église moderne bleue adjacente (1963) Egon Eiermann. 20 000 vitraux bleus. Symbole paix, réconciliation. Elle incarne destruction guerre, reconstruction et mémoire pacifiste berlinoise.',
    points: 60,
    coordinates: [13.3355, 52.5050],
    imageUrl: '/src/assets/places/kaiser-wilhelm-church.jpg'
  },
  
  // Additional UK monuments
  {
    id: 'uk-5',
    name: 'Cathédrale Saint-Paul',
    country: 'United Kingdom',
    city: 'London',
    type: 'Cathédrale',
    description: 'Cathédrale baroque anglicane (1675-1710) Christopher Wren. Dôme 111m inspiré Saint-Pierre Rome. Funérailles Churchill, Wellington, Horatio Nelson. Mariage Charles et Diana 1981. Résista Blitz WWII, symbole résilience britannique. Elle incarne anglicanisme, empire britannique et architecture baroque anglaise.',
    points: 75,
    coordinates: [-0.0983, 51.5138],
    imageUrl: '/src/assets/places/st-paul-london.jpg'
  },
  {
    id: 'uk-6',
    name: 'Cathédrale de Durham',
    country: 'United Kingdom',
    city: 'Durham',
    type: 'Cathédrale',
    description: 'Chef-d\'œuvre roman normand (1093-1133), première voûtes croisées ogives Europe. Patrimoine UNESCO. Reliques Saint Cuthbert, Bède Vénérable. Architecture massive forteresse spirituelle. Lieu tournage Harry Potter. Elle incarne conquête normande, monachisme bénédictin et roman anglais.',
    points: 70,
    coordinates: [-1.5760, 54.7733],
    imageUrl: '/src/assets/places/durham-cathedral.jpg'
  },
  {
    id: 'uk-7',
    name: 'Abbaye de Glastonbury',
    country: 'United Kingdom',
    city: 'Glastonbury',
    type: 'Abbaye en ruines',
    description: 'Ruines abbaye (VIIe-1539), légende tombeau roi Arthur et Guenièvre. Premier sanctuaire chrétien Angleterre selon tradition. Supprimée Henri VIII. Pèlerinage New Age, ésotérisme. Elle incarne légendes arthuriennes, christianisme celtique et dissolution monastères Tudor.',
    points: 65,
    coordinates: [-2.7184, 51.1473],
    imageUrl: '/src/assets/places/glastonbury-abbey.jpg'
  },
  {
    id: 'uk-8',
    name: 'Cathédrale de Lincoln',
    country: 'United Kingdom',
    city: 'Lincoln',
    type: 'Cathédrale',
    description: 'Cathédrale gothique anglaise (1072-1311), fut plus haut édifice monde (1311-1549) avec flèche centrale 160m effondrée. Architecture gothique anglais perpendiculaire. Magna Carta originale conservée. Elle incarne pouvoir épiscopal médiéval, gothique anglais et histoire constitutionnelle britannique.',
    points: 65,
    coordinates: [-0.5366, 53.2347],
    imageUrl: '/src/assets/places/lincoln-cathedral.jpg'
  },
  
  // ========== THAILAND ==========
  
  // Bangkok
  {
    id: 'tha-1',
    name: 'Wat Phra Kaew',
    country: 'Thailand',
    city: 'Bangkok',
    type: 'Temple',
    description: 'Le Temple du Bouddha d\'Émeraude, situé dans l\'enceinte du Grand Palais de Bangkok, est le temple le plus sacré de Thaïlande. Construit en 1782 sous le roi Rama I, il abrite le Bouddha d\'Émeraude (Phra Kaew Morakot), statue vénérée de 66 cm taillée dans un bloc de jade vert. Le roi change personnellement les habits dorés du Bouddha trois fois par an selon les saisons. Architecture somptueuse avec toitures dorées, mosaïques éclatantes et gardiens démons Yaksha. Chef-d\'œuvre de l\'art siamois, sanctuaire royal et spirituel du royaume de Thaïlande depuis plus de 240 ans.',
    points: 85,
    coordinates: [100.4913, 13.7515],
    imageUrl: '/src/assets/places/wat-phra-kaew.jpg'
  },
  {
    id: 'tha-2',
    name: 'Wat Arun',
    country: 'Thailand',
    city: 'Bangkok',
    type: 'Temple',
    description: 'Le Temple de l\'Aube (Wat Arun Ratchawararam), érigé sur les rives du fleuve Chao Phraya, est l\'un des monuments les plus emblématiques de Bangkok. Son prang central de style khmer s\'élève à 82 mètres et est incrusté de milliers de morceaux de porcelaine chinoise colorée créant des mosaïques éblouissantes. Construit durant la période d\'Ayutthaya et restauré sous Rama II et Rama III (1820-1850). Symbolise le Mont Meru, centre de l\'univers dans la cosmologie bouddhiste. Vue spectaculaire au coucher du soleil quand le temple s\'illumine. Chef-d\'œuvre architectural représentant l\'aube d\'une nouvelle ère pour Bangkok capitale.',
    points: 80,
    coordinates: [100.4893, 13.7437],
    imageUrl: '/src/assets/places/wat-arun.jpg'
  },
  {
    id: 'tha-3',
    name: 'Wat Pho',
    country: 'Thailand',
    city: 'Bangkok',
    type: 'Temple',
    description: 'Wat Phra Chetuphon (Wat Pho), plus ancien et plus grand temple de Bangkok, fondé au XVIe siècle et reconstruit en 1788 sous Rama I. Célèbre pour son gigantesque Bouddha couché doré de 46 mètres de long et 15 mètres de haut, représentant l\'entrée du Bouddha dans le Nirvana. Ses pieds de 5 mètres sont incrustés de nacre en 108 motifs auspicieux. Le temple abrite 1000 images de Bouddha et 95 stupas. Considéré comme la première université de Thaïlande, berceau de la médecine traditionnelle thaïe et du massage traditionnel. École de massage toujours active. Patrimoine spirituel, médical et architectural exceptionnel.',
    points: 75,
    coordinates: [100.4933, 13.7465],
    imageUrl: '/src/assets/places/wat-pho.jpg'
  },
  {
    id: 'tha-4',
    name: 'Wat Benchamabophit',
    country: 'Thailand',
    city: 'Bangkok',
    type: 'Temple',
    description: 'Le Temple de Marbre (Wat Benchamabophit Dusitvanaram), construit en 1899 sous le roi Rama V, est un chef-d\'œuvre du style thaï-européen. Entièrement revêtu de marbre blanc italien de Carrare importé, il fusionne architecture traditionnelle siamoise et influences néoclassiques. Galerie abritant 52 images de Bouddha représentant différents styles asiatiques. Cour paisible avec étang et jardins. Temple royal encore utilisé pour cérémonies royales et ordinations monastiques. Représente la modernisation du Siam sous Rama V et dialogue entre traditions bouddhistes et modernité occidentale. Joyau architectural de Bangkok.',
    points: 70,
    coordinates: [100.5155, 13.7658],
    imageUrl: '/src/assets/places/wat-benchamabophit.jpg'
  },
  {
    id: 'tha-5',
    name: 'Wat Rong Khun (Temple Blanc)',
    country: 'Thailand',
    city: 'Chiang Rai',
    type: 'Temple',
    description: 'Temple bouddhiste contemporain unique au monde, conçu par l\'artiste Chalermchai Kositpipat depuis 1997. Architecture entièrement blanche symbolisant la pureté du Bouddha, ornée de miroirs représentant la sagesse illuminant l\'univers. Fusionnant art traditionnel thaï et éléments modernes, le temple présente des sculptures fantastiques mêlant iconographie bouddhiste et références pop culture. Le pont symbolise le passage du cycle des renaissances au Nirvana. Œuvre d\'art vivante toujours en construction, il attire visiteurs du monde entier par son esthétique unique et sa vision contemporaine du bouddhisme.',
    points: 85,
    coordinates: [99.7628, 19.8245],
    imageUrl: '/src/assets/places/wat-rong-khun.jpg'
  },
  {
    id: 'tha-6',
    name: 'Wat Phra That Doi Suthep',
    country: 'Thailand',
    city: 'Chiang Mai',
    type: 'Temple',
    description: 'Temple sacré perché à 1676m sur la montagne Doi Suthep, fondé en 1383. Accessible par 309 marches ornées de nâgas, il abrite une relique de Bouddha. Son chedi doré de 24 mètres brillant au soleil est symbole de Chiang Mai. Vue panoramique spectaculaire sur la ville et la campagne. Haut lieu de pèlerinage bouddhiste où résonnent prières et cloches. Légende raconte qu\'un éléphant blanc transportant la relique choisit le lieu en s\'y arrêtant. Architecture Lanna raffinée avec statues dorées, fresques murales et sanctuaires. Centre spirituel majeur du nord de la Thaïlande.',
    points: 90,
    coordinates: [98.9218, 18.8047],
    imageUrl: '/src/assets/places/wat-phra-that-doi-suthep.jpg'
  },
  {
    id: 'tha-7',
    name: 'Wat Mahathat (Ayutthaya)',
    country: 'Thailand',
    city: 'Ayutthaya',
    type: 'Site archéologique',
    description: 'Temple historique fondé en 1374, ancienne capitale du royaume d\'Ayutthaya (1351-1767). Célèbre mondialement pour sa tête de Bouddha enchevêtrée dans les racines d\'un banian, image emblématique représentant union nature-spiritualité. Le site comprend vestiges de prangs khmer, chedis effondrés et statues décapitées, témoins du sac birman de 1767. Autrefois abritait relique de Bouddha et était centre religieux du royaume. Patrimoine UNESCO, symbole de la richesse culturelle siamoise et fragilité des civilisations. Lieu contemplatif où histoire et nature dialoguent.',
    points: 75,
    coordinates: [100.5676, 14.3583],
    imageUrl: '/src/assets/places/wat-mahathat-ayutthaya.jpg'
  },
  {
    id: 'tha-8',
    name: 'Sanctuaire de la Vérité (Pattaya)',
    country: 'Thailand',
    city: 'Pattaya',
    type: 'Temple',
    description: 'Temple entièrement en bois de teck massif, commencé en 1981 par Lek Viriyaphant, toujours en construction. Œuvre architecturale monumentale de 105m de haut, sans un seul clou, sculptée à la main avec minutie. Chaque centimètre carré est orné de sculptures représentant philosophies hindoue, bouddhiste, chinoise et thaïe. Quatre ailes symbolisent cosmologies asiatiques. Situé face à la mer, il fusionne art, spiritualité et philosophie, célébrant l\'artisanat traditionnel et sagesse ancestrale. Vision unique mêlant temple et musée d\'art sculptural vivant, incarnant quête de vérité universelle.',
    points: 80,
    coordinates: [100.8876, 12.9634],
    imageUrl: '/src/assets/places/sanctuary-of-truth.jpg'
  },
  {
    id: 'tha-9',
    name: 'Wat Phra Singh',
    country: 'Thailand',
    city: 'Chiang Mai',
    type: 'Temple',
    description: 'Temple royal construit en 1345 sous le roi Phayu, joyau de l\'architecture Lanna du nord thaïlandais. Abrite la vénérée statue du Bouddha Phra Singh, apportée de Ceylan au XIIIe siècle. Viharn Lai Kham présente fresques murales anciennes exceptionnelles illustrant vie quotidienne et légendes locales. Chedi doré et bibliothèque scripturale Ho Trai sur piliers ornés. Centre d\'ordinations monastiques et d\'enseignements bouddhistes. Temple toujours très actif, point focal des cérémonies du Songkran (Nouvel An thaï). Symbole de l\'héritage culturel et spirituel de Chiang Mai.',
    points: 70,
    coordinates: [98.9856, 18.7879],
    imageUrl: '/src/assets/places/wat-phra-singh.jpg'
  },
  {
    id: 'tha-10',
    name: 'Wat Suthat et la Grande Balançoire',
    country: 'Thailand',
    city: 'Bangkok',
    type: 'Temple royal',
    description: 'Temple royal de premier rang construit entre 1807-1847 sous trois règnes successifs. Architecture imposante avec viharn de 42m, l\'un des plus grands de Thaïlande, abritant Bouddha Phra Si Sakayamuni en bronze de 8m (XIIIe siècle). Fresques murales Rattanakosin retraçant vies antérieures du Bouddha. Devant le temple se dresse Sao Ching Cha, la Grande Balançoire rouge de 21m, utilisée autrefois pour cérémonies brahmaniques acrobatiques. 28 pagodes chinoises dans la cour. Fusion unique d\'influences bouddhistes et hindoues, symbole du syncrétisme religieux thaïlandais.',
    points: 65,
    coordinates: [100.5012, 13.7509],
    imageUrl: '/src/assets/places/wat-suthat.jpg'
  },
  {
    id: 'tha-11',
    name: 'Wat Ratchanatdaram (Loha Prasat)',
    country: 'Thailand',
    city: 'Bangkok',
    type: 'Temple',
    description: 'Temple unique abritant le Loha Prasat (Palais de Métal), seule structure multi-étagée en métal au monde inspirée d\'un monastère sri-lankais disparu. Construit en 1846 sous le roi Rama III, il présente 37 flèches métalliques symbolisant 37 vertus menant à l\'illumination. Architecture pyramidale à 5 étages avec 1536 portes et fenêtres. Méditation au sommet offre vue panoramique sur Bangkok ancien. Représente quête spirituelle ascendante du bouddhisme Theravada. Monument architectural rare fusionnant symbolisme religieux et prouesse technique, témoignage de l\'innovation architecturale siamoise.',
    points: 70,
    coordinates: [100.5039, 13.7546],
    imageUrl: '/src/assets/places/wat-ratchanatdaram.jpg'
  },
  {
    id: 'tha-12',
    name: 'Wat Chedi Luang',
    country: 'Thailand',
    city: 'Chiang Mai',
    type: 'Temple',
    description: 'Temple majestueux fondé en 1391, célèbre pour son chedi massif partiellement détruit par tremblement de terre en 1545. Originellement haut de 82m (style Lanna-khmer), il abrita le Bouddha d\'Émeraude de 1468 à 1552. Base carrée de 54m ornée de sculptures d\'éléphants gardiens (nagas). Restaurations modernes respectent état ruiné romantique. Pilier de la ville (Inthakin) censé protéger Chiang Mai se trouve dans petit bâtiment adjacent. Temple actif avec moines bouddhistes proposant discussions dharma. Symbole de l\'ancienne puissance du royaume Lanna et de la résilience spirituelle.',
    points: 75,
    coordinates: [98.9876, 18.7869],
    imageUrl: '/src/assets/places/wat-chedi-luang.jpg'
  },
  {
    id: 'tha-13',
    name: 'Grand Bouddha de Phuket',
    country: 'Thailand',
    city: 'Phuket',
    type: 'Monument',
    description: 'Statue colossale du Bouddha Maravija en marbre blanc de Birmanie, haute de 45m, inaugurée en 2014 après 10 ans de construction. Perchée au sommet de la colline Nakkerd à 400m d\'altitude, elle domine toute l\'île de Phuket. Vue panoramique à 360° sur la baie de Chalong, Kata, Karon et mer d\'Andaman. Symbole de paix, respect et pureté. Financée par dons, reflète dévotion bouddhiste thaïlandaise. Accessible par route sinueuse, c\'est lieu de méditation serein et site touristique majeur. Son éclat blanc visible de loin guide marins et habitants.',
    points: 70,
    coordinates: [98.3081, 7.8406],
    imageUrl: '/src/assets/places/big-buddha-phuket.jpg'
  },
  {
    id: 'tha-14',
    name: 'Wat Traimit (Temple du Bouddha d\'Or)',
    country: 'Thailand',
    city: 'Bangkok',
    type: 'Temple',
    description: 'Temple abritant le plus grand Bouddha en or massif au monde : 5,5 tonnes d\'or pur, 3m de haut, datant du XIIIe siècle (période Sukhothai). Statue découverte par hasard en 1955 sous gangue de plâtre qui cachait l\'or des invasions birmanes. Style Sukhothai classique représentant Bouddha en méditation. Valeur inestimable artistique et monétaire. Musée relate histoire fascinante de la statue et communauté chinoise de Bangkok. Situé dans Chinatown, le temple attire pèlerins et visiteurs émerveillés. Symbole de richesse culturelle cachée et préservation miraculeuse du patrimoine thaïlandais.',
    points: 85,
    coordinates: [100.5146, 13.7404],
    imageUrl: '/src/assets/places/wat-phra-kaew.jpg'
  },

  // ========== UNITED STATES ==========
  {
    id: 'usa-1',
    name: 'Cathédrale Nationale de Washington',
    country: 'United States',
    city: 'Washington D.C.',
    type: 'Cathédrale',
    description: 'Sixième plus grande cathédrale au monde, chef-d\'œuvre néo-gothique construit de 1907 à 1990 (83 ans). Architecture inspirée des cathédrales européennes médiévales avec arcs-boutants, gargouilles et vitraux spectaculaires. Tours jumelles s\'élèvent à 91m. Abrite tombeaux de Woodrow Wilson et Helen Keller. Lieu de funérailles nationales (Eisenhower, Reagan). Vitrail spatial contient fragment de roche lunaire Apollo 11. 231 vitraux, carillons de 53 cloches. Symbole de foi nationale américaine, accueillant toutes confessions. Centre spirituel, culturel et architectural majeur des États-Unis.',
    points: 80,
    coordinates: [-77.0707, 38.9308],
    imageUrl: '/src/assets/places/washington-national-cathedral.jpg'
  },
  {
    id: 'usa-2',
    name: 'Mission San Juan Capistrano',
    country: 'United States',
    city: 'San Juan Capistrano',
    type: 'Mission',
    description: 'Mission espagnole fondée en 1776 par père Junípero Serra, joyau des 21 missions californiennes. Surnommée "Joyau des Missions", célèbre pour retour annuel miraculeux des hirondelles le 19 mars (jour Saint-Joseph). Grande Église de pierre détruite par séisme 1812, ruines romantiques préservées. Serra Chapel (1782), plus ancien bâtiment californien toujours en usage. Jardins luxuriants avec fontaines coloniales. Musée relate évangélisation, culture des Indiens Acjachemen et ère espagnole. Symbole du patrimoine hispanique californien, fusion d\'architecture coloniale espagnole et histoire amérindienne.',
    points: 75,
    coordinates: [-117.6620, 33.5017],
    imageUrl: '/src/assets/places/mission-san-juan-capistrano.jpg'
  },
  {
    id: 'usa-3',
    name: 'Trinity Church Boston',
    country: 'United States',
    city: 'Boston',
    type: 'Église',
    description: 'Église épiscopale chef-d\'œuvre du style néo-roman richardsonien, conçue par H.H. Richardson (1872-1877). Architecture en grès rose avec tour centrale massive, arches romanes et fresques de John La Farge. Située sur Copley Square face à la bibliothèque publique. Lieu culte et concert réputé pour acoustique exceptionnelle. Inscrite National Historic Landmark. Témoigne du renouveau architectural américain fin XIXe. Intérieur somptueux avec vitraux Tiffany et boiseries sculptées. Symbole de la tradition protestante bostonienne et excellence architecturale américaine.',
    points: 70,
    coordinates: [-71.0768, 42.3495],
    imageUrl: '/src/assets/places/trinity-church-boston.jpg'
  },
  {
    id: 'usa-4',
    name: 'Cathédrale Saint-Louis de La Nouvelle-Orléans',
    country: 'United States',
    city: 'New Orleans',
    type: 'Cathédrale',
    description: 'Plus ancienne cathédrale catholique en usage continu aux États-Unis, fondée en 1720, reconstruite en 1794 après incendie. Architecture créole espagnole avec trois flèches blanches iconiques dominant Jackson Square dans le Vieux Carré français. Cloches historiques rythmant vie du quartier. Fresques intérieures et vitraux remarquables. Lieu de messes, mariages et concerts. Témoin de l\'histoire louisianaise : colonies française et espagnole, vente de la Louisiane 1803. Cathédrale-basilique mineure, symbole de foi catholique francophone et patrimoine créole unique en Amérique.',
    points: 85,
    coordinates: [-90.0631, 29.9579],
    imageUrl: '/src/assets/places/st-louis-cathedral-nola.jpg'
  },
  {
    id: 'usa-5',
    name: 'Temple Byodo-In (Hawaii)',
    country: 'United States',
    city: 'Kaneohe',
    type: 'Temple bouddhiste',
    description: 'Réplique exacte du temple Byodo-In de Kyoto (Japon, 1053), construite en 1968 pour centenaire immigration japonaise à Hawaii. Temple bouddhiste non-pratiquant, lieu méditation et paix. Architecture Heian en bois rouge laqué sans clous, toiture incurvée traditionnelle. Niché dans vallée luxuriante Ko\'olau avec cascades et étangs à carpes koï. Cloche sacrée de 3 tonnes apporte bonne fortune. Bouddha Amida doré de 5m recouvert feuilles d\'or. Jardin zen japonais authentique. Symbole de l\'héritage nippo-américain et harmonie culturelle hawaiienne. Sérénité absolue en cadre tropical.',
    points: 75,
    coordinates: [-157.8395, 21.3974],
    imageUrl: '/src/assets/places/byodo-in-temple-hawaii.jpg'
  },
  {
    id: 'usa-6',
    name: 'Lotus Temple de Washington D.C.',
    country: 'United States',
    city: 'Washington D.C.',
    type: 'Temple Bahá\'í',
    description: 'Maison d\'adoration bahá\'íe ouverte en 2020, architecture moderne inspirée des pétales de lotus. Structure élégante en marbre blanc et verre incarnant unité, paix et inclusion. Conçue par Ehrlich Architects, elle allie spiritualité et design contemporain. Temple accueille toutes religions pour prière et méditation silencieuse. Pas de rituels ni sermons, seulement contemplation et musique sacrée. Jardins paysagers environnants favorisent introspection. Symbole de la foi bahá\'íe en l\'unité de l\'humanité et du dialogue interreligieux. Nouvelle icône architecturale spirituelle de la capitale américaine.',
    points: 70,
    coordinates: [-77.0369, 38.9072],
    imageUrl: '/src/assets/places/lotus-temple-dc.jpg'
  },
  {
    id: 'usa-7',
    name: 'Cathédrale Saint-Paul de Saint Paul (Minnesota)',
    country: 'United States',
    city: 'Saint Paul',
    type: 'Cathédrale',
    description: 'Cathédrale catholique majestueuse de style Beaux-Arts et Renaissance française, construite 1906-1915. Dôme en cuivre vert de 56m de diamètre, l\'un des plus grands au monde, domine colline de Saint Paul. Architecte Emmanuel Masqueray s\'inspira Saint-Pierre Rome et Invalides Paris. Intérieur grandiose avec chapelles latérales, autels marbre et vitraux. Orgue monumental, acoustique exceptionnelle. Siège archiépiscopal du Minnesota. Lieu cérémonies religieuses et concerts. Monument historique national. Symbole de foi catholique et excellence architecturale du Midwest américain.',
    points: 75,
    coordinates: [-93.1070, 44.9466],
    imageUrl: '/src/assets/places/cathedral-st-paul-mn.jpg'
  },
  {
    id: 'usa-8',
    name: 'Synagogue Touro (Newport)',
    country: 'United States',
    city: 'Newport',
    type: 'Synagogue',
    description: 'Plus ancienne synagogue des États-Unis toujours en activité, construite en 1763. Architecture géorgienne coloniale conçue par Peter Harrison. Communauté juive séfarade portugaise fuyant Inquisition. Lettre George Washington 1790 affirmant liberté religieuse américaine : "gouvernement ne donnant sanctification au fanatisme ni assistance à la persécution". Site historique national. Intérieur sobre avec bimah centrale, galerie femmes, chandelier colonial. Témoigne tolérance religieuse Rhode Island fondé par Roger Williams. Symbole liberté culte, patrimoine juif américain et racines de pluralisme religieux US.',
    points: 80,
    coordinates: [-71.3126, 41.4901],
    imageUrl: '/src/assets/places/touro-synagogue.jpg'
  },
  {
    id: 'usa-9',
    name: 'Christ Cathedral (Garden Grove)',
    country: 'United States',
    city: 'Garden Grove',
    type: 'Cathédrale',
    description: 'Anciennement Crystal Cathedral, merveille architecturale moderne en verre et acier par Philip Johnson (1980). Structure géométrique de 10 660 panneaux de verre reflétant ciel et lumière divine. Capacité 2 736 places. Orgue Hazel Wright de 16 000 tuyaux. Rachetée par diocèse catholique 2012, rénovée et consacrée 2019. Architecture postmoderne audacieuse symbolisant transparence spirituelle. Siège cathédrale catholique d\'Orange County. Lieu culte, concerts et événements. Icône architecturale californienne fusionnant modernité et sacré. Témoignage créativité religieuse américaine.',
    points: 75,
    coordinates: [-117.9118, 33.7621],
    imageUrl: '/src/assets/places/crystal-cathedral.jpg'
  },
  {
    id: 'usa-10',
    name: 'Cathédrale San Fernando (San Antonio)',
    country: 'United States',
    city: 'San Antonio',
    type: 'Cathédrale',
    description: 'Plus ancienne cathédrale catholique active au Texas, fondée en 1731 par colons canariens. Architecture baroque coloniale espagnole avec façade ornée et dôme gothique ajouté 1868. Située Plaza de Armas, cœur historique de San Antonio. Abrite cercueil défenseurs d\'Alamo (1836), symbole identité texane. Restaurations préservent fresques murales et retable doré. Cathédrale-basilique mineure, siège archidiocèse. Spectacle son et lumière nocturne projeté sur façade relate histoire. Fusion patrimoine hispanique, foi catholique et mémoire texane. Monument national historique ancré dans âme multiculturelle de San Antonio.',
    points: 70,
    coordinates: [-98.4874, 29.4252],
    imageUrl: '/src/assets/places/san-fernando-cathedral.jpg'
  },

  // ========== SOUTH AMERICA ==========
  {
    id: 'sam-1',
    name: 'Cathédrale Métropolitaine de Buenos Aires',
    country: 'Argentina',
    city: 'Buenos Aires',
    type: 'Cathédrale',
    description: 'Cathédrale catholique principale d\'Argentine face à Plaza de Mayo, construite entre 1752-1852. Façade néoclassique avec 12 colonnes corinthiennes représentant les apôtres, fronton sculpté. Intérieur baroque richement décoré avec fresques, autels dorés et mausolée du général San Martín, héros de l\'indépendance. Orgue Walcker monumental. Siège archevêché Buenos Aires, ancienne paroisse pape François (1998-2013). Lieu cérémonies nationales et religieuses majeures. Symbole foi catholique argentine, histoire coloniale espagnole et identité nationale. Monument historique national au cœur politique de l\'Argentine.',
    points: 75,
    coordinates: [-58.3731, -34.6076],
    imageUrl: '/src/assets/places/catedral-metropolitana-ba.jpg'
  },
  {
    id: 'sam-2',
    name: 'Santuario de Las Lajas',
    country: 'Colombia',
    city: 'Ipiales',
    type: 'Basilique',
    description: 'Basilique néo-gothique spectaculaire construite 1916-1949 dans gorge de rivière Guáitara, enjambant canyon de 100m par pont de pierre. Architecture miraculeuse défiant gravité et ingénierie. Bâtie sur lieu apparition Vierge Marie 1754 à Indienne muette et son enfant paralysé, tous deux guéris. Image miraculeuse de la Vierge imprégnée dans roche naturelle, non peinte, objet vénération. Pèlerinage marial majeur Amérique latine. Tours blanches s\'élançant vers ciel, vitraux colorés illuminant intérieur mystique. Symbole foi populaire colombienne et fusion nature-divin. Merveille architecturale et spirituelle mondiale.',
    points: 95,
    coordinates: [-77.5954, 0.8128],
    imageUrl: '/src/assets/places/santuario-las-lajas-colombia.jpg'
  },
  {
    id: 'sam-3',
    name: 'Cathédrale de Sel de Zipaquirá',
    country: 'Colombia',
    city: 'Zipaquirá',
    type: 'Cathédrale souterraine',
    description: 'Cathédrale catholique souterraine unique sculptée dans mine de sel à 180m profondeur, inaugurée 1995. Chef-d\'œuvre architectural et ingénierie dans tunnels salins. Chemin de croix avec 14 stations sculptées dans sel gemme. Nef centrale illuminée lumière bleue mystique, croix monumentale de 16m. Capacité 8400 personnes. Sel rose, blanc et gris crée atmosphère surnaturelle. Ancienne cathédrale (1954) abandonnée pour raisons sécurité. Merveille moderne combinant foi, art et géologie. Première merveille de Colombie. Lieu pèlerinage, mariages et concerts acoustique exceptionnelle. Expérience spirituelle et esthétique incomparable.',
    points: 90,
    coordinates: [-74.0047, 5.0181],
    imageUrl: '/src/assets/places/catedral-sal-zipaquira-colombia.jpg'
  },
  {
    id: 'sam-4',
    name: 'Couvent Saint-François de Lima',
    country: 'Peru',
    city: 'Lima',
    type: 'Monastère',
    description: 'Complexe monastique franciscain baroque monumental construit à partir 1546, l\'un des plus grands au monde. Architecture coloniale espagnole jaune et blanche emblématique. Bibliothèque contenant 25 000 volumes anciens, certains antérieurs conquête. Cloîtres majestueux ornés d\'azulejos sévillans. Catacombes macabres abritant ossements 70 000 personnes, réseau souterrains reliait églises Lima. Musée art religieux colonial. Chœur mauresque en bois de cèdre sculpté. Patrimoine UNESCO. Symbole évangélisation franciscaine, baroque colonial et richesse culturelle vice-royauté du Pérou. Monument historique vivant de Lima.',
    points: 80,
    coordinates: [-77.0287, -12.0437],
    imageUrl: '/src/assets/places/convento-san-francisco-lima.jpg'
  },
  {
    id: 'sam-5',
    name: 'Église San Francisco de Quito',
    country: 'Ecuador',
    city: 'Quito',
    type: 'Église',
    description: 'Église et couvent baroque colonial construit 1535-1680, première grande œuvre religieuse Quito. Intérieur entièrement recouvert feuilles d\'or (école quiténienne), éblouissant plafond mudéjar maure en bois sculpté. Façade baroque avec colonnes salomoniques. Musée art religieux dans couvent. Catacombes souterraines. Atrium avec fontaine coloniale. École d\'art religieux forma artistes métis fusionnant catholicisme et traditions indigènes. Patrimoine UNESCO (vieille ville Quito). Joyau baroque andin, symbole richesse artistique et spirituelle de l\'Équateur colonial. Centre culturel majeur capitale.',
    points: 85,
    coordinates: [-78.5161, -0.2186],
    imageUrl: '/src/assets/places/iglesia-san-francisco-quito.jpg'
  },
  {
    id: 'sam-6',
    name: 'Basilique du Voto Nacional (Quito)',
    country: 'Ecuador',
    city: 'Quito',
    type: 'Basilique',
    description: 'Plus grande basilique néo-gothique des Amériques, construction débutée 1887, officiellement inachevée (légende locale : fin entrainerait apocalypse Équateur). Inspirée Notre-Dame Paris avec gargouilles uniques représentant faune équatorienne : iguanes, tortues, pumas, condors. Tours culminent 115m, accessibles par escaliers vertigineux offrant vue panoramique Quito. Architecture imposante pierre grise, vitraux spectaculaires, nef monumentale. Symbole consécration Équateur au Sacré-Cœur. Monument national historique. Fusion gothique européen et identité équatorienne. Œuvre architecturale ambitieuse témoignant foi et fierté nationale.',
    points: 80,
    coordinates: [-78.5070, -0.2148],
    imageUrl: '/src/assets/places/basilica-voto-nacional.jpg'
  },
  {
    id: 'sam-7',
    name: 'Basilique de Luján',
    country: 'Argentina',
    city: 'Luján',
    type: 'Basilique',
    description: 'Basilique néo-gothique monumentale construite 1887-1935, plus grand sanctuaire marial d\'Argentine. Tours jumelles s\'élevant 106m en pierre rose. Lieu pèlerinage national attirant 6 millions visiteurs/an. Statue miraculeuse Vierge de Luján (1630), patronne Argentine, Uruguay et Paraguay. Légende : chariot transportant statue resta immobilisé miraculeusement, indiquant volonté divine. Pèlerinage annuel à pied depuis Buenos Aires (68km) rassemble millions fidèles. Architecture française flamboyante, vitraux colorés, crypte. Patrimoine historique argentin. Symbole dévotion mariale, unité nationale et foi populaire latino-américaine.',
    points: 85,
    coordinates: [-59.1207, -34.5704],
    imageUrl: '/src/assets/places/basilica-lujan-argentina.jpg'
  },
  {
    id: 'sam-8',
    name: 'Couvent Santo Domingo (Cusco)',
    country: 'Peru',
    city: 'Cusco',
    type: 'Couvent',
    description: 'Église et couvent dominicain baroque construit directement sur fondations Qorikancha, Temple du Soleil inca le plus sacré. Murs incas en pierre parfaitement ajustée visibles sous architecture coloniale, symbolisant conquête espagnole sur empire inca. Autrefois recouvert 4 000 plaques d\'or massif pillées conquistadors. Fusion architecture inca et baroque colonial unique. Témoigne syncrétisme religieux forcé et résistance culturelle andine. Patrimoine UNESCO. Musée expose momies, textiles et céramiques incas. Lieu historique majeur où dialoguent deux civilisations et spiritualités. Cœur symbolique Cusco, ancienne capitale inca.',
    points: 90,
    coordinates: [-71.9675, -13.5186],
    imageUrl: '/src/assets/places/santo-domingo-cusco.jpg'
  },
  {
    id: 'sam-9',
    name: 'Église de la Compagnie de Jésus (Cusco)',
    country: 'Peru',
    city: 'Cusco',
    type: 'Église jésuite',
    description: 'Église baroque jésuite construite 1571-1668 sur palais inca Huayna Capac, Plaza de Armas. Façade baroque ornée pierre volcanique sculptée, l\'une des plus belles Amérique latine. Intérieur richement décoré feuilles d\'or, autels churrigueresques, retables dorés spectaculaires. Coupole et transept ajoutés après séisme 1650. Rivalisa splendeur avec cathédrale, provoquant jalousie Vatican. École cusquénienne peinture coloniale : toiles fusionnant art européen et symboles andins. Patrimoine UNESCO. Chef-d\'œuvre baroque andin incarnant richesse artistique et complexité culturelle vice-royauté péruvienne. Joyau architectural de Cusco.',
    points: 80,
    coordinates: [-71.9675, -13.5165],
    imageUrl: '/src/assets/places/compania-jesus-cusco.jpg'
  },
  {
    id: 'sam-10',
    name: 'Monastère Santa Catalina (Arequipa)',
    country: 'Peru',
    city: 'Arequipa',
    type: 'Monastère',
    description: 'Citadelle monastère dominicain fondé 1579, ville dans la ville de 20 000m². Ruelles colorées orange, bleu cobalt et blanc créant atmosphère méditerranéenne unique. Cloîtres, cellules moniales, cuisines, lavoirs préservés intacts. Isolement total monde extérieur pendant 400 ans, ouvert public 1970. Religieuses cloîtrées issues familles nobles espagnoles vivaient luxe relatif. Architecture coloniale mêlant styles espagnol, mauresque et baroque. Fresques, mobilier d\'époque, jardin floral. Sillar (pierre volcanique blanche) typique Arequipa. Patrimoine UNESCO. Musée vivant vie monastique coloniale. Témoignage unique histoire religieuse et sociale Pérou.',
    points: 85,
    coordinates: [-71.5369, -16.3960],
    imageUrl: '/src/assets/places/santa-catalina-arequipa.jpg'
  }
];

/**
 * Get places by country - supports optional external places array
 * @param country - Country name to filter by
 * @param places - Optional array of places (from usePlaces hook), defaults to mockPlaces
 */
export const getPlacesByCountry = (country: string, places?: Place[]): Place[] => {
  const data = places || mockPlaces;
  // Normaliser le nom du pays reçu
  const normalizedCountry = country;
  
  // Filtrer avec plusieurs méthodes de comparaison
  const result = data.filter(place => {
    // Comparaison exacte d'abord
    if (place.country === normalizedCountry) return true;
    
    // Comparaison insensible à la casse
    if (place.country.toLowerCase() === normalizedCountry.toLowerCase()) return true;
    
    return false;
  });
  
  console.log(`📍 getPlacesByCountry("${country}") → found ${result.length} places`);
  
  if (result.length === 0) {
    console.warn(`⚠️ No places found for country: "${country}". Try checking country name.`);
  }
  
  return result;
};

/**
 * Get all places - supports optional external places array
 * @param places - Optional array of places (from usePlaces hook), defaults to mockPlaces
 */
export const getAllPlaces = (places?: Place[]): Place[] => {
  return places || mockPlaces;
};

/**
 * Get place by ID - supports optional external places array
 * @param id - Place ID
 * @param places - Optional array of places (from usePlaces hook), defaults to mockPlaces
 */
export const getPlaceById = (id: string, places?: Place[]): Place | undefined => {
  const data = places || mockPlaces;
  return data.find(place => place.id === id);
};

/**
 * Get all countries - supports optional external places array
 * @param places - Optional array of places (from usePlaces hook), defaults to mockPlaces
 */
export const getAllCountries = (places?: Place[]): string[] => {
  const data = places || mockPlaces;
  return Array.from(new Set(data.map(place => place.country))).sort();
};

// Country to Continent mapping
const countryToContinentMap: Record<string, string> = {
  // Europe
  'France': 'Europe', 'Spain': 'Europe', 'Italy': 'Europe', 'Vatican': 'Europe',
  'United Kingdom': 'Europe', 'Germany': 'Europe', 'Austria': 'Europe', 'Czech Republic': 'Europe',
  'Poland': 'Europe', 'Portugal': 'Europe', 'Belgium': 'Europe', 'Netherlands': 'Europe',
  'Switzerland': 'Europe', 'Greece': 'Europe', 'Russia': 'Europe', 'Ukraine': 'Europe',
  'Romania': 'Europe', 'Bulgaria': 'Europe', 'Serbia': 'Europe', 'Croatia': 'Europe',
  'Slovenia': 'Europe', 'Hungary': 'Europe', 'Slovakia': 'Europe', 'Lithuania': 'Europe',
  'Latvia': 'Europe', 'Estonia': 'Europe', 'Finland': 'Europe', 'Sweden': 'Europe',
  'Norway': 'Europe', 'Denmark': 'Europe', 'Iceland': 'Europe', 'Ireland': 'Europe',
  'Luxembourg': 'Europe', 'Cyprus': 'Europe', 'Malta': 'Europe', 'Albania': 'Europe',
  'North Macedonia': 'Europe', 'Bosnia and Herzegovina': 'Europe', 'Montenegro': 'Europe',
  
  // Asia
  'Turkey': 'Asia', 'Israel': 'Asia', 'Palestine': 'Asia', 'Jordan': 'Asia',
  'Lebanon': 'Asia', 'Syria': 'Asia', 'Saudi Arabia': 'Asia', 'UAE': 'Asia',
  'Oman': 'Asia', 'Yemen': 'Asia', 'Iraq': 'Asia', 'Iran': 'Asia',
  'India': 'Asia', 'Nepal': 'Asia', 'Bhutan': 'Asia', 'Sri Lanka': 'Asia',
  'Myanmar': 'Asia', 'Thailand': 'Asia', 'Cambodia': 'Asia', 'Laos': 'Asia',
  'Vietnam': 'Asia', 'China': 'Asia', 'Japan': 'Asia', 'South Korea': 'Asia',
  'North Korea': 'Asia', 'Mongolia': 'Asia', 'Kazakhstan': 'Asia', 'Uzbekistan': 'Asia',
  'Turkmenistan': 'Asia', 'Kyrgyzstan': 'Asia', 'Tajikistan': 'Asia', 'Afghanistan': 'Asia',
  'Pakistan': 'Asia', 'Bangladesh': 'Asia', 'Malaysia': 'Asia', 'Singapore': 'Asia',
  'Indonesia': 'Asia', 'Philippines': 'Asia', 'Brunei': 'Asia', 'Tibet': 'Asia',
  
  // Africa
  'Egypt': 'Africa', 'Morocco': 'Africa', 'Algeria': 'Africa', 'Tunisia': 'Africa',
  'Libya': 'Africa', 'Sudan': 'Africa', 'South Sudan': 'Africa', 'Ethiopia': 'Africa',
  'Eritrea': 'Africa', 'Somalia': 'Africa', 'Kenya': 'Africa', 'Tanzania': 'Africa',
  'Uganda': 'Africa', 'Rwanda': 'Africa', 'Burundi': 'Africa', 'South Africa': 'Africa',
  'Nigeria': 'Africa', 'Ghana': 'Africa', 'Senegal': 'Africa', 'Mali': 'Africa',
  
  // North America
  'United States': 'North America', 'USA': 'North America', 'Canada': 'North America',
  'Mexico': 'North America', 'Guatemala': 'North America', 'Belize': 'North America',
  'Honduras': 'North America', 'El Salvador': 'North America', 'Nicaragua': 'North America',
  'Costa Rica': 'North America', 'Panama': 'North America',
  
  // South America
  'Brazil': 'South America', 'Argentina': 'South America', 'Chile': 'South America',
  'Peru': 'South America', 'Colombia': 'South America', 'Venezuela': 'South America',
  'Ecuador': 'South America', 'Bolivia': 'South America', 'Paraguay': 'South America',
  'Uruguay': 'South America', 'Guyana': 'South America', 'Suriname': 'South America',
  
  // Oceania
  'Australia': 'Oceania', 'New Zealand': 'Oceania', 'Fiji': 'Oceania', 'Papua New Guinea': 'Oceania',
};

export const getContinent = (country: string): string => {
  return countryToContinentMap[country] || 'Other';
};

export const getAllContinents = (): string[] => {
  const continents = new Set(mockPlaces.map(place => getContinent(place.country)));
  return Array.from(continents).sort();
};

export const getCountriesByContinent = (continent: string): string[] => {
  const countries = mockPlaces
    .filter(place => getContinent(place.country) === continent)
    .map(place => place.country);
  return Array.from(new Set(countries)).sort();
};

export const getCitiesByCountry = (country: string): string[] => {
  const cities = mockPlaces
    .filter(place => place.country === country && place.city)
    .map(place => place.city!);
  return Array.from(new Set(cities)).sort();
};