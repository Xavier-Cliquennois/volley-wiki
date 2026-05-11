import { useParams, Link } from 'react-router-dom';
import { GUIDES } from '../guides/data';
import GuideService from '../guides/GuideService';
import GuideReception from '../guides/GuideReception';
import GuideAttaque from '../guides/GuideAttaque';
import GuideContre from '../guides/GuideContre';
import GuidePositionnement from '../guides/GuidePositionnement';

const COMPONENTS: Record<string, React.ComponentType> = {
  'service': GuideService,
  'reception': GuideReception,
  'attaque': GuideAttaque,
  'contre': GuideContre,
  'positionnement-defense': GuidePositionnement,
};

export default function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const guide = GUIDES.find(g => g.slug === slug);
  const Component = slug ? COMPONENTS[slug] : undefined;

  if (!guide || !Component) {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
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
