import { motion } from 'framer-motion';
import type { Md5Step, ExplanationLevel } from '@/lib/crypto/types';
import HexView from '../atoms/HexView';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.1,
    },
  },
};

const statsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function PaddingStage({
  step,
  level,
}: {
  step: Extract<Md5Step, { kind: 'padding' }>;
  level: ExplanationLevel;
}) {
  const { originalLenBytes, paddingBytesAdded, paddedLenBytes, paddedBytes } = step;

  return (
    <motion.section
      className="panel p-6 space-y-5"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-bold">Дополнение сообщения</h3>
        <p className="text-xs text-fg-muted mt-1">
          Длина должна стать 56 mod 64. Добавлено: {paddingBytesAdded} байт.
        </p>
      </motion.div>

      <motion.div className="grid grid-cols-3 gap-3" variants={statsContainerVariants}>
        <Stat label="Было байт" value={originalLenBytes} tone="cyan" variants={itemVariants} />
        <Stat label="Padding" value={paddingBytesAdded} tone="magenta" variants={itemVariants} />
        <Stat label="Стало байт" value={paddedLenBytes} tone="amber" variants={itemVariants} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="text-xs uppercase tracking-[0.14em] text-fg-muted mb-3">
          Результат <span className="normal-case tracking-normal text-fg-subtle">(розовым — добавленные байты)</span>
        </div>
        <motion.div variants={itemVariants}>
          <HexView
            bytes={paddedBytes}
            maxRows={level === 'easy' ? 4 : 8}
            highlights={[
              { from: 0, to: originalLenBytes, tone: 'msg' },
              { from: originalLenBytes, to: paddedLenBytes, tone: 'pad' },
            ]}
          />
        </motion.div>
      </motion.div>

      <motion.div className="panel-inset p-4 text-xs text-fg-muted leading-relaxed" variants={itemVariants}>
        <p>
          Первый добавленный байт — <span className="font-mono text-accent-magenta">0x80</span> (бит «1»,
          затем семь нулей). Остальные до конца — нули. Таким образом оригинал всегда можно однозначно
          восстановить: бит «1» — маркер конца.
        </p>
      </motion.div>
    </motion.section>
  );
}

function Stat({
  label,
  value,
  tone,
  variants,
}: {
  label: string;
  value: number;
  tone: 'cyan' | 'magenta' | 'amber';
  variants?: typeof itemVariants;
}) {
  const toneClass =
    tone === 'cyan'
      ? 'border-accent-cyan/40 text-accent-cyan'
      : tone === 'magenta'
        ? 'border-accent-magenta/40 text-accent-magenta'
        : 'border-accent-amber/40 text-accent-amber';
  return (
    <motion.div
      layout
      variants={variants}
      className={`panel-inset p-4 border ${toneClass} flex flex-col items-center`}
    >
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="text-2xl font-mono font-bold mt-1">{value}</div>
    </motion.div>
  );
}
