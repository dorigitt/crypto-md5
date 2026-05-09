import type { Md5Step } from '@/lib/crypto/types';
import { motion } from 'framer-motion';
import RoundFlowAnimation from '@/components/visualizer/RoundFlowAnimation';

const ROUND_INFO: Record<
  0 | 1 | 2 | 3,
  {
    title: string;
    formula: string;
    desc: string;
    repeatText: string;
    operation: number;
    range: string;
    color: string;
  }
> = {
  0: {
    title: 'Операция 1 — функция F',
    formula: 'F(B,C,D) = (B ∧ C) ∨ (¬B ∧ D)',
    desc: 'Это первая операция первого этапа MD5. Функция F выбирает биты: если B = 1, берётся C, иначе берётся D.',
    repeatText: 'Такая же логика повторяется 16 раз: с операции 1 до операции 16.',
    operation: 1,
    range: 'Операции 1–16 из 64',
    color: 'accent-cyan',
  },
  1: {
    title: 'Операция 17 — функция G',
    formula: 'G(B,C,D) = (B ∧ D) ∨ (C ∧ ¬D)',
    desc: 'Это первая операция второго этапа MD5. Здесь используется функция G, похожая на F, но входы переставлены.',
    repeatText: 'Такая же логика повторяется 16 раз: с операции 17 до операции 32.',
    operation: 17,
    range: 'Операции 17–32 из 64',
    color: 'accent-magenta',
  },
  2: {
    title: 'Операция 33 — функция H',
    formula: 'H(B,C,D) = B ⊕ C ⊕ D',
    desc: 'Это первая операция третьего этапа MD5. Функция H использует XOR для смешивания трёх регистров.',
    repeatText: 'Такая же логика повторяется 16 раз: с операции 33 до операции 48.',
    operation: 33,
    range: 'Операции 33–48 из 64',
    color: 'accent-amber',
  },
  3: {
    title: 'Операция 49 — функция I',
    formula: 'I(B,C,D) = C ⊕ (B ∨ ¬D)',
    desc: 'Это первая операция четвёртого этапа MD5. Функция I смешивает XOR, OR и NOT.',
    repeatText: 'Такая же логика повторяется 16 раз: с операции 49 до операции 64.',
    operation: 49,
    range: 'Операции 49–64 из 64',
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
        initial={{ scale: 0.8, opacity: 0, y: 18 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        className="space-y-4"
      >
        <div
          className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border"
          style={{
            borderColor: `rgb(var(--round-${step.roundIndex}) / 0.4)`,
          }}
        >
          Блок {step.blockIndex + 1}
        </div>

        <div className={`text-sm font-mono text-${info.color}`}>
          Первая операция группы
        </div>

        <h3 className={`text-3xl font-bold text-${info.color}`}>
          {info.title}
        </h3>

        <div className="panel-inset inline-block px-6 py-3 font-mono text-base">
          {info.formula}
        </div>

        <p className="text-sm text-fg-muted max-w-xl mx-auto leading-6">
          {info.desc}
        </p>
        <RoundFlowAnimation />

        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-bg-raised p-4 text-left">
          <div className={`text-xs font-semibold uppercase tracking-wider text-${info.color}`}>
            Что происходит дальше
          </div>

          <p className="mt-2 text-sm text-fg-muted leading-6">
            {info.repeatText}
          </p>
        </div>

        <div className="text-[11px] text-fg-subtle font-mono">
          {info.range}
        </div>
      </motion.div>
    </section>
  );
}