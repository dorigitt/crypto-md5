import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  FastForward,
  Pause,
  Play,
  Rewind,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { useVisualizer } from '@/store/visualizer';
import { cn } from '@/lib/utils/cn';
import InteractiveTask from '@/components/visualizer/InteractiveTask';

export default function StepPlayer() {
  const { t } = useTranslation();

  const {
    visibleSteps,
    index,
    isPlaying,
    speedMs,
    unlockedIndex,
    stepForward,
    stepBack,
    toggle,
    stepTo,
    setSpeed,
  } = useVisualizer();

  useEffect(() => {
    if (!isPlaying) return;

    const id = window.setInterval(() => {
      useVisualizer.getState().stepForward();
    }, speedMs);

    return () => window.clearInterval(id);
  }, [isPlaying, speedMs]);

  const total = visibleSteps.length;
  const disabled = total === 0;
  const atEnd = index >= total - 1;
  const atStart = index <= 0;
  const nextLocked = index >= unlockedIndex;

  return (
    <section className="panel p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => stepTo(0)}
          disabled={disabled || atStart}
          className="btn-icon"
          title={t('visualizer.player.prev')}
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => stepBack()}
          disabled={disabled || atStart}
          className="btn-icon"
          title={t('visualizer.player.prev')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggle}
          disabled={disabled || nextLocked}
          className={cn(
            'inline-flex items-center justify-center w-11 h-11 rounded-xl border transition-all',
            isPlaying
              ? 'border-accent-magenta/50 bg-accent-magenta/10 text-accent-magenta'
              : 'border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan hover:shadow-glow',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          )}
          title={isPlaying ? t('visualizer.player.pause') : t('visualizer.player.play')}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={() => stepForward()}
          disabled={disabled || atEnd || nextLocked}
          className="btn-icon"
          title={t('visualizer.player.next')}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => stepTo(total - 1)}
          disabled={true}
          className="btn-icon"
          title={t('visualizer.player.next')}
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <div className="ml-auto flex items-center gap-2 text-xs font-mono text-fg-muted">
          <Rewind className="w-3.5 h-3.5 text-accent-cyan" />

          <input
            type="range"
            min={120}
            max={2400}
            step={60}
            value={2520 - speedMs}
            onChange={(e) => setSpeed(2520 - Number(e.target.value))}
            className="w-28 accent-accent-cyan"
          />

          <FastForward className="w-3.5 h-3.5 text-accent-magenta" />

          <span className="tabular-nums w-16 text-right">
            {speedMs} ms
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] text-fg-subtle font-mono w-28 shrink-0">
          {disabled ? '— / —' : t('visualizer.player.step_of', { current: index + 1, total })}
        </span>

        <div className="relative flex-1 h-2 rounded-full bg-bg-soft border border-border overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-cyan via-accent-magenta to-accent-amber transition-all duration-200"
            style={{
              width: disabled ? '0%' : `${((index + 1) / total) * 100}%`,
            }}
          />

          {!disabled && (
            <input
              type="range"
              min={0}
              max={total - 1}
              value={index}
              onChange={(e) => stepTo(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          )}
        </div>
      </div>

      <InteractiveTask />
    </section>
  );
}