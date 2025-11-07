import { Religion } from '@/contexts/AppContext';

/**
 * Détermine automatiquement la religion d'un lieu en fonction de son type et de son nom
 */
export function inferReligionFromPlace(type: string, name: string): Religion {
  const lowerType = type.toLowerCase();
  const lowerName = name.toLowerCase();
  
  // Islam
  if (lowerType.includes('mosquée') || lowerType.includes('mosque') || 
      lowerName.includes('mosque') || lowerName.includes('mosquée') ||
      lowerName.includes('masjid') || lowerName.includes('kaaba') ||
      lowerName.includes('médine') || lowerName.includes('medina')) {
    return 'islam';
  }
  
  // Judaïsme
  if (lowerType.includes('synagogue') || lowerName.includes('synagogue') ||
      lowerName.includes('western wall') || lowerName.includes('mur des lamentations') ||
      lowerName.includes('temple mount') || lowerName.includes('jewish')) {
    return 'judaism';
  }
  
  // Bouddhisme (sans 'temple' générique)
  if (lowerType.includes('pagode') || lowerType.includes('stupa') || lowerType.includes('wat') ||
      lowerName.includes('buddha') || lowerName.includes('bouddha') ||
      lowerName.includes('angkor') || lowerName.includes('borobudur') ||
      lowerName.includes('shwedagon') || lowerName.includes('bagan') ||
      lowerName.includes('potala') || lowerName.includes('jokhang') || 
      lowerName.includes('lumbini') || lowerName.includes('shaolin') || 
      lowerName.includes('zen')) {
    return 'buddhism';
  }
  
  // Hindouisme (temple + indices hindous)
  if (lowerType.includes('temple') && (
      lowerName.includes('hindu') || lowerName.includes('shiva') || 
      lowerName.includes('vishnu') || lowerName.includes('krishna') || 
      lowerName.includes('hanuman') || lowerName.includes('meenakshi') ||
      lowerName.includes('akshardham') || lowerName.includes('pashupatinath') ||
      lowerName.includes('varanasi') || lowerName.includes('prambanan'))) {
    return 'hinduism';
  }
  
  // Christianisme (types chrétiens explicites)
  if (lowerType.includes('cathédrale') || lowerType.includes('cathedral') ||
      lowerType.includes('basilique') || lowerType.includes('basilica') ||
      lowerType.includes('église') || lowerType.includes('church') ||
      lowerType.includes('abbaye') || lowerType.includes('abbey') ||
      lowerType.includes('monastère') || lowerType.includes('monastery') ||
      lowerType.includes('sanctuaire') || lowerType.includes('sanctuary') ||
      lowerType.includes('chapelle') || lowerType.includes('chapel')) {
    return 'christianity';
  }
  
  // Traditions / Sites anciens (au lieu de 'astronomy')
  if (lowerName.includes('stonehenge') || lowerName.includes('pyramids') || 
      lowerName.includes('pyramide') || lowerName.includes('machu picchu') ||
      lowerName.includes('chichen itza') || lowerName.includes('teotihuacan') ||
      lowerName.includes('delphi') || lowerName.includes('parthenon') ||
      lowerName.includes('pantheon') || lowerName.includes('karnak') ||
      lowerName.includes('temple of heaven') || lowerName.includes('mount fuji') ||
      lowerName.includes('uluru') || lowerName.includes('longmen')) {
    return 'traditional';
  }
  
  // Cas génériques 'Temple', 'Monument', 'Site archéologique' → 'traditional'
  if (lowerType.includes('temple') || lowerType.includes('monument') || 
      lowerType.includes('site archéologique')) {
    return 'traditional';
  }
  
  // Par défaut
  return 'traditional';
}
