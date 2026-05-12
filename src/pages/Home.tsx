import { Link } from 'react-router-dom';
import { Head } from '../seo/Head';
import { buildBreadcrumb, buildWebSite } from '../seo/structuredData';

const FEATURES = [
  { label: '01', title: 'Techniques', desc: 'Animations 3D interactives des gestes fondamentaux du volleyball.', to: '/techniques', accent: 'var(--orange)' },
  { label: '02', title: 'Positions', desc: 'Rôles et responsabilités de chaque poste sur le terrain.', to: '/positions', accent: 'var(--teal)' },
  { label: '03', title: 'Guides', desc: 'Guides techniques et tactiques détaillés avec diagrammes.', to: '/guides', accent: 'var(--pink)' },
  { label: '04', title: 'Règles', desc: 'Règlement officiel FIVB simplifié et expliqué.', to: '/rules', accent: 'var(--yellow)' },
  { label: '05', title: 'Glossaire', desc: 'Vocabulaire technique complet du volleyball.', to: '/glossary', accent: 'var(--mint)' },
  { label: '06', title: 'Scénarios', desc: 'Séquences de jeu animées en 3D : attaque, défense, réception.', to: '/scenarios', accent: 'var(--plum)' },
];

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
      <Head
        title="Volley-Wiki — Guide du volley-ball indoor 6v6, 5v5 et 4v4"
        description="Wiki francophone du volley-ball indoor : positions, techniques, scénarios 3D, règles et glossaire. Adapté aux formats 6v6, 5v5 et 4v4."
        path="/"
        jsonLd={[
          buildWebSite(),
          buildBreadcrumb([{ name: 'Accueil', path: '/' }]),
        ]}
      />
      {/* Hero */}
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
          ★ DOCUMENTATION INTERACTIVE ★
        </div>
        <h1 style={{
          fontFamily: '"Bungee", sans-serif',
          fontSize: 'clamp(56px, 8vw, 96px)',
          lineHeight: 0.92,
          margin: '0 0 20px 0',
          letterSpacing: '-0.01em',
        }}>
          <span style={{ color: 'var(--orange)', textShadow: '4px 4px 0 var(--ink)' }}>VOLLEY</span>
          <br />
          <span style={{ color: 'var(--teal)', textShadow: '4px 4px 0 var(--ink)' }}>WIKI</span>
        </h1>
        <p style={{ fontSize: 17, maxWidth: 480, margin: '0 0 28px 0', color: 'var(--ink)', opacity: 0.75 }}>
          La référence technique du volleyball — techniques animées en 3D, règles, positions et glossaire.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/techniques" style={{
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
            VOIR LES TECHNIQUES
          </Link>
          <Link to="/rules" style={{
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
            LIRE LES RÈGLES
          </Link>
        </div>
      </section>

      {/* Section divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
        <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.2em', color: 'var(--orange)', whiteSpace: 'nowrap' }}>★ SECTIONS ★</span>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
      </div>

      {/* Feature cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {FEATURES.map(f => (
          <Link
            key={f.to}
            to={f.to}
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
              EXPLORER →
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
