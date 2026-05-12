import { Link } from 'react-router-dom';
import { Head } from '../seo/Head';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 32 }}>
      <Head
        title="Page introuvable | Volley-Wiki"
        description="Cette page n'existe pas. Retournez à l'accueil pour explorer le wiki du volley-ball."
        path="/404"
        noindex
      />
      <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)' }}>
        ★ ERREUR 404
      </div>
      <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(36px, 6vw, 64px)', margin: 0, letterSpacing: '0.03em' }}>
        PAGE INTROUVABLE
      </h1>
      <p style={{ margin: 0, fontSize: 16, opacity: 0.7, maxWidth: 600 }}>
        La page que vous cherchez n'existe pas ou a été déplacée. Revenez à l'accueil pour explorer le wiki.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
        <Link
          to="/"
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
          ← ACCUEIL
        </Link>
        <Link
          to="/guides"
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
          GUIDES
        </Link>
      </div>
    </div>
  );
}
