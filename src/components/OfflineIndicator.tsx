import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
  showOnlineState?: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ 
  className,
  showOnlineState = false 
}) => {
  const { isOnline, effectiveType } = useNetworkStatus();

  // Don't show anything if online and showOnlineState is false
  if (isOnline && !showOnlineState) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
        isOnline 
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse',
        className
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span>En ligne</span>
          {effectiveType && (
            <span className="opacity-70">({effectiveType})</span>
          )}
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5" />
          <span>Mode hors-ligne</span>
        </>
      )}
    </div>
  );
};
