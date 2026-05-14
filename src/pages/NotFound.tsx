import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Head } from '../seo/Head';
import { useCurrentLang } from '../i18n/paths';

export default function NotFound() {
  const { t } = useTranslation('common');
  const { t: tSeo } = useTranslation('seo');
  const lang = useCurrentLang();
  const heading = tSeo('notFound.title').replace(' | Volley-Wiki', '').toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 32 }}>
      <Head
        title={tSeo('notFound.title')}
        description={tSeo('notFound.description')}
        path="/404"
        noindex
      />
      <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)' }}>
        ★ 404
      </div>
      <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(36px, 6vw, 64px)', margin: 0, letterSpacing: '0.03em' }}>
        {heading}
      </h1>
      <p style={{ margin: 0, fontSize: 16, opacity: 0.7, maxWidth: 600 }}>
        {tSeo('notFound.description')}
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
        <Link
          to={`/${lang}`}
          style={{
            padding: '12px 24px',
            border: '3px solid var(--ink)',
            background: 'var(--orange)',
            boxShadow: 'var(--shadow-sm)',
            fontFamily: '"Bungee", sans-serif',
            fontSize: 13,
            letterSpacing: '0.06em',
            color: 'var(--ink)',
            textDecoration: 'none',
          }}
        >
          ← {t('nav.home').toUpperCase()}
        </Link>
        <Link
          to={`/${lang}/guides`}
          style={{
            padding: '12px 24px',
            border: '3px solid var(--ink)',
            background: 'var(--cream)',
            fontFamily: '"Bungee", sans-serif',
            fontSize: 13,
            letterSpacing: '0.06em',
            color: 'var(--ink)',
            textDecoration: 'none',
          }}
        >
          {t('nav.guides').toUpperCase()}
        </Link>
      </div>
    </div>
  );
}
