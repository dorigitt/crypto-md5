import type { Md5Step, ExplanationLevel } from '@/lib/crypto/types';
import HexView from '../atoms/HexView';
import { useVisualizer } from '@/store/visualizer';

export default function LengthAppendedStage({
  step,
  level,
}: {
  step: Extract<Md5Step, { kind: 'length-appended' }>;
  level: ExplanationLevel;
}) {
  const { index, completedSteps } = useVisualizer();
  const { originalLenBits, finalBytes } = step;
  const total = finalBytes.length;
  const paddingEnd = total - 8;
  const hideLengthAnswer = index === 2 && !completedSteps.includes(index);

  return (
    <section className="panel p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold">Добавление длины</h3>
        <p className="text-xs text-fg-muted mt-1">
          Последние 8 байт = исходная длина в битах, little-endian.
        </p>
      </div>

      <div className="panel-inset p-4 flex items-center justify-center gap-3 flex-wrap">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">Длина в битах</div>
          <div className="text-2xl font-mono font-bold text-accent-amber mt-1">{originalLenBits}</div>
        </div>
        <div className="text-fg-subtle">→</div>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">Hex (LE, 64 бит)</div>
          <div className="text-lg font-mono font-bold text-accent-amber mt-1">
            {hideLengthAnswer ? '?? ?? ?? ?? ?? ?? ?? ??' : lenToHexLE(originalLenBits)}
          </div>
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1.5 flex items-center gap-3">
          <span>Итоговый вход для MD5</span>
          <Legend tone="msg" label="сообщение" />
          <Legend tone="pad" label="padding (0x80 + нули)" />
          <Legend tone="len" label="длина" />
        </div>
        <HexView
          bytes={
            hideLengthAnswer
              ? Array.from(finalBytes).map((b, i) => (i >= paddingEnd ? -1 : b))
              : finalBytes
          }
          maxRows={level === 'easy' ? 4 : 8}
          highlights={[
            { from: 0, to: paddingEnd, tone: 'msg' },
            { from: paddingEnd, to: total, tone: 'len' },
          ]}
        />
      </div>
    </section>
  );
}

function lenToHexLE(lenBits: number): string {
  const buf = new Uint8Array(8);
  const view = new DataView(buf.buffer);
  view.setBigUint64(0, BigInt(lenBits), true);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
}

function Legend({ tone, label }: { tone: 'msg' | 'pad' | 'len'; label: string }) {
  const cls =
    tone === 'msg'
      ? 'bg-fg/20'
      : tone === 'pad'
        ? 'bg-accent-magenta/40'
        : 'bg-accent-amber/40';
  return (
    <span className="inline-flex items-center gap-1 text-[10px]">
      <span className={`inline-block w-2 h-2 rounded-sm ${cls}`} />
      {label}
    </span>
  );
}
