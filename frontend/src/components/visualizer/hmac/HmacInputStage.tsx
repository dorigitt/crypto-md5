import type { HmacOnlyStep } from '@/lib/crypto/types';
import { Lock, Key, FileText } from 'lucide-react';
import HexView from '../atoms/HexView';

export default function HmacInputStage({
  step,
}: {
  step: Extract<HmacOnlyStep, { kind: 'hmac-input' }>;
}) {
  return (
    <section className="panel p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-accent-magenta/10 border border-accent-magenta/40 flex items-center justify-center">
          <Lock className="w-5 h-5 text-accent-magenta" />
        </div>
        <div>
          <h3 className="text-xl font-bold">HMAC-MD5</h3>
          <p className="text-xs text-fg-muted mt-0.5">
            HMAC(K, m) = MD5((K ⊕ opad) ∥ MD5((K ⊕ ipad) ∥ m))
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="panel-inset p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-accent-cyan">
            <FileText className="w-3 h-3" />
            Сообщение
          </div>
          {step.text !== undefined && (
            <div className="font-mono text-sm break-all text-fg">
              {step.text || <span className="italic text-fg-subtle">(пусто)</span>}
            </div>
          )}
          <div className="text-[10px] text-fg-subtle font-mono">{step.textBytes.length} байт</div>
          <HexView bytes={step.textBytes} maxRows={3} showAscii={true} />
        </div>

        <div className="panel-inset p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-accent-emerald">
            <Key className="w-3 h-3" />
            Ключ
          </div>
          {step.key !== undefined && (
            <div className="font-mono text-sm break-all text-fg">
              {step.key || <span className="italic text-fg-subtle">(пусто)</span>}
            </div>
          )}
          <div className="text-[10px] text-fg-subtle font-mono">{step.keyBytes.length} байт</div>
          <HexView bytes={step.keyBytes} maxRows={3} showAscii={true} />
        </div>
      </div>

      <div className="panel-inset p-4 text-xs text-fg-muted leading-relaxed">
        <p>
          <span className="font-semibold text-fg">HMAC (Hash-based MAC)</span> превращает обычную
          хеш-функцию в keyed-функцию — чтобы «приправить» хеш секретом, который знают только
          отправитель и получатель. Это защищает от подделки: атакующий, даже видя сообщение и
          его HMAC, не может сгенерировать HMAC для другого сообщения без знания ключа.
        </p>
      </div>
    </section>
  );
}
