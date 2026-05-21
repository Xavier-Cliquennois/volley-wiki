import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GuidePositionnement from '../guides/GuidePositionnement';
import { useConfigurations } from './Positions';
import { Head } from '../seo/Head';
import { DEFAULT_POSITION_CONFIG, TEAM_SIZES, type TeamSizeSlug } from '../seo/constants';
import { buildArticle, buildBreadcrumb } from '../seo/structuredData';
import { useCurrentLang } from '../i18n/paths';
import { QuizEmbed } from '../quiz/components/QuizEmbed';

const SLUG_TO_SIZE = { '4v4': 4, '5v5': 5, '6v6': 6 } as const;

export default function GuideDefenseSized() {
  const { size: sizeParam, config: configParam } = useParams<{ size: string; config: string }>();
  const { t: tGuides } = useTranslation('guides');
  const { t: tSeo } = useTranslation('seo');
  const { t: tCommon } = useTranslation('common');
  const allConfigurations = useConfigurations();
  const lang = useCurrentLang();

  const isValidSize = !!sizeParam && (TEAM_SIZES as readonly string[]).includes(sizeParam);

  if (!isValidSize) {
    return <Navigate to={`/${lang}/guides/positionnement-defense`} replace />;
  }

  const sizeSlug = sizeParam as TeamSizeSlug;
  const teamSize = SLUG_TO_SIZE[sizeSlug];
  const configurations = allConfigurations[teamSize];

  const configIsValid = !!configParam && configurations.some(c => c.id === configParam);
  if (configParam && !configIsValid) {
    return <Navigate to={`/${lang}/guides/positionnement-defense/${sizeSlug}/${DEFAULT_POSITION_CONFIG[sizeSlug]}`} replace />;
  }
  const configId = configIsValid ? configParam! : DEFAULT_POSITION_CONFIG[sizeSlug];
  const configuration = configurations.find(c => c.id === configId) ?? configurations[0];

  const guideTitle = tGuides('list.positionnement-defense.title');
  const guideSubtitle = tGuides('list.positionnement-defense.subtitle');
  const guideCategory = tGuides('list.positionnement-defense.category');
  const guideLevel = tGuides('list.positionnement-defense.level');
  const guideReadingTime = tGuides('list.positionnement-defense.readingTime');

  const canonicalPath = `/guides/positionnement-defense/${sizeSlug}/${configId}`;
  const teamSizeLabel = tCommon(`teamSize.${sizeSlug}`);
  const title = tSeo('defenseSized.title', { size: sizeSlug, config: configuration.shortName });
  const description = tSeo('defenseSized.description', {
    size: sizeSlug,
    label: teamSizeLabel,
    configName: configuration.name,
  });
  const articleHeadline = tSeo('defenseSized.articleHeadline', { size: sizeSlug, config: configuration.shortName });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Head
        title={title}
        description={description}
        path={canonicalPath}
        ogType="article"
        jsonLd={[
          buildBreadcrumb(
            [
              { name: tSeo('breadcrumbs.home'), path: '/' },
              { name: tSeo('breadcrumbs.guides'), path: '/guides' },
              { name: tSeo('breadcrumbs.defense'), path: '/guides/positionnement-defense' },
              { name: sizeSlug.toUpperCase(), path: `/guides/positionnement-defense/${sizeSlug}` },
              { name: configuration.shortName, path: canonicalPath },
            ],
            lang,
          ),
          buildArticle({
            headline: articleHeadline,
            description,
            path: canonicalPath,
            lang,
          }),
        ]}
      />

      <Link
        to={`/${lang}/guides/positionnement-defense`}
        style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'var(--orange)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        {tGuides('defenseSized.backLink')}
      </Link>

      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          ★ {guideCategory.toUpperCase()} · {sizeSlug.toUpperCase()}
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(26px, 4vw, 38px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          {guideTitle} — {sizeSlug.toUpperCase()}
        </h1>
        <p style={{ margin: '0 0 14px 0', fontSize: 15, opacity: 0.7 }}>{guideSubtitle}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            padding: '3px 12px',
            border: '2.5px solid var(--ink)',
            background: 'var(--cream)',
            fontFamily: '"DM Mono", monospace',
            fontSize: 11,
          }}>{guideLevel}</span>
          <span style={{
            padding: '3px 12px',
            border: '2.5px solid var(--ink)',
            background: 'var(--cream)',
            fontFamily: '"DM Mono", monospace',
            fontSize: 11,
          }}>{guideReadingTime}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
        <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.2em', color: 'var(--orange)', whiteSpace: 'nowrap' }}>
          {tGuides('detail.sectionTitle')}
        </span>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
      </div>

      <GuidePositionnement teamSize={teamSize} configId={configId} />

      <QuizEmbed slug="placement-defense" />
    </div>
  );
}
