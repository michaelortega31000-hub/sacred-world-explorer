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
import { playWhooshSound, resumeAudioContext } from '@/utils/audioEffects';
import { throttle } from '@/lib/throttle';

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
  const hasLoadedMonuments = useRef(false);
  const hasShownLocationToast = useRef(false);
  const animationFrameId = useRef<number | null>(null);
  const hoveredCountryCache = useRef<string | null>(null);

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
    // Token par défaut mis à jour
    const defaultToken = 'pk.eyJ1Ijoic2FjcmVkd29sZCIsImEiOiJjbWc3eXQ1YWIwMWxlMmtzaHppZWxkMzhnIn0.Rdmr8Vf5k04a-Z-8M0Uvaw';
    
    // Essayer de récupérer depuis l'env
    const envToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN || import.meta.env.VITE_MAPBOX_TOKEN;
    if (envToken) {
      setMapboxToken(envToken);
      localStorage.setItem('mapbox_token', envToken);
    } else {
      // Vérifier le localStorage
      const savedToken = localStorage.getItem('mapbox_token');
      if (savedToken) {
        setMapboxToken(savedToken);
      } else {
        // Utiliser et sauvegarder le token par défaut
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
    
    // Initialiser la carte en mode globe - vue 3D immersive moderne
    // Style dark-v11 pour rendu moderne avec fond sombre
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: { name: 'globe' },
      zoom: isMobile ? 1.8 : 2.2,
      center: [10, 45],
      pitch: isMobile ? 45 : 55,
      bearing: -15,
      maxPitch: 85,
      antialias: true, // Anti-aliasing pour qualité optimale
    });

    // Contrôles de navigation désactivés (utilisateur zoom directement)

    // Configuration de l'atmosphère et du fog immersif
    map.current.on('style.load', () => {
      if (!map.current) return;
      // Le style est prêt
      isStyleReadyRef.current = true;
      
      // Atmosphère spatiale améliorée avec couleurs plus riches
      map.current.setFog({
        color: 'rgb(8, 15, 35)', // Espace profond plus sombre
        'high-color': 'rgb(52, 224, 161)', // Turquoise éclatant
        'horizon-blend': 0.15, // Transition plus douce
        'space-color': 'rgb(5, 10, 25)', // Noir spatial profond
        'star-intensity': 0.85 // Plus d'étoiles
      });

      // Amélioration des océans avec gradient de profondeur
      const labelBeforeId = map.current.getLayer('country-label') ? 'country-label' : undefined;

      // Océans avec gradient turquoise et reflets
      if (map.current.getLayer('water')) {
        map.current.setPaintProperty('water', 'fill-color', [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, '#1a3d5c', // Bleu profond au zoom éloigné
          5, '#2EA5FF', // Turquoise au zoom proche
          10, '#4ecdc4' // Cyan clair au zoom maximal
        ]);
        map.current.setPaintProperty('water', 'fill-opacity', 0.7);
      }

      // Amélioration des terres - contraste accru
      if (map.current.getLayer('land')) {
        map.current.setPaintProperty('land', 'background-color', '#0a1628');
      }
      
      // Layer de reflets sur l'eau (specular highlights)
      if (!map.current.getLayer('ocean-specular')) {
        try {
          map.current.addLayer({
            id: 'ocean-specular',
            type: 'fill',
            source: 'composite',
            'source-layer': 'water',
            paint: {
              'fill-color': '#ffffff',
              'fill-opacity': 0.08,
              'fill-translate': [0, -2],
              'fill-antialias': true
            }
          } as any, labelBeforeId);
        } catch (e) {
          console.warn('Ocean specular layer failed', e);
        }
      }

      // Source précise des frontières pays (meilleure détection clic)
      if (!map.current.getSource('country-boundaries')) {
        map.current.addSource('country-boundaries', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1',
        } as any);
      }

      // Phase 3: Frontières interactives avec glow effect
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

      // Layer de frontières avec effet glow
      if (!map.current.getLayer('country-boundaries-glow')) {
        map.current.addLayer({
          id: 'country-boundaries-glow',
          type: 'line',
          source: 'country-boundaries',
          'source-layer': 'country_boundaries',
          paint: {
            'line-color': '#34E0A1',
            'line-width': 1.5,
            'line-opacity': 0.3,
            'line-blur': 2
          }
        } as any);
      }

      // Layer de highlight au hover (initialement invisible)
      if (!map.current.getLayer('country-highlight')) {
        map.current.addLayer({
          id: 'country-highlight',
          type: 'line',
          source: 'country-boundaries',
          'source-layer': 'country_boundaries',
          paint: {
            'line-color': '#F4C542',
            'line-width': 3,
            'line-opacity': 0
          },
          filter: ['==', 'iso_3166_1', '']
        } as any);
      }

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
            
            const placeReligion = inferReligionFromPlace(place.type, place.name);
            const isVisited = userProgress.visitedPlaces.includes(place.id);
            const markerColor = religionColors[placeReligion].marker;
            
            // Déterminer le niveau d'importance
            const isMajorSite = place.points >= 150;
            const isImportantSite = place.points >= 100;
            
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

            // Marqueur ultra-moderne
            const el = document.createElement('div');
            el.className = `sacred-marker-3d ${isMajorSite ? 'major-site' : ''} ${isImportantSite ? 'important-site' : ''}`;
            
            const markerHTML = `
              ${isMajorSite ? `
                <div class="marker-beam" style="
                  position: absolute;
                  bottom: 100%;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 2px;
                  height: 80px;
                  background: linear-gradient(to top, ${markerColor}, transparent);
                  opacity: 0.6;
                  animation: beam-pulse 2s ease-in-out infinite;
                "></div>
              ` : ''}
              
              ${isImportantSite ? `
                <div class="marker-particles">
                  <div class="particle" style="--delay: 0s; --color: ${markerColor}"></div>
                  <div class="particle" style="--delay: 0.5s; --color: ${markerColor}"></div>
                  <div class="particle" style="--delay: 1s; --color: ${markerColor}"></div>
                  <div class="particle" style="--delay: 1.5s; --color: ${markerColor}"></div>
                </div>
              ` : ''}
              
              <div class="marker-halo-outer" style="
                position: absolute;
                width: 40px;
                height: 40px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 2px solid ${markerColor};
                border-radius: 50%;
                opacity: 0.3;
                animation: halo-expand 3s ease-out infinite;
              "></div>
              
              <div class="marker-halo-inner" style="
                position: absolute;
                width: 28px;
                height: 28px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 2px solid ${markerColor};
                border-radius: 50%;
                opacity: 0.5;
                animation: halo-expand 2s ease-out infinite 0.5s;
              "></div>
              
              <div class="marker-core" style="
                position: relative;
                width: 16px;
                height: 16px;
                background: ${markerColor};
                border: 3px solid ${isVisited ? '#F4C542' : 'rgba(255,255,255,0.9)'};
                border-radius: 50%;
                box-shadow: 
                  0 0 20px ${markerColor},
                  0 0 40px ${markerColor}80,
                  inset 0 0 10px ${markerColor};
                animation: marker-pulse 2s ease-in-out infinite;
                z-index: 10;
              "></div>
              
              ${isVisited ? `
                <div class="marker-checkmark" style="
                  position: absolute;
                  top: -8px;
                  right: -8px;
                  width: 18px;
                  height: 18px;
                  background: #F4C542;
                  border: 2px solid #0E1B3F;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  font-weight: bold;
                  color: #0E1B3F;
                  z-index: 20;
                  animation: checkmark-bounce 0.5s ease-out;
                ">✓</div>
              ` : ''}
            `;
            
            el.innerHTML = markerHTML;
            el.style.cssText = `
              position: relative;
              width: 20px;
              height: 20px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
            `;

            const marker = new mapboxgl.Marker({ 
              element: el,
              anchor: 'center',
              pitchAlignment: 'map',
              rotationAlignment: 'map'
            })
              .setLngLat([place.coordinates[0], place.coordinates[1]])
              .setPopup(popup)
              .addTo(map.current!);
            
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

    // Animation de rotation automatique du globe - optimisée avec RAF
    let userInteracting = false;
    let isPausedLocal = isPaused;
    const secondsPerRevolution = 240;
    const maxSpinZoom = 3;

    function spinGlobe() {
      if (!map.current || isPausedLocal) {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
        return;
      }
      
      const zoom = map.current.getZoom();
      if (!userInteracting && zoom < maxSpinZoom) {
        const distancePerSecond = 360 / secondsPerRevolution;
        const center = map.current.getCenter();
        center.lng -= distancePerSecond / 60;
        map.current.setCenter(center); // Use setCenter instead of easeTo for smoother performance
      }
      
      animationFrameId.current = requestAnimationFrame(spinGlobe);
    }

    map.current.on('mousedown', () => { 
      userInteracting = true; 
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    });
    map.current.on('touchstart', () => { 
      userInteracting = true; 
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    });
    map.current.on('mouseup', () => { 
      userInteracting = false; 
      spinGlobe(); 
    });
    map.current.on('touchend', () => { 
      userInteracting = false; 
      spinGlobe(); 
    });

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
          
          // Resume audio context if needed (browser requirement)
          resumeAudioContext();
          
          // Play whoosh sound effect
          playWhooshSound();
          
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

    // Phase 3: Interaction hover améliorée avec pulsation
    const handleMouseMove = throttle((e: mapboxgl.MapMouseEvent) => {
      if (!map.current) return;
      
      const countryFeatures = map.current.queryRenderedFeatures(e.point, {
        layers: ['country-boundaries-fill']
      });
      
      const hasCountry = countryFeatures && countryFeatures.length > 0;
      const countryCode = hasCountry ? (countryFeatures[0].properties?.iso_3166_1 || '') : null;
      
      // Mise à jour du curseur et du highlight
      if (hoveredCountryCache.current !== countryCode) {
        hoveredCountryCache.current = countryCode;
        map.current.getCanvas().style.cursor = hasCountry ? 'pointer' : '';
        
        // Activer le highlight avec animation pulsante
        if (hasCountry && countryCode) {
          map.current.setFilter('country-highlight', ['==', 'iso_3166_1', countryCode]);
          map.current.setPaintProperty('country-highlight', 'line-opacity', 0.8);
          
          // Ajouter classe CSS pour animation pulsante
          map.current.getCanvas().classList.add('country-pulsing');
        } else {
          map.current.setFilter('country-highlight', ['==', 'iso_3166_1', '']);
          map.current.setPaintProperty('country-highlight', 'line-opacity', 0);
          map.current.getCanvas().classList.remove('country-pulsing');
        }
      }
    }, 100);

    map.current.on('mousemove', handleMouseMove);

    // Nettoyage
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [navigate, mapboxToken, showTokenInput, tripPlaces]); // Removed isPaused from deps

  // Separate effect to handle isPaused changes without re-initializing the map
  useEffect(() => {
    if (!map.current) return;
    
    // This will trigger the spinGlobe function to check isPaused state
    // Force a re-evaluation of the rotation
    if (!isPaused) {
      // Resume spinning
      const event = new CustomEvent('resume-spin');
      map.current.getContainer().dispatchEvent(event);
    }
  }, [isPaused]);

  // Effet séparé pour recharger les monuments sans réinitialiser la carte
  useEffect(() => {
    if (map.current && map.current.loaded()) {
      // Only reload on filter changes or first load, NOT on userPosition changes
      if (!hasLoadedMonuments.current || showMonuments) {
        hasLoadedMonuments.current = true;
        
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
              
              // Déterminer le niveau d'importance du site
              const isMajorSite = place.points >= 150; // Sites majeurs (beams)
              const isImportantSite = place.points >= 100; // Sites importants (particules)
              
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

              // Phase 4: Créer marqueur ultra-moderne avec effets avancés
              const el = document.createElement('div');
              el.className = `sacred-marker-3d ${isMajorSite ? 'major-site' : ''} ${isImportantSite ? 'important-site' : ''}`;
              
              // Structure du marqueur avec couches multiples
              const markerHTML = `
                <!-- Beam vertical pour sites majeurs -->
                ${isMajorSite ? `
                  <div class="marker-beam" style="
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 2px;
                    height: 80px;
                    background: linear-gradient(to top, ${markerColor}, transparent);
                    opacity: 0.6;
                    animation: beam-pulse 2s ease-in-out infinite;
                  "></div>
                ` : ''}
                
                <!-- Particules pour sites importants -->
                ${isImportantSite ? `
                  <div class="marker-particles">
                    <div class="particle" style="--delay: 0s; --color: ${markerColor}"></div>
                    <div class="particle" style="--delay: 0.5s; --color: ${markerColor}"></div>
                    <div class="particle" style="--delay: 1s; --color: ${markerColor}"></div>
                    <div class="particle" style="--delay: 1.5s; --color: ${markerColor}"></div>
                  </div>
                ` : ''}
                
                <!-- Halos concentriques -->
                <div class="marker-halo-outer" style="
                  position: absolute;
                  width: 40px;
                  height: 40px;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  border: 2px solid ${markerColor};
                  border-radius: 50%;
                  opacity: 0.3;
                  animation: halo-expand 3s ease-out infinite;
                "></div>
                
                <div class="marker-halo-inner" style="
                  position: absolute;
                  width: 28px;
                  height: 28px;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  border: 2px solid ${markerColor};
                  border-radius: 50%;
                  opacity: 0.5;
                  animation: halo-expand 2s ease-out infinite 0.5s;
                "></div>
                
                <!-- Point central avec pulsation -->
                <div class="marker-core" style="
                  position: relative;
                  width: 16px;
                  height: 16px;
                  background: ${markerColor};
                  border: 3px solid ${isVisited ? '#F4C542' : 'rgba(255,255,255,0.9)'};
                  border-radius: 50%;
                  box-shadow: 
                    0 0 20px ${markerColor},
                    0 0 40px ${markerColor}80,
                    inset 0 0 10px ${markerColor};
                  animation: marker-pulse 2s ease-in-out infinite;
                  z-index: 10;
                "></div>
                
                ${isVisited ? `
                  <div class="marker-checkmark" style="
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 18px;
                    height: 18px;
                    background: #F4C542;
                    border: 2px solid #0E1B3F;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: bold;
                    color: #0E1B3F;
                    z-index: 20;
                    animation: checkmark-bounce 0.5s ease-out;
                  ">✓</div>
                ` : ''}
              `;
              
              el.innerHTML = markerHTML;
              el.style.cssText = `
                position: relative;
                width: 20px;
                height: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
              `;

              const marker = new mapboxgl.Marker({ 
                element: el,
                anchor: 'center',
                pitchAlignment: 'map',
                rotationAlignment: 'map'
              })
                .setLngLat([place.coordinates[0], place.coordinates[1]])
                .setPopup(popup)
                .addTo(map.current!);
              
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
    }
  }, [showMonuments, userProgress.visitedPlaces, filters, geolocationEnabled]); // Removed userPosition

  // Afficher la position de l'utilisateur sur la carte - optimisé
  useEffect(() => {
    if (!map.current || !map.current.loaded() || !userPosition) return;

    // Si le marqueur existe déjà, juste mettre à jour sa position
    if (userLocationMarker.current) {
      userLocationMarker.current.setLngLat([userPosition.longitude, userPosition.latitude]);
      
      // Update popup content
      const popup = userLocationMarker.current.getPopup();
      if (popup) {
        popup.setHTML(`
          <div style="padding: 12px; background: rgba(20, 43, 79, 0.95); backdrop-filter: blur(10px); border-radius: 8px; border: 1px solid rgba(46, 165, 255, 0.5);">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #2EA5FF;">📍 Votre position</h3>
            <p style="margin: 0; font-size: 12px; color: #EAD7B5;">Précision: ~${Math.round(userPosition.accuracy)}m</p>
          </div>
        `);
      }
      return;
    }

    // Créer le marqueur seulement la première fois
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

    // Ajouter une animation de pulsation (une seule fois)
    if (!document.head.querySelector('style[data-user-marker]')) {
      const style = document.createElement('style');
      style.setAttribute('data-user-marker', 'true');
      style.textContent = `
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `;
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

    // Afficher un message de succès seulement la première fois
    if (!hasShownLocationToast.current) {
      hasShownLocationToast.current = true;
      toast.success('Position géolocalisée !');
    }
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
      {/* Phase 2: Champ d'étoiles animé ultra-immersif */}
      <div 
        className="absolute inset-0 pointer-events-none star-field"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(5, 10, 25, 0.7) 0%, rgba(5, 10, 25, 1) 100%)',
          backgroundImage: `
            radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(52, 224, 161, 0.8), transparent),
            radial-gradient(1.5px 1.5px at 50% 50%, rgba(244, 197, 66, 0.7), transparent),
            radial-gradient(2px 2px at 80% 10%, rgba(255,255,255,0.85), transparent),
            radial-gradient(1px 1px at 90% 60%, rgba(52, 224, 161, 0.6), transparent),
            radial-gradient(1px 1px at 33% 80%, rgba(255,255,255,0.75), transparent),
            radial-gradient(2.5px 2.5px at 15% 90%, rgba(244, 197, 66, 0.5), transparent),
            radial-gradient(1px 1px at 70% 20%, rgba(52, 224, 161, 0.7), transparent),
            radial-gradient(1.5px 1.5px at 40% 60%, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 85% 80%, rgba(244, 197, 66, 0.6), transparent)
          `,
          backgroundSize: '200% 200%',
          animation: 'twinkle-stars 200s linear infinite',
        }}
      />

      {/* Phase 2: Aurores boréales subtiles aux pôles */}
      <div 
        className="absolute inset-0 pointer-events-none aurora-effect"
        style={{
          background: `
            radial-gradient(ellipse 80% 30% at 50% 0%, rgba(52, 224, 161, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 80% 30% at 50% 100%, rgba(52, 224, 161, 0.12) 0%, transparent 50%)
          `,
          animation: 'aurora-wave 15s ease-in-out infinite',
        }}
      />
      
      {/* Phase 2: Halo lumineux CSS autour du globe */}
      <div 
        ref={mapContainer} 
        className="absolute inset-0 globe-container"
        style={{ 
          background: 'transparent',
          filter: 'brightness(1.05) contrast(1.1)',
          boxShadow: `
            0 0 80px rgba(52, 224, 161, 0.15),
            0 0 120px rgba(244, 197, 66, 0.08)
          `,
          borderRadius: '12px'
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