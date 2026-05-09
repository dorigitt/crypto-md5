import { motion } from 'framer-motion';
import { ChevronDown, RotateCw } from 'lucide-react';
import type { Md5Step, ExplanationLevel } from '@/lib/crypto/types';
import { wordToHex } from '@/lib/crypto/formatters';
import BitRow from '../atoms/BitRow';
import BufferCell, { BufferRow } from '../atoms/BufferCell';

const ROUND_COLOR = {
  0: 'text-accent-cyan',
  1: 'text-accent-magenta',
  2: 'text-accent-amber',
  3: 'text-accent-emerald',
} as const;

const ROUND_BORDER = {
  0: 'border-accent-cyan/40',
  1: 'border-accent-magenta/40',
  2: 'border-accent-amber/40',
  3: 'border-accent-emerald/40',
} as const;

const FUNC_FORMULA: Record<'F' | 'G' | 'H' | 'I', string> = {
  F: '(B ∧ C) ∨ (¬B ∧ D)',
  G: '(B ∧ D) ∨ (C ∧ ¬D)',
  H: 'B ⊕ C ⊕ D',
  I: 'C ⊕ (B ∨ ¬D)',
};

export default function OperationStage({
  step,
  level,
}: {
  step: Extract<Md5Step, { kind: 'operation' }>;
  level: ExplanationLevel;
}) {
  const roundColor = ROUND_COLOR[step.roundIndex];
  const roundBorder = ROUND_BORDER[step.roundIndex];

  return (
    <section className="space-y-4">
      {/* Title bar */}
      <div className="panel p-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg w-10 h-10 flex items-center justify-center font-mono font-bold text-xl ${roundColor} border ${roundBorder} bg-bg-soft/60`}>
            {step.funcName}
          </div>
          <div>
            <div className="text-xs font-mono text-fg-subtle">
              блок {step.blockIndex + 1} · операция {step.opIndex + 1}/64 (раунд {step.roundIndex + 1})
            </div>
            <div className={`text-base font-mono font-bold ${roundColor}`}>
              {FUNC_FORMULA[step.funcName]}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <ConstantPill label="K" value={step.k} />
          <ConstantPill label="s" value={step.s} isShift />
          <ConstantPill label={`M[${step.mIndex}]`} value={step.m} />
        </div>
      </div>

      {/* Formula chain */}
      <div className="panel p-5 space-y-4">
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle">Формула операции</div>
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm">
          <Op label="B" value={step.before.b} tone="b" />
          <span className="text-fg-subtle">+</span>
          <span className="text-fg-subtle">rot</span>
          <span className="text-fg-subtle">(</span>
          <Op label={step.funcName} value={step.funcOutput} tone="func" />
          <span className="text-fg-subtle">+</span>
          <Op label="A" value={step.before.a} tone="a" />
          <span className="text-fg-subtle">+</span>
          <Op label="K" value={step.k} tone="k" small />
          <span className="text-fg-subtle">+</span>
          <Op label="M" value={step.m} tone="m" small />
          <span className="text-fg-subtle">,</span>
          <span className={`font-bold ${roundColor}`}>{step.s}</span>
          <span className="text-fg-subtle">)</span>
          <span className="mx-2 text-fg-subtle">=</span>
          <Op label="B′" value={step.after.b} tone="result" />
        </div>

        {level === 'hard' && (
          <div className="panel-inset p-4 space-y-3 font-mono text-xs">
            <SubStep label={`${step.funcName}(B,C,D)`} value={step.funcOutput} />
            <SubStep label={`+ A`} value={step.substates.fPlusA} delta={step.before.a} />
            <SubStep label={`+ K[${step.opIndex}]`} value={step.substates.plusK} delta={step.k} />
            <SubStep label={`+ M[${step.mIndex}]`} value={step.substates.plusM} delta={step.m} />
            <SubStep
              label={`rot(…, ${step.s})`}
              value={step.substates.rotated}
              icon={<RotateCw className="w-3 h-3" />}
            />
            <SubStep label={`B + rotated = B′`} value={step.after.b} delta={step.before.b} isResult />
          </div>
        )}
      </div>

      {/* Buffer transition */}
      <div className="panel p-5 space-y-4">
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
          Как меняются регистры в этой операции
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-4 gap-3">
            <BufferCell label="A" value={step.before.a} size="sm" />
            <BufferCell label="B" value={step.before.b} size="sm" />
            <BufferCell label="C" value={step.before.c} size="sm" />
            <BufferCell label="D" value={step.before.d} size="sm" />
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            {['A', 'B', 'C', 'D'].map((label) => (
              <div key={label} className="flex flex-col items-center gap-2 py-4">
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="text-fg-subtle"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
                <div className="text-[11px] font-semibold text-fg">{label}′</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-3">
            <BufferCell label="A" value={step.after.a} highlight size="sm" />
            <BufferCell label="B" value={step.after.b} highlight size="sm" />
            <BufferCell label="C" value={step.after.c} highlight size="sm" />
            <BufferCell label="D" value={step.after.d} highlight size="sm" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 text-[11px] text-fg-muted">
          <div className="text-center">A′ = D</div>
          <div className="text-center">B′ = B + rot(...)</div>
          <div className="text-center">C′ = B</div>
          <div className="text-center">D′ = C</div>
        </div>

        <div className="text-xs text-fg-subtle leading-relaxed">
          После вычисления B′ регистры сдвигаются: новый A берёт старое значение D, новый D берёт старое C, новый C — старое B, а B заменяется на вычисленный B′.
        </div>

        {level === 'hard' && (
          <div className="panel-inset p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-fg-subtle">Побитово B′</div>
            <BitRow
              value={step.after.b}
              tone={step.roundIndex === 0 ? 'cyan' : step.roundIndex === 1 ? 'magenta' : step.roundIndex === 2 ? 'amber' : 'emerald'}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function ConstantPill({ label, value, isShift }: { label: string; value: number; isShift?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-soft/60 px-2 py-1">
      <span className="text-fg-subtle">{label}:</span>
      <span className="text-fg font-semibold">{isShift ? value : `0x${wordToHex(value)}`}</span>
    </span>
  );
}

function Op({
  label,
  value,
  tone,
  small,
}: {
  label: string;
  value: number;
  tone: 'a' | 'b' | 'k' | 'm' | 'func' | 'result';
  small?: boolean;
}) {
  const color =
    tone === 'a'
      ? 'text-buffer-a border-buffer-a/40'
      : tone === 'b'
        ? 'text-buffer-b border-buffer-b/40'
        : tone === 'k'
          ? 'text-fg-muted border-border'
          : tone === 'm'
            ? 'text-accent-cyan border-accent-cyan/40'
            : tone === 'func'
              ? 'text-accent-magenta border-accent-magenta/40'
              : 'text-accent-amber border-accent-amber/40';
  return (
    <span
      className={`inline-flex flex-col items-center rounded-lg border bg-bg-soft/40 px-2 ${small ? 'py-0.5' : 'py-1'} ${color}`}
    >
      <span className="text-[9px] uppercase tracking-wider opacity-70">{label}</span>
      <span className="font-bold text-xs">{wordToHex(value)}</span>
    </span>
  );
}

function SubStep({
  label,
  value,
  delta,
  icon,
  isResult,
}: {
  label: string;
  value: number;
  delta?: number;
  icon?: React.ReactNode;
  isResult?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-2 py-1 rounded ${isResult ? 'bg-accent-amber/10 text-accent-amber' : ''}`}
    >
      <span className="flex items-center gap-1.5 text-fg-muted">
        {icon}
        {label}
      </span>
      <span className="flex items-center gap-2">
        {delta !== undefined && (
          <span className="text-[10px] text-fg-subtle">(+{wordToHex(delta)})</span>
        )}
        <span className="font-bold">{wordToHex(value)}</span>
      </span>
    </div>
  );
}
