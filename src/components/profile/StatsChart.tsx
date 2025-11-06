import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface StatsChartProps {
  data: Array<{ date: string; points: number }>;
  title: string;
}

export const StatsChart = ({ data, title }: StatsChartProps) => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="points" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            fill="url(#colorPoints)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
