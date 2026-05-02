import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Accueil', icon: '🏠' },
  { to: '/techniques', label: 'Techniques', icon: '🎯' },
  { to: '/positions', label: 'Positions', icon: '📍' },
  { to: '/scenarios', label: 'Scénarios', icon: '🎬' },
  { to: '/guides', label: 'Guides', icon: '📚' },
  { to: '/rules', label: 'Règles', icon: '📋' },
  { to: '/glossary', label: 'Glossaire', icon: '📖' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono flex flex-col">
      {/* Top bar */}
      <header className="border-b-2 border-yellow-400 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-yellow-400 text-2xl">🏐</span>
            <div>
              <div className="text-yellow-400 font-bold text-sm tracking-widest uppercase">Volley Wiki</div>
              <div className="text-gray-500 text-xs">Documentation officieuse du volleyball</div>
            </div>
          </Link>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const isActive = link.to === '/'
                ? location.pathname === '/'
                : location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 text-xs uppercase tracking-wider border transition-colors ${
                    isActive
                      ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                      : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          {/* Mobile hamburger */}
          <button className="md:hidden text-gray-400 text-xl" onClick={() => setMenuOpen(o => !o)}>☰</button>
        </div>
        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-gray-700 px-4 py-2 flex flex-col gap-1">
            {NAV_LINKS.map(link => {
              const isActive = link.to === '/'
                ? location.pathname === '/'
                : location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 text-xs uppercase tracking-wider ${
                    isActive ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                >
                  {link.icon} {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="border-t-2 border-gray-800 py-4 text-center text-gray-600 text-xs">
        Volley Wiki — Documentation non officielle du volleyball
      </footer>
    </div>
  );
}
