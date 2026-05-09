import type { Md5Step, ExplanationLevel } from '@/lib/crypto/types';
import { bytesToAscii } from '@/lib/crypto/formatters';
import { useVisualizer } from '@/store/visualizer';
import HexView from '../atoms/HexView';
import Badge from '../atoms/Badge';

export default function InputStage({
  step,
  level,
}: {
  step: Extract<Md5Step, { kind: 'input' }>;
  level: ExplanationLevel;
}) {
  const { index } = useVisualizer();

  const shouldHideLastByte =
    index === 0 && step.context === 'plain' && step.bytes.length > 0;

  const visibleBytes = shouldHideLastByte
    ? step.bytes.slice(0, step.bytes.length - 1)
    : step.bytes;

  const hiddenAscii = shouldHideLastByte
    ? bytesToAscii(step.bytes.slice(0, step.bytes.length - 1)) + ' ?'
    : bytesToAscii(step.bytes);

  const ctxBadge =
    step.context === 'plain'
      ? { label: 'сообщение', tone: 'cyan' as const }
      : step.context === 'hmac-inner'
        ? { label: 'inner MD5 input', tone: 'magenta' as const }
        : step.context === 'hmac-outer'
          ? { label: 'outer MD5 input', tone: 'amber' as const }
          : { label: 'key (pre-hash)', tone: 'emerald' as const };

  return (
    <section className="panel p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-xl font-bold">Вход</h3>
          <p className="text-xs text-fg-muted mt-1">
            {step.bytes.length} байт · {step.bytes.length * 8} бит
          </p>
        </div>

        <Badge tone={ctxBadge.tone}>{ctxBadge.label}</Badge>
      </div>

      {step.text !== undefined && step.context === 'plain' && (
        <div className="panel-inset p-4">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1">
            Текст
          </div>

          <div className="font-mono text-sm break-all">
            {step.text || <span className="italic text-fg-subtle">(пусто)</span>}
          </div>
        </div>
      )}

      <div>
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1.5">
          Байты (hex + ASCII)
        </div>

        <div className="panel-inset p-4 font-mono text-sm flex gap-6 flex-wrap">
          {Array.from(visibleBytes).map((byte, i) => (
            <span key={i}>
              {byte.toString(16).padStart(2, '0')}
            </span>
          ))}

          {shouldHideLastByte && (
            <span className="text-accent-cyan">??</span>
          )}
        </div>
      </div>

      {level !== 'easy' && step.bytes.length <= 16 && (
        <div className="panel-inset p-4 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Побитово
          </div>

          <div className="font-mono text-xs leading-relaxed break-all">
            {Array.from(visibleBytes)
              .map((b) => b.toString(2).padStart(8, '0'))
              .join(' ')}

            {shouldHideLastByte && ' ????????'}
          </div>

          <div className="text-[10px] text-fg-subtle font-mono">
            ASCII: {hiddenAscii}
          </div>
        </div>
      )}
    </section>
  );
}