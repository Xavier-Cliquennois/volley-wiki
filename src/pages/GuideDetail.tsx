import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GUIDES } from '../guides/data';
import GuideService from '../guides/GuideService';
import GuideReception from '../guides/GuideReception';
import GuideAttaque from '../guides/GuideAttaque';
import GuideContre from '../guides/GuideContre';
import GuideLectureDuJeu from '../guides/GuideLectureDuJeu';
import GuideIndoorBeach from '../guides/GuideIndoorBeach';
import { Head } from '../seo/Head';
import { TEAM_SIZES } from '../seo/constants';
import { buildArticle, buildBreadcrumb } from '../seo/structuredData';
import { useCurrentLang } from '../i18n/paths';

// Each guide is a single data-driven component that reads its content from
// the `guideContent` i18n namespace, so we no longer need a per-language
// component map. The defensive-positioning guide has its own page
// (`GuideDefenseSized`) because of its team-size/configuration routing.
const COMPONENTS: Record<string, React.ComponentType> = {
  service: GuideService,
  reception: GuideReception,
  attaque: GuideAttaque,
  contre: GuideContre,
  'lecture-du-jeu': GuideLectureDuJeu,
  'indoor-vs-beach': GuideIndoorBeach,
};

const DEFENSE_SLUG = 'positionnement-defense';

export default function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('guides');
  const { t: tSeo } = useTranslation('seo');
  const { t: tCommon } = useTranslation('common');
  const lang = useCurrentLang();

  const guide = slug ? GUIDES.find(g => g.slug === slug) : undefined;

  if (!guide) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Head
          title={tSeo('guideNotFound.title')}
          description={tSeo('guideNotFound.description')}
          path={`/guides/${slug ?? ''}`}
          noindex
        />
        <Link
          to={`/${lang}/guides`}
          style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'var(--orange)', textDecoration: 'none' }}
        >
          {t('detail.backLink')}
        </Link>
        <p style={{ opacity: 0.6 }}>{t('detail.notFound')}</p>
      </div>
    );
  }

  const title = t(`list.${guide.slug}.title`);
  const subtitle = t(`list.${guide.slug}.subtitle`);
  const description = t(`list.${guide.slug}.description`);
  const category = t(`list.${guide.slug}.category`);
  const level = t(`list.${guide.slug}.level`);
  const readingTime = t(`list.${guide.slug}.readingTime`);

  if (guide.slug === DEFENSE_SLUG) {
    const path = `/guides/${DEFENSE_SLUG}`;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Head
          title={tSeo('defenseHub.title', { title })}
          description={tSeo('defenseHub.description', { description })}
          path={path}
          jsonLd={buildBreadcrumb(
            [
              { name: tSeo('breadcrumbs.home'), path: '/' },
              { name: tSeo('breadcrumbs.guides'), path: '/guides' },
              { name: title, path },
            ],
            lang,
          )}
        />

        <Link
          to={`/${lang}/guides`}
          style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'var(--orange)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          {t('defenseHub.backLink')}
        </Link>

        <div>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
            ★ {category.toUpperCase()}
          </div>
          <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(26px, 4vw, 38px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
            {title}
          </h1>
          <p style={{ margin: '0 0 14px 0', fontSize: 15, opacity: 0.7, maxWidth: 680 }}>
            {t('defenseHub.description')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {TEAM_SIZES.map(size => (
            <Link
              key={size}
              to={`/${lang}/guides/${DEFENSE_SLUG}/${size}`}
              style={{
                border: '3px solid var(--ink)',
                background: 'var(--cream)',
                boxShadow: 'var(--shadow)',
                padding: 22,
                textDecoration: 'none',
                color: 'var(--ink)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{
                display: 'inline-block',
                alignSelf: 'flex-start',
                padding: '6px 14px',
                background: 'var(--orange)',
                border: '2.5px solid var(--ink)',
                fontFamily: '"Bungee", sans-serif',
                fontSize: 16,
                letterSpacing: '0.04em',
              }}>{size.toUpperCase()}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.08em', opacity: 0.65 }}>
                {tCommon(`teamSize.${size}`)}
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, opacity: 0.8 }}>
                {t('defenseHub.cardDescription', { size })}
              </p>
              <div style={{ marginTop: 'auto', fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.08em', color: 'var(--orange)' }}>
                {tCommon('actions.readGuide')}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const Component = COMPONENTS[guide.slug];
  if (!Component) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Link
          to={`/${lang}/guides`}
          style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'var(--orange)', textDecoration: 'none' }}
        >
          {t('detail.backLink')}
        </Link>
        <p style={{ opacity: 0.6 }}>{t('detail.notFound')}</p>
      </div>
    );
  }

  const path = `/guides/${guide.slug}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Head
        title={tSeo('guideDetail.title', { title })}
        description={description}
        path={path}
        ogType="article"
        jsonLd={[
          buildBreadcrumb(
            [
              { name: tSeo('breadcrumbs.home'), path: '/' },
              { name: tSeo('breadcrumbs.guides'), path: '/guides' },
              { name: title, path },
            ],
            lang,
          ),
          buildArticle({
            headline: title,
            description,
            path,
            lang,
          }),
        ]}
      />

      <Link
        to={`/${lang}/guides`}
        style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'var(--orange)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        {t('detail.backLink')}
      </Link>

      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          ★ {category.toUpperCase()}
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(26px, 4vw, 38px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          {title}
        </h1>
        <p style={{ margin: '0 0 14px 0', fontSize: 15, opacity: 0.7 }}>{subtitle}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            padding: '3px 12px',
            border: '2.5px solid var(--ink)',
            background: 'var(--cream)',
            fontFamily: '"DM Mono", monospace',
            fontSize: 11,
          }}>{level}</span>
          <span style={{
            padding: '3px 12px',
            border: '2.5px solid var(--ink)',
            background: 'var(--cream)',
            fontFamily: '"DM Mono", monospace',
            fontSize: 11,
          }}>{readingTime}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
        <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.2em', color: 'var(--orange)', whiteSpace: 'nowrap' }}>
          {t('detail.sectionTitle')}
        </span>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
      </div>

      <Component />
    </div>
  );
}
