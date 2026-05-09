import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Tone = 'cyan' | 'magenta' | 'amber' | 'emerald' | 'neutral';

const TONES: Record<Tone, string> = {
  cyan: 'border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan',
  magenta: 'border-accent-magenta/40 bg-accent-magenta/10 text-accent-magenta',
  amber: 'border-accent-amber/40 bg-accent-amber/10 text-accent-amber',
  emerald: 'border-accent-emerald/40 bg-accent-emerald/10 text-accent-emerald',
  neutral: 'border-border-strong bg-bg-raised text-fg-muted',
};

export default function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium border',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
