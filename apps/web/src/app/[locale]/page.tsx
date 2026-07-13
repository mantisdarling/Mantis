import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MANTIS — Stop guessing, start talking.',
  description: 'Connect with vetted expert mentors for 1-on-1 live sessions with escrow payments.',
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomePageClient locale={locale} />;
}

function HomePageClient({ locale }: { locale: string }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations('Index');

  const features = [
    {
      icon: '🎥',
      title: t('feature1Title'),
      desc: t('feature1Desc'),
      gradient: 'from-indigo-500/20 to-purple-500/20',
      border: 'border-indigo-500/20',
    },
    {
      icon: '🔒',
      title: t('feature2Title'),
      desc: t('feature2Desc'),
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/20',
    },
    {
      icon: '🤖',
      title: t('feature3Title'),
      desc: t('feature3Desc'),
      gradient: 'from-pink-500/20 to-indigo-500/20',
      border: 'border-pink-500/20',
    },
  ];

  const trust = [t('trustStat1'), t('trustStat2'), t('trustStat3')];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#09090b',
        color: '#fafafa',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Background orbs ── */}
      <div
        className="orb-pulse"
        style={{
          position: 'fixed',
          top: '-15%',
          left: '-10%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        className="orb-pulse"
        style={{
          position: 'fixed',
          bottom: '-15%',
          right: '-10%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
          animationDelay: '4s',
        }}
      />

      {/* ── Navbar ── */}
      <nav
        className="glass-panel"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 2rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
        }}
      >
        <Link href={`/${locale}`} style={{ textDecoration: 'none' }}>
          <span
            className="gradient-text"
            style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}
          >
            MANTIS
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link href={`/${locale}/login`} className="btn-ghost" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            {t('login')}
          </Link>
          <Link href={`/${locale}/register`} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            {t('getStarted')}
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '8rem 1.5rem 4rem',
        }}
      >
        {/* Badge */}
        <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
          <span
            className="glass-panel"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1.1rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: '#818cf8',
              letterSpacing: '0.02em',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', display: 'inline-block', boxShadow: '0 0 8px #6366f1' }} />
            {t('badge')}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up-delay-1"
          style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            marginBottom: '1.5rem',
            maxWidth: '800px',
          }}
        >
          <span style={{ color: '#fafafa', display: 'block' }}>{t('titlePart1')}</span>
          <span className="gradient-text" style={{ display: 'block' }}>{t('titlePart2')}</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in-up-delay-2"
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#a1a1aa',
            lineHeight: 1.7,
            maxWidth: '600px',
            marginBottom: '3rem',
          }}
        >
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-in-up-delay-3"
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}
        >
          <Link href={`/${locale}/dashboard`} className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2.25rem' }}>
            {t('ctaLearner')} →
          </Link>
          <Link href={`/${locale}/register`} className="btn-ghost" style={{ fontSize: '1rem', padding: '0.9rem 2.25rem' }}>
            {t('ctaExpert')}
          </Link>
        </div>

        {/* Trust stats */}
        <div
          className="animate-fade-in-up-delay-3"
          style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {trust.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 500 }}>{stat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '6rem 1.5rem',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            color: '#fafafa',
          }}
        >
          {t('featuresTitle')}
        </h2>
        <p style={{ textAlign: 'center', color: '#71717a', marginBottom: '3.5rem', fontSize: '1rem' }}>
          Purpose-built for serious learners and seasoned professionals.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-panel card-hover"
              style={{
                padding: '2rem',
                borderRadius: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '0.875rem',
                  background: `linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fafafa' }}>{f.title}</h3>
              <p style={{ color: '#71717a', lineHeight: 1.7, fontSize: '0.9rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          color: '#52525b',
          fontSize: '0.85rem',
        }}
      >
        <span className="gradient-text" style={{ fontWeight: 700, fontSize: '1rem' }}>MANTIS</span>
        <span style={{ margin: '0 0.75rem' }}>·</span>
        Stop guessing, start talking.
        <span style={{ margin: '0 0.75rem' }}>·</span>
        © {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  );
}
