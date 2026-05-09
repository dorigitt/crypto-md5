import type { Md5Step } from '@/lib/crypto/types';
import { wordToHex } from '@/lib/crypto/formatters';
import { BufferRow } from '../atoms/BufferCell';

export default function BlockStartStage({
  step,
}: {
  step: Extract<Md5Step, { kind: 'block-start' }>;
}) {
  return (
    <section className="panel p-6 space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <h3 className="text-xl font-bold">
          Начало блока {step.blockIndex + 1} <span className="text-fg-subtle">из {step.blockCount}</span>
        </h3>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1.5">
          Содержимое блока (M[0..15])
        </div>
        <div className="panel-inset p-3">
          <div className="grid grid-cols-4 gap-1 font-mono text-xs">
            {Array.from(step.block).map((w, i) => (
              <div key={i} className="px-1.5 py-1 rounded bg-bg-raised border border-border text-center">
                <span className="text-fg-subtle">M{i.toString().padStart(2, '0')}:</span>{' '}
                <span className="text-accent-cyan">{wordToHex(w)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-2">
          Состояние буферов на входе блока
        </div>
        <div className="py-3 flex justify-center">
          <BufferRow state={step.stateBefore} size="md" />
        </div>
      </div>
    </section>
  );
}
