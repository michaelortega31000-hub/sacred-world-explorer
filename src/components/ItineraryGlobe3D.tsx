import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";

type ItineraryPlace = {
  id: string;
  name?: string;
  lat: number;
  lng: number;
};

type Props = {
  places: ItineraryPlace[];
  autoRotateSpeed: number;
  latLngToVector3: (lat: number, lng: number, radius?: number) => THREE.Vector3;
  createArcPoints: (start: THREE.Vector3, end: THREE.Vector3, segments?: number) => THREE.Vector3[];
};

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
function TripVisualization({ 
  places, 
  latLngToVector3, 
  createArcPoints 
}: { 
  places: ItineraryPlace[];
  latLngToVector3: Props['latLngToVector3'];
  createArcPoints: Props['createArcPoints'];
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.09;
    }
  });

  const markers = useMemo(() => {
    return places.map(place => latLngToVector3(place.lat, place.lng, 1.02));
  }, [places, latLngToVector3]);

  const arcs = useMemo(() => {
    if (places.length < 2) return [];
    
    const arcsList: THREE.Vector3[][] = [];
    for (let i = 0; i < places.length - 1; i++) {
      const start = latLngToVector3(places[i].lat, places[i].lng, 1.02);
      const end = latLngToVector3(places[i + 1].lat, places[i + 1].lng, 1.02);
      arcsList.push(createArcPoints(start, end));
    }
    return arcsList;
  }, [places, latLngToVector3, createArcPoints]);

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

export default function Globe3DContent({
  places,
  autoRotateSpeed,
  latLngToVector3,
  createArcPoints,
}: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#34E0A1" />
      
      <RotatingGlobe autoRotateSpeed={autoRotateSpeed} />
      <TripVisualization 
        places={places} 
        latLngToVector3={latLngToVector3}
        createArcPoints={createArcPoints}
      />
      
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
  );
}
