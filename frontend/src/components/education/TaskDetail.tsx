import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle2, HelpCircle, Send, Star } from 'lucide-react';
import { fetchTaskDetail, submitAnswer } from '@/lib/api/education';
import type { SubmissionResult } from '@/lib/api/types';
import { cn } from '@/lib/utils/cn';

export default function TaskDetail({ taskId }: { taskId: string }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => fetchTaskDetail(taskId),
  });

  const [answer, setAnswer] = useState('');
  const [shownHints, setShownHints] = useState<number[]>([]);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const mutation = useMutation({
    mutationFn: () => submitAnswer(taskId, { answer }),
    onSuccess: (res) => {
      setResult(res);
      if (res.correct) {
        void qc.invalidateQueries({ queryKey: ['tasks'] });
        void qc.invalidateQueries({ queryKey: ['metrics'] });
      }
    },
  });

  if (isLoading || !task) {
    return (
      <div className="panel p-6 space-y-3">
        <div className="h-6 w-1/2 rounded bg-bg-soft shimmer" />
        <div className="h-3 w-full rounded bg-bg-soft shimmer" />
        <div className="h-3 w-3/4 rounded bg-bg-soft shimmer" />
      </div>
    );
  }

  return (
    <div className="panel p-6 space-y-5">
      <header className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xl font-bold">{task.title}</h2>
          {task.solved && (
            <span className="inline-flex items-center gap-1 rounded-full border border-accent-emerald/40 bg-accent-emerald/10 px-2 py-0.5 text-[11px] text-accent-emerald">
              <CheckCircle2 className="w-3 h-3" />
              {t('education.solved_badge')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-fg-muted">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-accent-amber" />
            {task.points}
          </span>
          <span className="text-fg-subtle">·</span>
          <span className="uppercase tracking-wider">{task.difficulty.toLowerCase()}</span>
          <span className="text-fg-subtle">·</span>
          <span>{task.category.toLowerCase().replace('_', ' ')}</span>
        </div>
      </header>

      <section className="panel-inset p-4 space-y-3">
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle">Условие</div>
        <p className="text-sm leading-relaxed whitespace-pre-line">{task.description}</p>
        <div className="grid sm:grid-cols-2 gap-3 text-xs text-fg-muted">
          <div>
            <div className="text-fg-subtle text-[10px] uppercase">Вход</div>
            <div className="font-mono">{task.inputSpec}</div>
          </div>
          <div>
            <div className="text-fg-subtle text-[10px] uppercase">Формат ответа</div>
            <div className="font-mono">{task.expectedFormat}</div>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <label className="block text-xs font-medium text-fg-muted">Ваш ответ</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={3}
          className={cn(
            'w-full resize-none rounded-lg border border-border bg-bg-soft/70 p-3',
            'font-mono text-sm text-fg placeholder:text-fg-subtle/70',
            'focus:border-accent-cyan/50 focus:outline-none focus:ring-2 focus:ring-accent-cyan/20',
          )}
          placeholder="Введите ответ…"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || answer.length === 0}
          >
            <Send className="w-4 h-4" />
            {result?.correct ? t('education.submit_again') : t('education.submit')}
          </button>
        </div>
      </section>

      {result && (
        <section
          className={cn(
            'panel-inset p-4 space-y-2',
            result.correct
              ? 'border-accent-emerald/40 bg-accent-emerald/5'
              : 'border-accent-magenta/40 bg-accent-magenta/5',
          )}
        >
          <div className="flex items-center gap-2 font-semibold text-sm">
            {result.correct ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
                <span className="text-accent-emerald">{t('education.correct')}</span>
                <span className="ml-auto text-[11px] text-accent-amber">+{result.pointsAwarded}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-accent-magenta" />
                <span className="text-accent-magenta">{t('education.incorrect')}</span>
              </>
            )}
          </div>
          <div className="text-xs text-fg-muted">{result.feedback}</div>
          {result.expectedAnswer && (
            <div className="text-[11px] font-mono text-fg-subtle">
              {t('education.expected_answer')}: <span className="text-fg">{result.expectedAnswer}</span>
            </div>
          )}
        </section>
      )}

      {task.hints.length > 0 && (
        <section className="space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle flex items-center gap-1.5">
            <HelpCircle className="w-3 h-3" />
            Подсказки
          </div>
          <div className="space-y-2">
            {task.hints.map((hint) => {
              const shown = shownHints.includes(hint.order);
              return (
                <div key={hint.order} className="panel-inset p-3">
                  {shown ? (
                    <div className="text-xs text-fg">{hint.text}</div>
                  ) : (
                    <button
                      type="button"
                      className="text-[11px] text-accent-cyan hover:text-accent-magenta transition-colors"
                      onClick={() => setShownHints((s) => [...s, hint.order])}
                    >
                      {t('education.hint_button', { cost: hint.cost })}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
