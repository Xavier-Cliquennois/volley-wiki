import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Head } from '../seo/Head';
import { buildBreadcrumb } from '../seo/structuredData';
import { useCurrentLang } from '../i18n/paths';

export default function ScenariosBeach() {
  const { t } = useTranslation('scenariosBeach');
  const { t: tSeo } = useTranslation('seo');
  const lang = useCurrentLang();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Head
        title={tSeo('scenariosBeach.title')}
        description={tSeo('scenariosBeach.description')}
        path="/beach/scenarios"
        jsonLd={buildBreadcrumb(
          [
            { name: tSeo('breadcrumbs.home'), path: '/' },
            { name: tSeo('breadcrumbs.beach'), path: '/beach' },
            { name: tSeo('breadcrumbs.beachScenarios'), path: '/beach/scenarios' },
          ],
          lang,
        )}
      />
      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          {t('header.kicker')}
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          {t('header.title')}
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.7, maxWidth: 600 }}>
          {t('header.subtitle')}
        </p>
      </div>

      <section
        style={{
          background: 'var(--yellow)',
          border: '4px solid var(--ink)',
          boxShadow: 'var(--shadow-lg)',
          padding: '40px 32px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            padding: '6px 14px',
            background: 'var(--pink)',
            border: '3px solid var(--ink)',
            boxShadow: 'var(--shadow-sm)',
            transform: 'rotate(8deg)',
            fontFamily: '"Bungee", sans-serif',
            fontSize: 10,
            letterSpacing: '0.18em',
          }}
        >
          {t('placeholder.label')}
        </span>
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 14 }} aria-hidden>🚧</div>
          <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 30, margin: '0 0 16px', letterSpacing: '0.02em' }}>
            {t('placeholder.title')}
          </h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, maxWidth: 560 }}>
            {t('placeholder.body')}
          </p>
        </div>
      </section>

      <div>
        <div
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 11,
            letterSpacing: '0.18em',
            color: 'var(--orange)',
            marginBottom: 14,
          }}
        >
          {t('placeholder.meanwhileTitle')}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          {[
            { to: `/${lang}/beach/positions`, accent: 'var(--teal)', key: 'signals' },
            { to: `/${lang}/beach/guides`, accent: 'var(--pink)', key: 'guides' },
            { to: `/${lang}/beach/techniques`, accent: 'var(--orange)', key: 'techniques' },
          ].map(card => (
            <Link
              key={card.to}
              to={card.to}
              style={{
                display: 'block',
                background: 'var(--cream)',
                border: '3px solid var(--ink)',
                boxShadow: 'var(--shadow)',
                padding: 18,
                textDecoration: 'none',
                color: 'var(--ink)',
                position: 'relative',
                transition: 'transform 0.08s, box-shadow 0.08s',
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
              <span
                style={{
                  position: 'absolute',
                  top: -10,
                  right: 14,
                  padding: '2px 10px',
                  background: card.accent,
                  border: '2.5px solid var(--ink)',
                  fontFamily: '"Bungee", sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                }}
              >
                →
              </span>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 15, letterSpacing: '0.03em' }}>
                {t(`placeholder.links.${card.key}`)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
