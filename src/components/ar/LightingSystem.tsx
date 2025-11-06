import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LightingSystemProps {
  color: string;
  intensity: number;
  unlocked: boolean;
}

export const LightingSystem = ({ color, intensity, unlocked }: LightingSystemProps) => {
  const pointLight1Ref = useRef<THREE.PointLight>(null);
  const pointLight2Ref = useRef<THREE.PointLight>(null);
  const pointLight3Ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Orbit lights around the symbol
    if (pointLight1Ref.current) {
      pointLight1Ref.current.position.x = Math.cos(time) * 3;
      pointLight1Ref.current.position.z = Math.sin(time) * 3;
    }

    if (pointLight2Ref.current) {
      pointLight2Ref.current.position.x = Math.cos(time + Math.PI * 0.66) * 3;
      pointLight2Ref.current.position.z = Math.sin(time + Math.PI * 0.66) * 3;
    }

    if (pointLight3Ref.current) {
      pointLight3Ref.current.position.x = Math.cos(time + Math.PI * 1.33) * 3;
      pointLight3Ref.current.position.z = Math.sin(time + Math.PI * 1.33) * 3;
    }
  });

  const normalizedIntensity = intensity / 100;
  const lightIntensity = unlocked ? normalizedIntensity * 2 : normalizedIntensity * 0.5;

  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.3} />

      {/* Main directional light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color={color}
        castShadow
      />

      {/* Orbiting point lights */}
      <pointLight
        ref={pointLight1Ref}
        position={[3, 2, 0]}
        intensity={lightIntensity}
        color={color}
        distance={10}
        decay={2}
      />
      <pointLight
        ref={pointLight2Ref}
        position={[-3, 2, 0]}
        intensity={lightIntensity}
        color={color}
        distance={10}
        decay={2}
      />
      <pointLight
        ref={pointLight3Ref}
        position={[0, 2, 3]}
        intensity={lightIntensity}
        color={color}
        distance={10}
        decay={2}
      />

      {/* Spotlight from above (only when unlocked) */}
      {unlocked && (
        <spotLight
          position={[0, 8, 0]}
          angle={0.3}
          penumbra={0.5}
          intensity={lightIntensity * 1.5}
          color={color}
          castShadow
        />
      )}
    </>
  );
};
