import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TaskList from '@/components/education/TaskList';
import TaskDetail from '@/components/education/TaskDetail';
import MetricsCard from '@/components/education/MetricsCard';
import type { Difficulty } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';

const FILTERS: Array<{ value: Difficulty | 'ALL'; labelKey: string }> = [
  { value: 'ALL', labelKey: 'education.filter_all' },
  { value: 'EASY', labelKey: 'education.filter_easy' },
  { value: 'MEDIUM', labelKey: 'education.filter_medium' },
  { value: 'HARD', labelKey: 'education.filter_hard' },
];

export default function EducationTaskPage() {
  const { t } = useTranslation();
  const { taskId } = useParams();
  const [filter, setFilter] = useState<Difficulty | 'ALL'>('ALL');

  if (!taskId) return <Navigate to="/education" replace />;

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{t('education.title')}</h1>
        <p className="text-sm text-fg-muted">{t('education.subtitle')}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="panel p-2 flex gap-1 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                  filter === f.value
                    ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/40'
                    : 'text-fg-muted hover:bg-bg-raised border border-transparent',
                )}
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>

          <TaskList filter={filter} />

          <MetricsCard />
        </div>

        <TaskDetail taskId={taskId} />
      </div>
    </div>
  );
}
