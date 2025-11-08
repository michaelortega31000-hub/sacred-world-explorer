import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Place, SavedPOI } from '@/contexts/AppContext';

interface TripRouteMapProps {
  places: Place[];
  savedPOIs?: SavedPOI[];
  onMapReady?: (captureMap: () => string | null) => void;
}

const TripRouteMap = ({ places, savedPOIs = [], onMapReady }: TripRouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const poiMarkers = useRef<mapboxgl.Marker[]>([]);
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || 
                      import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN ||
                      localStorage.getItem('mapbox_token') ||
                      'pk.eyJ1Ijoic2FjcmVkd29sZCIsImEiOiJjbWc3eXQ1YWIwMWxlMmtzaHppZWxkMzhnIn0.Rdmr8Vf5k04a-Z-8M0Uvaw';

  // Helper to get POI icon SVG and color
  const getPOIIconConfig = (type: string) => {
    switch (type) {
      case 'restaurant':
        return { 
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
          color: 'hsl(var(--primary))',
          label: 'Restaurant'
        };
      case 'lodging':
        return { 
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>`,
          color: 'hsl(var(--secondary))',
          label: 'Hébergement'
        };
      case 'fuel':
        return { 
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>`,
          color: 'hsl(var(--accent))',
          label: 'Station-service'
        };
      default:
        return { 
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
          color: 'hsl(var(--primary))',
          label: 'Point d\'intérêt'
        };
    }
  };

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

      // Layer 1: Outer glow (wide halo)
      map.current.addLayer({
        id: 'route-glow-outer',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'hsl(43, 76%, 70%)', // sacred-gold
          'line-width': 12,
          'line-blur': 8,
          'line-opacity': 0.3,
        },
      });

      // Layer 2: Inner glow
      map.current.addLayer({
        id: 'route-glow-inner',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'hsl(43, 90%, 80%)',
          'line-width': 8,
          'line-blur': 4,
          'line-opacity': 0.5,
        },
      });

      // Layer 3: Main golden line
      map.current.addLayer({
        id: 'route-main',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'hsl(43, 76%, 70%)',
          'line-width': 5,
          'line-opacity': 0.95,
        },
      });

      // Layer 4: Center highlight
      map.current.addLayer({
        id: 'route-highlight',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'hsl(43, 100%, 90%)',
          'line-width': 2,
          'line-opacity': 0.8,
        },
      });

      // Add CSS animations
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse-gold {
          0%, 100% {
            box-shadow: 
              0 0 0 2px hsl(43, 76%, 70%),
              0 0 20px hsl(43, 76%, 70%, 0.6),
              0 4px 12px rgba(0,0,0,0.3);
            transform: scale(1);
          }
          50% {
            box-shadow: 
              0 0 0 2px hsl(43, 76%, 70%),
              0 0 30px hsl(43, 76%, 70%, 0.8),
              0 4px 16px rgba(0,0,0,0.4);
            transform: scale(1.05);
          }
        }
        .trip-marker {
          animation: pulse-gold 2s ease-in-out infinite;
        }
        .trip-marker:hover {
          animation: none;
          transform: scale(1.15);
        }
      `;
      document.head.appendChild(style);

      // Add markers for each place
      places.forEach((place, index) => {
        const el = document.createElement('div');
        el.className = 'trip-marker';
        el.style.cssText = `
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, hsl(43, 76%, 70%) 0%, hsl(43, 90%, 85%) 100%);
          color: hsl(221, 75%, 15%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 15px;
          border: 3px solid hsl(43, 100%, 95%);
          box-shadow: 
            0 0 0 2px hsl(43, 76%, 70%),
            0 0 20px hsl(43, 76%, 70%, 0.6),
            0 4px 12px rgba(0,0,0,0.3);
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
          will-change: transform;
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

      // Add POI markers
      savedPOIs.forEach((poi) => {
        const config = getPOIIconConfig(poi.type);
        
        const el = document.createElement('div');
        el.className = 'poi-marker';
        el.style.cssText = `
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: ${config.color};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid hsl(43, 76%, 70%);
          box-shadow: 
            0 0 0 1px hsl(43, 76%, 70%, 0.3),
            0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          z-index: 5;
          transition: all 0.3s ease;
        `;
        el.innerHTML = config.icon;
        
        // Add hover effect
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.15)';
          el.style.boxShadow = `
            0 0 0 1px hsl(43, 76%, 70%, 0.5),
            0 0 15px hsl(43, 76%, 70%, 0.4),
            0 4px 12px rgba(0,0,0,0.4)
          `;
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.boxShadow = `
            0 0 0 1px hsl(43, 76%, 70%, 0.3),
            0 2px 8px rgba(0,0,0,0.3)
          `;
        });

        const popup = new mapboxgl.Popup({ 
          offset: 25,
          maxWidth: '300px'
        }).setHTML(`
          <div style="padding: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div style="
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: ${config.color};
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                ${config.icon}
              </div>
              <strong style="font-size: 14px; flex: 1;">${poi.name}</strong>
            </div>
            <div style="
              display: inline-block;
              padding: 2px 8px;
              background: ${config.color}20;
              color: ${config.color};
              border-radius: 4px;
              font-size: 11px;
              font-weight: 500;
              margin-bottom: 8px;
            ">
              ${config.label}
            </div>
            <p style="margin: 8px 0 0; font-size: 12px; color: #666; line-height: 1.4;">
              ${poi.address}
            </p>
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat(poi.coordinates as [number, number])
          .setPopup(popup)
          .addTo(map.current);

        poiMarkers.current.push(marker);
      });

      // Fit map to show all markers including POIs
      if (places.length > 1 || savedPOIs.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        places.forEach(place => bounds.extend(place.coordinates));
        savedPOIs.forEach(poi => bounds.extend(poi.coordinates as [number, number]));
        map.current.fitBounds(bounds, { padding: 80 });
      }
    });

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      poiMarkers.current.forEach(marker => marker.remove());
      poiMarkers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [places, savedPOIs, mapboxToken]);

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
