import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, CheckCircle2, Flame, Star, Zap } from 'lucide-react';
import { fetchTasks } from '@/lib/api/education';
import type { Difficulty, TaskCategory, TaskSummary } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';

const DIFFICULTY_META: Record<
  Difficulty,
  { labelKey: string; tone: 'cyan' | 'magenta' | 'amber' }
> = {
  EASY: { labelKey: 'education.difficulty_easy', tone: 'cyan' },
  MEDIUM: { labelKey: 'education.difficulty_medium', tone: 'magenta' },
  HARD: { labelKey: 'education.difficulty_hard', tone: 'amber' },
};

const CATEGORY_LABEL_KEYS: Record<TaskCategory, string> = {
  PADDING: 'education.category_padding',
  ROUND_FUNCTION: 'education.category_round_function',
  FULL_HASH: 'education.category_full_hash',
  HMAC: 'education.category_hmac',
  COLLISION: 'education.category_collision',
  THEORY: 'education.category_theory',
};

export default function TaskList({
  filter,
}: {
  filter: Difficulty | 'ALL';
}) {
  const { t } = useTranslation();
  const { taskId } = useParams();
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => fetchTasks(filter === 'ALL' ? undefined : { difficulty: filter }),
  });

  if (isLoading) {
    return (
      <div className="panel p-4 space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 rounded-lg bg-bg-soft shimmer" />
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="panel p-6 text-center text-sm text-fg-muted">
        {t('education.task_list_empty')}
      </div>
    );
  }

  return (
    <div className="panel p-2 space-y-1.5 overflow-auto max-h-[72vh]">
      {tasks.map((task) => (
        <TaskListItem key={task.id} task={task} active={taskId === task.id} />
      ))}
    </div>
  );
}

function TaskListItem({ task, active }: { task: TaskSummary; active: boolean }) {
  const { t } = useTranslation();
  const diff = DIFFICULTY_META[task.difficulty];
  return (
    <Link
      to={`/education/${task.id}`}
      className={cn(
        'group block rounded-lg px-3 py-2.5 transition-colors border',
        active
          ? 'border-accent-cyan/50 bg-accent-cyan/10'
          : 'border-transparent hover:border-border-strong hover:bg-bg-raised',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {task.solved ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald flex-shrink-0" />
            ) : (
              <BookOpen className="w-3.5 h-3.5 text-fg-subtle flex-shrink-0" />
            )}
            <span className="font-medium text-sm truncate">{task.title}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-fg-muted font-mono">
            <DifficultyBadge difficulty={task.difficulty} tone={diff.tone} />
            <span className="text-fg-subtle">·</span>
            <span>{t(CATEGORY_LABEL_KEYS[task.category])}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-accent-amber shrink-0">
          <Star className="w-3 h-3" />
          <span>{task.points}</span>
        </div>
      </div>
    </Link>
  );
}

function DifficultyBadge({
  difficulty,
  tone,
}: {
  difficulty: Difficulty;
  tone: 'cyan' | 'magenta' | 'amber';
}) {
  const cls =
    tone === 'cyan'
      ? 'text-accent-cyan'
      : tone === 'magenta'
        ? 'text-accent-magenta'
        : 'text-accent-amber';
  const Icon = difficulty === 'HARD' ? Flame : Zap;
  return (
    <span className={`inline-flex items-center gap-1 ${cls}`}>
      <Icon className="w-2.5 h-2.5" />
      {difficulty.toLowerCase()}
    </span>
  );
}
