import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGS, LANG_LABELS, LANG_SHORT } from '../i18n';
import { useCurrentLang, swapLangInPath } from '../i18n/paths';
import DisciplineSwitcher from '../components/DisciplineSwitcher';
import { useDiscipline } from '../discipline/useDiscipline';

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

function LangSwitcher({ label }: { label: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const lang = useCurrentLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          height: 28,
          border: '2.5px solid var(--ink)',
          background: open ? 'var(--orange)' : 'var(--cream)',
          fontFamily: '"Bungee", sans-serif',
          fontSize: 11,
          letterSpacing: '0.08em',
          color: 'var(--ink)',
          cursor: 'pointer',
          boxShadow: open ? 'none' : '2px 2px 0 var(--ink)',
          transform: open ? 'translate(2px, 2px)' : 'none',
          transition: 'transform 0.08s, box-shadow 0.08s',
        }}
      >
        <span aria-hidden="true" style={{ fontSize: 12 }}>🌐</span>
        <span>{LANG_SHORT[lang]}</span>
        <span aria-hidden="true" style={{ fontSize: 9 }}>▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            margin: 0,
            padding: 4,
            listStyle: 'none',
            border: '2.5px solid var(--ink)',
            background: 'var(--cream)',
            boxShadow: '3px 3px 0 var(--ink)',
            minWidth: 160,
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {SUPPORTED_LANGS.map(l => {
            const active = l === lang;
            const href = `${swapLangInPath(location.pathname, l)}${location.search}${location.hash}`;
            return (
              <li key={l}>
                <Link
                  to={href}
                  replace
                  role="option"
                  aria-selected={active}
                  onClick={(e) => {
                    // Same-tab swap, close immediately for snappier UX.
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                    e.preventDefault();
                    navigate(href, { replace: true });
                    setOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '7px 10px',
                    textDecoration: 'none',
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 13,
                    color: active ? 'var(--cream)' : 'var(--ink)',
                    background: active ? 'var(--ink)' : 'transparent',
                  }}
                >
                  <span>{LANG_LABELS[l]}</span>
                  <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.6 }}>
                    {LANG_SHORT[l]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const { t } = useTranslation('common');
  const lang = useCurrentLang();
  const discipline = useDiscipline();
  const [menuOpen, setMenuOpen] = useState(false);

  // Nav links are discipline-aware: the same labels but pointing to either the
  // indoor or beach branch. /rules and /glossary stay on the unified URLs since
  // those pages mix both disciplines via stickers + filter.
  const beachPrefix = discipline === 'beach' ? '/beach' : '';
  const NAV_LINKS = [
    { to: `/${lang}${beachPrefix}`, label: t('nav.home') },
    { to: `/${lang}${beachPrefix}/positions`, label: t('nav.positions') },
    { to: `/${lang}${beachPrefix}/systems`, label: t('nav.systems') },
    { to: `/${lang}${beachPrefix}/scenarios`, label: t('nav.scenarios') },
    { to: `/${lang}${beachPrefix}/guides`, label: t('nav.guides') },
    { to: `/${lang}/rules`, label: t('nav.rules') },
    { to: `/${lang}/glossary`, label: t('nav.glossary') },
  ];

  // Scroll to top on every route change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location.pathname]);

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

  const homePath = `/${lang}${beachPrefix}`;
  const homePathRaw = `/${lang}`;
  const homePathBeach = `/${lang}/beach`;

  // Active matcher: on the home links we must avoid /:lang matching /:lang/beach
  // (and vice-versa), so we treat them as exact + trailing slash.
  const isActiveLink = (to: string) => {
    if (to === homePathRaw) {
      return location.pathname === homePathRaw || location.pathname === `${homePathRaw}/`;
    }
    if (to === homePathBeach) {
      return location.pathname === homePathBeach || location.pathname === `${homePathBeach}/`;
    }
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={STRIPE_STYLE} />

      <header style={{ background: 'var(--paper)', borderBottom: '3px solid var(--ink)', position: 'relative', zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <Link to={homePath} style={{ flexShrink: 0, textDecoration: 'none' }} aria-label={t('nav.home')}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--orange)', border: '3px solid var(--ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: 'rotate(-6deg)', boxShadow: 'var(--shadow-sm)',
              }}>
                <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 20, color: 'var(--ink)' }}>V</span>
              </div>
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <Link
                to={homePath}
                style={{
                  fontFamily: '"Bungee", sans-serif',
                  fontSize: 16,
                  letterSpacing: '0.06em',
                  color: 'var(--ink)',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                }}
              >
                VOLLEY·WIKI
              </Link>
              <DisciplineSwitcher size="sm" />
            </div>
          </div>

          <nav className="vw-nav-desktop" style={{ gap: 4, alignItems: 'center' }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontFamily: '"Bungee", sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  textDecoration: 'none',
                  transition: 'transform 0.08s, box-shadow 0.08s',
                  ...(isActiveLink(link.to) ? NAV_ACTIVE : NAV_IDLE),
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ marginLeft: 8 }}>
              <LangSwitcher label={t("language.label")} />
            </div>
          </nav>

          <div className="vw-nav-mobile" style={{ alignItems: 'center', gap: 10 }}>
            <LangSwitcher label={t("language.label")} />
            <button
              type="button"
              aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={menuOpen}
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
        </div>
      </header>

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label={t('nav.closeMenu')}
            className="vw-mobile-only"
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
          <nav
            className="vw-mobile-only"
            aria-label={t('nav.mainNavigation')}
            style={{
              position: 'fixed',
              left: 0, right: 0, top: 74,
              maxHeight: 'calc(100vh - 74px)',
              overflowY: 'auto',
              background: 'var(--cream)',
              borderTop: '3px solid var(--ink)',
              borderBottom: '3px solid var(--ink)',
              zIndex: 30,
              padding: 12,
              boxShadow: '0 4px 0 var(--ink)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 12, marginBottom: 8, borderBottom: '2px dashed rgba(26,24,18,0.18)' }}>
              <DisciplineSwitcher />
            </div>
            {NAV_LINKS.map(link => (
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
                  ...(isActiveLink(link.to)
                    ? { background: 'var(--orange)', border: '2px solid var(--ink)', color: 'var(--ink)', padding: '12px 14px', boxShadow: '2px 2px 0 var(--ink)' }
                    : { color: 'var(--ink)', border: '2px solid transparent', padding: '12px 14px' }),
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </>
      )}

      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '40px 24px' }}>
        <Outlet />
      </main>

      <div style={{ height: 6, background: 'repeating-linear-gradient(90deg, var(--ink) 0 10px, transparent 10px 20px)' }} />
      <footer style={{ background: 'var(--paper)', borderTop: '3px solid var(--ink)', padding: '16px 24px', textAlign: 'center' }}>
        <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink)', opacity: 0.6 }}>
          {t('footer.tagline')}
        </span>
      </footer>
    </div>
  );
}
