import type { Md5Step } from '@/lib/crypto/types';
import { BufferRow } from '../atoms/BufferCell';
import { ArrowDown, Plus } from 'lucide-react';

export default function BlockEndStage({
  step,
}: {
  step: Extract<Md5Step, { kind: 'block-end' }>;
}) {
  return (
    <section className="panel p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold">Конец блока {step.blockIndex + 1}</h3>
        <p className="text-xs text-fg-muted mt-1">
          Merkle-Damgård: прибавляем начальное состояние к результату 64 операций.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
          Состояние перед блоком
        </div>
        <BufferRow state={step.stateBefore} size="sm" />

        <Plus className="w-5 h-5 text-accent-magenta" />

        <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
          Результат 64 операций
        </div>
        <BufferRow state={step.stateAfterOps} size="sm" />

        <ArrowDown className="w-5 h-5 text-accent-cyan" />

        <div className="text-[10px] uppercase tracking-wider text-accent-cyan font-semibold">
          Новое состояние (mod 2³²)
        </div>
        <BufferRow
          state={step.stateAfter}
          size="md"
          highlight={{ A: true, B: true, C: true, D: true }}
        />
      </div>
    </section>
  );
}
