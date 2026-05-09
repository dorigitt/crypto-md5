import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface BitRowProps {
  /** 32-bit word. */
  value: number;
  /** Optional tone for bits == 1. */
  tone?: 'cyan' | 'magenta' | 'amber' | 'emerald';
  /** Break every 8 bits with a gap. */
  grouped?: boolean;
  /** Compact mode: no border between groups. */
  compact?: boolean;
}

const TONE_MAP = {
  cyan: 'text-accent-cyan',
  magenta: 'text-accent-magenta',
  amber: 'text-accent-amber',
  emerald: 'text-accent-emerald',
} as const;

export default function BitRow({ value, tone = 'cyan', grouped = true, compact = false }: BitRowProps) {
  const bin = (value >>> 0).toString(2).padStart(32, '0');
  const bits = bin.split('');
  return (
    <div className={cn('inline-flex items-center font-mono text-[11px] leading-none', !compact && 'gap-px')}>
      {bits.map((bit, i) => {
        const groupBreak = grouped && i > 0 && i % 8 === 0;
        return (
          <motion.span
            key={i}
            initial={false}
            animate={{ opacity: 1 }}
            className={cn(
              'inline-flex items-center justify-center w-[13px] h-[18px] rounded-[3px]',
              bit === '1' ? TONE_MAP[tone] : 'text-fg-subtle/60',
              bit === '1' ? 'bg-white/[0.05]' : 'bg-transparent',
              groupBreak && 'ml-1.5',
            )}
          >
            {bit}
          </motion.span>
        );
      })}
    </div>
  );
}
