import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Religion } from '@/contexts/AppContext';
import { religionColors } from '@/config/religionColors';
import { SymbolGeometry } from './ar/SymbolGeometry';
import { ParticleSystem } from './ar/ParticleSystem';
import { LightingSystem } from './ar/LightingSystem';
import { PostProcessingEffects } from './ar/PostProcessingEffects';
import { PerformanceMonitor } from './ar/PerformanceMonitor';
import { AREnvironment } from './ar/AREnvironment';
import { QualityPresets, QUALITY_PRESETS, type QualityLevel } from './ar/QualityPresets';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';
import { useARGestures } from '@/hooks/useARGestures';
import { Button } from '@/components/ui/button';
import { RotateCcw, SparklesIcon } from 'lucide-react';
import { hapticFeedback } from '@/hooks/useARGestures';

interface ReligiousSymbol3DProps {
  religion: Religion;
  unlocked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  intensity?: number;
  useDeviceOrientation?: boolean;
  enablePostProcessing?: boolean;
  showPerformance?: boolean;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

interface SymbolSceneProps {
  religion: Religion;
  unlocked: boolean;
  intensity: number;
  enablePostProcessing: boolean;
  particleCount: number;
  deviceOrientation: {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  } | null;
  manualRotation: { x: number; y: number };
  manualScale: number;
}

const SymbolScene = ({
  religion,
  unlocked,
  intensity,
  enablePostProcessing,
  particleCount,
  deviceOrientation,
  manualRotation,
  manualScale,
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
      // Smooth interpolation to target rotation + manual rotation
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x + manualRotation.x,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y + manualRotation.y,
        0.1
      );
    } else {
      // Auto-rotation when no device orientation + manual rotation
      groupRef.current.rotation.y = time * 0.3 + manualRotation.y;
      groupRef.current.rotation.x = Math.sin(time * 0.5) * 0.2 + manualRotation.x;
    }

    // Float effect
    groupRef.current.position.y = Math.sin(time * 1.5) * 0.3;

    // Pulsating scale + manual scale
    const baseScale = 1 + Math.sin(time * 2) * 0.05;
    groupRef.current.scale.setScalar(baseScale * manualScale);
  });

  const color = religionColors[religion]?.marker || '#ffffff';

  return (
    <>
      <AREnvironment religion={religion} color={color} unlocked={unlocked} />
      <LightingSystem color={color} intensity={intensity} unlocked={unlocked} />
      
      <group ref={groupRef}>
        <SymbolGeometry religion={religion} color={color} unlocked={unlocked} />
      </group>

      <ParticleSystem count={particleCount} color={color} unlocked={unlocked} />
      
      <PostProcessingEffects 
        unlocked={unlocked} 
        intensity={intensity}
        enableEffects={enablePostProcessing}
      />
    </>
  );
};

export const ReligiousSymbol3D = ({
  religion,
  unlocked = false,
  size = 'md',
  intensity = 50,
  useDeviceOrientation: enableDeviceOrientation = false,
  enablePostProcessing = true,
  showPerformance = false,
  onCanvasReady,
}: ReligiousSymbol3DProps) => {
  const orientation = useDeviceOrientation(enableDeviceOrientation);
  const [effectsEnabled, setEffectsEnabled] = useState(enablePostProcessing);
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>('balanced');
  const [manualRotation, setManualRotation] = useState({ x: 0, y: 0 });
  const [manualScale, setManualScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const qualitySettings = QUALITY_PRESETS[qualityLevel];

  // Handle gestures
  useARGestures(containerRef, {
    enabled: true,
    onRotate: (angle) => {
      setManualRotation((prev) => ({
        ...prev,
        y: prev.y + angle * 0.5,
      }));
    },
    onPinch: (scale) => {
      setManualScale(Math.max(0.5, Math.min(2, scale)));
    },
    onTap: () => {
      hapticFeedback('tap');
    },
    onLongPress: () => {
      hapticFeedback('success');
    },
  });

  const handleRecalibrate = () => {
    setManualRotation({ x: 0, y: 0 });
    setManualScale(1);
    hapticFeedback('success');
  };

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
    <div className="relative" ref={containerRef}>
      {/* Control buttons */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between gap-2 pointer-events-auto">
        <QualityPresets
          currentQuality={qualityLevel}
          onQualityChange={setQualityLevel}
        />
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
            onClick={handleRecalibrate}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Recalibrer
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
            onClick={() => setEffectsEnabled(!effectsEnabled)}
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            {effectsEnabled ? 'Effets ON' : 'Effets OFF'}
          </Button>
        </div>
      </div>

      <div
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          margin: '0 auto',
        }}
      >
        <Canvas
          shadows
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          onCreated={({ gl }) => {
            if (onCanvasReady) {
              onCanvasReady(gl.domElement);
            }
          }}
        >
          <Suspense fallback={null}>
            <SymbolScene
              religion={religion}
              unlocked={unlocked}
              intensity={intensity}
              enablePostProcessing={effectsEnabled && qualitySettings.enablePostProcessing}
              particleCount={qualitySettings.particleCount}
              deviceOrientation={deviceOrientationData}
              manualRotation={manualRotation}
              manualScale={manualScale}
            />
            {!enableDeviceOrientation && <OrbitControls enableZoom={false} />}
            {showPerformance && <PerformanceMonitor />}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};
