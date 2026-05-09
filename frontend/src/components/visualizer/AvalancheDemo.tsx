import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wand2 } from 'lucide-react';
import { useVisualizer } from '@/store/visualizer';
import { md5Text } from '@/lib/crypto/md5';
import { hmacMd5Text } from '@/lib/crypto/hmac-md5';

const HEX = '0123456789abcdef';

function flipFirstBit(text: string): string {
  if (text.length === 0) return '\x01';
  const bytes = new TextEncoder().encode(text);
  bytes[0] = bytes[0] ^ 0x01;
  try {
    return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  } catch {
    return text + '!';
  }
}

function diffMask(a: string, b: string): boolean[] {
  const len = Math.max(a.length, b.length);
  const mask: boolean[] = [];
  for (let i = 0; i < len; i++) mask.push(a[i] !== b[i]);
  return mask;
}

function diffPercent(a: string, b: string): number {
  if (a.length === 0) return 0;
  const aNibbles = a.split('').map((c) => HEX.indexOf(c.toLowerCase()));
  const bNibbles = b.split('').map((c) => HEX.indexOf(c.toLowerCase()));
  let diffBits = 0;
  let totalBits = 0;
  const n = Math.min(aNibbles.length, bNibbles.length);
  for (let i = 0; i < n; i++) {
    const x = aNibbles[i] ^ bNibbles[i];
    let y = x;
    while (y) {
      diffBits += y & 1;
      y >>>= 1;
    }
    totalBits += 4;
  }
  return totalBits > 0 ? (diffBits / totalBits) * 100 : 0;
}

export default function AvalancheDemo() {
  const { t } = useTranslation();
  const { text, key, mode } = useVisualizer();
  const [expanded, setExpanded] = useState(false);

  const comparison = useMemo(() => {
    if (text.length === 0) return null;
    const flipped = flipFirstBit(text);
    const original = mode === 'hmac-md5' ? hmacMd5Text(text, key).hex : md5Text(text).hex;
    const modified = mode === 'hmac-md5' ? hmacMd5Text(flipped, key).hex : md5Text(flipped).hex;
    return { original, modified, mask: diffMask(original, modified), pct: diffPercent(original, modified) };
  }, [text, key, mode]);

  if (!comparison) return null;

  return (
    <section className="panel p-5 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-accent-magenta" />
          <h3 className="text-sm font-semibold">{t('visualizer.avalanche.title')}</h3>
        </div>
        <div className="text-xs font-mono text-fg-muted">
          различаются <span className="text-accent-magenta font-bold">{comparison.pct.toFixed(0)}%</span> бит
        </div>
      </div>

      <p className="text-xs text-fg-muted">{t('visualizer.avalanche.desc')}</p>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="panel-inset p-3 space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-accent-cyan">
            {t('visualizer.avalanche.original')}
          </div>
          <div className="font-mono text-sm break-all">
            {comparison.original.split('').map((c, i) => (
              <span key={i} className={comparison.mask[i] ? 'text-accent-cyan' : 'text-fg-muted'}>
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="panel-inset p-3 space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-accent-magenta">
            {t('visualizer.avalanche.modified', { bit: 1 })}
          </div>
          <div className="font-mono text-sm break-all">
            {comparison.modified.split('').map((c, i) => (
              <span key={i} className={comparison.mask[i] ? 'text-accent-magenta' : 'text-fg-muted'}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!expanded && (
        <button type="button" className="text-[11px] text-fg-subtle hover:text-accent-cyan" onClick={() => setExpanded(true)}>
          Почему так ↓
        </button>
      )}
      {expanded && (
        <div className="panel-inset p-3 text-xs text-fg-muted leading-relaxed">
          <p>
            Идеальная хеш-функция должна менять в среднем половину бит выхода при изменении одного бита
            входа (строгий лавинный критерий). MD5 к этому близок, поэтому даже минимальное изменение
            на входе даёт совершенно другой отпечаток.
          </p>
          <button
            type="button"
            className="text-accent-cyan mt-2 text-[11px]"
            onClick={() => setExpanded(false)}
          >
            Свернуть ↑
          </button>
        </div>
      )}
    </section>
  );
}
