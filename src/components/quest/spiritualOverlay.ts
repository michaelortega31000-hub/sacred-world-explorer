import mapboxgl from 'mapbox-gl';
import type { Track } from '@/types/track';

export type SpiritualMarkerType = 'badge' | 'token' | 'skill';

export interface SpiritualMarker {
  id: string;
  type: SpiritualMarkerType;
  lat: number;
  lng: number;
  label: string;
  hint: string;
  track: Track | 'common';
}

export const SPIRITUAL_MARKERS: SpiritualMarker[] = [
  // ── Major termini / badge sites ────────────────────────────────────────────
  { id: 'rome',          type: 'badge', lat: 41.9028, lng:  12.4964, label: 'Rome',              hint: 'Saint-Pierre · siège apostolique',      track: 'catholic'   },
  { id: 'compostelle',   type: 'badge', lat: 42.8806, lng:  -8.5450, label: 'Compostelle',       hint: 'Tombeau de Saint Jacques',              track: 'common'     },
  { id: 'jerusalem',     type: 'badge', lat: 31.7783, lng:  35.2354, label: 'Jérusalem',         hint: 'Saint-Sépulcre',                        track: 'common'     },
  { id: 'lourdes',       type: 'badge', lat: 43.0918, lng:  -0.0457, label: 'Lourdes',           hint: 'Apparition mariale · 1858',             track: 'catholic'   },
  { id: 'fatima',        type: 'badge', lat: 39.6306, lng:  -8.6731, label: 'Fátima',            hint: 'Apparitions de 1917',                   track: 'catholic'   },
  { id: 'mont-stm',      type: 'badge', lat: 48.6361, lng:  -1.5115, label: 'Mont-St-Michel',   hint: 'Sanctuaire océanique',                  track: 'catholic'   },
  { id: 'canterbury',    type: 'badge', lat: 51.2799, lng:   1.0828, label: 'Canterbury',        hint: 'Tombeau de Saint Thomas Becket',        track: 'protestant' },
  { id: 'istanbul',      type: 'badge', lat: 41.0086, lng:  28.9802, label: 'Constantinople',    hint: 'Sainte-Sophie',                         track: 'orthodox'   },
  { id: 'kyiv',          type: 'badge', lat: 50.4350, lng:  30.5567, label: 'Kyiv',              hint: 'Laure des Grottes',                     track: 'orthodox'   },
  { id: 'bethlehem',     type: 'badge', lat: 31.7054, lng:  35.2024, label: 'Bethléem',          hint: 'Basilique de la Nativité',              track: 'common'     },
  { id: 'reims',         type: 'badge', lat: 49.2538, lng:   4.0314, label: 'Reims',             hint: 'Cathédrale du sacre des rois',          track: 'catholic'   },
  { id: 'cologne',       type: 'badge', lat: 50.9413, lng:   6.9583, label: 'Cologne',           hint: 'Reliques des Rois Mages',               track: 'catholic'   },
  { id: 'lisboa',        type: 'badge', lat: 38.7223, lng:  -9.1393, label: 'Lisbonne',          hint: 'Saint Vincent · départ du Camino',      track: 'catholic'   },
  { id: 'burgos',        type: 'badge', lat: 42.3439, lng:  -3.6969, label: 'Burgos',            hint: 'Cathédrale gothique · Camino',          track: 'catholic'   },
  { id: 'siena',         type: 'badge', lat: 43.3188, lng:  11.3308, label: 'Sienne',            hint: 'Sainte Catherine · Via Francigena',     track: 'catholic'   },
  // ── Camino Francés ─────────────────────────────────────────────────────────
  { id: 'sjpdp',         type: 'token', lat: 43.1635, lng:  -1.2358, label: 'St-Jean-Pied-de-Port', hint: 'Porte du Camino Francés',            track: 'common'     },
  { id: 'roncevaux',     type: 'token', lat: 43.0090, lng:  -1.3198, label: 'Roncevaux',         hint: 'Col des Pyrénées · abbaye',             track: 'catholic'   },
  { id: 'pamplona',      type: 'token', lat: 42.8125, lng:  -1.6458, label: 'Pampelune',         hint: 'Camino · étape navarraise',             track: 'catholic'   },
  { id: 'logrono',       type: 'token', lat: 42.4667, lng:  -2.4500, label: 'Logroño',           hint: 'Rioja · Camino Francés',                track: 'catholic'   },
  { id: 'burgos-camino', type: 'token', lat: 42.3439, lng:  -3.6969, label: 'Burgos (Camino)',   hint: 'Étape majeure · cathédrale',            track: 'catholic'   },
  { id: 'leon',          type: 'token', lat: 42.5987, lng:  -5.5671, label: 'León',              hint: 'Camino · vitraux de la cathédrale',     track: 'catholic'   },
  { id: 'ponferrada',    type: 'token', lat: 42.5461, lng:  -6.5970, label: 'Ponferrada',        hint: 'Château des Templiers',                 track: 'catholic'   },
  { id: 'sarria',        type: 'token', lat: 42.7789, lng:  -7.4148, label: 'Sarria',            hint: 'Dernier 100 km du Camino',              track: 'common'     },
  { id: 'padrón',        type: 'token', lat: 42.7347, lng:  -8.6558, label: 'Padrón',            hint: 'Barque de Saint Jacques',               track: 'catholic'   },
  // ── Camino del Norte (côte cantabrique) ────────────────────────────────────
  { id: 'bilbao',        type: 'token', lat: 43.2630, lng:  -2.9350, label: 'Bilbao',            hint: 'Camino del Norte · départ',             track: 'common'     },
  { id: 'santander',     type: 'token', lat: 43.4623, lng:  -3.8100, label: 'Santander',         hint: 'Camino del Norte · côte',               track: 'common'     },
  { id: 'gijon',         type: 'token', lat: 43.5322, lng:  -5.6611, label: 'Gijón',             hint: 'Asturias · Camino del Norte',           track: 'common'     },
  { id: 'oviedo',        type: 'badge', lat: 43.3614, lng:  -5.8593, label: 'Oviedo',            hint: 'Cámara Santa · Camino Primitivo',       track: 'common'     },
  // ── Camino Portugués ───────────────────────────────────────────────────────
  { id: 'porto',         type: 'token', lat: 41.1579, lng:  -8.6291, label: 'Porto',             hint: 'Cathedrale Sé · Camino Portugués',      track: 'catholic'   },
  { id: 'braga',         type: 'token', lat: 41.5454, lng:  -8.4265, label: 'Braga',             hint: 'Bom Jesus · pèlerinage marian',         track: 'catholic'   },
  { id: 'tui',           type: 'token', lat: 42.0424, lng:  -8.6453, label: 'Tui',               hint: 'Frontière Espagne · Camino',            track: 'common'     },
  { id: 'pontevedra',    type: 'token', lat: 42.4336, lng:  -8.6467, label: 'Pontevedra',        hint: 'Pèlerinages mariaux du Camino',         track: 'common'     },
  // ── Via Turonensis (Voie de Tours → Camino) ────────────────────────────────
  { id: 'tours',         type: 'badge', lat: 47.3941, lng:   0.6848, label: 'Tours',             hint: 'Basilique Saint-Martin · via Turonensis', track: 'catholic' },
  { id: 'poitiers',      type: 'token', lat: 46.5802, lng:   0.3404, label: 'Poitiers',          hint: 'Notre-Dame-la-Grande · via Turonensis', track: 'catholic'   },
  { id: 'saintes',       type: 'token', lat: 45.7461, lng:  -0.6323, label: 'Saintes',           hint: 'Saint-Eutrope · voie de Tours',         track: 'catholic'   },
  { id: 'bordeaux-c',    type: 'token', lat: 44.8378, lng:  -0.5792, label: 'Bordeaux',          hint: 'Saint-Seurin · via Turonensis',         track: 'catholic'   },
  { id: 'ostabat',       type: 'token', lat: 43.3564, lng:  -1.0422, label: 'Ostabat',           hint: 'Confluent des trois voies',             track: 'common'     },
  // ── Via Lemovicensis (Voie de Vézelay) ─────────────────────────────────────
  { id: 'vezelay',       type: 'badge', lat: 47.4658, lng:   3.7481, label: 'Vézelay',           hint: 'Madeleine · voie de Vézelay',           track: 'catholic'   },
  { id: 'limoges',       type: 'token', lat: 45.8336, lng:   1.2611, label: 'Limoges',           hint: 'Saint-Martial · Voie de Vézelay',       track: 'catholic'   },
  { id: 'périgueux',     type: 'token', lat: 45.1835, lng:   0.7214, label: 'Périgueux',         hint: 'Saint-Front · pèlerinage',              track: 'catholic'   },
  // ── Via Tolosana (Voie d'Arles) ────────────────────────────────────────────
  { id: 'arles',         type: 'badge', lat: 43.6767, lng:   4.6277, label: 'Arles',             hint: 'Saint-Trophime · via Tolosana',         track: 'catholic'   },
  { id: 'montpellier',   type: 'token', lat: 43.6108, lng:   3.8767, label: 'Montpellier',       hint: 'Via Tolosana',                          track: 'catholic'   },
  { id: 'toulouse',      type: 'token', lat: 43.6047, lng:   1.4442, label: 'Toulouse',          hint: 'Saint-Sernin · via Tolosana',           track: 'catholic'   },
  // ── Via Francigena (Canterbury → Rome) ────────────────────────────────────
  { id: 'london',        type: 'token', lat: 51.5074, lng:  -0.1278, label: 'Londres',           hint: 'Point de départ historique anglais',    track: 'protestant' },
  { id: 'dover',         type: 'token', lat: 51.1279, lng:   1.3134, label: 'Douvres',           hint: 'Passage de la Manche · Via Francigena', track: 'common'     },
  { id: 'calais',        type: 'token', lat: 50.9513, lng:   1.8587, label: 'Calais',            hint: 'Entrée continentale · Via Francigena',  track: 'common'     },
  { id: 'arras',         type: 'token', lat: 50.2926, lng:   2.7812, label: 'Arras',             hint: 'Via Francigena · Artois',               track: 'common'     },
  { id: 'lausanne',      type: 'token', lat: 46.5197, lng:   6.6323, label: 'Lausanne',          hint: 'Grand-St-Bernard · Via Francigena',     track: 'common'     },
  { id: 'aosta',         type: 'token', lat: 45.7355, lng:   7.3153, label: 'Aoste',             hint: 'Col du Grand-St-Bernard',               track: 'catholic'   },
  { id: 'pavia',         type: 'token', lat: 45.1847, lng:   9.1582, label: 'Pavie',             hint: 'Reliques de Saint Augustin',            track: 'catholic'   },
  { id: 'lucca',         type: 'token', lat: 43.8430, lng:  10.5050, label: 'Lucca',             hint: 'Volto Santo · Via Francigena',          track: 'catholic'   },
  { id: 'florence',      type: 'token', lat: 43.7696, lng:  11.2558, label: 'Florence',          hint: 'Via Francigena · Santa Croce',          track: 'catholic'   },
  // ── Camino Inglés (depuis les ports) ───────────────────────────────────────
  { id: 'ferrol',        type: 'token', lat: 43.4847, lng:  -8.2317, label: 'Ferrol',            hint: 'Camino Inglés · port d\'arrivée',       track: 'common'     },
  { id: 'corunna',       type: 'token', lat: 43.3623, lng:  -8.4115, label: 'La Corogne',        hint: 'Camino Inglés · port nordique',         track: 'common'     },
  // ── Pèlerinages orthodoxes ──────────────────────────────────────────────────
  { id: 'mt-athos',      type: 'skill', lat: 40.1571, lng:  24.3287, label: 'Mont-Athos',        hint: 'Hesychasme · République monastique',    track: 'orthodox'   },
  { id: 'thessaloniki',  type: 'token', lat: 40.6401, lng:  22.9444, label: 'Thessalonique',     hint: 'Saint Démétrius · Via Egnatia',         track: 'orthodox'   },
  { id: 'ohrid',         type: 'token', lat: 41.1125, lng:  20.8015, label: 'Ohrid',             hint: 'Jérusalem des Balkans',                 track: 'orthodox'   },
  { id: 'sofia',         type: 'token', lat: 42.6977, lng:  23.3219, label: 'Sofia',             hint: 'Alexandre Nevski · Bulgarie orthodoxe', track: 'orthodox'   },
  { id: 'bucharest',     type: 'token', lat: 44.4268, lng:  26.1025, label: 'Bucarest',          hint: 'Patriarcat roumain',                    track: 'orthodox'   },
  { id: 'sergiev',       type: 'skill', lat: 56.3000, lng:  38.1333, label: 'Serguiev Possad',   hint: 'Laure de la Trinité-Saint-Serge',       track: 'orthodox'   },
  { id: 'novgorod',      type: 'token', lat: 58.5227, lng:  31.2732, label: 'Novgorod',          hint: 'Sainte-Sophie de Novgorod',             track: 'orthodox'   },
  { id: 'mt-sinai',      type: 'skill', lat: 28.5388, lng:  33.9761, label: 'Mont Sinaï',        hint: 'Sainte-Catherine · pèlerinage biblique', track: 'orthodox'  },
  { id: 'antakya',       type: 'skill', lat: 36.2025, lng:  36.1606, label: 'Antioche',          hint: 'Première communauté chrétienne',        track: 'orthodox'   },
  // ── Terre Sainte ───────────────────────────────────────────────────────────
  { id: 'nazareth',      type: 'token', lat: 32.7022, lng:  35.2978, label: 'Nazareth',          hint: 'Annonciation · basilique',              track: 'common'     },
  { id: 'capernaum',     type: 'token', lat: 32.8798, lng:  35.5714, label: 'Capharnaüm',        hint: 'Ville de Jésus · mer de Galilée',       track: 'common'     },
  { id: 'jericho',       type: 'token', lat: 31.8557, lng:  35.4595, label: 'Jéricho',           hint: 'Baptême du Jourdain · route biblique',  track: 'common'     },
  // ── Pèlerinages protestants ─────────────────────────────────────────────────
  { id: 'wittenberg',    type: 'token', lat: 51.8665, lng:  12.6477, label: 'Wittenberg',        hint: '95 thèses · 1517',                      track: 'protestant' },
  { id: 'geneve',        type: 'token', lat: 46.2044, lng:   6.1432, label: 'Genève',            hint: 'Calvin · Réforme protestante',          track: 'protestant' },
  { id: 'lubeck',        type: 'token', lat: 53.8655, lng:  10.6866, label: 'Lübeck',            hint: 'Marienkirche · Réforme nordique',        track: 'protestant' },
  { id: 'iona',          type: 'token', lat: 56.3296, lng:  -6.4147, label: 'Iona',              hint: 'Saint Columba · pèlerinage celte',      track: 'common'     },
  { id: 'lindisfarne',   type: 'token', lat: 55.6825, lng:  -1.7994, label: 'Lindisfarne',       hint: 'Île sainte · Saint Cuthbert',           track: 'protestant' },
  // ── Autres sites catholiques ────────────────────────────────────────────────
  { id: 'czestochowa',   type: 'badge', lat: 50.8122, lng:  19.1041, label: 'Częstochowa',       hint: 'Madone Noire · pèlerinage polonais',    track: 'catholic'   },
  { id: 'loreto',        type: 'badge', lat: 43.4410, lng:  13.6092, label: 'Lorette',           hint: 'Santa Casa · pèlerinage marial',        track: 'catholic'   },
  { id: 'assisi',        type: 'badge', lat: 43.0707, lng:  12.6197, label: 'Assise',            hint: 'Saint François · Via di Francesco',     track: 'catholic'   },
  { id: 'padua',         type: 'token', lat: 45.4064, lng:  11.8768, label: 'Padoue',            hint: 'Saint Antoine · basilique',             track: 'catholic'   },
  { id: 'montserrat',    type: 'badge', lat: 41.5930, lng:   1.8376, label: 'Montserrat',        hint: 'Moreneta · Catalogne',                  track: 'catholic'   },
  // ── Sanctuaires français additionnels ──────────────────────────────────────
  { id: 'chartres',      type: 'badge', lat: 48.4476, lng:   1.4892, label: 'Chartres',          hint: 'Cathédrale · voile de la Vierge',       track: 'catholic'   },
  { id: 'le-puy',        type: 'badge', lat: 45.0430, lng:   3.8854, label: 'Le Puy-en-Velay',   hint: 'Vierge Noire · départ Via Podiensis',   track: 'catholic'   },
  { id: 'conques',       type: 'badge', lat: 44.6011, lng:   2.4022, label: 'Conques',           hint: 'Sainte-Foy · étape jacquaire',          track: 'catholic'   },
  { id: 'rocamadour',    type: 'badge', lat: 44.7997, lng:   1.6177, label: 'Rocamadour',        hint: 'Vierge Noire · cité mariale',           track: 'catholic'   },
  { id: 'la-salette',    type: 'token', lat: 44.8553, lng:   5.9897, label: 'La Salette',        hint: 'Apparition mariale · 1846',             track: 'catholic'   },
  { id: 'paray',         type: 'token', lat: 46.4516, lng:   4.1206, label: 'Paray-le-Monial',   hint: 'Sacré-Cœur · Marguerite-Marie',         track: 'catholic'   },
  { id: 'lisieux',       type: 'badge', lat: 49.1459, lng:   0.2253, label: 'Lisieux',           hint: 'Sainte Thérèse · basilique',            track: 'catholic'   },
  { id: 'ars',           type: 'token', lat: 46.0028, lng:   4.8214, label: 'Ars',               hint: 'Saint Curé d\'Ars · sanctuaire',        track: 'catholic'   },
  { id: 'cluny',         type: 'badge', lat: 46.4339, lng:   4.6594, label: 'Cluny',             hint: 'Abbaye · réforme bénédictine',          track: 'catholic'   },
  { id: 'taize',         type: 'token', lat: 46.5118, lng:   4.6772, label: 'Taizé',             hint: 'Communauté œcuménique',                 track: 'common'     },
  { id: 'mont-odile',    type: 'token', lat: 48.4378, lng:   7.4042, label: 'Mont Sainte-Odile', hint: 'Patronne de l\'Alsace',                 track: 'catholic'   },
  // ── Italie ─────────────────────────────────────────────────────────────────
  { id: 'monte-cassino', type: 'badge', lat: 41.4892, lng:  13.8139, label: 'Monte Cassino',     hint: 'Saint Benoît · berceau bénédictin',     track: 'catholic'   },
  { id: 'bari',          type: 'badge', lat: 41.1304, lng:  16.8617, label: 'Bari',              hint: 'Saint Nicolas · reliques',              track: 'catholic'   },
  { id: 'subiaco',       type: 'token', lat: 41.9252, lng:  13.0975, label: 'Subiaco',           hint: 'Saint Benoît · Sacro Speco',            track: 'catholic'   },
  { id: 'ravenna',       type: 'token', lat: 44.4184, lng:  12.2035, label: 'Ravenne',           hint: 'Mosaïques byzantines',                  track: 'catholic'   },
  { id: 'manoppello',    type: 'token', lat: 42.2581, lng:  14.0586, label: 'Manoppello',        hint: 'Saint Voile · sanctuaire',              track: 'catholic'   },
  { id: 'pietrelcina',   type: 'token', lat: 41.1947, lng:  14.8583, label: 'San Giovanni Rotondo', hint: 'Padre Pio · sanctuaire',             track: 'catholic'   },
  // ── Iles britanniques ──────────────────────────────────────────────────────
  { id: 'walsingham',    type: 'token', lat: 52.8917, lng:   0.8722, label: 'Walsingham',        hint: 'Notre-Dame · pèlerinage anglais',       track: 'catholic'   },
  { id: 'glastonbury',   type: 'token', lat: 51.1450, lng:  -2.7142, label: 'Glastonbury',       hint: 'Légendes celtes · arboriculture sacrée', track: 'common'    },
  { id: 'st-andrews',    type: 'token', lat: 56.3398, lng:  -2.7967, label: 'St Andrews',        hint: 'Saint André · Écosse',                  track: 'protestant' },
  { id: 'durham',        type: 'badge', lat: 54.7748, lng:  -1.5849, label: 'Durham',            hint: 'Saint Cuthbert · cathédrale',           track: 'catholic'   },
  { id: 'knock',         type: 'badge', lat: 53.7917, lng:  -8.9214, label: 'Knock',             hint: 'Apparition mariale · 1879',             track: 'catholic'   },
  { id: 'st-davids',     type: 'token', lat: 51.8825, lng:  -5.2680, label: 'St Davids',         hint: 'Patron du Pays de Galles',              track: 'catholic'   },
  // ── Europe centrale & Pologne ──────────────────────────────────────────────
  { id: 'wadowice',      type: 'token', lat: 49.8833, lng:  19.4933, label: 'Wadowice',          hint: 'Naissance de Jean-Paul II',             track: 'catholic'   },
  { id: 'mariazell',     type: 'badge', lat: 47.7733, lng:  15.3164, label: 'Mariazell',         hint: 'Magna Mater Austriae',                  track: 'catholic'   },
  { id: 'kalwaria',      type: 'token', lat: 49.8731, lng:  19.6839, label: 'Kalwaria Zebrzydowska', hint: 'Calvaire polonais',                 track: 'catholic'   },
  { id: 'levoca',        type: 'token', lat: 49.0247, lng:  20.5897, label: 'Levoča',            hint: 'Pèlerinage marial slovaque',            track: 'catholic'   },
  { id: 'medjugorje',    type: 'token', lat: 43.1900, lng:  17.6789, label: 'Medjugorje',        hint: 'Apparitions mariales · 1981',           track: 'catholic'   },
  // ── Apparitions mariales additionnelles ────────────────────────────────────
  { id: 'banneux',       type: 'token', lat: 50.5200, lng:   5.7547, label: 'Banneux',           hint: 'Apparitions mariales · 1933',           track: 'catholic'   },
  { id: 'beauraing',     type: 'token', lat: 50.1117, lng:   4.9544, label: 'Beauraing',         hint: 'Apparitions mariales · 1932',           track: 'catholic'   },
  { id: 'altotting',     type: 'token', lat: 48.2244, lng:  12.6764, label: 'Altötting',         hint: 'Cœur de la Bavière catholique',         track: 'catholic'   },
  { id: 'einsiedeln',    type: 'token', lat: 47.1278, lng:   8.7531, label: 'Einsiedeln',        hint: 'Vierge Noire · abbaye',                 track: 'catholic'   },
  // ── Russie & Europe orientale ──────────────────────────────────────────────
  { id: 'solovki',       type: 'skill', lat: 65.0258, lng:  35.7100, label: 'Solovki',           hint: 'Monastère arctique',                    track: 'orthodox'   },
  { id: 'valaam',        type: 'skill', lat: 61.3833, lng:  30.9333, label: 'Valaam',            hint: 'Monastère du lac Ladoga',               track: 'orthodox'   },
  { id: 'optina',        type: 'skill', lat: 54.0533, lng:  35.8336, label: 'Optina Pustyn',     hint: 'Starets russes · spiritualité',         track: 'orthodox'   },
  { id: 'diveyevo',      type: 'skill', lat: 55.0414, lng:  43.2492, label: 'Diveyevo',          hint: 'Saint Séraphin de Sarov',               track: 'orthodox'   },
  { id: 'pskov',         type: 'token', lat: 57.8194, lng:  28.3322, label: 'Pskov',             hint: 'Pskovo-Pechersky · monastère',          track: 'orthodox'   },
  // ── Méditerranée orientale & Caucase ───────────────────────────────────────
  { id: 'patmos',        type: 'badge', lat: 37.3088, lng:  26.5497, label: 'Patmos',            hint: 'Apocalypse · grotte de saint Jean',     track: 'orthodox'   },
  { id: 'meteora',       type: 'badge', lat: 39.7217, lng:  21.6306, label: 'Météores',          hint: 'Monastères suspendus',                  track: 'orthodox'   },
  { id: 'tinos',         type: 'token', lat: 37.5392, lng:  25.1606, label: 'Tinos',             hint: 'Panagia · pèlerinage marial grec',      track: 'orthodox'   },
  { id: 'echmiadzin',    type: 'badge', lat: 40.1614, lng:  44.2917, label: 'Etchmiadzin',       hint: 'Mère-église arménienne',                track: 'orthodox'   },
  { id: 'mtskheta',      type: 'badge', lat: 41.8425, lng:  44.7208, label: 'Mtskheta',          hint: 'Sveti-Tskhoveli · Géorgie',             track: 'orthodox'   },
  { id: 'soumela',       type: 'skill', lat: 40.6900, lng:  39.6586, label: 'Soumela',           hint: 'Monastère du Pont · Trabzon',           track: 'orthodox'   },
  // ── Afrique chrétienne ─────────────────────────────────────────────────────
  { id: 'lalibela',      type: 'badge', lat: 12.0319, lng:  39.0476, label: 'Lalibela',          hint: 'Églises rupestres éthiopiennes',        track: 'orthodox'   },
  { id: 'axum',          type: 'badge', lat: 14.1322, lng:  38.7236, label: 'Axoum',             hint: 'Arche d\'Alliance · tradition éthiopienne', track: 'orthodox' },
  { id: 'wadi-natrun',   type: 'skill', lat: 30.4258, lng:  30.3469, label: 'Wadi Natrun',       hint: 'Désert des Pères coptes',               track: 'orthodox'   },
  { id: 'st-mark-cairo', type: 'token', lat: 30.0626, lng:  31.2497, label: 'Le Caire copte',    hint: 'Saint-Marc · patriarcat copte',         track: 'orthodox'   },
  // ── Amériques ──────────────────────────────────────────────────────────────
  { id: 'guadalupe',     type: 'badge', lat: 19.4844, lng: -99.1175, label: 'Guadalupe',         hint: 'Apparition mariale · 1531',             track: 'catholic'   },
  { id: 'aparecida',     type: 'badge', lat: -22.8470, lng: -45.2306, label: 'Aparecida',        hint: 'Patronne du Brésil',                    track: 'catholic'   },
  { id: 'beaupre',       type: 'token', lat: 47.0247, lng: -70.9236, label: 'Sainte-Anne-de-Beaupré', hint: 'Pèlerinage québécois',             track: 'catholic'   },
  { id: 'lujan',         type: 'token', lat: -34.5708, lng: -59.1056, label: 'Luján',            hint: 'Patronne de l\'Argentine',              track: 'catholic'   },
  { id: 'copacabana',    type: 'token', lat: -16.1664, lng: -69.0883, label: 'Copacabana (Bolivie)', hint: 'Vierge du lac Titicaca',             track: 'catholic'   },
  { id: 'el-cobre',      type: 'token', lat: 20.0464, lng: -75.9469, label: 'El Cobre',          hint: 'Patronne de Cuba',                      track: 'catholic'   },
  { id: 'chimayo',       type: 'token', lat: 35.9886, lng: -105.9342, label: 'Chimayó',          hint: '"Lourdes des Amériques"',               track: 'catholic'   },
  // ── Asie ───────────────────────────────────────────────────────────────────
  { id: 'velankanni',    type: 'badge', lat: 10.6816, lng:  79.8531, label: 'Velankanni',        hint: 'Notre-Dame · "Lourdes de l\'Inde"',     track: 'catholic'   },
  { id: 'manaoag',       type: 'token', lat: 16.0428, lng: 120.4861, label: 'Manaoag',           hint: 'Notre-Dame · Philippines',              track: 'catholic'   },
  { id: 'sheshan',       type: 'token', lat: 31.0972, lng: 121.1869, label: 'Sheshan',           hint: 'Notre-Dame · Chine',                    track: 'catholic'   },
  { id: 'akita',         type: 'token', lat: 39.7186, lng: 140.1031, label: 'Akita',             hint: 'Apparition · Japon',                    track: 'catholic'   },
  { id: 'goa',           type: 'token', lat: 15.5044, lng:  73.9119, label: 'Velha Goa',         hint: 'Saint François-Xavier',                 track: 'catholic'   },
  // ── Réforme étendue ────────────────────────────────────────────────────────
  { id: 'worms',         type: 'token', lat: 49.6356, lng:   8.3597, label: 'Worms',             hint: 'Diète de Worms · 1521',                 track: 'protestant' },
  { id: 'heidelberg',    type: 'token', lat: 49.4093, lng:   8.6940, label: 'Heidelberg',        hint: 'Catéchisme · théologie réformée',       track: 'protestant' },
  { id: 'eisleben',      type: 'token', lat: 51.5278, lng:  11.5528, label: 'Eisleben',          hint: 'Naissance et mort de Luther',           track: 'protestant' },
  { id: 'zurich',        type: 'token', lat: 47.3769, lng:   8.5417, label: 'Zurich',            hint: 'Zwingli · Réforme suisse',              track: 'protestant' },
  { id: 'edinburgh',     type: 'token', lat: 55.9533, lng:  -3.1883, label: 'Édimbourg',         hint: 'John Knox · Église d\'Écosse',          track: 'protestant' },
  { id: 'plymouth',      type: 'token', lat: 50.3755, lng:  -4.1427, label: 'Plymouth',          hint: 'Mayflower · pèlerins puritains',        track: 'protestant' },
  // ── Saints des origines ────────────────────────────────────────────────────
  { id: 'avila',         type: 'badge', lat: 40.6566, lng:  -4.6818, label: 'Ávila',             hint: 'Sainte Thérèse · réforme carmélitaine', track: 'catholic'   },
  { id: 'paris-ndp',     type: 'badge', lat: 48.8530, lng:   2.3499, label: 'Paris',             hint: 'Notre-Dame · cœur catholique',          track: 'catholic'   },
  { id: 'tarsus',        type: 'token', lat: 36.9181, lng:  34.8953, label: 'Tarse',             hint: 'Naissance de saint Paul',               track: 'common'     },
  { id: 'ephesus',       type: 'badge', lat: 37.9494, lng:  27.3636, label: 'Éphèse',            hint: 'Maison de Marie · concile',             track: 'common'     },
  { id: 'caesarea',      type: 'token', lat: 32.5000, lng:  34.8917, label: 'Césarée maritime',  hint: 'Pierre & Paul · port apostolique',      track: 'common'     },
  { id: 'qumran',        type: 'token', lat: 31.7414, lng:  35.4592, label: 'Qumrân',            hint: 'Manuscrits de la mer Morte',            track: 'common'     },
];

// Centuries of accumulated prayer at each site — drives column height.
// Where unspecified, falls back to track/type defaults (medieval baseline ~10c).
const PRAYER_CENTURIES: Record<string, number> = {
  jerusalem: 30, bethlehem: 30, nazareth: 30, capernaum: 30, jericho: 30,
  rome: 20, antakya: 20,
  'mt-sinai': 17, 'mt-athos': 12,
  istanbul: 17, kyiv: 11, sergiev: 7, novgorod: 11,
  thessaloniki: 19, ohrid: 11, sofia: 11, bucharest: 6,
  compostelle: 12, oviedo: 12, 'mont-stm': 13, vezelay: 11, tours: 17, arles: 18,
  reims: 16, cologne: 9, canterbury: 14, iona: 15, lindisfarne: 14,
  siena: 9, lucca: 14, florence: 7, assisi: 9, padua: 9, loreto: 6, montserrat: 11,
  burgos: 8, leon: 11, pamplona: 11, lisboa: 9, porto: 9, braga: 17, toulouse: 11,
  poitiers: 17, saintes: 17, 'bordeaux-c': 17, périgueux: 15, limoges: 15,
  czestochowa: 7, lourdes: 2, fatima: 1, wittenberg: 5, geneve: 5, lubeck: 8,
  // French additions
  chartres: 16, 'le-puy': 13, conques: 11, rocamadour: 10, 'la-salette': 2,
  paray: 4, lisieux: 1, ars: 2, cluny: 11, taize: 1, 'mont-odile': 13,
  // Italy
  'monte-cassino': 15, bari: 10, subiaco: 16, ravenna: 16, manoppello: 5, pietrelcina: 1,
  // British Isles
  walsingham: 10, glastonbury: 14, 'st-andrews': 13, durham: 13, knock: 2, 'st-davids': 15,
  // Central Europe
  wadowice: 1, mariazell: 9, kalwaria: 5, levoca: 7, medjugorje: 1,
  banneux: 1, beauraing: 1, altotting: 13, einsiedeln: 11,
  // Russia / East
  solovki: 6, valaam: 8, optina: 6, diveyevo: 3, pskov: 6,
  // Eastern Med / Caucasus
  patmos: 19, meteora: 7, tinos: 2, echmiadzin: 17, mtskheta: 17, soumela: 16,
  // Africa
  lalibela: 8, axum: 17, 'wadi-natrun': 16, 'st-mark-cairo': 19,
  // Americas
  guadalupe: 5, aparecida: 3, beaupre: 4, lujan: 4, copacabana: 5, 'el-cobre': 4, chimayo: 2,
  // Asia
  velankanni: 5, manaoag: 4, sheshan: 2, akita: 1, goa: 5,
  // Reform
  worms: 5, heidelberg: 5, eisleben: 5, zurich: 5, edinburgh: 5, plymouth: 4,
  // Origins
  avila: 5, 'paris-ndp': 9, tarsus: 20, ephesus: 20, caesarea: 19, qumran: 22,
};

const centuriesFor = (m: SpiritualMarker): number => {
  const explicit = PRAYER_CENTURIES[m.id];
  if (explicit !== undefined) return explicit;
  if (m.type === 'badge') return 12;
  if (m.type === 'skill') return 14;
  return 8;
};

export const SPIRITUAL_TYPE_COLOR: Record<SpiritualMarkerType, { core: string; halo: string }> = {
  badge: { core: '#F4C542', halo: 'rgba(244,197,66,0.55)' },
  token: { core: '#7DD3FC', halo: 'rgba(125,211,252,0.55)' },
  skill: { core: '#C084FC', halo: 'rgba(192,132,252,0.55)' },
};

const SOURCE_ID = 'spiritual-markers';
const COLUMN_SOURCE = 'spiritual-columns';
const ROUTES_SOURCE = 'pilgrimage-routes';
const BEAM_OUTER = 'spiritual-beam-outer';
const BEAM_MID = 'spiritual-beam-mid';
const BEAM_CORE = 'spiritual-beam-core';
const BEAM_TIP = 'spiritual-beam-tip';
const SWARM_SOURCE = 'spiritual-swarm';
const SWARM_LAYER = 'spiritual-swarm-layer';
const OSM_CHURCHES_SOURCE = 'osm-churches';
const OSM_CHURCH_LAYER = 'osm-church-dots';
const OSM_CATHEDRAL_LAYER = 'osm-cathedral-dots';

interface OsmChurch {
  id: number;
  lng: number;
  lat: number;
  name?: string;
  building?: string;
  worship?: string;
  isCathedral: boolean;
}

// Fetch every cathedral on Earth via Wikidata SPARQL (more reliable than Overpass for global).
// Q2977 = cathedral. ~3-4k results worldwide.
const fetchAllCathedralsGlobal = async (): Promise<OsmChurch[]> => {
  // Only DIRECT instances of "cathedral" (Q2977). Avoids the subclass walk
  // that pulled in former/co-cathedrals, basilicas, etc. Excludes items
  // marked as no-longer-active (P5817 = ruin/demolished/closed).
  const sparql = `SELECT ?item ?itemLabel ?coord WHERE {
    ?item wdt:P31 wd:Q2977 .
    ?item wdt:P625 ?coord .
    FILTER NOT EXISTS { ?item wdt:P576 ?dissolved . }
    FILTER NOT EXISTS { ?item wdt:P31 wd:Q12876 . }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr,es,it,de,pt". }
  } LIMIT 5000`;
  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/sparql-results+json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    type SparqlBinding = {
      item: { value: string };
      itemLabel?: { value: string };
      coord: { value: string };
    };
    const bindings: SparqlBinding[] = data?.results?.bindings ?? [];
    const out: OsmChurch[] = [];
    for (const b of bindings) {
      // Wikidata coord format: "Point(lng lat)"
      const m = /Point\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)/.exec(b.coord.value);
      if (!m) continue;
      const lng = parseFloat(m[1]);
      const lat = parseFloat(m[2]);
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
      // Build a stable numeric id from the Wikidata QID
      const qid = b.item.value.split('/').pop() ?? '';
      const idNum = -parseInt(qid.replace(/[^0-9]/g, ''), 10) || -Math.floor(Math.random() * 1e9);
      out.push({
        id: idNum,
        lng,
        lat,
        name: b.itemLabel?.value,
        isCathedral: true,
      });
    }
    return out;
  } catch {
    return [];
  }
};

const fetchOsmChurches = async (
  bbox: [number, number, number, number],
  abortSignal?: AbortSignal,
): Promise<OsmChurch[]> => {
  const [w, s, e, n] = bbox;
  // Get all places of worship (most OSM entries omit the religion tag),
  // plus explicit churches/cathedrals tagged via building=*. We filter
  // non-Christian by tag in post-processing to avoid missing untagged ones.
  const query = `[out:json][timeout:25];(
    node["amenity"="place_of_worship"](${s},${w},${n},${e});
    way["amenity"="place_of_worship"](${s},${w},${n},${e});
    way["building"="church"](${s},${w},${n},${e});
    way["building"="cathedral"](${s},${w},${n},${e});
    way["building"="chapel"](${s},${w},${n},${e});
  );out center 5000;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, { signal: abortSignal });
    if (!res.ok) return [];
    const data = await res.json();
    type OverpassEl = {
      id: number;
      lat?: number;
      lon?: number;
      center?: { lat: number; lon: number };
      tags?: Record<string, string>;
    };
    const elements: OverpassEl[] = data.elements ?? [];
    const NON_CHRISTIAN = new Set([
      'muslim', 'jewish', 'hindu', 'buddhist', 'sikh', 'shinto',
      'taoist', 'jain', 'bahai', 'pagan',
    ]);
    return elements
      .map((el) => {
        const lat = el.lat ?? el.center?.lat;
        const lon = el.lon ?? el.center?.lon;
        if (lat === undefined || lon === undefined) return null;
        const t = el.tags ?? {};
        // Drop explicitly non-Christian. Keep untagged + christian.
        if (t.religion && NON_CHRISTIAN.has(t.religion.toLowerCase())) return null;
        const isCathedral =
          t.building === 'cathedral' ||
          t.place_of_worship === 'cathedral' ||
          /\b(cathedral|cathédrale|catedral|duomo|dom)\b/i.test(t.name ?? '');
        return {
          id: el.id,
          lng: lon,
          lat,
          name: t.name,
          building: t.building,
          worship: t.place_of_worship,
          isCathedral,
        };
      })
      .filter(Boolean) as OsmChurch[];
  } catch {
    return [];
  }
};
const CRYSTAL_SOURCE = 'spiritual-crystal';
const CRYSTAL_BASE = 'spiritual-crystal-base';
const CRYSTAL_GLOW = 'spiritual-crystal-glow';
const SELECTION_SOURCE = 'spiritual-selection';
const SELECTION_COLUMN_SOURCE = 'spiritual-selection-column';
const SELECTION_COLUMN = 'spiritual-selection-column-layer';
const SELECTION_CORE = 'spiritual-selection-core';
const SELECTION_RING = 'spiritual-selection-ring';
const SELECTION_TIP = 'spiritual-selection-tip';

// Generate a deterministic swarm of sub-points around each marker.
// Count = centuries of prayer → density carries presence at distance, not size.
const toSwarmFeatureCollection = (markers: SpiritualMarker[]) => {
  const features: GeoJSON.Feature[] = [];
  for (const m of markers) {
    const n = Math.min(Math.ceil(centuriesFor(m) / 2), 10); // sparser cap
    const radiusDeg = m.type === 'badge' ? 0.32 : m.type === 'skill' ? 0.26 : 0.18;
    const lngScale = 1 / Math.max(Math.cos((m.lat * Math.PI) / 180), 0.05);
    // Hash from marker id so positions stay stable between renders
    let seed = 0;
    for (let k = 0; k < m.id.length; k++) seed = (seed * 31 + m.id.charCodeAt(k)) >>> 0;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0xFFFFFFFF;
    };
    for (let i = 0; i < n; i++) {
      const θ = rand() * Math.PI * 2;
      const dist = Math.sqrt(rand()) * radiusDeg; // uniform area distribution
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            m.lng + Math.cos(θ) * dist * lngScale,
            m.lat + Math.sin(θ) * dist,
          ],
        },
        properties: { type: m.type, parent: m.id },
      });
    }
  }
  return { type: 'FeatureCollection' as const, features };
};
const COLUMN_OUTER = 'spiritual-column-outer';
const COLUMN_INNER = 'spiritual-column-inner';
const ROUTE_GLOW_LAYER = 'pilgrimage-route-glow';
const ROUTE_LINE_LAYER = 'pilgrimage-route-line';
const ROUTE_DASH_LAYER = 'pilgrimage-route-dash';

// Hexagonal polygon at lat/lng for a crystalline footprint, cosine-corrected for latitude.
// Hash from the marker id rotates each crystal so they don't all face the same way.
const makeColumnFootprint = (
  lng: number,
  lat: number,
  radiusDeg: number,
  sides = 6,
  rotation = 0,
): [number, number][] => {
  const latRad = (lat * Math.PI) / 180;
  const lngScale = 1 / Math.max(Math.cos(latRad), 0.05);
  const ring: [number, number][] = [];
  for (let i = 0; i <= sides; i++) {
    const θ = (i / sides) * Math.PI * 2 + rotation;
    ring.push([
      lng + Math.cos(θ) * radiusDeg * lngScale,
      lat + Math.sin(θ) * radiusDeg,
    ]);
  }
  return ring;
};

const hashRotation = (id: string): number => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 360) * (Math.PI / 180);
};

const toColumnFeatureCollection = (markers: SpiritualMarker[]) => ({
  type: 'FeatureCollection' as const,
  features: markers.map((m, i) => {
    const centuries = centuriesFor(m);
    const heightM = Math.sqrt(centuries) * 280000;
    const innerHeightM = heightM * 0.92;
    const beamRadius = m.type === 'badge' ? 0.036 : m.type === 'skill' ? 0.026 : 0.020;
    const rotation = hashRotation(m.id);
    return {
      type: 'Feature' as const,
      id: i,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [makeColumnFootprint(m.lng, m.lat, beamRadius, 6, rotation)],
      },
      properties: {
        id: m.id, type: m.type, label: m.label, hint: m.hint, track: m.track,
        centuries, height: heightM, innerHeight: innerHeightM,
      },
    };
  }),
});

// Short, wider hexagonal prism at the base of each beam — the "crystal".
const toCrystalFeatureCollection = (markers: SpiritualMarker[]) => ({
  type: 'FeatureCollection' as const,
  features: markers.map((m, i) => {
    const radius = m.type === 'badge' ? 0.10 : m.type === 'skill' ? 0.082 : 0.065;
    const rotation = hashRotation(m.id);
    const crystalHeight = m.type === 'badge' ? 160000 : m.type === 'skill' ? 120000 : 90000;
    return {
      type: 'Feature' as const,
      id: i,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [makeColumnFootprint(m.lng, m.lat, radius, 6, rotation)],
      },
      properties: {
        id: m.id, type: m.type, height: crystalHeight,
      },
    };
  }),
});

// Pilgrimage routes — historically canonical paths with major waypoints
const ROUTE_TRADITIONS: Array<{ id: string; track: Track | 'common'; color: string; coords: [number, number][] }> = [
  // ── Camino Francés ─────────────────────────────────────────────────────────
  { id: 'camino-frances', track: 'catholic', color: '#F4C542',
    coords: [
      [-1.2358, 43.1635], // St-Jean-Pied-de-Port
      [-1.3198, 43.0090], // Roncevaux
      [-1.6458, 42.8125], // Pamplona
      [-2.4500, 42.4667], // Logroño
      [-2.9348, 42.3461], // Nájera
      [-3.6969, 42.3439], // Burgos
      [-4.5463, 42.4410], // Palencia area
      [-5.5671, 42.5987], // León
      [-6.5970, 42.5461], // Ponferrada
      [-7.4148, 42.7789], // Sarria
      [-8.5450, 42.8806], // Santiago de Compostela
    ],
  },
  // ── Camino Portugués ───────────────────────────────────────────────────────
  { id: 'camino-portugues', track: 'catholic', color: '#F4C542',
    coords: [
      [-9.1393, 38.7223], // Lisbon
      [-8.6731, 39.6306], // Fátima
      [-8.6291, 41.1579], // Porto
      [-8.4265, 41.5454], // Braga
      [-8.6453, 42.0424], // Tui (Espagne)
      [-8.6467, 42.4336], // Pontevedra
      [-8.6558, 42.7347], // Padrón
      [-8.5450, 42.8806], // Santiago
    ],
  },
  // ── Camino del Norte ───────────────────────────────────────────────────────
  { id: 'camino-norte', track: 'common', color: '#34D399',
    coords: [
      [-1.9812, 43.3183], // Irún (frontière)
      [-2.9350, 43.2630], // Bilbao
      [-3.8100, 43.4623], // Santander
      [-4.5350, 43.4580], // Llanes
      [-5.6611, 43.5322], // Gijón
      [-5.8593, 43.3614], // Oviedo (jonction Primitivo)
      [-7.5560, 43.5372], // Lugo
      [-8.5450, 42.8806], // Santiago
    ],
  },
  // ── Camino Primitivo ───────────────────────────────────────────────────────
  { id: 'camino-primitivo', track: 'common', color: '#4ADE80',
    coords: [
      [-5.8593, 43.3614], // Oviedo
      [-6.3621, 43.3469], // Grado
      [-7.5560, 43.5372], // Lugo
      [-7.8855, 43.1270], // Melide
      [-8.5450, 42.8806], // Santiago
    ],
  },
  // ── Via Turonensis (Voie de Tours) ─────────────────────────────────────────
  { id: 'via-turonensis', track: 'catholic', color: '#FBBF24',
    coords: [
      [ 0.6848, 47.3941], // Tours
      [ 0.3404, 46.5802], // Poitiers
      [-0.6323, 45.7461], // Saintes
      [-0.5792, 44.8378], // Bordeaux
      [-0.9988, 43.5880], // Bayonne
      [-1.0422, 43.3564], // Ostabat
      [-1.2358, 43.1635], // St-Jean-Pied-de-Port
      [-1.3198, 43.0090], // Roncevaux
      [-8.5450, 42.8806], // Santiago
    ],
  },
  // ── Via Lemovicensis (Voie de Vézelay) ────────────────────────────────────
  { id: 'via-lemovicensis', track: 'catholic', color: '#F97316',
    coords: [
      [ 3.7481, 47.4658], // Vézelay
      [ 1.2611, 45.8336], // Limoges
      [ 0.7214, 45.1835], // Périgueux
      [-0.5792, 44.8378], // Bordeaux
      [-1.0422, 43.3564], // Ostabat
      [-1.2358, 43.1635], // St-Jean-Pied-de-Port
      [-8.5450, 42.8806], // Santiago
    ],
  },
  // ── Via Tolosana (Voie d'Arles) ───────────────────────────────────────────
  { id: 'via-tolosana', track: 'catholic', color: '#FB923C',
    coords: [
      [ 4.6277, 43.6767], // Arles
      [ 3.8767, 43.6108], // Montpellier
      [ 1.4442, 43.6047], // Toulouse
      [-0.6200, 43.2965], // Oloron-Sainte-Marie
      [-0.5670, 43.0548], // Somport (col)
      [-0.4630, 42.8006], // Jaca
      [-1.6458, 42.8125], // Pamplona (jonction Francés)
      [-8.5450, 42.8806], // Santiago
    ],
  },
  // ── Via Francigena (Canterbury → Rome) ────────────────────────────────────
  { id: 'via-francigena', track: 'catholic', color: '#A78BFA',
    coords: [
      [ 1.0828, 51.2799], // Canterbury
      [ 1.3134, 51.1279], // Douvres
      [ 1.8587, 50.9513], // Calais
      [ 2.7812, 50.2926], // Arras
      [ 4.0314, 49.2538], // Reims
      [ 4.3519, 48.3534], // Bar-sur-Aube
      [ 5.8821, 47.2428], // Besançon
      [ 6.6323, 46.5197], // Lausanne
      [ 7.3153, 45.7355], // Aoste (Grand-St-Bernard)
      [ 9.1582, 45.1847], // Pavie
      [10.5050, 43.8430], // Lucca
      [11.2558, 43.7696], // Florence
      [11.3308, 43.3188], // Sienne
      [11.8768, 42.6300], // Bolsena
      [12.4964, 41.9028], // Rome
    ],
  },
  // ── Pèlerinage de Cologne (Rois Mages) ────────────────────────────────────
  { id: 'route-cologne', track: 'catholic', color: '#60A5FA',
    coords: [
      [-1.5115, 48.6361], // Mont-Saint-Michel
      [ 2.3522, 48.8566], // Paris
      [ 4.0314, 49.2538], // Reims
      [ 6.9583, 50.9413], // Cologne
    ],
  },
  // ── Via di Francesco (Assise → Rome) ──────────────────────────────────────
  { id: 'via-di-francesco', track: 'catholic', color: '#FDE68A',
    coords: [
      [12.6197, 43.0707], // Assise
      [12.7298, 43.1094], // Spello
      [12.7007, 43.4400], // Gubbio
      [12.4964, 41.9028], // Rome (via Rieti)
    ],
  },
  // ── Via Egnatia (Orient orthodoxe) ────────────────────────────────────────
  { id: 'via-egnatia', track: 'orthodox', color: '#C084FC',
    coords: [
      [20.8015, 41.1125], // Ohrid
      [22.9444, 40.6401], // Thessalonique
      [24.3287, 40.1571], // Mont-Athos
      [26.5706, 41.6769], // Edirne
      [28.9802, 41.0086], // Constantinople
    ],
  },
  // ── Pèlerinage orthodoxe balkanique ───────────────────────────────────────
  { id: 'balkan-orthodox', track: 'orthodox', color: '#A78BFA',
    coords: [
      [23.3219, 42.6977], // Sofia
      [26.1025, 44.4268], // Bucarest
      [28.9802, 41.0086], // Constantinople
      [24.3287, 40.1571], // Mont-Athos
    ],
  },
  // ── Laure russe (Kyiv → Serguiev Possad) ──────────────────────────────────
  { id: 'rus-orthodox', track: 'orthodox', color: '#C084FC',
    coords: [
      [30.5567, 50.4350], // Kyiv
      [37.6173, 55.7558], // Moscou
      [38.1333, 56.3000], // Serguiev Possad
    ],
  },
  // ── Route apostolique orientale ────────────────────────────────────────────
  { id: 'apostolic-east', track: 'orthodox', color: '#818CF8',
    coords: [
      [36.1606, 36.2025], // Antioche
      [36.7213, 37.0660], // Alep (historique)
      [36.3196, 33.5138], // Damas
      [35.2354, 31.7783], // Jérusalem
    ],
  },
  // ── Terre Sainte (Via Dolorosa & Galilée) ─────────────────────────────────
  { id: 'holy-land', track: 'common', color: '#FDE68A',
    coords: [
      [35.2024, 31.7054], // Bethléem
      [35.2354, 31.7783], // Jérusalem
      [35.4595, 31.8557], // Jéricho
      [35.5714, 32.8798], // Capharnaüm
      [35.2978, 32.7022], // Nazareth
    ],
  },
  // ── Sinaï (route monastique) ───────────────────────────────────────────────
  { id: 'sinai-route', track: 'orthodox', color: '#FCD34D',
    coords: [
      [32.2819, 29.9792], // Le Caire
      [33.9761, 28.5388], // Mont Sinaï
      [34.9260, 29.5581], // Aqaba
      [35.2354, 31.7783], // Jérusalem
    ],
  },
  // ── Corridor de la Réforme ─────────────────────────────────────────────────
  { id: 'reform-corridor', track: 'protestant', color: '#7DD3FC',
    coords: [
      [-6.4147, 56.3296], // Iona
      [-1.7994, 55.6825], // Lindisfarne
      [ 1.0828, 51.2799], // Canterbury
      [ 6.1432, 46.2044], // Genève
      [12.6477, 51.8665], // Wittenberg
      [10.6866, 53.8655], // Lübeck
    ],
  },
];

const greatCircle = (a: [number, number], b: [number, number], steps = 32): [number, number][] => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const φ1 = toRad(lat1), λ1 = toRad(lng1);
  const φ2 = toRad(lat2), λ2 = toRad(lng2);
  const d = 2 * Math.asin(
    Math.sqrt(
      Math.sin((φ2 - φ1) / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2,
    ),
  );
  if (d === 0) return [a, b];
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    const φ = Math.atan2(z, Math.sqrt(x * x + y * y));
    const λ = Math.atan2(y, x);
    out.push([toDeg(λ), toDeg(φ)]);
  }
  return out;
};

const buildRoutesFeatureCollection = (
  pathOverrides?: Record<string, [number, number][]>,
) => ({
  type: 'FeatureCollection' as const,
  features: ROUTE_TRADITIONS.map((tr) => {
    let path: [number, number][];
    const override = pathOverrides?.[tr.id];
    if (override && override.length > 1) {
      path = override;
    } else {
      path = [];
      for (let i = 0; i < tr.coords.length - 1; i++) {
        const seg = greatCircle(tr.coords[i], tr.coords[i + 1], 32);
        if (i > 0) seg.shift();
        path.push(...seg);
      }
    }
    return {
      type: 'Feature' as const,
      geometry: { type: 'LineString' as const, coordinates: path },
      properties: { id: tr.id, track: tr.track, color: tr.color },
    };
  }),
});

// Fetch a road-following path for one route from the Mapbox Directions API.
// Mapbox accepts up to 25 waypoints per call; all our traditions fit.
const fetchRoadPath = async (
  coords: [number, number][],
  profile: 'driving' | 'walking' = 'driving',
): Promise<[number, number][] | null> => {
  const token = mapboxgl.accessToken;
  if (!token || coords.length < 2) return null;
  const coordStr = coords.map((c) => `${c[0]},${c[1]}`).join(';');
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordStr}` +
    `?geometries=geojson&overview=full&access_token=${token}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const geom = data?.routes?.[0]?.geometry;
    if (!geom || geom.type !== 'LineString') return null;
    return geom.coordinates as [number, number][];
  } catch {
    return null;
  }
};

const toFeatureCollection = (markers: SpiritualMarker[]) => ({
  type: 'FeatureCollection' as const,
  features: markers.map((m, i) => ({
    type: 'Feature' as const,
    id: i,
    geometry: { type: 'Point' as const, coordinates: [m.lng, m.lat] as [number, number] },
    properties: {
      id: m.id,
      type: m.type,
      label: m.label,
      hint: m.hint,
      track: m.track,
      phase: (m.id.charCodeAt(0) % 7) * 0.35,
    },
  })),
});

export interface SpiritualOverlayHandle {
  destroy: () => void;
  setSelectionBeam: (coord: [number, number] | null) => void;
}

export const attachSpiritualOverlay = (map: mapboxgl.Map): SpiritualOverlayHandle => {
  if (map.getSource(SOURCE_ID)) {
    return { destroy: () => detach(map), setSelectionBeam: () => { /* noop */ } };
  }

  try {
    map.setFog?.({
      color: 'rgb(20, 28, 60)',
      'high-color': 'rgb(48, 28, 80)',
      'horizon-blend': 0.18,
      'space-color': 'rgb(6, 8, 22)',
      'star-intensity': 0.55,
    } as never);
  } catch { /* style without fog support */ }

  const roadOverrides: Record<string, [number, number][]> = {};

  map.addSource(ROUTES_SOURCE, {
    type: 'geojson',
    data: buildRoutesFeatureCollection(),
    lineMetrics: true,
  });

  // Async upgrade: replace great-circle arcs with real road paths as they arrive.
  // Throttle to avoid burst-rate-limit; 4 concurrent requests max.
  let cancelled = false;
  (async () => {
    const queue = [...ROUTE_TRADITIONS];
    const inFlight = new Set<Promise<void>>();
    const pump = async () => {
      while (!cancelled && queue.length > 0) {
        const tr = queue.shift()!;
        const p = (async () => {
          const path = await fetchRoadPath(tr.coords, 'walking');
          if (cancelled || !path) return;
          roadOverrides[tr.id] = path;
          const src = map.getSource(ROUTES_SOURCE) as mapboxgl.GeoJSONSource | undefined;
          src?.setData(buildRoutesFeatureCollection(roadOverrides));
        })();
        inFlight.add(p);
        p.finally(() => inFlight.delete(p));
        if (inFlight.size >= 4) await Promise.race(inFlight);
      }
      await Promise.all(inFlight);
    };
    await pump();
  })();

  map.addLayer({
    id: ROUTE_GLOW_LAYER,
    type: 'line',
    source: ROUTES_SOURCE,
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 0,
      'line-opacity': 0,
    },
  });
  map.addLayer({
    id: ROUTE_LINE_LAYER,
    type: 'line',
    source: ROUTES_SOURCE,
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 1,
      'line-opacity': 0.55,
    },
  });
  map.addLayer({
    id: ROUTE_DASH_LAYER,
    type: 'line',
    source: ROUTES_SOURCE,
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': '#FDE68A',
      'line-width': 1.2,
      'line-opacity': 0.45,
      'line-dasharray': [0, 4, 3],
    },
  });

  map.addSource(SOURCE_ID, {
    type: 'geojson',
    data: toFeatureCollection(SPIRITUAL_MARKERS),
  });

  // Volumetric prayer columns — fill-extrusion polygons rising orthogonally
  // from the globe surface. Height = √(centuries of prayer) × 80km.
  map.addSource(COLUMN_SOURCE, {
    type: 'geojson',
    data: toColumnFeatureCollection(SPIRITUAL_MARKERS),
  });

  // Crystal of light at each site — short hex prism with a soft surface glow.
  map.addSource(CRYSTAL_SOURCE, {
    type: 'geojson',
    data: toCrystalFeatureCollection(SPIRITUAL_MARKERS),
  });

  // (Ground glow removed — light only emanates from the beam itself)

  // The crystal itself — short hex prism, bright with vertical gradient.
  // Scales up at low zoom so sites read at globe scale.
  map.addLayer({
    id: CRYSTAL_BASE,
    type: 'fill-extrusion',
    source: CRYSTAL_SOURCE,
    paint: {
      'fill-extrusion-color': [
        'match', ['get', 'type'],
        'badge', '#FFE89A',
        'token', '#C8ECFF',
        'skill', '#E5CCFF',
        '#ffffff',
      ],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': 0,
      'fill-extrusion-opacity': 0.95,
      'fill-extrusion-vertical-gradient': true,
      'fill-extrusion-emissive-strength': 0.8,
    },
  });

  // Cathedrals of light — beams shooting up from each sacred site,
  // height proportional to centuries of prayer, fading upward like searchlights.
  map.addLayer({
    id: COLUMN_OUTER,
    type: 'fill-extrusion',
    source: COLUMN_SOURCE,
    paint: {
      'fill-extrusion-color': [
        'match', ['get', 'type'],
        'badge', SPIRITUAL_TYPE_COLOR.badge.core,
        'token', SPIRITUAL_TYPE_COLOR.token.core,
        'skill', SPIRITUAL_TYPE_COLOR.skill.core,
        '#ffffff',
      ],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': 0,
      'fill-extrusion-opacity': 0.80,
      'fill-extrusion-vertical-gradient': true,
      'fill-extrusion-emissive-strength': 1.0,
    },
  });

  map.addLayer({
    id: COLUMN_INNER,
    type: 'fill-extrusion',
    source: COLUMN_SOURCE,
    paint: {
      'fill-extrusion-color': '#ffffff',
      'fill-extrusion-height': ['*', ['get', 'height'], 1.2],
      'fill-extrusion-base': 0,
      'fill-extrusion-opacity': 0.95,
      'fill-extrusion-vertical-gradient': true,
      'fill-extrusion-emissive-strength': 1.5,
    },
  });

  // ── OSM live churches ────────────────────────────────────────────────────
  // Pulls Christian places of worship from OpenStreetMap in the visible bbox.
  // Renders only at zoom ≥ 8 to keep it from flooding low-zoom views.
  map.addSource(OSM_CHURCHES_SOURCE, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  });

  map.addLayer({
    id: OSM_CHURCH_LAYER,
    type: 'circle',
    source: OSM_CHURCHES_SOURCE,
    minzoom: 4,
    filter: ['!=', ['get', 'isCathedral'], true],
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['zoom'],
        6, 1.2, 9, 2.0, 12, 2.8, 16, 4,
      ],
      'circle-color': '#FCD34D',
      'circle-opacity': 0.7,
      'circle-blur': 0,
      'circle-stroke-color': '#0B0F26',
      'circle-stroke-width': 0.4,
      'circle-pitch-alignment': 'map',
    },
  });

  map.addLayer({
    id: OSM_CATHEDRAL_LAYER,
    type: 'circle',
    source: OSM_CHURCHES_SOURCE,
    minzoom: 4,
    filter: ['==', ['get', 'isCathedral'], true],
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['zoom'],
        4, 2.5, 7, 4, 11, 6, 14, 8,
      ],
      'circle-color': '#FFE89A',
      'circle-opacity': 0.95,
      'circle-blur': 0,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 1,
      'circle-pitch-alignment': 'map',
    },
  });

  // Tile-cached fetcher (keyed by ~1° bbox tiles, low precision)
  const churchCache = new Map<string, OsmChurch[]>();
  const seenIds = new Set<number>();
  const accumulated: OsmChurch[] = [];
  let osmTimer: ReturnType<typeof setTimeout> | null = null;
  let osmAbort: AbortController | null = null;
  let lastQueryAt = 0;
  let backoffUntil = 0;
  let inflight = false;

  const refreshChurchSource = () => {
    const src = map.getSource(OSM_CHURCHES_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    if (!src) return;
    src.setData({
      type: 'FeatureCollection',
      features: accumulated.map((c) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
        properties: {
          id: c.id,
          name: c.name ?? '',
          isCathedral: c.isCathedral,
        },
      })),
    });
  };

  const tileKey = (bbox: [number, number, number, number]) =>
    bbox.map((v) => Math.floor(v)).join(',');

  const queryOsmChurches = async () => {
    if (cancelled || inflight) return;
    if (map.getZoom() < 4) return;
    const now = Date.now();
    if (now < backoffUntil) return;
    if (now - lastQueryAt < 2500) return; // self-rate-limit to ≤1 query / 2.5s
    const b = map.getBounds();
    if (!b) return;
    const bbox: [number, number, number, number] = [
      b.getWest(), b.getSouth(), b.getEast(), b.getNorth(),
    ];
    if ((bbox[2] - bbox[0]) > 50 || (bbox[3] - bbox[1]) > 50) return;
    const key = tileKey(bbox);
    if (churchCache.has(key)) return;
    churchCache.set(key, []);

    inflight = true;
    lastQueryAt = now;
    let churches: OsmChurch[] = [];
    try {
      const [w, s, e, n] = bbox;
      const query = `[out:json][timeout:25];(
        node["amenity"="place_of_worship"](${s},${w},${n},${e});
        way["amenity"="place_of_worship"](${s},${w},${n},${e});
        way["building"="church"](${s},${w},${n},${e});
        way["building"="cathedral"](${s},${w},${n},${e});
        way["building"="chapel"](${s},${w},${n},${e});
      );out center 5000;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      if (res.status === 429 || res.status === 504) {
        // Rate-limited or gateway timeout — back off 30s and retry this tile later
        backoffUntil = Date.now() + 30000;
        churchCache.delete(key);
      } else if (res.ok) {
        churches = await fetchOsmChurches(bbox).catch(() => []);
      }
    } catch { /* network */ }
    inflight = false;
    if (cancelled) return;
    churchCache.set(key, churches);
    let added = 0;
    for (const c of churches) {
      if (seenIds.has(c.id)) continue;
      seenIds.add(c.id);
      accumulated.push(c);
      added++;
    }
    if (added > 0) refreshChurchSource();
  };

  const onMoveEndOsm = () => {
    if (osmTimer) clearTimeout(osmTimer);
    osmTimer = setTimeout(queryOsmChurches, 1500);
  };
  map.on('moveend', onMoveEndOsm);
  // Trigger first query after the map settles
  setTimeout(queryOsmChurches, 1500);

  // One-time: pull every cathedral on Earth so they're visible at any zoom.
  (async () => {
    // Wait a beat so initial bbox query goes first (we don't want both racing).
    await new Promise((r) => setTimeout(r, 4000));
    if (cancelled) return;
    const cathedrals = await fetchAllCathedralsGlobal();
    if (cancelled || cathedrals.length === 0) return;
    let added = 0;
    for (const c of cathedrals) {
      if (seenIds.has(c.id)) continue;
      seenIds.add(c.id);
      accumulated.push(c);
      added++;
    }
    if (added > 0) refreshChurchSource();
  })();

  // Density swarm — many small sharp crystalline points per site (count = centuries)
  map.addSource(SWARM_SOURCE, {
    type: 'geojson',
    data: toSwarmFeatureCollection(SPIRITUAL_MARKERS),
  });

  map.addLayer({
    id: SWARM_LAYER,
    type: 'circle',
    source: SWARM_SOURCE,
    paint: {
      'circle-radius': 1.6,
      'circle-color': [
        'match', ['get', 'type'],
        'badge', SPIRITUAL_TYPE_COLOR.badge.core,
        'token', SPIRITUAL_TYPE_COLOR.token.core,
        'skill', SPIRITUAL_TYPE_COLOR.skill.core,
        '#ffffff',
      ],
      'circle-blur': 0,
      'circle-opacity': 0.55,
      'circle-pitch-alignment': 'map',
      'circle-stroke-width': 0,
    },
  });

  const typeColor = (fallback = '#ffffff') => ([
    'match', ['get', 'type'],
    'badge', SPIRITUAL_TYPE_COLOR.badge.core,
    'token', SPIRITUAL_TYPE_COLOR.token.core,
    'skill', SPIRITUAL_TYPE_COLOR.skill.core,
    fallback,
  ] as mapboxgl.Expression);

  // Ground glow — a wide blurred halo at the base of every beam.
  // circle-blur ≥ 1 smears the circle into a soft bloom on the satellite texture.
  map.addLayer({
    id: BEAM_OUTER,
    type: 'circle',
    source: SOURCE_ID,
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['zoom'],
        2, ['match', ['get', 'type'], 'badge', 22, 'skill', 16, 12],
        6, ['match', ['get', 'type'], 'badge', 40, 'skill', 30, 22],
        10, ['match', ['get', 'type'], 'badge', 60, 'skill', 46, 34],
      ],
      'circle-color': [
        'match', ['get', 'type'],
        'badge', SPIRITUAL_TYPE_COLOR.badge.core,
        'token', SPIRITUAL_TYPE_COLOR.token.core,
        'skill', SPIRITUAL_TYPE_COLOR.skill.core,
        '#ffffff',
      ],
      'circle-blur': 1.4,
      'circle-opacity': 0.55,
      'circle-pitch-alignment': 'map',
    },
  });

  // Inner tight glow ring — sharper, brighter centre bloom
  map.addLayer({
    id: BEAM_MID,
    type: 'circle',
    source: SOURCE_ID,
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['zoom'],
        2, ['match', ['get', 'type'], 'badge', 10, 'skill', 8, 6],
        6, ['match', ['get', 'type'], 'badge', 20, 'skill', 15, 11],
        10, ['match', ['get', 'type'], 'badge', 30, 'skill', 22, 16],
      ],
      'circle-color': '#ffffff',
      'circle-blur': 0.9,
      'circle-opacity': 0.75,
      'circle-pitch-alignment': 'map',
    },
  });

  // Layer 3 — invisible click target (visual is now the crystal base)
  map.addLayer({
    id: BEAM_CORE,
    type: 'circle',
    source: SOURCE_ID,
    paint: {
      'circle-radius': 14,
      'circle-color': '#ffffff',
      'circle-opacity': 0,
      'circle-stroke-width': 0,
      'circle-pitch-alignment': 'map',
    },
  });

  // (BEAM_TIP removed — too much for the dense cluster view)
  map.addLayer({
    id: BEAM_TIP,
    type: 'circle',
    source: SOURCE_ID,
    paint: {
      'circle-radius': 0,
      'circle-opacity': 0,
    },
  });

  // ── Selection beam ──────────────────────────────────────────────────────
  // Bright crystalline column at the user's location (or an arbitrary selection),
  // distinct from the historical sites. Replaces the old green location dot.
  const emptyFC = { type: 'FeatureCollection' as const, features: [] };
  map.addSource(SELECTION_SOURCE, { type: 'geojson', data: emptyFC });
  map.addSource(SELECTION_COLUMN_SOURCE, { type: 'geojson', data: emptyFC });

  map.addLayer({
    id: SELECTION_COLUMN,
    type: 'fill-extrusion',
    source: SELECTION_COLUMN_SOURCE,
    paint: {
      'fill-extrusion-color': '#ffffff',
      'fill-extrusion-height': 600000,
      'fill-extrusion-base': 0,
      'fill-extrusion-opacity': 0.65,
      'fill-extrusion-vertical-gradient': false,
    },
  });

  map.addLayer({
    id: SELECTION_RING,
    type: 'circle',
    source: SELECTION_SOURCE,
    paint: {
      'circle-radius': 22,
      'circle-color': '#ffffff',
      'circle-blur': 0.05,
      'circle-opacity': 0,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
      'circle-stroke-opacity': 0.9,
      'circle-pitch-alignment': 'map',
    },
  });

  map.addLayer({
    id: SELECTION_CORE,
    type: 'circle',
    source: SELECTION_SOURCE,
    paint: {
      'circle-radius': 8,
      'circle-color': '#ffffff',
      'circle-blur': 0,
      'circle-opacity': 1,
      'circle-stroke-color': '#0B0F26',
      'circle-stroke-width': 1.5,
      'circle-stroke-opacity': 0.9,
      'circle-pitch-alignment': 'map',
    },
  });

  map.addLayer({
    id: SELECTION_TIP,
    type: 'circle',
    source: SELECTION_SOURCE,
    paint: {
      'circle-radius': 4,
      'circle-color': '#ffffff',
      'circle-blur': 0.2,
      'circle-opacity': 0.95,
      'circle-pitch-alignment': 'viewport',
      'circle-translate': [0, -28],
      'circle-translate-anchor': 'viewport',
    },
  });

  let popup: mapboxgl.Popup | null = null;
  let hoverPopup: mapboxgl.Popup | null = null;
  let hoveredId: string | number | null = null;

  const renderPopupHtml = (
    type: SpiritualMarkerType,
    label: string,
    hint: string,
    compact = false,
  ) => {
    const colors = SPIRITUAL_TYPE_COLOR[type];
    return `<div style="
        font-family: inherit;
        min-width: ${compact ? 140 : 160}px;
        padding: ${compact ? '6px 9px' : '8px 10px'};
        border-radius: 10px;
        background: rgba(8,16,40,0.92);
        border: 1px solid ${colors.core}55;
        box-shadow: 0 0 16px ${colors.halo};
        color: #fff;
        font-size: 11px;
        backdrop-filter: blur(12px);">
      <div style="display:flex; align-items:center; gap:6px; font-weight:600; color:${colors.core};">
        <span style="text-transform:uppercase; letter-spacing:0.08em; font-size:9px;">${type}</span>
        <span style="color:#fff;">· ${label}</span>
      </div>
      <div style="color:rgba(255,255,255,0.85); margin-top:2px; line-height:1.35;">${hint}</div>
    </div>`;
  };

  const onClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
    const f = e.features?.[0];
    if (!f) return;
    const props = f.properties as {
      type: SpiritualMarkerType; label: string; hint: string; id?: string;
    };
    // Resolve the canonical site coords (so click on a swarm dot snaps to its parent gem)
    const parentId = (f.properties as { parent?: string }).parent ?? props.id;
    const site = parentId ? SPIRITUAL_MARKERS.find((m) => m.id === parentId) : null;
    const center: [number, number] = site
      ? [site.lng, site.lat]
      : [e.lngLat.lng, e.lngLat.lat];
    const label = site?.label ?? props.label;
    const hint = site?.hint ?? props.hint;
    const type = (site?.type ?? props.type) as SpiritualMarkerType;

    if (popup) popup.remove();
    popup = new mapboxgl.Popup({ closeButton: false, offset: 16, className: 'spiritual-popup' })
      .setLngLat(center)
      .setHTML(renderPopupHtml(type, label, hint))
      .addTo(map);
    setSelectionBeam(center);
    map.flyTo({ center, zoom: Math.max(map.getZoom(), 4.5), speed: 0.8 });
  };

  // Click on empty map → clear selection
  const onMapClick = (e: mapboxgl.MapMouseEvent) => {
    const hit = map.queryRenderedFeatures(e.point, {
      layers: [BEAM_CORE, CRYSTAL_BASE, COLUMN_OUTER, SWARM_LAYER],
    });
    if (hit.length === 0) {
      setSelectionBeam(null);
      if (popup) { popup.remove(); popup = null; }
    }
  };

  const setHover = (id: string | number | null) => {
    if (hoveredId !== null) {
      map.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: false });
    }
    hoveredId = id;
    if (id !== null) {
      map.setFeatureState({ source: SOURCE_ID, id }, { hover: true });
    }
  };

  const onMouseMove = (
    e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] },
  ) => {
    const f = e.features?.[0];
    if (!f) return;
    map.getCanvas().style.cursor = 'pointer';
    const fid = (f.id ?? (f.properties?.id as string | undefined)) ?? null;
    if (fid !== null && fid !== hoveredId) setHover(fid as string | number);
    const props = f.properties as { type: SpiritualMarkerType; label: string; hint: string };
    if (!hoverPopup) {
      hoverPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 14,
        className: 'spiritual-popup-hover',
      });
    }
    hoverPopup.setLngLat(e.lngLat).setHTML(renderPopupHtml(props.type, props.label, props.hint, true)).addTo(map);
  };

  const onMouseLeave = () => {
    map.getCanvas().style.cursor = '';
    setHover(null);
    if (hoverPopup) { hoverPopup.remove(); hoverPopup = null; }
  };

  map.on('click', BEAM_CORE, onClick);
  map.on('click', CRYSTAL_BASE, onClick);
  map.on('click', COLUMN_OUTER, onClick);
  map.on('click', SWARM_LAYER, onClick);
  map.on('click', onMapClick);
  map.on('mousemove', BEAM_CORE, onMouseMove);
  map.on('mousemove', CRYSTAL_BASE, onMouseMove);
  map.on('mousemove', SWARM_LAYER, onMouseMove);
  map.on('mouseleave', BEAM_CORE, onMouseLeave);
  map.on('mouseleave', CRYSTAL_BASE, onMouseLeave);
  map.on('mouseleave', SWARM_LAYER, onMouseLeave);

  const dashSequence: Array<[number, number]> = [
    [0, 4], [0.5, 4], [1, 4], [1.5, 4],
    [2, 4], [2.5, 4], [3, 4], [3.5, 4],
  ];
  let raf = 0;
  let lastDashStep = -1;
  const tick = () => {
    if (!map.getLayer(BEAM_OUTER)) return;
    const t = performance.now() / 1000;
    const sin = Math.sin(t * 1.6);
    const slow = Math.sin(t * 0.7);

    // Halo glow pulse — slow, luminous breath
    try {
      map.setPaintProperty(BEAM_OUTER, 'circle-opacity', 0.45 + slow * 0.18);
      map.setPaintProperty(BEAM_MID,   'circle-opacity', 0.65 + sin  * 0.15);
      map.setPaintProperty(BEAM_TIP,   'circle-opacity', 0.85 + sin  * 0.10);
    } catch { /* style swap mid-frame */ }

    // Prayer column slow opacity breath
    try {
      map.setPaintProperty(COLUMN_OUTER, 'fill-extrusion-opacity', 0.72 + slow * 0.12);
      map.setPaintProperty(COLUMN_INNER, 'fill-extrusion-opacity', 0.88 + slow * 0.10);
    } catch { /* layer gone */ }

    const step = Math.floor((t * 4) % dashSequence.length);
    if (step !== lastDashStep) {
      lastDashStep = step;
      try {
        const [a, b] = dashSequence[step];
        map.setPaintProperty(ROUTE_DASH_LAYER, 'line-dasharray', [a + 0.001, b]);
      } catch { /* layer gone */ }
    }

    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  const detach = (m: mapboxgl.Map) => {
    cancelled = true;
    cancelAnimationFrame(raf);
    if (osmAbort) osmAbort.abort();
    if (osmTimer) clearTimeout(osmTimer);
    m.off('moveend', onMoveEndOsm);
    if (popup) { popup.remove(); popup = null; }
    if (hoverPopup) { hoverPopup.remove(); hoverPopup = null; }
    m.off('click', BEAM_CORE, onClick);
    m.off('click', CRYSTAL_BASE, onClick);
    m.off('click', COLUMN_OUTER, onClick);
    m.off('click', SWARM_LAYER, onClick);
    m.off('click', onMapClick);
    m.off('mousemove', BEAM_CORE, onMouseMove);
    m.off('mousemove', CRYSTAL_BASE, onMouseMove);
    m.off('mousemove', SWARM_LAYER, onMouseMove);
    m.off('mouseleave', BEAM_CORE, onMouseLeave);
    m.off('mouseleave', CRYSTAL_BASE, onMouseLeave);
    m.off('mouseleave', SWARM_LAYER, onMouseLeave);
    if (m.getLayer(BEAM_TIP)) m.removeLayer(BEAM_TIP);
    if (m.getLayer(BEAM_CORE)) m.removeLayer(BEAM_CORE);
    if (m.getLayer(BEAM_MID)) m.removeLayer(BEAM_MID);
    if (m.getLayer(BEAM_OUTER)) m.removeLayer(BEAM_OUTER);
    if (m.getLayer(SWARM_LAYER)) m.removeLayer(SWARM_LAYER);
    if (m.getLayer(OSM_CATHEDRAL_LAYER)) m.removeLayer(OSM_CATHEDRAL_LAYER);
    if (m.getLayer(OSM_CHURCH_LAYER)) m.removeLayer(OSM_CHURCH_LAYER);
    if (m.getSource(OSM_CHURCHES_SOURCE)) m.removeSource(OSM_CHURCHES_SOURCE);
    if (m.getLayer('spiritual-gem-disc')) m.removeLayer('spiritual-gem-disc');
    if (m.getLayer(CRYSTAL_BASE)) m.removeLayer(CRYSTAL_BASE);
    if (m.getLayer(CRYSTAL_GLOW)) m.removeLayer(CRYSTAL_GLOW);
    if (m.getSource(CRYSTAL_SOURCE)) m.removeSource(CRYSTAL_SOURCE);
    if (m.getLayer(SELECTION_TIP)) m.removeLayer(SELECTION_TIP);
    if (m.getLayer(SELECTION_CORE)) m.removeLayer(SELECTION_CORE);
    if (m.getLayer(SELECTION_RING)) m.removeLayer(SELECTION_RING);
    if (m.getLayer(SELECTION_COLUMN)) m.removeLayer(SELECTION_COLUMN);
    if (m.getLayer(COLUMN_INNER)) m.removeLayer(COLUMN_INNER);
    if (m.getLayer(COLUMN_OUTER)) m.removeLayer(COLUMN_OUTER);
    if (m.getSource(SWARM_SOURCE)) m.removeSource(SWARM_SOURCE);
    if (m.getSource(SELECTION_COLUMN_SOURCE)) m.removeSource(SELECTION_COLUMN_SOURCE);
    if (m.getSource(SELECTION_SOURCE)) m.removeSource(SELECTION_SOURCE);
    if (m.getSource(COLUMN_SOURCE)) m.removeSource(COLUMN_SOURCE);
    if (m.getLayer(ROUTE_DASH_LAYER)) m.removeLayer(ROUTE_DASH_LAYER);
    if (m.getLayer(ROUTE_LINE_LAYER)) m.removeLayer(ROUTE_LINE_LAYER);
    if (m.getLayer(ROUTE_GLOW_LAYER)) m.removeLayer(ROUTE_GLOW_LAYER);
    if (m.getSource(SOURCE_ID)) m.removeSource(SOURCE_ID);
    if (m.getSource(ROUTES_SOURCE)) m.removeSource(ROUTES_SOURCE);
  };

  const setSelectionBeam = (coord: [number, number] | null) => {
    const dotSrc = map.getSource(SELECTION_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    const colSrc = map.getSource(SELECTION_COLUMN_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    if (!dotSrc || !colSrc) return;
    if (!coord) {
      dotSrc.setData(emptyFC);
      colSrc.setData(emptyFC);
      return;
    }
    const [lng, lat] = coord;
    dotSrc.setData({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {},
      }],
    });
    colSrc.setData({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [makeColumnFootprint(lng, lat, 0.05)],
        },
        properties: {},
      }],
    });
  };

  return { destroy: () => detach(map), setSelectionBeam };
};

export const spiritualCounts = () => ({
  badge: SPIRITUAL_MARKERS.filter((m) => m.type === 'badge').length,
  token: SPIRITUAL_MARKERS.filter((m) => m.type === 'token').length,
  skill: SPIRITUAL_MARKERS.filter((m) => m.type === 'skill').length,
});
