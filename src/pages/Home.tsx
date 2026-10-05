import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Head } from '../seo/Head';
import { buildBreadcrumb, buildWebSite } from '../seo/structuredData';
import { useCurrentLang } from '../i18n/paths';

type Feature = {
  label: string;
  title: string;
  desc: string;
  to: string;
  accent: string;
};

export default function Home() {
  const { t } = useTranslation();
  const { t: tHome } = useTranslation('home');
  const { t: tSeo } = useTranslation('seo');
  const lang = useCurrentLang();

  const features = tHome('features', { returnObjects: true }) as Feature[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
      <Head
        title={tSeo('home.title')}
        description={tSeo('home.description')}
        path="/"
        jsonLd={[
          buildWebSite(lang),
          buildBreadcrumb([{ name: tSeo('breadcrumbs.home'), path: '/' }], lang),
        ]}
      />
      <section style={{ paddingTop: 24 }}>
        <div style={{
          display: 'inline-block',
          padding: '4px 14px',
          background: 'var(--pink)',
          border: '3px solid var(--ink)',
          boxShadow: 'var(--shadow-sm)',
          transform: 'rotate(-2deg)',
          marginBottom: 20,
          fontFamily: '"Bungee", sans-serif',
          fontSize: 11,
          letterSpacing: '0.1em',
        }}>
          {tHome('ribbon')}
        </div>
        <h1 style={{
          fontFamily: '"Bungee", sans-serif',
          fontSize: 'clamp(56px, 8vw, 96px)',
          lineHeight: 0.92,
          margin: '0 0 20px 0',
          letterSpacing: '-0.01em',
        }}>
          <span style={{ color: 'var(--orange)', textShadow: '4px 4px 0 var(--ink)' }}>{tHome('hero.logoTop')}</span>
          <br />
          <span style={{ color: 'var(--teal)', textShadow: '4px 4px 0 var(--ink)' }}>{tHome('hero.logoBottom')}</span>
        </h1>
        <p style={{ fontSize: 17, maxWidth: 480, margin: '0 0 28px 0', color: 'var(--ink)', opacity: 0.75 }}>
          {tHome('hero.subtitle')}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to={`/${lang}/guides/techniques-de-base`} style={{
            padding: '12px 24px',
            background: 'var(--orange)',
            border: '3px solid var(--ink)',
            boxShadow: 'var(--shadow)',
            fontFamily: '"Bungee", sans-serif',
            fontSize: 13,
            letterSpacing: '0.06em',
            color: 'var(--ink)',
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'transform 0.08s, box-shadow 0.08s',
          }}>
            {tHome('hero.ctaPrimary')}
          </Link>
          <Link to={`/${lang}/rules`} style={{
            padding: '12px 24px',
            background: 'var(--cream)',
            border: '3px solid var(--ink)',
            boxShadow: 'var(--shadow)',
            fontFamily: '"Bungee", sans-serif',
            fontSize: 13,
            letterSpacing: '0.06em',
            color: 'var(--ink)',
            textDecoration: 'none',
            display: 'inline-block',
          }}>
            {tHome('hero.ctaSecondary')}
          </Link>
        </div>
      </section>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
        <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.2em', color: 'var(--orange)', whiteSpace: 'nowrap' }}>{tHome('sectionsLabel')}</span>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {features.map(f => (
          <Link
            key={f.to}
            to={`/${lang}${f.to}`}
            style={{
              display: 'block',
              background: 'var(--cream)',
              border: '3px solid var(--ink)',
              boxShadow: 'var(--shadow)',
              padding: 24,
              textDecoration: 'none',
              color: 'var(--ink)',
              transition: 'transform 0.08s, box-shadow 0.08s',
              position: 'relative',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '7px 7px 0 var(--ink)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = '';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)';
            }}
          >
            <div style={{
              position: 'absolute', top: -10, right: 14,
              padding: '2px 10px',
              background: f.accent,
              border: '2.5px solid var(--ink)',
              fontFamily: '"Bungee", sans-serif',
              fontSize: 10,
              letterSpacing: '0.1em',
            }}>{f.label}</div>
            <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 22, margin: '0 0 10px 0', letterSpacing: '0.03em' }}>{f.title}</h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, opacity: 0.75 }}>{f.desc}</p>
            <div style={{
              marginTop: 16,
              fontFamily: '"Bungee", sans-serif',
              fontSize: 10,
              letterSpacing: '0.12em',
              color: 'var(--orange)',
            }}>
              {t('actions.explore')}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
