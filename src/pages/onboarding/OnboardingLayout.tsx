import { ReactNode } from 'react';
import ChristianIcon from '@/components/ChristianIcon';

interface Props {
  step: 1 | 2 | 3 | 4;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const OnboardingLayout = ({ step, title, subtitle, children }: Props) => (
  <div
    className="min-h-screen w-full flex flex-col items-center justify-start px-4 py-8"
    style={{
      background:
        'linear-gradient(180deg, #0A1628 0%, #0E1B3F 40%, #1a3a52 80%, #0E1B3F 100%)',
    }}
  >
    <div className="relative mb-4">
      <div className="absolute inset-0 rounded-full blur-2xl bg-primary/40 animate-pulse" />
      <div className="relative">
        <ChristianIcon size="lg" />
      </div>
    </div>

    <div className="flex items-center gap-2 mb-4" aria-label={`Étape ${step} sur 4`}>
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={`h-1.5 w-8 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-white/20'}`}
        />
      ))}
    </div>

    <h1 className="font-cinzel text-2xl sm:text-3xl text-center text-white mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
      {title}
    </h1>
    {subtitle && (
      <p className="text-xs sm:text-sm text-white/70 text-center mb-6 max-w-md">
        {subtitle}
      </p>
    )}

    <div className="w-full max-w-md flex flex-col gap-3">{children}</div>
  </div>
);
