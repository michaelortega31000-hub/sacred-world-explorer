-- =====================================================
-- PHASE 1: Schema changes for Cultural Museums
-- =====================================================

-- Add new columns to places table
ALTER TABLE places ADD COLUMN IF NOT EXISTS place_category TEXT DEFAULT 'religious_site';
ALTER TABLE places ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE places ADD COLUMN IF NOT EXISTS traditions_related TEXT[] DEFAULT '{}';

-- Create index for place_category for performance
CREATE INDEX IF NOT EXISTS idx_places_place_category ON places(place_category);

-- Update all existing places to have religious_site category
UPDATE places SET place_category = 'religious_site' WHERE place_category IS NULL;

-- =====================================================
-- PHASE 2: Insert 30 Cultural Museums
-- =====================================================

-- EUROPE (10 museums)
INSERT INTO places (id, name, country, city, type, place_category, description, coordinates, points_value, tags, traditions_related, verification_status, data_source)
VALUES
  ('mus-vatican-rome', 'Musées du Vatican', 'Italy', 'Rome', 'Musée', 'museum', 
   'L''une des plus grandes collections d''art sacré au monde, abritant la Chapelle Sixtine et des trésors de l''Antiquité à la Renaissance. Un voyage à travers 2000 ans d''histoire chrétienne et artistique.',
   '{"lng": 12.4547, "lat": 41.9065}', 80,
   ARRAY['art_sacre', 'icones', 'antiquite'], ARRAY['christianisme'], 'verified', 'manual'),
   
  ('mus-chester-beatty-dublin', 'Chester Beatty Library', 'Ireland', 'Dublin', 'Musée', 'museum',
   'Collection exceptionnelle de manuscrits sacrés, textes islamiques, bouddhistes et chrétiens. Un trésor de calligraphie et d''enluminures du monde entier.',
   '{"lng": -6.2674, "lat": 53.3428}', 70,
   ARRAY['manuscrits', 'calligraphie', 'interreligieux'], ARRAY['christianisme', 'islam', 'bouddhisme'], 'verified', 'manual'),
   
  ('mus-cloisters-nyc', 'The Cloisters', 'United States', 'New York', 'Musée', 'museum',
   'Branche médiévale du Metropolitan Museum, reconstituant des cloîtres européens. Art sacré médiéval dans un cadre architectural unique surplombant l''Hudson.',
   '{"lng": -73.9319, "lat": 40.8649}', 75,
   ARRAY['art_sacre', 'icones', 'manuscrits'], ARRAY['christianisme'], 'verified', 'manual'),
   
  ('mus-byzantine-thessaloniki', 'Museum of Byzantine Culture', 'Greece', 'Thessaloniki', 'Musée', 'museum',
   'Prix du Conseil de l''Europe, ce musée présente l''art et la spiritualité byzantine à travers icônes, fresques et objets liturgiques exceptionnels.',
   '{"lng": 22.9576, "lat": 40.6221}', 70,
   ARRAY['icones', 'art_sacre', 'rites'], ARRAY['christianisme'], 'verified', 'manual'),
   
  ('mus-acropolis-athens', 'Acropolis Museum', 'Greece', 'Athens', 'Musée', 'museum',
   'Écrin moderne pour les trésors du Parthénon et de l''Acropole. Sculptures, frises et offrandes votives témoignant de la spiritualité de la Grèce antique.',
   '{"lng": 23.7286, "lat": 37.9685}', 80,
   ARRAY['antiquite', 'rites', 'civilisations'], ARRAY['traditions_du_monde'], 'verified', 'manual'),
   
  ('mus-quai-branly-paris', 'Musée du quai Branly - Jacques Chirac', 'France', 'Paris', 'Musée', 'museum',
   'Arts et civilisations d''Afrique, Asie, Océanie et Amériques. Masques rituels, objets sacrés et traditions spirituelles des peuples du monde.',
   '{"lng": 2.2977, "lat": 48.8611}', 75,
   ARRAY['rites', 'civilisations', 'interreligieux'], ARRAY['traditions_du_monde'], 'verified', 'manual'),
   
  ('mus-rijksmuseum-amsterdam', 'Rijksmuseum', 'Netherlands', 'Amsterdam', 'Musée', 'museum',
   'Chefs-d''œuvre de Rembrandt et Vermeer, avec une riche collection d''art sacré néerlandais. Retables, sculptures religieuses et peintures dévotionnelles.',
   '{"lng": 4.8852, "lat": 52.3600}', 75,
   ARRAY['art_sacre', 'icones'], ARRAY['christianisme'], 'verified', 'manual'),
   
  ('mus-humboldt-berlin', 'Humboldt Forum - Ethnologisches Museum', 'Germany', 'Berlin', 'Musée', 'museum',
   'Collections ethnologiques mondiales dans le château reconstruit de Berlin. Objets rituels, art sacré et spiritualités des cultures du monde.',
   '{"lng": 13.3989, "lat": 52.5186}', 70,
   ARRAY['civilisations', 'rites', 'interreligieux'], ARRAY['traditions_du_monde'], 'verified', 'manual'),
   
  ('mus-hermitage-spb', 'State Hermitage Museum', 'Russia', 'Saint Petersburg', 'Musée', 'museum',
   'L''un des plus grands musées du monde avec une collection exceptionnelle d''icônes russes, d''art byzantin et d''objets liturgiques orthodoxes.',
   '{"lng": 30.3146, "lat": 59.9398}', 80,
   ARRAY['icones', 'art_sacre', 'antiquite'], ARRAY['christianisme'], 'verified', 'manual'),
   
  ('mus-history-religion-spb', 'Museum of the History of Religion', 'Russia', 'Saint Petersburg', 'Musée', 'museum',
   'Unique musée dédié à l''histoire comparée des religions. Collections couvrant judaïsme, christianisme, islam, bouddhisme et traditions anciennes.',
   '{"lng": 30.3061, "lat": 59.9339}', 70,
   ARRAY['interreligieux', 'rites', 'civilisations'], ARRAY['christianisme', 'islam', 'judaisme', 'bouddhisme'], 'verified', 'manual'),

-- AFRICA / MIDDLE EAST (8 museums)
  ('mus-egyptian-cairo', 'Musée égyptien du Caire', 'Egypt', 'Cairo', 'Musée', 'museum',
   'Trésors pharaoniques dont le masque de Toutânkhamon. Momies royales, sarcophages et objets funéraires témoignant des croyances de l''Égypte ancienne.',
   '{"lng": 31.2337, "lat": 30.0478}', 80,
   ARRAY['antiquite', 'rites', 'civilisations'], ARRAY['traditions_du_monde'], 'verified', 'manual'),
   
  ('mus-coptic-cairo', 'Coptic Museum', 'Egypt', 'Cairo', 'Musée', 'museum',
   'Plus grande collection d''art copte au monde. Icônes, textiles, manuscrits et objets liturgiques des premiers chrétiens d''Égypte.',
   '{"lng": 31.2297, "lat": 30.0058}', 70,
   ARRAY['icones', 'manuscrits', 'art_sacre'], ARRAY['christianisme'], 'verified', 'manual'),
   
  ('mus-nubian-aswan', 'Nubian Museum', 'Egypt', 'Aswan', 'Musée', 'museum',
   'Histoire et spiritualité de la Nubie antique. Objets sacrés, stèles et témoignages des cultes nubiens et de la christianisation de la région.',
   '{"lng": 32.8998, "lat": 24.0836}', 65,
   ARRAY['antiquite', 'civilisations', 'rites'], ARRAY['traditions_du_monde'], 'verified', 'manual'),
   
  ('mus-bardo-tunis', 'Bardo National Museum', 'Tunisia', 'Tunis', 'Musée', 'museum',
   'Exceptionnelle collection de mosaïques romaines et d''art islamique. Témoignages des spiritualités méditerranéennes de l''Antiquité à l''Islam.',
   '{"lng": 10.1345, "lat": 36.8094}', 70,
   ARRAY['antiquite', 'art_sacre', 'civilisations'], ARRAY['islam', 'traditions_du_monde'], 'verified', 'manual'),
   
  ('mus-ethiopia-addis', 'National Museum of Ethiopia', 'Ethiopia', 'Addis Ababa', 'Musée', 'museum',
   'Abrite Lucy et des trésors du christianisme éthiopien. Croix processionnelles, manuscrits enluminés et objets liturgiques de l''Église orthodoxe éthiopienne.',
   '{"lng": 38.7494, "lat": 9.0192}', 70,
   ARRAY['manuscrits', 'icones', 'art_sacre'], ARRAY['christianisme'], 'verified', 'manual'),
   
  ('mus-islamic-art-doha', 'Museum of Islamic Art', 'Qatar', 'Doha', 'Musée', 'museum',
   'Chef-d''œuvre architectural de I.M. Pei abritant 1400 ans d''art islamique. Calligraphie, céramiques, textiles et objets sacrés de tout le monde musulman.',
   '{"lng": 51.5395, "lat": 25.2959}', 80,
   ARRAY['calligraphie', 'art_sacre', 'manuscrits'], ARRAY['islam'], 'verified', 'manual'),
   
  ('mus-iran-tehran', 'National Museum of Iran', 'Iran', 'Tehran', 'Musée', 'museum',
   'Des civilisations pré-islamiques à l''art islamique. Objets zoroastriens, reliefs achéménides et calligraphies persanes couvrant 7000 ans d''histoire.',
   '{"lng": 51.4139, "lat": 35.6892}', 75,
   ARRAY['antiquite', 'calligraphie', 'civilisations'], ARRAY['traditions_du_monde', 'islam'], 'verified', 'manual'),
   
  ('mus-israel-jerusalem', 'Israel Museum', 'Israel', 'Jerusalem', 'Musée', 'museum',
   'Manuscrits de la mer Morte et trésors archéologiques. Art et objets rituels du judaïsme, des origines bibliques à aujourd''hui.',
   '{"lng": 35.2044, "lat": 31.7740}', 80,
   ARRAY['manuscrits', 'archeologie', 'rites'], ARRAY['judaisme'], 'verified', 'manual'),

-- ASIA (7 museums)
  ('mus-islamic-arts-kl', 'Islamic Arts Museum Malaysia', 'Malaysia', 'Kuala Lumpur', 'Musée', 'museum',
   'Plus grand musée d''art islamique d''Asie du Sud-Est. Architecture, calligraphie, textiles et objets rituels du monde musulman.',
   '{"lng": 101.6892, "lat": 3.1426}', 70,
   ARRAY['calligraphie', 'art_sacre', 'rites'], ARRAY['islam'], 'verified', 'manual'),
   
  ('mus-tokyo-national', 'Tokyo National Museum', 'Japan', 'Tokyo', 'Musée', 'museum',
   'Plus ancien et plus grand musée du Japon. Art bouddhiste, sculptures shinto, calligraphies zen et trésors nationaux de la spiritualité japonaise.',
   '{"lng": 139.7765, "lat": 35.7188}', 80,
   ARRAY['art_sacre', 'calligraphie', 'rites'], ARRAY['bouddhisme', 'traditions_du_monde'], 'verified', 'manual'),
   
  ('mus-korea-seoul', 'National Museum of Korea', 'South Korea', 'Seoul', 'Musée', 'museum',
   'Trésors bouddhistes et chamaniques coréens. Statues dorées, céladons rituels et peintures dévotionnelles de la péninsule coréenne.',
   '{"lng": 126.9805, "lat": 37.5239}', 75,
   ARRAY['art_sacre', 'rites', 'civilisations'], ARRAY['bouddhisme', 'traditions_du_monde'], 'verified', 'manual'),
   
  ('mus-palace-taipei', 'National Palace Museum', 'Taiwan', 'Taipei', 'Musée', 'museum',
   'Collection impériale chinoise avec bronzes rituels, jades sacrés et peintures bouddhistes. Chefs-d''œuvre de la spiritualité chinoise.',
   '{"lng": 121.5485, "lat": 25.1024}', 80,
   ARRAY['art_sacre', 'antiquite', 'calligraphie'], ARRAY['bouddhisme', 'traditions_du_monde'], 'verified', 'manual'),
   
  ('mus-world-religions-taipei', 'Museum of World Religions', 'Taiwan', 'New Taipei City', 'Musée', 'museum',
   'Musée unique dédié au dialogue interreligieux. Présentations immersives des grandes traditions spirituelles et de leurs pratiques.',
   '{"lng": 121.4628, "lat": 25.0112}', 65,
   ARRAY['interreligieux', 'rites', 'civilisations'], ARRAY['christianisme', 'islam', 'judaisme', 'bouddhisme', 'hindouisme'], 'verified', 'manual'),
   
  ('mus-indian-kolkata', 'Indian Museum', 'India', 'Kolkata', 'Musée', 'museum',
   'Plus ancien musée d''Asie. Sculptures bouddhistes et hindoues, manuscrits et reliques de Bouddha. Patrimoine spirituel du sous-continent indien.',
   '{"lng": 88.3512, "lat": 22.5580}', 70,
   ARRAY['art_sacre', 'archeologie', 'manuscrits'], ARRAY['bouddhisme', 'hindouisme'], 'verified', 'manual'),
   
  ('mus-shamanism-ulan-ude', 'Museum of Shamanism', 'Russia', 'Ulan-Ude', 'Musée', 'museum',
   'Collection unique sur le chamanisme bouriate et sibérien. Tambours rituels, costumes et objets sacrés des traditions chamaniques.',
   '{"lng": 107.6176, "lat": 51.8339}', 60,
   ARRAY['rites', 'civilisations', 'interreligieux'], ARRAY['traditions_du_monde'], 'verified', 'manual'),

-- AMERICAS (5 museums)
  ('mus-antropologia-mexico', 'Museo Nacional de Antropología', 'Mexico', 'Mexico City', 'Musée', 'museum',
   'Chef-d''œuvre muséal présentant les civilisations mésoaméricaines. Pierre du Soleil aztèque, art maya et rituels des peuples précolombiens.',
   '{"lng": -99.1853, "lat": 19.4260}', 80,
   ARRAY['civilisations', 'rites', 'archeologie'], ARRAY['traditions_du_monde'], 'verified', 'manual'),
   
  ('mus-virreinato-tepotzotlan', 'Museo Nacional del Virreinato', 'Mexico', 'Tepotzotlán', 'Musée', 'museum',
   'Art colonial et religieux dans un ancien collège jésuite baroque. Retables dorés, peintures et objets liturgiques de la Nouvelle-Espagne.',
   '{"lng": -99.2242, "lat": 19.7161}', 65,
   ARRAY['art_sacre', 'icones'], ARRAY['christianisme'], 'verified', 'manual'),
   
  ('mus-larco-lima', 'Museo Larco', 'Peru', 'Lima', 'Musée', 'museum',
   'Art précolombien péruvien dans une hacienda du XVIIIe siècle. Objets rituels, céramiques votives et or des cultures Moche et Chimú.',
   '{"lng": -77.0708, "lat": -12.0736}', 70,
   ARRAY['archeologie', 'rites', 'civilisations'], ARRAY['traditions_du_monde'], 'verified', 'manual'),
   
  ('mus-arte-religioso-quito', 'Museo de Arte Religioso', 'Ecuador', 'Quito', 'Musée', 'museum',
   'Joyau de l''art colonial quiténien. Sculptures polychromes, peintures de l''École de Quito et orfèvrerie liturgique dans un ancien monastère.',
   '{"lng": -78.5127, "lat": -0.2202}', 65,
   ARRAY['art_sacre', 'icones'], ARRAY['christianisme'], 'verified', 'manual'),
   
  ('mus-arte-sacra-sao-paulo', 'Museu de Arte Sacra de São Paulo', 'Brazil', 'São Paulo', 'Musée', 'museum',
   'Dans un monastère bénédictin, collection majeure d''art sacré brésilien. Sculptures baroques, orfèvrerie et mobilier liturgique colonial.',
   '{"lng": -46.6388, "lat": -23.5369}', 65,
   ARRAY['art_sacre', 'icones'], ARRAY['christianisme'], 'verified', 'manual')

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  city = EXCLUDED.city,
  type = EXCLUDED.type,
  place_category = EXCLUDED.place_category,
  description = EXCLUDED.description,
  coordinates = EXCLUDED.coordinates,
  points_value = EXCLUDED.points_value,
  tags = EXCLUDED.tags,
  traditions_related = EXCLUDED.traditions_related,
  verification_status = EXCLUDED.verification_status,
  data_source = EXCLUDED.data_source,
  updated_at = now();