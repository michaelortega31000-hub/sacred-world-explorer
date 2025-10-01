import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface Globe3DProps {
  onCountryClick?: (countryName: string) => void;
}

const Globe3D = ({ onCountryClick }: Globe3DProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [showMonuments, setShowMonuments] = useState(false);

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
    console.log('Globe3D init with token', !!mapboxToken, 'container size', mapContainer.current?.clientWidth, mapContainer.current?.clientHeight);
    
    // Initialiser la carte en mode globe
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      projection: { name: 'globe' },
      zoom: 1.2,
      center: [10, 20],
      pitch: 0,
    });

    // Ajouter les contrôles de navigation
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Configuration de l'atmosphère et du fog
    map.current.on('style.load', () => {
      if (!map.current) return;
      
      // Fond noir avec étoiles
      map.current.setFog({
        color: '#000000',
        'high-color': '#000000',
        'horizon-blend': 0.02,
        'space-color': '#000000',
        'star-intensity': 0.8
      });

      // Ajouter un layer pour l'effet hover doré sur les pays
      if (!map.current.getLayer('country-fills-hover')) {
        map.current.addLayer({
          id: 'country-fills-hover',
          type: 'fill',
          source: 'composite',
          'source-layer': 'admin',
          filter: ['==', ['get', 'admin_level'], 0],
          paint: {
            'fill-color': 'hsl(45, 100%, 51%)',
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.5,
              0
            ]
          }
        }, 'country-label');
      }

      // Ajouter un contour pour mieux voir le hover
      if (!map.current.getLayer('country-outline-hover')) {
        map.current.addLayer({
          id: 'country-outline-hover',
          type: 'line',
          source: 'composite',
          'source-layer': 'admin',
          filter: ['==', ['get', 'admin_level'], 0],
          paint: {
            'line-color': 'hsl(45, 100%, 51%)',
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              3,
              0
            ],
            'line-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.8,
              0
            ]
          }
        }, 'country-label');
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
    });

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

          mockPlaces.forEach(place => {
            const popup = new mapboxgl.Popup({ offset: 25, maxWidth: '400px' })
              .setHTML(`
                <div style="padding: 12px;">
                  ${place.imageUrl ? `<img src="${place.imageUrl}" alt="${place.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;" />` : ''}
                  <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #1a1a1a;">${place.name}</h3>
                  <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${place.type} • ${place.country}</p>
                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #333; max-height: 150px; overflow-y: auto;">${place.description}</p>
                  <p style="margin: 12px 0 0 0; font-size: 14px; font-weight: bold; color: hsl(45 100% 51%);">🏆 ${place.points} points</p>
                </div>
              `);

            const marker = new mapboxgl.Marker({ color: '#FFD700' })
              .setLngLat([place.coordinates[0], place.coordinates[1]])
              .setPopup(popup)
              .addTo(map.current!);
            
            markers.current.push(marker);
          });
        });
      }
    };

    // Recharger les monuments quand le toggle change
    if (map.current.loaded()) {
      loadMonuments();
    }

    // Ne pas afficher les marqueurs par défaut - les monuments seront visibles sur la page du pays

    // Click sur un pays
    map.current.on('click', (e) => {
      if (!map.current) return;
      
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['country-label']
      });
      
      if (features && features.length > 0) {
        // Récupérer le nom en anglais qui est la clé standard
        const countryName = features[0].properties?.name_en || features[0].properties?.name;
        if (countryName) {
          navigate(`/country/${countryName}`);
        }
      }
    });

    // Curseur pointer sur les pays et effet hover doré
    let hoveredCountryId: string | number | null = null;
    
    map.current.on('mousemove', (e) => {
      if (!map.current) return;
      
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['country-label']
      });
      
      // Récupérer les features de la couche admin pour l'effet hover
      const countryFeatures = map.current.queryRenderedFeatures(e.point, {
        layers: ['country-fills-hover']
      });

      // Réinitialiser le hover précédent
      if (hoveredCountryId !== null) {
        map.current.setFeatureState(
          { source: 'composite', sourceLayer: 'admin', id: hoveredCountryId },
          { hover: false }
        );
      }

      // Activer le hover sur le nouveau pays
      if (countryFeatures && countryFeatures.length > 0) {
        hoveredCountryId = countryFeatures[0].id;
        if (hoveredCountryId !== undefined) {
          map.current.setFeatureState(
            { source: 'composite', sourceLayer: 'admin', id: hoveredCountryId },
            { hover: true }
          );
        }
      } else {
        hoveredCountryId = null;
      }
      
      map.current.getCanvas().style.cursor = features && features.length > 0 ? 'pointer' : '';
    });

    // Réinitialiser le hover quand la souris quitte la carte
    map.current.on('mouseleave', () => {
      if (!map.current || hoveredCountryId === null) return;
      map.current.setFeatureState(
        { source: 'composite', sourceLayer: 'admin', id: hoveredCountryId },
        { hover: false }
      );
      hoveredCountryId = null;
    });

    // Nettoyage
    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [navigate, mapboxToken, showTokenInput, showMonuments]);

  if (showTokenInput) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="bg-black/90 backdrop-blur-sm p-8 rounded-xl border-2 max-w-md w-full mx-4" style={{ borderColor: 'hsl(45 100% 51%)' }}>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span style={{ color: 'hsl(45 100% 51%)' }}>🗺️</span>
            Configuration Mapbox
          </h2>
          <p className="text-gray-300 mb-4">
            Pour afficher le globe 3D, vous devez fournir votre token public Mapbox.
          </p>
          <ol className="text-sm text-gray-400 mb-6 space-y-2 list-decimal list-inside">
            <li>Créez un compte sur <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">mapbox.com</a></li>
            <li>Copiez votre token public</li>
            <li>Collez-le ci-dessous</li>
          </ol>
          <Input
            type="text"
            placeholder="pk.eyJ1Ijo..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="mb-4 bg-black/50 border-2 text-white"
            style={{ borderColor: 'hsl(220 70% 45%)' }}
          />
          <Button
            onClick={handleTokenSubmit}
            disabled={!mapboxToken}
            className="w-full"
            style={{ 
              background: 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)',
              color: 'black'
            }}
          >
            Valider
          </Button>
        </div>
        
        {/* Étoiles en arrière-plan */}
        <div 
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                             radial-gradient(2px 2px at 60% 70%, white, transparent),
                             radial-gradient(1px 1px at 50% 50%, white, transparent),
                             radial-gradient(1px 1px at 80% 10%, white, transparent),
                             radial-gradient(2px 2px at 90% 60%, white, transparent),
                             radial-gradient(1px 1px at 33% 80%, white, transparent),
                             radial-gradient(1px 1px at 15% 90%, white, transparent)`,
            backgroundSize: '200% 200%',
            animation: 'twinkle 200s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-160px)] min-h-[520px]">
      <div 
        ref={mapContainer} 
        className="absolute inset-0"
        style={{ background: '#000000' }}
      />
      
      {/* Effet d'étoiles en arrière-plan */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                           radial-gradient(2px 2px at 60% 70%, white, transparent),
                           radial-gradient(1px 1px at 50% 50%, white, transparent),
                           radial-gradient(1px 1px at 80% 10%, white, transparent),
                           radial-gradient(2px 2px at 90% 60%, white, transparent),
                           radial-gradient(1px 1px at 33% 80%, white, transparent),
                           radial-gradient(1px 1px at 15% 90%, white, transparent)`,
          backgroundSize: '200% 200%',
          animation: 'twinkle 200s linear infinite',
        }}
      />
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full text-sm backdrop-blur-sm border border-white/20">
        🌍 Faites glisser pour tourner • Molette pour zoomer • Cliquez sur un pays
      </div>

      {/* Toggle monuments button */}
      <Button
        onClick={() => setShowMonuments(!showMonuments)}
        className="absolute top-4 right-4 gap-2"
        style={{
          background: showMonuments ? 'linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(48 100% 70%) 100%)' : 'rgba(0, 0, 0, 0.8)',
          color: showMonuments ? 'black' : 'white',
          border: '2px solid',
          borderColor: 'hsl(45 100% 51%)'
        }}
      >
        <MapPin className="w-4 h-4" />
        {showMonuments ? 'Masquer les monuments' : 'Afficher les monuments'}
      </Button>
    </div>
  );
};

export default Globe3D;