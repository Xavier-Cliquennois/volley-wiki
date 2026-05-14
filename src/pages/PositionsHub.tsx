import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Head } from '../seo/Head';
import { TEAM_SIZES, type TeamSizeSlug } from '../seo/constants';
import { buildBreadcrumb, buildWebSite } from '../seo/structuredData';
import { useCurrentLang } from '../i18n/paths';

const FORMAT_COLOR: Record<TeamSizeSlug, string> = {
  '6v6': 'var(--orange)',
  '5v5': 'var(--teal)',
  '4v4': 'var(--pink)',
};

export default function PositionsHub() {
  const { t } = useTranslation('positions');
  const { t: tCommon } = useTranslation('common');
  const { t: tSeo } = useTranslation('seo');
  const lang = useCurrentLang();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Head
        title={tSeo('positionsHub.title')}
        description={tSeo('positionsHub.description')}
        path="/positions"
        jsonLd={[
          buildWebSite(lang),
          buildBreadcrumb(
            [
              { name: tSeo('breadcrumbs.home'), path: '/' },
              { name: tSeo('breadcrumbs.positions'), path: '/positions' },
            ],
            lang,
          ),
        ]}
      />

      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          {t('hub.kicker')}
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          {t('hub.title')}
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.75, maxWidth: 720, lineHeight: 1.6 }}>
          <Trans i18nKey="hub.intro" t={t} components={{ strong: <strong /> }} />
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {TEAM_SIZES.map((size) => {
          const tagline = t(`hub.formats.${size}.tagline`);
          const description = t(`hub.formats.${size}.description`);
          const color = FORMAT_COLOR[size];
          return (
            <Link
              key={size}
              to={`/${lang}/positions/${size}`}
              style={{
                border: '3px solid var(--ink)',
                background: 'var(--cream)',
                boxShadow: 'var(--shadow)',
                padding: 24,
                textDecoration: 'none',
                color: 'var(--ink)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                transition: 'transform 0.08s, box-shadow 0.08s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '6px 6px 0 var(--ink)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = 'var(--shadow)';
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  alignSelf: 'flex-start',
                  padding: '6px 14px',
                  background: color,
                  border: '2.5px solid var(--ink)',
                  fontFamily: '"Bungee", sans-serif',
                  fontSize: 16,
                  letterSpacing: '0.04em',
                  color: size === '5v5' ? 'var(--cream)' : 'var(--ink)',
                }}
              >
                {size.toUpperCase()}
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.08em', opacity: 0.65 }}>
                {tagline}
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{description}</p>
              <div style={{ marginTop: 4, fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.08em', color: 'var(--orange)' }}>
                {tCommon('actions.explore')}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
