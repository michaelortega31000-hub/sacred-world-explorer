// Types for Globe customization settings

export type MapStyle = 'satellite' | 'streets' | 'dark' | 'outdoors' | 'artistic';
export type AtmospherePreset = 'classic' | 'cosmos' | 'aurora' | 'sunset' | 'mystic';
export type SparkleColor = 'gold' | 'turquoise' | 'rainbow';

export interface GlobeSettings {
  mapStyle: MapStyle;
  atmosphere: AtmospherePreset;
  starIntensity: number; // 0 to 1
  sparkleEnabled: boolean;
  sparkleColor: SparkleColor;
}

export const defaultGlobeSettings: GlobeSettings = {
  mapStyle: 'satellite',
  atmosphere: 'classic',
  starIntensity: 0.6,
  sparkleEnabled: true,
  sparkleColor: 'gold',
};

// Mapbox style URLs
export const mapStyleUrls: Record<MapStyle, string> = {
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  streets: 'mapbox://styles/mapbox/streets-v12',
  dark: 'mapbox://styles/mapbox/navigation-night-v1',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  artistic: 'mapbox://styles/mapbox/light-v11',
};

// Atmosphere presets with fog colors
export interface AtmosphereConfig {
  spaceColor: string;
  fogColor: string;
  highColor: string;
  starIntensityMultiplier: number;
}

export const atmospherePresets: Record<AtmospherePreset, AtmosphereConfig> = {
  classic: {
    spaceColor: 'rgb(11, 11, 25)',
    fogColor: 'rgb(186, 210, 235)',
    highColor: 'rgb(36, 92, 223)',
    starIntensityMultiplier: 1,
  },
  cosmos: {
    spaceColor: 'rgb(0, 0, 5)',
    fogColor: 'rgb(26, 26, 46)',
    highColor: 'rgb(20, 40, 80)',
    starIntensityMultiplier: 1.5,
  },
  aurora: {
    spaceColor: 'rgb(10, 10, 26)',
    fogColor: 'rgb(45, 90, 74)',
    highColor: 'rgb(80, 150, 120)',
    starIntensityMultiplier: 1.2,
  },
  sunset: {
    spaceColor: 'rgb(26, 10, 10)',
    fogColor: 'rgb(255, 126, 95)',
    highColor: 'rgb(200, 80, 100)',
    starIntensityMultiplier: 0.5,
  },
  mystic: {
    spaceColor: 'rgb(15, 5, 32)',
    fogColor: 'rgb(74, 26, 107)',
    highColor: 'rgb(100, 50, 150)',
    starIntensityMultiplier: 1.1,
  },
};

// Sparkle color palettes
export const sparkleColorPalettes: Record<SparkleColor, string[]> = {
  gold: ['#F4C542', '#FFD700', '#FFF8E1', '#FFFFFF'],
  turquoise: ['#34E0A1', '#00CED1', '#E0FFFF', '#FFFFFF'],
  rainbow: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF'],
};

// Labels for UI
export const mapStyleLabels: Record<MapStyle, string> = {
  satellite: 'Satellite (photo réaliste)',
  streets: 'Rues (carte routière)',
  dark: 'Nuit (style sombre)',
  outdoors: 'Terrain (randonnée)',
  artistic: 'Artistique (minimaliste)',
};

export const atmosphereLabels: Record<AtmospherePreset, string> = {
  classic: 'Classique (bleu & étoiles)',
  cosmos: 'Cosmos (espace profond)',
  aurora: 'Aurore boréale (vert & violet)',
  sunset: 'Coucher de soleil (orange & rose)',
  mystic: 'Mystique (violet intense)',
};

export const sparkleColorLabels: Record<SparkleColor, string> = {
  gold: 'Or',
  turquoise: 'Turquoise',
  rainbow: 'Arc-en-ciel',
};
