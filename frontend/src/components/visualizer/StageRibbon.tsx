import { useTranslation } from 'react-i18next';
import { Box, CheckCircle2, FileDigit, Hash, Key, Layers, Lock, Sigma } from 'lucide-react';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useVisualizer } from '@/store/visualizer';
import { stepStage } from '@/lib/crypto/types';
import type { Stage } from '@/lib/crypto/types';
import { cn } from '@/lib/utils/cn';

const STAGES_MD5: Array<{ stage: Stage; labelKey: string; icon: typeof Box }> = [
  { stage: 'preprocessing', labelKey: 'visualizer.stages.preprocessing', icon: FileDigit },
  { stage: 'padding', labelKey: 'visualizer.stages.padding', icon: Layers },
  { stage: 'blocks', labelKey: 'visualizer.stages.blocks', icon: Box },
  { stage: 'init', labelKey: 'visualizer.stages.init', icon: Hash },
  { stage: 'rounds', labelKey: 'visualizer.stages.rounds', icon: Sigma },
  { stage: 'output', labelKey: 'visualizer.stages.output', icon: CheckCircle2 },
];

const STAGES_HMAC: Array<{ stage: Stage; labelKey: string; icon: typeof Box }> = [
  { stage: 'hmac-prep', labelKey: 'visualizer.stages.hmac_prep', icon: Key },
  ...STAGES_MD5,
  { stage: 'hmac-combine', labelKey: 'visualizer.stages.hmac_combine', icon: Lock },
];

export default function StageRibbon() {
  const { t } = useTranslation();
  const { mode, visibleSteps, index } = useVisualizer();
  const stages = mode === 'md5' ? STAGES_MD5 : STAGES_HMAC;

  const currentStage = useMemo(() => {
    if (visibleSteps.length === 0) return null;
    return stepStage(visibleSteps[Math.min(index, visibleSteps.length - 1)]);
  }, [visibleSteps, index]);

  const completedIndex = useMemo(() => {
    if (visibleSteps.length === 0 || currentStage == null) return -1;
    return stages.findIndex((s) => s.stage === currentStage);
  }, [visibleSteps, currentStage, stages]);

  return (
    <section className="panel p-4 overflow-x-auto">
      <ol className="flex items-stretch gap-0 min-w-fit">
        {stages.map(({ stage, labelKey, icon: Icon }, i) => {
          const isActive = stage === currentStage;
          const isDone = i < completedIndex;
          const isLast = i === stages.length - 1;
          return (
            <li key={stage} className="flex items-center flex-1 min-w-[130px]">
              <motion.div
                layout
                animate={{
                  scale: isActive ? 1.02 : 1,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-3 py-2 border transition-colors w-full',
                  isActive
                    ? 'border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan shadow-glow'
                    : isDone
                      ? 'border-accent-emerald/30 bg-accent-emerald/5 text-accent-emerald/80'
                      : 'border-border bg-bg-soft/60 text-fg-subtle',
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-medium uppercase tracking-wide whitespace-nowrap">
                  {t(labelKey)}
                </span>
              </motion.div>
              {!isLast && (
                <div
                  className={cn(
                    'h-[2px] flex-1 mx-1 rounded-full transition-colors',
                    isActive || isDone ? 'bg-accent-cyan/50' : 'bg-border',
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
