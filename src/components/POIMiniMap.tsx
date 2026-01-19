import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapboxToken } from '@/lib/mapboxHelper';
import { Utensils, Hotel } from 'lucide-react';

interface SavedPOI {
  id: string;
  name: string;
  address: string;
  type: 'restaurant' | 'lodging' | 'fuel';
  coordinates: [number, number];
  placeId: string;
}

interface POIMiniMapProps {
  placeCoordinates: [number, number];
  placeName: string;
  savedPOIs: SavedPOI[];
}

const POIMiniMap = ({ placeCoordinates, placeName, savedPOIs }: POIMiniMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const token = getMapboxToken();
    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: placeCoordinates,
      zoom: 14,
    });

    // Add zoom controls only
    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'bottom-right'
    );

    map.current.on('load', () => {
      if (!map.current) return;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add main place marker (golden star)
      const mainMarkerEl = document.createElement('div');
      mainMarkerEl.className = 'main-place-marker';
      mainMarkerEl.style.cssText = `
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(135deg, hsl(43, 76%, 70%) 0%, hsl(43, 90%, 85%) 100%);
        border: 3px solid white;
        box-shadow: 0 0 15px hsla(43, 76%, 70%, 0.6), 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
      `;
      mainMarkerEl.innerHTML = '⭐';

      const mainMarker = new mapboxgl.Marker({ element: mainMarkerEl })
        .setLngLat(placeCoordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="font-weight: 600; font-size: 14px;">${placeName}</div>
             <div style="font-size: 12px; color: #666;">Lieu sacré</div>`
          )
        )
        .addTo(map.current);
      markersRef.current.push(mainMarker);

      // Add POI markers
      savedPOIs.forEach((poi) => {
        const poiMarkerEl = document.createElement('div');
        const isRestaurant = poi.type === 'restaurant';
        
        poiMarkerEl.style.cssText = `
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: ${isRestaurant 
            ? 'linear-gradient(135deg, hsl(24, 95%, 53%) 0%, hsl(24, 95%, 65%) 100%)' 
            : 'linear-gradient(135deg, hsl(221, 83%, 53%) 0%, hsl(221, 83%, 65%) 100%)'};
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        `;
        poiMarkerEl.innerHTML = isRestaurant 
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16"/><path d="M8 7h.01"/><path d="M16 7h.01"/><path d="M12 7h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 11h.01"/><path d="M10 22v-6.5m4 0V22"/></svg>';

        const poiMarker = new mapboxgl.Marker({ element: poiMarkerEl })
          .setLngLat(poi.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div style="font-weight: 600; font-size: 14px;">${poi.name}</div>
               <div style="font-size: 12px; color: #666;">${poi.address}</div>
               <div style="font-size: 11px; color: ${isRestaurant ? 'hsl(24, 95%, 53%)' : 'hsl(221, 83%, 53%)'}; margin-top: 4px;">
                 ${isRestaurant ? '🍽️ Restaurant' : '🏨 Hôtel'}
               </div>`
            )
          )
          .addTo(map.current!);
        markersRef.current.push(poiMarker);
      });

      // Fit bounds to include all markers
      if (savedPOIs.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(placeCoordinates);
        savedPOIs.forEach(poi => bounds.extend(poi.coordinates));
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
          duration: 500
        });
      }
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [placeCoordinates, placeName, savedPOIs]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[250px] rounded-lg overflow-hidden border border-border/50"
      style={{ minHeight: '250px' }}
    />
  );
};

export default POIMiniMap;
