import type { Md5Step, ExplanationLevel } from '@/lib/crypto/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

function hexToBinary(hex: string) {
  return hex
    .split('')
    .map((char) => parseInt(char, 16).toString(2).padStart(4, '0'))
    .join(' ');
}

export default function InitStage({
  step,
  level,
}: {
  step: Extract<Md5Step, { kind: 'init' }>;
  level: ExplanationLevel;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showBinary, setShowBinary] = useState(false);

  const buffers = [
    { label: 'A', value: '67452301', color: 'text-accent-cyan border-accent-cyan/40 shadow-accent-cyan/40' },
    { label: 'B', value: 'efcdab89', color: 'text-accent-magenta border-accent-magenta/40 shadow-accent-magenta/40' },
    { label: 'C', value: '98badcfe', color: 'text-accent-amber border-accent-amber/40 shadow-accent-amber/40' },
    { label: 'D', value: '10325476', color: 'text-accent-emerald border-accent-emerald/40 shadow-accent-emerald/40' },
  ];

  const selectedBuffer = buffers.find((b) => b.label === selected);

  return (
    <section className="panel p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold">Инициализация буферов MD5</h3>
        <p className="text-xs text-fg-muted mt-1">
          Четыре 32-битных регистра — начальные значения по RFC 1321.
        </p>
      </div>

      <div className="py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {buffers.map((buffer, i) => (
          <motion.button
            type="button"
            key={buffer.label}
            onClick={() => {
              setSelected(buffer.label);
              setShowBinary((prev) =>
                selected === buffer.label ? !prev : true
              );
            }}
            initial={{ opacity: 0, x: -60, scale: 0.9 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: selected === buffer.label ? 1.06 : 1,
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { duration: 0.55, delay: i * 0.25 },
              x: { duration: 0.55, delay: i * 0.25 },
              scale: { duration: 0.25 },
              y: {
                duration: 2.2,
                delay: i * 0.25,
                repeat: Infinity,
                repeatDelay: 1.2,
                ease: 'easeInOut',
              },
            }}
            className={`rounded-2xl border bg-bg-raised p-6 text-center shadow-lg cursor-pointer transition ${buffer.color}`}
          >
            <div className="text-xs font-semibold mb-3">
              {buffer.label}
            </div>

            <div className="font-mono text-2xl font-bold">
              {buffer.value}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="panel-inset p-4 space-y-3">
        <div className="text-xs uppercase tracking-wider text-fg-subtle">
          Интерактив
        </div>

        <p className="text-sm text-fg-muted">
          Нажми на A, B, C или D — значение откроется в binary формате.
          Карточки также слегка двигаются, показывая будущую смену регистров в раундах.
        </p>

        {selectedBuffer ? (
          <motion.div
            key={selectedBuffer.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-bg-raised p-4"
          >
            <div className="text-sm font-semibold">
              Register {selectedBuffer.label}
            </div>

            <div className="mt-2 font-mono text-sm text-accent-cyan">
              HEX: 0x{selectedBuffer.value.toUpperCase()}
            </div>

            {showBinary && (
              <div className="mt-2 font-mono text-xs text-fg-muted leading-6 break-all">
                BIN: {hexToBinary(selectedBuffer.value)}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-sm text-fg-subtle">
            Выбери любой регистр выше.
          </div>
        )}
      </div>

      {level !== 'easy' && (
        <div className="panel-inset p-4 font-mono text-xs text-fg-muted space-y-1">
          <div>A = <span className="text-accent-cyan">0x67452301</span></div>
          <div>B = <span className="text-accent-magenta">0xEFCDAB89</span></div>
          <div>C = <span className="text-accent-amber">0x98BADCFE</span></div>
          <div>D = <span className="text-accent-emerald">0x10325476</span></div>

          <div className="pt-2 text-fg-subtle italic">
            Эти значения выбраны авторами стандарта так, чтобы не было очевидных структурных
            свойств, которые могли бы упростить атаку на хеш.
          </div>
        </div>
      )}
    </section>
  );
}