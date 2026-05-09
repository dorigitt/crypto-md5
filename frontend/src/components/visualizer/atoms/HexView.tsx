import { bytesToAscii, bytesToHex } from '@/lib/crypto/formatters';
import { cn } from '@/lib/utils/cn';

export interface HexViewProps {
  bytes: Uint8Array | number[];
  /** Width of the grid in bytes; defaults to 16 (classic hex dump). */
  columns?: number;
  /** Paint ranges with different colours — e.g. padding, length-appended. */
  highlights?: Array<{ from: number; to: number; tone: 'msg' | 'pad' | 'len' | 'key' | 'hash' }>;
  showAscii?: boolean;
  showOffset?: boolean;
  maxRows?: number;
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<HexViewProps['highlights']>[number]['tone'], string> = {
  msg: 'bg-transparent text-fg',
  pad: 'bg-accent-magenta/15 text-accent-magenta',
  len: 'bg-accent-amber/15 text-accent-amber',
  key: 'bg-accent-emerald/15 text-accent-emerald',
  hash: 'bg-accent-cyan/15 text-accent-cyan',
};

function toneForOffset(
  offset: number,
  highlights?: HexViewProps['highlights'],
): keyof typeof TONE_CLASSES {
  if (!highlights) return 'msg';
  for (const h of highlights) {
    if (offset >= h.from && offset < h.to) return h.tone;
  }
  return 'msg';
}

export default function HexView({
  bytes,
  columns = 16,
  highlights,
  showAscii = true,
  showOffset = true,
  maxRows,
  className,
}: HexViewProps) {
  const rows = Math.ceil(bytes.length / columns);
  const visibleRows = maxRows ? Math.min(rows, maxRows) : rows;
  const truncated = visibleRows < rows;

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-bg-soft/70 p-5 font-mono text-[13px] overflow-x-auto',
        className,
      )}
    >
      <div className="inline-block min-w-full">
        {Array.from({ length: visibleRows }).map((_, rowIdx) => {
          const start = rowIdx * columns;
          const end = Math.min(start + columns, bytes.length);
          return (
            <div key={rowIdx} className="flex items-center gap-6 leading-[1.9] whitespace-nowrap">
              {showOffset && (
                <span className="text-fg-subtle">
                  {start.toString(16).padStart(4, '0')}
                </span>
              )}
              <span className="flex gap-2">
                {Array.from({ length: columns }).map((_, col) => {
                  const offset = start + col;
                  if (offset >= end) return <span key={col} className="w-[26px]" />;
                  const tone = toneForOffset(offset, highlights);
                  return (
                    <span
                      key={col}
                      className={cn('inline-block w-[26px] py-0.5 text-center rounded', TONE_CLASSES[tone])}
                    >
                      {bytes[offset] === -1 ? '??' : bytes[offset].toString(16).padStart(2, '0')}
                    </span>
                  );
                })}
              </span>
              {showAscii && (
                <span className="flex gap-0 text-fg-muted">
                  {Array.from({ length: end - start }).map((_, i) => {
                    const offset = start + i;
                    const tone = toneForOffset(offset, highlights);
                    const currentByte = bytes[offset];
                    const ch =
                      currentByte === -1
                        ? ' '
                        : bytesToAscii(new Uint8Array([currentByte]), ' ');
                    return (
                      <span
                        key={i}
                        className={cn('inline-block w-[13px] text-center', TONE_CLASSES[tone])}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </span>
              )}
            </div>
          );
        })}
        {truncated && (
          <div className="text-fg-subtle mt-2 text-[11px] italic">
            … скрыто {rows - visibleRows} строк ({bytes.length} байт всего)
          </div>
        )}
      </div>
    </div>
  );
}

export function compactHash(bytes: Uint8Array): string {
  return bytesToHex(bytes);
}
