import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface PostProcessingEffectsProps {
  unlocked: boolean;
  intensity: number;
  enableEffects?: boolean;
}

export const PostProcessingEffects = ({ 
  unlocked, 
  intensity,
  enableEffects = true 
}: PostProcessingEffectsProps) => {
  if (!enableEffects) return null;

  // Normalize intensity from 0-100 to 0-1
  const normalizedIntensity = intensity / 100;
  
  // Stronger, more cinematic effects when unlocked
  const bloomIntensity = unlocked ? normalizedIntensity * 2.5 : normalizedIntensity * 0.8;
  const dofStrength = unlocked ? 0.03 : 0.015;
  const chromaticAberrationStrength = unlocked ? 0.004 : 0.002;

  return (
    <EffectComposer multisampling={8}>
      {/* Bloom effect - creates glowing halos around bright areas */}
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.95}
        radius={1.0}
        mipmapBlur
      />
      
      {/* Depth of Field - creates focus blur effect */}
      <DepthOfField
        focusDistance={0.0}
        focalLength={0.05}
        bokehScale={dofStrength}
        height={480}
      />
      
      {/* Chromatic Aberration - subtle color fringing for realism */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[chromaticAberrationStrength, chromaticAberrationStrength]}
      />
      
      {/* Vignette - darkens edges for cinematic feel */}
      <Vignette
        offset={0.3}
        darkness={0.5}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
};
