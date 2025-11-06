import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings } from 'lucide-react';

export type QualityLevel = 'economy' | 'balanced' | 'high' | 'ultra';

export interface QualitySettings {
  particleCount: number;
  enablePostProcessing: boolean;
  enableShadows: boolean;
  targetFPS: number;
  bloomIntensity: number;
  label: string;
}

export const QUALITY_PRESETS: Record<QualityLevel, QualitySettings> = {
  economy: {
    particleCount: 10,
    enablePostProcessing: false,
    enableShadows: false,
    targetFPS: 30,
    bloomIntensity: 0.3,
    label: 'Économie',
  },
  balanced: {
    particleCount: 30,
    enablePostProcessing: true,
    enableShadows: false,
    targetFPS: 45,
    bloomIntensity: 0.5,
    label: 'Équilibré',
  },
  high: {
    particleCount: 50,
    enablePostProcessing: true,
    enableShadows: true,
    targetFPS: 60,
    bloomIntensity: 0.8,
    label: 'Haute',
  },
  ultra: {
    particleCount: 100,
    enablePostProcessing: true,
    enableShadows: true,
    targetFPS: 60,
    bloomIntensity: 1.0,
    label: 'Ultra',
  },
};

interface QualityPresetsProps {
  currentQuality: QualityLevel;
  onQualityChange: (quality: QualityLevel) => void;
}

export const QualityPresets = ({
  currentQuality,
  onQualityChange,
}: QualityPresetsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          <Settings className="w-4 h-4 mr-2" />
          {QUALITY_PRESETS[currentQuality].label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {(Object.keys(QUALITY_PRESETS) as QualityLevel[]).map((level) => (
          <DropdownMenuItem
            key={level}
            onClick={() => onQualityChange(level)}
            className={currentQuality === level ? 'bg-primary/10' : ''}
          >
            <div className="flex items-center justify-between w-full">
              <span>{QUALITY_PRESETS[level].label}</span>
              {currentQuality === level && <span className="text-primary">✓</span>}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
