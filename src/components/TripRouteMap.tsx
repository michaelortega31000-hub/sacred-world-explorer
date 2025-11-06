import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Place } from '@/contexts/AppContext';

interface TripRouteMapProps {
  places: Place[];
  onMapReady?: (captureMap: () => string | null) => void;
}

const TripRouteMap = ({ places, onMapReady }: TripRouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapContainer.current || places.length === 0 || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    // Calculate center from all places
    const avgLng = places.reduce((sum, p) => sum + p.coordinates[0], 0) / places.length;
    const avgLat = places.reduce((sum, p) => sum + p.coordinates[1], 0) / places.length;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [avgLng, avgLat],
      zoom: 4,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;

      // Expose map capture function
      if (onMapReady) {
        onMapReady(() => {
          if (!map.current) return null;
          return map.current.getCanvas().toDataURL('image/png');
        });
      }

      // Create route line
      const coordinates = places.map(p => p.coordinates);

      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'hsl(var(--primary))',
          'line-width': 4,
          'line-opacity': 0.8,
        },
      });

      // Add markers for each place
      places.forEach((place, index) => {
        const el = document.createElement('div');
        el.className = 'trip-marker';
        el.style.cssText = `
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
        `;
        el.textContent = String(index + 1);

        const marker = new mapboxgl.Marker(el)
          .setLngLat(place.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="padding: 8px;">
                  <strong style="font-size: 14px;">${place.name}</strong>
                  <p style="margin: 4px 0 0; font-size: 12px; color: #666;">
                    ${place.city}, ${place.country}
                  </p>
                </div>
              `)
          )
          .addTo(map.current);

        markers.current.push(marker);
      });

      // Fit map to show all markers
      if (places.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        places.forEach(place => bounds.extend(place.coordinates));
        map.current.fitBounds(bounds, { padding: 80 });
      }
    });

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [places, mapboxToken]);

  if (places.length === 0) return null;

  if (!mapboxToken) {
    return (
      <div className="w-full h-[500px] rounded-lg overflow-hidden border border-border shadow-lg flex items-center justify-center bg-muted">
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-2">Carte non disponible</p>
          <p className="text-sm text-muted-foreground">
            Configurez VITE_MAPBOX_TOKEN pour afficher la carte interactive
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-border shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default TripRouteMap;
