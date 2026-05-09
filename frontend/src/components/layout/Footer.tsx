import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border mt-8">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-fg-subtle">
        <span>{t('footer.built_with')}</span>
        <span className="font-mono">© 2026 CryptoLab · MD5</span>
      </div>
    </footer>
  );
}
