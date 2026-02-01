import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { logger } from '@/lib/logger';

interface JourneyPoint {
  coordinates: [number, number];
  name: string;
  country: string;
  date: Date;
}

interface JournalMapProps {
  journeyPath: JourneyPoint[];
  className?: string;
}

const JournalMap: React.FC<JournalMapProps> = ({ journeyPath, className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || journeyPath.length === 0) return;

    const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN || localStorage.getItem('mapbox_token');
    if (!token) {
      logger.warn('Mapbox token not found');
      return;
    }

    mapboxgl.accessToken = token;

    // Calculate bounds
    const bounds = new mapboxgl.LngLatBounds();
    journeyPath.forEach(point => {
      bounds.extend(point.coordinates);
    });

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      bounds: bounds,
      fitBoundsOptions: { padding: 50 }
    });

    map.current.on('load', () => {
      if (!map.current) return;
      setMapLoaded(true);

      // Add journey line
      const coordinates = journeyPath.map(p => p.coordinates);
      
      map.current.addSource('journey-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates
          }
        }
      });

      // Animated dashed line
      map.current.addLayer({
        id: 'journey-line-bg',
        type: 'line',
        source: 'journey-line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 3,
          'line-opacity': 0.3
        }
      });

      map.current.addLayer({
        id: 'journey-line-main',
        type: 'line',
        source: 'journey-line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#60a5fa',
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      });

      // Add markers for each point
      journeyPath.forEach((point, index) => {
        const el = document.createElement('div');
        el.className = 'journey-marker';
        el.style.cssText = `
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
        `;
        el.textContent = String(index + 1);
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`
            <div style="padding: 8px; text-align: center;">
              <strong style="font-size: 13px; color: #1f2937;">${point.name}</strong>
              <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">
                ${point.country}
              </div>
              <div style="font-size: 10px; color: #9ca3af; margin-top: 2px;">
                ${format(point.date, 'd MMM yyyy', { locale: fr })}
              </div>
            </div>
          `);

        new mapboxgl.Marker({ element: el })
          .setLngLat(point.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      });

      // Add start and end indicators
      if (journeyPath.length >= 2) {
        // Start marker
        const startEl = document.createElement('div');
        startEl.innerHTML = '🚀';
        startEl.style.fontSize = '24px';
        new mapboxgl.Marker({ element: startEl, anchor: 'bottom' })
          .setLngLat(journeyPath[0].coordinates)
          .addTo(map.current);

        // End marker (if different from start)
        const endPoint = journeyPath[journeyPath.length - 1];
        if (endPoint.coordinates[0] !== journeyPath[0].coordinates[0] || 
            endPoint.coordinates[1] !== journeyPath[0].coordinates[1]) {
          const endEl = document.createElement('div');
          endEl.innerHTML = '🏁';
          endEl.style.fontSize = '24px';
          new mapboxgl.Marker({ element: endEl, anchor: 'bottom' })
            .setLngLat(endPoint.coordinates)
            .addTo(map.current);
        }
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [journeyPath]);

  if (journeyPath.length === 0) {
    return (
      <div className={`${className} bg-card/50 rounded-xl flex items-center justify-center`}>
        <p className="text-muted-foreground text-sm">Aucun parcours à afficher</p>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden rounded-xl border border-border/50`}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span>🚀</span>
          <span className="text-muted-foreground">Début du voyage</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🏁</span>
          <span className="text-muted-foreground">Dernier lieu visité</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-400" />
          <span className="text-muted-foreground">Parcours</span>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
        <span className="text-primary font-bold">{journeyPath.length}</span>
        <span className="text-muted-foreground ml-1">lieux visités</span>
      </div>
    </div>
  );
};

export default JournalMap;
