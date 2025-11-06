import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Religion } from '@/contexts/AppContext';
import { religionColors } from '@/config/religionColors';
import { SymbolGeometry } from './ar/SymbolGeometry';
import { ParticleSystem } from './ar/ParticleSystem';
import { LightingSystem } from './ar/LightingSystem';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';

interface ReligiousSymbol3DProps {
  religion: Religion;
  unlocked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  intensity?: number;
  useDeviceOrientation?: boolean;
}

interface SymbolSceneProps {
  religion: Religion;
  unlocked: boolean;
  intensity: number;
  deviceOrientation: {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  } | null;
}

const SymbolScene = ({
  religion,
  unlocked,
  intensity,
  deviceOrientation,
}: SymbolSceneProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));

  // Update target rotation based on device orientation
  useEffect(() => {
    if (deviceOrientation && deviceOrientation.beta !== null && deviceOrientation.gamma !== null) {
      // Convert device orientation to radians
      const betaRad = THREE.MathUtils.degToRad(deviceOrientation.beta || 0);
      const gammaRad = THREE.MathUtils.degToRad(deviceOrientation.gamma || 0);
      
      targetRotation.current.set(
        betaRad * 0.5,  // Reduced sensitivity for smoother movement
        gammaRad * 0.5,
        0
      );
    }
  }, [deviceOrientation]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();

    if (deviceOrientation && deviceOrientation.beta !== null) {
      // Smooth interpolation to target rotation
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        0.1
      );
    } else {
      // Auto-rotation when no device orientation
      groupRef.current.rotation.y = time * 0.3;
      groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }

    // Float effect
    groupRef.current.position.y = Math.sin(time * 1.5) * 0.3;

    // Pulsating scale
    const scale = 1 + Math.sin(time * 2) * 0.05;
    groupRef.current.scale.setScalar(scale);
  });

  const color = religionColors[religion]?.marker || '#ffffff';

  return (
    <>
      <LightingSystem color={color} intensity={intensity} unlocked={unlocked} />
      
      <group ref={groupRef}>
        <SymbolGeometry religion={religion} color={color} unlocked={unlocked} />
      </group>

      <ParticleSystem count={50} color={color} unlocked={unlocked} />
    </>
  );
};

export const ReligiousSymbol3D = ({
  religion,
  unlocked = false,
  size = 'md',
  intensity = 50,
  useDeviceOrientation: enableDeviceOrientation = false,
}: ReligiousSymbol3DProps) => {
  const orientation = useDeviceOrientation(enableDeviceOrientation);

  const sizeMap = {
    sm: '200px',
    md: '300px',
    lg: '400px',
  };

  const deviceOrientationData = enableDeviceOrientation && orientation.hasPermission
    ? {
        alpha: orientation.alpha,
        beta: orientation.beta,
        gamma: orientation.gamma,
      }
    : null;

  return (
    <div
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        margin: '0 auto',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <SymbolScene
            religion={religion}
            unlocked={unlocked}
            intensity={intensity}
            deviceOrientation={deviceOrientationData}
          />
          {!enableDeviceOrientation && <OrbitControls enableZoom={false} />}
        </Suspense>
      </Canvas>
    </div>
  );
};
