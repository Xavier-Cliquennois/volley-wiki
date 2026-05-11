import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/techniques', label: 'Techniques' },
  { to: '/positions', label: 'Positions' },
  { to: '/scenarios', label: 'Scénarios' },
  { to: '/guides', label: 'Guides' },
  { to: '/rules', label: 'Règles' },
  { to: '/glossary', label: 'Glossaire' },
];

const STRIPE_STYLE: React.CSSProperties = {
  height: 10,
  background: 'repeating-linear-gradient(90deg, var(--orange) 0 44px, var(--teal) 44px 88px, var(--pink) 88px 132px, var(--yellow) 132px 176px)',
};

const NAV_ACTIVE: React.CSSProperties = {
  background: 'var(--orange)',
  border: '2px solid var(--ink)',
  color: 'var(--ink)',
  boxShadow: '2px 2px 0 var(--ink)',
  transform: 'translate(-1px, -1px)',
  padding: '7px 14px',
};
const NAV_IDLE: React.CSSProperties = {
  border: 'none',
  padding: '9px 16px',
  color: 'var(--ink)',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Stripe banner */}
      <div style={STRIPE_STYLE} />

      {/* Header */}
      <header style={{ background: 'var(--paper)', borderBottom: '3px solid var(--ink)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'var(--orange)', border: '3px solid var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'rotate(-6deg)', boxShadow: 'var(--shadow-sm)', flexShrink: 0,
            }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 20, color: 'var(--ink)' }}>V</span>
            </div>
            <div>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, letterSpacing: '0.06em', color: 'var(--ink)', lineHeight: 1 }}>
                VOLLEY·WIKI
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.16em', color: 'var(--teal)', marginTop: 2 }}>
                TECHNIQUES · RÈGLES · TACTIQUES
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: 4 }} className="hidden md:flex">
            {NAV_LINKS.map(link => {
              const isActive = link.to === '/'
                ? location.pathname === '/'
                : location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    fontFamily: '"Bungee", sans-serif',
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    textDecoration: 'none',
                    transition: 'transform 0.08s, box-shadow 0.08s',
                    ...(isActive ? NAV_ACTIVE : NAV_IDLE),
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile burger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(o => !o)}
            style={{
              width: 38, height: 38,
              border: '3px solid var(--ink)',
              background: menuOpen ? 'var(--orange)' : 'var(--cream)',
              fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ☰
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav style={{ borderTop: '3px solid var(--ink)', background: 'var(--cream)', padding: '8px' }} className="md:hidden">
            {NAV_LINKS.map(link => {
              const isActive = link.to === '/'
                ? location.pathname === '/'
                : location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '10px 12px',
                    fontFamily: '"Bungee", sans-serif',
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    textDecoration: 'none',
                    marginBottom: 4,
                    ...(isActive ? { background: 'var(--orange)', border: '2px solid var(--ink)', color: 'var(--ink)', padding: '10px 12px' } : { color: 'var(--ink)', border: 'none', padding: '12px 14px' }),
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 24px' }}>
        {children}
      </main>

      {/* Footer */}
      <div style={{ height: 6, background: 'repeating-linear-gradient(90deg, var(--ink) 0 10px, transparent 10px 20px)' }} />
      <footer style={{ background: 'var(--paper)', borderTop: '3px solid var(--ink)', padding: '16px 24px', textAlign: 'center' }}>
        <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink)', opacity: 0.6 }}>
          VOLLEY·WIKI — TECHNIQUES · RÈGLES · TACTIQUES
        </span>
      </footer>
    </div>
  );
}
