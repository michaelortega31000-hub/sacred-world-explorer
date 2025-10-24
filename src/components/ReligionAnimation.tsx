import { useEffect, useState } from 'react';
import { useApp, Religion } from '@/contexts/AppContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import crescentImg from '@/assets/animations/crescent.png';
import starDavidImg from '@/assets/animations/star-david.png';
import lotusImg from '@/assets/animations/lotus.png';
import omImg from '@/assets/animations/om.png';
import starsImg from '@/assets/animations/stars.png';
import spiritImg from '@/assets/animations/spirit.png';

// Composant Ange 3D
const Angel3D = ({ radius, index, delay }: { radius: number; index: number; delay: number }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const startTime = Date.now() + delay * 1000;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 0) {
        setTime(elapsed);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [delay]);

  // Position orbitale - 7 secondes par tour, 2 tours = 14 secondes
  const angle = (time * Math.PI * 2) / 7; // 7 secondes pour un tour complet
  const x = Math.cos(angle + (index * Math.PI * 2) / 4) * radius;
  const z = Math.sin(angle + (index * Math.PI * 2) / 4) * radius;
  const y = Math.sin(time * 2) * 0.3; // Mouvement vertical léger

  // Opacité de fade in/out - dure 16 secondes pour 2 tours complets
  const opacity = time < 0.5 ? time * 2 : time > 15 ? (16 - time) * 2 : 1;

  if (time < 0 || time > 16) return null;

  return (
    <group position={[x, y, z]} rotation={[0, -angle, 0]}>
      {/* Robe / Tunique */}
      <mesh castShadow position={[0, -0.2, 0]}>
        <coneGeometry args={[0.6, 1.8, 16]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#FFE4B5"
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Corps supérieur */}
      <mesh castShadow position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.8, 16]} />
        <meshStandardMaterial 
          color="#FFFACD" 
          emissive="#FFD700"
          emissiveIntensity={0.2}
          metalness={0.5}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Tête */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial 
          color="#FFE4C4" 
          emissive="#FFE4B5"
          emissiveIntensity={0.15}
          metalness={0.1}
          roughness={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Bras gauche */}
      <mesh position={[-0.45, 0.5, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 8]} />
        <meshStandardMaterial 
          color="#FFE4C4" 
          emissive="#FFE4B5"
          emissiveIntensity={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Bras droit */}
      <mesh position={[0.45, 0.5, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 8]} />
        <meshStandardMaterial 
          color="#FFE4C4" 
          emissive="#FFE4B5"
          emissiveIntensity={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Aile gauche - plus détaillée */}
      <group position={[-0.15, 0.6, -0.2]} rotation={[0, -Math.PI / 6, Math.PI / 6 + Math.sin(time * 3) * 0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 1.4, 0.9]} />
          <MeshDistortMaterial 
            color="#FFFFFF" 
            emissive="#FFD700"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.1}
            distort={0.2}
            speed={2}
            transparent
            opacity={opacity * 0.95}
          />
        </mesh>
        {/* Plumes de l'aile gauche */}
        <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 8]} castShadow>
          <boxGeometry args={[0.05, 1.2, 0.7]} />
          <MeshDistortMaterial 
            color="#F5F5DC" 
            emissive="#FFD700"
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.2}
            distort={0.25}
            speed={1.5}
            transparent
            opacity={opacity * 0.85}
          />
        </mesh>
      </group>

      {/* Aile droite - plus détaillée */}
      <group position={[0.15, 0.6, -0.2]} rotation={[0, Math.PI / 6, -Math.PI / 6 - Math.sin(time * 3) * 0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 1.4, 0.9]} />
          <MeshDistortMaterial 
            color="#FFFFFF" 
            emissive="#FFD700"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.1}
            distort={0.2}
            speed={2}
            transparent
            opacity={opacity * 0.95}
          />
        </mesh>
        {/* Plumes de l'aile droite */}
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
          <boxGeometry args={[0.05, 1.2, 0.7]} />
          <MeshDistortMaterial 
            color="#F5F5DC" 
            emissive="#FFD700"
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.2}
            distort={0.25}
            speed={1.5}
            transparent
            opacity={opacity * 0.85}
          />
        </mesh>
      </group>

      {/* Halo */}
      <mesh position={[0, 1.7, 0]} rotation={[Math.PI / 2, 0, time * 2]}>
        <torusGeometry args={[0.3, 0.04, 12, 32]} />
        <meshStandardMaterial 
          color="#FFFACD" 
          emissive="#FFD700"
          emissiveIntensity={1}
          metalness={1}
          roughness={0}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Auréole intérieure */}
      <mesh position={[0, 1.7, 0]} rotation={[Math.PI / 2, 0, -time * 3]}>
        <torusGeometry args={[0.22, 0.02, 8, 24]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive="#FFFACD"
          emissiveIntensity={1.2}
          transparent
          opacity={opacity * 0.8}
        />
      </mesh>

      {/* Lumière principale qui suit l'ange */}
      <pointLight 
        color="#FFD700" 
        intensity={opacity * 3} 
        distance={6} 
        decay={2}
      />
      
      {/* Lumière secondaire pour le halo */}
      <pointLight 
        position={[0, 1.7, 0]}
        color="#FFFACD" 
        intensity={opacity * 1.5} 
        distance={3} 
        decay={2}
      />
    </group>
  );
};

interface ReligionAnimationConfig {
  image: string;
  count: number;
  size: string;
  animationClass: string;
}

const getReligionAnimation = (religion: Religion | null): ReligionAnimationConfig | '3d-angels' => {
  switch (religion) {
    case 'christianity':
      return '3d-angels';
    case 'islam':
      return {
        image: crescentImg,
        count: 4,
        size: 'w-20 h-20',
        animationClass: 'animate-crescent-float'
      };
    case 'judaism':
      return {
        image: starDavidImg,
        count: 3,
        size: 'w-20 h-20',
        animationClass: 'animate-star-rotate'
      };
    case 'buddhism':
      return {
        image: lotusImg,
        count: 4,
        size: 'w-24 h-24',
        animationClass: 'animate-lotus-float'
      };
    case 'hinduism':
      return {
        image: omImg,
        count: 3,
        size: 'w-24 h-24',
        animationClass: 'animate-om-pulse'
      };
    case 'astronomy':
      return {
        image: starsImg,
        count: 5,
        size: 'w-16 h-16',
        animationClass: 'animate-stars-twinkle'
      };
    default:
      return {
        image: spiritImg,
        count: 3,
        size: 'w-20 h-20',
        animationClass: 'animate-spirit-glow'
      };
  }
};

export const ReligionAnimation = () => {
  const { userProgress } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const config = getReligionAnimation(userProgress.selectedReligion);

  useEffect(() => {
    // Afficher l'animation 3 secondes après le montage
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Masquer l'animation après 19 secondes (3s + 16s d'animation)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 19000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  // Animation 3D pour les anges
  if (config === '3d-angels') {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{ alpha: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-10, -10, -5]} intensity={0.6} />
          <directionalLight position={[0, 5, -10]} intensity={0.4} />
          
          {/* 4 anges tournant autour du globe à différentes altitudes */}
          <Angel3D radius={3.2} index={0} delay={0} />
          <Angel3D radius={3.8} index={1} delay={0.4} />
          <Angel3D radius={4.2} index={2} delay={0.8} />
          <Angel3D radius={4.8} index={3} delay={1.2} />
        </Canvas>
      </div>
    );
  }

  // Animation 2D pour les autres religions
  if (typeof config === 'object') {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" style={{ perspective: '1000px' }}>
        {Array.from({ length: config.count }).map((_, index) => {
          const delay = index * 0.3;
          const topPosition = 20 + (index * 15);
          
          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`${config.size} ${config.animationClass}`}
                style={{
                  ['--orbit-radius' as any]: `${28 + index * 6}vh`,
                  animationDelay: `${delay}s`,
                  opacity: 0.95,
                  mixBlendMode: 'screen',
                  filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
                  transformStyle: 'preserve-3d'
                }}
              >
                <img 
                  src={config.image} 
                  alt=""
                  className="w-full h-full object-contain"
                  style={{
                    filter: 'brightness(1.3) contrast(1.2) drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))',
                    transformStyle: 'preserve-3d'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
