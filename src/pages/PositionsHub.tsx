import { Link } from 'react-router-dom';
import { Head } from '../seo/Head';
import { TEAM_SIZES, type TeamSizeSlug } from '../seo/constants';
import { buildBreadcrumb, buildWebSite } from '../seo/structuredData';

const FORMAT_CARDS: Record<TeamSizeSlug, { tagline: string; description: string; color: string }> = {
  '6v6': {
    tagline: 'Format officiel FIVB / FFVolley',
    description:
      '6 joueurs + libéro, terrain 9×18 m, filet 2,43 m. Systèmes 5-1, 4-2, 6-2 avec rotation horaire.',
    color: 'var(--orange)',
  },
  '5v5': {
    tagline: 'Format hybride pédagogique',
    description:
      'Transition entre 4v4 et 6v6. Sans libéro. Configurations Pentagone, 3F/2B, 2F/3B selon le placement choisi.',
    color: 'var(--teal)',
  },
  '4v4': {
    tagline: 'Loisir, intramurals, transition',
    description:
      'Terrain réduit, 2 avants + 2 arrières. Formations Losange, Carré (Box), Ligne 3-1 avec passeur pénétrant.',
    color: 'var(--pink)',
  },
};

export default function PositionsHub() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Head
        title="Positions au volley-ball — 6v6, 5v5, 4v4 | Volley-Wiki"
        description="Découvrez les positions et rôles au volley-ball indoor pour chaque format de jeu : 6 contre 6, 5 contre 5 et 4 contre 4. Systèmes tactiques détaillés."
        path="/positions"
        jsonLd={[
          buildWebSite(),
          buildBreadcrumb([
            { name: 'Accueil', path: '/' },
            { name: 'Positions', path: '/positions' },
          ]),
        ]}
      />

      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          ★ DOCUMENTATION
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          POSITIONS & RÔLES
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.75, maxWidth: 720, lineHeight: 1.6 }}>
          Au volley-ball indoor, les positions sont numérotées <strong>P1 à P6</strong> dans le sens antihoraire vu depuis l'arrière de son camp. La rotation se fait dans le sens horaire à chaque side-out. Selon le format de jeu, le nombre de joueurs et les systèmes tactiques diffèrent — choisissez le format qui correspond à votre pratique.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {TEAM_SIZES.map((size) => {
          const meta = FORMAT_CARDS[size];
          return (
            <Link
              key={size}
              to={`/positions/${size}`}
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
                  background: meta.color,
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
                {meta.tagline}
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{meta.description}</p>
              <div style={{ marginTop: 4, fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.08em', color: 'var(--orange)' }}>
                EXPLORER →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
