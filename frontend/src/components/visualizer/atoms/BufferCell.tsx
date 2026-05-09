import { motion } from 'framer-motion';
import { wordToHex } from '@/lib/crypto/formatters';
import { cn } from '@/lib/utils/cn';

const LABEL_TO_TONE = {
  A: 'border-buffer-a/50 bg-buffer-a/5 text-buffer-a',
  B: 'border-buffer-b/50 bg-buffer-b/5 text-buffer-b',
  C: 'border-buffer-c/50 bg-buffer-c/5 text-buffer-c',
  D: 'border-buffer-d/50 bg-buffer-d/5 text-buffer-d',
} as const;

export type BufferLabel = keyof typeof LABEL_TO_TONE;

export interface BufferCellProps {
  label: BufferLabel;
  value: number;
  /** Highlight when this buffer just changed. */
  highlight?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function BufferCell({ label, value, highlight, size = 'md' }: BufferCellProps) {
  return (
    <motion.div
      layout
      initial={false}
      animate={{
        scale: highlight ? 1.04 : 1,
        boxShadow: highlight ? '0 0 24px -4px currentColor' : '0 0 0px 0px currentColor',
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className={cn(
        'relative rounded-xl border flex flex-col items-center justify-center',
        'backdrop-blur-sm transition-colors',
        LABEL_TO_TONE[label],
        size === 'sm' && 'w-[90px] h-[60px] p-2 gap-0.5',
        size === 'md' && 'w-[128px] h-[82px] p-3 gap-1',
        size === 'lg' && 'w-[168px] h-[102px] p-4 gap-1.5',
      )}
    >
      <span className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70">{label}</span>
      <span
        className={cn(
          'font-mono font-bold tracking-tight',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg',
        )}
      >
        {wordToHex(value)}
      </span>
    </motion.div>
  );
}

export function BufferRow({
  state,
  highlight,
  size = 'md',
}: {
  state: { a: number; b: number; c: number; d: number };
  highlight?: Partial<Record<BufferLabel, boolean>>;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <BufferCell label="A" value={state.a} highlight={highlight?.A} size={size} />
      <BufferCell label="B" value={state.b} highlight={highlight?.B} size={size} />
      <BufferCell label="C" value={state.c} highlight={highlight?.C} size={size} />
      <BufferCell label="D" value={state.d} highlight={highlight?.D} size={size} />
    </div>
  );
}
