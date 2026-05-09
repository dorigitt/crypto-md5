import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb, MessageSquare } from 'lucide-react';
import { useVisualizer } from '@/store/visualizer';
import { commentaryForStep } from './commentary/commentaryFor';

export default function Commentary() {
  const { visibleSteps, index, level, mode } = useVisualizer();

  const current = visibleSteps[Math.min(index, visibleSteps.length - 1)];
  const content = useMemo(
    () => (current ? commentaryForStep(current, level, mode) : null),
    [current, level, mode],
  );

  if (!content) {
    return (
      <section className="panel p-7 min-h-[320px] flex items-center justify-center">
        <p className="text-sm text-fg-subtle italic">—</p>
      </section>
    );
  }

  return (
    <section className="panel p-7 min-h-[360px] flex flex-col gap-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${index}-${current.kind}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-accent-cyan/80" />
              <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent-cyan/90">
                {content.titleRu}
              </h3>
            </div>
            <div className="text-[15px] leading-[1.75] text-fg whitespace-pre-line">
              {content.whatRu}
            </div>
          </div>

          {content.whyRu && (
            <div className="pt-5 border-t border-border/60">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-accent-amber/80" />
                <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent-amber/90">
                  Зачем
                </h3>
              </div>
              <p className="text-[14px] leading-[1.75] text-fg-muted">{content.whyRu}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
