import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const LANGS = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
] as const;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language.startsWith('en') ? 'en' : 'ru';

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-bg-panel/50 p-0.5">
      <Globe className="w-3.5 h-3.5 text-fg-subtle ml-1.5" />
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => i18n.changeLanguage(code)}
          className={cn(
            'px-2 py-1 text-xs font-mono rounded-md transition-colors',
            current === code
              ? 'bg-bg-raised text-accent-cyan'
              : 'text-fg-subtle hover:text-fg',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
