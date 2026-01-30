import { logger } from './logger';

/**
 * Helper function to get Mapbox token from various sources
 * Priority: Environment variable (VITE_MAPBOX_PUBLIC_TOKEN) -> LocalStorage -> Default token
 */
export const getMapboxToken = (): string => {
  const token = (
    import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN ||
    import.meta.env.VITE_MAPBOX_TOKEN ||
    localStorage.getItem('mapbox_token') ||
    'pk.eyJ1Ijoic2FjcmVkd29sZCIsImEiOiJjbWc3eXQ1YWIwMWxlMmtzaHppZWxkMzhnIn0.Rdmr8Vf5k04a-Z-8M0Uvaw'
  );
  
  // Only log in development mode via logger utility
  logger.log('🔑 Mapbox token source:', 
    import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN ? 'ENV (VITE_MAPBOX_PUBLIC_TOKEN)' :
    import.meta.env.VITE_MAPBOX_TOKEN ? 'ENV (VITE_MAPBOX_TOKEN)' :
    localStorage.getItem('mapbox_token') ? 'LocalStorage' :
    'Default'
  );
  
  return token;
};
