import type { HmacOnlyStep } from '@/lib/crypto/types';
import { Copy, Check, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function HmacOutputStage({
  step,
}: {
  step: Extract<HmacOnlyStep, { kind: 'hmac-output' }>;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(step.macHex).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <section className="panel p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-magenta/40 bg-accent-magenta/10 px-3 py-1 text-xs font-semibold text-accent-magenta">
          <ShieldCheck className="w-3.5 h-3.5" />
          HMAC-MD5 готов
        </div>
        <h3 className="text-2xl font-bold">Имитовставка (MAC)</h3>
        <p className="text-xs text-fg-muted max-w-lg mx-auto">
          Этот 128-битный код можно передать вместе с сообщением. Получатель, знающий ключ, пересчитает
          HMAC и сравнит — так он узнает, что сообщение и подлинное, и не изменённое.
        </p>
      </div>

      <div className="panel-inset p-6 flex flex-col items-center gap-4">
        <div className="font-mono text-2xl sm:text-3xl font-bold text-gradient-primary tracking-wider break-all text-center">
          {step.macHex}
        </div>
        <button type="button" onClick={copy} className="btn-ghost text-xs">
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-accent-emerald" />
              Скопировано
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Копировать
            </>
          )}
        </button>
      </div>
    </section>
  );
}
