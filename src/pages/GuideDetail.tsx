import { useParams, Link } from 'react-router-dom';
import { GUIDES } from '../guides/data';
import GuideService from '../guides/GuideService';
import GuideReception from '../guides/GuideReception';
import GuideAttaque from '../guides/GuideAttaque';
import GuideContre from '../guides/GuideContre';
import { Head } from '../seo/Head';
import { TEAM_SIZES, TEAM_SIZE_LABEL } from '../seo/constants';
import { buildArticle, buildBreadcrumb } from '../seo/structuredData';

const COMPONENTS: Record<string, React.ComponentType> = {
  'service': GuideService,
  'reception': GuideReception,
  'attaque': GuideAttaque,
  'contre': GuideContre,
};

const DEFENSE_SLUG = 'positionnement-defense';

export default function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? GUIDES.find(g => g.slug === slug) : undefined;

  if (!guide) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Head
          title="Guide introuvable | Volley-Wiki"
          description="Ce guide n'existe pas. Revenez à la liste des guides."
          path={`/guides/${slug ?? ''}`}
          noindex
        />
        <Link
          to="/guides"
          style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'var(--orange)', textDecoration: 'none' }}
        >
          ← GUIDES
        </Link>
        <p style={{ opacity: 0.6 }}>Guide introuvable.</p>
      </div>
    );
  }

  // Special-case: positionnement-defense is a hub page — content lives at
  // /guides/positionnement-defense/:size (one variant per team format).
  if (guide.slug === DEFENSE_SLUG) {
    const path = `/guides/${DEFENSE_SLUG}`;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Head
          title={`${guide.title} — 6v6, 5v5, 4v4 | Volley-Wiki`}
          description={`${guide.description} Guide adapté aux formats 6 contre 6, 5 contre 5 et 4 contre 4.`}
          path={path}
          jsonLd={buildBreadcrumb([
            { name: 'Accueil', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: guide.title, path },
          ])}
        />

        <Link
          to="/guides"
          style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'var(--orange)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          ← GUIDES
        </Link>

        <div>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
            ★ {guide.category.toUpperCase()}
          </div>
          <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(26px, 4vw, 38px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
            {guide.title}
          </h1>
          <p style={{ margin: '0 0 14px 0', fontSize: 15, opacity: 0.7, maxWidth: 680 }}>
            Le positionnement défensif change selon le nombre de joueurs sur le terrain. Choisissez votre format pour accéder au guide complet : zones de responsabilité, systèmes (A/B, man-up, 1-2-2…) et adaptation par zone d'attaque adverse.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {TEAM_SIZES.map(size => (
            <Link
              key={size}
              to={`/guides/${DEFENSE_SLUG}/${size}`}
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
                {TEAM_SIZE_LABEL[size]}
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, opacity: 0.8 }}>
                Défense adaptée au format {size}, zones, systèmes et placements détaillés.
              </p>
              <div style={{ marginTop: 'auto', fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.08em', color: 'var(--orange)' }}>
                LIRE LE GUIDE →
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
          to="/guides"
          style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'var(--orange)', textDecoration: 'none' }}
        >
          ← GUIDES
        </Link>
        <p style={{ opacity: 0.6 }}>Guide introuvable.</p>
      </div>
    );
  }

  const path = `/guides/${guide.slug}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Head
        title={`${guide.title} | Volley-Wiki`}
        description={guide.description}
        path={path}
        ogType="article"
        jsonLd={[
          buildBreadcrumb([
            { name: 'Accueil', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: guide.title, path },
          ]),
          buildArticle({
            headline: guide.title,
            description: guide.description,
            path,
          }),
        ]}
      />

      {/* Breadcrumb */}
      <Link
        to="/guides"
        style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'var(--orange)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        ← GUIDES
      </Link>

      {/* Guide header */}
      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          ★ {guide.category.toUpperCase()}
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(26px, 4vw, 38px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          {guide.title}
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

      {/* Horizontal rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
        <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.2em', color: 'var(--orange)', whiteSpace: 'nowrap' }}>
          ★ CONTENU DU GUIDE ★
        </span>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
      </div>

      <Component />
    </div>
  );
}
