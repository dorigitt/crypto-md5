import type { Md5Step } from '@/lib/crypto/types';
import { motion } from 'framer-motion';

const ROUND_INFO: Record<0 | 1 | 2 | 3, { title: string; formula: string; desc: string; color: string }> = {
  0: {
    title: 'Раунд 1 — F (choice)',
    formula: 'F(B,C,D) = (B ∧ C) ∨ (¬B ∧ D)',
    desc: 'Мультиплексор: для каждого бита, если B=1 берём C, иначе берём D.',
    color: 'accent-cyan',
  },
  1: {
    title: 'Раунд 2 — G (choice, rotated)',
    formula: 'G(B,C,D) = (B ∧ D) ∨ (C ∧ ¬D)',
    desc: 'Похож на F, но входы перетасованы — другой «узор» мультиплексирования.',
    color: 'accent-magenta',
  },
  2: {
    title: 'Раунд 3 — H (XOR)',
    formula: 'H(B,C,D) = B ⊕ C ⊕ D',
    desc: 'Чистый XOR всех трёх регистров. Симметрия по перестановке входов.',
    color: 'accent-amber',
  },
  3: {
    title: 'Раунд 4 — I',
    formula: 'I(B,C,D) = C ⊕ (B ∨ ¬D)',
    desc: 'Самая запутанная функция. Смешивает OR, NOT и XOR для максимальной диффузии.',
    color: 'accent-emerald',
  },
};

export default function RoundStartStage({
  step,
}: {
  step: Extract<Md5Step, { kind: 'round-start' }>;
}) {
  const info = ROUND_INFO[step.roundIndex];
  return (
    <section className="panel p-8 space-y-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        className="space-y-3"
      >
        <div
          className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border"
          style={{
            borderColor: `rgb(var(--round-${step.roundIndex}) / 0.4)`,
          }}
        >
          Блок {step.blockIndex + 1}
        </div>
        <h3 className={`text-3xl font-bold text-${info.color}`}>{info.title}</h3>
        <div className="panel-inset inline-block px-6 py-3 font-mono text-base">{info.formula}</div>
        <p className="text-sm text-fg-muted max-w-xl mx-auto">{info.desc}</p>
        <div className="text-[11px] text-fg-subtle font-mono">
          Операции {step.roundIndex * 16 + 1}–{step.roundIndex * 16 + 16} из 64 (в этом блоке)
        </div>
      </motion.div>
    </section>
  );
}
