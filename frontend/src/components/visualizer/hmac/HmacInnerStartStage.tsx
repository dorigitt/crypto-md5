import type { HmacOnlyStep } from '@/lib/crypto/types';
import HexView from '../atoms/HexView';

export default function HmacInnerStartStage({
  step,
}: {
  step: Extract<HmacOnlyStep, { kind: 'hmac-inner-start' }>;
}) {
  return (
    <section className="panel p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold text-accent-cyan">Внутренний MD5</h3>
        <p className="text-xs text-fg-muted mt-1">
          Вход: (K ⊕ ipad) ∥ сообщение · {step.innerInput.length} байт
        </p>
      </div>

      <HexView
        bytes={step.innerInput}
        maxRows={6}
        highlights={[
          { from: 0, to: 64, tone: 'msg' },
          { from: 64, to: step.innerInput.length, tone: 'hash' },
        ]}
      />

      <div className="panel-inset p-4 text-xs text-fg-muted leading-relaxed">
        Первые 64 байта — K ⊕ ipad (инициализационный «солёный» ключ), остальное — само сообщение.
        Дальше эти байты пройдут через стандартный MD5: padding → разбиение на блоки → 64 операции
        на блок.
      </div>
    </section>
  );
}
