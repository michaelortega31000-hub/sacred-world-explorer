import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import * as THREE from "three";

export type ItineraryPlace = {
  id: string;
  name?: string;
  lat: number;
  lng: number;
};

// Check WebGL support
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

// Convert lat/lng to 3D coordinates on a sphere
function latLngToVector3(lat: number, lng: number, radius: number = 1.02): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

// Create arc points between two locations
function createArcPoints(start: THREE.Vector3, end: THREE.Vector3, segments: number = 50): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = new THREE.Vector3().lerpVectors(start, end, t);
    
    // Add altitude to the arc (curve effect)
    const altitude = 1 + 0.15 * Math.sin(t * Math.PI);
    point.normalize().multiplyScalar(altitude);
    
    points.push(point);
  }
  
  return points;
}

// Static fallback component
function StaticFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#0E1B3F] via-[#1a365d] to-[#0E1B3F]">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-primary/80 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-primary rounded-full animate-pulse delay-700" />
      </div>
    </div>
  );
}

// Lazy-loaded 3D content
const Globe3DContent = React.lazy(() => import('./ItineraryGlobe3D'));

export default function ItineraryGlobe({
  places,
  autoRotateSpeed = 0.18,
}: {
  places: ItineraryPlace[];
  autoRotateSpeed?: number;
}) {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());
  }, []);

  // Filter valid places
  const cleanPlaces = useMemo(() => {
    return places.filter(p => isFiniteNumber(p.lat) && isFiniteNumber(p.lng));
  }, [places]);

  // Loading state
  if (webGLSupported === null) {
    return <StaticFallback />;
  }

  // No WebGL or error occurred
  if (!webGLSupported || hasError) {
    return <StaticFallback />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <ErrorBoundary onError={() => setHasError(true)}>
        <Suspense fallback={<StaticFallback />}>
          <Globe3DContent 
            places={cleanPlaces} 
            autoRotateSpeed={autoRotateSpeed}
            latLngToVector3={latLngToVector3}
            createArcPoints={createArcPoints}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Simple error boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
