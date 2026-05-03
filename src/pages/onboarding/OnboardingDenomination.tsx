import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import type { DenominationRow, Track } from '@/types/track';
import { OnboardingLayout } from './OnboardingLayout';

// Visual fallback used when the denominations table isn't yet present
// (migrations not pushed). Mirrors the seed data so the rendered UI matches
// what the DB will return post-migration.
const FALLBACK_ROWS: DenominationRow[] = [
  { id: 'catholic',   code: 'catholic',   parent_id: null, label_fr: 'Catholique',          label_en: 'Catholic',   description_fr: "Tradition catholique : sacrements, saints, liturgie romaine, magistère.", description_en: '', display_order: 1, active: true },
  { id: 'protestant', code: 'protestant', parent_id: null, label_fr: 'Protestant',          label_en: 'Protestant', description_fr: "Familles protestantes et évangéliques : sola scriptura, prédication, communautés locales.", description_en: '', display_order: 2, active: true },
  { id: 'orthodox',   code: 'orthodox',   parent_id: null, label_fr: 'Orthodoxe',           label_en: 'Orthodox',   description_fr: "Traditions orthodoxes orientales : Pères de l'Église, divine liturgie, icônes.", description_en: '', display_order: 3, active: true },
  { id: 'heritage',   code: 'heritage',   parent_id: null, label_fr: 'Curieux & Patrimoine', label_en: 'Curious & Heritage', description_fr: "Pour les non-croyants intéressés par l'histoire, l'art et le patrimoine chrétiens.", description_en: '', display_order: 4, active: true },
];

const OnboardingDenomination = () => {
  const navigate = useNavigate();
  const { session } = useApp();
  const refreshProfile: () => Promise<void> = (useApp() as any).refreshProfile ?? (async () => {});
  const [rows, setRows] = useState<DenominationRow[]>([]);
  const [pending, setPending] = useState<Track | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from('denominations' as any)
      .select('id, code, parent_id, label_fr, label_en, description_fr, description_en, display_order, active')
      .eq('active', true)
      .is('parent_id', null)
      .order('display_order')
      .then(({ data }) => {
        const list = (data as unknown as DenominationRow[] | null) ?? [];
        setRows(list.length ? list : FALLBACK_ROWS);
      });
  }, []);

  const select = async (code: Track) => {
    setPending(code);
    setSubmitting(true);
    const row = rows.find(r => r.code === code);
    // If the DB row exists (post-migration), persist. Otherwise just advance —
    // this keeps the flow navigable for visual iteration before migrations are
    // pushed; it becomes a real save once the schema is live.
    if (session?.user && row && row.id !== code) {
      await supabase.from('profiles' as any).update({ denomination_id: row.id }).eq('id', session.user.id);
      await refreshProfile();
    }
    setSubmitting(false);
    navigate('/onboarding/home');
  };

  return (
    <OnboardingLayout
      step={1}
      title="Choisissez votre tradition"
      subtitle="Vous pourrez consulter tous les contenus, mais votre communauté principale dépendra de ce choix."
    >
      {rows.map(row => (
        <Card
          key={row.id}
          onClick={() => !submitting && select(row.code)}
          className={`cursor-pointer group bg-sacred-blue/70 border-primary/30 hover:border-primary hover:bg-sacred-blue/90 transition-all p-4 backdrop-blur-md shadow-lg hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] ${pending === row.code ? 'border-primary' : ''}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-white leading-tight mb-1">
                {row.label_fr}
              </h3>
              <p className="text-xs sm:text-sm text-white/75 italic leading-snug">
                {row.description_fr}
              </p>
            </div>
            {pending === row.code && submitting && (
              <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
            )}
          </div>
        </Card>
      ))}

      <p className="text-[11px] text-white/50 text-center mt-2 px-2">
        Ce choix peut être modifié plus tard, mais avec un délai et une vérification.
      </p>
    </OnboardingLayout>
  );
};

export default OnboardingDenomination;
