import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Award, Target, TrendingUp } from 'lucide-react';
import { fetchUserMetrics } from '@/lib/api/education';
import type { Difficulty } from '@/lib/api/types';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  EASY: 'bg-accent-cyan',
  MEDIUM: 'bg-accent-magenta',
  HARD: 'bg-accent-amber',
};

export default function MetricsCard() {
  const { t } = useTranslation();
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['metrics'],
    queryFn: fetchUserMetrics,
  });

  if (isLoading || !metrics) {
    return <div className="panel p-5 h-32 shimmer rounded-2xl" />;
  }

  return (
    <section className="panel p-5 space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-accent-cyan" />
        <h3 className="text-sm font-semibold">{t('education.metrics.title')}</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat icon={<Award className="w-3.5 h-3.5 text-accent-amber" />} label={t('education.metrics.total_points')} value={metrics.totalPoints} />
        <Stat icon={<Target className="w-3.5 h-3.5 text-accent-emerald" />} label={t('education.metrics.solved')} value={metrics.solvedCount} />
        <Stat icon={<TrendingUp className="w-3.5 h-3.5 text-accent-magenta" />} label={t('education.metrics.attempts')} value={metrics.attemptCount} />
      </div>

      <div className="pt-3 border-t border-border space-y-2.5">
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
          {t('education.metrics.by_difficulty')}
        </div>
        {(Object.keys(metrics.byDifficulty) as Difficulty[]).map((diff) => {
          const { solved, total } = metrics.byDifficulty[diff];
          const pct = total === 0 ? 0 : (solved / total) * 100;
          return (
            <div key={diff} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-fg-muted">
                <span className="uppercase tracking-wider">{diff.toLowerCase()}</span>
                <span className="font-mono">{solved} / {total}</span>
              </div>
              <div className="h-1.5 rounded-full bg-bg-raised overflow-hidden">
                <div
                  className={`h-full ${DIFFICULTY_COLORS[diff]} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="panel-inset p-2.5 flex flex-col items-center gap-1">
      {icon}
      <div className="text-xl font-mono font-bold">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-fg-subtle text-center leading-tight">{label}</div>
    </div>
  );
}
