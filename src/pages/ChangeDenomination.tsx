import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Info, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import type { Track } from '@/types/track';
import { PageHeader } from '@/components/quest/PageHeader';
import { BranchingPathsEmblem } from '@/components/quest/BranchingPathsEmblem';
import { TrackEmblem } from '@/components/quest/TrackEmblem';

const TRACK_LABELS: Record<Track, string> = {
  catholic: 'Catholique',
  protestant: 'Protestant',
  orthodox: 'Orthodoxe',
  heritage: 'Curieux & Patrimoine',
};
const TRACK_ORDER: Track[] = ['catholic', 'protestant', 'orthodox', 'heritage'];

const REASONS = [
  { value: 'wrong_choice', label: 'Choix par erreur' },
  { value: 'conversion',   label: 'Conversion' },
  { value: 'exploration',  label: 'Exploration' },
  { value: 'other',        label: 'Autre' },
];

export default function ChangeDenomination() {
  const navigate = useNavigate();
  const ctx = useApp() as any;
  const { userProgress } = useApp();
  const track: Track | undefined = ctx.track;
  const refreshProfile: () => Promise<void> = ctx.refreshProfile ?? (async () => {});
  const [target, setTarget] = useState<Track | ''>('');
  const [reasonCat, setReasonCat] = useState('');
  const [reasonText, setReasonText] = useState('');
  const [resetProgress, setResetProgress] = useState(false);
  const [confirmTyped, setConfirmTyped] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const up = userProgress as any;
  const lockedUntil = up.denominationLockedUntil
    ? new Date(up.denominationLockedUntil)
    : null;
  const lockActive = !!(lockedUntil && lockedUntil.getTime() > Date.now());
  const changeCount: number = up.denominationChangeCount ?? 0;
  const remainingChanges = Math.max(0, 3 - changeCount);

  const submit = async () => {
    if (!target || target === track) return;
    if (confirmTyped !== 'CHANGER') {
      toast.error('Tapez « CHANGER » pour confirmer.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.rpc('change_denomination' as any, {
      p_to_code: target,
      p_reason_category: reasonCat || 'other',
      p_reason_text: reasonText,
      p_reset_progress: resetProgress,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Tradition mise à jour.');
    await refreshProfile();
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <div className="max-w-xl mx-auto px-4 pt-3 pb-24">
        <Button
          variant="ghost"
          onClick={() => navigate('/settings')}
          className="text-white/65 hover:text-white hover:bg-white/5 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <PageHeader
          emblem={<BranchingPathsEmblem size={92} />}
          title="Changer de tradition"
          subtitle="un nouveau chemin · à votre rythme"
        />

        {/* Tradition actuelle — visual, not a "—" text */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <TrackEmblem track={track} size={36} />
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">Tradition actuelle</div>
            <div className="text-[15px] font-semibold text-white">
              {track ? TRACK_LABELS[track] : 'Non définie'}
            </div>
          </div>
        </div>

        {/* Lock banner — calm, single line */}
        {lockActive && (
          <div className="mt-4 px-4 py-3 rounded-lg border border-amber-300/25 bg-amber-300/5 text-[12.5px] text-amber-100/85">
            Période de réflexion en cours jusqu'au{' '}
            <strong>{lockedUntil!.toLocaleDateString('fr-FR')}</strong>.
          </div>
        )}

        {/* Choose new tradition — 4 visual cards instead of a dropdown */}
        <section className="mt-6">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-white/55 mb-2">
            Vers quelle tradition ?
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {TRACK_ORDER.filter((t) => t !== track).map((t) => {
              const active = target === t;
              return (
                <button
                  key={t}
                  onClick={() => setTarget(t)}
                  disabled={lockActive}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                              active:scale-[0.98] disabled:opacity-50
                              ${active
                                ? 'border-amber-300/55 bg-amber-300/10 shadow-[0_0_18px_rgba(244,197,66,0.18)]'
                                : 'border-white/10 bg-white/3 hover:bg-white/5 hover:border-white/20'}`}
                >
                  <TrackEmblem track={t} size={36} />
                  <span className={`text-[13px] font-semibold ${active ? 'text-amber-100' : 'text-white/85'}`}>
                    {TRACK_LABELS[t]}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Reason — chip selector + optional textarea */}
        <section className="mt-5">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-white/55 mb-2">
            Une raison ?
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {REASONS.map((r) => {
              const active = reasonCat === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => setReasonCat(r.value)}
                  disabled={lockActive}
                  className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors
                              disabled:opacity-50
                              ${active
                                ? 'border-amber-300/55 bg-amber-300/12 text-amber-100'
                                : 'border-white/10 bg-white/4 text-white/75 hover:text-amber-100 hover:border-amber-300/30'}`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {(reasonCat === 'other' || reasonText) && (
            <Textarea
              placeholder="Quelques mots si vous le souhaitez…"
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              maxLength={500}
              disabled={lockActive}
              className="mt-2 bg-white/3 border-white/10 text-white text-[13px] placeholder:text-white/35"
              rows={2}
            />
          )}
        </section>

        {/* Advanced — collapsed by default */}
        <section className="mt-5">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="inline-flex items-center gap-1 text-[11.5px] text-white/55 hover:text-amber-100 transition-colors"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? '' : '-rotate-90'}`}
            />
            Options avancées
          </button>

          {showAdvanced && (
            <div className="mt-2 px-3 py-2.5 rounded-lg border border-white/10 bg-white/3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={resetProgress}
                  onChange={(e) => setResetProgress(e.target.checked)}
                  disabled={lockActive}
                  className="mt-1 accent-amber-300"
                />
                <span className="text-[12.5px] text-white/85">
                  Repartir de zéro
                  <span className="block text-[11px] text-white/50 mt-0.5">
                    Remet vos points, badges et séries à 0. Action irréversible.
                  </span>
                </span>
              </label>
            </div>
          )}
        </section>

        {/* Quiet rules disclosure */}
        <button
          type="button"
          onClick={() => setShowRules((v) => !v)}
          className="mt-4 inline-flex items-center gap-1 text-[11px] text-white/40 hover:text-white/70 transition-colors"
        >
          <Info className="w-3 h-3" />
          {showRules ? 'Masquer les règles' : 'Pourquoi ce choix prend du temps ?'}
        </button>
        {showRules && (
          <div className="mt-2 px-3 py-2.5 rounded-lg border border-white/8 bg-white/2 text-[11.5px] text-white/65 leading-relaxed">
            La tradition oriente votre parcours en profondeur. Pour préserver le sens
            du choix : un délai grandit après chaque changement (30 j, 90 j, 365 j).
            Au-delà de 3 changements, le support vous accompagne.
            <div className="mt-2 text-white/50">
              Changements effectués : <strong className="text-white/75">{changeCount}</strong>{' '}
              · Restants : <strong className="text-white/75">{remainingChanges}</strong>
            </div>
          </div>
        )}

        {/* Confirmation — only meaningful once a target is picked */}
        {target && !lockActive && (
          <Card className="mt-6 p-4 bg-white/4 border-white/10">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/55 mb-2">
              Pour confirmer
            </div>
            <p className="text-[12.5px] text-white/70 mb-2">
              Tapez <span className="text-amber-200 font-mono">CHANGER</span> ci-dessous.
            </p>
            <input
              type="text"
              value={confirmTyped}
              onChange={(e) => setConfirmTyped(e.target.value.toUpperCase())}
              placeholder="CHANGER"
              className="w-full px-3 py-2 rounded-md bg-black/35 border border-white/12 text-white font-mono tracking-widest placeholder:text-white/25 focus:border-amber-300/50 outline-none"
            />
            <Button
              onClick={submit}
              disabled={submitting || !target || confirmTyped !== 'CHANGER'}
              className="w-full mt-3 bg-gradient-to-r from-amber-300 to-orange-400 text-amber-950 font-semibold
                         hover:from-amber-200 hover:to-orange-300 disabled:opacity-40 disabled:from-white/15 disabled:to-white/10 disabled:text-white/45"
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirmer le changement
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
