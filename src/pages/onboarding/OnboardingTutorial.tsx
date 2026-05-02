import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Globe2, Sparkles, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { OnboardingLayout } from './OnboardingLayout';

const features = [
  {
    Icon: BookOpen,
    title: 'Apprendre',
    body: 'Quêtes quotidiennes, quiz et contenus adaptés à votre tradition.',
  },
  {
    Icon: Globe2,
    title: 'Explorer',
    body: 'Globe 3D des lieux sacrés et patrimoniaux, à portée de regard.',
  },
  {
    Icon: Sparkles,
    title: 'Pratiquer',
    body: 'Streaks doux, journal personnel, rappels respectueux de votre rythme.',
  },
  {
    Icon: Trophy,
    title: 'Vivre en communauté',
    body: 'Classements amis et communauté, défis hebdomadaires.',
  },
];

const OnboardingTutorial = () => {
  const navigate = useNavigate();
  const { session, refreshProfile } = useApp();
  const [submitting, setSubmitting] = useState(false);

  const finish = async () => {
    if (!session?.user) return;
    setSubmitting(true);
    await supabase
      .from('profiles')
      .update({ onboarded_at: new Date().toISOString() })
      .eq('id', session.user.id);
    await refreshProfile();
    setSubmitting(false);
    navigate('/home');
  };

  return (
    <OnboardingLayout
      step={4}
      title="Bienvenue dans Sacred World"
      subtitle="Voici ce qui vous attend."
    >
      <div className="grid grid-cols-2 gap-3">
        {features.map(({ Icon, title, body }) => (
          <Card
            key={title}
            className="bg-sacred-blue/70 border-primary/30 p-3 backdrop-blur-md shadow-lg"
          >
            <Icon className="w-5 h-5 text-primary mb-2" />
            <h4 className="text-sm font-semibold text-white leading-tight mb-1">
              {title}
            </h4>
            <p className="text-[11px] text-white/70 leading-snug">{body}</p>
          </Card>
        ))}
      </div>

      <Button
        onClick={finish}
        disabled={submitting}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.4)] mt-3"
      >
        Commencer
      </Button>
    </OnboardingLayout>
  );
};

export default OnboardingTutorial;
