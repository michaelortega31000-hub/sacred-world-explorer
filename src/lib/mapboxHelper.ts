/**
 * Helper function to get Mapbox token from various sources
 * Priority: Environment variable -> LocalStorage -> Default token
 */
export const getMapboxToken = (): string => {
  return (
    import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN ||
    import.meta.env.VITE_MAPBOX_TOKEN ||
    localStorage.getItem('mapbox_token') ||
    'pk.eyJ1Ijoic2FjcmVkd29sZCIsImEiOiJjbWc3eXQ1YWIwMWxlMmtzaHppZWxkMzhnIn0.Rdmr8Vf5k04a-Z-8M0Uvaw'
  );
};
