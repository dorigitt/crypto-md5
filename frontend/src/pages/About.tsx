import { useTranslation } from 'react-i18next';
import { Github, Sparkles } from 'lucide-react';

const STACK = [
  'React 18 + TypeScript strict',
  'Vite 5',
  'Tailwind CSS 3',
  'Framer Motion',
  'Zustand',
  'TanStack Query + Axios',
  'React Router 6',
  'i18next',
  'Vitest + Testing Library',
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 max-w-4xl">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{t('about.title')}</h1>
      </header>

      <section className="panel p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-cyan" />
          <h2 className="text-lg font-semibold">{t('about.goal_title')}</h2>
        </div>
        <p className="text-sm text-fg-muted leading-relaxed">{t('about.goal_desc')}</p>
      </section>

      <section className="panel p-6 space-y-4">
        <h2 className="text-lg font-semibold">{t('about.stack_title')}</h2>
        <div className="flex flex-wrap gap-2">
          {STACK.map((s) => (
            <span
              key={s}
              className="inline-flex items-center rounded-lg border border-border bg-bg-soft px-3 py-1 text-xs font-mono text-fg-muted"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="panel p-6 space-y-4">
        <h2 className="text-lg font-semibold">{t('about.team_title')}</h2>
        <p className="text-xs text-fg-subtle italic">
          Список участников — заполняется командой перед защитой.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="panel-inset p-4 space-y-1">
              <div className="text-sm font-semibold">Участник {n}</div>
              <div className="text-[11px] font-mono text-fg-subtle">роль / вклад</div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-6 space-y-3">
        <h2 className="text-lg font-semibold">Ссылки</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://datatracker.ietf.org/doc/html/rfc1321"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs"
          >
            RFC 1321 — MD5
          </a>
          <a
            href="https://datatracker.ietf.org/doc/html/rfc2104"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs"
          >
            RFC 2104 — HMAC
          </a>
          <a href="#" className="btn-ghost text-xs">
            <Github className="w-3.5 h-3.5" />
            {t('footer.source')}
          </a>
        </div>
      </section>
    </div>
  );
}
