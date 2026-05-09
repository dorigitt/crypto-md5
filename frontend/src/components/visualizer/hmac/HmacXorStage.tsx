import type { HmacOnlyStep } from '@/lib/crypto/types';
import { motion } from 'framer-motion';
import HexView from '../atoms/HexView';

export default function HmacXorStage({
  step,
}: {
  step: Extract<HmacOnlyStep, { kind: 'hmac-xor' }>;
}) {
  const padName = step.pad === 'ipad' ? 'ipad' : 'opad';
  const padHex = step.padValue.toString(16).toUpperCase().padStart(2, '0');
  const tone = step.pad === 'ipad' ? 'accent-cyan' : 'accent-magenta';
  const padBytes = new Uint8Array(step.keyUsed.length).fill(step.padValue);

  return (
    <section className="panel p-6 space-y-5">
      <div>
        <h3 className={`text-xl font-bold text-${tone}`}>
          XOR с {padName} (0x{padHex})
        </h3>
        <p className="text-xs text-fg-muted mt-1">
          K ⊕ {padName} = K<sub>{padName}</sub> · размер {step.keyUsed.length} байт
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1">
            K (подготовленный ключ)
          </div>
          <HexView bytes={step.keyUsed} maxRows={2} />
        </div>

        <div className="flex items-center justify-center">
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className={`text-${tone} text-3xl font-bold`}
          >
            ⊕
          </motion.div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1">
            {padName} = 0x{padHex} повторённый {step.keyUsed.length} раз
          </div>
          <HexView
            bytes={padBytes}
            maxRows={1}
            highlights={[
              { from: 0, to: padBytes.length, tone: step.pad === 'ipad' ? 'msg' : 'hash' },
            ]}
          />
        </div>

        <div className="flex items-center justify-center">
          <span className="text-fg-subtle text-xl font-mono">=</span>
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0.3 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        >
          <div className={`text-[10px] uppercase tracking-wider text-${tone} mb-1 font-semibold`}>
            K<sub>{padName}</sub>
          </div>
          <HexView
            bytes={step.xorResult}
            maxRows={2}
            highlights={[{ from: 0, to: step.xorResult.length, tone: step.pad === 'ipad' ? 'msg' : 'hash' }]}
          />
        </motion.div>
      </div>
    </section>
  );
}
