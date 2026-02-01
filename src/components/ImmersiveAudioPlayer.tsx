import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Download, 
  Headphones,
  Loader2,
  Music,
  Mic2,
  Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useImmersiveAudioGuide } from '@/hooks/useImmersiveAudioGuide';
import { Religion } from '@/contexts/AppContext';

interface ImmersiveAudioPlayerProps {
  text: string;
  placeId: string;
  placeName: string;
  placeType?: string;
  religion?: Religion;
  className?: string;
  compact?: boolean;
}

const ImmersiveAudioPlayer: React.FC<ImmersiveAudioPlayerProps> = ({
  text,
  placeId,
  placeName,
  placeType,
  religion,
  className,
  compact = false,
}) => {
  const [narrationVolume, setNarrationVolumeState] = useState(0.85);
  const [ambientVolume, setAmbientVolumeState] = useState(0.12);
  const [muted, setMuted] = useState(false);

  const {
    state,
    play,
    pause,
    resume,
    stop,
    seek,
    download,
    setNarrationVolume,
    setAmbientVolume,
  } = useImmersiveAudioGuide();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (state.isPlaying) {
      pause();
    } else if (state.isPaused) {
      resume();
    } else {
      play(text, placeId, placeType, religion);
    }
  };

  const handleNarrationVolumeChange = (value: number[]) => {
    const vol = value[0];
    setNarrationVolumeState(vol);
    setNarrationVolume(vol);
  };

  const handleAmbientVolumeChange = (value: number[]) => {
    const vol = value[0];
    setAmbientVolumeState(vol);
    setAmbientVolume(vol);
  };

  const toggleMute = () => {
    setMuted(!muted);
    setNarrationVolume(muted ? narrationVolume : 0);
    setAmbientVolume(muted ? ambientVolume : 0);
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayPause}
          disabled={state.isLoading}
          className="h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20"
        >
          {state.isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : state.isPlaying ? (
            <Pause className="w-4 h-4 text-primary" />
          ) : (
            <Headphones className="w-4 h-4 text-primary" />
          )}
        </Button>
        {(state.isPlaying || state.isPaused) && (
          <div className="flex-1 max-w-32">
            <Progress value={state.progress} className="h-1" />
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={cn(
      "border-border/50 bg-gradient-to-br from-card/80 via-card to-primary/5 backdrop-blur-sm overflow-hidden",
      state.isPlaying && "ring-2 ring-primary/30",
      className
    )}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              state.isPlaying 
                ? "bg-primary animate-pulse" 
                : "bg-primary/20"
            )}>
              <Headphones className={cn(
                "w-5 h-5",
                state.isPlaying ? "text-primary-foreground" : "text-primary"
              )} />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">Audioguide Immersif</h4>
              <p className="text-xs text-muted-foreground">
                {state.isPlaying ? 'En lecture...' : state.isPaused ? 'En pause' : 'Prêt'}
              </p>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-1.5">
            {state.ambientPlaying && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1 bg-accent/10 border-accent/30">
                <Music className="w-2.5 h-2.5" />
                Ambiance
              </Badge>
            )}
            {state.narrationPlaying && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1 bg-primary/10 border-primary/30">
                <Mic2 className="w-2.5 h-2.5" />
                Narration
              </Badge>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div 
            className="relative h-2 bg-muted rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              const time = percent * state.duration;
              seek(time);
            }}
          >
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-100"
              style={{ width: `${state.progress}%` }}
            />
            {/* Playhead */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg transition-all duration-100"
              style={{ left: `calc(${state.progress}% - 6px)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <Button
              variant="default"
              size="icon"
              onClick={handlePlayPause}
              disabled={state.isLoading}
              className="h-10 w-10 rounded-full"
            >
              {state.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : state.isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>

            {/* Stop */}
            <Button
              variant="ghost"
              size="icon"
              onClick={stop}
              disabled={!state.isPlaying && !state.isPaused}
              className="h-9 w-9 rounded-full"
            >
              <Square className="w-4 h-4" />
            </Button>

            {/* Mute toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-9 w-9 rounded-full"
            >
              {muted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Volume settings */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Settings2 className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs flex items-center gap-1.5">
                        <Mic2 className="w-3 h-3" />
                        Narration
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(narrationVolume * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[narrationVolume]}
                      onValueChange={handleNarrationVolumeChange}
                      max={1}
                      step={0.05}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs flex items-center gap-1.5">
                        <Music className="w-3 h-3" />
                        Ambiance
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(ambientVolume * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[ambientVolume]}
                      onValueChange={handleAmbientVolumeChange}
                      max={0.3}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Download */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => download(placeName)}
              className="h-9 w-9 rounded-full"
              title="Télécharger l'audioguide"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Error display */}
        {state.error && (
          <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-xs text-destructive">{state.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImmersiveAudioPlayer;
