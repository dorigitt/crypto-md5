import type { HmacOnlyStep } from '@/lib/crypto/types';
import { ArrowRight } from 'lucide-react';
import HexView from '../atoms/HexView';

const ACTION_COPY: Record<
  Extract<HmacOnlyStep, { kind: 'hmac-key-prep' }>['action'],
  { title: string; desc: string; tone: 'cyan' | 'magenta' | 'amber' }
> = {
  unchanged: {
    title: 'Ключ уже 64 байта',
    desc: 'Длина ключа совпадает с блоком MD5 — ничего не меняем.',
    tone: 'cyan',
  },
  padded: {
    title: 'Дополнение ключа нулями',
    desc: 'Ключ короче блока (64 байта) — дописываем нули до длины блока.',
    tone: 'magenta',
  },
  'hashed-and-padded': {
    title: 'Сначала MD5 ключа, потом дополнение',
    desc: 'Ключ длиннее блока — сжимаем его MD5 до 16 байт, затем дополняем нулями до 64 байт.',
    tone: 'amber',
  },
};

export default function HmacKeyPrepStage({
  step,
}: {
  step: Extract<HmacOnlyStep, { kind: 'hmac-key-prep' }>;
}) {
  const copy = ACTION_COPY[step.action];

  return (
    <section className="panel p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold">Подготовка ключа: {copy.title}</h3>
        <p className="text-xs text-fg-muted mt-1">{copy.desc}</p>
      </div>

      <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="panel-inset p-4 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Исходный ключ · {step.originalKey.length} байт
          </div>
          <HexView bytes={step.originalKey} maxRows={2} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <ArrowRight className="w-6 h-6 text-accent-cyan" />
          <span className="text-[10px] font-mono text-fg-subtle">
            → {step.blockSize} байт
          </span>
        </div>

        <div className="panel-inset p-4 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-accent-cyan">
            K (используется дальше) · {step.keyUsed.length} байт
          </div>
          <HexView
            bytes={step.keyUsed}
            maxRows={2}
            highlights={[
              { from: 0, to: Math.min(step.originalKey.length, step.keyUsed.length), tone: 'key' },
              { from: Math.min(step.originalKey.length, step.keyUsed.length), to: step.keyUsed.length, tone: 'pad' },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
