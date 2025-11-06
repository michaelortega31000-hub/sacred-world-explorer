import { useMemo } from 'react';
import * as THREE from 'three';
import { Religion } from '@/contexts/AppContext';

interface SymbolGeometryProps {
  religion: Religion;
  color: string;
  unlocked: boolean;
}

export const SymbolGeometry = ({ religion, color, unlocked }: SymbolGeometryProps) => {
  // Shared PBR material properties
  const materialProps = useMemo(() => ({
    color: color,
    metalness: 0.8,
    roughness: 0.2,
    envMapIntensity: unlocked ? 2 : 1,
    emissive: unlocked ? color : '#000000',
    emissiveIntensity: unlocked ? 0.5 : 0,
    clearcoat: unlocked ? 0.5 : 0,
    clearcoatRoughness: 0.2,
  }), [color, unlocked]);

  const geometry = useMemo(() => {
    switch (religion) {
      case 'christianity':
        // Cross shape using BoxGeometry
        return (
          <group>
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.3, 1.5, 0.2]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
              <boxGeometry args={[1, 0.3, 0.2]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>
        );

      case 'islam':
        // Crescent and star
        return (
          <group>
            <mesh rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
              <torusGeometry args={[0.6, 0.2, 16, 32, Math.PI * 1.5]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0.4, 0.4, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>
        );

      case 'buddhism':
        // Lotus flower (simplified)
        return (
          <group>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <mesh
                key={i}
                rotation={[Math.PI / 4, (Math.PI * 2 * i) / 6, 0]}
                position={[
                  Math.cos((Math.PI * 2 * i) / 6) * 0.5,
                  0.2,
                  Math.sin((Math.PI * 2 * i) / 6) * 0.5,
                ]}
                castShadow
                receiveShadow
              >
                <coneGeometry args={[0.3, 0.6, 8]} />
                <meshStandardMaterial {...materialProps} />
              </mesh>
            ))}
          </group>
        );

      case 'hinduism':
        // Om symbol (simplified as torus with sphere)
        return (
          <group>
            <mesh castShadow receiveShadow>
              <torusGeometry args={[0.6, 0.15, 16, 32]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.25, 32, 32]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>
        );

      case 'judaism':
        // Star of David
        return (
          <group>
            <mesh rotation={[0, 0, 0]} castShadow receiveShadow>
              <coneGeometry args={[0.8, 0.3, 3]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
              <coneGeometry args={[0.8, 0.3, 3]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>
        );

      default:
        // Default sphere
        return (
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        );
    }
  }, [religion, color, unlocked, materialProps]);

  return <>{geometry}</>;
};
