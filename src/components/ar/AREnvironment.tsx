import { useMemo } from 'react';
import { Environment, AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import { Religion } from '@/contexts/AppContext';
import * as THREE from 'three';

interface AREnvironmentProps {
  religion: Religion;
  color: string;
  unlocked: boolean;
}

// HDR environment presets by religion
const environmentPresets: Record<Religion, 'dawn' | 'sunset' | 'warehouse' | 'forest' | 'night' | 'apartment'> = {
  christianity: 'dawn',
  islam: 'sunset',
  judaism: 'apartment',
  buddhism: 'forest',
  hinduism: 'sunset',
  astronomy: 'night',
  traditional: 'warehouse',
  atheism: 'warehouse',
};

export const AREnvironment = ({ religion, color, unlocked }: AREnvironmentProps) => {
  const preset = environmentPresets[religion];

  // Create pedestal/altar materials
  const pedestalMaterial = useMemo(() => ({
    color: color,
    metalness: 0.3,
    roughness: 0.7,
    envMapIntensity: unlocked ? 1.5 : 0.5,
  }), [color, unlocked]);

  const decorativeMaterial = useMemo(() => ({
    color: color,
    metalness: 0.8,
    roughness: 0.2,
    envMapIntensity: unlocked ? 2 : 0.8,
    emissive: unlocked ? color : '#000000',
    emissiveIntensity: unlocked ? 0.3 : 0,
  }), [color, unlocked]);

  return (
    <>
      {/* HDR Environment lighting */}
      <Environment preset={preset} />
      
      {/* Pedestal/Altar */}
      <group position={[0, -2, 0]}>
        {/* Base tier */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[1.5, 1.8, 0.3, 32]} />
          <meshStandardMaterial {...pedestalMaterial} />
        </mesh>
        
        {/* Middle tier */}
        <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
          <cylinderGeometry args={[1.2, 1.4, 0.25, 32]} />
          <meshStandardMaterial {...pedestalMaterial} />
        </mesh>
        
        {/* Top tier */}
        <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
          <cylinderGeometry args={[1, 1.15, 0.2, 32]} />
          <meshStandardMaterial {...pedestalMaterial} />
        </mesh>

        {/* Decorative ring (only when unlocked) */}
        {unlocked && (
          <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
            <torusGeometry args={[1.05, 0.05, 16, 64]} />
            <meshStandardMaterial {...decorativeMaterial} />
          </mesh>
        )}
      </group>

      {/* Soft accumulated shadows */}
      <AccumulativeShadows
        temporal
        frames={100}
        color={color}
        colorBlend={0.5}
        opacity={0.8}
        scale={10}
        position={[0, -1.99, 0]}
      >
        <RandomizedLight
          amount={8}
          radius={4}
          ambient={0.5}
          intensity={1}
          position={[5, 5, -10]}
          bias={0.001}
        />
      </AccumulativeShadows>

      {/* Ground plane for reflections */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.1}
          roughness={0.9}
          envMapIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>
    </>
  );
};
