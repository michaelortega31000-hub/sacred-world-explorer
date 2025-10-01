import { Headphones, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AudioImmersiveIconProps {
  isPremium?: boolean;
  onClick?: () => void;
}

const AudioImmersiveIcon = ({ isPremium = false, onClick }: AudioImmersiveIconProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={`relative ${isPremium ? 'border-[hsl(45,100%,51%)] text-[hsl(45,100%,51%)] hover:bg-[hsl(45,100%,51%)]/10' : 'opacity-50'}`}
            onClick={onClick}
            disabled={!isPremium}
          >
            <Headphones className="w-4 h-4" />
            {!isPremium && (
              <Lock className="w-3 h-3 absolute -top-1 -right-1 text-accent" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isPremium ? 'Mode audio immersif' : 'Premium requis 👑'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AudioImmersiveIcon;