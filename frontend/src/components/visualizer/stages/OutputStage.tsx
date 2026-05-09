import type { Md5Step } from '@/lib/crypto/types';
import { Check, Copy, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { BufferRow } from '../atoms/BufferCell';
import { wordToHexLE } from '@/lib/crypto/formatters';

export default function OutputStage({
  step,
}: {
  step: Extract<Md5Step, { kind: 'output' }>;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(step.hashHex).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };

  const ctxLabel =
    step.context === 'plain'
      ? 'MD5'
      : step.context === 'hmac-inner'
        ? 'inner MD5'
        : step.context === 'hmac-outer'
          ? 'outer MD5 (= HMAC)'
          : 'pre-hashed key';

  return (
    <section className="panel p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/40 bg-accent-cyan/10 px-3 py-1 text-xs font-semibold text-accent-cyan">
          <Sparkles className="w-3.5 h-3.5" />
          Результат · {ctxLabel}
        </div>
        <h3 className="text-2xl font-bold">128-битный отпечаток готов</h3>
      </div>

      <div className="panel-inset p-6 flex flex-col items-center gap-4">
        <div className="font-mono text-2xl sm:text-3xl font-bold text-gradient-primary tracking-wider break-all text-center">
          {step.hashHex}
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

      <div className="space-y-3">
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
          Финальное состояние (little-endian ⇒ hex выше)
        </div>
        <div className="flex justify-center">
          <BufferRow
            state={step.finalState}
            size="md"
            highlight={{ A: true, B: true, C: true, D: true }}
          />
        </div>
        <div className="panel-inset p-3 font-mono text-[11px] text-fg-muted text-center">
          {wordToHexLE(step.finalState.a)} {wordToHexLE(step.finalState.b)} {wordToHexLE(step.finalState.c)} {wordToHexLE(step.finalState.d)}
        </div>
      </div>
    </section>
  );
}
