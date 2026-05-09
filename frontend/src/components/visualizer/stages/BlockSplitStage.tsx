import type { Md5Step, ExplanationLevel } from '@/lib/crypto/types';
import { wordToHex } from '@/lib/crypto/formatters';
import { motion } from 'framer-motion';
import { useVisualizer } from '@/store/visualizer';

export default function BlockSplitStage({
  step,
  level,
}: {
  step: Extract<Md5Step, { kind: 'block-split' }>;
  level: ExplanationLevel;
}) {
  const { blocks, blockCount } = step;
  const { index, completedSteps } = useVisualizer();
  const hideMatchingAnswers = index === 3 && !completedSteps.includes(index);

  return (
    <section className="panel p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold">Разбиение на 512-битные блоки</h3>
        <p className="text-xs text-fg-muted mt-1">
          {blockCount} блок{blockCount === 1 ? '' : blockCount < 5 ? 'а' : 'ов'} · каждый = 16 × 32-битных слова
        </p>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${level === 'easy' ? '280px' : '420px'}, 1fr))` }}>
        {blocks.slice(0, level === 'easy' ? 3 : blocks.length).map((block, bi) => (
          <motion.div
            key={bi}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: bi * 0.05 }}
            className="panel-inset p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-accent-cyan">Блок #{bi + 1}</div>
              <div className="text-[10px] text-fg-subtle font-mono">16 × u32</div>
            </div>
            <motion.div
                key={`table-${index}-${bi}`}
                className="grid grid-cols-4 gap-1 font-mono text-[11px]"
              >
              {Array.from(block).map((w, i) => {
                const shouldHide =
                  hideMatchingAnswers &&
                  bi === 0 &&
                  (i === 0 || i === 1 || i === 14);

                return (
                  <motion.div
                    key={`${index}-${bi}-${i}`}
                    initial={{ opacity: 0, x: -35, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{
                      delay: i * 0.22,
                      duration: 0.55,
                      ease: 'easeOut',
                    }}
                    className="px-1.5 py-1 rounded bg-bg-raised border border-border text-center"
                    title={`M[${i}]`}
                  >
                    <span className="text-fg-subtle">M{i}:</span>{' '}
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: i * 0.22 + 0.25,
                        duration: 0.4,
                      }}
                      className="text-accent-cyan"
                    >
                      {shouldHide ? '????????' : wordToHex(w)}
                    </motion.span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        ))}
        {level === 'easy' && blocks.length > 3 && (
          <div className="panel-inset p-4 flex items-center justify-center text-fg-subtle italic text-sm">
            … ещё {blocks.length - 3} блока
          </div>
        )}
      </div>
    </section>
  );
}
