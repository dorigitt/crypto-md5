import type { HmacOnlyStep } from '@/lib/crypto/types';
import HexView from '../atoms/HexView';

export default function HmacOuterStartStage({
  step,
}: {
  step: Extract<HmacOnlyStep, { kind: 'hmac-outer-start' }>;
}) {
  return (
    <section className="panel p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold text-accent-magenta">Внешний MD5</h3>
        <p className="text-xs text-fg-muted mt-1">
          Вход: (K ⊕ opad) ∥ inner_digest · {step.outerInput.length} байт
        </p>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1">
          Результат внутреннего MD5 (16 байт)
        </div>
        <HexView
          bytes={step.innerDigest}
          maxRows={1}
          highlights={[{ from: 0, to: 16, tone: 'hash' }]}
          showAscii={false}
        />
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1">
          Полный вход для внешнего MD5
        </div>
        <HexView
          bytes={step.outerInput}
          maxRows={6}
          highlights={[
            { from: 0, to: 64, tone: 'pad' },
            { from: 64, to: step.outerInput.length, tone: 'hash' },
          ]}
        />
      </div>

      <div className="panel-inset p-4 text-xs text-fg-muted leading-relaxed">
        Теперь к внутреннему результату «приклеиваем» K ⊕ opad впереди и хешируем всё вместе.
        Этот двойной проход с разными «раскрасками» ключа — ядро HMAC.
      </div>
    </section>
  );
}
