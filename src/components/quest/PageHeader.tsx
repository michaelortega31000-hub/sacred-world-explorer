import type { ReactNode } from 'react';

interface Props {
  emblem: ReactNode;
  title: string;
  subtitle: string;
}

// Shared page-header — used across Journal, Planner, Profile sub-sections.
// Thematic emblem → gold-gradient Cinzel title → sacred beam divider → label.
export const PageHeader = ({ emblem, title, subtitle }: Props) => (
  <div className="flex flex-col items-center px-6 pt-10 sm:pt-12 text-center">
    {/* Ambient halo behind the emblem */}
    <div className="relative flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(244,197,66,0.22) 0%, transparent 70%)',
          filter: 'blur(20px)',
          transform: 'scale(1.8)',
        }}
      />
      <div className="relative">{emblem}</div>
    </div>

    {/* Beam divider between emblem and title */}
    <div className="sacred-beam-divider mt-3 mb-2" />

    <h1
      className="text-3xl sm:text-4xl font-bold tracking-tight font-cinzel sacred-title-glow"
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F4C542 55%, #E0A84C 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {title}
    </h1>

    <p className="mt-2 sacred-label opacity-80">{subtitle}</p>
  </div>
);
