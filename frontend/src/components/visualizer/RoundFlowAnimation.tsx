import { motion } from 'framer-motion';

const left = [
  { label: 'A', value: '0x67452301', color: 'text-accent-cyan' },
  { label: 'B', value: '0xEFCDAB89', color: 'text-accent-amber' },
  { label: 'C', value: '0x98BADCFE', color: 'text-orange-400' },
  { label: 'D', value: '0x10325476', color: 'text-accent-magenta' },
];

const right = [
  { label: "A'", value: '0x10325476', color: 'text-accent-magenta' },
  { label: "B'", value: '0xD76AA478', color: 'text-accent-cyan' },
  { label: "C'", value: '0xEFCDAB89', color: 'text-accent-amber' },
  { label: "D'", value: '0x98BADCFE', color: 'text-orange-400' },
];

function AnimatedPath({
  d,
  color,
  delay,
}: {
  d: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay, duration: 1.1, ease: 'easeInOut' }}
    />
  );
}

export default function RoundFlowAnimation() {
  return (
    <div className="panel-inset p-6 overflow-hidden">
      <div className="relative mx-auto h-[430px] max-w-[920px]">

        {/* LEFT REGISTERS */}
        <div className="absolute left-0 top-[118px] w-[290px] space-y-3">
          {left.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.45 }}
              className="h-[58px] rounded-xl border border-border bg-bg-raised px-4 py-3 font-mono text-left"
            >
              <span className="text-fg-subtle">{r.label}</span>{' '}
              <span className={r.color}>{r.value}</span>
            </motion.div>
          ))}
        </div>

        {/* RIGHT REGISTERS */}
        <div className="absolute right-0 top-[118px] w-[290px] space-y-3">
          {right.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.2 + i * 0.15, duration: 0.45 }}
              className="h-[58px] rounded-xl border border-border bg-bg-raised px-4 py-3 font-mono text-left"
            >
              <span className="text-fg-subtle">{r.label}</span>{' '}
              <span className={r.color}>{r.value}</span>
            </motion.div>
          ))}
        </div>

        {/* COMBINE ABOVE */}
        <motion.div
          initial={{ opacity: 0, y: -18, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="absolute left-1/2 top-[18px] z-20 -translate-x-1/2 rounded-2xl border border-accent-cyan/60 bg-accent-cyan/10 px-8 py-4 text-center shadow-lg shadow-accent-cyan/20"
        >
          <div className="font-bold text-accent-cyan">COMBINE</div>
          <div className="mt-1 text-[11px] text-fg-muted">
            A + F(B,C,D) + M[i] + K[i]
          </div>
        </motion.div>

        {/* M[i] + K[i] */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="absolute left-1/2 top-[95px] z-20 -translate-x-1/2 rounded-xl border border-border bg-bg-raised px-4 py-2 font-mono text-sm text-accent-cyan"
        >
          M[i] + K[i]
        </motion.div>

        {/* SVG LINES */}
        <svg
          className="absolute inset-0 z-10 h-full w-full overflow-visible"
          viewBox="0 0 920 430"
          preserveAspectRatio="none"
        >
          {/* A -> Combine */}
          <AnimatedPath
            d="M 290 147 C 370 147, 380 70, 460 70"
            color="#7dd3fc"
            delay={1.0}
          />

          {/* Combine -> B' */}
          <AnimatedPath
            d="M 460 70 C 540 70, 540 218, 630 218"
            color="#7dd3fc"
            delay={1.4}
          />

          {/* B -> C' */}
          <AnimatedPath
            d="M 290 218 C 420 218, 500 289, 630 289"
            color="#facc15"
            delay={1.6}
          />

          {/* C -> D' */}
          <AnimatedPath
            d="M 290 289 C 420 289, 500 360, 630 360"
            color="#fb923c"
            delay={1.8}
          />

          {/* D -> A' */}
          <AnimatedPath
            d="M 290 360 C 420 360, 500 147, 630 147"
            color="#c084fc"
            delay={2.0}
          />
        </svg>

        {/* EXPLANATION */}

      </div>
    </div>
  );
}