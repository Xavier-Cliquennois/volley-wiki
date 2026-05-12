import { Link } from 'react-router-dom';
import { GUIDES } from '../guides/data';
import { Head } from '../seo/Head';
import { buildBreadcrumb } from '../seo/structuredData';

export default function Guides() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <Head
        title="Guides techniques et tactiques du volley-ball | Volley-Wiki"
        description="Guides complets sur le service, la réception, l'attaque, le contre et le positionnement défensif au volley-ball. Diagrammes, vidéos et conseils par niveau."
        path="/guides"
        jsonLd={buildBreadcrumb([
          { name: 'Accueil', path: '/' },
          { name: 'Guides', path: '/guides' },
        ])}
      />
      {/* Header */}
      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          ★ DOCUMENTATION
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          GUIDES
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.7 }}>
          Guides techniques et tactiques détaillés pour progresser au volleyball.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {GUIDES.map((guide, idx) => (
          <Link
            key={guide.slug}
            to={`/guides/${guide.slug}`}
            style={{
              display: 'block',
              border: '3px solid var(--ink)',
              background: 'var(--cream)',
              boxShadow: 'var(--shadow)',
              padding: '20px 24px',
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
            {/* Ticket number */}
            <div style={{
              position: 'absolute', top: -10, right: 14,
              padding: '2px 10px',
              background: 'var(--cream)',
              border: '2.5px solid var(--ink)',
              fontFamily: '"Bungee", sans-serif',
              fontSize: 10,
              letterSpacing: '0.1em',
            }}>
              N° {String(idx + 1).padStart(2, '0')}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '2px 10px',
                  border: '2.5px solid var(--ink)',
                  background: 'var(--teal)',
                  fontFamily: '"Bungee", sans-serif',
                  fontSize: 9,
                  letterSpacing: '0.1em',
                  color: 'var(--cream)',
                }}>
                  {guide.category.toUpperCase()}
                </span>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.6 }}>{guide.level}</span>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.4 }}>·</span>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.6 }}>{guide.readingTime}</span>
              </div>

              <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 18, margin: 0, letterSpacing: '0.03em' }}>
                {guide.title}
              </h2>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>{guide.subtitle}</p>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.55, lineHeight: 1.4 }}>{guide.description}</p>

              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'var(--orange)', marginTop: 4 }}>
                LIRE →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
