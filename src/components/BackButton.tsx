import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  to?: string;
}

export const BackButton = ({ to = '/world' }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className="group relative text-foreground hover:text-primary transition-all duration-300 hover:scale-110 bg-background/80 backdrop-blur-sm border border-primary/20 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(52,224,161,0.4)]"
      >
        <ArrowLeft className="h-6 w-6 transition-transform duration-300 group-hover:-translate-x-1" />
        <div className="absolute inset-0 rounded-md bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
      </Button>
    </div>
  );
};
