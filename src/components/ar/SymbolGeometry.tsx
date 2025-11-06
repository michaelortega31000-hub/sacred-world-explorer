import { useMemo } from 'react';
import * as THREE from 'three';
import { Religion } from '@/contexts/AppContext';

interface SymbolGeometryProps {
  religion: Religion;
  color: string;
  unlocked: boolean;
}

export const SymbolGeometry = ({ religion, color, unlocked }: SymbolGeometryProps) => {
  const geometry = useMemo(() => {
    switch (religion) {
      case 'christianity':
        // Cross shape using BoxGeometry
        return (
          <group>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.3, 1.5, 0.2]} />
              <meshStandardMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
                emissive={unlocked ? color : '#000000'}
                emissiveIntensity={unlocked ? 0.5 : 0}
              />
            </mesh>
            <mesh position={[0, 0.7, 0]}>
              <boxGeometry args={[1, 0.3, 0.2]} />
              <meshStandardMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
                emissive={unlocked ? color : '#000000'}
                emissiveIntensity={unlocked ? 0.5 : 0}
              />
            </mesh>
          </group>
        );

      case 'islam':
        // Crescent and star
        return (
          <group>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <torusGeometry args={[0.6, 0.2, 16, 32, Math.PI * 1.5]} />
              <meshStandardMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
                emissive={unlocked ? color : '#000000'}
                emissiveIntensity={unlocked ? 0.5 : 0}
              />
            </mesh>
            <mesh position={[0.4, 0.4, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
                emissive={unlocked ? color : '#000000'}
                emissiveIntensity={unlocked ? 0.5 : 0}
              />
            </mesh>
          </group>
        );

      case 'buddhism':
        // Lotus flower (simplified)
        return (
          <group>
            <mesh>
              <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color={color}
                metalness={0.6}
                roughness={0.3}
                emissive={unlocked ? color : '#000000'}
                emissiveIntensity={unlocked ? 0.4 : 0}
              />
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
              >
                <coneGeometry args={[0.3, 0.6, 8]} />
                <meshStandardMaterial
                  color={color}
                  metalness={0.6}
                  roughness={0.3}
                  emissive={unlocked ? color : '#000000'}
                  emissiveIntensity={unlocked ? 0.4 : 0}
                />
              </mesh>
            ))}
          </group>
        );

      case 'hinduism':
        // Om symbol (simplified as torus with sphere)
        return (
          <group>
            <mesh>
              <torusGeometry args={[0.6, 0.15, 16, 32]} />
              <meshStandardMaterial
                color={color}
                metalness={0.7}
                roughness={0.3}
                emissive={unlocked ? color : '#000000'}
                emissiveIntensity={unlocked ? 0.5 : 0}
              />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.25, 32, 32]} />
              <meshStandardMaterial
                color={color}
                metalness={0.7}
                roughness={0.3}
                emissive={unlocked ? color : '#000000'}
                emissiveIntensity={unlocked ? 0.5 : 0}
              />
            </mesh>
          </group>
        );

      case 'judaism':
        // Star of David
        return (
          <group>
            <mesh rotation={[0, 0, 0]}>
              <coneGeometry args={[0.8, 0.3, 3]} />
              <meshStandardMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
                emissive={unlocked ? color : '#000000'}
                emissiveIntensity={unlocked ? 0.5 : 0}
              />
            </mesh>
            <mesh rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.8, 0.3, 3]} />
              <meshStandardMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
                emissive={unlocked ? color : '#000000'}
                emissiveIntensity={unlocked ? 0.5 : 0}
              />
            </mesh>
          </group>
        );

      default:
        // Default sphere
        return (
          <mesh>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial
              color={color}
              metalness={0.7}
              roughness={0.3}
              emissive={unlocked ? color : '#000000'}
              emissiveIntensity={unlocked ? 0.4 : 0}
            />
          </mesh>
        );
    }
  }, [religion, color, unlocked]);

  return <>{geometry}</>;
};
