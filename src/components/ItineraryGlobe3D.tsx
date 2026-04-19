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
  /** Premium look: lat/lng grid, brighter atmosphere, sacred glow points */
  enhanced?: boolean;
  /** When true, arcs are amplified after the user saves the trip */
  tripSaved?: boolean;
};

// A few iconic sacred sites used as soft glow points (cosmetic only)
const SACRED_POINTS: { lat: number; lng: number }[] = [
  { lat: 31.7781, lng: 35.2356 },   // Jerusalem
  { lat: 21.4225, lng: 39.8262 },   // Mecca
  { lat: 41.9029, lng: 12.4534 },   // Vatican
  { lat: 27.1751, lng: 78.0421 },   // Taj Mahal
  { lat: 13.4125, lng: 103.8667 },  // Angkor
  { lat: 35.0394, lng: 135.7292 },  // Kyoto
  { lat: 43.0959, lng: -0.0455 },   // Lourdes
  { lat: 48.6361, lng: -1.5115 },   // Mont-Saint-Michel
];

// Rotating globe mesh
function RotatingGlobe({
  autoRotateSpeed,
  enhanced,
  latLngToVector3,
}: {
  autoRotateSpeed: number;
  enhanced?: boolean;
  latLngToVector3: Props["latLngToVector3"];
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * autoRotateSpeed * 0.5;
    }
  });

  // Faint golden lat/lng grid as continent-evoking outlines
  const grid = useMemo(() => {
    if (!enhanced) return null;
    const lines: THREE.Vector3[][] = [];
    // Parallels
    for (let lat = -60; lat <= 60; lat += 30) {
      const ring: THREE.Vector3[] = [];
      for (let lng = -180; lng <= 180; lng += 6) {
        ring.push(latLngToVector3(lat, lng, 1.001));
      }
      lines.push(ring);
    }
    // Meridians
    for (let lng = -180; lng < 180; lng += 30) {
      const ring: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 4) {
        ring.push(latLngToVector3(lat, lng, 1.001));
      }
      lines.push(ring);
    }
    return lines;
  }, [enhanced, latLngToVector3]);

  return (
    <group ref={groupRef}>
      <Sphere args={[1, 96, 96]}>
        <meshStandardMaterial
          color="#16315E"
          roughness={0.7}
          metalness={0.35}
          emissive="#0E1B3F"
          emissiveIntensity={0.18}
        />
      </Sphere>

      {/* Subtle golden grid (continents-evoking) */}
      {grid?.map((points, idx) => (
        <Line
          key={`grid-${idx}`}
          points={points}
          color="#F4C542"
          lineWidth={0.6}
          transparent
          opacity={0.18}
        />
      ))}

      {/* Soft sacred glow points (cosmetic, rotate with globe) */}
      {enhanced &&
        SACRED_POINTS.map((p, idx) => {
          const pos = latLngToVector3(p.lat, p.lng, 1.012);
          return (
            <mesh key={`sacred-${idx}`} position={pos}>
              <sphereGeometry args={[0.012, 12, 12]} />
              <meshBasicMaterial color="#FFD27A" transparent opacity={0.85} />
            </mesh>
          );
        })}
    </group>
  );
}

// Trip markers and arcs
function TripVisualization({
  places,
  latLngToVector3,
  createArcPoints,
  tripSaved,
}: {
  places: ItineraryPlace[];
  latLngToVector3: Props["latLngToVector3"];
  createArcPoints: Props["createArcPoints"];
  tripSaved?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.09;
    }
  });

  const markers = useMemo(() => {
    return places.map((place) => latLngToVector3(place.lat, place.lng, 1.02));
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

  const arcWidth = tripSaved ? 3.5 : 2;
  const arcOpacity = tripSaved ? 1 : 0.85;
  const markerColor = tripSaved ? "#FFD75A" : "#F4C542";

  return (
    <group ref={groupRef}>
      {/* Markers for each destination */}
      {markers.map((position, idx) => (
        <mesh key={idx} position={position}>
          <sphereGeometry args={[tripSaved ? 0.026 : 0.02, 16, 16]} />
          <meshStandardMaterial
            color={markerColor}
            emissive={markerColor}
            emissiveIntensity={tripSaved ? 1.2 : 0.8}
          />
        </mesh>
      ))}

      {/* Arcs connecting destinations */}
      {arcs.map((arcPoints, idx) => (
        <React.Fragment key={`arc-${idx}`}>
          <Line
            points={arcPoints}
            color={markerColor}
            lineWidth={arcWidth}
            transparent
            opacity={arcOpacity}
          />
          {tripSaved && (
            <Line
              points={arcPoints}
              color="#FF8A2B"
              lineWidth={1.2}
              transparent
              opacity={0.55}
            />
          )}
        </React.Fragment>
      ))}
    </group>
  );
}

export default function Globe3DContent({
  places,
  autoRotateSpeed,
  latLngToVector3,
  createArcPoints,
  enhanced = false,
  tripSaved = false,
}: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={0.95} color="#FFE9B0" />
      <pointLight position={[-5, -3, -5]} intensity={0.45} color="#34E0A1" />
      {enhanced && (
        <pointLight position={[3, 2, 3]} intensity={0.6} color="#F4C542" />
      )}

      <RotatingGlobe
        autoRotateSpeed={autoRotateSpeed}
        enhanced={enhanced}
        latLngToVector3={latLngToVector3}
      />
      <TripVisualization
        places={places}
        latLngToVector3={latLngToVector3}
        createArcPoints={createArcPoints}
        tripSaved={tripSaved}
      />

      {/* Atmosphere glow — inner */}
      <Sphere args={[1.04, 64, 64]}>
        <meshBasicMaterial
          color={enhanced ? "#F4C542" : "#34E0A1"}
          transparent
          opacity={enhanced ? 0.07 : 0.08}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Atmosphere glow — outer halo */}
      {enhanced && (
        <Sphere args={[1.12, 64, 64]}>
          <meshBasicMaterial
            color="#FFB865"
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </Sphere>
      )}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate={false}
      />
    </Canvas>
  );
}
