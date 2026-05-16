import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BEACH_GUIDES } from '../guides/beach/data';
import { Head } from '../seo/Head';
import { buildArticle, buildBreadcrumb } from '../seo/structuredData';
import { useCurrentLang } from '../i18n/paths';

type GuideSectionItem = { title: string; body: string };
type GuideSection = {
  id: string;
  title: string;
  intro?: string;
  body?: string;
  items?: GuideSectionItem[];
};

export default function GuideBeachDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation('guidesBeach');
  const { t: tContent } = useTranslation('guideContentBeach');
  const { t: tSeo } = useTranslation('seo');
  const lang = useCurrentLang();

  const guide = slug ? BEACH_GUIDES.find(g => g.slug === slug) : undefined;

  if (!guide) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Head
          title={tSeo('guideNotFound.title')}
          description={tSeo('guideNotFound.description')}
          path={`/beach/guides/${slug ?? ''}`}
          noindex
        />
        <Link
          to={`/${lang}/beach/guides`}
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

  const intro = tContent(`${guide.slug}.intro`);
  const sections = tContent(`${guide.slug}.sections`, { returnObjects: true }) as GuideSection[];

  const path = `/beach/guides/${guide.slug}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Head
        title={tSeo('guideBeachDetail.title', { title })}
        description={description}
        path={path}
        ogType="article"
        jsonLd={[
          buildBreadcrumb(
            [
              { name: tSeo('breadcrumbs.home'), path: '/' },
              { name: tSeo('breadcrumbs.beach'), path: '/beach' },
              { name: tSeo('breadcrumbs.beachGuides'), path: '/beach/guides' },
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
        to={`/${lang}/beach/guides`}
        style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'var(--orange)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        {t('detail.backLink')}
      </Link>

      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--orange)', marginBottom: 10 }}>
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

      {intro && (
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.65, maxWidth: 760 }}>{intro}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {sections.map(section => (
          <section key={section.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, letterSpacing: '0.04em', color: 'var(--teal)' }}>{section.title}</span>
              <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
            </div>
            {section.intro && (
              <p style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.55, opacity: 0.8 }}>{section.intro}</p>
            )}
            {section.body && (
              <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.55 }}>{section.body}</p>
            )}
            {section.items && section.items.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      borderLeft: '5px solid var(--orange)',
                      paddingLeft: 14,
                      paddingTop: 4,
                      paddingBottom: 4,
                      background: 'linear-gradient(90deg, rgba(226,84,46,0.06), transparent 40%)',
                    }}
                  >
                    <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.03em', marginBottom: 4 }}>
                      {item.title}
                    </div>
                    <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, opacity: 0.85 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
