import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";

export type ItineraryPlace = {
  id: string;
  name?: string;
  lat: number;
  lng: number;
};

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

// Rotating globe mesh
function RotatingGlobe({ autoRotateSpeed }: { autoRotateSpeed: number }) {
  const globeRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * autoRotateSpeed * 0.5;
    }
  });

  return (
    <Sphere ref={globeRef} args={[1, 64, 64]}>
      <meshStandardMaterial
        color="#1a365d"
        roughness={0.8}
        metalness={0.2}
        emissive="#0E1B3F"
        emissiveIntensity={0.1}
      />
    </Sphere>
  );
}

// Trip markers and arcs
function TripVisualization({ places }: { places: ItineraryPlace[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.09;
    }
  });

  const cleanPlaces = useMemo(() => {
    return places.filter(p => isFiniteNumber(p.lat) && isFiniteNumber(p.lng));
  }, [places]);

  const markers = useMemo(() => {
    return cleanPlaces.map(place => latLngToVector3(place.lat, place.lng, 1.02));
  }, [cleanPlaces]);

  const arcs = useMemo(() => {
    if (cleanPlaces.length < 2) return [];
    
    const arcsList: THREE.Vector3[][] = [];
    for (let i = 0; i < cleanPlaces.length - 1; i++) {
      const start = latLngToVector3(cleanPlaces[i].lat, cleanPlaces[i].lng, 1.02);
      const end = latLngToVector3(cleanPlaces[i + 1].lat, cleanPlaces[i + 1].lng, 1.02);
      arcsList.push(createArcPoints(start, end));
    }
    return arcsList;
  }, [cleanPlaces]);

  return (
    <group ref={groupRef}>
      {/* Markers for each destination */}
      {markers.map((position, idx) => (
        <mesh key={idx} position={position}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial
            color="#F4C542"
            emissive="#F4C542"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
      
      {/* Arcs connecting destinations */}
      {arcs.map((arcPoints, idx) => (
        <Line
          key={`arc-${idx}`}
          points={arcPoints}
          color="#F4C542"
          lineWidth={2}
          transparent
          opacity={0.8}
        />
      ))}
    </group>
  );
}

export default function ItineraryGlobe({
  places,
  autoRotateSpeed = 0.18,
}: {
  places: ItineraryPlace[];
  autoRotateSpeed?: number;
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={0.8} />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#34E0A1" />
        
        <RotatingGlobe autoRotateSpeed={autoRotateSpeed} />
        <TripVisualization places={places} />
        
        {/* Atmosphere glow effect */}
        <Sphere args={[1.05, 32, 32]}>
          <meshBasicMaterial
            color="#34E0A1"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </Sphere>
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
