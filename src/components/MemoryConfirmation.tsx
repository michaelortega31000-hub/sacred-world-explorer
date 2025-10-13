import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface MemoryConfirmationProps {
  onClose: () => void;
}

export const MemoryConfirmation = ({ onClose }: MemoryConfirmationProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
      <Card className="w-[90%] max-w-md p-8 bg-card/90 border-primary/20 shadow-halo gold-halo breathing-glow float-up">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <CheckCircle2 className="w-16 h-16 text-primary pulse-halo" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-foreground">
              Memory Added
            </h3>
            <p className="text-muted-foreground">
              Your memory has been added to your journey.
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:scale-105 transition-transform shadow-turquoise"
          >
            Continue Exploring
          </button>
        </div>
      </Card>
    </div>
  );
};
