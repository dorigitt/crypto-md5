import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpenCheck, Hash, Home as HomeIcon, Info } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_ITEMS = [
  { to: '/', key: 'home', icon: HomeIcon },
  { to: '/visualizer', key: 'visualizer', icon: Hash },
  { to: '/education', key: 'education', icon: BookOpenCheck },
  { to: '/about', key: 'about', icon: Info },
] as const;

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/70 backdrop-blur-xl">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center gap-6">
        <NavLink to="/" className="flex items-center gap-3 group">
          <span className="relative flex w-9 h-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-magenta/20 border border-border-strong">
            <Hash className="w-5 h-5 text-accent-cyan group-hover:text-accent-magenta transition-colors" />
            <span className="absolute inset-0 rounded-xl ring-1 ring-accent-cyan/0 group-hover:ring-accent-cyan/30 transition-all" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-gradient-primary">{t('app.title')}</span>
            <span className="text-[11px] text-fg-subtle font-mono -mt-0.5">MD5 · HMAC</span>
          </div>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {NAV_ITEMS.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  isActive
                    ? 'bg-bg-raised text-accent-cyan border border-border-strong'
                    : 'text-fg-muted hover:text-fg hover:bg-bg-raised/50',
                )
              }
            >
              <Icon className="w-4 h-4" />
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>

      <nav className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
        {NAV_ITEMS.map(({ to, key, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 flex items-center gap-1.5 border',
                isActive
                  ? 'bg-bg-raised text-accent-cyan border-border-strong'
                  : 'text-fg-muted border-transparent',
              )
            }
          >
            <Icon className="w-3.5 h-3.5" />
            {t(`nav.${key}`)}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
