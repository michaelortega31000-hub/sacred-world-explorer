import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Globe3DProps {
  onCountryClick?: (countryName: string) => void;
}

const Globe3D = ({ onCountryClick }: Globe3DProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const navigate = useNavigate();
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

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
        setShowTokenInput(true);
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
    
    // Initialiser la carte en mode globe
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
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
    });

    // Configuration de la rotation automatique
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Gestion des interactions utilisateur
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    // Démarrer la rotation
    spinGlobe();

    // Click sur un pays
    map.current.on('click', (e) => {
      if (!map.current) return;
      
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['country-label']
      });
      
      if (features && features.length > 0) {
        const countryName = features[0].properties?.name;
        if (countryName) {
          navigate(`/country/${countryName}`);
        }
      }
    });

    // Curseur pointer sur les pays
    map.current.on('mousemove', (e) => {
      if (!map.current) return;
      
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['country-label']
      });
      
      map.current.getCanvas().style.cursor = features && features.length > 0 ? 'pointer' : '';
    });

    // Nettoyage
    return () => {
      map.current?.remove();
    };
  }, [navigate, mapboxToken, showTokenInput]);

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
    <div className="relative w-full h-full">
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
    </div>
  );
};

export default Globe3D;