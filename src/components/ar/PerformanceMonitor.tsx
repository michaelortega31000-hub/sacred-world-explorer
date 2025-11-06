import { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface PerformanceMonitorProps {
  visible?: boolean;
}

export const PerformanceMonitor = ({ visible = true }: PerformanceMonitorProps) => {
  const [fps, setFps] = useState(60);
  const [lowFpsWarning, setLowFpsWarning] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);

  const fpsHistoryRef = useRef<number[]>([]);
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    frameCountRef.current++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;

    if (deltaTime >= 1000) {
      const currentFps = Math.round((frameCountRef.current * 1000) / deltaTime);
      setFps(currentFps);

      fpsHistoryRef.current.push(currentFps);
      if (fpsHistoryRef.current.length > 3) fpsHistoryRef.current.shift();

      // Check for sustained low FPS
      const avgFps = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
      setLowFpsWarning(avgFps < 20);

      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }
  });

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const estimateBatteryDrain = (duration: number): string => {
    // Rough estimate: AR uses ~10-15% battery per hour
    const drainPerMinute = 0.2; // 12% per hour
    const estimatedDrain = (duration / 60) * drainPerMinute;
    return `~${estimatedDrain.toFixed(1)}%`;
  };

  const getFpsColor = (fps: number): string => {
    if (fps >= 50) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!visible) return null;

  return (
    <>
      {/* Performance stats overlay */}
      <div className="absolute top-20 right-4 pointer-events-none z-10">
        <Card className="bg-background/70 backdrop-blur-sm border-primary/20 p-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">FPS:</span>
              <span className={`font-bold ${getFpsColor(fps)}`}>{fps}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Durée:</span>
              <span className="font-medium">{formatDuration(sessionDuration)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Batterie:</span>
              <span className="font-medium">
                {estimateBatteryDrain(sessionDuration)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Low FPS warning */}
      {lowFpsWarning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <Card className="bg-yellow-500/90 backdrop-blur-sm border-yellow-600 p-3">
            <div className="flex items-center gap-2 text-yellow-950">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Performance réduite détectée
              </span>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

// Separate component for use outside Canvas
export const PerformanceStats = ({
  fps,
  duration,
  visible = true,
}: {
  fps: number;
  duration: number;
  visible?: boolean;
}) => {
  if (!visible) return null;

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const estimateBatteryDrain = (duration: number): string => {
    const drainPerMinute = 0.2;
    const estimatedDrain = (duration / 60) * drainPerMinute;
    return `~${estimatedDrain.toFixed(1)}%`;
  };

  const getFpsColor = (fps: number): string => {
    if (fps >= 50) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="bg-background/70 backdrop-blur-sm border-primary/20 p-3 text-xs">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">FPS:</span>
          <span className={`font-bold ${getFpsColor(fps)}`}>{fps}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Durée:</span>
          <span className="font-medium">{formatDuration(duration)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Batterie:</span>
          <span className="font-medium">{estimateBatteryDrain(duration)}</span>
        </div>
      </div>
    </Card>
  );
};
