import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpenCheck, Eye, Hash, Key, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-16 pb-12">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-bg-panel/50 p-8 sm:p-12 grid-bg">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent-cyan/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-accent-magenta/10 blur-3xl" />
        </div>
        <div className="relative max-w-3xl space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/40 bg-accent-cyan/10 px-3 py-1 text-xs font-semibold text-accent-cyan"
          >
            <Hash className="w-3 h-3" />
            {t('home.hero_badge')}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold leading-tight text-gradient-primary"
          >
            {t('home.hero_title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-base sm:text-lg text-fg-muted leading-relaxed"
          >
            {t('home.hero_subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3 pt-3 flex-wrap"
          >
            <Link to="/visualizer" className="btn-primary">
              <Eye className="w-4 h-4" />
              {t('home.cta_visualize')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/education" className="btn-ghost">
              <BookOpenCheck className="w-4 h-4" />
              {t('home.cta_education')}
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-bold">{t('home.features_title')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Layers className="w-5 h-5" />}
            title={t('home.feature_1_title')}
            desc={t('home.feature_1_desc')}
            tone="cyan"
          />
          <FeatureCard
            icon={<Eye className="w-5 h-5" />}
            title={t('home.feature_2_title')}
            desc={t('home.feature_2_desc')}
            tone="magenta"
          />
          <FeatureCard
            icon={<Key className="w-5 h-5" />}
            title={t('home.feature_3_title')}
            desc={t('home.feature_3_desc')}
            tone="amber"
          />
          <FeatureCard
            icon={<BookOpenCheck className="w-5 h-5" />}
            title={t('home.feature_4_title')}
            desc={t('home.feature_4_desc')}
            tone="emerald"
          />
        </div>
      </section>

      <section className="panel p-8 space-y-4 grid-bg">
        <h2 className="text-xl font-bold">{t('home.algo_title')}</h2>
        <p className="text-sm text-fg-muted leading-relaxed max-w-3xl">{t('home.algo_desc')}</p>
        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          <Fact label="Длина выхода" value="128 бит · 16 байт" />
          <Fact label="Размер блока" value="512 бит · 64 байта" />
          <Fact label="Операций на блок" value="64 · 4 раунда" />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tone: 'cyan' | 'magenta' | 'amber' | 'emerald';
}) {
  const toneClass =
    tone === 'cyan'
      ? 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/[0.03]'
      : tone === 'magenta'
        ? 'text-accent-magenta border-accent-magenta/30 bg-accent-magenta/[0.03]'
        : tone === 'amber'
          ? 'text-accent-amber border-accent-amber/30 bg-accent-amber/[0.03]'
          : 'text-accent-emerald border-accent-emerald/30 bg-accent-emerald/[0.03]';
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className={`panel p-5 border transition-all ${toneClass}`}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-fg text-sm mb-1">{title}</h3>
      <p className="text-xs text-fg-muted leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel-inset p-4">
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="text-base font-mono font-bold text-fg mt-1">{value}</div>
    </div>
  );
}
