import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ProgressRing } from './ProgressRing';

interface StatsCardProps {
  title: string;
  value: number;
  maxValue: number;
  icon: LucideIcon;
  description?: string;
}

export const StatsCard = ({ title, value, maxValue, icon: Icon, description }: StatsCardProps) => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
          <Icon className="w-8 h-8 text-primary" />
        </div>
      </div>
      <ProgressRing value={value} maxValue={maxValue} size={80} strokeWidth={6} />
    </Card>
  );
};
