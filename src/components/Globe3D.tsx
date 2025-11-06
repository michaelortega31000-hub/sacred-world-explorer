import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Locate } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getImageUrl } from '@/lib/imageHelper';
import { useApp } from '@/contexts/AppContext';
import { religionColors } from '@/config/religionColors';
import { inferReligionFromPlace } from '@/lib/religionHelper';
import MonumentFilter, { FilterOptions } from '@/components/MonumentFilter';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface Globe3DProps {
  onCountryClick?: (countryName: string) => void;
  onRecenterRef?: (fn: () => void) => void;
  onFlyToRef?: (fn: (lat: number, lng: number, zoom?: number) => void) => void;
  onPausedChange?: (paused: boolean) => void;
  tripPlaces?: string[];
}

const Globe3D = ({ onCountryClick, onRecenterRef, onFlyToRef, onPausedChange, tripPlaces = [] }: Globe3DProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userLocationMarker = useRef<mapboxgl.Marker | null>(null);
  const recenterOnPosition = useRef(false);
  const hasCenteredOnUser = useRef(false);
  const savedCameraPosition = useRef<{ center: [number, number]; zoom: number; pitch: number } | null>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { userProgress } = useApp();
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [showMonuments, setShowMonuments] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({ religions: [], types: [] });
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const { position: userPosition, error: geolocationError } = useGeolocation(geolocationEnabled);
  const isStyleReadyRef = useRef(false);
  const pendingFlyTo = useRef<Array<{ lat: number; lng: number; zoom: number }>>([]);

  // Fonction pour voler vers des coordonnées spécifiques
  const handleFlyTo = (lat: number, lng: number, zoom: number = 15) => {
    if (map.current && isStyleReadyRef.current) {
      setIsPaused(true);
      map.current.flyTo({
        center: [lng, lat],
        zoom: zoom,
        pitch: 0,
        bearing: 0,
        duration: 2200,
        essential: true
      });
    } else {
      // Carte pas prête: on met en file d'attente
      pendingFlyTo.current.push({ lat, lng, zoom });
    }
  };

  // Exposer la fonction de recentrage via callback
useEffect(() => {
  if (onRecenterRef) {
    onRecenterRef(() => handleRecenter());
  }
}, [onRecenterRef]);

  // Exposer la fonction flyTo via callback
useEffect(() => {
  if (onFlyToRef) {
    onFlyToRef((lat, lng, zoom) => handleFlyTo(lat, lng, zoom));
  }
}, [onFlyToRef]);

  useEffect(() => {
    if (onPausedChange) {
      onPausedChange(isPaused);
    }
  }, [isPaused, onPausedChange]);

  useEffect(() => {
    // Essayer de récupérer depuis l'env
    const envToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
    if (envToken) {
      setMapboxToken(envToken);
    } else {
      // Vérifier le localStorage
      const savedToken = localStorage.getItem('mapbox_token');
      if (savedToken) {
        setMapboxToken(savedToken);
      } else {
        // Token par défaut
        const defaultToken = 'pk.eyJ1Ijoic2FjcmVkd29sZCIsImEiOiJjbWc3eXQ1YWIwMWxlMmtzaHppZWxkMzhnIn0.Rdmr8Vf5k04a-Z-8M0Uvaw';
        setMapboxToken(defaultToken);
        localStorage.setItem('mapbox_token', defaultToken);
      }
    }
  }, []);

  const handleTokenSubmit = () => {
    if (mapboxToken) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setShowTokenInput(false);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || showTokenInput) return;

    mapboxgl.accessToken = mapboxToken;
    logger.log('Globe3D init with token', !!mapboxToken, 'container size', mapContainer.current?.clientWidth, mapContainer.current?.clientHeight);
    
    // Détecter si on est sur mobile
    const isMobile = window.innerWidth < 768;
    
    // Initialiser la carte en mode globe - vue 3D immersive
    // Vue plus proche et en perspective pour une meilleure immersion
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      projection: { name: 'globe' },
      zoom: isMobile ? 1.8 : 2.2, // Vue plus rapprochée pour voir les lieux
      center: [10, 45], // Centré sur l'Europe avec meilleure perspective
      pitch: isMobile ? 45 : 55, // Angle 3D immersif
      bearing: -15, // Légère rotation pour dynamisme
      maxPitch: 85,
    });

    // Contrôles de navigation désactivés (utilisateur zoom directement)

    // Configuration de l'atmosphère et du fog immersif
    map.current.on('style.load', () => {
      if (!map.current) return;
      // Le style est prêt
      isStyleReadyRef.current = true;
      
      // Fond spatial immersif (espace sombre conservé)
      map.current.setFog({
        color: 'rgb(14, 27, 63)', // Deep space blue
        'high-color': 'rgb(52, 224, 161)', // Turquoise glow
        'horizon-blend': 0.1,
        'space-color': 'rgb(14, 27, 63)',
        'star-intensity': 0.6
      });

      // Teinte bleue sur les océans (sans modifier le fond)
      const labelBeforeId = map.current.getLayer('country-label') ? 'country-label' : undefined;

      // 1) Recolorer la couche 'water' si présente (styles vectoriels)
      if (map.current.getLayer('water')) {
        map.current.setPaintProperty('water', 'fill-color', '#2EA5FF');
        map.current.setPaintProperty('water', 'fill-opacity', 0.5);
      }

      // 2) Ajouter une couche de teinte personnalisée au-dessus du satellite si nécessaire
      if (!map.current.getLayer('custom-water-tint')) {
        try {
          map.current.addLayer(
            {
              id: 'custom-water-tint',
              type: 'fill',
              source: 'composite',
              'source-layer': 'water',
              paint: {
                'fill-color': '#2EA5FF',
                'fill-opacity': 0.45
              }
            } as any,
            labelBeforeId
          );
        } catch (e) {
          console.warn('Water tint layer add failed', e);
        }
      }

      // Source précise des frontières pays (meilleure détection clic)
      if (!map.current.getSource('country-boundaries')) {
        map.current.addSource('country-boundaries', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
        } as any);
      }

      // Ajouter une layer invisible pour les clics sur les pays
      if (!map.current.getLayer('country-boundaries-fill')) {
        map.current.addLayer({
          id: 'country-boundaries-fill',
          type: 'fill',
          source: 'country-boundaries',
          'source-layer': 'country_boundaries',
          paint: {
            'fill-color': 'transparent',
            'fill-opacity': 0
          }
        } as any);
      }

      // Effets hover désactivés

      // Configurer la langue des labels selon la langue sélectionnée
      const langCode = i18n.language || 'fr';
      const mapboxLangMap: { [key: string]: string } = {
        'fr': 'fr',
        'en': 'en',
        'es': 'es',
        'it': 'it',
        'de': 'de',
        'pt': 'pt',
        'ar': 'ar'
      };
      const mapboxLang = mapboxLangMap[langCode] || 'en';

      // Modifier les labels pour afficher dans la langue sélectionnée
      if (map.current.getLayer('country-label')) {
        map.current.setLayoutProperty('country-label', 'text-field', ['get', `name_${mapboxLang}`]);
      }

      // Charger les monuments
      loadMonuments();
      
      // Dessiner l'itinéraire du voyage
      drawTripRoute();

      // Exécuter les zooms en attente (si déclenchés avant que la carte soit prête)
      if (pendingFlyTo.current.length > 0) {
        const last = pendingFlyTo.current[pendingFlyTo.current.length - 1];
        pendingFlyTo.current = [];
        handleFlyTo(last.lat, last.lng, last.zoom);
      }
    });

    // Fonction pour dessiner l'itinéraire du voyage
    const drawTripRoute = () => {
      if (!map.current || tripPlaces.length === 0) return;

      // Supprimer l'ancienne source et couche si elles existent
      if (map.current.getLayer('trip-route-glow')) {
        map.current.removeLayer('trip-route-glow');
      }
      if (map.current.getLayer('trip-route')) {
        map.current.removeLayer('trip-route');
      }
      if (map.current.getSource('trip-route')) {
        map.current.removeSource('trip-route');
      }

      // Charger les données des lieux pour obtenir les coordonnées
      import('@/data/placesData').then(({ mockPlaces }) => {
        if (!map.current) return;

        const tripCoordinates = tripPlaces
          .map(placeId => {
            const place = mockPlaces.find(p => p.id === placeId);
            return place ? place.coordinates : null;
          })
          .filter((coord): coord is [number, number] => coord !== null);

        if (tripCoordinates.length < 2) return;

        // Créer une ligne GeoJSON
        const routeGeoJSON = {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'LineString' as const,
            coordinates: tripCoordinates
          }
        };

        // Ajouter la source
        map.current.addSource('trip-route', {
          type: 'geojson',
          data: routeGeoJSON
        });

        // Couche de halo (effet de lueur externe)
        map.current.addLayer({
          id: 'trip-route-glow',
          type: 'line',
          source: 'trip-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#2EA5FF',
            'line-width': 8,
            'line-blur': 6,
            'line-opacity': 0.6
          }
        });

        // Couche principale (trait lumineux)
        map.current.addLayer({
          id: 'trip-route',
          type: 'line',
          source: 'trip-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#5EC8FF',
            'line-width': 3,
            'line-opacity': 0.9
          }
        });
      });
    };

    // Fonction pour charger les monuments
    const loadMonuments = () => {
      if (!map.current) return;

      // Supprimer les anciens marqueurs
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      if (showMonuments) {
        // Charger les données des lieux
        import('@/data/placesData').then(({ mockPlaces }) => {
          if (!map.current) return;

          // Filtrer les lieux selon les filtres actifs
          let filteredPlaces = mockPlaces;
          
          if (filters.religions.length > 0 || filters.types.length > 0) {
            filteredPlaces = mockPlaces.filter(place => {
              const placeReligion = inferReligionFromPlace(place.type, place.name);
              const matchesReligion = filters.religions.length === 0 || filters.religions.includes(placeReligion);
              
              const typeSelected = filters.types;
              const normalizedType = place.type.toLowerCase();
              const textBlob = `${place.name} ${place.description ?? ''} ${place.type}`.toLowerCase();
              const matchesType =
                typeSelected.length === 0 ||
                typeSelected.some(t => {
                  const tLower = t.toLowerCase();
                  if (tLower === 'pyramide') {
                    return textBlob.includes('pyram');
                  }
                  return tLower === normalizedType;
                });
              
              return matchesReligion && matchesType;
            });
          }

          filteredPlaces.forEach(place => {
            const resolvedImageUrl = place.imageUrl ? getImageUrl(place.imageUrl) : undefined;
            
            // Déterminer la religion du lieu pour appliquer sa couleur
            const placeReligion = inferReligionFromPlace(place.type, place.name);
            const isVisited = userProgress.visitedPlaces.includes(place.id);
            
            // Utiliser la couleur de la religion du lieu (indépendant du parcours choisi)
            const markerColor = religionColors[placeReligion].marker;
            
            const popup = new mapboxgl.Popup({ 
              offset: 25, 
              maxWidth: '320px',
              className: 'sacred-popup'
            })
              .setHTML(`
                <div style="padding: 16px; background: rgba(20, 43, 79, 0.95); backdrop-filter: blur(10px); border-radius: 12px; border: 1px solid rgba(52, 224, 161, 0.3);">
                  <img src="${resolvedImageUrl || '/placeholder.svg'}" alt="${place.name}" data-place-id="${place.id}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; cursor: pointer; transition: transform 0.2s ease;" onerror="this.src='/placeholder.svg';" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #F5F5F5; font-family: 'Playfair Display', serif;">${place.name}</h3>
                  <p style="margin: 0 0 12px 0; font-size: 13px; color: #34E0A1;">${place.type} • ${place.country}</p>
                  <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.6; color: #EAD7B5; max-height: 100px; overflow-y: auto;">${(place.description || '').substring(0, 150)}...</p>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; font-weight: 600; color: #F4C542;">✨ ${place.points} points</span>
                    ${isVisited ? '<span style="font-size: 12px; color: #34E0A1;">✓ Visité</span>' : ''}
                  </div>
                </div>
              `);

            // Ajouter l'event listener pour la navigation au clic sur l'image
            popup.on('open', () => {
              const container = popup.getElement();
              const img = container?.querySelector(`img[data-place-id="${place.id}"]`) as HTMLImageElement | null;
              if (img) {
                img.addEventListener('click', (e) => {
                  e.stopPropagation();
                  navigate(`/place/${place.id}`);
                });
              }
            });

            // Créer un élément personnalisé pour le marqueur avec effet subtil
            const el = document.createElement('div');
            el.className = 'sacred-marker';
            el.style.cssText = `
              width: 14px;
              height: 14px;
              background: ${markerColor};
              border: 2px solid ${isVisited ? '#F4C542' : 'rgba(255,255,255,0.3)'};
              border-radius: 50%;
              box-shadow: 0 0 8px ${isVisited ? 'rgba(244, 197, 66, 0.3)' : 'rgba(52, 224, 161, 0.2)'};
              cursor: pointer;
              transition: transform 0.2s ease;
            `;
            
            el.addEventListener('mouseenter', () => {
              el.style.transform = 'scale(1.2)';
            });
            
            el.addEventListener('mouseleave', () => {
              el.style.transform = 'scale(1)';
            });

            const marker = new mapboxgl.Marker({ 
              element: el,
              anchor: 'center',
              pitchAlignment: 'map',
              rotationAlignment: 'map'
            })
              .setLngLat([place.coordinates[0], place.coordinates[1]])
              .setPopup(popup)
              .addTo(map.current!);
            
            // Ouvrir le popup au clic ou au tap sur mobile
            el.addEventListener('click', (ev) => {
              ev.stopPropagation();
              marker.togglePopup();
            });
            el.addEventListener('touchend', (ev) => {
              ev.stopPropagation();
              marker.togglePopup();
            }, { passive: true });
            
            markers.current.push(marker);
          });
        });
      }
    };

    // Recharger les monuments et l'itinéraire quand la carte est chargée
    map.current.on('load', () => {
      loadMonuments();
      drawTripRoute();
    });

    // Animation de rotation automatique du globe
    let userInteracting = false;
    const secondsPerRevolution = 240;
    const maxSpinZoom = 3;

    function spinGlobe() {
      if (!map.current || isPaused) return;
      const zoom = map.current.getZoom();
      if (!userInteracting && zoom < maxSpinZoom) {
        const distancePerSecond = 360 / secondsPerRevolution;
        const center = map.current.getCenter();
        center.lng -= distancePerSecond / 60;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    map.current.on('mousedown', () => { userInteracting = true; });
    map.current.on('touchstart', () => { userInteracting = true; });
    map.current.on('mouseup', () => { userInteracting = false; spinGlobe(); });
    map.current.on('touchend', () => { userInteracting = false; spinGlobe(); });
    map.current.on('moveend', spinGlobe);

    spinGlobe();

    // Click sur un pays - amélioration de la zone cliquable avec animation zoom
    map.current.on('click', (e) => {
      if (!map.current) return;
      
      // Ignorer les clics sur un popup ou un marqueur
      const target = (e.originalEvent && (e.originalEvent as any).target) as HTMLElement | null;
      if (target && (target.closest('.mapboxgl-popup') || target.closest('.sacred-marker'))) {
        return;
      }
      
      // Augmenter la zone de détection en utilisant un buffer de 20 pixels autour du clic
      const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
        [e.point.x - 20, e.point.y - 20],
        [e.point.x + 20, e.point.y + 20]
      ];
      
      // Chercher dans les polygones des pays
      let features = map.current.queryRenderedFeatures(bbox, {
        layers: ['country-boundaries-fill']
      });
      
      // Si aucune feature trouvée avec country-boundaries, essayer avec les layers natives
      if (!features || features.length === 0) {
        features = map.current.queryRenderedFeatures(e.point, {
          layers: map.current.getStyle().layers
            ?.filter(layer => 
              layer.id.includes('admin-0') || 
              layer.id.includes('country') ||
              layer.type === 'fill'
            )
            .map(layer => layer.id) || []
        });
      }
      
      if (features && features.length > 0) {
        // Récupérer le nom du pays dans différents formats possibles
        const feature = features[0];
        const countryName = 
          feature.properties?.name_en || 
          feature.properties?.name || 
          feature.properties?.iso_3166_1 ||
          feature.properties?.worldview;
        
        if (countryName && map.current) {
          logger.log('Country clicked:', countryName, 'from layer:', feature.layer?.id);
          
          // Pause la rotation du globe
          setIsPaused(true);
          
          // Calculer le centre approximatif du pays depuis les coordonnées du clic
          const lngLat = e.lngLat;
          
          // Animation de zoom vers le pays
          map.current.flyTo({
            center: [lngLat.lng, lngLat.lat],
            zoom: 5, // Zoom assez proche pour voir le pays
            pitch: 45, // Angle 3D
            bearing: 0,
            duration: 1800, // Animation de 1.8 secondes
            essential: true,
            easing: (t) => t * (2 - t) // Easing smooth (ease-out-quad)
          });
          
          // Attendre la fin de l'animation avant de naviguer
          setTimeout(() => {
            navigate(`/country/${countryName}`);
          }, 1900); // Légèrement après l'animation pour un effet smooth
        }
      }
    });

    // Curseur pointer sur les pays
    map.current.on('mousemove', (e) => {
      if (!map.current) return;
      
      const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
        [e.point.x - 20, e.point.y - 20],
        [e.point.x + 20, e.point.y + 20]
      ];
      
      const countryFeatures = map.current.queryRenderedFeatures(e.point, {
        layers: map.current.getStyle().layers
          ?.filter(layer => layer.id.includes('admin') || layer.id.includes('country'))
          .map(layer => layer.id) || []
      });
      
      map.current.getCanvas().style.cursor = countryFeatures && countryFeatures.length > 0 ? 'pointer' : '';
    });

    // Nettoyage
    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [navigate, mapboxToken, showTokenInput, isPaused, tripPlaces]);

  // Effet séparé pour recharger les monuments sans réinitialiser la carte
  useEffect(() => {
    if (map.current && map.current.loaded()) {
      // Sauvegarder la position actuelle de la caméra si géolocalisé
      if (geolocationEnabled && userPosition) {
        savedCameraPosition.current = {
          center: [map.current.getCenter().lng, map.current.getCenter().lat],
          zoom: map.current.getZoom(),
          pitch: map.current.getPitch()
        };
      }

      // Supprimer les anciens marqueurs
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      if (showMonuments) {
        // Charger les données des lieux
        import('@/data/placesData').then(({ mockPlaces }) => {
          if (!map.current) return;
          // Appliquer les filtres actifs
          let filteredPlaces = mockPlaces;
          if (filters.religions.length > 0 || filters.types.length > 0) {
            filteredPlaces = mockPlaces.filter(place => {
              const placeReligion = inferReligionFromPlace(place.type, place.name);
              const matchesReligion = filters.religions.length === 0 || filters.religions.includes(placeReligion);

              const typeSelected = filters.types;
              const normalizedType = place.type.toLowerCase();
              const textBlob = `${place.name} ${place.description ?? ''} ${place.type}`.toLowerCase();
              const matchesType =
                typeSelected.length === 0 ||
                typeSelected.some(t => {
                  const tLower = t.toLowerCase();
                  if (tLower === 'pyramide') {
                    return textBlob.includes('pyram');
                  }
                  return tLower === normalizedType;
                });

              return matchesReligion && matchesType;
            });
          }

          filteredPlaces.forEach(place => {
            const resolvedImageUrl = place.imageUrl ? getImageUrl(place.imageUrl) : undefined;
            
            const placeReligion = inferReligionFromPlace(place.type, place.name);
            const isVisited = userProgress.visitedPlaces.includes(place.id);
            const markerColor = religionColors[placeReligion].marker;
            
            const popup = new mapboxgl.Popup({ 
              offset: 25, 
              maxWidth: '320px',
              className: 'sacred-popup'
            })
              .setHTML(`
                <div style="padding: 16px; background: rgba(20, 43, 79, 0.95); backdrop-filter: blur(10px); border-radius: 12px; border: 1px solid rgba(52, 224, 161, 0.3);">
                  <img src="${resolvedImageUrl || '/placeholder.svg'}" alt="${place.name}" data-place-id="${place.id}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; cursor: pointer; transition: transform 0.2s ease;" onerror="this.src='/placeholder.svg';" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
                  <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #F5F5F5; font-family: 'Playfair Display', serif;">${place.name}</h3>
                  <p style="margin: 0 0 12px 0; font-size: 13px; color: #34E0A1;">${place.type} • ${place.country}</p>
                  <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.6; color: #EAD7B5; max-height: 100px; overflow-y: auto;">${(place.description || '').substring(0, 150)}...</p>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; font-weight: 600; color: #F4C542;">✨ ${place.points} points</span>
                    ${isVisited ? '<span style="font-size: 12px; color: #34E0A1;">✓ Visité</span>' : ''}
                  </div>
                </div>
              `);

            // Ajouter l'event listener pour la navigation au clic sur l'image
            popup.on('open', () => {
              const container = popup.getElement();
              const img = container?.querySelector(`img[data-place-id="${place.id}"]`) as HTMLImageElement | null;
              if (img) {
                img.addEventListener('click', (e) => {
                  e.stopPropagation();
                  navigate(`/place/${place.id}`);
                });
              }
            });

            const el = document.createElement('div');
            el.className = 'sacred-marker';
            el.style.cssText = `
              width: 14px;
              height: 14px;
              background: ${markerColor};
              border: 2px solid ${isVisited ? '#F4C542' : 'rgba(255,255,255,0.3)'};
              border-radius: 50%;
              box-shadow: 0 0 8px ${isVisited ? 'rgba(244, 197, 66, 0.3)' : 'rgba(52, 224, 161, 0.2)'};
              cursor: pointer;
              transition: transform 0.2s ease;
            `;
            
            el.addEventListener('mouseenter', () => {
              el.style.transform = 'scale(1.2)';
            });
            
            el.addEventListener('mouseleave', () => {
              el.style.transform = 'scale(1)';
            });

            const marker = new mapboxgl.Marker({ 
              element: el,
              anchor: 'center',
              pitchAlignment: 'map',
              rotationAlignment: 'map'
            })
              .setLngLat([place.coordinates[0], place.coordinates[1]])
              .setPopup(popup)
              .addTo(map.current!);
            
            // Ouvrir le popup au clic ou au tap sur mobile
            el.addEventListener('click', (ev) => {
              ev.stopPropagation();
              marker.togglePopup();
            });
            el.addEventListener('touchend', (ev) => {
              ev.stopPropagation();
              marker.togglePopup();
            }, { passive: true });
            
            markers.current.push(marker);
          });

          // Restaurer la position de la caméra si elle avait été sauvegardée
          if (savedCameraPosition.current && geolocationEnabled) {
            map.current?.easeTo({
              center: savedCameraPosition.current.center,
              zoom: savedCameraPosition.current.zoom,
              pitch: savedCameraPosition.current.pitch,
              duration: 0 // Restauration instantanée
            });
          }
        });
      }
    }
  }, [showMonuments, userProgress.visitedPlaces, filters, geolocationEnabled, userPosition]);

  // Afficher la position de l'utilisateur sur la carte
  useEffect(() => {
    if (!map.current || !map.current.loaded() || !userPosition) return;

    // Supprimer l'ancien marqueur de position utilisateur
    if (userLocationMarker.current) {
      userLocationMarker.current.remove();
    }

    // Créer un marqueur personnalisé pour la position de l'utilisateur
    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.style.cssText = `
      width: 20px;
      height: 20px;
      background: #2EA5FF;
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 0 15px rgba(46, 165, 255, 0.6), 0 0 30px rgba(46, 165, 255, 0.3);
      cursor: pointer;
      animation: pulse 2s infinite;
    `;

    // Ajouter une animation de pulsation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    `;
    if (!document.head.querySelector('style[data-user-marker]')) {
      style.setAttribute('data-user-marker', 'true');
      document.head.appendChild(style);
    }

    const popup = new mapboxgl.Popup({ 
      offset: 25,
      maxWidth: '250px',
      className: 'user-location-popup'
    })
      .setHTML(`
        <div style="padding: 12px; background: rgba(20, 43, 79, 0.95); backdrop-filter: blur(10px); border-radius: 8px; border: 1px solid rgba(46, 165, 255, 0.5);">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #2EA5FF;">📍 Votre position</h3>
          <p style="margin: 0; font-size: 12px; color: #EAD7B5;">Précision: ~${Math.round(userPosition.accuracy)}m</p>
        </div>
      `);

    userLocationMarker.current = new mapboxgl.Marker({ 
      element: el,
      anchor: 'center'
    })
      .setLngLat([userPosition.longitude, userPosition.latitude])
      .setPopup(popup)
      .addTo(map.current);

    // Afficher un message de succès la première fois
    toast.success('Position géolocalisée !');
  }, [userPosition]);

  // Recentrer automatiquement dès que la position est disponible si demandé
  useEffect(() => {
    if (!map.current || !userPosition || !isStyleReadyRef.current) return;

    if (recenterOnPosition.current || (!hasCenteredOnUser.current && geolocationEnabled)) {
      map.current.flyTo({
        center: [userPosition.longitude, userPosition.latitude],
        zoom: 15,
        pitch: 60,
        duration: 1200,
        essential: true
      });
      hasCenteredOnUser.current = true;
      recenterOnPosition.current = false;
    }
  }, [userPosition, geolocationEnabled]);

  const handleRecenter = () => {
    if (!map.current) return;
    
    // Activer la géolocalisation si pas déjà active
    if (!geolocationEnabled) {
      setGeolocationEnabled(true);
      recenterOnPosition.current = true;
      toast.success('Géolocalisation activée');
      return;
    }
    
    // Si on a une position géolocalisée, centrer dessus
    if (userPosition) {
      map.current.flyTo({
        center: [userPosition.longitude, userPosition.latitude],
        zoom: 15,
        pitch: 60,
        duration: 1200,
        essential: true
      });
      toast.success('Carte recentrée sur votre position');
    } else {
      // Redemander la position
      recenterOnPosition.current = true;
      toast.info('Obtention de votre position...');
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-160px)] min-h-[520px]">
      {/* Fond étoilé immersif */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(14, 27, 63, 0.8) 0%, rgba(14, 27, 63, 1) 100%)',
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.8), transparent),
                           radial-gradient(1px 1px at 60% 70%, rgba(52, 224, 161, 0.6), transparent),
                           radial-gradient(1px 1px at 50% 50%, rgba(244, 197, 66, 0.5), transparent),
                           radial-gradient(2px 2px at 80% 10%, rgba(255,255,255,0.7), transparent),
                           radial-gradient(1px 1px at 90% 60%, rgba(52, 224, 161, 0.5), transparent),
                           radial-gradient(1px 1px at 33% 80%, rgba(255,255,255,0.6), transparent),
                           radial-gradient(2px 2px at 15% 90%, rgba(244, 197, 66, 0.4), transparent)`,
          backgroundSize: '200% 200%',
          animation: 'twinkle 200s linear infinite',
        }}
      />
      
      <div 
        ref={mapContainer} 
        className="absolute inset-0"
        style={{ 
          background: 'transparent',
          filter: 'brightness(0.9) contrast(1.1)'
        }}
      />
      
      {/* Geolocation button - positioned top left */}
      <div className="absolute top-4 left-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleRecenter}
                className="gap-2 backdrop-blur-md border-2 transition-all duration-300 min-h-[44px] min-w-[44px]"
                style={{
                  background: geolocationEnabled 
                    ? 'linear-gradient(135deg, rgba(52, 224, 161, 0.9) 0%, rgba(52, 224, 161, 0.7) 100%)' 
                    : 'rgba(20, 43, 79, 0.8)',
                  color: geolocationEnabled ? '#0E1B3F' : '#F5F5F5',
                  borderColor: geolocationEnabled ? '#34E0A1' : 'rgba(52, 224, 161, 0.3)',
                  boxShadow: geolocationEnabled ? '0 0 20px rgba(52, 224, 161, 0.4)' : '0 0 10px rgba(244, 197, 66, 0.2)'
                }}
              >
                <Locate className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('map.geolocation')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Calendar button - positioned bottom left */}
      <div className="absolute bottom-4 left-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => navigate('/calendar')}
                className="gap-2 backdrop-blur-md border-2 transition-all duration-300 min-h-[44px] min-w-[44px]"
                style={{
                  background: 'rgba(20, 43, 79, 0.8)',
                  color: '#F5F5F5',
                  borderColor: 'rgba(52, 224, 161, 0.3)',
                  boxShadow: '0 0 10px rgba(244, 197, 66, 0.2)'
                }}
              >
                <Calendar className="w-5 h-5" />
                <span className="hidden sm:inline">{t('calendar.button')}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('calendar.tooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Monument Filter - positioned top right */}
      <div className="absolute top-4 right-4">
        <MonumentFilter onFilterChange={setFilters} />
      </div>

      {/* Toggle monuments button - positioned bottom right */}
      <Button
        onClick={() => setShowMonuments(!showMonuments)}
        className="absolute bottom-4 right-4 gap-2 backdrop-blur-md border-2 transition-all duration-300"
        style={{
          background: showMonuments 
            ? 'linear-gradient(135deg, rgba(52, 224, 161, 0.9) 0%, rgba(52, 224, 161, 0.7) 100%)' 
            : 'rgba(20, 43, 79, 0.8)',
          color: showMonuments ? '#0E1B3F' : '#F5F5F5',
          borderColor: showMonuments ? '#34E0A1' : 'rgba(52, 224, 161, 0.3)',
          boxShadow: showMonuments ? '0 0 20px rgba(52, 224, 161, 0.4)' : '0 0 10px rgba(244, 197, 66, 0.2)'
        }}
      >
        <MapPin className="w-4 h-4" />
        <span className="hidden sm:inline">{showMonuments ? 'Masquer' : 'Afficher'}</span>
      </Button>
    </div>
  );
};

export default Globe3D;