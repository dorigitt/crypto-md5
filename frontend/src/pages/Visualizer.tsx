import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { useVisualizer } from '@/store/visualizer';
import InputPanel from '@/components/visualizer/InputPanel';
import StepPlayer from '@/components/visualizer/StepPlayer';
import StageRibbon from '@/components/visualizer/StageRibbon';
import StageRouter from '@/components/visualizer/StageRouter';
import Commentary from '@/components/visualizer/Commentary';

export default function VisualizerPage() {
  const { t } = useTranslation();
  const { status, error } = useVisualizer();

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-panel/40 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-subtle">
          <Sparkles className="w-3 h-3 text-accent-cyan" />
          MD5 · HMAC-MD5
        </div>
        <h1 className="text-2xl font-bold">Пошаговый визуализатор</h1>
      </header>

      <InputPanel />

      {error && (
        <div className="panel p-4 border-accent-magenta/40 bg-accent-magenta/5 text-sm text-accent-magenta">
          {error}
        </div>
      )}

      {status === 'idle' ? (
        <section className="panel p-10 text-center space-y-3">
          <h2 className="text-xl font-semibold">{t('visualizer.empty_state_title')}</h2>
          <p className="text-sm text-fg-muted max-w-md mx-auto">
            {t('visualizer.empty_state_desc')}
          </p>
        </section>
      ) : (
        <>
          <StageRibbon />
          <StepPlayer />
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_440px]">
            <div className="min-w-0">
              <StageRouter />
            </div>
            <div className="min-w-0">
              <div className="lg:sticky lg:top-20">
                <Commentary />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
