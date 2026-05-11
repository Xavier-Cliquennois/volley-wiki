import React, { useEffect, useState } from 'react';
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

  // Close the mobile menu when the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile menu overlay is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [menuOpen]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Stripe banner */}
      <div style={STRIPE_STYLE} />

      {/* Header */}
      <header style={{ background: 'var(--paper)', borderBottom: '3px solid var(--ink)', position: 'relative', zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, gap: 16 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', minWidth: 0 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'var(--orange)', border: '3px solid var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'rotate(-6deg)', boxShadow: 'var(--shadow-sm)', flexShrink: 0,
            }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 20, color: 'var(--ink)' }}>V</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, letterSpacing: '0.06em', color: 'var(--ink)', lineHeight: 1, whiteSpace: 'nowrap' }}>
                VOLLEY·WIKI
              </div>
              <div className="hidden sm:block" style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.16em', color: 'var(--teal)', marginTop: 2, whiteSpace: 'nowrap' }}>
                TECHNIQUES · RÈGLES · TACTIQUES
              </div>
            </div>
          </Link>

          {/* Desktop nav — bumped from md to lg so tablets get the hamburger too */}
          <nav className="hidden lg:flex" style={{ gap: 4 }}>
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

          {/* Mobile burger — visible below lg */}
          <button
            type="button"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            className="lg:hidden"
            onClick={() => setMenuOpen(o => !o)}
            style={{
              width: 42, height: 42,
              border: '3px solid var(--ink)',
              background: menuOpen ? 'var(--orange)' : 'var(--cream)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: menuOpen ? 'none' : '2px 2px 0 var(--ink)',
              transform: menuOpen ? 'translate(2px, 2px)' : 'none',
              transition: 'transform 0.08s, box-shadow 0.08s',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="square">
              {menuOpen ? (
                <>
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile / tablet overlay menu */}
      {menuOpen && (
        <>
          {/* Backdrop — click to close */}
          <button
            type="button"
            aria-label="Fermer le menu"
            className="lg:hidden"
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              left: 0, right: 0, top: 74, bottom: 0,
              background: 'rgba(26, 24, 18, 0.5)',
              backdropFilter: 'blur(2px)',
              zIndex: 30,
              border: 'none',
              cursor: 'pointer',
            }}
          />
          {/* Drawer */}
          <nav
            className="lg:hidden"
            aria-label="Navigation principale"
            style={{
              position: 'fixed',
              left: 0, right: 0, top: 74,
              maxHeight: 'calc(100vh - 74px)',
              overflowY: 'auto',
              background: 'var(--cream)',
              borderTop: '3px solid var(--ink)',
              borderBottom: '3px solid var(--ink)',
              zIndex: 30,
              padding: 8,
              boxShadow: '0 4px 0 var(--ink)',
            }}
          >
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
                    fontFamily: '"Bungee", sans-serif',
                    fontSize: 13,
                    letterSpacing: '0.06em',
                    textDecoration: 'none',
                    marginBottom: 6,
                    ...(isActive
                      ? { background: 'var(--orange)', border: '2px solid var(--ink)', color: 'var(--ink)', padding: '12px 14px', boxShadow: '2px 2px 0 var(--ink)' }
                      : { color: 'var(--ink)', border: '2px solid transparent', padding: '12px 14px' }),
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </>
      )}

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
