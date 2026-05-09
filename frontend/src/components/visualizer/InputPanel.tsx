import { useTranslation } from 'react-i18next';
import { RotateCcw, ShieldCheck, Type, Zap } from 'lucide-react';
import { useVisualizer } from '@/store/visualizer';
import { cn } from '@/lib/utils/cn';
import Badge from './atoms/Badge';

export default function InputPanel() {
  const { t } = useTranslation();
  const { text, mode, setText, compute, reset, status } = useVisualizer();

  const disabled = text.length === 0;

  return (
    <section className="panel p-5 sm:p-6 space-y-5 grid-bg">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-cyan" />
            {mode === 'md5' ? t('visualizer.mode_md5') : t('visualizer.mode_hmac')}
          </h2>
          <p className="text-xs text-fg-muted mt-1">
            {mode === 'md5' ? t('visualizer.mode_hint_md5') : t('visualizer.mode_hint_hmac')}
          </p>
        </div>
        <Badge tone={mode === 'md5' ? 'cyan' : 'magenta'}>
          <ShieldCheck className="w-3 h-3" />
          {mode === 'md5' ? 'plain MD5' : 'HMAC-MD5 (RFC 2104)'}
        </Badge>
      </div>

      <label className="block space-y-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-fg-muted">
          <Type className="w-3.5 h-3.5" />
          {t('visualizer.input_text_label')}
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('visualizer.input_text_placeholder')}
          rows={4}
          className={cn(
            'w-full resize-none rounded-lg border border-border bg-bg-soft/70 p-3',
            'font-mono text-sm text-fg placeholder:text-fg-subtle/70',
            'focus:border-accent-cyan/50 focus:outline-none focus:ring-2 focus:ring-accent-cyan/20 transition-colors',
          )}
        />
        <div className="text-[10px] text-fg-subtle font-mono">
          {new TextEncoder().encode(text).length} байт · {text.length} символов
        </div>
      </label>

      <div className="flex items-center gap-3 pt-1">
        <button type="button" onClick={compute} disabled={disabled} className="btn-primary">
          <Zap className="w-4 h-4" />
          {t('visualizer.hash_button')}
        </button>
        {status !== 'idle' && (
          <button type="button" onClick={reset} className="btn-ghost">
            <RotateCcw className="w-4 h-4" />
            {t('visualizer.reset_button')}
          </button>
        )}
      </div>
    </section>
  );
}
