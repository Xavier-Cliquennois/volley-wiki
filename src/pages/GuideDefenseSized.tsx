import { Link, Navigate, useParams } from 'react-router-dom';
import { GUIDES } from '../guides/data';
import GuidePositionnement from '../guides/GuidePositionnement';
import { CONFIGURATIONS } from './Positions';
import { Head } from '../seo/Head';
import { DEFAULT_POSITION_CONFIG, TEAM_SIZES, TEAM_SIZE_LABEL, type TeamSizeSlug } from '../seo/constants';
import { buildArticle, buildBreadcrumb } from '../seo/structuredData';

const SLUG_TO_SIZE = { '4v4': 4, '5v5': 5, '6v6': 6 } as const;

export default function GuideDefenseSized() {
  const { size: sizeParam, config: configParam } = useParams<{ size: string; config: string }>();
  const isValidSize = !!sizeParam && (TEAM_SIZES as readonly string[]).includes(sizeParam);

  if (!isValidSize) {
    return <Navigate to="/guides/positionnement-defense" replace />;
  }

  const sizeSlug = sizeParam as TeamSizeSlug;
  const teamSize = SLUG_TO_SIZE[sizeSlug];
  const configurations = CONFIGURATIONS[teamSize];

  const configIsValid = !!configParam && configurations.some(c => c.id === configParam);
  if (configParam && !configIsValid) {
    return <Navigate to={`/guides/positionnement-defense/${sizeSlug}/${DEFAULT_POSITION_CONFIG[sizeSlug]}`} replace />;
  }
  const configId = configIsValid ? configParam! : DEFAULT_POSITION_CONFIG[sizeSlug];
  const configuration = configurations.find(c => c.id === configId) ?? configurations[0];

  const guide = GUIDES.find(g => g.slug === 'positionnement-defense')!;

  // Canonical always points to the explicit /:size/:config URL — visiting
  // /:size alone consolidates ranking to /:size/:defaultConfig.
  const canonicalPath = `/guides/positionnement-defense/${sizeSlug}/${configId}`;
  const title = `Positionnement défensif ${sizeSlug} — ${configuration.shortName} | Volley-Wiki`;
  const description = `Guide complet du positionnement défensif au volley ${TEAM_SIZE_LABEL[sizeSlug]} en système ${configuration.name} : zones de responsabilité, défense par zone d'attaque adverse.`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Head
        title={title}
        description={description}
        path={canonicalPath}
        ogType="article"
        jsonLd={[
          buildBreadcrumb([
            { name: 'Accueil', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: 'Positionnement défensif', path: '/guides/positionnement-defense' },
            { name: sizeSlug.toUpperCase(), path: `/guides/positionnement-defense/${sizeSlug}` },
            { name: configuration.shortName, path: canonicalPath },
          ]),
          buildArticle({
            headline: `Positionnement défensif ${sizeSlug} — ${configuration.shortName}`,
            description,
            path: canonicalPath,
          }),
        ]}
      />

      <Link
        to="/guides/positionnement-defense"
        style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'var(--orange)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        ← TOUS LES FORMATS
      </Link>

      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          ★ {guide.category.toUpperCase()} · {sizeSlug.toUpperCase()}
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(26px, 4vw, 38px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          {guide.title} — {sizeSlug.toUpperCase()}
        </h1>
        <p style={{ margin: '0 0 14px 0', fontSize: 15, opacity: 0.7 }}>{guide.subtitle}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            padding: '3px 12px',
            border: '2.5px solid var(--ink)',
            background: 'var(--cream)',
            fontFamily: '"DM Mono", monospace',
            fontSize: 11,
          }}>{guide.level}</span>
          <span style={{
            padding: '3px 12px',
            border: '2.5px solid var(--ink)',
            background: 'var(--cream)',
            fontFamily: '"DM Mono", monospace',
            fontSize: 11,
          }}>{guide.readingTime}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
        <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.2em', color: 'var(--orange)', whiteSpace: 'nowrap' }}>
          ★ CONTENU DU GUIDE ★
        </span>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
      </div>

      <GuidePositionnement teamSize={teamSize} configId={configId} />
    </div>
  );
}
