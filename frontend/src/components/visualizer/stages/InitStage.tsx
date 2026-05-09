import type { Md5Step, ExplanationLevel } from '@/lib/crypto/types';
import { motion } from 'framer-motion';

export default function InitStage({
  step,
  level,
}: {
  step: Extract<Md5Step, { kind: 'init' }>;
  level: ExplanationLevel;
}) {
  const buffers = [
    { label: 'A', value: '67452301', color: 'text-accent-cyan border-accent-cyan/40 shadow-accent-cyan/40' },
    { label: 'B', value: 'efcdab89', color: 'text-accent-magenta border-accent-magenta/40 shadow-accent-magenta/40' },
    { label: 'C', value: '98badcfe', color: 'text-accent-amber border-accent-amber/40 shadow-accent-amber/40' },
    { label: 'D', value: '10325476', color: 'text-accent-emerald border-accent-emerald/40 shadow-accent-emerald/40' },
  ];

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
          <motion.div
            key={buffer.label}
            initial={{ opacity: 0, x: -60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.55,
              delay: i * 0.25,
              ease: 'easeOut',
            }}
            className={`rounded-2xl border bg-bg-raised p-6 text-center shadow-lg ${buffer.color}`}
          >
            <div className="text-xs font-semibold mb-3">
              {buffer.label}
            </div>

            <div className="font-mono text-2xl font-bold">
              {buffer.value}
            </div>
          </motion.div>
        ))}
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