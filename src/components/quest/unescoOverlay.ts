// UNESCO World Heritage layer for the 3D Globe.
// Adds a Mapbox source + symbol layer for ~1,200 UNESCO sites globally.
// Visible only at zoom >= 3 so the world view stays uncluttered; markers
// fade in as the user zooms.

import mapboxgl from 'mapbox-gl';
import { fetchUnescoSites } from '@/lib/unescoSites';

export const UNESCO_SOURCE = 'unesco-sites-source';
export const UNESCO_DOT_LAYER = 'unesco-sites-dots';
export const UNESCO_LABEL_LAYER = 'unesco-sites-labels';

export interface UnescoOverlayHandle {
  destroy: () => void;
  setVisible: (visible: boolean) => void;
}

let cachedFeatures: GeoJSON.FeatureCollection | null = null;

const buildFeatureCollection = async (): Promise<GeoJSON.FeatureCollection> => {
  if (cachedFeatures) return cachedFeatures;
  const sites = await fetchUnescoSites();
  cachedFeatures = {
    type: 'FeatureCollection',
    features: sites.map((s) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: s.coord },
      properties: {
        id: s.id,
        name: s.name,
        country: s.countryLabel,
        category: s.category,
        inDanger: s.inDanger,
      },
    })),
  };
  return cachedFeatures;
};

export const attachUnescoOverlay = async (
  map: mapboxgl.Map,
): Promise<UnescoOverlayHandle> => {
  // Idempotent — if already attached, return a thin handle.
  if (map.getSource(UNESCO_SOURCE)) {
    return {
      destroy: () => {
        try {
          if (map.getLayer(UNESCO_LABEL_LAYER)) map.removeLayer(UNESCO_LABEL_LAYER);
          if (map.getLayer(UNESCO_DOT_LAYER)) map.removeLayer(UNESCO_DOT_LAYER);
          if (map.getSource(UNESCO_SOURCE)) map.removeSource(UNESCO_SOURCE);
        } catch { /* map already gone */ }
      },
      setVisible: (visible) => {
        const v = visible ? 'visible' : 'none';
        try {
          map.setLayoutProperty(UNESCO_DOT_LAYER, 'visibility', v);
          map.setLayoutProperty(UNESCO_LABEL_LAYER, 'visibility', v);
        } catch { /* layers gone */ }
      },
    };
  }

  const fc = await buildFeatureCollection();

  // If the map was destroyed while the SPARQL request was in flight, bail out.
  if (!map.getStyle()) {
    return { destroy: () => { /* noop */ }, setVisible: () => { /* noop */ } };
  }

  map.addSource(UNESCO_SOURCE, { type: 'geojson', data: fc });

  // Dot markers — small white circles with cream rim, slight glow.
  // Colored differently for cultural / natural / mixed.
  // In-danger sites get a red rim (subtle).
  map.addLayer({
    id: UNESCO_DOT_LAYER,
    type: 'circle',
    source: UNESCO_SOURCE,
    minzoom: 2.5,
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['zoom'],
        2.5, 1.6,
        4,   2.6,
        7,   4.0,
        10,  5.5,
      ],
      'circle-color': [
        'match', ['get', 'category'],
        'natural',  '#86efac',  // soft green
        'mixed',    '#fde68a',  // pale gold
        /* cultural default */ '#f5f5f0', // warm parchment white
      ],
      'circle-stroke-color': [
        'case',
        ['get', 'inDanger'], '#f87171', // red rim if endangered
        'rgba(244,197,66,0.85)',         // gold rim otherwise
      ],
      'circle-stroke-width': 1.2,
      'circle-opacity': [
        'interpolate', ['linear'], ['zoom'],
        2.5, 0.55,
        4,   0.85,
        7,   1.0,
      ],
      'circle-blur': 0.15,
    },
  });

  // Labels — only at higher zoom to avoid the world view becoming wallpaper.
  map.addLayer({
    id: UNESCO_LABEL_LAYER,
    type: 'symbol',
    source: UNESCO_SOURCE,
    minzoom: 5,
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-size': [
        'interpolate', ['linear'], ['zoom'],
        5, 9,
        8, 11,
        12, 13,
      ],
      'text-anchor': 'top',
      'text-offset': [0, 0.7],
      'text-allow-overlap': false,
      'text-ignore-placement': false,
      'text-optional': true,
    },
    paint: {
      'text-color': 'rgba(255,234,170,0.95)',
      'text-halo-color': 'rgba(7,7,15,0.85)',
      'text-halo-width': 1.4,
      'text-halo-blur': 0.5,
    },
  });

  return {
    destroy: () => {
      try {
        if (map.getLayer(UNESCO_LABEL_LAYER)) map.removeLayer(UNESCO_LABEL_LAYER);
        if (map.getLayer(UNESCO_DOT_LAYER)) map.removeLayer(UNESCO_DOT_LAYER);
        if (map.getSource(UNESCO_SOURCE)) map.removeSource(UNESCO_SOURCE);
      } catch { /* */ }
    },
    setVisible: (visible) => {
      const v = visible ? 'visible' : 'none';
      try {
        map.setLayoutProperty(UNESCO_DOT_LAYER, 'visibility', v);
        map.setLayoutProperty(UNESCO_LABEL_LAYER, 'visibility', v);
      } catch { /* */ }
    },
  };
};
